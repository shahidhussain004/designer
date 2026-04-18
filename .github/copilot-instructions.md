# SEB Corporate Network — Global Workspace Instructions

This workspace operates inside the **SEB air-gapped corporate network**. All development,
builds, and deployments must comply with the rules below. Copilot should always follow
these constraints when suggesting code, commands, or configurations.

---

## Critical Rules

1. **Never use the public internet for package installs, image pulls, or downloads.**
   All dependencies must come from internal Artifactory at **`repo7.sebank.se`**.

2. **Always use the correct proxy for the environment:**
   - Local developer workstation → `http://wss.sebank.se:80` (WSS)
   - CI/CD build servers / Docker containers → `http://gias.sebank.se:8080` (GIAS)
   - Internal `.sebank.se` and `.seb.net` hosts → **no proxy** (add to `no_proxy`)

3. **Never disable SSL verification in production code.**
   `NODE_TLS_REJECT_UNAUTHORIZED=0` and `strict-ssl false` are permitted only in
   development containers. Always prefer installing the SEB CA bundle.

4. **Always pull Docker base images from `sebdcp-docker.repo7.sebank.se`**, not Docker Hub.

5. **Never commit secrets, tokens, or passwords.** Use environment variables or
   secrets managers. Artifactory tokens go in `ARTIFACTORY_TOKEN` env/secret.

---

## Network Overview

| Component | URL / Host | Purpose |
|-----------|-----------|---------|
| Artifactory | `repo7.sebank.se` | Central package + image repository |
| Docker images | `sebdcp-docker.repo7.sebank.se` | Internal Docker Trusted Registry |
| DTR Dev | `dtr-acc.sebank.se` | Dev/staging container registry |
| DTR Prod | `dtr.sebank.se` | Production container registry |
| WSS Proxy | `wss.sebank.se:80` | Local workstation proxy |
| GIAS Proxy | `gias.sebank.se:8080` | CI/CD server proxy |
| PKI (certs) | `pki.seb.se` | SEB Internal PKI G3 certificate downloads |

## Proxy Quick Config

```
http_proxy  = http://wss.sebank.se:80       # (use gias:8080 on CI/CD)
https_proxy = http://wss.sebank.se:80
no_proxy    = .sebank.se,localhost,.seb.net,*.sebank.se,*.seb.net
```

## Package Registry Quick Reference

| Ecosystem | Registry URL |
|-----------|-------------|
| npm / yarn | `https://repo7.sebank.se/artifactory/api/npm/seb-npm` |
| Maven | `https://repo7.sebank.se/artifactory/maven` |
| NuGet | `https://repo7.sebank.se/artifactory/api/nuget/v3/nuget` |
| Go | `https://repo7.sebank.se/artifactory/api/go/golang` |
| pip | `https://repo7.sebank.se/artifactory/api/pypi/pypi/simple` |
| Cargo | `https://repo7.sebank.se/artifactory/api/cargo/crates-io/index/` |

---

## Instruction Files

Detailed guidance is split into focused instruction files. Copilot loads them
automatically when you work on matching files:

| File | applyTo | Covers |
|------|---------|--------|
| [proxy-network.instructions.md](instructions/proxy-network.instructions.md) | env/config/script files | Proxy setup, `no_proxy`, shell env vars for all OSes, dev `proxy.conf.json` |
| [certificates.instructions.md](instructions/certificates.instructions.md) | `*.ps1`, `*.sh`, `Dockerfile*` | SEB PKI G3 CA downloads, `NODE_EXTRA_CA_CERTS`, install steps per OS, automated setup script, certificate formats |
| [package-registries.instructions.md](instructions/package-registries.instructions.md) | `package.json`, `.npmrc`, `.yarnrc.yml`, `go.mod`, `Cargo.toml`, `settings.xml` | npm/yarn, nvm, pip, Go, Rust/Cargo, Maven/Gradle, NuGet config |
| [docker-containers.instructions.md](instructions/docker-containers.instructions.md) | `Dockerfile*`, `docker-compose*.yml` | Approved base images, multi-stage Dockerfile template, Alpine/Debian/Ubuntu repo redirection, mandatory Swarm labels |
| [cicd-pipelines.instructions.md](instructions/cicd-pipelines.instructions.md) | `.github/workflows/*.yml` | GitHub Actions with GIAS proxy, Artifactory login, per-language pipeline requirements, GCP Terraform patterns |
| [local-dev-setup.instructions.md](instructions/local-dev-setup.instructions.md) | `**` | Service port map, Android ADB reverse, Firefox browser certs, env var summary, verification checklist |
