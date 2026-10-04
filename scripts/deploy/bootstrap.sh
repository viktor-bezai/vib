# shellcheck shell=bash
# Runs on the server, read from the SSH session's stdin after the exported variables (remote.sh).
# Checks out the release, then starts deploy.sh from that same commit and streams its log.
# All in one function, so bash has read the whole script before any command can touch stdin.
set -euo pipefail

start_deploy() {
    cd /home/deploy/vib
    # The lock from lib.sh, taken before the checkout so a manual rollback cannot run in between.
    mkdir -p .deploy
    exec 9>.deploy/lock
    # A cancelled run leaves its detached deploy.sh running, so wait for it instead of failing at once.
    if ! flock -n 9; then
        printf 'Waiting for the running deploy or rollback to finish (up to 10 minutes)...\n'
        flock -w 600 9 || {
            printf '::error::Another deploy or rollback is still running after 10 minutes.\n' >&2
            exit 1
        }
    fi
    local previous_commit
    previous_commit=$(git rev-parse HEAD)
    git fetch --quiet origin master
    # Older commits deploy with the old build-on-the-server flow, which this one replaced.
    git cat-file -e "$DEPLOY_SHA:scripts/deploy/deploy.sh" 2>/dev/null || {
        printf '::error::%s has no scripts/deploy/deploy.sh, so it is older than the GHCR deploy. Use scripts/deploy/rollback.sh.\n' "$DEPLOY_SHA" >&2
        exit 1
    }
    git -c advice.detachedHead=false checkout --quiet --force --detach "$DEPLOY_SHA"

    # Detached into its own session and writing to a file, so a dropped SSH connection or a
    # cancelled job never stops a deploy halfway. This session only follows the log.
    # deploy.sh inherits fd 9 and keeps holding the same lock (take_lock in lib.sh).
    local log=".deploy/deploy-$DEPLOY_SHA.log" pid
    # Root only, like the rest of .deploy.
    install -m 600 /dev/null "$log"
    setsid --wait bash scripts/deploy/deploy.sh "$DEPLOY_SHA" "$previous_commit" </dev/null >"$log" 2>&1 &
    pid=$!
    tail -n +1 -f --pid="$pid" "$log"
    wait "$pid"
}

start_deploy
