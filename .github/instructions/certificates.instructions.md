---
description: "Use when working with SSL/TLS certificates, setting up SEB Internal PKI G3, fixing UNABLE_TO_GET_ISSUER_CERT_LOCALLY errors, configuring NODE_EXTRA_CA_CERTS, downloading SEB root CA certificates, writing certificate setup scripts, or converting between PEM/DER/PKCS formats. Covers Windows/macOS/Linux installation, automated setup script, Node.js CA bundle, Git SSL config, and Docker certificate injection."
applyTo: "**/*.ps1,**/*.sh,**/*.bat,**/Dockerfile,**/Dockerfile.*"
---

# SSL / TLS Certificate Configuration — SEB Internal PKI G3

This workspace runs inside the SEB air-gapped corporate network, which performs **TLS inspection**
(legitimate man-in-the-middle for security monitoring). All HTTPS traffic is re-signed by SEB's
own Certificate Authority. Tools with their own certificate store — Node.js, Python, Go, Git,
curl — will fail with `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` unless the SEB Root CAs are added to
their trust store.

**Active PKI**: SEB Internal PKI G3 (since April 2024)
**Legacy PKI v2**: sunsetting June 30, 2025 — still needed for some older services

---

## Certificate Types (6 CAs)

| CA | Use Case |
|----|----------|
| **SEB Web CA ECC/RSA G3** | Internal websites and APIs (`*.sebank.se`) |
| **SEB Client Auth CA RSA G3** | Workload-to-service auth: Kafka, MQ, Pub/Sub, mTLS |
| **SEB WorkLoad CA ECC G3** | Container-to-container mTLS |
| **SEB CMP SUB CA1 RSA G3** | Windows domain servers (AD auto-enrollment) |
| **SEB NetOps CA RSA G3** | 802.1x devices: phones, printers — via SCEP |
| **SEB CodeSigning CA RSA G3** | Code signing, container image signing |

Trust chain:
```
Root CA  (install this in trust store)
  └── Intermediate CA  (signs end-entity certs)
        └── *.sebank.se / *.seb.net  (end-entity cert)
```

---

## Certificate Download URLs

| Certificate | URL |
|------------|-----|
| SEB Root CA ECC G3 | `http://pki.seb.se/g3/root/ecc/cert` |
| SEB Root CA RSA G3 | `http://pki.seb.se/g3/root/rsa/cert` |
| SEB Web CA ECC G3 | `http://pki.seb.se/4e5ce6db-c0fa-483b-86ae-e79165a7e8fc/seb-web-ca-ecc-g3.crt` |
| SEB Web CA RSA G3 | `http://pki.seb.se/83484fbc-e8c0-4c18-b234-67e8c2006923/seb-web-ca-rsa-g3.crt` |
| Legacy v2 Root CA | `http://seb-ca-v2.seb.se/SEB-CA-v2/SEB%20Root%20CA%20v2.pem` |
| GCP CA Bundle | `https://github.sebank.se/pages/seb-common/Developer-garden/resources/cloud/gcp/cacerts.pem` |

## ACME Endpoints (Automated Certificate Renewal)

| CA | ACME Directory |
|----|----------------|
| Web CA ECC G3 | `https://seb-web-ca-ecc-g3.ca.smallstep.sebank.se/acme/acme/directory` |
| Web CA RSA G3 | `https://seb-web-ca-rsa-g3.ca.smallstep.sebank.se/acme/acme/directory` |
| Client Auth CA | `https://seb-clientauth-ca-rsa-g3.ca.smallstep.sebank.se/acme/acme/directory` |
| WorkLoad CA | `https://seb-workload-ca-ecc-g3.ca.smallstep.sebank.se/acme/acme/directory` |

---

## Windows — Install Root CAs

### GUI Method
1. Download each `.crt` file
2. Double-click → **Install Certificate**
3. Select **Local Machine** → **Trusted Root Certification Authorities**

### PowerShell Method

```powershell
$certDir = "$env:USERPROFILE\.seb-certs"
New-Item -ItemType Directory -Path $certDir -Force

# Download all four CAs
Invoke-WebRequest -Uri "http://pki.seb.se/g3/root/ecc/cert" `
    -OutFile "$certDir\seb-root-ca-ecc-g3.crt" -UseBasicParsing
