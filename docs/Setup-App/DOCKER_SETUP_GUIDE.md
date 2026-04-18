# Backend Services + Local Frontend Setup Guide

This guide explains how to run **all backend services and databases in Docker** while running **both frontend apps locally** for development.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                  LOCAL DEVELOPMENT                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Frontend Apps (localhost)              Docker          │
│  ├─ Admin Dashboard  :3000      ┌──────────────────┐   │
│  └─ Marketplace Web  :3001  ──→ │  Nginx Gateway   │   │
│                                 │  :80 / :443      │   │
│                                 └──────────────────┘   │
│                                         ↓               │
│                          ┌────────────────────────┐    │
│                          │  Backend Services      │    │
│                          ├────────────────────────┤    │
│                          │ • Marketplace (Java)   │    │
│                          │ • Messaging (Go)       │    │
│                          │ • LMS (.NET)           │    │
│                          │ • Content (Node.js)    │    │
│                          └────────────────────────┘    │
│                                   ↓                     │
│                          ┌────────────────────────┐    │
│                          │  Databases & Services  │    │
│                          ├────────────────────────┤    │
│                          │ • PostgreSQL :5432     │    │
│                          │ • MongoDB :27017       │    │
│                          │ • Redis :6379          │    │
│                          │ • Kafka :9092          │    │
│                          │ • Monitoring Stack     │    │
│                          └────────────────────────┘    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Port Mapping

| Component | Port | URL | Access From |
|-----------|------|-----|-------------|
| Admin Dashboard | 3000 | http://localhost:3000 | Local |
| Marketplace Web | 3001 | http://localhost:3001 | Local |
| **API Gateway (Nginx)** | 80 | http://localhost | Docker network |
| Marketplace Service | 8080 | http://localhost:8080 | Docker network |
| Messaging Service | 8081 | http://localhost:8081 | Docker network |
| LMS Service | 8082 | http://localhost:8082 | Docker network |
| Content Service | 8083 | http://localhost:8083 | Docker network |
| PostgreSQL | 5432 | localhost:5432 | Local + Docker |
| MongoDB | 27017 | localhost:27017 | Local + Docker |
| Redis | 6379 | localhost:6379 | Local + Docker |
| Kafka | 9092 | localhost:9092 | Local + Docker |
| Zookeeper | 2181 | localhost:2181 | Docker network |
| Kafka UI | 8085 | http://localhost:8085 | Local |
| Prometheus | 9090 | http://localhost:9090 | Local |
| Grafana | 3000* | http://localhost:3000* | Local |

*Note: Grafana uses port 3000 by default but admin-dashboard also uses 3000. In the compose file it's disabled.

## Prerequisites

- **Docker & Docker Compose** installed
- **Node.js 20+** (for frontend apps)
- **Git** configured

## Step 1: Verify Backend Service Build Requirements

The docker-compose expects pre-built binaries/artifacts. Verify they exist:

### Marketplace Service (Java)
```bash
# Already built in target/
ls services/marketplace-service/target/marketplace-service-1.0.0-SNAPSHOT.jar
```

### Other Services
The Node.js, .NET, and Go services will build from source during `docker-compose up`.

## Step 2: Start All Docker Services

### Option A: Start Everything
```bash
cd config/
docker-compose up -d
```

### Option B: Start with Logs (useful for first-time debugging)
```bash
cd config/
docker-compose up --build
```

### Option C: Start Specific Services Only
```bash
# Start just infrastructure (no backend services)
docker-compose up -d postgres mongodb redis kafka zookeeper prometheus grafana

# Start backend services after infrastructure is healthy
docker-compose up -d marketplace-service messaging-service lms-service content-service
```

### Verify Services are Running
```bash
# Check all containers
docker-compose ps

# View logs for a specific service
docker-compose logs -f marketplace-service

# Check service health
curl http://localhost/health
curl http://localhost:8080/actuator/health
curl http://localhost:8081/health
curl http://localhost:8082/api/health
curl http://localhost:8083/health
```

## Step 3: Configure Frontend Apps to Use Docker Services

### Admin Dashboard (.env)

Create `frontend/admin-dashboard/.env`:
```env
# API Connection
VITE_API_BASE_URL=http://localhost/api
VITE_MARKETPLACE_API=http://localhost:8080/api
VITE_CONTENT_API=http://localhost:8083/api
VITE_LMS_API=http://localhost:8082/api
VITE_MESSAGING_API=http://localhost:8081/api

# Kafka UI for debugging
VITE_KAFKA_UI_URL=http://localhost:8085

# Monitoring
VITE_GRAFANA_URL=http://localhost:3000
```

### Marketplace Web (.env)

Create `frontend/marketplace-web/.env`:
```env
# API Connection
VITE_API_BASE_URL=http://localhost/api
VITE_MARKETPLACE_API=http://localhost:8080/api
VITE_CONTENT_API=http://localhost:8083/api
VITE_LMS_API=http://localhost:8082/api
VITE_MESSAGING_API=http://localhost:8081/api

# Analytics
VITE_GA_ID=your-ga-id

# Kafka UI for debugging
VITE_KAFKA_UI_URL=http://localhost:8085
```

## Step 4: Start Frontend Applications Locally

### Terminal 1: Admin Dashboard
```bash
cd frontend/admin-dashboard
npm install  # if not already done
npm run dev
# Open http://localhost:3000
```

### Terminal 2: Marketplace Web
```bash
cd frontend/marketplace-web
npm install  # if not already done
npm run dev
# Open http://localhost:3001
```

## Step 5: Verify Everything is Running

