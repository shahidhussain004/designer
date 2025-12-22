# Port Allocation Strategy - Best Practices

## Current Situation

You've identified an important issue: **Grafana is already using port 3000**, which conflicts with standard Next.js defaults. This document outlines the best practice approach for port allocation in your development environment.

## Current Port Usage

| Service | Port | Type | Status |
|---------|------|------|--------|
| **Monitoring & Analytics** | | | |
| Grafana | 3000 | Visualization | ✅ Active |
| Prometheus | 9090 | Metrics DB | ✅ Active |
| **Frontend Applications** | | | |
| Admin Dashboard | 3001 | Vite + React | ⚠️ Active |
| Marketplace Web | 3001 | Next.js + React | ❌ Conflict |
| **Backend Services** | | | |
| Java Marketplace | 8080 | Spring Boot | ✅ Active |
| Go Messaging | 8081 | Go | ✅ Active |
| .NET LMS | 8082 | ASP.NET Core | ✅ Active |
| **Data & Infrastructure** | | | |
| PostgreSQL | 5432 | Database | ✅ Docker |
| MongoDB | 27017 | Database | ✅ Docker |
| Redis | 6379 | Cache | ✅ Docker |
| Kafka | 9092 | Event Stream | ✅ Docker |
| Kafka UI | 8080 | Management | ⚠️ Conflict |
| Zookeeper | 2181 | Coordination | ✅ Docker |
| Nginx | 8088 | Reverse Proxy | ✅ Docker |

## Port Allocation Tiers (Industry Best Practice)

```
0-1023:      System/Reserved (requires root)
1024-4999:   Development & Custom Services
5000-5999:   Development APIs (traditionally used for Flask, etc.)
6000-8999:   Backend Services (8000+)
3000-3999:   Frontend Development (3000-3999)
9000-9999:   Monitoring & Analytics
```

## Recommended Solution

### **Option A: Keep Grafana at 3000, Adjust Frontends (RECOMMENDED)**

**Why:** Grafana is already in production use, monitoring everything. Changing it affects:
- Docker Compose configuration
- Monitoring dashboards
- ALLOWED_ORIGINS CORS settings
- Kubernetes/container orchestration

**Changes Needed:**
```
Admin Dashboard (Vite):      3001  ← Keep current
Marketplace Web (Next.js):   3002  ← Change from 3001
Grafana:                     3000  ← Keep current
```

**Advantages:**
- ✅ Minimal changes to infrastructure
- ✅ Keeps monitoring in place
- ✅ No docker-compose.yml changes
- ✅ No CORS origin changes needed
- ✅ Follows industry convention (monitoring on 3000)
- ✅ Clear separation: 3000=Monitoring, 3001-3002=Frontend apps

**Files to Update:**
- `frontend/marketplace-web/package.json` (dev and start scripts: 3001 → 3002)

---

### **Option B: Move Grafana to Alternative Port**

**Why:** Frees up 3000 for standard Next.js default

**Changes Needed:**
```
Marketplace Web (Next.js):   3000  ← Change to default
Admin Dashboard (Vite):      3001  ← Keep current
Grafana:                     8888  ← Move from 3000
```

**Advantages:**
- ✅ Uses Next.js default port (3000)
- ✅ Standard industry convention
- ✅ Easier for team onboarding (3000 = always frontend)

