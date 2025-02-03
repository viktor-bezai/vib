# Use Node.js base image
FROM node:18

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json /app/
RUN npm install

# Copy project files
COPY . /app

# Expose port
EXPOSE 3000

# Run Next.js app
CMD ["npm", "run", "dev"]
