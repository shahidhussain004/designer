# Frontend Applications - Port Configuration & Testing Guide

## Problem Summary

You identified an important issue: **both frontend applications are configured to use port 3001**:

- **Admin Dashboard** (Vite React) - port 3001 (configured in `vite.config.ts`)
- **Marketplace Web** (Next.js) - port 3001 (configured in `package.json` script: `next dev -p 3001`)

**This is NOT intentional** - they cannot both run simultaneously on the same port. One will fail to start.

---

## Application Overview

| Application | Framework | Port | Purpose | Target Audience |
|-------------|-----------|------|---------|-----------------|
| **Admin Dashboard** | Vite + React 18 | 3001 | Dashboard for admins & support staff | Admins, System Operators |
| **Marketplace Web** | Next.js 15 | 3001 (should be 3000) | Main marketplace interface | Users, Designers, Clients |

---

## Port Configuration Issues

### Current Configuration

```
admin-dashboard/vite.config.ts
├── server.port: 3001 ✅ Intentional
└── proxy /api → http://localhost:8080

marketplace-web/package.json
├── dev script: "next dev -p 3001" ❌ Conflict
└── next.config.js: NEXT_PUBLIC_API_URL → http://localhost:8080/api
```

### Why the Conflict Exists

1. **Admin Dashboard** uses Vite (development server that can be modified)
2. **Marketplace Web** uses Next.js (has default port 3000)
3. **Marketplace Web's package.json** explicitly sets `-p 3001`, creating the conflict

---

## Solution: Fix Port Assignments

### Recommended Port Configuration

```
Admin Dashboard:      3001  (Development interface for admins)
Marketplace Web:      3000  (Main user-facing marketplace)
LMS Dashboard:        3002  (If needed in future)
```

### Fix the Conflict

#### Step 1: Update Marketplace Web package.json

Replace:
```json
"dev": "next dev -p 3001",
"start": "next start -p 3001",
```

With:
```json
"dev": "next dev -p 3000",
"start": "next start -p 3000",
```

#### Step 2: Verify Admin Dashboard Configuration

Admin Dashboard is already correctly set to 3001 in `vite.config.ts` ✅

---

## Frontend Architecture

### Admin Dashboard

**Stack:** Vite + React 18 + TypeScript  
**Dependencies:**
- React Router (navigation)
- TanStack Query/React Query (data fetching)
- Zustand (state management)
- Axios (HTTP client)
- Chart.js (analytics charts)
- Headless UI (accessible components)

**Purpose:**
- Admin panel for system management
- Analytics and reporting
- User management
- Content moderation
- Settings/configuration

### Marketplace Web

**Stack:** Next.js 15 + React 19 + TypeScript  
**Dependencies:**
- TanStack Query (data fetching)
- Zustand (state management)
- Axios (HTTP client)
- React Hook Form + Zod (form validation)
- JWT Decode (token handling)

**Purpose:**
- Main marketplace interface
- Job browsing and posting
- User profiles
- Communication interface
- Payment integration

---

## How They Connect to Backend

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer                           │
├─────────────────────┬───────────────────┬──────────────────┤
│ Admin Dashboard     │ Marketplace Web   │ (Future: LMS)    │
│ Port: 3001          │ Port: 3000        │ Port: 3002       │
│ (Vite + React)      │ (Next.js)         │                  │
├─────────────────────┴───────────────────┴──────────────────┤
│                    Backend Gateway                          │
│  Proxy all /api requests to backend services               │
├─────────────────┬─────────────────┬──────────────────────┤
│ Java Service    │ Go Service      │ .NET Service         │
│ 8080            │ 8081            │ 8082                 │
└─────────────────┴─────────────────┴──────────────────────┘
```

### API Routing

Both frontends proxy API requests:

**Admin Dashboard:**
```typescript
// vite.config.ts
proxy: {
  '/api': {
    target: 'http://localhost:8080',  // Java Marketplace Service
    changeOrigin: true,
  },
}
```

**Marketplace Web:**
```javascript
// next.config.js
env: {
  NEXT_PUBLIC_API_URL: 'http://localhost:8080/api'
}
```

---

## Installation & Setup

### Prerequisites

```powershell
node --version    # Node.js 18+
npm --version     # npm 9+
```

### Install Dependencies for Both Frontends

```powershell
# Admin Dashboard
cd c:\playground\designer\frontend\admin-dashboard
npm install

