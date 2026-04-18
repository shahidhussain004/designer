---
description: "Use when writing Dockerfiles, docker-compose files, building container images, selecting base images, configuring container registries, or deploying to Docker Swarm. All base images must come from sebdcp-docker.repo7.sebank.se. Covers multi-stage builds, OS-specific Artifactory repo redirection (Alpine/Debian/Ubuntu), SEB certificate injection, container proxy env vars, and mandatory Docker Swarm labels."
applyTo: "**/Dockerfile,**/Dockerfile.*,**/docker-compose*.yml,**/docker-compose*.yaml,.dockerignore"
---

# Docker & Container Configuration — SEB Corporate Network

All Docker base images must be pulled from the **SEB internal Docker Trusted Registry** at
`sebdcp-docker.repo7.sebank.se`, not Docker Hub or any other public registry. Container builds
run without direct internet access — all OS package managers must be redirected to Artifactory.

**Never use**: `FROM node:20-alpine`, `FROM ubuntu:22.04`, `FROM python:3.11` (public Docker Hub)
**Always use**: `FROM sebdcp-docker.repo7.sebank.se/node:20-alpine` (internal mirror)

---

## Approved Base Images

| Runtime | Internal Image |
|---------|----------------|
| Node.js 20 Alpine | `sebdcp-docker.repo7.sebank.se/node:20-alpine` |
| Nginx stable | `sebdcp-docker.repo7.sebank.se/nginx:stable-alpine` |
| Go 1.24 Alpine | `sebdcp-docker.repo7.sebank.se/golang:1.24-alpine` |
| Python 3.11 Alpine | `sebdcp-docker.repo7.sebank.se/python:3.11-alpine` |
| .NET 8 Runtime | `mcr-microsoft-com.repo7.sebank.se/dotnet/aspnet:8.0-alpine` |
| .NET 8 SDK | `mcr-microsoft-com.repo7.sebank.se/dotnet/sdk:8.0-alpine` |
| Java 21 | `eclipse-temurin:21-jre-alpine` (pull via Artifactory mirror) |
| PostgreSQL 15 | `sebdcp-docker.repo7.sebank.se/postgres:15-alpine` |
| Redis 7 | `sebdcp-docker.repo7.sebank.se/redis:7-alpine` |
| Keycloak 22 | `sebdcp-docker.repo7.sebank.se/keycloak/keycloak:22` |

---

## Multi-Stage Dockerfile Template (Node.js / Alpine)

```dockerfile
# Toggle to use internal Artifactory (set false for local public-internet dev)
ARG USE_SEB_ARTIFACTORY=true

# ── Stage 1: Base with SEB certs ───────────────────────────────
FROM sebdcp-docker.repo7.sebank.se/node:20-alpine AS base
ARG USE_SEB_ARTIFACTORY
WORKDIR /app

# Redirect Alpine apk repos to Artifactory
RUN if [ "$USE_SEB_ARTIFACTORY" = "true" ]; then \
      VERSION_ID=$(grep VERSION_ID= /etc/os-release | cut -d= -f2 | cut -d. -f1,2 | tr -d '"') && \
      echo "https://repo7.sebank.se:443/artifactory/alpinelinux-org/v${VERSION_ID}/main"      > /etc/apk/repositories && \
      echo "https://repo7.sebank.se:443/artifactory/alpinelinux-org/v${VERSION_ID}/community" >> /etc/apk/repositories; \
    fi

RUN apk update && apk add --no-cache ca-certificates curl wget

# Download and install SEB Root CAs
RUN if [ "$USE_SEB_ARTIFACTORY" = "true" ]; then \
      curl -sL http://seb-ca-v2.seb.se/SEB-CA-v2/SEB%20Root%20CA%20v2.pem \
           -o /usr/local/share/ca-certificates/SEB_Root_CA_v2.crt 2>/dev/null || true && \
      curl -sL http://pki.seb.se/g3/root/ecc/cert \
           -o /usr/local/share/ca-certificates/SEB_Root_CA_ECC_G3.crt 2>/dev/null || true && \
      curl -sL http://pki.seb.se/g3/root/rsa/cert \
           -o /usr/local/share/ca-certificates/SEB_Root_CA_RSA_G3.crt 2>/dev/null || true && \
      update-ca-certificates; \
    fi

# ── Stage 2: Install production dependencies ───────────────────
FROM base AS deps
ARG USE_SEB_ARTIFACTORY
RUN if [ "$USE_SEB_ARTIFACTORY" = "true" ]; then \
      npm config set registry https://repo7.sebank.se/artifactory/api/npm/seb-npm; \
    fi
COPY package.json package-lock.json* ./
RUN --mount=type=cache,id=npm,target=/root/.npm \
    npm ci --omit=dev

# ── Stage 3: Build ─────────────────────────────────────────────
FROM base AS builder
ARG USE_SEB_ARTIFACTORY
RUN if [ "$USE_SEB_ARTIFACTORY" = "true" ]; then \
      npm config set registry https://repo7.sebank.se/artifactory/api/npm/seb-npm; \
    fi
COPY package.json package-lock.json* ./
RUN --mount=type=cache,id=npm,target=/root/.npm npm ci
COPY . .
RUN npm run build

# ── Stage 4: Production runtime ────────────────────────────────
FROM sebdcp-docker.repo7.sebank.se/node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Run as non-root user (mandatory security practice)
RUN addgroup --system --gid 1001 appgroup && \
    adduser  --system --uid 1001 --ingroup appgroup appuser

COPY --from=deps    --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/dist         ./dist
COPY --from=builder --chown=appuser:appgroup /app/package.json ./

USER appuser
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1

ENTRYPOINT ["node", "dist/server.js"]
```

