# Frontend Port Configuration - Visual Guide

## Port Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR DEVELOPMENT ENVIRONMENT                 │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                  MONITORING & ANALYTICS TIER                     │
│                     (Port 3000 - Standard)                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  🔍 Grafana Dashboard                                   │   │
│  │  URL: http://localhost:3000                            │   │
│  │  Status: ✅ Production (DO NOT CHANGE)                │   │
│  │  Purpose: System metrics, dashboards, monitoring       │   │
│  │  Shows: CPU, Memory, Disk, Requests, Response Times   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  📊 Prometheus (9090)                                   │   │
│  │  Purpose: Metrics collection                           │   │
│  │  Exposed via: Nginx reverse proxy                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
                              △
                              │ Requests
                              │ Metrics
                              │
┌──────────────────────────────────────────────────────────────────┐
│                   FRONTEND DEVELOPMENT TIER                      │
│                    (Ports 3001-3002 - Apps)                     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────────────────┐    ┌─────────────────────────┐    │
│  │   ADMIN DASHBOARD       │    │ MARKETPLACE WEB         │    │
│  │   (Vite React)          │    │ (Next.js React)         │    │
│  │                         │    │                         │    │
│  │ http://localhost:3001   │    │ http://localhost:3002   │    │
│  │ ✅ Port 3001            │    │ ✅ Port 3002 (FIXED)    │    │
│  │                         │    │                         │    │
│  │ For: Admins & Support   │    │ For: Users & Designers  │    │
│  │ - User Management       │    │ - Browse Jobs           │    │
│  │ - System Monitoring     │    │ - Post Services         │    │
│  │ - Content Moderation    │    │ - Search Marketplace    │    │
│  │ - Analytics             │    │ - Order Management      │    │
│  │ - Settings              │    │ - Profile Management    │    │
│  │                         │    │ - Messaging             │    │
│  │ Dependencies:           │    │ Dependencies:           │    │
│  │ - Vite 5.x              │    │ - Next.js 15.x          │    │
│  │ - React 18              │    │ - React 19              │    │
│  │ - TypeScript 5.3        │    │ - TypeScript 5.3        │    │
│  │ - Zustand               │    │ - Zustand               │    │
│  │ - TanStack Query        │    │ - TanStack Query        │    │
│  │ - Axios                 │    │ - Axios                 │    │
│  │ - Tailwind CSS          │    │ - Tailwind CSS          │    │
│  │ - Chart.js              │    │ - React Hook Form       │    │
│  │                         │    │ - Zod (validation)      │    │
│  │                         │    │                         │    │
│  │ Dev Server Running      │    │ Dev Server Running      │    │
│  │ npm run dev             │    │ npm run dev             │    │
│  │                         │    │                         │    │
│  └──────────┬──────────────┘    └──────────────┬──────────┘    │
│             │ API Requests                     │ API Requests    │
│             └────────────────────┬─────────────┘                │
│                                  │                             │
│                    Proxy: /api/* → localhost:8080              │
│                                                                 │
└──────────────────────────────────┬──────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────┐
│                   BACKEND SERVICES TIER                          │
│                  (Ports 8080-8082 - APIs)                       │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  ⚙️  JAVA MARKETPLACE SERVICE                            │  │
│  │  http://localhost:8080                                  │  │
│  │  Framework: Spring Boot 3.x                            │  │
│  │  Language: Java 21                                     │  │
│  │  Databases: PostgreSQL, MongoDB, Redis, Kafka          │  │
│  │  Serves: Core marketplace API                          │  │
│  │  Endpoints: /api/jobs, /api/users, /api/orders, etc.   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  📨 GO MESSAGING SERVICE                               │  │
│  │  http://localhost:8081                                 │  │
│  │  Language: Go 1.24 (upgraded)                          │  │
│  │  Purpose: Message broker & notifications              │  │
│  │                                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  📚 .NET LMS SERVICE                                     │  │
│  │  http://localhost:8082                                  │  │
│  │  Framework: ASP.NET Core 8.x                            │  │
│  │  Language: C#                                           │  │
│  │  Purpose: Learning management system                   │  │
│  │                                                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└──────────────────────────────────────────┬───────────────────────┘
                                           │
                    ┌──────────────────────┼──────────────────────┐
                    │                      │                      │
                    ▼                      ▼                      ▼
┌────────────────────────┐  ┌───────────────────────┐  ┌──────────────┐
│ PostgreSQL Database    │  │ MongoDB Database      │  │ Redis Cache  │
│ Port: 5432             │  │ Port: 27017           │  │ Port: 6379   │
│ Container: postgres    │  │ Container: mongodb    │  │ Container:   │
│                        │  │                       │  │ redis        │
│ Tables: users, jobs,   │  │ Collections: content, │  │              │
│ orders, etc.           │  │ lms_data, etc.        │  │ Session data │
│                        │  │                       │  │ Cache layer  │
└────────────────────────┘  └───────────────────────┘  └──────────────┘

┌────────────────────────┐  ┌───────────────────────┐  ┌──────────────┐
│ Kafka Queue            │  │ Zookeeper             │  │ Nginx Proxy  │
│ Port: 9092             │  │ Port: 2181            │  │ Port: 8088   │
│ Container: kafka       │  │ Container: zookeeper  │  │ Container:   │
│                        │  │                       │  │ nginx        │
│ Event streaming        │  │ Coordination          │  │              │
│ Message broker         │  │ Service discovery     │  │ Reverse Proxy│
│ Topics: various        │  │                       │  │ Load balancer│
└────────────────────────┘  └───────────────────────┘  └──────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ Kafka UI (Kafka Management)                                     │
│ Port: 8086 or 8080 (should be updated to avoid conflicts)       │
│ Purpose: Visual interface for managing Kafka topics             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagram

```
USER BROWSING MARKETPLACE (Port 3002)
│
├─ Browser loads http://localhost:3002
│
├─ Next.js dev server responds with React app
│
├─ User fills out search form
│
├─ React app sends API request to /api/jobs
│
├─ Vite/Next.js proxy intercepts the request
│
├─ Proxy forwards to http://localhost:8080/api/jobs
│
├─ Java backend receives request
│
├─ Java service queries PostgreSQL
│
├─ Returns JSON result
│
├─ Response travels back through proxy
│
├─ React Query (TanStack) caches the data
│
└─ UI renders the results


ADMIN MANAGING SYSTEM (Port 3001)
│
├─ Browser loads http://localhost:3001
│
├─ Vite dev server responds with React app
│
├─ Admin navigates to Users section
│
├─ React app sends API request to /api/admin/users
│
├─ Vite proxy intercepts the request
│
├─ Proxy forwards to http://localhost:8080/api/admin/users
│
├─ Java backend receives request (authorized for admins)
│
├─ Java service queries PostgreSQL
│
├─ Chart.js renders analytics
│
└─ Dashboard updates with real-time data


MONITORING & ALERTS (Port 3000)
│
├─ Browser loads http://localhost:3000 (Grafana)
│
├─ Grafana fetches metrics from Prometheus
│
├─ Prometheus queries metrics from backend services
│
├─ Services expose metrics at /metrics endpoints
│
├─ Prometheus scrapes data every 15 seconds
│
├─ Grafana displays:
│  ├─ CPU usage
│  ├─ Memory consumption
│  ├─ Request counts
│  ├─ Response times
│  ├─ Error rates
│  └─ Database connection health
│
└─ Alerts trigger if thresholds exceeded
```

---

## Port Assignment Rationale

```
PORT 3000 - MONITORING TOOLS (Industry Standard)
│
├─ Why here? → Standard port for web-based monitoring dashboards
├─ Used by: → Grafana (metrics visualization)
├─ Convention: → Prometheus, Kibana, other dashboards also use 3000
├─ Production: → Rarely changes because monitoring is mission-critical
└─ Benefit: → Team knows exactly where monitoring dashboard is

PORT 3001-3003 - DEVELOPMENT FRONTENDS
│
├─ Why here? → Standard range for frontend development
├─ Convention: → React, Vue, Angular apps commonly use 3000-3999
├─ Flexibility: → Can easily add more frontends (3003, 3004, etc.)
├─ Development: → Easy for developers to remember (all in 3xxx range)
├─ Admin Dashboard: → 3001 (more important/privileged interface)
└─ Marketplace Web: → 3002 (main user-facing interface)

PORT 8080-8082 - BACKEND SERVICES (Microservices Standard)
│
├─ Why here? → Standard range for backend REST APIs
├─ Convention: → Java/Go/C# services use 8080+ range
├─ Scalability: → Easy to add more services (8083, 8084, etc.)
├─ Separation: → Clear distinction from frontend tier
├─ Java Service: → 8080 (primary marketplace API)
├─ Go Service: → 8081 (supporting microservice)
└─ .NET Service: → 8082 (another supporting microservice)

PORT 5432, 27017, 6379, 9092, 2181 - DATA LAYER (Docker Network)
│
├─ Why here? → Standard ports for each technology
├─ Docker: → All on internal network (not exposed to host except via proxy)
├─ Isolation: → Data layer is isolated from development
├─ Access: → Only backend services connect directly
└─ Security: → Databases not directly accessible from frontends
```

---

## Verification Checklist

```
☐ PORTS VERIFICATION
  ☐ Port 3000 free for Grafana
  ☐ Port 3001 free for Admin Dashboard
  ☐ Port 3002 free for Marketplace Web
  ☐ Port 8080 running Java backend
  ☐ Port 8081 ready for Go service
  ☐ Port 8082 ready for .NET service

☐ CONFIGURATION FILES
  ☐ marketplace-web/package.json shows "dev": "next dev -p 3002"
  ☐ admin-dashboard/vite.config.ts shows port: 3001
  ☐ docker-compose.yml shows Grafana on port 3000
  ☐ Backend CORS allows localhost:3001 and localhost:3002

☐ SERVICES RUNNING
  ☐ Docker containers up (docker ps shows all running)
  ☐ Java backend healthy (http://localhost:8080/actuator/health)
  ☐ Go service ready (optional, starts from script)
  ☐ .NET service ready (optional, starts from script)

☐ FRONTEND APPLICATIONS
  ☐ Admin Dashboard starts: npm run dev (port 3001)
  ☐ Marketplace Web starts: npm run dev (port 3002)
  ☐ No port conflict errors
  ☐ No "Address already in use" errors

☐ API CONNECTIVITY
  ☐ Admin Dashboard can reach http://localhost:8080/api
  ☐ Marketplace Web can reach http://localhost:8080/api
  ☐ API responses appear in Network tab
  ☐ No CORS errors in browser console
  ☐ Data displays correctly in both applications

☐ MONITORING
  ☐ Grafana accessible at http://localhost:3000
  ☐ Dashboards load and display metrics
  ☐ Prometheus shows targets are "Up"
  ☐ System metrics being collected
```

---

## Common Scenarios

### Scenario 1: Running Both Frontends for Development

```
Terminal 1 (Admin Dashboard):
$ cd frontend/admin-dashboard
$ npm install   # First time only
$ npm run dev
→ Listening on http://localhost:3001

Terminal 2 (Marketplace Web):
$ cd frontend/marketplace-web
$ npm install   # First time only
$ npm run dev
→ Listening on http://localhost:3002

Terminal 3 (or same, backgrounded):
$ docker-compose -f config/docker-compose.yml up -d
$ ./scripts/start-all-services.ps1

Browser Tabs:
1. http://localhost:3000 (Grafana - optional, for monitoring)
2. http://localhost:3001 (Admin Dashboard)
3. http://localhost:3002 (Marketplace Web)
4. http://localhost:8080 (API - for debugging)
```

### Scenario 2: Testing Admin Dashboard Only

```
$ cd frontend/admin-dashboard
$ npm install   # First time only
$ npm run dev
→ Running on http://localhost:3001 ✓

No conflicts with other ports ✓
```

### Scenario 3: Testing Marketplace Web Only

```
$ cd frontend/marketplace-web
$ npm install   # First time only
$ npm run dev
→ Running on http://localhost:3002 ✓

No conflicts with other ports ✓
```

### Scenario 4: Production Build

```
Admin Dashboard:
$ cd frontend/admin-dashboard
$ npm run build
→ Creates /dist folder for deployment
→ Still serves from port 3001 when using: npm run dev
→ For production: Use serve or nginx to serve /dist

Marketplace Web:
$ cd frontend/marketplace-web
$ npm run build
→ Creates /.next folder for Next.js deployment
→ Still serves from port 3002 when using: npm run dev
→ For production: Use: npm run start
```

---

## Troubleshooting Visual Guide

```
SYMPTOM: "Error: EADDRINUSE: address already in use :::3002"
│
├─ Cause: Another process using port 3002
│
├─ Check:
│  $ netstat -ano | findstr ":3002"
│
├─ Solution 1:
│  $ taskkill /PID <PID_NUMBER> /F
│
└─ Solution 2:
   $ .\scripts\verify-frontend-ports.ps1
   Then use a different port in package.json


SYMPTOM: Admin Dashboard shows but Marketplace Web doesn't load
│
├─ Check:
│  1. Is port 3002 free? → Run verification script
│  2. Are dependencies installed? → npm install in marketplace-web/
│  3. Is backend running? → http://localhost:8080/actuator/health
│
└─ Fix:
   $ cd frontend/marketplace-web
   $ npm install
   $ npm run dev


SYMPTOM: API requests failing with CORS errors
│
├─ Check Network tab in DevTools
│
├─ If Origin mismatch error:
│  → Verify CORS in docker-compose.yml
│  → Should include localhost:3001 and localhost:3002
│
└─ Fix:
   1. Restart Java backend
   2. Verify ALLOWED_ORIGINS setting
   3. Check browser console for exact error


SYMPTOM: Changes to code aren't appearing
│
├─ Vite (Admin):
│  ├─ Should auto-refresh with hot module reload
│  ├─ If not: Kill dev server and restart
│  └─ Check: Is port 3001 really serving from admin-dashboard?
│
├─ Next.js (Marketplace):
│  ├─ Should auto-refresh with fast refresh
│  ├─ If not: Kill dev server and restart
│  └─ Check: Is port 3002 really serving from marketplace-web?
│
└─ Verification:
   $ Get-Content frontend/admin-dashboard/vite.config.ts | Select-String "port"
   $ Get-Content frontend/marketplace-web/package.json | Select-String "3002"


SYMPTOM: Grafana not accessible at localhost:3000
│
├─ Check: Is Docker running?
│  $ docker ps | grep grafana
│
├─ Check: Is port 3000 actually used by Grafana?
│  $ netstat -ano | findstr ":3000"
│
└─ Fix:
   1. Stop any process on 3000: taskkill /PID <PID> /F
   2. Restart Docker: docker-compose -f config/docker-compose.yml up -d
   3. Wait 10 seconds for Grafana to start
   4. Access http://localhost:3000
```

