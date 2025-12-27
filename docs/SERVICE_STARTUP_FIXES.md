# Service Startup Quick Reference

## All Fixes Applied ✅

1. **Kafka Topics**: Added `payments.succeeded` and `users.created` topics
2. **Jobs API**: Fixed 500 error when no query parameters provided
3. **Categories**: Expanded from 7 to 16 design categories
4. **Auth Header**: User dropdown with logout functionality (replaces login/signup when logged in)
5. **Theme Toggle**: Removed (will add proper dark mode later)

## Start Services in Separate Windows

### Option 1: Manual (Recommended for First Time)

Open 5 separate PowerShell windows and run:

**Window 1 - Marketplace Service (Java)**
```powershell
cd C:\playground\designer\services\marketplace-service
java -jar target\marketplace-service-1.0.0-SNAPSHOT.jar
```

**Window 2 - LMS Service (.NET)**
```powershell
cd C:\playground\designer\services\lms-service
dotnet run
```

**Window 3 - Messaging Service (Go)**
```powershell
cd C:\playground\designer\services\messaging-service
if (-not (Test-Path '.\bin\messaging.exe')) { go build -o .\bin\messaging.exe . }
.\bin\messaging.exe
```

**Window 4 - Marketplace Web (Next.js)**
```powershell
cd C:\playground\designer\frontend\marketplace-web
npm run dev
```

**Window 5 - Admin Dashboard (Vite)**
```powershell
cd C:\playground\designer\frontend\admin-dashboard
npm run dev
```

### Option 2: Use Existing Script

```powershell
cd C:\playground\designer
.\scripts\start-all-services.ps1
```

## Verify All Services

After starting services, run:

```powershell
cd C:\playground\designer
.\scripts\verify-services.ps1
```

This will check:
- ✓ Infrastructure (PostgreSQL, MongoDB, Redis, Kafka)
- ✓ Backend services (Marketplace, LMS, Messaging)
- ✓ Frontend services (Web, Admin Dashboard)
- ✓ API endpoints (Jobs with/without params, Courses)
- ✓ Kafka topics

## Expected Ports

- **8080**: Marketplace Service (Java/Spring Boot)
- **8081**: Messaging Service (Go/Gin)
- **8082**: LMS Service (.NET 8)
- **3002**: Marketplace Web Frontend (Next.js)
- **5173**: Admin Dashboard Frontend (Vite)

## Test Jobs API

Open browser or use curl:

```powershell
# No params (should work now - was returning 500 before)
Invoke-RestMethod http://localhost:3002/api/jobs

# With category
Invoke-RestMethod "http://localhost:3002/api/jobs?category=WEB_DESIGN"

# With search
Invoke-RestMethod "http://localhost:3002/api/jobs?search=design"

# All filters
Invoke-RestMethod "http://localhost:3002/api/jobs?category=GRAPHIC_DESIGN&experienceLevel=INTERMEDIATE&minBudget=100&maxBudget=5000&search=logo"
```

## Test Auth Header

1. Open http://localhost:3002
2. Click "Login" in header
3. After successful login, you should see your name instead of Login/Sign Up
4. Click your name to see dropdown with:
   - Dashboard
   - Profile Settings
   - Logout (red text)

## Troubleshooting

### Kafka Errors on LMS Service
If you see: `Subscribed topic not available: payments.succeeded`
```powershell
cd C:\playground\designer
.\scripts\create-kafka-topics.ps1
```

### Port Already in Use
```powershell
# Find what's using the port
netstat -ano | findstr "8080"

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Service Won't Start
1. Check Docker containers are running: `docker ps`
2. Check logs in the service window
3. Verify environment variables in `.env` files
4. Check database connections

## Quick Health Check URLs

- Marketplace: http://localhost:8080/actuator/health
- LMS: http://localhost:8082/health  
- Messaging: http://localhost:8081/health
- Frontend: http://localhost:3002

## Notes

- **Kafka topics must be created BEFORE starting services**
- **Services should start in order**: Infrastructure → Backends → Frontends
- **Watch for errors** in the service windows (Kafka connection errors will retry)
- **All services log to their respective windows** for easy monitoring