# Marketplace Web  
cd c:\playground\designer\frontend\marketplace-web
npm install
```

---

## Running Both Frontends (After Port Fix)

### Option 1: Run in Separate Terminals

**Terminal 1 - Admin Dashboard:**
```powershell
cd c:\playground\designer\frontend\admin-dashboard
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3001/
  ➜  Press h to show help
```

**Terminal 2 - Marketplace Web:**
```powershell
cd c:\playground\designer\frontend\marketplace-web
npm run dev
```

Expected output:
```
  ▲ Next.js 15.1.3
  - Local:        http://localhost:3000
```

### Option 2: Use Combined Startup Script

Create `start-frontends.ps1`:

```powershell
# Start Both Frontend Applications

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Starting Designer Marketplace UIs " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan

$projectRoot = "c:\playground\designer\frontend"

# Check Node.js
Write-Host "`nVerifying Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($nodeVersion) {
    Write-Host "  Node.js $nodeVersion found ✓" -ForegroundColor Green
} else {
    Write-Host "  ERROR: Node.js not found!" -ForegroundColor Red
    exit 1
}

# Start Admin Dashboard (Port 3001)
Write-Host "`nStarting Admin Dashboard (port 3001)..." -ForegroundColor Yellow
Start-Process -FilePath "powershell" -ArgumentList {
    cd "$projectRoot\admin-dashboard"
    npm run dev
} -WindowStyle Normal

# Start Marketplace Web (Port 3000)
Write-Host "Starting Marketplace Web (port 3000)..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
Start-Process -FilePath "powershell" -ArgumentList {
    cd "$projectRoot\marketplace-web"
    npm run dev
} -WindowStyle Normal

Write-Host "`n=====================================" -ForegroundColor Cyan
Write-Host "  Frontend Services Starting...      " -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "`nWaiting for servers to start (10 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "`n  Admin Dashboard: http://localhost:3001" -ForegroundColor Green
Write-Host "  Marketplace:     http://localhost:3000" -ForegroundColor Green

Write-Host "`nBoth applications started in separate windows." -ForegroundColor Green
```

Save and run:
```powershell
.\scripts\start-frontends.ps1
```

---

## Testing Both Frontends

### Health Checks

Before testing, ensure all services are running:

```powershell
# Check backend services
Write-Host "Backend Services:"
Invoke-RestMethod http://localhost:8080/actuator/health | ConvertTo-Json -Depth 1
Invoke-RestMethod http://localhost:8081/health | ConvertTo-Json
Invoke-RestMethod http://localhost:8082/health

