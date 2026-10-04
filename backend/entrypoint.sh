#!/bin/sh
# Waits for the database, then runs the command. Dependencies are baked into the image, and
# migrations run once per deploy in their own container (scripts/deploy), not on every start.
set -e

echo "Waiting for PostgreSQL..."
timeout=30
count=0

# -q: the host name is a secret, and the deploy log is public.
while ! pg_isready -q -h "$POSTGRES_HOST" -p "$POSTGRES_PORT" -U "$POSTGRES_USER"; do
  count=$((count+1))
  if [ $count -ge $timeout ]; then
    echo "ERROR: PostgreSQL is not ready after $timeout seconds. Exiting."
    exit 1
  fi
  echo "Database not ready. Retrying..."
  sleep 1
done

echo "PostgreSQL is ready."

exec "$@"
