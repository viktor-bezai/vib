#!/usr/bin/env bash
# Python and Node must be the same version everywhere one is named: .venv (scripts/project.sh),
# CI and the Dockerfiles. Dependabot bumps a Dockerfile on its own, and a mismatch means CI tests
# on another version than production runs.
#
# Shared word for word by EnvolPrep, VIB and Egypt (scripts/sync-shared.sh). Runs in CI's lint
# job and in check-local.sh.
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/.."
# shellcheck source=/dev/null
source scripts/project.sh

# One "<file>:<version>" line per place that names the version. No match is not an error here.
python_versions() {
    echo "scripts/project.sh:$PYTHON_VERSION"
    grep -sHoE 'python-version: "?[0-9.]+' .github/workflows/*.yml | sed -E 's/python-version: "?//' || true
    grep -sHoE '^FROM python:[0-9.]+' backend/Dockerfile* | sed 's/FROM python://' || true
}

node_versions() {
    grep -sHoE 'node-version: "?[0-9]+' .github/workflows/*.yml | sed -E 's/node-version: "?//' || true
    grep -sHoE '^FROM node:[0-9]+' frontend/Dockerfile* | sed 's/FROM node://' || true
}

# Fails when the places disagree, and lists them all so the odd one out is easy to see.
# Versions compare as written, so every place must pin the same way (Python 3.13, Node 24).
check() {
    local name=$1 places count
    places=$("${name}_versions" | sort -u)
    if [[ -z $places ]]; then
        echo "FAIL  no file names a $name version"
        return 1
    fi
    count=$(cut -d: -f2 <<<"$places" | sort -u | wc -l)
    if ((count == 1)); then
        echo "OK    $name $(head -1 <<<"$places" | cut -d: -f2) everywhere"
        return 0
    fi
    echo "FAIL  $name versions differ:"
    sed 's/^/        /' <<<"$places"
    return 1
}

status=0
check python || status=1
check node || status=1
exit $status