# Check frontend availability
Write-Host "`nFrontend Services:"
curl -s http://localhost:3000/ > $null && Write-Host "Marketplace Web (3000): UP"
curl -s http://localhost:3001/ > $null && Write-Host "Admin Dashboard (3001): UP"
```

### Testing Checklist

#### Admin Dashboard (Port 3001)

| Test | Steps | Expected Result |
|------|-------|-----------------|
| **Page Load** | Visit http://localhost:3001 | Dashboard loads without errors |
| **Navigation** | Click menu items (Dashboard, Users, etc) | Routes work, components render |
| **API Connection** | Check Network tab in DevTools | `/api/*` requests go to 8080 |
| **Data Fetching** | View any data table | Data from backend displays correctly |
| **Charts** | If chart page exists | Charts render with data |
| **Responsive** | Resize browser window | Layout adapts (mobile, tablet, desktop) |
| **Dark Mode** | Toggle theme if available | Styles apply correctly |

#### Marketplace Web (Port 3000)

| Test | Steps | Expected Result |
|------|-------|-----------------|
| **Page Load** | Visit http://localhost:3000 | Homepage loads without errors |
| **Navigation** | Click nav links | Routes change, content updates |
| **Job Listing** | Browse job marketplace | Jobs display from backend |
| **Search** | Search for jobs | Filters work, results update |
| **Authentication** | Try login/register | Auth endpoints work |
| **User Profile** | If authenticated, view profile | Profile data displays |
| **Responsive** | Resize browser window | Design adapts to screen size |
| **Form Validation** | Submit empty form | Validation errors appear |

### Advanced Testing

#### Network Request Testing

```powershell
# Test Admin Dashboard API calls
Invoke-RestMethod http://localhost:3001/ -Headers @{
    "Accept" = "text/html"
} | Select-String "admin-dashboard" | Select-Object -First 5

# Test Marketplace API calls
Invoke-RestMethod http://localhost:3000/ -Headers @{
    "Accept" = "text/html"
} | Select-String "marketplace" | Select-Object -First 5
```

#### Browser DevTools Testing

1. Open Chrome DevTools (F12)
2. Go to **Network** tab
3. Reload page
4. Check:
   - `Status 200` for all resources
   - `api/*` requests go to correct backend port (8080)
   - No `Failed` or `404` responses
   - Response times are reasonable (< 2s)

#### Console Error Testing

1. Open Chrome DevTools (F12)
2. Go to **Console** tab
3. Reload page
4. Should show no red errors
5. Warnings are acceptable but minimize them

---

## Environment Variables

### Admin Dashboard

No special env vars needed (uses API at http://localhost:8080)

### Marketplace Web

Create `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_WS_URL=http://localhost:8081  # Messaging service WebSocket
```

---

## Troubleshooting

### Port Already in Use

```powershell
# Find what's using port 3000
netstat -ano | findstr ":3000"

# Kill process by PID
taskkill /F /PID <PID>

# Or use this to kill all Node processes
taskkill /F /IM node.exe
```

### npm install Fails

```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -Recurse -Force node_modules
rm package-lock.json

# Reinstall
npm install
```

### Vite Hot Module Replacement Not Working

```powershell
# Restart Vite dev server
# Press Ctrl+C in terminal, then:
npm run dev
```

### Next.js Build Issues

```powershell
# Clear Next.js cache
rm -Recurse -Force .next

# Rebuild
npm run dev
```

### API Requests Failing

1. Check backend services are running:
   ```powershell
   netstat -ano | findstr ":8080 :8081 :8082"
   ```

2. Check API URL in configuration
3. Check CORS settings in backend
4. Check Network tab in DevTools for actual request URL

---

## Building for Production

### Admin Dashboard

```powershell
cd c:\playground\designer\frontend\admin-dashboard
npm run build
npm run preview  # Test production build locally
```

Output: `dist/` folder with optimized build

### Marketplace Web

```powershell
cd c:\playground\designer\frontend\marketplace-web
npm run build
npm run start  # Start production server
```

Output: `.next/` folder with optimized build

---

## Complete Startup Order (After Port Fix)

1. **Start Backend Services (if not already running)**
   ```powershell
   .\scripts\start-all-services.ps1
   ```

2. **Start Frontends**
   ```powershell
   .\scripts\start-frontends.ps1
   ```

3. **Access Applications**
   - Admin Dashboard: http://localhost:3001
   - Marketplace: http://localhost:3000
   - Java Backend: http://localhost:8080
   - Go Backend: http://localhost:8081
   - .NET Backend: http://localhost:8082

---

## Summary

| Aspect | Admin Dashboard | Marketplace Web |
|--------|-----------------|-----------------|
| **Framework** | Vite + React | Next.js |
| **Port** | 3001 | 3000 (needs fix) |
| **Backend** | 8080 (Java) | 8080 (Java) |
| **Use Case** | Admin Panel | User Marketplace |
| **Build Time** | ~30 seconds | ~2 minutes |
| **Bundle Size** | ~400KB | ~600KB |

**Key Point:** They are completely separate applications with different purposes. Admin Dashboard is for system administrators, while Marketplace Web is for regular users buying/selling services.

*After fixing the port configuration, both can run simultaneously without conflicts.*