---

## OS-Specific Repository Configuration

### Alpine Linux — Redirect apk to Artifactory

```dockerfile
RUN VERSION_ID=$(grep VERSION_ID= /etc/os-release | cut -d= -f2 | cut -d. -f1,2 | tr -d '"') && \
    echo "https://repo7.sebank.se:443/artifactory/alpinelinux-org/v${VERSION_ID}/main"            > /etc/apk/repositories && \
    echo "https://repo7.sebank.se:443/artifactory/alpinelinux-org/v${VERSION_ID}/community"       >> /etc/apk/repositories && \
    echo "@edge          https://repo7.sebank.se:443/artifactory/alpinelinux-org/edge/main"        >> /etc/apk/repositories && \
    echo "@edgecommunity https://repo7.sebank.se:443/artifactory/alpinelinux-org/edge/community"   >> /etc/apk/repositories
```

### Debian / Bookworm — Redirect apt to Artifactory

```dockerfile
RUN rm -f /etc/apt/sources.list.d/debian.sources && \
    echo 'Acquire::https::Verify-Host "false";Acquire::https::Verify-Peer "false";' \
         | tee /etc/apt/apt.conf.d/80ssl-exceptions.conf && \
    echo 'deb [trusted=yes] https://repo7.sebank.se/artifactory/deb bookworm main universe unrestricted' \
         >> /etc/apt/sources.list && \
    echo 'deb [trusted=yes] https://repo7.sebank.se/artifactory/deb bookworm-updates main' \
         >> /etc/apt/sources.list && \
    echo 'deb [trusted=yes] https://repo7.sebank.se/artifactory/deb bookworm-backports main' \
         >> /etc/apt/sources.list && \
    echo 'deb [trusted=yes] https://repo7.sebank.se/artifactory/deb bookworm-security main' \
         >> /etc/apt/sources.list
```

### Ubuntu — Redirect apt to Artifactory

```dockerfile
RUN echo "Acquire { https::Verify-Peer false }" \
         >> /etc/apt/apt.conf.d/99verify-peer.conf && \
    sed -i 's+http://security.ubuntu.com/ubuntu+https://repo7.sebank.se/artifactory/deb/ubuntu+g' \
        /etc/apt/sources.list.d/ubuntu.sources
```

---

## Container Proxy & Certificate ENV Block

Use when the container itself needs outbound access (e.g., during runtime, not just build):