Invoke-WebRequest -Uri "http://pki.seb.se/g3/root/rsa/cert" `
    -OutFile "$certDir\seb-root-ca-rsa-g3.crt" -UseBasicParsing
Invoke-WebRequest -Uri "http://pki.seb.se/4e5ce6db-c0fa-483b-86ae-e79165a7e8fc/seb-web-ca-ecc-g3.crt" `
    -OutFile "$certDir\seb-web-ca-ecc-g3.crt" -UseBasicParsing
Invoke-WebRequest -Uri "http://pki.seb.se/83484fbc-e8c0-4c18-b234-67e8c2006923/seb-web-ca-rsa-g3.crt" `
    -OutFile "$certDir\seb-web-ca-rsa-g3.crt" -UseBasicParsing

# Install into Windows trust store
foreach ($cert in Get-ChildItem "$certDir\*.crt") {
    certutil -addstore -f "Root" $cert.FullName
}

# Build a single PEM bundle for Node.js / tools
Get-Content "$certDir\*.crt" | Set-Content "$certDir\seb-ca-bundle.crt"

# Set for current session
$env:NODE_EXTRA_CA_CERTS = "$certDir\seb-ca-bundle.crt"

# Set permanently
setx NODE_EXTRA_CA_CERTS "$certDir\seb-ca-bundle.crt"
```

### Windows Environment Variables to Set

| Variable | Value |
|----------|-------|
| `NODE_EXTRA_CA_CERTS` | `C:\Users\<your-sid>\.seb-certs\seb-ca-bundle.crt` |
| `REQUESTS_CA_BUNDLE` | `C:\Users\<your-sid>\cacerts.txt` |
| `HTTPLIB2_CA_CERTS` | `C:\Users\<your-sid>\cacerts.txt` |
| `HOME` | `C:\Users\<your-sid>` |
| `MINIKUBE_HOME` | `C:\Users\<your-sid>` |
| `GIT_SSL_CAINFO` | `C:\Users\<your-sid>\cacerts.txt` |

---

## macOS — Install Root CAs

```bash
# Download
curl http://pki.seb.se/g3/root/ecc/cert -o ~/seb-root-ca-ecc-g3.crt
curl http://pki.seb.se/g3/root/rsa/cert -o ~/seb-root-ca-rsa-g3.crt

# Add to System Keychain (trusted for all apps)
sudo security add-trusted-cert -d -r trustRoot \
    -k /Library/Keychains/System.keychain ~/seb-root-ca-ecc-g3.crt
sudo security add-trusted-cert -d -r trustRoot \
    -k /Library/Keychains/System.keychain ~/seb-root-ca-rsa-g3.crt

# Shell profile — Node.js CA bundle
mkdir -p ~/.seb-certs
cat ~/seb-root-ca-ecc-g3.crt ~/seb-root-ca-rsa-g3.crt > ~/.seb-certs/seb-ca-bundle.crt
echo 'export NODE_EXTRA_CA_CERTS="$HOME/.seb-certs/seb-ca-bundle.crt"' >> ~/.zshrc
echo 'export REQUESTS_CA_BUNDLE="$HOME/cacerts.txt"' >> ~/.zshrc
```

---

## Linux (Ubuntu/Debian) — Install Root CAs

```bash
# Download to system trust store
sudo curl http://pki.seb.se/g3/root/ecc/cert \
    -o /usr/local/share/ca-certificates/seb-root-ca-ecc-g3.crt
sudo curl http://pki.seb.se/g3/root/rsa/cert \
    -o /usr/local/share/ca-certificates/seb-root-ca-rsa-g3.crt

# Update system store
sudo update-ca-certificates

# Shell profile
echo 'export NODE_EXTRA_CA_CERTS="/etc/ssl/certs/ca-certificates.crt"' >> ~/.bashrc
echo 'export REQUESTS_CA_BUNDLE="/etc/ssl/certs/ca-certificates.crt"' >> ~/.bashrc
source ~/.bashrc
```

---

## GCP CA Bundle

