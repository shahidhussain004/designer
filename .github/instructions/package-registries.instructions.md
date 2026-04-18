---
description: "Use when configuring package managers, writing package.json, .npmrc, .yarnrc.yml, go.mod, Cargo.toml, requirements.txt, pom.xml, settings.xml, nuget.config, or installing dependencies with npm/yarn/pip/go/cargo/maven/nuget. All packages must come from Artifactory at repo7.sebank.se — never from the public internet."
applyTo: "**/package.json,**/package-lock.json,**/.npmrc,**/.yarnrc.yml,**/.yarnrc,**/go.mod,**/go.sum,**/Cargo.toml,**/Cargo.lock,**/requirements*.txt,**/setup.py,**/pyproject.toml,**/pom.xml,**/build.gradle,**/build.gradle.kts,**/settings.xml,**/nuget.config,**/*.csproj"
---

# Package Registries — SEB Artifactory Configuration

All package managers must pull dependencies from **internal Artifactory at `repo7.sebank.se`**.
Direct internet access is blocked. Never reference `registry.npmjs.org`, `pypi.org`,
`proxy.golang.org`, `crates.io`, `nuget.org`, or `repo1.maven.org` in configuration files.

---

## Registry URLs — All Ecosystems

| Ecosystem | Internal Registry URL |
|-----------|----------------------|
| npm / yarn | `https://repo7.sebank.se/artifactory/api/npm/seb-npm` |
| Maven / Gradle | `https://repo7.sebank.se/artifactory/maven` |
| NuGet (.NET) | `https://repo7.sebank.se/artifactory/api/nuget/v3/nuget` |
| Go modules | `https://repo7.sebank.se/artifactory/api/go/golang` |
| Python pip | `https://repo7.sebank.se/artifactory/api/pypi/pypi/simple` |
| Rust / Cargo | `https://repo7.sebank.se/artifactory/api/cargo/crates-io/index/` |
| Docker images | `sebdcp-docker.repo7.sebank.se` |
| Alpine Linux apk | `https://repo7.sebank.se:443/artifactory/alpinelinux-org/` |
| Debian/Ubuntu apt | `https://repo7.sebank.se/artifactory/deb` |

---

## npm

### ~/.npmrc

```ini
registry=https://repo7.sebank.se/artifactory/api/npm/seb-npm
https-proxy=http://wss.sebank.se:80
noproxy=.sebank.se
strict-ssl=true
cafile=C:\Users\<your-sid>\.seb-certs\seb-ca-bundle.crt
```

### npm CLI Commands

```bash
npm config set registry https://repo7.sebank.se/artifactory/api/npm/seb-npm
npm config set https-proxy http://wss.sebank.se:80
npm config set noproxy .sebank.se
npm config set cafile "C:\Users\%USERNAME%\.seb-certs\seb-ca-bundle.crt"
npm config set strict-ssl true
```

### Verify

```bash
npm config get registry
# → https://repo7.sebank.se/artifactory/api/npm/seb-npm

npm config get cafile
npm config get strict-ssl
```

---

## Yarn Berry (v2+) — .yarnrc.yml

```yaml
defaultSemverRangePrefix: ""
nodeLinker: node-modules

npmRegistryServer: "https://repo7.sebank.se/artifactory/api/npm/seb-npm"

npmRegistries:
  "https://repo7.sebank.se/artifactory/api/npm/seb-npm":
    npmAlwaysAuth: true
    npmAuthToken: "<base64-encoded-user:api-token>"

httpProxy: "http://wss.sebank.se:80"
httpsProxy: "http://wss.sebank.se:80"

# Set to true once SEB CA bundle is installed system-wide
enableStrictSsl: false
httpTimeout: 180000
httpRetry: 10
networkConcurrency: 4
compressionLevel: 0

unsafeHttpWhitelist:
  - "repo7.sebank.se"
```

> Get `npmAuthToken` from Artifactory → Edit Profile → Generate API Key.
> The token is the base64 encoding of `<your-s-id>:<api-key>`.

## Yarn Classic (v1) — ~/.yarnrc

```
registry "https://repo7.sebank.se/artifactory/api/npm/seb-npm"
https-proxy "http://wss.sebank.se:80"
strict-ssl false
```

---

## nvm (Node Version Manager)

```bash
# Windows — configure proxy so nvm can download Node binaries
nvm proxy http://wss.sebank.se:80

# Install and activate a Node version
nvm install 20
nvm use 20

# Verify
node -v
npm -v
```

---

## Python / pip

```bash
# Point pip at Artifactory
pip config set global.index-url https://repo7.sebank.se/artifactory/api/pypi/pypi/simple

# Install system cert bridge (so pip trusts SEB CA without manual setup)
pip install --no-cache-dir --trusted-host files.pythonhosted.org pip-system-certs
```

### pip.ini / pip.conf

```ini
[global]
index-url = https://repo7.sebank.se/artifactory/api/pypi/pypi/simple
trusted-host = repo7.sebank.se
proxy = http://wss.sebank.se:80
```

### Environment Variables

