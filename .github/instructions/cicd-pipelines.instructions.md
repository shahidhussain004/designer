---
description: "Use when writing GitHub Actions workflows, CI/CD pipelines, Terraform GCP configurations, or deployment scripts. Covers GIAS proxy setup for build servers, Artifactory authentication, per-language pipeline requirements (Node.js/Java/.NET/Go/Python/Docker), Docker login to internal registry, GCP Terraform proxy subnet patterns, and Terraform state migration."
applyTo: "**/.github/workflows/*.yml,**/.github/workflows/*.yaml,**/terraform/**/*.tf,**/infrastructure/**/*.tf"
---

# CI/CD Pipelines & GCP Infrastructure — SEB Corporate Network

All CI/CD pipelines must run on **SEB self-hosted runners** within the corporate network.
Build servers use the **GIAS proxy** (`gias.sebank.se:8080`), not the WSS workstation proxy.
All packages, container images, and artifacts must come from **Artifactory (`repo7.sebank.se`)** —
never from public registries.

---

## Key Rules for Pipelines

1. Use `runs-on: self-hosted` — public GitHub-hosted runners cannot reach internal Artifactory
2. Set `http_proxy` and `https_proxy` to GIAS (`gias.sebank.se:8080`), not WSS
3. Authenticate to Artifactory via `ARTIFACTORY_TOKEN` secret
4. Log in to `dtr-acc.sebank.se` (dev) or `dtr.sebank.se` (prod) before any Docker push
5. Never hardcode tokens — use GitHub Secrets (`${{ secrets.ARTIFACTORY_TOKEN }}`)

---

## Standard GitHub Actions Workflow

```yaml
name: Build and Test

on:
  push:
    branches: [main, develop]
  pull_request:

env:
  # GIAS proxy — required on CI/CD build servers (not WSS)
  http_proxy:  http://gias.sebank.se:8080
  https_proxy: http://gias.sebank.se:8080
  no_proxy:    .sebank.se,localhost,.seb.net,*.sebank.se,*.seb.net
  HTTP_PROXY:  http://gias.sebank.se:8080
  HTTPS_PROXY: http://gias.sebank.se:8080
  NO_PROXY:    .sebank.se,localhost,.seb.net,*.sebank.se,*.seb.net

  # Registries
  NPM_REGISTRY:    https://repo7.sebank.se/artifactory/api/npm/seb-npm
  DOCKER_REGISTRY: dtr-acc.sebank.se
  NODE_EXTRA_CA_CERTS: /etc/ssl/certs/ca-certificates.crt

jobs:
  build:
    runs-on: self-hosted    # Must use SEB self-hosted runners

    steps:
      - uses: actions/checkout@v4

      # ── Node.js ────────────────────────────────────────────────
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          registry-url: ${{ env.NPM_REGISTRY }}

      - name: Configure npm
        run: |
          npm config set registry ${{ env.NPM_REGISTRY }}
          npm config set strict-ssl false

      - name: Install dependencies
        run: npm ci
        env:
          NODE_AUTH_TOKEN: ${{ secrets.ARTIFACTORY_TOKEN }}

      - name: Build
        run: npm run build

      - name: Test
        run: npm test

      # ── Docker ─────────────────────────────────────────────────
      - name: Docker login (dev registry)
        uses: docker/login-action@v3
        with:
          registry: ${{ env.DOCKER_REGISTRY }}
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ env.DOCKER_REGISTRY }}/your-team/your-service:${{ github.sha }}
          build-args: |
            USE_SEB_ARTIFACTORY=true
```

---

## Per-Language Pipeline Requirements

| Language | Required Setup |
|----------|----------------|
| **Node.js** | `setup-node` with `registry-url`; `NODE_AUTH_TOKEN` secret; `npm config set registry` |
| **Java** | `ARTIFACTORY_USER` + `ARTIFACTORY_TOKEN` env; Maven `settings.xml` in-repo or injected |
| **.NET** | `dotnet nuget add source` with credentials; disable `nuget.org` |
| **Go** | `GOPROXY` env var pointing to Artifactory; `GONOSUMCHECK=*` |
| **Python** | `pip config set global.index-url` to Artifactory; `REQUESTS_CA_BUNDLE` env |
| **Docker** | Login to `dtr-acc.sebank.se` (dev) or `dtr.sebank.se` (prod) before push |
| **Rust/Cargo** | `.cargo/config.toml` committed to repo with Artifactory source |

---

## Java Pipeline Example

```yaml
jobs:
  build-java:
    runs-on: self-hosted
    env:
      http_proxy:  http://gias.sebank.se:8080
      https_proxy: http://gias.sebank.se:8080
      no_proxy:    .sebank.se,localhost,.seb.net

    steps:
      - uses: actions/checkout@v4

      - name: Setup JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: "21"
          distribution: "temurin"

      - name: Configure Maven settings
        run: |
          mkdir -p ~/.m2
          cat > ~/.m2/settings.xml << 'EOF'
          <settings>
            <mirrors>
              <mirror>
                <id>seb-artifactory</id>
                <mirrorOf>*</mirrorOf>
                <url>https://repo7.sebank.se/artifactory/maven</url>
              </mirror>
            </mirrors>
            <servers>
              <server>
                <id>seb-artifactory</id>
                <username>${env.ARTIFACTORY_USER}</username>
                <password>${env.ARTIFACTORY_TOKEN}</password>
              </server>
            </servers>
          </settings>
          EOF
        env:
          ARTIFACTORY_USER: ${{ secrets.ARTIFACTORY_USER }}
          ARTIFACTORY_TOKEN: ${{ secrets.ARTIFACTORY_TOKEN }}

      - name: Build with Maven
        run: mvn clean package -DskipTests
        env:
          ARTIFACTORY_USER: ${{ secrets.ARTIFACTORY_USER }}
          ARTIFACTORY_TOKEN: ${{ secrets.ARTIFACTORY_TOKEN }}

      - name: Test
        run: mvn test
```

