#!/bin/bash

# Exit on any error
set -e

echo "🔄 Starting rollback..."

# Configuration
PROJECT_DIR="/var/www/viktorbezai"
COMPOSE_FILE="docker-compose.prod.yml"

# Navigate to project directory
cd $PROJECT_DIR

# Get previous commit
PREVIOUS_COMMIT=$(git rev-parse HEAD~1)

echo "📥 Rolling back to commit: $PREVIOUS_COMMIT"
git checkout $PREVIOUS_COMMIT

# Rebuild and restart services
echo "🔨 Rebuilding services..."
docker-compose -f $COMPOSE_FILE build

echo "🔄 Restarting services..."
docker-compose -f $COMPOSE_FILE down
docker-compose -f $COMPOSE_FILE up -d

# Wait for services
sleep 10

# Run migrations (in case of rollback)
echo "🗄️ Running migrations..."
docker-compose -f $COMPOSE_FILE exec -T backend python manage.py migrate

echo "✅ Rollback completed!"