```powershell
# Windows
curl https://github.sebank.se/pages/seb-common/Developer-garden/resources/cloud/gcp/cacerts.pem `
    -o "C:\Users\$env:USERNAME\cacerts.txt"
```

```bash
# macOS / Linux
curl https://github.sebank.se/pages/seb-common/Developer-garden/resources/cloud/gcp/cacerts.pem \
    -o ~/cacerts.txt
```

---

## Node.js — Providing the CA Bundle

`NODE_EXTRA_CA_CERTS` must point to a **PEM-format** file. Node.js appends these CAs to
its built-in Mozilla bundle — it does NOT replace them.

```powershell
# Windows — permanent
setx NODE_EXTRA_CA_CERTS "C:\Users\%USERNAME%\.seb-certs\seb-ca-bundle.crt"

# Windows — session only
$env:NODE_EXTRA_CA_CERTS = "$env:USERPROFILE\.seb-certs\seb-ca-bundle.crt"
```

```bash
# macOS / Linux
export NODE_EXTRA_CA_CERTS="$HOME/.seb-certs/seb-ca-bundle.crt"
```

---

## Git — SSL Certificate

```bash
git config --global http.sslCAInfo "C:/Users/<your-sid>/.seb-certs/seb-ca-bundle.crt"

# Or use the GCP bundle
git config --global http.sslCAInfo "C:/Users/<your-sid>/cacerts.txt"

# GPG signing (Windows with Scoop)
git config --global gpg.program "C:\Users\<your-sid>\scoop\apps\gpg\current\bin\gpg.exe"
```

---

## Automated Setup Script (Windows)

Save or run as `setup-seb-certificates.ps1`:

```powershell
$certDir = "$env:USERPROFILE\.seb-certs"
New-Item -ItemType Directory -Path $certDir -Force | Out-Null

$certs = @(
    @{ Name="SEB Root CA ECC G3"; Url="http://pki.seb.se/g3/root/ecc/cert";                                                           File="seb-root-ca-ecc-g3.crt" }
    @{ Name="SEB Root CA RSA G3"; Url="http://pki.seb.se/g3/root/rsa/cert";                                                           File="seb-root-ca-rsa-g3.crt" }
    @{ Name="SEB Web CA ECC G3";  Url="http://pki.seb.se/4e5ce6db-c0fa-483b-86ae-e79165a7e8fc/seb-web-ca-ecc-g3.crt";                 File="seb-web-ca-ecc-g3.crt" }
    @{ Name="SEB Web CA RSA G3";  Url="http://pki.seb.se/83484fbc-e8c0-4c18-b234-67e8c2006923/seb-web-ca-rsa-g3.crt";                 File="seb-web-ca-rsa-g3.crt" }
)

foreach ($cert in $certs) {
    Write-Host "Downloading $($cert.Name)..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri $cert.Url -OutFile (Join-Path $certDir $cert.File) -UseBasicParsing
}

# Build PEM bundle
$bundle = Join-Path $certDir "seb-ca-bundle.crt"
Get-Content (Join-Path $certDir "*.crt") | Set-Content $bundle

# Configure npm
npm config set cafile $bundle
npm config set strict-ssl true
npm config set registry https://repo7.sebank.se/artifactory/api/npm/seb-npm

# Write helper .env file
@"
NODE_EXTRA_CA_CERTS=$bundle
NODE_TLS_REJECT_UNAUTHORIZED=0
NPM_CAFILE=$bundle
"@ | Out-File ".env.seb-certs" -Encoding UTF8

Write-Host "`nDone! Load env vars with: . .\.env.seb-certs" -ForegroundColor Green
Write-Host "CA bundle: $bundle" -ForegroundColor Cyan
```

---

## Docker — Inject SEB Certificates in Dockerfile

```dockerfile
# Alpine Linux
RUN apk add --no-cache ca-certificates curl && \
    curl -sL http://seb-ca-v2.seb.se/SEB-CA-v2/SEB%20Root%20CA%20v2.pem \
         -o /usr/local/share/ca-certificates/SEB_Root_CA_v2.crt 2>/dev/null || true && \
    curl -sL http://pki.seb.se/g3/root/ecc/cert \
         -o /usr/local/share/ca-certificates/SEB_Root_CA_ECC_G3.crt 2>/dev/null || true && \
    curl -sL http://pki.seb.se/g3/root/rsa/cert \
         -o /usr/local/share/ca-certificates/SEB_Root_CA_RSA_G3.crt 2>/dev/null || true && \
    update-ca-certificates

