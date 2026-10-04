#!/usr/bin/env bash
# Deploys one release: a commit on master whose images are in GHCR.
#
# Order: pull both images (a failure here leaves the site untouched), nginx config, .env, then
# migrate and collectstatic in a one-off container while the old release still serves. Then the
# backend and the frontend are replaced in turn, each gated on its health. If either fails,
# both go back to the previous release. See server-configs/DEPLOY.md.
#
# Usage: deploy.sh <release sha> [<commit checked out before this deploy>]
# bootstrap.sh starts it on the server, with GHCR_USER, GHCR_TOKEN (the job's own short-lived
# token) and the app secrets in the environment.
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
readonly SCRIPT_DIR
# shellcheck source=scripts/deploy/lib.sh
source "$SCRIPT_DIR/lib.sh"

readonly NGINX_SITE=/etc/nginx/sites-available/viktorbezai.com
# The app settings that go into .env. ENVIRONMENT and VIB_RELEASE are added on top.
readonly ENV_VARIABLES=(
    SECRET_KEY
    POSTGRES_NAME POSTGRES_HOST POSTGRES_USER POSTGRES_PASSWORD POSTGRES_PORT
    NEXT_PUBLIC_API_BASE_URL
)

release=""
previous_commit=""
# The release live before this deploy, and the one a failure goes back to.
previous=""
registry_config=""
# The image each service ran before this deploy, by ID: a rebuild moves the tag to the new image.
declare -A previous_images=()
# What the exit handler must undo: see on_exit.
stage=prepare