```bash
export REQUESTS_CA_BUNDLE="$HOME/cacerts.txt"
export HTTPLIB2_CA_CERTS="$HOME/cacerts.txt"
```

Windows:
| Variable | Value |
|----------|-------|
| `REQUESTS_CA_BUNDLE` | `C:\Users\<your-sid>\cacerts.txt` |
| `HTTPLIB2_CA_CERTS` | `C:\Users\<your-sid>\cacerts.txt` |

---

## Go

### Environment Variables

```bash
export GOPROXY="https://repo7.sebank.se/artifactory/api/go/golang"
export GONOSUMCHECK="*"
export SSL_CERT_FILE="$HOME/cacerts.txt"
```

### go.env (project-level)

```
GOPROXY=https://repo7.sebank.se/artifactory/api/go/golang
GONOSUMCHECK=*
GOFLAGS=-mod=mod
```

### go.mod

Do not add proxy references in `go.mod`. Set the proxy via env var or `go env -w`:

```bash
go env -w GOPROXY=https://repo7.sebank.se/artifactory/api/go/golang
go env -w GONOSUMCHECK=*
```

---

## Rust / Cargo

### ~/.cargo/config.toml

```toml
[source.artifactory-remote]
registry = "sparse+https://repo7.sebank.se/artifactory/api/cargo/crates-io/index/"

[source.crates-io]
replace-with = "artifactory-remote"

[http]
proxy = "http://wss.sebank.se:80"
cainfo = "C:/Users/<your-sid>/cacerts.txt"  # Windows path — adjust for macOS/Linux
```

---

## Java / Maven

### ~/.m2/settings.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<settings>
  <mirrors>
    <mirror>
      <id>seb-artifactory</id>
      <mirrorOf>*</mirrorOf>
      <url>https://repo7.sebank.se/artifactory/maven</url>
    </mirror>
  </mirrors>

  <proxies>
    <proxy>
      <id>wss</id>
      <active>true</active>
      <protocol>http</protocol>
      <host>wss.sebank.se</host>
      <port>80</port>
      <nonProxyHosts>*.sebank.se|localhost|*.seb.net</nonProxyHosts>
    </proxy>
  </proxies>

  <servers>
    <server>
      <id>seb-artifactory</id>
      <username>${env.ARTIFACTORY_USER}</username>
      <password>${env.ARTIFACTORY_TOKEN}</password>
    </server>
  </servers>
</settings>
```

> Get Encrypted Password: Artifactory UI → top-right avatar → **Edit Profile** → **Encrypted Password**.

### build.gradle (Kotlin DSL)

```kotlin
repositories {
    maven {
        url = uri("https://repo7.sebank.se/artifactory/maven")
        credentials {
            username = System.getenv("ARTIFACTORY_USER")
            password = System.getenv("ARTIFACTORY_TOKEN")
        }
    }
}
```

---

## .NET / NuGet

### CLI Setup

```bash
# Add SEB Artifactory source
dotnet nuget add source "https://repo7.sebank.se/artifactory/api/nuget/v3/nuget" \
    --name "SEB Artifactory" \
    --username "$ARTIFACTORY_USER" \
    --password "$ARTIFACTORY_TOKEN"

# Disable public nuget.org
dotnet nuget disable source nuget.org
```

### nuget.config

```xml
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <clear />
    <add key="seb-artifactory"
         value="https://repo7.sebank.se/artifactory/api/nuget/v3/nuget" />
  </packageSources>
  <packageSourceCredentials>
    <seb-artifactory>
      <add key="Username" value="%ARTIFACTORY_USER%" />
      <add key="ClearTextPassword" value="%ARTIFACTORY_TOKEN%" />
    </seb-artifactory>
  </packageSourceCredentials>
</configuration>
```

---

## Troubleshooting

### Yarn / Corepack tries to download from `repo.yarnpkg.com`

**Root cause**: Air-gapped network blocks external download; Corepack defaults to public URL.

**Fix**:
```bash
# Disable Corepack and install Yarn from Artifactory
npm install -g yarn --registry https://repo7.sebank.se/artifactory/api/npm/seb-npm

# Or pin registry in .yarnrc.yml
# npmRegistryServer: "https://repo7.sebank.se/artifactory/api/npm/seb-npm"
```

### npm install fails with `ECONNREFUSED` or `ETIMEDOUT`

**Root cause**: npm still pointing at public registry.

**Fix**:
```bash
npm config set registry https://repo7.sebank.se/artifactory/api/npm/seb-npm
npm config set https-proxy http://wss.sebank.se:80
npm cache clean --force
npm install
```

### 401 Unauthorized from Artifactory

**Root cause**: Missing or expired credentials.

**Fix**: Regenerate your API token in Artifactory → Edit Profile → Generate API Key, then update `.npmrc` / `.yarnrc.yml` / `settings.xml`.

### Go modules: `GOPROXY list is exhausted`

**Fix**:
```bash
go env -w GOPROXY=https://repo7.sebank.se/artifactory/api/go/golang
go env -w GONOSUMCHECK=*
```
