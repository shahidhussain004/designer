# CI/CD Configuration Guide

## Overview

This document provides comprehensive configuration details for the Designer Marketplace CI/CD pipelines.

## GitHub Actions Workflows

### 1. Master Pipeline (`master-pipeline.yml`)

**Purpose:** Orchestrates all service pipelines and runs E2E tests

**Triggers:**
- Push to `main`, `develop`, `phase2CICDUpdates` branches
- Pull requests to `main`, `develop`

**Features:**
- Smart change detection (only builds affected services)
- Parallel service builds
- E2E testing across all services
- Load testing (PR only)
- Security scanning
- Deployment readiness check

**Jobs:**
1. **detect-changes** - Identifies which services changed
2. **trigger-*-service** - Triggers individual service pipelines
3. **e2e-tests** - Runs integration tests across services
4. **load-tests** - JMeter performance tests (optional)
5. **security-scan** - OWASP dependency check
6. **deployment-ready** - Final status check

### 2. Marketplace Service Pipeline (`marketplace-service.yml`)

**Purpose:** Build, test, and package Java Spring Boot service

**Stages:**
1. **Lint & Format** (2 min)
   - Maven Checkstyle
   - Compilation check
   
2. **Unit Tests** (3 min)
   - JUnit tests
   - Coverage report
   
3. **Integration Tests** (5 min)
   - PostgreSQL, Redis, MongoDB
   - Spring Boot integration tests
   
4. **Docker Build** (4 min)
   - Multi-stage Dockerfile
   - Push to GHCR
   
5. **Security Scan** (2 min)
   - Trivy vulnerability scanner
   - SARIF upload to GitHub Security

**Docker Image:** `ghcr.io/{owner}/{repo}/marketplace-service:latest`

**Environment Variables:**
```yaml
SPRING_DATASOURCE_URL: jdbc:postgresql://host:5432/db
SPRING_DATASOURCE_USERNAME: user
SPRING_DATASOURCE_PASSWORD: pass
SPRING_DATA_REDIS_HOST: redis-host
SPRING_DATA_REDIS_PORT: 6379
SPRING_DATA_MONGODB_URI: mongodb://user:pass@host:27017/db
KAFKA_BOOTSTRAP_SERVERS: kafka:9092
JWT_SECRET: your-secret-key
```

### 3. Messaging Service Pipeline (`marketplace-messaging-service.yml`)

**Purpose:** Build, test, and package Go WebSocket service

**Stages:**
1. **Lint & Format** (1 min)
   - golangci-lint
   - gofmt check
   - go vet
   
2. **Build** (2 min)
   - CGO_ENABLED=0
   - Static binary
   
3. **Unit Tests** (2 min)
   - Race detector
   - Coverage report
   
4. **Integration Tests** (4 min)
   - PostgreSQL, Redis, Kafka
   - End-to-end flow tests
   
5. **Docker Build** (3 min)
   - Multi-stage build
   - Alpine base (minimal)
   - Multi-platform (amd64, arm64)
   
6. **Security Scan** (2 min)
   - Trivy + Gosec

**Docker Image:** `ghcr.io/{owner}/{repo}/messaging-service:latest`

**Environment Variables:**
```yaml
PORT: 8081
DATABASE_URL: postgres://user:pass@host:5432/db
REDIS_URL: redis-host:6379
KAFKA_BROKERS: kafka:9092
JWT_SECRET: your-secret-key
ALLOWED_ORIGINS: http://localhost:3000,http://localhost:3001
```

### 4. Admin Dashboard Pipeline (`marketplace-admin-dashboard-ci-cd.yml`)

**Purpose:** Build and deploy React admin interface

**Stages:**
1. **Lint & Format** (1 min)
   - ESLint
   - TypeScript type checking
   
2. **Build** (2 min)
   - Vite production build
   - Asset optimization
   
3. **Unit Tests** (2 min)
   - Jest tests
   - Coverage report
   
4. **Docker Build** (3 min)
   - Node builder stage
   - Nginx runtime stage

**Docker Image:** `ghcr.io/{owner}/{repo}/admin-dashboard:latest`

**Nginx Configuration:**
- Serves static files from `/usr/share/nginx/html`
- Proxies `/api/*` to marketplace-service:8080
- SPA routing support

### 5. Marketplace Web Pipeline (`marketplace-web.yml`)

**Purpose:** Build and deploy Next.js application

**Stages:**
1. **Lint & Format** (1 min)
   - ESLint
   - TypeScript checking
   
2. **Build** (3 min)
   - Next.js production build
   - Standalone output
   
3. **Unit Tests** (2 min)
   - Jest tests
   
