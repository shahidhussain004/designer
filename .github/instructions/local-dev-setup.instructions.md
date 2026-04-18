---
description: "Use when setting up a local development environment, configuring Android ADB for physical device testing, mapping service ports, verifying environment variables, troubleshooting React Native Metro bundler connections, configuring Firefox for internal SEB sites, or running the environment verification checklist. Covers port map for all local services, adb reverse tcp commands, Firefox certificate setup, and all env var assignments needed for a new developer machine."
applyTo: "**"
---

# Local Development Setup — SEB Corporate Network

This file covers everything a developer needs to set up and verify their local workstation
for development in the SEB corporate network. It includes the service port map, Android
physical device forwarding, environment variable summary, Firefox browser configuration,
and a verification checklist.

See the other instruction files for detailed proxy, certificate, package registry, and
Docker configuration.

---

## Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 24.x (or via nvm) | Use nvm with WSS proxy configured |
| Yarn | 1.x classic or Berry | Install from Artifactory, not Corepack |
| Docker Desktop | Latest | Point at internal registry |
| Android Studio | Latest | Includes ADB platform tools |
| JDK | 17+ | For Android builds; also needed for Java services |
| CocoaPods | Latest (macOS) | For iOS builds |
| Git | Latest | Configure `http.sslCAInfo` after install |

---

## Local Service Port Map

All services run locally on the following ports:

| Service | Port | URL | Notes |
|---------|------|-----|-------|
| API Gateway | `4000` | `http://localhost:4000` | Entry point for all frontend requests |
| Core API | `4008` | `http://localhost:4008` | Backend business logic |
| Fake / Stub Server | `4006` | `http://localhost:4006` | Mock server for dev |
| Metro Bundler (RN) | `8081` | `http://localhost:8081` | React Native JS bundler |
| NX / Angular Dev Server | `3333` | `http://localhost:3333` | NX app dev server |
| Keycloak (Auth) | `18080` | `http://localhost:18080` | Auth server |
| PostgreSQL | `5432` | `localhost:5432` | Primary database |
| Redis | `6379` | `localhost:6379` | Cache / session store |
| Zipkin (Tracing) | `9411` | `http://localhost:9411` | Distributed tracing UI |

---

## Android — Physical Device (ADB Reverse)

When testing on a physical Android device via USB, the device cannot reach `localhost` on
your workstation directly. Use `adb reverse` to forward the workstation ports to the device.

**Run these commands after connecting the device via USB, before starting the app:**

```bash
# Verify device is connected and USB debugging is enabled
adb devices

# Forward all required ports
adb reverse tcp:4000 tcp:4000     # API Gateway
adb reverse tcp:4008 tcp:4008     # Core API
adb reverse tcp:4006 tcp:4006     # Fake / Stub server
adb reverse tcp:8081 tcp:8081     # Metro Bundler (React Native)
adb reverse tcp:18080 tcp:18080   # Keycloak (optional, if auth tested locally)
adb reverse tcp:3333 tcp:3333     # NX dev server (optional)
```

**Then start the app:**
```bash
yarn android
# or
npx expo run:android
```

### Android Emulator

Emulators use `10.0.2.2` to reach the host machine's `localhost`. No `adb reverse` needed
unless you have changed the gateway address.

---

## Environment Variables — Complete Setup

Set all of these on a fresh workstation. On Windows, use
`Win+R → rundll32.exe sysdm.cpl,EditEnvironmentVariables`.

### Network & Proxy

| Variable | Value |
|----------|-------|
| `http_proxy` | `http://wss.sebank.se:80` |
| `https_proxy` | `http://wss.sebank.se:80` |
| `HTTP_PROXY` | `http://wss.sebank.se:80` |
| `HTTPS_PROXY` | `http://wss.sebank.se:80` |
| `no_proxy` | `.sebank.se,localhost,.seb.net,*.sebank.se,*.seb.net` |
| `NO_PROXY` | `.sebank.se,localhost,.seb.net,*.sebank.se,*.seb.net` |

### SSL / Certificates

| Variable | Value |
|----------|-------|
| `NODE_EXTRA_CA_CERTS` | `C:\Users\<your-sid>\.seb-certs\seb-ca-bundle.crt` |
| `NODE_TLS_REJECT_UNAUTHORIZED` | `1` (production) / `0` (dev containers only) |
| `REQUESTS_CA_BUNDLE` | `C:\Users\<your-sid>\cacerts.txt` |
| `HTTPLIB2_CA_CERTS` | `C:\Users\<your-sid>\cacerts.txt` |
| `SSL_CERT_FILE` | `/etc/ssl/certs/ca-certificates.crt` (Linux) |
| `GIT_SSL_CAINFO` | `C:\Users\<your-sid>\cacerts.txt` |

### General / Tools

| Variable | Value |
|----------|-------|
| `HOME` | `C:\Users\<your-sid>` |
| `MINIKUBE_HOME` | `C:\Users\<your-sid>` |
| `GOPROXY` | `https://repo7.sebank.se/artifactory/api/go/golang` |
| `GITHUB_TOKEN` | `<personal-access-token with public_repo access>` |
| `ARTIFACTORY_USER` | `<your-s-id>` |
| `ARTIFACTORY_TOKEN` | `<api-token from Artifactory>` |

### PowerShell — Set All for Current Session

