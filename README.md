
# Designer Marketplace - Complete Documentation & Setup Guide

**Last Updated:** January 2025  
**Project Status:** ✅ **90% Complete** - All Core Services Built & Tested  
**Remaining:** UI/UX Enhancement + Cloud Deployment  
**Services:** ✅ 4 Backend Services + 2 Frontend Apps Running

## Project Summary

✅ **All Development Phases Complete (90%)** - Production-ready services
- ✅ **Marketplace Service:** Java Spring Boot - 74+ endpoints, JWT auth, Stripe payments
- ✅ **LMS Service:** .NET 8 - Video streaming, quizzes, PDF certificates, MongoDB
- ✅ **Messaging Service:** Go - WebSocket chat, Redis pub/sub, Kafka integration
- ✅ **Beam Pipelines:** Python - Blog aggregation, automated data processing
- ✅ **Marketplace Web:** Next.js 15 - Course marketplace, payments, jobs
- ✅ **Admin Dashboard:** React - User management, analytics dashboard
- ✅ **Infrastructure:** Kubernetes, CI/CD, Monitoring (Prometheus/Grafana)

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

### Start Backend Services
```bash
# Terminal 2: Marketplace Service (Java)
cd services/marketplace-service
mvn clean package
java -jar target/marketplace-service-1.0.0-SNAPSHOT.jar
# Runs on http://localhost:8080

# Terminal 3: LMS Service (.NET)
cd services/lms-service
dotnet restore
dotnet run
# Runs on http://localhost:8082

# Terminal 4: Messaging Service (Go)
cd services/messaging-service
go mod download
go run cmd/server/main.go
# Runs on http://localhost:8081
```

### Start Frontend Applications
```bash
# Terminal 5: Marketplace Web (Next.js)
cd frontend/marketplace-web
npm install
npm run dev
# Runs on http://localhost:3001

# Terminal 6: Admin Dashboard (React)
cd frontend/admin-dashboard
npm install
npm run dev
# Runs on http://localhost:5173
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

### 📘 Primary Guide (START HERE)
- **[docs/INDEX.md](docs/INDEX.md)** - **Complete system architecture & how everything works together**
  - Visual architecture diagrams
  - 6 detailed user flow examples (authentication, jobs, courses, payments, messaging, data processing)
  - Service interaction explanations
  - Real-world scenarios showing how changes propagate

### 🧪 Testing & Development
- **[docs/TEST_DATA.md](docs/TEST_DATA.md)** - Complete test data for end-to-end testing
  - 10+ test user accounts (clients, freelancers, instructors, admins)
  - Sample jobs, courses, payments, messages
  - 3 detailed test flow scenarios
  - Stripe test cards
  - Expected results and verification checklist

- **[docs/UI_UX_ENHANCEMENT_PLAN.md](docs/UI_UX_ENHANCEMENT_PLAN.md)** - UI/UX improvement roadmap
  - Complete design system (colors, typography, spacing)
  - Component library specifications (shadcn/ui)
  - Page-by-page enhancement plans with code examples
  - Accessibility requirements (WCAG 2.1 AA)
  - AI-generated graphics placeholders
  - 3-4 week implementation timeline

### 📊 Project Management
- **[docs/PROJECT_STATUS.md](docs/PROJECT_STATUS.md)** - Current 90% completion status
- **[docs/DEVELOPMENT_ROADMAP.md](docs/DEVELOPMENT_ROADMAP.md)** - Phase breakdown & remaining work

### Core Technical Guides
- **[docs/AUTHENTICATION.md](docs/AUTHENTICATION.md)** - JWT token flow, implementation, verification
- **[docs/TESTING_FRAMEWORK.md](docs/TESTING_FRAMEWORK.md)** - 38 E2E tests, JMeter load tests, Postman
- **[docs/CI_CD_PIPELINE.md](docs/CI_CD_PIPELINE.md)** - GitHub Actions workflow, deployment

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

## Running Services & Ports

```
PostgreSQL           (5432)  → Marketplace database           Login: marketplace_user / password
MongoDB              (27017) → LMS content & courses          Login: root / password
Redis                (6379)  → Caching & real-time sessions
Kafka                (9092)  → Event streaming (11 topics)
Zookeeper            (2181)  → Kafka coordinator
Prometheus           (9090)  → Metrics collection
Grafana              (3000)  → Monitoring dashboards          Login: admin / admin
Nginx                (80)    → API Gateway & routing
Kafka UI             (8085)  → Kafka topic management

Marketplace Service  (8080)  → Java Spring Boot REST API      74+ endpoints
LMS Service          (8082)  → .NET 8 Web API                 Video, Quizzes, Certificates
Messaging Service    (8081)  → Go WebSocket Server            Real-time chat

Marketplace Web      (3001)  → Next.js 15 Frontend            Login: client1@example.com / password123
Admin Dashboard      (5173)  → React + Vite Dashboard         Login: admin@example.com / admin123
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