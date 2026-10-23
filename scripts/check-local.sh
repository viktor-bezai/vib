#!/bin/bash

# Run the checks CI runs on release PRs, here, before opening a PR into preview.
# Feature PRs into preview only run the lint job on GitHub, to save Actions minutes.
#
# Usage:
#   ./scripts/check-local.sh             # lint + backend + frontend (no build)
#   ./scripts/check-local.sh --build     # also the production frontend build
#   ./scripts/check-local.sh backend     # one side only: lint, backend or frontend
#
# This file is shared, word for word, by EnvolPrep, VIB and Egypt. What differs per project (the
# extra lint checks, CI's backend environment and commands, the frontend steps) lives in
# scripts/project.sh. That file only sets variables and defines functions: it is read twice, by
# this script and by the clean shell the backend checks run in.
#
# Runs on this machine, not in containers: Docker's file sharing on macOS made a run 3-5x slower.
# Backend and frontend run at the same time.
# - Backend: the tests run from .venv (kept in step with backend/requirements-dev.txt) with CI's
#   environment, on the dev Postgres server. Each checkout gets its own test databases, so the
#   dev DB is safe and two worktrees can run at once. They are kept between runs (--keepdb) and
#   built again whenever a migration file changes, as their name carries a hash of every migration.
# - Frontend: runs on a copy of frontend/ with its own `npm ci`. The frontend/node_modules folder
#   belongs to the Linux dev container and can be out of date with the lockfile, which once hid a
#   broken import (viktor-bezai/EnvolPrep#902). The copy keeps its install until the lockfile
#   changes, and keeps a build from overwriting the dev server's .next and generated files.
#
# The Mac's file system ignores letter case and Linux does not, so a wrong-case import can pass
# here; the release PR's CI still catches it.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
PROJECT_FILE="$SCRIPT_DIR/project.sh"
COMPOSE_FILE="$PROJECT_ROOT/docker/docker-compose.yml"
VENV_PYTHON="$PROJECT_ROOT/.venv/bin/python"
CHECKOUT_ID="$(echo -n "$PROJECT_ROOT" | shasum -a 256 | cut -c1-8)"
# --keepdb keeps each worker's copy as it is, so a migration change must give new databases.
MIGRATIONS_ID="$(find "$PROJECT_ROOT/backend" -path '*/migrations/*.py' -print0 | sort -z | xargs -0 shasum | shasum | cut -c1-8)"
# Django adds test_ and, for each parallel worker, a number.
CHECKOUT_DB_PREFIX="check_local_${CHECKOUT_ID}_"
CHECKOUT_DB="$CHECKOUT_DB_PREFIX$MIGRATIONS_ID"
LOG_DIR="$(mktemp -d)"
trap 'rm -rf "$LOG_DIR"' EXIT

# shellcheck source=/dev/null
source "$PROJECT_FILE"
FRONTEND_COPY="${XDG_CACHE_HOME:-$HOME/.cache}/$PROJECT_SLUG-check-local/frontend-$CHECKOUT_ID"

BUILD=false
SIDES=()
for arg in "$@"; do
    case $arg in
        --build) BUILD=true ;;
        lint | backend | frontend) SIDES+=("$arg") ;;
        *) echo "Unknown argument: $arg" >&2; exit 2 ;;
    esac