```powershell
# Proxy
$env:http_proxy  = "http://wss.sebank.se:80"
$env:https_proxy = "http://wss.sebank.se:80"
$env:no_proxy    = ".sebank.se,localhost,.seb.net,*.sebank.se,*.seb.net"
$env:HTTP_PROXY  = "http://wss.sebank.se:80"
$env:HTTPS_PROXY = "http://wss.sebank.se:80"
$env:NO_PROXY    = ".sebank.se,localhost,.seb.net,*.sebank.se,*.seb.net"

# Certificates
$env:NODE_EXTRA_CA_CERTS = "$env:USERPROFILE\.seb-certs\seb-ca-bundle.crt"
$env:REQUESTS_CA_BUNDLE  = "$env:USERPROFILE\cacerts.txt"
$env:HTTPLIB2_CA_CERTS   = "$env:USERPROFILE\cacerts.txt"

# Go
$env:GOPROXY = "https://repo7.sebank.se/artifactory/api/go/golang"
```

---

## Firefox Browser Configuration

Firefox maintains its own certificate store and does not automatically trust Windows system CAs.

### Import SEB Root CA Certificates

1. Open Firefox → `about:preferences#privacy`
2. Scroll to **Certificates** section → click **Show Certificates**
3. Select the **Authorities** tab → click **Import**
4. Import each of these files (downloaded during cert setup):
   - `seb-root-ca-ecc-g3.crt`
   - `seb-root-ca-rsa-g3.crt`
   - `seb-web-ca-ecc-g3.crt`
   - `seb-web-ca-rsa-g3.crt`
5. For each, check **"Trust this CA to identify websites"**

### about:config Settings

Open `about:config` (`Accept the Risk`) and set:

| Preference | Value |
|------------|-------|
| `network.automatic-ntlm-auth.trusted-uris` | `.sebank.se,https://meet.seb.se` |
| `network.automatic-ntlm-auth.allow-non-fqdn` | `true` |
| `network.negotiate-auth.delegation-uris` | `.sebank.se,https://meet.seb.se` |
| `network.negotiate-auth.trusted-uris` | `.sebank.se,https://meet.seb.se` |
| `security.tls.version.fallback-limit` | `3` |
| `security.tls.version.max` | `3` |
| `security.OCSP.enabled` | `0` |
| `security.enterprise_roots.auto-enabled` | `true` |
| `security.enterprise_roots.enabled` | `true` |

---

## First-Time Setup Checklist

Run through this list when setting up a new development machine:

```
□ 1. Set all proxy env vars (http_proxy, https_proxy, no_proxy)
□ 2. Download SEB Root CAs and install into Windows trust store
□ 3. Run setup-seb-certificates.ps1 to create Node.js CA bundle
□ 4. Set NODE_EXTRA_CA_CERTS, REQUESTS_CA_BUNDLE, HTTPLIB2_CA_CERTS
□ 5. Configure npm: registry + cafile + strict-ssl
□ 6. Configure .yarnrc.yml with Artifactory registry + auth token
□ 7. Set git http.sslCAInfo to CA bundle path
□ 8. Configure nvm proxy
□ 9. Import SEB certs into Firefox + set about:config
□ 10. Set GOPROXY for Go projects
□ 11. Add Docker Desktop to use internal registry (no Docker Hub)
□ 12. Enable USB debugging on Android test device
□ 13. Run adb reverse for all required ports before testing on device
```

---

## Verification Checklist

Run these commands after initial setup to confirm everything is working:

```powershell
# 1. Proxy env vars
Write-Host $env:http_proxy          # should be http://wss.sebank.se:80
Write-Host $env:NODE_EXTRA_CA_CERTS # should point to seb-ca-bundle.crt

# 2. npm registry and CA
npm config get registry    # https://repo7.sebank.se/artifactory/api/npm/seb-npm
npm config get cafile      # path to seb-ca-bundle.crt
npm config get strict-ssl  # true

# 3. CA bundle file exists
Test-Path "$env:USERPROFILE\.seb-certs\seb-ca-bundle.crt"   # True

# 4. Node.js TLS
node -e "const tls = require('tls'); console.log('TLS ok', tls.getCiphers().length)"

# 5. Yarn dry run (no actual install)
yarn install --dry-run

# 6. Docker login to internal registry
docker login sebdcp-docker.repo7.sebank.se

# 7. Git SSL config
git config --global http.sslCAInfo

# 8. Android ADB device list
adb devices

# 9. npm install dry-run
npm install lodash --dry-run

# 10. Python TLS (if Python is used)
python -c "import requests; r = requests.get('https://repo7.sebank.se'); print('Python TLS ok', r.status_code)"
```

---

## Troubleshooting

### Metro bundler not reachable on physical Android device

**Root cause**: `adb reverse` not run after connecting device.

**Fix**:
```bash
adb devices                        # confirm device appears
adb reverse tcp:8081 tcp:8081
adb reverse tcp:4000 tcp:4000
```

### `adb reverse` fails: `error: no devices/emulators found`

**Fix**: Enable **Developer Options** and **USB Debugging** on the Android device.
Go to Settings → About phone → tap Build number 7 times → Developer Options → USB Debugging.

### React Native app shows network error but Metro is running

**Root cause**: Port not forwarded to device, or Metro not bound to `0.0.0.0`.

**Fix**:
1. Run all `adb reverse tcp` commands
2. Ensure Metro is running: `npx react-native start` or `yarn start`
3. On device, shake to open Dev Menu → Change Bundle Location → set to `localhost:8081`

### Firefox shows `SEC_ERROR_UNKNOWN_ISSUER` on internal sites

**Root cause**: SEB Root CAs not imported into Firefox.

**Fix**: Follow the Firefox certificate import steps above. Firefox does NOT use the Windows
certificate store by default.

### Environment variables not picked up after setting them

**Fix**: Restart your terminal application. On Windows, **close and reopen** PowerShell or
Command Prompt — `setx` changes do not apply to the current session.
