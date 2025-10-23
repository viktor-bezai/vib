#!/bin/bash

# Format script for backend and frontend
# Usage: ./scripts/format.sh [backend|frontend|all]

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Get the script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

format_backend() {
    echo -e "${BLUE}Formatting backend...${NC}"
    cd "$PROJECT_ROOT/backend"

    # Check if running in Docker or local
    if [ -f "/.dockerenv" ]; then
        echo -e "${YELLOW}Running in Docker environment${NC}"
        python -m ruff check . --fix --exclude 'migrations,staticfiles,venv,.venv,env'
        python -m ruff format . --exclude 'migrations,staticfiles,venv,.venv,env'
    else
        # Check if ruff is installed
        if ! command -v ruff &> /dev/null; then
            echo -e "${YELLOW}Ruff not found. Installing...${NC}"
            pip install ruff
        fi

        echo -e "${GREEN}Running Ruff check with auto-fix...${NC}"
        ruff check . --fix --exclude 'migrations,staticfiles,venv,.venv,env' || true

        echo -e "${GREEN}Running Ruff format...${NC}"
        ruff format . --exclude 'migrations,staticfiles,venv,.venv,env'
    fi

    echo -e "${GREEN}✓ Backend formatting complete!${NC}"
}

format_frontend() {
    echo -e "${BLUE}Formatting frontend...${NC}"
    cd "$PROJECT_ROOT/frontend"

    # Check if prettier is installed
    if ! npm list prettier --depth=0 &> /dev/null; then
        echo -e "${YELLOW}Prettier not found. Installing...${NC}"
        npm install --save-dev prettier
    fi

    echo -e "${GREEN}Running Prettier...${NC}"
    npx prettier --write "src/**/*.{js,jsx,ts,tsx,css,json}" || true

    echo -e "${GREEN}Running ESLint fix...${NC}"
    npm run lint -- --fix || echo -e "${YELLOW}ESLint found some issues that couldn't be auto-fixed${NC}"

    echo -e "${GREEN}✓ Frontend formatting complete!${NC}"
}

show_usage() {
    echo "Usage: $0 [backend|frontend|all]"
    echo ""
    echo "Options:"
    echo "  backend   - Format only backend (Python) code"
    echo "  frontend  - Format only frontend (TypeScript/React) code"
    echo "  all       - Format both backend and frontend (default)"
    echo ""
    echo "Examples:"
    echo "  $0              # Format everything"
    echo "  $0 backend      # Format only backend"
    echo "  $0 frontend     # Format only frontend"
}

# Main script logic
case "${1:-all}" in
    backend)
        format_backend
        ;;
    frontend)
        format_frontend
        ;;
    all)
        format_backend
        echo ""
        format_frontend
        ;;
    -h|--help)
        show_usage
        exit 0
        ;;
    *)
        echo -e "${RED}Error: Invalid option '${1}'${NC}"
        echo ""
        show_usage
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}All formatting complete! 🎉${NC}"
echo -e "${GREEN}========================================${NC}"
