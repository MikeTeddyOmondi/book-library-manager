# Base
FROM node:18.18.2-alpine AS base

# Build
FROM base AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies and build globally
RUN npm install -g .

# Copy the rest of the application code
COPY . .

# Release
FROM base AS release

# Set working directory
WORKDIR /app

# Copy the globally installed package from the builder stage
COPY --from=builder /usr/local/lib/node_modules/book-library-manager /usr/local/lib/node_modules/book-library-manager
COPY --from=builder /usr/local/bin/library /usr/local/bin/library
# COPY --from=builder /usr/local/bin /usr/local/bin

# Set environment variables (default values, can be overridden at runtime)
ENV PORT=3000 \
    MINIO_ENDPOINT=localhost \
    MINIO_PORT=9000 \
    MINIO_USE_SSL=false \
    MINIO_ACCESS_KEY=minio-access-key \
    MINIO_SECRET_KEY=minio-secret-key \
    MINIO_BUCKET=library-files \
    MINIO_REGION=sa-north-1

# Ensure the database file is writable
RUN mkdir -p /app/data && chown node:node /app/data && \
    touch /app/data/library.db && chown node:node /app/data/library.db

# Switch to non-root user
USER node

# Expose the port the app runs on
EXPOSE ${PORT}

# Default command (can be overridden)
CMD ["library", "server", "start"]
