# VIB's part of scripts/check-local.sh: what CI runs here and nowhere else.
# Sourced by check-local.sh; the functions run from the folder named in each comment.

# Names the frontend copy's cache folder.
PROJECT_SLUG=vib
# CI's Python (ci.yml), for .venv.
PYTHON_VERSION=3.13

LINT_STEPS="Ruff, Prettier"
BACKEND_STEPS="system checks, migrations, OpenAPI schema, tests"
FRONTEND_STEPS="typecheck, ESLint"

# After format-all.sh --check, from the repo root. VIB's lint job has nothing more.
project_lint() {
    true
}

# CI's environment (.github/workflows/ci.yml, test-backend), with the dev server's login.
# check-local.sh sets TEST_DB, DB_USER, DB_PASSWORD and DB_PORT.
project_backend_env() {
    BACKEND_ENV=(
        SECRET_KEY=test-secret-key-not-for-production
        ENVIRONMENT=local
        POSTGRES_NAME="$TEST_DB"
        POSTGRES_USER="$DB_USER"
        POSTGRES_PASSWORD="$DB_PASSWORD"
        POSTGRES_HOST=localhost
        POSTGRES_PORT="$DB_PORT"
    )
}

# From backend/, in that environment only. $PY is the .venv's Python.
project_backend_checks() {
    "$PY" manage.py check
    "$PY" manage.py makemigrations --check --dry-run
    "$PY" manage.py spectacular --file /dev/null --validate --fail-on-warn
    "$PY" manage.py test --noinput --parallel --keepdb
}

# From the frontend copy. VIB has no frontend tests yet.
project_frontend_checks() {
    npm run typecheck && npm run lint
}

project_frontend_build() {
    npm run build
}
