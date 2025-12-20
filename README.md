
# Designer Marketplace - Complete Documentation & Setup Guide

**Last Updated:** December 20, 2025  
**Project Status:** ✅ **PRODUCTION READY** (Sprints 10-15 Complete)  
**Backend:** ✅ Running on localhost:8080  
**Services:** ✅ 9/9 Running

## Project Summary

✅ **Phases 1-3 Complete (Sprints 1-15)** - All core features implemented and production-ready
- Phase 1: Core Marketplace (Sprints 1-9) ✅
- Phase 3: LMS + Security + Production (Sprints 10-15) ✅
- Backend: 60+ endpoints | Database: 74 users, 18 jobs | Security: 5-layer hardening

## Quick Start (10 Minutes)

### Prerequisites
```bash
docker --version         # Required: Docker & Docker Compose
docker-compose --version
java -version            # Required: Java 21+
node --version           # Required: Node.js 18+
npm --version
```

### Start Everything
```bash
# Terminal 1: Start all services
cd c:\playground\designer
docker-compose -f config/docker-compose.yml up -d

# Wait 15-30 seconds
docker-compose -f config/docker-compose.yml ps
```

### Start Backend
```bash
# Terminal 2: Backend
cd services/marketplace-service
mvn clean package
java -jar target/marketplace-service-1.0.0-SNAPSHOT.jar
# Runs on http://localhost:8080
```

### Start Frontend
```bash
# Terminal 3: Frontend
cd frontend/marketplace-web
npm install
npm run dev
# Runs on http://localhost:3001
```

### Test Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client1@example.com","password":"password123"}'
```

**Test Credentials:** Email: `client1@example.com` | Password: `password123` | 50 users available

---

## Documentation Overview

### Getting Started
- **[docs/QUICK_START.md](docs/QUICK_START.md)** - Full 10-minute setup guide with troubleshooting
- **[docs/INDEX.md](docs/INDEX.md)** - Complete documentation index (START HERE)
- **[docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md)** - Current status & metrics

### Core Guides (Consolidated - No Redundancy)
- **[docs/AUTHENTICATION.md](docs/AUTHENTICATION.md)** - JWT token flow, implementation, verification
- **[docs/TESTING_FRAMEWORK.md](docs/TESTING_FRAMEWORK.md)** - 38 E2E tests, JMeter load tests, Postman
- **[docs/CI_CD_PIPELINE.md](docs/CI_CD_PIPELINE.md)** - GitHub Actions workflow, branch protection, deployment

### Architecture & Planning
- **[docs/marketplace_design.md](docs/marketplace_design.md)** - Product specification, API endpoints, architecture
- **[docs/PROJECT_TIMELINE_TRACKER.md](docs/PROJECT_TIMELINE_TRACKER.md)** - 141-task timeline (6 months)
- **[docs/SECURITY_RECOMMENDATION.md](docs/SECURITY_RECOMMENDATION.md)** - Security approach by phase

### Integration & Infrastructure
- **[docs/JIRA_SETUP.md](docs/JIRA_SETUP.md)** - Jira workspace configuration
- **[docs/JIRA_AUTOMATION_QUICKSTART.md](docs/JIRA_AUTOMATION_QUICKSTART.md)** - Quick Jira automation reference
- **[docs/kafka_beam_security_section.md](docs/kafka_beam_security_section.md)** - Kafka & Apache Beam setup
- **[docs/DASHBOARD.md](docs/DASHBOARD.md)** - Grafana dashboard configuration

---

## Essential Commands

### Docker Services
```bash
docker-compose -f config/docker-compose.yml up -d      # Start all services
docker-compose -f config/docker-compose.yml ps         # Check status
docker-compose -f config/docker-compose.yml logs -f    # View logs
docker-compose -f config/docker-compose.yml down       # Stop services
```

### Backend
```bash
# Build
mvn -f services/marketplace-service/pom.xml clean package

# Run
java -jar services/marketplace-service/target/marketplace-service-1.0.0-SNAPSHOT.jar

# Test API
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"client1@example.com","password":"password123"}'
```

### Frontend
```bash
cd frontend/marketplace-web

# Install
npm install

