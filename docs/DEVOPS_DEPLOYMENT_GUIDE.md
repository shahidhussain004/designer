# Designer Platform - DevOps & Deployment Guide

> **Comprehensive Guide for Local and Remote Deployment in Secure Enterprise Environment**

## Table of Contents

1. [Overview](#overview)
2. [Network Security Context](#network-security-context)
3. [Artifactory Configuration](#artifactory-configuration)
4. [Base Images and Registry](#base-images-and-registry)
5. [Dockerfile Best Practices](#dockerfile-best-practices)
6. [Docker Compose Guidelines](#docker-compose-guidelines)
7. [CI/CD Pipeline Configuration](#cicd-pipeline-configuration)
8. [Proxy and Certificate Configuration](#proxy-and-certificate-configuration)
9. [Service-Specific Configurations](#service-specific-configurations)
10. [GitHub Actions Integration](#github-actions-integration)
11. [Troubleshooting](#troubleshooting)

---

## Overview

This document provides comprehensive guidelines for deploying applications within the Designer Platform ecosystem. Our organization operates in a **secure, air-gapped network environment** that requires specific configurations for:

- **Package Management**: All packages must be sourced from internal Artifactory repositories
- **TLS/SSL**: Proper certificate handling for secure communications
- **Proxy Configuration**: Network proxy settings for external resource access
- **Container Registry**: Use of internal Docker Trusted Registry (DTR)

### Key Principles

1. **Security First**: All dependencies must come from approved internal sources
2. **Reproducibility**: Builds should be consistent across environments
3. **Minimal Footprint**: Use smallest appropriate base images
4. **Non-Root Execution**: Containers should run as non-privileged users
5. **Health Monitoring**: All services must implement health checks

---

## Network Security Context

### Internal Network Architecture

Our infrastructure operates within a secured network perimeter:

| Component | URL | Purpose |
|-----------|-----|---------|
| Artifactory | `repo7.sebank.se` | Package and image repository |
| DTR (Dev/Acc) | `dtr-acc.sebank.se` | Development container registry |
| DTR (Prod) | `dtr.sebank.se` | Production container registry |
| Proxy (WSS) | `wss.sebank.se:80` | Web Security Service |
| Proxy (GIAS) | `gias.sebank.se:8080` | Gateway Internet Access Service |

### Proxy Selection Guide

| Environment | Proxy | Notes |
|-------------|-------|-------|
| Build Servers | GIAS | For CI/CD pipelines |
| Docker Platform | None (via Artifactory) | Use Artifactory for all dependencies |
| Local Development | WSS | Workstation proxy |

---

## Artifactory Configuration

### Package Registries

All package managers must be configured to use Artifactory:

#### npm (Node.js)
```bash
npm config set registry https://repo7.sebank.se/artifactory/api/npm/seb-npm
```

#### Maven (Java)
```xml
<repository>
    <id>seb-artifactory</id>
    <url>https://repo7.sebank.se/artifactory/maven</url>
</repository>
```

#### NuGet (.NET)
```bash
dotnet nuget add source "https://repo7.sebank.se/artifactory/api/nuget/v3/nuget" --name "SEB Artifactory"
dotnet nuget disable source nuget.org
```

#### Go Modules
```bash
export GOPROXY=https://repo7.sebank.se/artifactory/api/go/go-remote
```

#### Python (pip)
```bash
pip config set global.index-url https://repo7.sebank.se/artifactory/api/pypi/pypi/simple
```

---

## Base Images and Registry

### Approved Base Images

Always use images from the internal Docker Trusted Registry:

| Runtime | Base Image | Size |
|---------|-----------|------|
| Node.js | `sebdcp-docker.repo7.sebank.se/node:20-alpine` | ~180MB |
| .NET 8 | `mcr-microsoft-com.repo7.sebank.se/dotnet/aspnet:8.0-alpine` | ~100MB |
| .NET SDK | `mcr-microsoft-com.repo7.sebank.se/dotnet/sdk:8.0-alpine` | ~500MB |
| Java 21 | `eclipse-temurin:21-jre-alpine` via Artifactory | ~200MB |
| Go | `sebdcp-docker.repo7.sebank.se/golang:1.24-alpine` | ~250MB |
| Python | `sebdcp-docker.repo7.sebank.se/python:3.11-alpine` | ~50MB |
| Nginx | `sebdcp-docker.repo7.sebank.se/nginx:stable-alpine` | ~25MB |

### Image Naming Convention

```
<registry>/<organization>/<service-name>:<version>

# Examples:
ghcr.io/shahidhussain004/designer/content-service:main
dtr-acc.sebank.se/designer/marketplace-service:1.0.0
```

---

## Dockerfile Best Practices

### Multi-Stage Build Template

```dockerfile
# Build argument for SEB network configuration
ARG USE_SEB_ARTIFACTORY=true

# ==========================================
# Stage 1: Base Image with Dependencies
# ==========================================
FROM sebdcp-docker.repo7.sebank.se/node:20-alpine AS base

ARG USE_SEB_ARTIFACTORY

WORKDIR /app

# Configure Alpine repositories for SEB network
RUN if [ "$USE_SEB_ARTIFACTORY" = "true" ]; then \
        export VERSION_ID=$(grep VERSION_ID= /etc/os-release | cut -d '=' -f2 | cut -d '.' -f1,2 | tr -d '"') && \
        echo "https://repo7.sebank.se:443/artifactory/alpinelinux-org/v$VERSION_ID/main" > /etc/apk/repositories && \
        echo "https://repo7.sebank.se:443/artifactory/alpinelinux-org/v$VERSION_ID/community" >> /etc/apk/repositories; \
    fi

# Install CA certificates
RUN apk update && apk add --no-cache ca-certificates curl wget

# Download SEB Root Certificates
RUN if [ "$USE_SEB_ARTIFACTORY" = "true" ]; then \
        curl -s -L http://seb-ca-v2.seb.se/SEB-CA-v2/SEB%20Root%20CA%20v2.pem -o /usr/local/share/ca-certificates/SEB_Root_CA_v2.crt 2>/dev/null || true && \
        curl -s -L http://pki.seb.se/g3/root/ecc/cert -o /usr/local/share/ca-certificates/SEB_Root_CA_ECC_G3.crt 2>/dev/null || true && \
        curl -s -L http://pki.seb.se/g3/root/rsa/cert -o /usr/local/share/ca-certificates/SEB_Root_CA_RSA_G3.crt 2>/dev/null || true && \
        update-ca-certificates; \
    fi

# ==========================================
# Stage 2: Dependencies
# ==========================================
FROM base AS deps

# Configure npm to use Artifactory
RUN if [ "$USE_SEB_ARTIFACTORY" = "true" ]; then \
        npm config set registry https://repo7.sebank.se/artifactory/api/npm/seb-npm; \
    fi

COPY package.json package-lock.json* ./

# Use cache mount for faster builds
RUN --mount=type=cache,id=npm,target=/root/.npm \
    npm ci --omit=dev

# ==========================================
# Stage 3: Build
# ==========================================
FROM base AS builder

RUN if [ "$USE_SEB_ARTIFACTORY" = "true" ]; then \
        npm config set registry https://repo7.sebank.se/artifactory/api/npm/seb-npm; \
    fi

COPY package.json package-lock.json* ./
RUN --mount=type=cache,id=npm,target=/root/.npm \
    npm ci

COPY . .
RUN npm run build

# ==========================================
# Stage 4: Production Runtime
# ==========================================
FROM sebdcp-docker.repo7.sebank.se/node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 --ingroup appgroup appuser

# Copy built artifacts
COPY --from=deps --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/dist ./dist
COPY --from=builder --chown=appuser:appgroup /app/package.json ./

# Switch to non-root user
USER appuser

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

ENTRYPOINT ["node", "dist/server.js"]
```

### OS-Specific Repository Configuration

#### Alpine Linux
```dockerfile
RUN export VERSION_ID=$(grep VERSION_ID= /etc/os-release | cut -d '=' -f2 | cut -d '.' -f1,2 | tr -d '"') && \
    echo "https://repo7.sebank.se:443/artifactory/alpinelinux-org/v$VERSION_ID/main" > /etc/apk/repositories && \
    echo "https://repo7.sebank.se:443/artifactory/alpinelinux-org/v$VERSION_ID/community" >> /etc/apk/repositories && \
    echo '@edge https://repo7.sebank.se:443/artifactory/alpinelinux-org/edge/main' >> /etc/apk/repositories && \
    echo '@edgecommunity https://repo7.sebank.se:443/artifactory/alpinelinux-org/edge/community' >> /etc/apk/repositories
```

#### Debian/Bookworm
```dockerfile
RUN rm -f /etc/apt/sources.list.d/debian.sources && \
    echo 'Acquire::https::Verify-Host "false";Acquire::https::Verify-Peer "false";' | tee -a /etc/apt/apt.conf.d/80ssl-exceptions.conf && \
    echo 'deb [trusted=yes] https://repo7.sebank.se/artifactory/deb bookworm main universe unrestricted' >> /etc/apt/sources.list && \
    echo 'deb [trusted=yes] https://repo7.sebank.se/artifactory/deb bookworm-updates main' >> /etc/apt/sources.list && \
    echo 'deb [trusted=yes] https://repo7.sebank.se/artifactory/deb bookworm-backports main' >> /etc/apt/sources.list && \
    echo 'deb [trusted=yes] https://repo7.sebank.se/artifactory/deb bookworm-security main' >> /etc/apt/sources.list
```

#### Ubuntu
```dockerfile
RUN echo "Acquire { https::Verify-Peer false }" >> /etc/apt/apt.conf.d/99verify-peer.conf && \
    sed -i 's+http://security.ubuntu.com/ubuntu+https://repo7.sebank.se/artifactory/deb/ubuntu+g' /etc/apt/sources.list.d/ubuntu.sources && \
    sed -i 's+http://archive.ubuntu.com/ubuntu+https://repo7.sebank.se/artifactory/deb/ubuntu+g' /etc/apt/sources.list.d/ubuntu.sources && \
    apt-get update && \
    apt-get install -y ca-certificates curl && \
    sed -i '/Verify-Peer false/d' /etc/apt/apt.conf.d/99verify-peer.conf
```

---

## Docker Compose Guidelines

### Required Labels

All services deployed to the Swarm MUST include these mandatory labels:

```yaml
services:
  my-service:
    deploy:
      labels:
        # Required labels
        com.seb.99: "99k75"              # Cost center (mandatory)
        com.seb.stepid: "1234"           # Application agreement (mandatory)
        com.seb.teamemail: "team@seb.se" # Team email (mandatory)
        
        # Network/routing labels
        seb.lb.routes: "myservice.dcp.acc.sebank.se"
        seb.lb.container.port: "8080"
        seb.lb.tls.termination: "edge"
```

### Restart Policy

Always configure restart policies with a maximum attempt limit:

```yaml
deploy:
  restart_policy:
    condition: on-failure
    max_attempts: 5
```

### OS Constraints

Ensure services are scheduled on compatible nodes:

```yaml
deploy:
  placement:
    constraints:
      # For Linux containers
      - node.labels.linux == true
      # For Windows containers
      # - node.labels.ltsc2022 == true
```

### Complete Service Example

```yaml
version: "3.8"

networks:
  default:
    labels:
      com.docker.ucp.access.label: /designer

services:
  content-service:
    image: ${REGISTRY:-ghcr.io}/${REPO:-shahidhussain004/designer}/content-service:${TAG:-latest}
    build:
      context: ./services/content-service
      dockerfile: Dockerfile
      args:
        USE_SEB_ARTIFACTORY: "true"
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      REDIS_HOST: redis
    deploy:
      replicas: 2
      update_config:
        parallelism: 1
        delay: 10s
        failure_action: rollback
        order: start-first
      restart_policy:
        condition: on-failure
        max_attempts: 5
      placement:
        constraints:
          - node.labels.linux == true
      labels:
        com.docker.ucp.access.label: /designer
        com.seb.99: "99k75"
        com.seb.stepid: "1234"
        com.seb.teamemail: "designer-team@seb.se"
        seb.lb.routes: "content.designer.sebank.se"
        seb.lb.container.port: "8083"
        seb.lb.tls.termination: "edge"
    networks:
      - default
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:8083/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s
```

---

## CI/CD Pipeline Configuration

### GitHub Actions Workflow Structure

Our CI/CD pipelines follow a multi-stage approach:

```
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  Lint & Format  │ → │  Build & Test   │ → │  Security Scan  │
└─────────────────┘   └─────────────────┘   └─────────────────┘
                              ↓
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  Docker Build   │ → │  Push to GHCR   │ → │     Deploy      │
└─────────────────┘   └─────────────────┘   └─────────────────┘
```

### Standard Pipeline Template

```yaml
name: Service CI/CD Pipeline

on:
  push:
    branches: [main, develop]
    paths:
      - 'services/<service-name>/**'
      - '.github/workflows/<service-name>-ci-cd.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'services/<service-name>/**'

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}/<service-name>

jobs:
  lint-and-format:
    name: 🔍 Lint & Format Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Set up runtime
        uses: actions/setup-node@v4  # or setup-java, setup-go, etc.
      - name: Install dependencies
        run: npm ci
      - name: Run linter
        run: npm run lint

  build-and-test:
    name: 🏗️ Build & Test
    runs-on: ubuntu-latest
    needs: lint-and-format
    services:
      postgres:
        image: postgres:16-alpine
        env:
          POSTGRES_USER: test
          POSTGRES_PASSWORD: test
          POSTGRES_DB: test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v4
      - name: Build
        run: npm run build
      - name: Test
        run: npm test

  build-docker:
    name: 🐳 Build Docker Image
    runs-on: ubuntu-latest
    needs: build-and-test
    if: github.event_name == 'push'
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - uses: docker/build-push-action@v5
        with:
          context: ./services/<service-name>
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.ref_name }}
```

### Pipeline Requirements by Language

| Language | Lint Tool | Build Command | Test Framework |
|----------|-----------|---------------|----------------|
| Node.js/TypeScript | ESLint | `npm run build` | Vitest/Jest |
| Java | Checkstyle | `mvn package` | JUnit |
| Go | golangci-lint | `go build` | go test |
| .NET | dotnet format | `dotnet build` | xUnit |
| Python | flake8/pylint | N/A | pytest |

---

## Proxy and Certificate Configuration

### SEB Root Certificates

All containers requiring external access must include SEB root certificates:

```dockerfile
# Download and install SEB certificates
RUN curl -s -L http://seb-ca-v2.seb.se/SEB-CA-v2/SEB%20Root%20CA%20v2.pem -o /usr/local/share/ca-certificates/SEB_Root_CA_v2.crt && \
    curl -s -L http://pki.seb.se/g3/root/ecc/cert -o /usr/local/share/ca-certificates/SEB_Root_CA_ECC_G3.crt && \
    curl -s -L http://pki.seb.se/g3/root/rsa/cert -o /usr/local/share/ca-certificates/SEB_Root_CA_RSA_G3.crt && \
    update-ca-certificates
```

### Environment Variables for Proxy

```dockerfile
# For builds requiring external access
ENV http_proxy=http://gias.sebank.se:8080
ENV https_proxy=http://gias.sebank.se:8080
ENV no_proxy=".sebank.se,.seb.se,localhost,127.0.0.1"
```

### SSL/TLS Configuration

```dockerfile
# Set SSL certificate paths
ENV SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt
ENV SSL_CERT_DIR=/etc/ssl/certs
ENV GIT_SSL_CAINFO=/etc/ssl/certs/ca-certificates.crt

# For Node.js (development only - not recommended for production)
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
```

---

## Service-Specific Configurations

### Designer Platform Services

| Service | Language | Port | Base Image |
|---------|----------|------|------------|
| marketplace-service | Java 21 | 8080 | eclipse-temurin:21-jre-alpine |
| messaging-service | Go 1.24 | 8081 | golang:1.24-alpine → debian:bookworm-slim |
| lms-service | .NET 8 | 8082 | mcr.microsoft.com/dotnet/aspnet:8.0 |
| content-service | Node.js 20 | 8083 | node:20-alpine |

### Service Dockerfile References

- **Java Services**: See [services/marketplace-service/Dockerfile](../services/marketplace-service/Dockerfile)
- **Go Services**: See [services/messaging-service/Dockerfile](../services/messaging-service/Dockerfile)
- **.NET Services**: See [services/lms-service/Dockerfile](../services/lms-service/Dockerfile)
- **Node.js Services**: See [services/content-service/Dockerfile](../services/content-service/Dockerfile)

---

## GitHub Actions Integration

### Repository Secrets Configuration

Configure these secrets in your GitHub repository:

| Secret | Description | Example |
|--------|-------------|---------|
| `GITHUB_TOKEN` | Auto-provided | Built-in |
| `DTR_USERNAME` | DTR service account | `svc-designer-build` |
| `DTR_PASSWORD` | DTR access token | `*****` |
| `DATABASE_URL` | Production DB connection | `postgresql://...` |

### Workflow Triggers

```yaml
on:
  push:
    branches: [main, develop]
    paths:
      - 'services/my-service/**'
      - '.github/workflows/my-service-ci-cd.yml'
  pull_request:
    branches: [main, develop]
    paths:
      - 'services/my-service/**'
```

### Caching Strategies

```yaml
# npm cache
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
    cache-dependency-path: services/my-service/package-lock.json

# Maven cache
- uses: actions/setup-java@v4
  with:
    java-version: '21'
    distribution: 'temurin'
    cache: 'maven'

# Go cache
- uses: actions/setup-go@v5
  with:
    go-version: '1.24'
    cache-dependency-path: services/my-service/go.sum
```

---

## Troubleshooting

### Common Issues

#### 1. Package Download Failures
```
Error: ECONNREFUSED when connecting to npm registry
```
**Solution**: Ensure npm is configured to use Artifactory:
```bash
npm config set registry https://repo7.sebank.se/artifactory/api/npm/seb-npm
```

#### 2. SSL Certificate Errors
```
Error: unable to verify the first certificate
```
**Solution**: Install SEB root certificates in the Dockerfile.

#### 3. Docker Build Failures
```
Error: 500 Internal Server Error during build
```
**Solution**: Try building without Buildkit or use explicit `docker build` command.

#### 4. Health Check Failures
```
Container unhealthy: health check failed
```
**Solution**: 
- Increase `start_period` in health check
- Verify the health endpoint is responding
- Check container logs for startup errors

### Debug Commands

```bash
# Check container health
docker inspect --format='{{.State.Health.Status}}' <container>

# View container logs
docker logs -f <container>

# Execute command in container
docker exec -it <container> /bin/sh

# Check network connectivity
docker exec <container> wget -qO- http://health-endpoint
```

### Log Aggregation (Splunk)

Configure Splunk logging in docker-compose:

```yaml
services:
  my-service:
    logging:
      driver: splunk
      options:
        splunk-url: https://splunkhfprd.sebank.se:8088
        splunk-token: ${SPLUNK_TOKEN}
        splunk-index: designer_logs
        splunk-insecureskipverify: "true"
        tag: "|{{.DaemonName}}|{{.Name}}"
        splunk-format: "raw"
```

---

## Quick Reference

### Checklist for New Service Deployment

- [ ] Dockerfile uses internal base images
- [ ] Package managers configured for Artifactory
- [ ] SEB certificates installed (if needed)
- [ ] Non-root user configured
- [ ] Health check implemented
- [ ] CI/CD workflow created
- [ ] Required labels configured in docker-compose
- [ ] Restart policy set with max_attempts
- [ ] OS constraints defined
- [ ] Documentation updated

### Useful Links

- [Artifactory Repository Browser](https://repo7.sebank.se)
- [Docker Hub (for tag reference)](https://hub.docker.com)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Best Practices](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2024-12-29 | DevOps Team | Initial comprehensive guide |

---

*This document is maintained by the Designer Platform DevOps team. For questions or updates, please contact the team or submit a pull request.*