done
[[ ${#SIDES[@]} -eq 0 ]] && SIDES=(lint backend frontend)

check_lint() {
    "$PROJECT_ROOT/scripts/format-all.sh" --check && (cd "$PROJECT_ROOT" && project_lint)
}

check_backend() {
    if [[ ! -x "$VENV_PYTHON" ]]; then
        echo "No .venv. Create it: uv venv .venv --python $PYTHON_VERSION && uv pip sync backend/requirements-dev.txt --python .venv/bin/python"
        return 1
    fi
    # The tests create their own databases on the dev Postgres server.
    docker compose -f "$COMPOSE_FILE" up -d --wait db >/dev/null && drop_old_test_databases || return 1
    local db_user db_password db_port
    db_user="$(db_env POSTGRES_USER)" && db_password="$(db_env POSTGRES_PASSWORD)" && db_port="$(db_host_port)" || return 1
    # CI's environment (project_backend_env), with the dev server's login, and nothing else from
    # this shell. The project's commands run in a clean bash that reads the project file again.
    (
        cd "$PROJECT_ROOT/backend" || exit 1
        TEST_DB="$CHECKOUT_DB" DB_USER="$db_user" DB_PASSWORD="$db_password" DB_PORT="$db_port" project_backend_env || exit 1
        env -i PATH="$PATH" HOME="$HOME" PY="$VENV_PYTHON" PROJECT_ROOT="$PROJECT_ROOT" "${BACKEND_ENV[@]}" \
            bash --noprofile --norc -c 'set -euo pipefail; source "$1"; project_backend_checks' _ "$PROJECT_FILE"
    )
}

# The dev database's login, read from its container, so it lives only in the compose file or .env.
db_env() {
    docker compose -f "$COMPOSE_FILE" exec -T db printenv "$1"
}

# The host port the dev Postgres is published on, read from Docker so it lives only in the compose file.
db_host_port() {
    docker compose -f "$COMPOSE_FILE" port db 5432 | sed 's/.*://'
}

drop_old_test_databases() {
    local psql=(docker compose -f "$COMPOSE_FILE" exec -T db sh -c 'psql -U "$POSTGRES_USER" -d postgres -Atq "$@"' _)
    local old
    # starts_with, not LIKE: in LIKE "_" matches any character, and these databases get dropped.
    old="$("${psql[@]}" -c "SELECT datname FROM pg_database WHERE starts_with(datname, 'test_${CHECKOUT_DB_PREFIX}') \
        AND NOT starts_with(datname, 'test_${CHECKOUT_DB}')")" || return 1
    for name in $old; do
        "${psql[@]}" -c "DROP DATABASE \"$name\"" || return 1
    done
}

check_frontend() {
    local lock_hash
    lock_hash="$(shasum -a 256 "$PROJECT_ROOT/frontend/package-lock.json" | cut -c1-64)"
    # set -e is off here (the caller tests the result), so every step is chained with &&.
    # Excluded paths are never deleted, so the copy's own install and build stay.
    mkdir -p "$FRONTEND_COPY" \
        && rsync -a --delete --exclude=/node_modules --exclude=/.next "$PROJECT_ROOT/frontend/" "$FRONTEND_COPY/" \
        && cd "$FRONTEND_COPY" \
        && install_if_lock_changed "$lock_hash" \
        && project_frontend_checks && { ! $BUILD || project_frontend_build; }
}

install_if_lock_changed() {
    # The marker is written last, so an install cut short runs again next time.
    [[ "$(cat node_modules/.check-local-lock 2>/dev/null)" == "$1" ]] && return 0
    npm ci --no-audit --no-fund --loglevel=error && echo "$1" >node_modules/.check-local-lock
}

step_name() {
    case $1 in
        lint) echo "Lint ($LINT_STEPS)" ;;
        backend) echo "Backend ($BACKEND_STEPS)" ;;
        frontend) echo "Frontend ($FRONTEND_STEPS$($BUILD && echo ', build'))" ;;
    esac
}

# Each side writes to its own log, printed whole when it ends, so parallel output never mixes.
PIDS=()
for side in "${SIDES[@]}"; do
    echo "Started: $(step_name "$side")"
    (
        SECONDS=0 status=0
        "check_$side" >"$LOG_DIR/$side.log" 2>&1 || status=$?
        echo "$SECONDS" >"$LOG_DIR/$side.seconds"
        exit $status
    ) &
    PIDS+=($!)
done

FAILED=()
for i in "${!SIDES[@]}"; do
    side=${SIDES[$i]}
    status=0
    wait "${PIDS[$i]}" || status=$?
    echo ""
    echo "==> $(step_name "$side")"
    cat "$LOG_DIR/$side.log"
    if [[ $status -eq 0 ]]; then
        echo "OK: $(step_name "$side") ($(cat "$LOG_DIR/$side.seconds")s)"
    else
        echo "FAILED: $(step_name "$side") ($(cat "$LOG_DIR/$side.seconds")s)"
        FAILED+=("$(step_name "$side")")
    fi
done

echo ""
if [[ ${#FAILED[@]} -gt 0 ]]; then
    echo "Failed: ${FAILED[*]}"
    exit 1
fi
echo "All checks passed."
