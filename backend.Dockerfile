# This is a placeholder Dockerfile for the backend service
# Customize this file based on your backend application requirements

# Base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build if necessary (adjust as needed)
# RUN npm run build

# Expose port
EXPOSE 8000

# Command to run the application
CMD ["node", "index.js"]