---

## .NET Pipeline Example

```yaml
jobs:
  build-dotnet:
    runs-on: self-hosted
    env:
      http_proxy:  http://gias.sebank.se:8080
      https_proxy: http://gias.sebank.se:8080

    steps:
      - uses: actions/checkout@v4

      - name: Setup .NET 8
        uses: actions/setup-dotnet@v4
        with:
          dotnet-version: "8.0.x"

      - name: Configure NuGet
        run: |
          dotnet nuget add source "https://repo7.sebank.se/artifactory/api/nuget/v3/nuget" \
            --name "SEB Artifactory" \
            --username "${{ secrets.ARTIFACTORY_USER }}" \
            --password "${{ secrets.ARTIFACTORY_TOKEN }}"
          dotnet nuget disable source nuget.org

      - name: Restore
        run: dotnet restore

      - name: Build
        run: dotnet build --no-restore

      - name: Test
        run: dotnet test --no-build
```

---

## Docker Production Deployment Pipeline

```yaml
jobs:
  deploy-prod:
    runs-on: self-hosted
    environment: production      # Requires manual approval gate
    needs: [build]

    steps:
      - uses: actions/checkout@v4

      - name: Login to production registry
        uses: docker/login-action@v3
        with:
          registry: dtr.sebank.se   # prod registry
          username: ${{ secrets.PROD_DOCKER_USERNAME }}
          password: ${{ secrets.PROD_DOCKER_PASSWORD }}

      - name: Tag and push to production
        run: |
          docker pull dtr-acc.sebank.se/your-team/your-service:${{ github.sha }}
          docker tag  dtr-acc.sebank.se/your-team/your-service:${{ github.sha }} \
                      dtr.sebank.se/your-team/your-service:${{ github.ref_name }}
          docker push dtr.sebank.se/your-team/your-service:${{ github.ref_name }}
```

---

## Required GitHub Secrets

| Secret | Purpose |
|--------|---------|
| `ARTIFACTORY_TOKEN` | Artifactory API token (base64 `user:token`) |
| `ARTIFACTORY_USER` | Artifactory username (your S-ID) |
| `DOCKER_USERNAME` | Docker registry username |
| `DOCKER_PASSWORD` | Docker registry password / token |
| `PROD_DOCKER_USERNAME` | Prod registry credentials (separate from dev) |
| `PROD_DOCKER_PASSWORD` | Prod registry password |

---

## GCP / Terraform

### Proxy-Only Subnet (Required for Internal HTTPS Load Balancers)

When using `purpose = "INTERNAL_HTTPS_LOAD_BALANCER"` you must have a dedicated proxy-only
subnet in the VPC. This subnet is consumed by the load balancer proxies — **do not assign VMs to it**.

```hcl
resource "google_compute_subnetwork" "aggregation_service_proxy_subnet" {
  name          = "aggregation-service-proxy-subnet"
  ip_cidr_range = "10.12.0.0/24"
  region        = var.region
  purpose       = "INTERNAL_HTTPS_LOAD_BALANCER"
  role          = "ACTIVE"
  network       = google_compute_network.vpc.id
}
```

### Migrating a Resource Across GCP Projects (Without Deleting)

To move a Terraform-managed resource to a different project without destroying the GCP resource:

```bash
# Step 1 — Remove from Terraform state only (does NOT delete the GCP resource)
terraform state rm google_compute_subnetwork.aggregation_service_proxy_subnet

# Step 2 — Import the existing resource into the new project's Terraform state
terraform import google_compute_subnetwork.aggregation_service_proxy_subnet \
  "projects/<new-project-id>/regions/<region>/subnetworks/aggregation-service-proxy-subnet"
```

> Do NOT `terraform destroy` + recreate — this causes downtime. Use `state rm` then `import`.

---

## Troubleshooting

### Pipeline fails with `ECONNREFUSED` or `Failed to resolve host`

**Root cause**: GIAS proxy not set, or pipeline running on wrong runner type.

**Fix**: Ensure `http_proxy: http://gias.sebank.se:8080` is in the workflow `env` block,
and `runs-on: self-hosted` is set (not `ubuntu-latest`).

### 401 Unauthorized pulling from Artifactory in pipeline

**Root cause**: Missing or expired `ARTIFACTORY_TOKEN` secret, or wrong `NODE_AUTH_TOKEN`.

**Fix**: Regenerate token in Artifactory → Edit Profile → Generate API Key. Update the secret
in GitHub repository Settings → Secrets and variables → Actions.

### Docker push fails: `denied: access forbidden`

**Root cause**: Wrong registry or missing Docker login step.

**Fix**: Ensure `docker/login-action` runs before any `docker push`, and the registry matches
the image tag prefix (`dtr-acc.sebank.se` for dev, `dtr.sebank.se` for prod).

### Terraform: `Error acquiring the state lock`

**Root cause**: Previous run left a state lock.

**Fix**: 
```bash
terraform force-unlock <lock-id>
```
