# shellcheck shell=bash
# Shared settings and helpers for scripts/deploy. Sourced, never run on its own.
#
# A release is a commit on master. Its images are ghcr.io/viktor-bezai/vib-backend:<sha> and
# vib-frontend:<sha>. A deploy pulls them, migrates in a one-off container, then replaces each
# container in turn and waits for it to be healthy. See server-configs/DEPLOY.md.
#
# The local rehearsal (server-configs/DEPLOY.md) sets VIB_REHEARSAL=true and VIB_PROJECT_DIR.
# It uses images built on the machine and leaves git, nginx and .env alone.

VIB_REHEARSAL=${VIB_REHEARSAL:-false}
readonly VIB_REHEARSAL
if [[ $VIB_REHEARSAL == true ]]; then
    readonly PROJECT_DIR=${VIB_PROJECT_DIR:?The rehearsal needs VIB_PROJECT_DIR.}
else
    readonly PROJECT_DIR=/home/deploy/vib
fi

readonly IMAGE_NAMESPACE=ghcr.io/viktor-bezai
# Compose service, container and GHCR package share each name. Backend first: the frontend calls it.
readonly SERVICES=(vib-backend vib-frontend)
readonly COMPOSE_FILE=docker-compose.prod.yml
readonly ENV_FILE="$PROJECT_DIR/.env"
readonly STATE_DIR="$PROJECT_DIR/.deploy"
readonly LOCK_FILE="$STATE_DIR/lock"
# One line per event: "<UTC time> <release> <deployed|rolled-back|adopted|failed>".
readonly HISTORY_FILE="$STATE_DIR/history"
# The compose file each release ran with, so a rollback starts it exactly as it ran before.
readonly COMPOSE_DIR="$STATE_DIR/compose"
# A full commit SHA. "legacy" is the last image Compose v1 built on the server, before GHCR.
# shellcheck disable=SC2034 # used by rollback.sh
readonly RELEASE_PATTERN='^([0-9a-f]{40}|legacy)$'
readonly LEGACY_RELEASE=legacy
# Releases whose images stay on disk, so a rollback never needs the registry.
readonly RELEASES_TO_KEEP=3
# Backend start: database check and gunicorn boot. Generous, since the server is memory-tight.
readonly HEALTH_TIMEOUT=180

log() {
    printf '[%s] %s\n' "$(date -u +%H:%M:%S)" "$*"
}

# The ::group:: lines fold each phase in the GitHub Actions log.
phase() {
    printf '::endgroup::\n::group::%s\n' "$*"
}

die() {
    printf '::error::%s\n' "$*" >&2
    exit 1
}

image_ref() {
    local service=$1 release=$2
    printf '%s/%s:%s\n' "$IMAGE_NAMESPACE" "$service" "$release"
}

release_images_present() {
    local release=$1 service
    for service in "${SERVICES[@]}"; do
        docker image inspect "$(image_ref "$service" "$release")" >/dev/null 2>&1 || return 1
    done
}

record_history() {
    local release=$1 event=$2
    mkdir -p "$STATE_DIR"
    printf '%s %s %s\n' "$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$release" "$event" >>"$HISTORY_FILE"
}

# Takes the deploy lock on fd 9 for the life of the calling script, so two runs never overlap.
# bootstrap.sh takes it before the checkout and hands the same fd to deploy.sh; flock on a lock
# this process already holds returns at once.
take_lock() {
    mkdir -p "$STATE_DIR"
    if [[ ! -e /dev/fd/9 || ! /dev/fd/9 -ef $LOCK_FILE ]]; then
        exec 9>"$LOCK_FILE"
    fi
    flock -w 10 9 || die "Another deploy or rollback is running (lock: $LOCK_FILE)."
}

