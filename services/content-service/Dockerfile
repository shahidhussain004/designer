# Content Service Dockerfile
# Follows SEB organizational guidelines for secure enterprise deployment

# Build argument to determine if we're inside SEB network
ARG USE_SEB_ARTIFACTORY=true

# ==========================================
# Stage 1: Base Image
# ==========================================
FROM node:20-alpine AS base

ARG USE_SEB_ARTIFACTORY

WORKDIR /app

# Configure Alpine repositories for SEB network (if applicable)
RUN if [ "$USE_SEB_ARTIFACTORY" = "true" ]; then \
        export VERSION_ID=$(grep VERSION_ID= /etc/os-release | cut -d '=' -f2 | cut -d '.' -f1,2 | tr -d '"') && \
        echo "https://repo7.sebank.se:443/artifactory/alpinelinux-org/v$VERSION_ID/main" > /etc/apk/repositories && \
        echo "https://repo7.sebank.se:443/artifactory/alpinelinux-org/v$VERSION_ID/community" >> /etc/apk/repositories; \
    fi 2>/dev/null || true

# Install CA certificates and common utilities
RUN apk update && apk add --no-cache \
    ca-certificates \
    curl \
    wget \
    openssl

# Download SEB Root Certificates (only if in SEB network)
RUN if [ "$USE_SEB_ARTIFACTORY" = "true" ]; then \
        mkdir -p /usr/local/share/ca-certificates && \
        curl -s -L http://seb-ca-v2.seb.se/SEB-CA-v2/SEB%20Root%20CA%20v2.pem -o /usr/local/share/ca-certificates/SEB_Root_CA_v2.crt 2>/dev/null || true && \
        curl -s -L http://pki.seb.se/g3/root/ecc/cert -o /usr/local/share/ca-certificates/SEB_Root_CA_ECC_G3.crt 2>/dev/null || true && \
        curl -s -L http://pki.seb.se/g3/root/rsa/cert -o /usr/local/share/ca-certificates/SEB_Root_CA_RSA_G3.crt 2>/dev/null || true && \
        update-ca-certificates; \
    fi 2>/dev/null || true

# ==========================================
# Stage 2: Dependencies (Production only)
# ==========================================
FROM base AS deps

ARG USE_SEB_ARTIFACTORY

# Configure npm to use Artifactory (if in SEB network)
RUN if [ "$USE_SEB_ARTIFACTORY" = "true" ]; then \
        npm config set registry https://repo7.sebank.se/artifactory/api/npm/seb-npm; \
    fi 2>/dev/null || true

COPY package.json package-lock.json* ./

# Install production dependencies with cache mount
RUN --mount=type=cache,id=npm,target=/root/.npm \
    npm ci --omit=dev 2>/dev/null || npm install --omit=dev

# ==========================================
# Stage 3: Build
# ==========================================
FROM base AS builder

ARG USE_SEB_ARTIFACTORY

# Configure npm to use Artifactory (if in SEB network)
RUN if [ "$USE_SEB_ARTIFACTORY" = "true" ]; then \
        npm config set registry https://repo7.sebank.se/artifactory/api/npm/seb-npm; \
    fi 2>/dev/null || true

COPY package.json package-lock.json* ./

# Install all dependencies (including dev) with cache mount
RUN --mount=type=cache,id=npm,target=/root/.npm \
    npm ci 2>/dev/null || npm install

# Copy source code and build artifacts
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# ==========================================
# Stage 4: Production Runtime
# ==========================================
FROM node:20-slim AS runner

ARG USE_SEB_ARTIFACTORY

WORKDIR /app

ENV NODE_ENV=production

# Configure Debian repositories for SEB network (if applicable)
RUN if [ "$USE_SEB_ARTIFACTORY" = "true" ]; then \
        rm -f /etc/apt/sources.list.d/debian.sources && \
        echo 'Acquire::https::Verify-Host "false";Acquire::https::Verify-Peer "false";' | tee -a /etc/apt/apt.conf.d/80ssl-exceptions.conf && \
        echo 'deb [trusted=yes] https://repo7.sebank.se/artifactory/deb bookworm main universe unrestricted' >> /etc/apt/sources.list && \
        echo 'deb [trusted=yes] https://repo7.sebank.se/artifactory/deb bookworm-updates main' >> /etc/apt/sources.list && \
        echo 'deb [trusted=yes] https://repo7.sebank.se/artifactory/deb bookworm-backports main' >> /etc/apt/sources.list && \
        echo 'deb [trusted=yes] https://repo7.sebank.se/artifactory/deb bookworm-security main' >> /etc/apt/sources.list; \
    fi 2>/dev/null || true

# Install minimal runtime dependencies (openssl for Prisma, wget for health checks)
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends \
        openssl \
        wget \
        ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Download SEB Root Certificates for runtime (only if in SEB network)
RUN if [ "$USE_SEB_ARTIFACTORY" = "true" ]; then \
        mkdir -p /usr/local/share/ca-certificates && \
        wget --no-check-certificate -O /usr/local/share/ca-certificates/SEB_Root_CA_v2.crt \
            "http://seb-ca-v2.seb.se/SEB-CA-v2/SEB%20Root%20CA%20v2.pem" 2>/dev/null || true && \
        wget --no-check-certificate -O /usr/local/share/ca-certificates/SEB_Root_CA_ECC_G3.crt \
            "http://pki.seb.se/g3/root/ecc/cert" 2>/dev/null || true && \
        wget --no-check-certificate -O /usr/local/share/ca-certificates/SEB_Root_CA_RSA_G3.crt \
            "http://pki.seb.se/g3/root/rsa/cert" 2>/dev/null || true && \
        update-ca-certificates; \
    fi 2>/dev/null || true

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 --ingroup nodejs contentservice

# Copy necessary files from builder (use builder's node_modules which has generated Prisma client)
COPY --from=builder --chown=contentservice:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=contentservice:nodejs /app/dist ./dist
COPY --from=builder --chown=contentservice:nodejs /app/prisma ./prisma
COPY --from=builder --chown=contentservice:nodejs /app/package.json ./package.json

# Create uploads directory and set permissions
RUN mkdir -p /app/uploads/images /app/uploads/thumbnails /app/uploads/temp && \
    chown -R contentservice:nodejs /app

# Switch to non-root user
USER contentservice

# Expose application port
EXPOSE 8083

# Health check using wget (following organizational best practices)
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8083/health || exit 1

# Run migrations then start the server
CMD ["sh", "-c", "npx prisma db push --skip-generate && node dist/server.js"]
