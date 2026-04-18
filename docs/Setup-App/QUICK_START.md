# Quick Start - Backend in Docker + Local Frontends

## One-Command Setup (Recommended)

### Windows (PowerShell)
```powershell
# Run this from the project root directory
.\start-all-local-dev.ps1
```

### macOS/Linux
```bash
# Run this from the project root directory
chmod +x start-all-local-dev.sh
./start-all-local-dev.sh
```

---

## Manual Step-by-Step Setup

### Step 1: Start Docker Infrastructure (in Terminal 1)
```bash
cd config
docker-compose up -d
```

Wait for services to be healthy:
```bash
# Check status (should show "healthy" for all)
docker-compose ps

# Or poll the gateway
curl http://localhost/health
```

### Step 2: Create Frontend Environment Files

#### Admin Dashboard
Create `frontend/admin-dashboard/.env`:
```env
VITE_API_BASE_URL=http://localhost/api
VITE_MARKETPLACE_API=http://localhost:8080/api
VITE_CONTENT_API=http://localhost:8083/api
VITE_LMS_API=http://localhost:8082/api
VITE_MESSAGING_API=http://localhost:8081/api
VITE_KAFKA_UI_URL=http://localhost:8085
```

#### Marketplace Web
Create `frontend/marketplace-web/.env`:
```env
VITE_API_BASE_URL=http://localhost/api
VITE_MARKETPLACE_API=http://localhost:8080/api
VITE_CONTENT_API=http://localhost:8083/api
VITE_LMS_API=http://localhost:8082/api
VITE_MESSAGING_API=http://localhost:8081/api
VITE_KAFKA_UI_URL=http://localhost:8085
```

### Step 3: Start Admin Dashboard (in Terminal 2)
```bash
cd frontend/admin-dashboard
npm install
npm run dev
# Browse: http://localhost:3000
```

### Step 4: Start Marketplace Web (in Terminal 3)
```bash
cd frontend/marketplace-web
npm install
npm run dev
# Browse: http://localhost:3001
```

---

## Verification Checklist

✅ **Docker Services Running**
```bash
# All containers should show "Up" and healthy
curl http://localhost/health
curl http://localhost:8080/actuator/health  # Java
curl http://localhost:8081/health            # Go
curl http://localhost:8082/api/health        # .NET
curl http://localhost:8083/health            # Node.js
```

✅ **Frontend Apps Running**
- Admin Dashboard: http://localhost:3000
- Marketplace Web: http://localhost:3001

✅ **Monitoring Tools**
- Kafka UI: http://localhost:8085
- Prometheus: http://localhost:9090

---

## Common Commands

| Task | Command |
|------|---------|
| View all running containers | `docker-compose ps` |
| View logs for all services | `docker-compose logs -f` |
| View logs for specific service | `docker-compose logs -f marketplace-service` |
| Stop all services | `docker-compose stop` |
| Restart all services | `docker-compose restart` |
| Remove all containers/volumes | `docker-compose down -v` |
| Rebuild images | `docker-compose up -d --build` |
| Connect to PostgreSQL | `docker-compose exec postgres psql -U marketplace_user -d marketplace_db` |
| Connect to MongoDB | `docker-compose exec mongodb mongosh -u mongo_user -p mongo_pass_dev --authenticationDatabase admin` |
| Connect to Redis | `docker-compose exec redis redis-cli` |

---

## Troubleshooting

### Issue: "Connection refused" from frontend
**Cause**: Docker services not running or frontend `.env` not configured

**Fix**:
```bash
# Ensure Docker services are running
docker-compose ps

# Set correct API URLs in .env (see Step 2 above)
# Restart frontend dev server
```

### Issue: Docker container exits immediately
**Cause**: Build failure or health check failure

**Fix**:
```bash
# Check logs
docker-compose logs <service-name>

# Rebuild
docker-compose up -d --build <service-name>

# Or full restart
docker-compose down
docker-compose up -d --build
```

### Issue: Port already in use
**Cause**: Another process using the port

**Fix** (Windows PowerShell):
```powershell
# Find process using port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess

# Kill it
Stop-Process -Id <PID> -Force
```

**Fix** (macOS/Linux):
```bash
# Find process using port 3000
lsof -i :3000

# Kill it
kill -9 <PID>
```

### Issue: Services show health check failures
**Cause**: Service still starting or configuration issue

**Fix**:
```bash
# Wait a bit longer (services take 30-60 seconds to start)
sleep 60
docker-compose ps

# Check specific logs
docker-compose logs <service-name>

# Restart specific service
docker-compose restart <service-name>
```

---

## Performance & Resource Usage

### View resource usage
```bash
docker stats
```

### Stop unnecessary services (keep only what you need)
```bash
# Example: Stop monitoring if not needed
docker-compose stop prometheus grafana

# Keep running
docker-compose up -d postgres mongodb redis kafka marketplace-service messaging-service lms-service content-service
```

---

## Deployment Notes

### Frontend API Configuration
- **Development**: `http://localhost:8080`, `http://localhost:8083`, etc. (direct service ports)
- **With Nginx Gateway**: `http://localhost/api` (recommended)
- **Production**: Set to your production domain

### Environment Variables by Environment
```env
# Development (Docker)
VITE_API_BASE_URL=http://localhost/api

# Staging/Production
VITE_API_BASE_URL=https://api.yourcompany.com
VITE_MARKETPLACE_API=https://api.yourcompany.com/marketplace
```

---

## Directory Structure Reference

```
.
├── config/
│   ├── docker-compose.yml         ← All Docker services defined here
│   ├── nginx.conf                 ← API Gateway routing
│   └── prometheus.yml             ← Monitoring config
├── services/
│   ├── marketplace-service/       ← Java/Spring Boot
│   ├── messaging-service/         ← Go
│   ├── lms-service/               ← .NET/C#
│   └── content-service/           ← Node.js/TypeScript
├── frontend/
│   ├── admin-dashboard/           ← React/Vite (port 3000)
│   └── marketplace-web/           ← React/Vite (port 3001)
├── DOCKER_SETUP_GUIDE.md          ← Detailed guide
├── start-all-local-dev.sh         ← Auto-setup (bash)
└── start-all-local-dev.ps1        ← Auto-setup (PowerShell)
```

---

## Next Steps After Setup

1. ✅ Run `./start-all-local-dev.ps1` (Windows) or `./start-all-local-dev.sh` (macOS/Linux)
2. ✅ Start frontend apps in 2 more terminals
3. ✨ Begin development!
4. 📊 Monitor with Kafka UI and Prometheus
5. 🧪 Run API tests at each service endpoint
6. 🚀 When ready, deploy to staging/production

---

## Support & Further Reading

- **Docker Docs**: https://docs.docker.com/compose/
- **Service READMEs** in `services/*/README.md`
- **API Documentation**: See `docs/API_STANDARDIZATION_OPENAPI_SPEC.md`
- **Architecture**: See detailed guide in [DOCKER_SETUP_GUIDE.md](./DOCKER_SETUP_GUIDE.md)
