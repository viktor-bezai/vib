# Use a smaller, optimized base image
FROM python:3.12-slim AS base

# Set environment variables to improve performance
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Create a non-root user for security
RUN addgroup --system appgroup && adduser --system --group appuser

# Set the working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    libpq-dev \
    postgresql-client \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip, setuptools, and wheel
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# Copy dependencies first (for better caching)
COPY requirements.txt ./

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application source code
COPY . .

# ✅ Ensure `staticfiles` and `media` directories exist **before switching users**
RUN mkdir -p /app/staticfiles /app/media

# ✅ Set correct permissions while still as root
RUN chown -R appuser:appgroup /app
RUN chmod -R 755 /app
RUN chmod -R 777 /app/staticfiles
RUN chmod -R 777 /app/media

# ✅ Switch to non-root user
USER appuser

# Expose application port
EXPOSE 8001

# Set the default command to start Gunicorn
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["gunicorn", "--bind", "0.0.0.0:8001", "config.wsgi:application"]
