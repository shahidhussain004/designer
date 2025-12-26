# Build argument to determine if we're inside SEB network
ARG USE_SEB_ARTIFACTORY=true

# --------------------
# Stage 1: Base
# --------------------
FROM golang:1.24 AS base

ARG USE_SEB_ARTIFACTORY

# Configure Debian repositories conditionally
RUN if [ "$USE_SEB_ARTIFACTORY" = "true" ]; then \
        rm -f /etc/apt/sources.list.d/debian.sources && \
        echo 'Acquire::https::Verify-Host "false";Acquire::https::Verify-Peer "false";' | tee -a /etc/apt/apt.conf.d/80ssl-exceptions.conf && \
        echo 'deb [trusted=yes] https://repo7.sebank.se/artifactory/deb bookworm main universe unrestricted' >> /etc/apt/sources.list && \
        echo 'deb [trusted=yes] https://repo7.sebank.se/artifactory/deb bookworm-updates main' >> /etc/apt/sources.list && \
        echo 'deb [trusted=yes] https://repo7.sebank.se/artifactory/deb bookworm-backports main' >> /etc/apt/sources.list && \
        echo 'deb [trusted=yes] https://repo7.sebank.se/artifactory/deb bookworm-security main' >> /etc/apt/sources.list; \
    fi

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    ca-certificates \
    tzdata \
    wget && \
    rm -rf /var/lib/apt/lists/*

# Download SEB Root Certificates (only if in SEB network)
RUN if [ "$USE_SEB_ARTIFACTORY" = "true" ]; then \
        mkdir -p /usr/local/share/ca-certificates && \
        wget --no-check-certificate -O /usr/local/share/ca-certificates/seb_root_ca_ecc_g3.crt \
            "http://pki.seb.se/g3/root/ecc/cert" 2>/dev/null || true && \
        wget --no-check-certificate -O /usr/local/share/ca-certificates/seb_root_ca_rsa_g3.crt \
            "http://pki.seb.se/g3/root/rsa/cert" 2>/dev/null || true && \
        wget --no-check-certificate -O /usr/local/share/ca-certificates/seb_root_ca_v2.crt \
            "http://seb-ca-v2.seb.se/SEB-CA-v2/SEB%20Root%20CA%20v2.pem" 2>/dev/null || true && \
        update-ca-certificates && \
        git config --system http.sslVerify false; \
    fi

# Set basic environment variables
ENV SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt \
    SSL_CERT_DIR=/etc/ssl/certs \
    GIT_SSL_CAINFO=/etc/ssl/certs/ca-certificates.crt

WORKDIR /app

# Copy go mod files first for better layer caching
COPY go.mod go.sum ./

# Download dependencies - set GOPROXY inline in the RUN command
RUN --mount=type=cache,id=gomod,target=/go/pkg/mod \
    --mount=type=cache,id=gobuild,target=/root/.cache/go-build \
    if [ "$USE_SEB_ARTIFACTORY" = "true" ]; then \
        export GOPROXY="https://repo7.sebank.se/artifactory/api/go/golang,direct" && \
        export GOSUMDB="off" && \
        export GOINSECURE="*" && \
        go mod download; \
    else \
        go mod download; \
    fi

# Copy source code
COPY . .

# --------------------
# Stage 2: Builder
# --------------------
FROM base AS builder

# Build the binary with cache mounts for faster rebuilds
RUN --mount=type=cache,id=gomod,target=/go/pkg/mod \
    --mount=type=cache,id=gobuild,target=/root/.cache/go-build \
    CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build \
    -ldflags="-w -s" \
    -o messaging-service \
    .

# --------------------
# Stage 3: Runtime (lightweight)
# --------------------
FROM debian:bookworm-slim

ARG USE_SEB_ARTIFACTORY

# Configure Debian repositories conditionally
RUN if [ "$USE_SEB_ARTIFACTORY" = "true" ]; then \
        rm -f /etc/apt/sources.list /etc/apt/sources.list.d/debian.sources && \
        echo 'Acquire::https::Verify-Host "false";Acquire::https::Verify-Peer "false";' | tee -a /etc/apt/apt.conf.d/80ssl-exceptions.conf && \
        echo 'deb [trusted=yes] https://repo7.sebank.se/artifactory/deb bookworm main universe unrestricted' >> /etc/apt/sources.list && \
        echo 'deb [trusted=yes] https://repo7.sebank.se/artifactory/deb bookworm-updates main' >> /etc/apt/sources.list && \
        echo 'deb [trusted=yes] https://repo7.sebank.se/artifactory/deb bookworm-security main' >> /etc/apt/sources.list; \
    fi

# Install minimal runtime dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    tzdata \
    wget && \
    rm -rf /var/lib/apt/lists/*

# Download SEB Root Certificates for runtime (only if in SEB network)
RUN if [ "$USE_SEB_ARTIFACTORY" = "true" ]; then \
        mkdir -p /usr/local/share/ca-certificates && \
        wget --no-check-certificate -O /usr/local/share/ca-certificates/seb_root_ca_ecc_g3.crt \
            "http://pki.seb.se/g3/root/ecc/cert" 2>/dev/null || true && \
        wget --no-check-certificate -O /usr/local/share/ca-certificates/seb_root_ca_rsa_g3.crt \
            "http://pki.seb.se/g3/root/rsa/cert" 2>/dev/null || true && \
        wget --no-check-certificate -O /usr/local/share/ca-certificates/seb_root_ca_v2.crt \
            "http://seb-ca-v2.seb.se/SEB-CA-v2/SEB%20Root%20CA%20v2.pem" 2>/dev/null || true && \
        update-ca-certificates; \
    fi

# Create non-root user
RUN groupadd -g 1000 appgroup && useradd -m -u 1000 -g appgroup appuser

WORKDIR /app

# Copy binary from builder
COPY --from=builder /app/messaging-service ./messaging-service

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 8080

# Health check (adjust endpoint as needed)
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

# Run the application
ENTRYPOINT ["./messaging-service"]