#!/usr/bin/env bash
# Runs on the GitHub runner: opens one SSH session to the server and starts the deploy there.
#
# The variables below travel on the session's stdin, followed by bootstrap.sh, so no secret ever
# sits in a command line on either machine. Plain OpenSSH, so no third-party action sees the key.
#
# Needs DROPLET_HOST, DROPLET_USER, DROPLET_SSH_KEY, DROPLET_SSH_KNOWN_HOSTS and DEPLOY_SHA;
# DROPLET_PORT is optional.
set -euo pipefail

readonly SCRIPT_DIR=${BASH_SOURCE[0]%/*}

# What deploy.sh needs on the server: the release, the registry login and the values for .env.
readonly FORWARDED_VARIABLES=(
    DEPLOY_SHA GHCR_USER GHCR_TOKEN
    SECRET_KEY
    POSTGRES_NAME POSTGRES_HOST POSTGRES_USER POSTGRES_PASSWORD POSTGRES_PORT
    NEXT_PUBLIC_API_BASE_URL
)

ssh_dir=""
readonly HOST_KEY_ALIAS=vib-droplet

main() {
    : "${DROPLET_HOST:?}" "${DROPLET_USER:?}" "${DROPLET_SSH_KEY:?}" "${DEPLOY_SHA:?}"
    # The secrets go only to the machine whose host key we already know. No trust on first use.
    if [[ -z ${DROPLET_SSH_KNOWN_HOSTS:-} ]]; then
        printf '::error::DROPLET_SSH_KNOWN_HOSTS is not set, so the server cannot be verified. See server-configs/DEPLOY.md.\n'
        exit 1
    fi
    ssh_dir=$(mktemp -d)
    trap 'rm -rf "$ssh_dir"' EXIT
    (umask 077 && printf '%s\n' "$DROPLET_SSH_KEY" >"$ssh_dir/key")
    # Keys are matched under a fixed alias, so the secret does not have to repeat DROPLET_HOST's exact spelling.
    printf '%s\n' "$DROPLET_SSH_KNOWN_HOSTS" |
        awk -v alias="$HOST_KEY_ALIAS" 'NF >= 3 && $1 !~ /^#/ { $1 = alias; print }' >"$ssh_dir/known_hosts"
    if [[ ! -s $ssh_dir/known_hosts ]]; then
        printf '::error::DROPLET_SSH_KNOWN_HOSTS holds no host key lines. See server-configs/DEPLOY.md.\n'
        exit 1
    fi

    remote_payload | ssh \
        -i "$ssh_dir/key" \
        -p "${DROPLET_PORT:-22}" \
        -o BatchMode=yes \
        -o IdentitiesOnly=yes \
        -o StrictHostKeyChecking=yes \
        -o HostKeyAlias="$HOST_KEY_ALIAS" \
        -o UserKnownHostsFile="$ssh_dir/known_hosts" \
        -o GlobalKnownHostsFile=/dev/null \
        -o ConnectTimeout=30 \
        -o ServerAliveInterval=30 \
        -o ServerAliveCountMax=4 \
        "$DROPLET_USER@$DROPLET_HOST" 'bash -s'
}

# The `export` lines, then bootstrap.sh. %q quotes each value for the remote bash.
remote_payload() {
    local name
    for name in "${FORWARDED_VARIABLES[@]}"; do
        printf 'export %s=%q\n' "$name" "${!name-}"
    done
    cat "$SCRIPT_DIR/bootstrap.sh"
}

main "$@"