# Prints the release a service's container runs now, or nothing when there is no container.
# A container from the old Compose v1 build runs an image outside GHCR: that is "legacy".
running_release() {
    local service=$1 image
    image=$(docker inspect --format '{{.Config.Image}}' "$service" 2>/dev/null) || return 0
    case $image in
        "$IMAGE_NAMESPACE/$service:"*) printf '%s\n' "${image##*:}" ;;
        *) printf '%s\n' "$LEGACY_RELEASE" ;;
    esac
}

# The live release is the backend's. Both containers only differ after a failed rollback.
live_release() {
    running_release "${SERVICES[0]}"
}

compose_file_of() {
    printf '%s/%s.yml\n' "$COMPOSE_DIR" "$1"
}

# Keeps the checkout's compose file as the one this release runs with.
save_compose_file() {
    local release=$1
    mkdir -p "$COMPOSE_DIR"
    cp -f "$PROJECT_DIR/$COMPOSE_FILE" "$(compose_file_of "$release")"
}

# Runs Compose for one release. --project-directory keeps .env and the bind mounts relative to
# the project, even though the saved compose files live in .deploy/compose.
compose_release() {
    local release=$1
    shift
    local file
    file=$(compose_file_of "$release")
    if [[ ! -f $file ]]; then
        log "::error::No saved compose file for $release ($file)."
        return 1
    fi
    VIB_RELEASE=$release docker compose --project-directory "$PROJECT_DIR" --file "$file" "$@"
}

# Points .env's VIB_RELEASE at the live release, so manual Compose commands use the right images.
set_live_release() {
    local release=$1 temp
    [[ -f $ENV_FILE ]] || return 0
    temp=$(mktemp "$ENV_FILE.XXXXXX")
    { grep -v '^VIB_RELEASE=' "$ENV_FILE" || true; printf 'VIB_RELEASE=%s\n' "$release"; } >"$temp"
    mv -f "$temp" "$ENV_FILE"
}

# --- Health ----------------------------------------------------------------------------------

# The host port nginx proxies to, and a page there that must answer 200. Same ports as the
# compose file and server-configs/nginx/viktorbezai.com.
probe_url() {
    case $1 in
        vib-backend) printf 'http://127.0.0.1:8002/api/health/\n' ;;
        vib-frontend) printf 'http://127.0.0.1:3002/\n' ;;
    esac
}

# Host header: Django only answers hosts in ALLOWED_HOSTS, and localhost is one of them.
port_answers() {
    local status
    status=$(curl -s -o /dev/null -w '%{http_code}' --max-time 5 -H 'Host: localhost' "$(probe_url "$1")" || true)
    [[ $status == 200 ]]
}

# Waits until the container runs the release, its own healthcheck passes and its host port
# answers. Fails early when the healthcheck gives up or the container restarts.
wait_healthy() {
    local service=$1 release=$2 deadline=$((SECONDS + HEALTH_TIMEOUT)) image health restarts first_restarts
    image=$(image_ref "$service" "$release")
    first_restarts=$(docker inspect --format '{{.RestartCount}}' "$service" 2>/dev/null || echo 0)
    while ((SECONDS < deadline)); do
        if [[ $(docker inspect --format '{{.Config.Image}}' "$service" 2>/dev/null) != "$image" ]]; then
            log "$service does not run $image."
            return 1
        fi
        health=$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}none{{end}}' "$service")
        restarts=$(docker inspect --format '{{.RestartCount}}' "$service")
        if [[ $health == unhealthy ]] || ((restarts > first_restarts)); then
            log "$service failed its healthcheck (status $health, $((restarts - first_restarts)) restarts)."
            return 1
        fi
        if [[ $health == healthy ]] && port_answers "$service"; then
            log "$service is healthy on $release."
            return 0
        fi
        sleep 2
    done
    log "$service is not healthy after ${HEALTH_TIMEOUT}s (status $health)."
    return 1
}

