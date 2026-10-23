#!/usr/bin/env bash
#
# Checks that the local dev stack can test every feature, and says how to fix what it cannot.
#
# This file is shared, word for word, by EnvolPrep, VIB and Egypt. The project's own checks (and
# its service and page names) live in scripts/project.sh.
#
# Read-only: it changes nothing and spends nothing. Exits non-zero when a check fails. Warnings
# do not fail it.
#
# Usage: ./scripts/dev/doctor.sh
set -uo pipefail

PROJECT_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
COMPOSE=(docker compose -f "$PROJECT_ROOT/docker/docker-compose.yml")
FAILED=0

ok() { echo "  OK    $1"; }
warn() { echo "  WARN  $1"; echo "        -> $2"; }
fail() { echo "  FAIL  $1"; echo "        -> $2"; FAILED=1; }

# shellcheck source=/dev/null
source "$PROJECT_ROOT/scripts/project.sh"

backend() { "${COMPOSE[@]}" exec -T "$DEV_BACKEND_SERVICE" "$@" 2>/dev/null; }

echo "Services"
expected=$("${COMPOSE[@]}" config --services | sort)
running=$("${COMPOSE[@]}" ps --status running --services | sort)
down=$(comm -23 <(echo "$expected") <(echo "$running"))
if [[ -z "$down" ]]; then
    ok "all $(echo "$expected" | wc -l | tr -d ' ') services running"
else
    fail "not running: $(echo $down)" "cd docker && docker compose up -d"
    # The rest needs the backend.
    grep -qx "$DEV_BACKEND_SERVICE" <<<"$down" && exit 1
fi

echo "Site"
for url in "$DEV_SITE_URL" "$DEV_API_URL"; do
    body=$(curl -s --max-time 30 -w "\n%{http_code}" "$url")
    code=${body##*$'\n'}
    # The page must load. The API only has to answer: a 401 or 404 still means the backend is up.
    if [[ "$url" == "$DEV_SITE_URL" ]]; then answered=$([[ "$code" == 200 ]] && echo 1); else answered=$((code > 0 && code < 500)); fi
    # A proxy can answer 200 with a "Service Starting" page while the app behind it is down.
    if [[ "$answered" == 1 && "$body" != *"<title>Service Starting</title>"* ]]; then
        ok "$url answers"
    else
        fail "$url does not answer (status $code)" "cd docker && docker compose logs"
    fi
done

echo "Database"
if backend python manage.py migrate --check >/dev/null; then
    ok "all migrations applied"
else
    fail "migrations not applied" "cd docker && docker compose exec $DEV_BACKEND_SERVICE python manage.py migrate"
fi

echo "Python venv"
# check-local.sh and format-all.sh run from .venv: both need the lockfile's versions.
venv_python="$PROJECT_ROOT/.venv/bin/python"
venv_fix="uv pip sync backend/requirements-dev.txt --python .venv/bin/python"
if ! command -v uv >/dev/null; then
    fail "uv is not installed" "curl -LsSf https://astral.sh/uv/install.sh | sh"
elif [[ ! -x "$venv_python" ]]; then
    fail "no .venv" "uv venv .venv --python $PYTHON_VERSION && $venv_fix"
elif [[ "$("$venv_python" -c 'import sys; print(f"{sys.version_info[0]}.{sys.version_info[1]}")')" != "$PYTHON_VERSION" ]]; then
    fail ".venv runs another Python than CI ($PYTHON_VERSION)" "rm -rf .venv && uv venv .venv --python $PYTHON_VERSION && $venv_fix"
elif uv pip sync "$PROJECT_ROOT/backend/requirements-dev.txt" --python "$venv_python" --dry-run 2>&1 | grep -q "Would make no changes"; then
    ok ".venv matches backend/requirements-dev.txt"
else
    fail ".venv is out of date with backend/requirements-dev.txt" "$venv_fix"
fi

doctor_project

echo
if [[ $FAILED == 0 ]]; then echo "Local stack is ready."; else echo "Fix the FAIL lines above."; fi
exit $FAILED
