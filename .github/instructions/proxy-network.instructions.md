---
description: "Use when configuring proxy settings, network access, environment variables for HTTP/HTTPS, or troubleshooting ECONNREFUSED/ETIMEDOUT errors. Covers WSS proxy for local dev, GIAS proxy for CI/CD, no_proxy patterns, shell env vars for Windows/macOS/Linux, and Angular/React dev proxy.conf.json."
applyTo: "**/.env*,**/proxy.conf*,**/proxy.conf.json,**/*.config.js,**/*.config.ts,**/*.sh,**/*.bat,**/*.ps1"
---

# Proxy & Network Configuration — SEB Corporate Network

This workspace runs inside the SEB air-gapped corporate network. All external traffic must
go through an internal proxy. There is **no direct internet access** from developer workstations
or CI/CD servers. All packages, images, and downloads come from internal Artifactory at
`repo7.sebank.se`.

---

## Network Architecture

```
Developer workstation
     │
     ▼
WSS Proxy (wss.sebank.se:80)  ──► Artifactory (repo7.sebank.se)
     │                                   │
     ▼                                   └──► npm, Maven, pip, Go, Docker images…
Internal services (.sebank.se, .seb.net)  ──► no proxy needed

CI/CD Build Server
     │
     ▼
GIAS Proxy (gias.sebank.se:8080)  ──► Artifactory / internet
```

## Proxy Selection Guide

| Environment | Proxy | Why |
|-------------|-------|-----|
| Developer workstation | `http://wss.sebank.se:80` | WSS = Web Security Service for workstations |
| CI/CD build pipeline | `http://gias.sebank.se:8080` | GIAS = Gateway Internet Access Service for servers |
| Docker Platform builds | None (use Artifactory directly) | All images/packages come from Artifactory |
| Local Docker containers | `http://gias.sebank.se:8080` | Same as CI/CD |
| Calls to `.sebank.se` / `.seb.net` | None — add to `no_proxy` | Internal, no proxy needed |

## `no_proxy` Pattern

Always set this — skips the proxy for all internal SEB hosts:

```
.sebank.se,localhost,.seb.net,*.sebank.se,*.seb.net
```

---

## Windows — Persistent Environment Variables

Open **Edit environment variables for your account**
(`Win+R` → `rundll32.exe sysdm.cpl,EditEnvironmentVariables`) and add:

| Variable | Value |
|----------|-------|
| `http_proxy` | `http://wss.sebank.se:80` |
| `https_proxy` | `http://wss.sebank.se:80` |
| `no_proxy` | `.sebank.se,localhost,.seb.net,*.sebank.se,*.seb.net` |
| `HTTP_PROXY` | `http://wss.sebank.se:80` |
| `HTTPS_PROXY` | `http://wss.sebank.se:80` |
| `NO_PROXY` | `.sebank.se,localhost,.seb.net,*.sebank.se,*.seb.net` |

**Restart your terminal** after setting these.

### PowerShell — Current Session

```powershell
$env:http_proxy  = "http://wss.sebank.se:80"
$env:https_proxy = "http://wss.sebank.se:80"
$env:no_proxy    = ".sebank.se,localhost,.seb.net,*.sebank.se,*.seb.net"
$env:HTTP_PROXY  = "http://wss.sebank.se:80"
$env:HTTPS_PROXY = "http://wss.sebank.se:80"
$env:NO_PROXY    = ".sebank.se,localhost,.seb.net,*.sebank.se,*.seb.net"
```

### Windows — .env File Template

```env
http_proxy=http://wss.sebank.se:80
https_proxy=http://wss.sebank.se:80
no_proxy=.sebank.se,localhost,.seb.net,*.sebank.se,*.seb.net
HTTP_PROXY=http://wss.sebank.se:80
HTTPS_PROXY=http://wss.sebank.se:80
NO_PROXY=.sebank.se,localhost,.seb.net,*.sebank.se,*.seb.net
```

---

## macOS / Linux — Shell Profile

Add to `~/.bashrc` or `~/.zshrc`:

```bash
export http_proxy=http://wss.sebank.se:80
export https_proxy=http://wss.sebank.se:80
export no_proxy=.sebank.se,localhost,.seb.net,*.sebank.se,*.seb.net
export HTTP_PROXY=http://wss.sebank.se:80
export HTTPS_PROXY=http://wss.sebank.se:80
export NO_PROXY=.sebank.se,localhost,.seb.net,*.sebank.se,*.seb.net
```

Reload:
```bash
source ~/.bashrc   # or source ~/.zshrc
```

---

## Dev Frontend Proxy (Angular / React)

For local frontend → backend forwarding, use `proxy.conf.json`:

```json
{
  "target": "http://localhost:3333",
  "secure": false
}
```

For multiple API routes:
```json
{
  "/api": {
    "target": "http://localhost:4000",
    "secure": false,
    "changeOrigin": true
  },
  "/auth": {
    "target": "http://localhost:18080",
    "secure": false,
    "changeOrigin": true
  }
}
```

---

## CI/CD — GIAS Proxy in GitHub Actions

```yaml
env:
  http_proxy:  http://gias.sebank.se:8080
  https_proxy: http://gias.sebank.se:8080
  no_proxy:    .sebank.se,localhost,.seb.net,*.sebank.se,*.seb.net
  HTTP_PROXY:  http://gias.sebank.se:8080
  HTTPS_PROXY: http://gias.sebank.se:8080
  NO_PROXY:    .sebank.se,localhost,.seb.net,*.sebank.se,*.seb.net
```

---

## Troubleshooting

### `ECONNREFUSED` or `ETIMEDOUT` when installing packages

**Root cause**: proxy not set, or npm/yarn pointed at public registry.

**Fix**:
```powershell
# Set proxy
$env:https_proxy = "http://wss.sebank.se:80"
# Set registry
npm config set registry https://repo7.sebank.se/artifactory/api/npm/seb-npm
npm config set https-proxy http://wss.sebank.se:80
npm cache clean --force
npm install
```

### `ENOTFOUND` for internal `.sebank.se` services

**Root cause**: These hosts are being sent through the proxy when they shouldn't be.

**Fix**: Ensure `no_proxy=.sebank.se,localhost,.seb.net` is set correctly.

### Proxy works in browser but not in terminal

**Root cause**: GUI apps pick up system proxy; terminal apps need explicit env vars.

**Fix**: Set `http_proxy` and `https_proxy` in your shell profile (see macOS/Linux section above).

### `curl` ignoring proxy

**Fix**: `curl` respects lowercase `http_proxy`. Alternatively pass it explicitly:
```bash
curl --proxy http://wss.sebank.se:80 https://repo7.sebank.se/...
```
