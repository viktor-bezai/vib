#!/usr/bin/env bash
# Puts an earlier release back by hand, with the same health-gated swap as a deploy.
#
# With no release it goes back to the newest release in the history that is not live. Its images
# must still be on this server (a deploy keeps three); for an older one, run the Deploy workflow
# with its SHA. Migrations are never reversed, so the target must work with today's schema
# (expand/contract). The git checkout stays as it is. See server-configs/DEPLOY.md.
#
# Usage: scripts/deploy/rollback.sh [--yes] [release]
set -euo pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
readonly SCRIPT_DIR
# shellcheck source=scripts/deploy/lib.sh
source "$SCRIPT_DIR/lib.sh"

default_target() {
    local live=$1
    [[ -f $HISTORY_FILE ]] || return 0
    awk -v live="$live" '($3 == "deployed" || $3 == "rolled-back" || $3 == "adopted") && $2 != live { last = $2 } END { print last }' "$HISTORY_FILE"
}

# A release with images but no saved compose file (pulled by hand) uses the one from its commit.
ensure_compose_file() {
    local target=$1 file
    file=$(compose_file_of "$target")
    [[ -f $file ]] && return 0
    [[ $target != "$LEGACY_RELEASE" ]] || die "No saved compose file for $target."
    mkdir -p "$COMPOSE_DIR"
    git -C "$PROJECT_DIR" show "$target:$COMPOSE_FILE" >"$file" 2>/dev/null || {
        rm -f "$file"
        die "No compose file for $target, saved or in git."
    }
}

main() {
    local confirmed=false answer live target
    if [[ ${1:-} == --yes ]]; then
        confirmed=true
        shift
    fi
    cd "$PROJECT_DIR"
    take_lock

    live=$(live_release)
    target=${1:-$(default_target "$live")}
    [[ -n $target ]] || die "No earlier release in $HISTORY_FILE. Name one: rollback.sh <full sha>."
    [[ $target =~ $RELEASE_PATTERN ]] || die "Not a full commit SHA: $target"
    [[ $target != "$live" ]] || die "$target is already live."
    release_images_present "$target" ||
        die "The images of $target are not on this server. Run the Deploy workflow with sha=$target."
    ensure_compose_file "$target"

    if [[ $confirmed != true ]]; then
        printf 'Replace %s with %s? Each container restarts once. [y/N] ' "${live:-nothing}" "$target"
        read -r answer
        [[ $answer == [yY] ]] || die "Cancelled."
    fi

    collect_static "$target"
    if switch_to "$target"; then
        set_live_release "$target"
        record_history "$target" rolled-back
        log "$target is live."
        return 0
    fi
    log "::error::$target did not become healthy."
    if [[ -n $live ]] && collect_static "$live" && switch_to "$live"; then
        log "$live is live again."
    else
        log "::error::Could not bring back ${live:-the earlier release} either. Check the containers by hand."
    fi
    exit 1
}

main "$@"
