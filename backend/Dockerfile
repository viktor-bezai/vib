# Base image
FROM python:3.12

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Set entrypoint script
RUN chmod +x /app/entrypoint.sh

# Expose the default Django port
EXPOSE 8000

# Default command (overridden in entrypoint)
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "config.wsgi:application"]