```dockerfile
ENV http_proxy=http://gias.sebank.se:8080 \
    https_proxy=http://gias.sebank.se:8080 \
    no_proxy=.sebank.se,localhost,.seb.net \
    SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt \
    SSL_CERT_DIR=/etc/ssl/certs \
    NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt
```

> Prefer installing the SEB CA bundle (above) over `NODE_TLS_REJECT_UNAUTHORIZED=0`.
> If you must use the latter, add a comment: `# dev containers only — not for production`.

---

## Docker Compose — Local Development Stack

```yaml
version: "3.9"

services:
  postgres:
    image: sebdcp-docker.repo7.sebank.se/postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD: apppass
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d appdb"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: sebdcp-docker.repo7.sebank.se/redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  keycloak:
    image: sebdcp-docker.repo7.sebank.se/keycloak/keycloak:22
    ports:
      - "18080:8080"
    environment:
      KEYCLOAK_ADMIN: admin
      KEYCLOAK_ADMIN_PASSWORD: admin
    command: start-dev

volumes:
  postgres-data:
```

---

## Docker Compose — Production / Docker Swarm

All services deployed to the Docker platform **must** include these labels:

```yaml
services:
  your-service:
    image: dtr-acc.sebank.se/your-team/your-service:1.0.0
    labels:
      com.seb.99: "your-step-id"                 # STEP ID of the application
      com.seb.stepid: "your-step-id"             # STEP ID (duplicate — required)
      com.seb.teamemail: "team@seb.se"           # Owning team contact email
      seb.lb.routes: "your-service.sebank.se"    # Virtual hostname for load balancer
      seb.lb.container.port: "8080"              # Port the container listens on
      seb.lb.tls.termination: "edge"             # TLS termination: edge | passthrough
    networks:
      - app-net
    deploy:
      replicas: 2
      update_config:
        parallelism: 1
        delay: 30s
      restart_policy:
        condition: on-failure
        max_attempts: 3
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:8080/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 60s

networks:
  app-net:
    driver: overlay
```

### Mandatory Label Explanation

| Label | Purpose | Required |
|-------|---------|----------|
| `com.seb.99` | STEP ID (application identifier in STEP system) | ✅ Yes |
| `com.seb.stepid` | Same as above (used by some tooling) | ✅ Yes |
| `com.seb.teamemail` | Team email for ownership and alerting | ✅ Yes |
| `seb.lb.routes` | Hostname the load balancer routes to this service | ✅ Yes |
| `seb.lb.container.port` | Port the container exposes | ✅ Yes |
| `seb.lb.tls.termination` | `edge` = LB terminates TLS; `passthrough` = container handles TLS | ✅ Yes |

---

## Image Naming Convention

```
<registry>/<organization>/<service-name>:<version>
```

Examples:
- Dev/staging: `dtr-acc.sebank.se/designer/marketplace-service:1.0.0`
- Production: `dtr.sebank.se/designer/marketplace-service:1.2.3`
- GitHub CR: `ghcr.io/<org>/designer/content-service:main`

---

## Security Best Practices

- Always use **non-root users** (`adduser --system`) in production stage
- Use **multi-stage builds** — never ship build tools in the runtime image
- Include a **`HEALTHCHECK`** in every production image
- Use `--mount=type=cache` for layer caching in builds
- Do not embed secrets — use `--secret` or environment variables at runtime
- Set `NODE_ENV=production` to disable dev dependencies

---

## Troubleshooting

### Docker build fails with TLS/certificate errors

**Fix**: Add the SEB cert download block to your Dockerfile's base stage (see above). For dev
containers as a last resort:
```dockerfile
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
```

### `docker pull` fails with `unauthorized` or `not found`

**Root cause**: Pulling from Docker Hub instead of internal registry.

**Fix**: Change `FROM node:20-alpine` to `FROM sebdcp-docker.repo7.sebank.se/node:20-alpine`.

### apk/apt-get fails inside container build

**Root cause**: Alpine/Debian repos still pointing at public mirrors.

**Fix**: Add the OS repo redirection block before any `apk` or `apt-get` commands (see above).

### Container cannot reach internal services at runtime

**Fix**: Ensure `no_proxy=.sebank.se,localhost,.seb.net` is set in the container ENV block.
