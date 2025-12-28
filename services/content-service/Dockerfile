# Content Service Dockerfile
FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev 2>/dev/null || npm install --omit=dev

# Build stage
FROM base AS builder
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
COPY package.json package-lock.json* ./
RUN npm ci 2>/dev/null || npm install
COPY . .
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:20-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Install openssl for Prisma
RUN apt-get update -y && apt-get install -y openssl wget && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 contentservice

# Copy necessary files - use builder's node_modules which has the generated Prisma client
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

# Create uploads directory and set permissions
RUN mkdir -p /app/uploads/images /app/uploads/thumbnails /app/uploads/temp
RUN chown -R contentservice:nodejs /app

USER contentservice

EXPOSE 8083

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8083/health || exit 1

# Run migrations then start the server
CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/server.js"]