# The deploy log is public (GitHub Actions on a public repo), so app output goes to a root-only file.
save_logs() {
    local service=$1 release=$2 file
    file="$STATE_DIR/$service-$release.log"
    install -m 600 /dev/null "$file"
    docker logs --tail 200 "$service" >"$file" 2>&1 || true
    log "The last $service logs are in $file on the server."
}

# --- Switching releases ----------------------------------------------------------------------

# Replaces one container with the release's image and waits for it. `up` without `down` keeps
# the gap to a stop and a start; nginx shows the maintenance page if a request lands in it.
swap_service() {
    local service=$1 release=$2 up_args=(--detach --no-deps) running_image wanted_image
    running_image=$(docker inspect --format '{{.Image}}' "$service" 2>/dev/null || true)
    wanted_image=$(docker image inspect --format '{{.Id}}' "$(image_ref "$service" "$release")")
    # Compose 2.23.3 misses a rebuilt image under the same tag, so a new image forces the recreate.
    # Same image: Compose recreates only if the config changed, else it leaves the container alone.
    if [[ $running_image != "$wanted_image" ]]; then
        up_args+=(--force-recreate)
        log "Starting $service on $release"
    fi
    compose_release "$release" up "${up_args[@]}" "$service" || return 1
    wait_healthy "$service" "$release" && return 0
    save_logs "$service" "$release"
    return 1
}

# Moves both services to a release, backend first. Stops at the first one that fails.
switch_to() {
    local release=$1 service
    for service in "${SERVICES[@]}"; do
        swap_service "$service" "$release" || return 1
    done
}

# --- Cleanup ---------------------------------------------------------------------------------

# Newest first: the live release, then the history, without repeats.
recent_releases() {
    {
        live_release
        if [[ -f $HISTORY_FILE ]]; then
            awk '$3 == "deployed" || $3 == "rolled-back" || $3 == "adopted" { seen[n++] = $2 } END { for (i = n - 1; i >= 0; i--) print seen[i] }' "$HISTORY_FILE"
        fi
    } | awk -v max="$RELEASES_TO_KEEP" 'NF && !seen[$0]++ && kept < max { print; kept++ }'
}

# Docker refuses to remove an image a container still uses, so a running release is never touched.
remove_image() {
    if docker image rm "$1" >/dev/null 2>&1; then
        log "Removed $1"
    else
        log "Kept $1: a container still uses it."
    fi
}

# Removes this project's old images and saved compose files. It names vib's own repositories
# explicitly, so the other projects on this server are never touched.
prune_releases() {
    local keep service tag id file
    keep=$(recent_releases)
    if [[ -z $keep ]]; then
        log "No release recorded yet, so every image stays."
        return 0
    fi
    log "Keeping the images of: $(tr '\n' ' ' <<<"$keep")"
    for service in "${SERVICES[@]}"; do
        docker image ls "$IMAGE_NAMESPACE/$service" --format '{{.Tag}}' | while read -r tag; do
            if [[ $tag != "<none>" ]] && ! grep -qxF "$tag" <<<"$keep"; then
                remove_image "$(image_ref "$service" "$tag")"
            fi
        done
        # Images that lost their tag to a rebuild. Only their digest still names our repository.
        docker image ls --filter dangling=true --quiet --no-trunc | while read -r id; do
            if docker image inspect --format '{{range .RepoDigests}}{{println .}}{{end}}' "$id" | grep -q "^$IMAGE_NAMESPACE/$service@"; then
                remove_image "$id"
            fi
        done
        # The old Compose v1 name for the legacy image. The :legacy tag keeps it while it is kept.
        if ! grep -qxF "$LEGACY_RELEASE" <<<"$keep" && docker image inspect "vib_$service:latest" >/dev/null 2>&1; then
            remove_image "vib_$service:latest"
        fi
    done
    for file in "$COMPOSE_DIR"/*.yml; do
        [[ -e $file ]] || continue
        if ! grep -qxF "$(basename "$file" .yml)" <<<"$keep"; then
            rm -f "$file"
        fi
    done
}