# Run dev server
npm run dev

# Run tests (38 E2E tests)
npm test -- tests/integration.test.ts --runInBand

# Build for production
npm run build
```

### Database
```bash
# Connect to PostgreSQL
docker exec -it marketplace_db psql -U marketplace -d marketplace

# Check migrations
SELECT * FROM flyway_schema_history;

# Check users
SELECT COUNT(*) FROM users;  # Should return 50
```

### Load Testing
```bash
# Run JMeter load tests (100 concurrent users)
jmeter -n -t tests/Designer_Marketplace_LoadTest.jmx -l results.jtl -e -o jmeter-report/

# View report
# Open jmeter-report/index.html in browser
```

## Running Services

```
PostgreSQL      (5432)  → Core transactional database Login: marketplace_user / password
MongoDB         (27017) → LMS & content database (Phase 2)
Redis           (6379)  → Caching & sessions
Zookeeper       (2181)  → Kafka coordinator
Kafka           (9092)  → Event streaming
Prometheus      (9090)  → Metrics collection
Grafana         (3000)  → Dashboard & monitoring Login: admin / admin
Nginx           (80)    → API Gateway & routing
Kafka UI        (8085)  → Kafka management
Backend         (8080)  → Java Spring Boot service See docs/AUTHENTICATION.md
Frontend        (3001)  → Next.js development server Login: client1@example.com / password123 
```

## Testing

### Run Tests
```bash
# E2E Integration Tests (38 tests)
cd frontend/marketplace-web
npm test -- tests/integration.test.ts --runInBand

# Load Tests (100 concurrent users, 12 min)
jmeter -n -t tests/Designer_Marketplace_LoadTest.jmx -l results.jtl -e -o jmeter-report/

# Manual Testing using Postman Collections
# 1. Import: postman/Designer_Marketplace_API.postman_collection.json
# 2. Login: client1@example.com / password123
# 3. Run 26 documented endpoints
```

---

## Common Issues & Solutions

### Backend Won't Start
```bash
# Port 8080 in use?
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# Database not connecting?
docker-compose ps  # Check postgres_db is Up
docker logs marketplace_db

# Rebuild
mvn clean package -DskipTests
```

### Frontend Won't Start
```bash
# Node modules issue?
rm -rf node_modules package-lock.json
npm install

# Port 3001 in use?
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Clear cache
rm -rf .next
npm run dev
```

### Login Fails (403)
```bash
# Verify password hash in DB
docker exec -it marketplace_db psql -U marketplace -c "SELECT email, password_hash FROM users LIMIT 1;"

# Check backend logs
java -jar target/marketplace-service-1.0.0-SNAPSHOT.jar | grep -i login
```

### CORS Errors
```bash
# Frontend on 3001 should be allowed
# Check: services/marketplace-service/src/main/java/com/designer/marketplace/config/SecurityConfig.java
# Should include: http://localhost:3001

# Verify with curl
curl -I -H "Origin: http://localhost:3001" http://localhost:8080
```

### Services Won't Start
```bash
# Reset everything
docker-compose -f config/docker-compose.yml down -v
docker-compose -f config/docker-compose.yml up -d --build

# Wait 30 seconds
docker-compose -f config/docker-compose.yml ps
```

---

## Development Workflow

## roject Highlights

**What You're Building:**
- Fiverr-like platform (Designer Marketplace)
- Global talent + local projects
- Real-time messaging
- Secure payments with Stripe
- Learning platform built-in

**Tech Stack:**
- 100% free/open-source
- Multi-tech microservices (Java/Go/.NET)
- Cloud-ready (AWS/Azure/GCP)
- Full monitoring & observability

---

### For More Info
- **Project Timeline:** [docs/PROJECT_TIMELINE_TRACKER.md](docs/PROJECT_TIMELINE_TRACKER.md)
- **All Documentation:** [docs/INDEX.md](docs/INDEX.md)
- **Authentication Details:** [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md)
- **Testing Reference:** [docs/TESTING_FRAMEWORK.md](docs/TESTING_FRAMEWORK.md)
- **CI/CD Setup:** [docs/CI_CD_PIPELINE.md](docs/CI_CD_PIPELINE.md)