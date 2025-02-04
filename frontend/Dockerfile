# Use official Node.js image
FROM node:18-alpine AS base

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies (cache optimization)
COPY package*.json ./
RUN npm ci --frozen-lockfile

# Copy application source code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port
EXPOSE 3001

# Start the production build
CMD ["npm", "run", "start"]