main() {
    (($# >= 1 && $# <= 2)) || die "Usage: deploy.sh <release sha> [<previous commit>]"
    release=$1
    previous_commit=${2:-}
    [[ $release =~ ^[0-9a-f]{40}$ ]] || die "Not a full commit SHA: $release"
    cd "$PROJECT_DIR"
    take_lock

    trap on_exit EXIT
    # bootstrap.sh detaches this script from the SSH session, so a lost session changes nothing here.
    trap '' HUP PIPE
    # A kill becomes a normal exit, so the exit handler still runs.
    trap 'exit 130' INT
    trap 'exit 143' TERM

    phase "Check $release"
    docker compose version >/dev/null 2>&1 || die "Docker Compose v2 (docker compose) is missing."
    if [[ $VIB_REHEARSAL != true ]]; then
        check_checkout
    fi
    previous=$(live_release)
    if [[ $previous == "$LEGACY_RELEASE" ]]; then
        adopt_legacy
    fi
    local service
    for service in "${SERVICES[@]}"; do
        previous_images[$service]=$(docker inspect --format '{{.Image}}' "$service" 2>/dev/null || true)
    done
    log "Live release: ${previous:-none}"
    if [[ -n $previous ]] && ! release_images_present "$previous"; then
        log "::warning::The images of $previous are not on this server, so a failure cannot roll back."
    fi

    phase "Pull images"
    if [[ $VIB_REHEARSAL != true ]]; then
        pull_images
        forget_registry_login
    fi
    release_images_present "$release" || die "The images of $release are missing."
    save_compose_file "$release"

    # A failure from here on keeps the new nginx config and .env. Both suit the live release too.
    if [[ $VIB_REHEARSAL != true ]]; then
        phase "nginx config and .env"
        install_nginx_config
        write_env_file
    fi

    phase "Migrate"
    # Before the swap, so the new code never runs on an old schema. The old release keeps serving
    # meanwhile, so every migration must work with its code too (expand/contract, DEPLOY.md).
    # Output goes to a root-only file: a database error names the host, and the deploy log is public.
    local migrate_log="$STATE_DIR/migrate-$release.log"
    install -m 600 /dev/null "$migrate_log"
    if ! compose_release "$release" run --rm --no-deps -T vib-backend \
        sh -c 'python manage.py migrate --noinput && python manage.py collectstatic --noinput' >"$migrate_log" 2>&1; then
        die "Migrate or collectstatic failed (log: $migrate_log on the server). ${previous:-Nothing} still runs, untouched."
    fi
    grep -E '^  (Apply|No migrations)' "$migrate_log" || true

    phase "Switch to $release"
    stage=switch
    switch_to "$release" || die "$release did not become healthy."
    stage=finished
    set_live_release "$release"
    record_history "$release" deployed

    phase "Prune"
    prune_releases || log "Could not prune old images. Not a deploy failure."
    log "Deployed $release."
}

check_checkout() {
    [[ $(git rev-parse HEAD) == "$release" ]] || die "The checkout is not $release."
    git merge-base --is-ancestor "$release" origin/master || die "$release is not on master."
}

# The first deploy finds the containers the old flow built here with Compose v1. Their images get
# a local :legacy tag and this release's compose file, so a failed first deploy can go back to them.
adopt_legacy() {
    local service id
    if release_images_present "$LEGACY_RELEASE" && [[ -f $(compose_file_of "$LEGACY_RELEASE") ]]; then
        return 0
    fi
    for service in "${SERVICES[@]}"; do
        id=$(docker inspect --format '{{.Image}}' "$service") || die "No $service container to keep as the legacy release."
        docker tag "$id" "$(image_ref "$service" "$LEGACY_RELEASE")"
    done
    save_compose_file "$LEGACY_RELEASE"
    record_history "$LEGACY_RELEASE" adopted
    log "Kept the running Compose v1 images as release $LEGACY_RELEASE."
}

# Always pulls, even when the tag is on disk: a manual `rebuild` pushes a new image under the same tag.
pull_images() {
    : "${GHCR_USER:?}" "${GHCR_TOKEN:?}"
    # A throwaway Docker config, so the token never lands in root's ~/.docker. It also dies with the job.
    registry_config=$(mktemp -d)
    printf '%s' "$GHCR_TOKEN" |
        DOCKER_CONFIG=$registry_config docker login ghcr.io --username "$GHCR_USER" --password-stdin >/dev/null
    local service
    for service in "${SERVICES[@]}"; do
        DOCKER_CONFIG=$registry_config docker pull --quiet "$(image_ref "$service" "$release")"
    done
}

forget_registry_login() {
    unset GHCR_TOKEN
    [[ -n $registry_config ]] || return 0
    DOCKER_CONFIG=$registry_config docker logout ghcr.io >/dev/null 2>&1 || true
    rm -rf "$registry_config"
    registry_config=""
}

# A duplicate server_name is only a warning, so `nginx -t` passes a config that silently drops a vhost.
nginx_config_ok() {
    local output
    if ! output=$(nginx -t 2>&1) || grep -qi "conflicting server name" <<<"$output"; then
        printf '%s\n' "$output"
        return 1
    fi
}

install_nginx_config() {
    # Keep the working config, so a rejected one never stays on disk for the next reload or reboot.
    if [[ -f $NGINX_SITE ]]; then cp -f "$NGINX_SITE" "$NGINX_SITE.bak"; fi
    cp server-configs/nginx/viktorbezai.com "$NGINX_SITE"
    ln -sfn "$NGINX_SITE" /etc/nginx/sites-enabled/viktorbezai.com
    # The page nginx shows while the maintenance flag is up or the app does not answer.
    cp server-configs/maintenance.html /var/www/maintenance-vib.html
    if ! nginx_config_ok; then
        if [[ -f $NGINX_SITE.bak ]]; then mv -f "$NGINX_SITE.bak" "$NGINX_SITE"; else rm -f "$NGINX_SITE"; fi
        die "nginx rejected the new config, or it would drop a vhost. The previous config is back."
    fi
    rm -f "$NGINX_SITE.bak"
    systemctl reload nginx
}

# Values are single-quoted, so Compose v2 reads them literally, with no $ expansion.
# VIB_RELEASE stays on the live release until the switch succeeds.
write_env_file() {
    local name temp
    for name in "${ENV_VARIABLES[@]}"; do
        [[ -n ${!name-} ]] || die "$name is empty. Set the GitHub secret."
        [[ ${!name} != *[$'\n\r'\']* ]] || die "$name holds a quote or a line break, which .env cannot carry."
    done
    temp=$(mktemp "$ENV_FILE.XXXXXX")
    {
        for name in "${ENV_VARIABLES[@]}"; do
            printf "%s='%s'\n" "$name" "${!name}"
        done
        printf "ENVIRONMENT='production'\n"
        printf 'VIB_RELEASE=%s\n' "${previous:-$release}"
    } >"$temp"
    mv -f "$temp" "$ENV_FILE"
}

restore_checkout() {
    [[ $VIB_REHEARSAL != true && -n $previous_commit ]] || return 0
    git -c advice.detachedHead=false checkout --quiet --force --detach "$previous_commit"
    log "Checked out $previous_commit again."
}

roll_back() {
    if [[ -z $previous ]]; then
        log "::error::No earlier release on this server to go back to."
        return 0
    fi
    log "Going back to $previous."
    # A rebuild of the live release moved its tag to the new image, so point it back at the old one.
    if [[ $previous == "$release" ]]; then
        local service
        for service in "${SERVICES[@]}"; do
            if [[ -n ${previous_images[$service]-} ]]; then
                docker tag "${previous_images[$service]}" "$(image_ref "$service" "$previous")"
            fi
        done
    else
        collect_static "$previous"
    fi
    if switch_to "$previous"; then
        set_live_release "$previous"
        record_history "$previous" rolled-back
        log "$previous is live again."
    else
        log "::error::$previous did not come back either. Check the server by hand (server-configs/DEPLOY.md)."
    fi
}

on_exit() {
    local status=$?
    set +e
    trap - EXIT INT TERM
    forget_registry_login
    remove_one_off_containers
    if ((status != 0)); then
        case $stage in
            prepare)
                restore_checkout
                record_history "$release" failed
                ;;
            switch)
                roll_back
                restore_checkout
                record_history "$release" failed
                ;;
            # The new release is live; only the bookkeeping after it failed.
            finished) log "::error::$release is live, but the steps after the switch failed." ;;
        esac
        log "Deploy of $release failed at the $stage stage."
    fi
    printf '::endgroup::\n'
    exit "$status"
}

main "$@"