4. **Integration Tests** (3 min)
   - Component integration
   
5. **Docker Build** (4 min)
   - Next.js standalone
   - Node 20 Alpine
   
6. **Lighthouse** (3 min) [PR only]
   - Performance metrics
   - Accessibility check

**Docker Image:** `ghcr.io/{owner}/{repo}/marketplace-web:latest`

## Branch Protection Rules

### Recommended Settings

**For `main` branch:**
```yaml
Required status checks:
  - Marketplace Service / Unit Tests
  - Marketplace Service / Integration Tests
  - Messaging Service / Unit Tests
  - Messaging Service / Integration Tests
  - Admin Dashboard / Build
  - Marketplace Web / Build
  - E2E Tests
  
Require branches to be up to date: ✅
Require conversation resolution: ✅
Require signed commits: ✅ (recommended)
Include administrators: ✅

Do not allow bypassing: ✅
```

**For `develop` branch:**
```yaml
Required status checks:
  - Marketplace Service / Build
  - Messaging Service / Build
  - Admin Dashboard / Build
  - Marketplace Web / Build
  
Require pull request reviews: 1
```

## Secrets Configuration

### Required GitHub Secrets

1. **GITHUB_TOKEN** (automatic)
   - Used for: GHCR authentication, GitHub API access
   - Permissions: `contents: read, packages: write, security-events: write`

2. **Optional Secrets:**
   - `DOCKER_HUB_USERNAME` - If using Docker Hub
   - `DOCKER_HUB_TOKEN` - Docker Hub access token
   - `SONAR_TOKEN` - SonarCloud integration
   - `SLACK_WEBHOOK` - Deployment notifications

### Setting Secrets

```bash
# Using GitHub CLI
gh secret set DOCKER_HUB_USERNAME --body "your-username"
gh secret set DOCKER_HUB_TOKEN --body "your-token"

# Or via GitHub UI:
# Settings → Secrets and variables → Actions → New repository secret
```

## Container Registry Setup

### GitHub Container Registry (GHCR)

**Advantages:**
- Free for public repos
- Integrated with GitHub
- Automatic cleanup policies
- Fine-grained access control

**Image Naming Convention:**
```
ghcr.io/{owner}/{repo}/marketplace-service:latest
ghcr.io/{owner}/{repo}/marketplace-service:main-abc1234
ghcr.io/{owner}/{repo}/marketplace-service:develop
ghcr.io/{owner}/{repo}/marketplace-service:pr-123
```

**Pull Images:**
```bash
# Authenticate
echo $GITHUB_TOKEN | docker login ghcr.io -u USERNAME --password-stdin

# Pull images
docker pull ghcr.io/owner/repo/marketplace-service:latest
docker pull ghcr.io/owner/repo/messaging-service:latest
docker pull ghcr.io/owner/repo/admin-dashboard:latest
docker pull ghcr.io/owner/repo/marketplace-web:latest
```

**Cleanup Policy:**
- Keep last 10 versions
- Delete untagged after 7 days
- Keep tagged versions for 90 days

## Local Testing

### Testing Workflows Locally (Act)

Install [Act](https://github.com/nektos/act):

```bash
# Windows (chocolatey)
choco install act-cli

# macOS
brew install act

# Linux
curl https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

**Run workflows locally:**
```bash
# List available jobs
act -l

# Run specific workflow
act -W .github/workflows/marketplace-service.yml

# Run with secrets
act -s GITHUB_TOKEN=your-token

# Dry run
act -n
```

### Testing Docker Builds Locally

```bash
# Marketplace Service
cd services/marketplace-service
mvn clean package -DskipTests
docker build -t marketplace-service:local .
docker run -p 8080:8080 marketplace-service:local

# Messaging Service
cd services/messaging-service
docker build -t messaging-service:local .
docker run -p 8081:8081 messaging-service:local

# Admin Dashboard
cd frontend/admin-dashboard
docker build -t admin-dashboard:local .
docker run -p 3001:80 admin-dashboard:local

# Marketplace Web
cd frontend/marketplace-web
docker build -t marketplace-web:local .
docker run -p 3000:3000 marketplace-web:local
```

## Monitoring & Notifications

### GitHub Actions Monitoring

**Built-in Features:**
- Workflow status badges
- Email notifications (configurable)
- GitHub UI workflow visualization
- Job summaries in PR comments

**Status Badge Example:**
```markdown
![CI/CD](https://github.com/owner/repo/workflows/Master%20CI%2FCD%20Pipeline/badge.svg)
```

### Slack Integration (Optional)

Add to workflow:
```yaml
- name: Slack Notification
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
    fields: repo,message,commit,author,action,eventName,ref,workflow
```

### Deployment Notifications

```yaml
- name: Deployment Success Notification
  if: success()
  run: |
    curl -X POST ${{ secrets.SLACK_WEBHOOK }} \
      -H 'Content-Type: application/json' \
      -d '{
        "text": "🚀 Deployment successful!",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Marketplace Service* deployed to production\n*Version:* ${{ github.sha }}\n*Branch:* ${{ github.ref_name }}"
            }
          }
        ]
      }'
