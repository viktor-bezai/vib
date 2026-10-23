# What is VIB's own in the shared scripts: check-local.sh, dev/doctor.sh and prod/exec-backend.sh.
# Those three are the same file in EnvolPrep, VIB and Egypt.
# Only variables and functions here: the file is read more than once.

# Names the frontend copy's cache folder.
PROJECT_SLUG=vib
# CI's Python (ci.yml), for .venv.
PYTHON_VERSION=3.13

# --- check-local.sh ---------------------------------------------------------------------------

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
        DJANGO_SETTINGS_MODULE=config.settings.local
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

# --- dev/doctor.sh ----------------------------------------------------------------------------

# The dev backend's Compose service, and the pages that must answer (docker/docker-compose.yml).
DEV_BACKEND_SERVICE=vib-backend
DEV_SITE_URL=http://localhost:3200/
DEV_API_URL=http://localhost:8200/api/health/

# VIB needs no checks beyond the shared ones.
doctor_project() {
    true
}

# --- prod/exec-backend.sh ---------------------------------------------------------------------

prod_backend_container() {
    echo vib-backend
}
