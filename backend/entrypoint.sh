#!/bin/sh

# Wait for PostgreSQL to be ready using a loop
echo "Waiting for database..."
until python -c "import psycopg2; psycopg2.connect(dbname='$POSTGRES_NAME', user='$POSTGRES_USER', password='$POSTGRES_PASSWORD', host='$POSTGRES_HOST', port='$POSTGRES_PORT')" 2>/dev/null; do
  sleep 1
done
echo "Database is ready."

# Apply database migrations
echo "Applying database migrations..."
python manage.py makemigrations --noinput
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Start the application
exec "$@"
