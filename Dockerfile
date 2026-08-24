# Multi-stage Dockerfile for QRS Platform
# Phase: Production-ready Next.js + Integrated Payload CMS

# ==============================================================================
# Stage 1: Dependencies
# ==============================================================================
FROM node:20-alpine AS dependencies

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Save production node_modules
FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules

# ==============================================================================
# Stage 2: Builder
# ==============================================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies (including sharp compilation requirements)
RUN apk add --no-cache python3 make g++ cairo-dev jpeg-dev pango-dev giflib-dev pixman-dev

# Copy package files and all dependencies (including dev)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build Next.js application
RUN npm run build

# ==============================================================================
# Stage 3: Runtime (Production)
# ==============================================================================
FROM node:20-alpine

WORKDIR /app

# Security: Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy production dependencies from dependencies stage
COPY --from=prod-deps /app/node_modules ./node_modules

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# Copy only necessary configuration files
COPY cms ./cms

# Create media directory volume mount point
RUN mkdir -p ./public/media && \
    chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose application port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start Next.js application
CMD ["npm", "start"]