# Debian/Ubuntu
RUN apt-get update && apt-get install -y ca-certificates curl && \
    curl -sL http://pki.seb.se/g3/root/ecc/cert \
         -o /usr/local/share/ca-certificates/seb-root-ca-ecc-g3.crt && \
    curl -sL http://pki.seb.se/g3/root/rsa/cert \
         -o /usr/local/share/ca-certificates/seb-root-ca-rsa-g3.crt && \
    update-ca-certificates

# ENV block to ensure Node.js also trusts them
ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt \
    SSL_CERT_FILE=/etc/ssl/certs/ca-certificates.crt \
    SSL_CERT_DIR=/etc/ssl/certs
```

---

## Certificate Formats & Conversion

| Format | Extensions | Contains Key | Notes |
|--------|-----------|--------------|-------|
| PEM | `.pem`, `.crt`, `.cer` | Optional | Base64; `-----BEGIN CERTIFICATE-----` |
| DER | `.der` | No | Binary, not human-readable |
| PKCS#7 | `.p7b`, `.p7c` | No | Base64, chain only, no private key |
| PKCS#12 | `.pfx`, `.p12` | Yes | Binary; cert + chain + private key |

```bash
# DER / X.509 → PEM
openssl x509 -in cert.cer -outform PEM -out cert.pem

# PEM → DER
openssl x509 -outform der -in cert.pem -out cert.der
certutil -decode cert.pem cert.der          # Windows

# DER → PEM
openssl x509 -inform der -in cert.der -out cert.pem
certutil -encode cert.crt cert.pem          # Windows

# PEM → PKCS#7
openssl crl2pkcs7 -nocrl -certfile cert.pem -out cert.p7b -certfile ca.cer

# PKCS#7 → PEM
openssl pkcs7 -print_certs -in cert.p7b -out cert.pem

# PFX → PEM
openssl pkcs12 -in cert.pfx -out cert.pem

# PFX → PKCS#8 (key without password)
openssl pkcs12 -in cert.pfx -nocerts -nodes -out key.pem
openssl pkcs8 -in key.pem -topk8 -nocrypt -out key.pk8

# P7B → PFX
openssl pkcs7 -print_certs -in cert.p7b -out cert.cer
openssl pkcs12 -export -in cert.cer -inkey private.key -out cert.pfx -certfile ca.cer

# Inspect a PEM certificate
openssl x509 -in cert.pem -text -noout

# Concatenate multiple certs into one bundle
cat seb-root-ca-ecc-g3.crt seb-root-ca-rsa-g3.crt seb-web-ca-ecc-g3.crt > seb-ca-bundle.crt
```

---

## Troubleshooting

### `UNABLE_TO_GET_ISSUER_CERT_LOCALLY`

**Root cause**: Node.js cannot verify SEB's internal CA.

**Fix**:
```powershell
npm cache clean --force
$env:NODE_EXTRA_CA_CERTS = "$env:USERPROFILE\.seb-certs\seb-ca-bundle.crt"
npm install
```

**Dev-only workaround** (never use in production):
```powershell
$env:NODE_TLS_REJECT_UNAUTHORIZED = "0"
```

### Certificate download fails

**Root cause**: WSS proxy not configured.

**Fix**:
```powershell
$env:https_proxy = "http://wss.sebank.se:80"
.\setup-seb-certificates.ps1
```

### Git SSL errors

```bash
# Permanent fix
git config --global http.sslCAInfo "C:/Users/<your-sid>/.seb-certs/seb-ca-bundle.crt"

# One-time bypass (debugging only)
git -c http.sslVerify=false clone <url>
```

### Docker build TLS errors

Add the SEB cert download block to your Dockerfile (see Docker section above), or for
dev builds only:
```dockerfile
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
```
