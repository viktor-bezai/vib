#!/bin/bash

# Format (or verify) all code in the project.
#
# Usage:
#   ./scripts/format-all.sh            # rewrite files in place (default)
#   ./scripts/format-all.sh --check    # non-mutating verification (used by CI)

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

MODE="write"
if [[ "${1:-}" == "--check" ]]; then
    MODE="check"
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

if [[ "$MODE" == "check" ]]; then
    echo -e "${BLUE}🔍 Verifying code formatting (check mode)...${NC}"
else
    echo -e "${BLUE}🎨 Starting code formatting...${NC}"
fi
echo -e "${YELLOW}Project root: $PROJECT_ROOT${NC}"
echo ""

# ----- Frontend -----
echo -e "${BLUE}📱 Frontend (JavaScript/TypeScript)...${NC}"

if [[ ! -d "$PROJECT_ROOT/frontend" ]]; then
    echo -e "${RED}Frontend directory not found at $PROJECT_ROOT/frontend${NC}"
    exit 1
fi

cd "$PROJECT_ROOT/frontend"

if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm not found. Please install Node.js to format frontend code.${NC}"
    exit 1
fi

# Two patterns, not one: a single {src,test}/** glob never matches a file sitting
# directly in frontend/, so next.config.ts and the vitest config would be
# formatted by `npm run format` locally and never checked by this gate. They must
# stay in step with the format scripts in frontend/package.json.
PRETTIER_PATTERNS=(
    '{src,test}/**/*.{js,jsx,ts,tsx,json,css,scss,md}'
    '*.{ts,mts,js,mjs,json}'
)
if [[ "$MODE" == "check" ]]; then
    echo "Running Prettier in --check mode..."
    npx prettier --check "${PRETTIER_PATTERNS[@]}" --config .prettierrc --ignore-path .prettierignore
else
    echo "Running Prettier --write..."
    npx prettier --write "${PRETTIER_PATTERNS[@]}" --config .prettierrc --ignore-path .prettierignore
fi
echo -e "${GREEN}✓ Frontend ${MODE} complete${NC}"

echo ""

# ----- Backend -----
echo -e "${BLUE}🐍 Backend (Python)...${NC}"

if [[ ! -d "$PROJECT_ROOT/backend" ]]; then
    echo -e "${RED}Backend directory not found at $PROJECT_ROOT/backend${NC}"
    exit 1
fi

cd "$PROJECT_ROOT"

# The locked Ruff (backend/requirements-dev.txt): the venv's here, CI's own install there (RUFF=ruff).
# A global one can be far older and pass what CI rejects.
RUFF="${RUFF:-$PROJECT_ROOT/.venv/bin/ruff}"
if ! command -v "$RUFF" &> /dev/null; then
    echo -e "${RED}No .venv with Ruff. Set it up: docs/runbooks/local-dev.md, \"Python venv\".${NC}"
    exit 1
fi

if [[ "$MODE" == "check" ]]; then
    echo "Running ruff check..."
    "$RUFF" check backend

    echo "Running ruff format --check..."
    "$RUFF" format --check backend
else
    echo "Running ruff check --fix..."
    "$RUFF" check backend --fix

    echo "Running ruff format..."
    "$RUFF" format backend
fi
echo -e "${GREEN}✓ Backend ${MODE} complete${NC}"

echo ""
if [[ "$MODE" == "check" ]]; then
    echo -e "${GREEN}✨ All formatting checks passed!${NC}"
else
    echo -e "${GREEN}✨ All formatting complete!${NC}"
fi