### Check Docker Services
```bash
# View all running containers
docker-compose ps

# Check service health
curl http://localhost/health

# Check individual backends
curl http://localhost:8080/actuator/health     # Java
curl http://localhost:8081/health              # Go
curl http://localhost:8082/api/health          # .NET
curl http://localhost:8083/health              # Node.js
```

### Check Frontend Apps
- Admin Dashboard: http://localhost:3000
- Marketplace Web: http://localhost:3001

### Access Monitoring/Tools
- **Kafka UI**: http://localhost:8085
- **Prometheus**: http://localhost:9090
- **Grafana**: Access via frontend dashboard or http://localhost:3000 (if configured)

## Troubleshooting

### Issue: Frontend Apps Can't Connect to Docker Services

**Symptom**: `ECONNREFUSED` or network errors in browser console

**Solution**:
1. Verify Docker containers are running: `docker-compose ps`
2. Check if Nginx is working: `curl http://localhost/health`
3. Set `VITE_API_BASE_URL=http://localhost` or use specific service URLs
4. Check browser console for actual error URL being requested
5. Restart frontend dev server after changing `.env`

### Issue: Database Connection Timeouts

**Symptom**: Backend services failing with database connection errors

**Solution**:
1. Check if database containers are healthy: `docker-compose ps`
2. Wait for databases to fully start (30-60 seconds)
3. View database logs: `docker-compose logs postgres` or `docker-compose logs mongodb`
4. Verify connection strings match those in `docker-compose.yml`

### Issue: Port Already in Use

**Symptom**: `Error: bind: address already in use`

**Solution**:
```bash
# Find what's using the port
lsof -i :3000  # On macOS/Linux
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess  # On Windows PowerShell

# Stop Docker containers and restart
docker-compose down
docker-compose up -d
```

### Issue: Docker Build Failures

**Symptom**: `docker-compose up` fails during service build

**Solution**:
1. Check logs: `docker-compose logs <service-name>`
2. Rebuild from scratch: `docker-compose up -d --build`
3. For specific service: `docker-compose up -d --build content-service`
4. Check Dockerfile syntax and ensure all required files exist

### Issue: Kafka Not Working

**Symptom**: Kafka connection errors in backend services

**Solution**:
1. Verify Zookeeper and Kafka are running: `docker-compose ps`
2. Check Kafka logs: `docker-compose logs kafka`
3. Restart Kafka: `docker-compose restart kafka zookeeper`
4. Access Kafka UI: http://localhost:8085

## Managing Docker Services

### Stop All Services (stop containers but keep data)
```bash
docker-compose stop
```

### Start After Stopping
```bash
docker-compose start
```

### Remove Everything (warning: loses data!)
```bash
docker-compose down -v
```

### Remove Containers But Keep Volumes
```bash
docker-compose down
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f marketplace-service

# Last 100 lines
docker-compose logs --tail=100 nodejs-service
```

### Execute Commands in Container
```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U marketplace_user -d marketplace_db

# Check MongoDB
docker-compose exec mongodb mongosh -u mongo_user -p mongo_pass_dev --authenticationDatabase admin

# View Redis
docker-compose exec redis redis-cli
```

## Development Workflow

### Single-Session Setup
```bash
# Terminal 1: Start all Docker services
cd config/
docker-compose up

# Terminal 2: Start Admin Dashboard
cd frontend/admin-dashboard
npm run dev

# Terminal 3: Start Marketplace Web
cd frontend/marketplace-web
npm run dev
```

### Persistent Services (Run in Background)
```bash
# Start services in background
cd config/
docker-compose up -d

# Run frontends normally (can close terminals after starting)
cd frontend/admin-dashboard && npm run dev &
cd frontend/marketplace-web && npm run dev &

# Later, if needed:
docker-compose logs -f
docker-compose ps
docker-compose stop  # or docker-compose down
```

## Performance Tips

### Limit Resource Usage
Edit `docker-compose.yml` to add limits:
```yaml
services:
  marketplace-service:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

### Speed Up Builds
```bash
# Use BuildKit for faster Docker builds
export DOCKER_BUILDKIT=1
docker-compose up -d --build
```

### Monitor Resource Usage
```bash
# Real-time container stats
docker stats

# Kafka UI shows queue depths and lag
open http://localhost:8085
```

## Environment Variables Reference

All sensitive values have defaults for dev. For production, override in `.env.production`:

```env
# Database
DB_HOST=postgres
DB_PORT=5432
DB_NAME=marketplace_db
DB_USER=marketplace_user
DB_PASSWORD=marketplace_pass_dev

# MongoDB
MONGO_USER=mongo_user
MONGO_PASSWORD=mongo_pass_dev
MONGO_HOST=mongodb
MONGO_PORT=27017

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# Kafka
KAFKA_BOOTSTRAP_SERVERS=kafka:29092

# JWT
JWT_SECRET=your-256-bit-secret-change-this-in-production-please-make-it-secure

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

## Next Steps

1. ✅ Start Docker services: `cd config/ && docker-compose up -d`
2. ✅ Verify health: Check endpoints above
3. ✅ Configure frontend `.env` files
4. ✅ Start frontend apps
5. ✅ Test API calls from frontend
6. 📊 Monitor with Kafka UI, Prometheus, and logs
7. 🧪 Run tests if available
8. 🚀 Deploy when ready

## Additional Resources

- **Docker Compose docs**: https://docs.docker.com/compose/
- **Service-specific docs**: See `services/*/README.md`
- **API docs**: Available at Swagger/OpenAPI endpoints in each service
- **Logs location in Docker**: `/var/log/*/`

