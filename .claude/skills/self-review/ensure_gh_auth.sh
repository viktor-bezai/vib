#!/usr/bin/env bash
#
# Ensure the GitHub CLI (`gh`) is authenticated before the self-review skill
# reads PR comments. Designed to be called two ways:
#
#   - From the skill's Bash tool (non-interactive): checks auth status only and
#     never blocks. Emits a machine-readable status prefix + exit code so the
#     skill can branch.
#   - From the user's terminal via the `!` prefix, e.g.
#         ! .claude/skills/self-review/ensure_gh_auth.sh
#     Here stdin is a TTY, so it runs the real interactive `gh auth login` flow.
#
# Exit codes (the skill reads these):
#   0  authenticated, proceed
#   1  interactive login attempted but still not authenticated
#   2  not authenticated, needs the user to re-login via the `!` prefix
#   3  gh not installed, skip PR-comment checks
set -uo pipefail

if ! command -v gh >/dev/null 2>&1; then
  echo "gh-not-installed: the GitHub CLI is not installed; skipping PR-comment checks." >&2
  exit 3
fi

if gh auth status >/dev/null 2>&1; then
  echo "gh-authed: GitHub CLI is authenticated."
  exit 0
fi

if [ -t 0 ]; then
  # Interactive terminal (user ran this via the `!` prefix): do the real login.
  echo "gh-login-start: not authenticated, launching 'gh auth login'..."
  gh auth login || true
  if gh auth status >/dev/null 2>&1; then
    echo "gh-authed: login successful."
    exit 0
  fi
  echo "gh-login-failed: still not authenticated after login." >&2
  exit 1
fi

# Non-interactive (Bash tool): the interactive flow would hang here, so don't try.
echo "gh-needs-login: not authenticated. Re-login in-session by typing this at the prompt:" >&2
echo "    ! .claude/skills/self-review/ensure_gh_auth.sh" >&2
exit 2
