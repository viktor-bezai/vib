#!/usr/bin/env bash
#
# Gather PR context for the self-review skill and print a clean plain-text digest:
#   - metadata (title, number, state, author, url)
#   - the PR description/body (where the ticket + acceptance criteria live)
#   - external links pulled out of the body (Linear / Jira / docs / Figma / Loom)
#   - existing comments across all three channels (conversation, reviews, inline),
#     with bot boilerplate stripped (cursor.com base64 links, BUGBOT markers, HTML)
#
# Usage: read_pr_context.sh [branch]      # defaults to the current branch
# Requires: authenticated gh (run ensure_gh_auth.sh first).
#
# Exit codes (the skill reads these):
#   0  PR found, digest printed to stdout
#   2  no open PR for the branch (nothing printed)
#   3  gh not installed or not authenticated
set -uo pipefail

BRANCH="${1:-$(git branch --show-current 2>/dev/null)}"

command -v gh >/dev/null 2>&1 || { echo "gh-not-installed" >&2; exit 3; }
gh auth status >/dev/null 2>&1 || { echo "gh-not-authed" >&2; exit 3; }

# Resolve the PR number for the branch; no open PR -> exit 2 (skill skips silently).
number=$(gh pr view "$BRANCH" --json number --jq '.number' 2>/dev/null) || exit 2
[ -n "$number" ] || exit 2

# Strip the noisiest bot artifacts so comment bodies stay readable in context.
denoise() {
    sed -E \
        -e 's#https://cursor\.com/[^ )"]*##g' \
        -e 's/<[^>]*>//g' \
    | grep -viE 'BUGBOT|fix-in-(cursor|web)|Reviewed by \[Cursor|Bugbot Autofix|Configure \[here\]|prefers-color-scheme'
}

echo "# PR CONTEXT"
gh pr view "$BRANCH" --json number,title,url,state,author \
    --jq '"Title:  \(.title)\nPR:     #\(.number) (\(.state)) by @\(.author.login)\nURL:    \(.url)"'

body=$(gh pr view "$BRANCH" --json body --jq '.body // ""')

echo ""
echo "## Description"
printf '%s\n' "$body" | denoise

echo ""
echo "## Links (Linear / tickets / docs) - from description and comments"
links=$(
    {
        printf '%s\n' "$body"
        gh pr view "$BRANCH" --json comments,reviews \
            --jq '(.comments[]?.body), (.reviews[]?.body)' 2>/dev/null
        gh api "repos/{owner}/{repo}/pulls/${number}/comments" --paginate \
            --jq '.[].body' 2>/dev/null
    } \
        | grep -oE 'https?://[^ )"<>]+' \
        | grep -iE 'linear\.app|atlassian|jira|notion|docs\.google|figma|loom' \
        | grep -viE 'cursor\.com' \
        | sort -u
)
if [ -n "$links" ]; then
    printf '%s\n' "$links" | sed 's/^/  /'
else
    echo "  (none found)"
fi

echo ""
echo "## Conversation comments + review summaries"
gh pr view "$BRANCH" --json comments,reviews --jq '
    (.comments[]?  | "[comment] @\(.author.login):\n\(.body)\n"),
    (.reviews[]?   | select((.body // "") != "") | "[review \(.state)] @\(.author.login):\n\(.body)\n")
' 2>/dev/null | denoise

echo ""
echo "## Inline (line-level) review comments"
gh api "repos/{owner}/{repo}/pulls/${number}/comments" --paginate --jq '
    .[] | "@\(.user.login)  \(.path):\(.line // .original_line)\n\(.body)\n---"
' 2>/dev/null | denoise

echo ""
echo "# END PR CONTEXT"
