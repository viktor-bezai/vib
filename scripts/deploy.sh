#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting deployment..."

# Configuration
PROJECT_DIR="/var/www/viktorbezai"
COMPOSE_FILE="docker-compose.prod.yml"

# Fix git safe directory
git config --global --add safe.directory $PROJECT_DIR

# Navigate to project directory
cd $PROJECT_DIR

# Pull latest changes
echo "📥 Pulling latest changes..."
git pull origin master

# Copy production environment
echo "📋 Setting up environment..."
cp .env.production .env

# Build services
echo "🔨 Building services..."
docker-compose -f $COMPOSE_FILE build

# Stop old containers
echo "🛑 Stopping old containers..."
docker-compose -f $COMPOSE_FILE down

# Start new containers
echo "🚀 Starting new containers..."
docker-compose -f $COMPOSE_FILE up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 10

# Run migrations
echo "🗄️ Running database migrations..."
docker-compose -f $COMPOSE_FILE exec -T vib-backend python manage.py migrate

# Collect static files
echo "📦 Collecting static files..."
docker-compose -f $COMPOSE_FILE exec -T vib-backend python manage.py collectstatic --noinput

# Health check
echo "🏥 Running health checks..."
curl -f http://localhost:8001/api/v1/health/ || exit 1
curl -f http://localhost:3001/ || exit 1

# Clean up
echo "🧹 Cleaning up..."
docker image prune -f
docker volume prune -f

echo "✅ Deployment completed successfully!"