```

## Troubleshooting

### Common Issues

**1. Docker build fails with "no space left on device"**
```yaml
# Add cleanup step before build
- name: Free disk space
  run: |
    docker system prune -af
    df -h
```

**2. Integration tests timeout**
```yaml
# Increase timeout and add better health checks
services:
  postgres:
    options: >-
      --health-cmd pg_isready
      --health-interval 5s
      --health-timeout 3s
      --health-retries 10
```

**3. Maven dependencies not cached**
```yaml
# Ensure cache configuration is correct
- uses: actions/setup-java@v4
  with:
    cache: maven
    cache-dependency-path: '**/pom.xml'
```

**4. Go build fails with missing dependencies**
```yaml
# Verify go.sum exists and is committed
- name: Verify dependencies
  run: |
    go mod verify
    go mod download
```

**5. GHCR authentication fails**
```yaml
# Use correct token permissions
permissions:
  contents: read
  packages: write
  
# Ensure token is passed correctly
password: ${{ secrets.GITHUB_TOKEN }}
```

### Debug Mode

Enable debug logging:
```yaml
env:
  ACTIONS_STEP_DEBUG: true
  ACTIONS_RUNNER_DEBUG: true
```

## Performance Optimization

### Caching Strategy

**Maven:**
```yaml
- uses: actions/cache@v4
  with:
    path: ~/.m2/repository
    key: ${{ runner.os }}-maven-${{ hashFiles('**/pom.xml') }}
    restore-keys: ${{ runner.os }}-maven-
```

**npm:**
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'
    cache-dependency-path: '**/package-lock.json'
```

**Go:**
```yaml
- uses: actions/setup-go@v5
  with:
    cache-dependency-path: '**/go.sum'
```

**Docker Layers:**
```yaml
- uses: docker/build-push-action@v5
  with:
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

### Parallel Execution

Jobs run in parallel by default. Use `needs:` to create dependencies:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
  
  test-unit:
    needs: build  # Waits for build
    
  test-integration:
    needs: build  # Also waits for build (parallel with test-unit)
    
  deploy:
    needs: [test-unit, test-integration]  # Waits for both
```

## Cost Optimization

### GitHub Actions Minutes

**Free tier:**
- Public repos: Unlimited
- Private repos: 2,000 minutes/month

**Cost reduction strategies:**
1. Use smart change detection (only build affected services)
2. Cache dependencies aggressively
3. Skip non-critical jobs on PR (e.g., load tests)
4. Use `if` conditions to skip unnecessary jobs
5. Self-hosted runners for heavy workloads

**Example:**
```yaml
jobs:
  expensive-job:
    if: github.event_name != 'pull_request'  # Skip on PRs
    runs-on: ubuntu-latest
```

## Security Best Practices

1. **Never commit secrets** - Use GitHub Secrets
2. **Scan dependencies** - Use Trivy, OWASP Dependency Check
3. **Use minimal Docker images** - Alpine, distroless
4. **Run as non-root user** - Create dedicated users in Dockerfile
5. **Pin action versions** - Use `@v4` not `@latest`
6. **Enable SARIF upload** - GitHub Security tab
7. **Require signed commits** - Branch protection
8. **Limit token permissions** - Principle of least privilege

## Deployment Strategies

### Blue-Green Deployment

```yaml
- name: Deploy to blue environment
  run: |
    docker-compose -f docker-compose.blue.yml up -d
    # Health check
    sleep 30
    curl -f http://blue.example.com/actuator/health
    
- name: Switch traffic to blue
  run: |
    # Update load balancer
    # Drain green environment
    docker-compose -f docker-compose.green.yml down
```

### Canary Deployment

```yaml
- name: Deploy canary
  run: |
    # Deploy 10% traffic to new version
    kubectl set image deployment/app app=new-image
    kubectl scale deployment/app-canary --replicas=1
    kubectl scale deployment/app-stable --replicas=9
```

### Rolling Update

```yaml
- name: Rolling update
  run: |
    docker-compose up -d --no-deps --build marketplace-service
    # Health check each instance before proceeding
```

## Related Documentation

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
- [Security Hardening](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
