#!/usr/bin/env bash
# Runs a command in the live backend container on the server. scripts/project.sh says which
# container that is (EnvolPrep's changes with every blue-green deploy), so use this instead of
# naming it.
#
# This file is shared, word for word, by EnvolPrep, VIB and Egypt.
#
# Usage, from your laptop (the project folder on the server, e.g. /home/deploy/envolprep):
#   ssh root@174.138.113.224 <project folder>/scripts/prod/exec-backend.sh python manage.py shell
#   ssh -t root@174.138.113.224 <project folder>/scripts/prod/exec-backend.sh python manage.py shell   # interactive
#   ssh root@174.138.113.224 <project folder>/scripts/prod/exec-backend.sh python manage.py shell < script.py
#
# Sentry is off for the command, so a typo in an ad-hoc query never files an issue.
set -euo pipefail

PROJECT_ROOT=$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)
readonly PROJECT_ROOT

(($# > 0)) || {
    echo "Usage: exec-backend.sh <command> [args...]" >&2
    exit 1
}

# shellcheck source=/dev/null
source "$PROJECT_ROOT/scripts/project.sh"

container=$(prod_backend_container)
flags=(-i -e SENTRY_DSN=)
# A terminal on both ends: an interactive shell gets line editing.
if [[ -t 0 && -t 1 ]]; then flags+=(-t); fi
exec docker exec "${flags[@]}" "$container" "$@"