**Disadvantages:**
- ❌ Requires docker-compose.yml changes
- ❌ Requires CORS origin update (http://localhost:8888)
- ❌ Breaks existing documentation
- ❌ Need to update monitoring access URLs
- ❌ Port 8888 feels arbitrary for monitoring tool
- ⚠️ Might disrupt team if Grafana is already integrated into workflows

**Files to Update:**
- `config/docker-compose.yml` (Grafana port mapping)
- `config/docker-compose.prod.yml` (if applicable)
- `services/marketplace-service/` (ALLOWED_ORIGINS, Docker Compose)
- `frontend/marketplace-web/package.json` (dev and start scripts: 3001 → 3000)

---

### **Option C: Use 5000+ Range for Frontends**

**Why:** Keeps frontends in separate tier, avoids 3000-3999 entirely

**Changes Needed:**
```
Admin Dashboard (Vite):      5001  ← Change from 3001
Marketplace Web (Next.js):   5000  ← Change from 3001
Grafana:                     3000  ← Keep current
```

**Advantages:**
- ✅ Completely separates monitoring tier from frontend tier
- ✅ Keeps Grafana/monitoring at standard 3000
- ✅ Clear tier separation (3000=Monitoring, 5000=Frontends, 8000=Backends)

**Disadvantages:**
- ❌ Non-standard for frontend development
- ❌ Confusing for developers (not convention)
- ❌ Requires updates to all frontend docs/guides
- ❌ Requires CORS updates in backend

---

## RECOMMENDATION: Option A ✅

**Use this approach:**

```
┌─ Monitoring Tier ─────────────────┐
│  Grafana:      http://localhost:3000  │
│  Prometheus:   http://localhost:9090  │
└────────────────────────────────────┘

┌─ Frontend Development Tier ────────┐
│  Admin Dashboard:  http://localhost:3001  │
│  Marketplace Web:  http://localhost:3002  │
└────────────────────────────────────┘

┌─ Backend Services Tier ────────┐
│  Java (8080), Go (8081), .NET (8082)  │
└──────────────────────────────────┘
```

### Why Option A is Best:

1. **Minimal Disruption** - Only change one file (marketplace-web/package.json)
2. **Industry Standard** - Port 3000 is traditionally monitoring/analytics
3. **No Docker Changes** - Keep container configuration stable
4. **CORS Compatible** - No backend changes needed (ALLOWED_ORIGINS already includes 3001)
5. **Team Friendly** - One port number change is easy to remember
6. **Documentation Clear** - Can easily explain "monitoring at 3000, apps at 3001-3002"
7. **Production Ready** - Keeps monitoring setup stable for team

## Implementation Steps

### If Going with Option A (Recommended):

1. **Update marketplace-web port:**
   ```bash
   # In frontend/marketplace-web/package.json
   # Change: "dev": "next dev -p 3001"
   # To:     "dev": "next dev -p 3000"
   
   # Change: "start": "next start -p 3001"
   # To:     "start": "next start -p 3000"
   ```

   Wait - **HOLD ON!** If Grafana uses 3000, use 3002 instead:
   
   ```bash
   # Change: "dev": "next dev -p 3001"
   # To:     "dev": "next dev -p 3002"
   
   # Change: "start": "next start -p 3001"
   # To:     "start": "next start -p 3002"
   ```

2. **Update frontend documentation** to reflect new URLs:
   - Admin Dashboard: `http://localhost:3001`
   - Marketplace Web: `http://localhost:3002`
   - Grafana: `http://localhost:3000`

3. **Verify API proxying** (should work without changes):
   ```bash
   # Both frontends proxy to:
   http://localhost:8080/api
   ```

4. **Update docker-compose for Kafka UI** (currently has port 8080 conflict):
   - Change Kafka UI port from 8080 to something like 8086 or 9001

### If Going with Option B (Move Grafana):

1. **Update docker-compose.yml:**
   ```yaml
   grafana:
     ports:
       - "8888:3000"  # Changed from "3000:3000"
   ```

2. **Update marketplace-web:**
   ```bash
   # Change to Next.js default:
   "dev": "next dev -p 3000"
   "start": "next start -p 3000"
   ```

3. **Update backend ALLOWED_ORIGINS** (in docker-compose.yml):
   ```
   # From: http://localhost:3000,http://localhost:3001
   # To:   http://localhost:8888,http://localhost:3000,http://localhost:3001
   ```

---

## Port Summary After Implementation (Option A - Recommended)

| Service | Port | URL | Notes |
|---------|------|-----|-------|
| **Monitoring** | | | |
| Grafana | 3000 | http://localhost:3000 | System monitoring dashboard |
| Prometheus | 9090 | http://localhost:9090 | Metrics database |
| **Frontend Apps** | | | |
| Admin Dashboard | 3001 | http://localhost:3001 | Admin interface (Vite) |
| Marketplace Web | 3002 | http://localhost:3002 | User marketplace (Next.js) |
| **Backend APIs** | | | |
| Java Marketplace | 8080 | http://localhost:8080 | Core marketplace API |
| Go Messaging | 8081 | http://localhost:8081 | Messaging service |
| .NET LMS | 8082 | http://localhost:8082 | Learning management |
| **Infrastructure (Docker)** | | | |
| PostgreSQL | 5432 | localhost:5432 | Primary database |
| MongoDB | 27017 | localhost:27017 | Document database |
| Redis | 6379 | localhost:6379 | Cache layer |
| Kafka | 9092 | localhost:9092 | Event streaming |
| Kafka UI | 8086 | http://localhost:8086 | Kafka management (should be changed) |
| Nginx | 8088 | http://localhost:8088 | Reverse proxy |

---

## Testing the New Configuration

### Test Port Availability
```powershell
# Check if ports are free before starting
netstat -ano | findstr ":3000\|:3001\|:3002\|:8080"

# Or use this PowerShell command:
@(3000, 3001, 3002, 8080, 8081, 8082) | ForEach-Object {
  try {
    $listener = New-Object System.Net.Sockets.TcpListener([System.Net.IPAddress]::Loopback, $_)
    $listener.Start()
    $listener.Stop()
    Write-Host "Port $_: FREE ✓"
  } catch {
    Write-Host "Port $_: IN USE ✗"
  }
}
```

### Verify All Services
```powershell
Write-Host "Checking service availability..."
@{
  "Grafana" = "http://localhost:3000"
  "Admin Dashboard" = "http://localhost:3001"
  "Marketplace Web" = "http://localhost:3002"
  "Java API" = "http://localhost:8080/actuator/health"
  "Go Service" = "http://localhost:8081/health"
  "Kafka UI" = "http://localhost:8086"
} | ForEach-Object {
  $_.GetEnumerator() | ForEach-Object {
    try {
      $response = Invoke-WebRequest -Uri $_.Value -ErrorAction SilentlyContinue
      Write-Host "$($_.Key): ✓" -ForegroundColor Green
    } catch {
      Write-Host "$($_.Key): ✗ (not running)" -ForegroundColor Red
    }
  }
}
```

---

## CORS Configuration

If using Option A, no changes needed. The Java Marketplace Service already has:
```
ALLOWED_ORIGINS: http://localhost:3000,http://localhost:3001
```

If using Option B, update to:
```
ALLOWED_ORIGINS: http://localhost:8888,http://localhost:3000,http://localhost:3001
```

If using Option C, update to:
```
ALLOWED_ORIGINS: http://localhost:3000,http://localhost:5000,http://localhost:5001
```

---

## Decision Summary

| Criteria | Option A | Option B | Option C |
|----------|----------|----------|----------|
| Files to Change | 1 | 5+ | 4+ |
| Docker Changes | None | Yes | None |
| CORS Changes | None | Yes | Yes |
| Convention Fit | Excellent | Good | Fair |
| Team Friction | Minimal | Medium | High |
| Documentation Impact | Minimal | Medium | High |
| **Recommendation** | **✅ USE THIS** | Not Recommended | Not Recommended |

---

## Conclusion

**Proceed with Option A:**
- Grafana remains at `3000` (monitoring tier)
- Admin Dashboard at `3001` (unchanged)
- **Marketplace Web changes from 3001 to 3002**

This requires changing only **one file** (`frontend/marketplace-web/package.json`) and maintains all existing infrastructure configuration.
