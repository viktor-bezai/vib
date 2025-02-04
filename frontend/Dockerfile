# Use official Node.js image
FROM node:18-alpine AS base

# Install curl for debugging
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm ci --frozen-lockfile

# Copy application source code
COPY . .

# Expose port
EXPOSE 3001

# Always build before starting
CMD ["sh", "-c", "npm run build && npm run start"]
