# Use a smaller, optimized base image
FROM python:3.12-slim AS base

# Set environment variables to avoid buffer issues and force stdin to be interactive
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Create a non-root user for security
RUN addgroup --system appgroup && adduser --system --group appuser

# Set the working directory
WORKDIR /app

# Install system dependencies required for pip and common packages
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip, setuptools, and wheel for better compatibility
RUN pip install --no-cache-dir --upgrade pip setuptools wheel

# Copy dependencies first to leverage Docker cache
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files after installing dependencies
COPY . .

# Change ownership of the application directory
RUN chown -R appuser:appgroup /app

# Set the non-root user
USER appuser

# Make entrypoint script executable
RUN chmod +x /app/entrypoint.sh

# Expose the application port
EXPOSE 8000

# Set the default command to start Gunicorn via entrypoint script
ENTRYPOINT ["/app/entrypoint.sh"]
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
