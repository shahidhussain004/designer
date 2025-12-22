# Designer Marketplace - Local Development Guide

## Overview

This guide explains how to run all services locally for development. The Designer Marketplace consists of:

- **Java Marketplace Service** (Spring Boot 3.3, Java 21) - Port 8080
- **Go Messaging Service** (Go 1.24, Gin) - Port 8081
- **.NET LMS Service** (.NET 8, ASP.NET Core) - Port 8082
- **Infrastructure** (Docker Compose) - PostgreSQL, MongoDB, Redis, Kafka, Prometheus, Grafana

## Prerequisites

### Required Software

| Software | Version | Verification Command |
|----------|---------|---------------------|
| Docker Desktop | Latest | `docker --version` |
| Java JDK | 21+ | `java --version` |
| Maven | 3.9+ | `mvn --version` |
| Go | 1.24+ | `go version` |
| .NET SDK | 8.0+ | `dotnet --version` |
| Node.js | 18+ | `node --version` (for frontends) |

### Environment Setup

Ensure Docker Desktop is running before starting.

---

## Step 1: Start Infrastructure Services

Navigate to the config folder and start all Docker containers:

```powershell
cd c:\playground\designer\config
docker compose up -d
```

### Verify Infrastructure

Wait for containers to become healthy:

```powershell
docker ps --format "table {{.Names}}\t{{.Status}}"
```

Expected output (all should show "healthy" or "Up"):

| Container | Port | Purpose |
|-----------|------|---------|
| designer-postgres-1 | 5432 | PostgreSQL database |
| designer-mongodb-1 | 27017 | MongoDB database |
| designer-redis-1 | 6379 | Redis cache |
| designer-zookeeper-1 | 2181 | Zookeeper for Kafka |
| designer-kafka-1 | 9092 | Kafka message broker |
| designer-kafka-ui-1 | 8085 | Kafka UI dashboard |
| designer-prometheus-1 | 9090 | Prometheus metrics |
| designer-grafana-1 | 3000 | Grafana dashboards |

---

## Step 2: Build and Start Java Marketplace Service

### Build the JAR

```powershell
cd c:\playground\designer\services\marketplace-service
mvn clean package -DskipTests
```

### Start the Service

```powershell
# Option 1: Start in current terminal
cd c:\playground\designer\services\marketplace-service\target
java -jar marketplace-service-1.0.0-SNAPSHOT.jar `
  --spring.datasource.url=jdbc:postgresql://localhost:5432/marketplace_db `
  --spring.datasource.username=marketplace_user `
  --spring.datasource.password=marketplace_pass_dev

# Option 2: Start in separate window
Start-Process -FilePath "java" -ArgumentList "-jar", "c:\playground\designer\services\marketplace-service\target\marketplace-service-1.0.0-SNAPSHOT.jar", "--spring.datasource.url=jdbc:postgresql://localhost:5432/marketplace_db", "--spring.datasource.username=marketplace_user", "--spring.datasource.password=marketplace_pass_dev" -WorkingDirectory "c:\playground\designer\services\marketplace-service\target"
```

### Verify

```powershell
Invoke-RestMethod http://localhost:8080/actuator/health | ConvertTo-Json
```

Expected: `"status": "UP"` with components (db, mongo, redis) showing UP

---

## Step 3: Start Go Messaging Service

### Build (if needed)

```powershell
cd c:\playground\designer\services\messaging-service
go build -o messaging-service.exe .
```

### Start the Service

```powershell
# Option 1: Start in current terminal
cd c:\playground\designer\services\messaging-service
.\messaging-service.exe

# Option 2: Start in separate window
Start-Process -FilePath "c:\playground\designer\services\messaging-service\messaging-service.exe" -WorkingDirectory "c:\playground\designer\services\messaging-service"
```

### Verify

```powershell
Invoke-RestMethod http://localhost:8081/health | ConvertTo-Json
```

Expected: `"status": "healthy"`

---

## Step 4: Start .NET LMS Service

### Build and Start

```powershell
cd c:\playground\designer\services\lms-service

# Option 1: Run with dotnet (development mode)
dotnet run

# Option 2: Start in separate window
Start-Process -FilePath "dotnet" -ArgumentList "run", "--project", "c:\playground\designer\services\lms-service\lms-service.csproj" -WorkingDirectory "c:\playground\designer\services\lms-service"
```

### Verify

```powershell
Invoke-RestMethod http://localhost:8082/health
```

Expected: `"Healthy"`

---

## Step 5: Verify All Services

Run this command to check all services:

```powershell
Write-Host "=== Service Health Check ===";
$m = Invoke-RestMethod "http://localhost:8080/actuator/health";
Write-Host "Java Marketplace (8080): $($m.status)";
$g = Invoke-RestMethod "http://localhost:8081/health";
Write-Host "Go Messaging (8081): $($g.status)";
$l = Invoke-RestMethod "http://localhost:8082/health";
Write-Host ".NET LMS (8082): $l";
docker ps --format "{{.Names}}: {{.Status}}"
```

---

## API Endpoints

### Java Marketplace Service (8080)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/actuator/health` | GET | Health check |
| `/api/auth/login` | POST | User login |
| `/api/auth/register` | POST | User registration |
| `/api/jobs` | GET | List jobs |
| `/api/users/profile` | GET | User profile (auth required) |
| `/swagger-ui/index.html` | GET | API documentation |

### Go Messaging Service (8081)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/v1/ws` | WS | WebSocket connection |
| `/api/v1/messages/threads` | GET | Get message threads |
| `/api/v1/notifications/` | GET | Get notifications |
| `/metrics` | GET | Prometheus metrics |

### .NET LMS Service (8082)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/api/courses` | GET | List courses |
| `/api/enrollments` | GET | Get enrollments |
| `/metrics` | GET | Prometheus metrics |

---

## Monitoring Dashboards

| Dashboard | URL | Credentials |
|-----------|-----|-------------|
| Kafka UI | http://localhost:8085 | None required |
| Grafana | http://localhost:3000 | admin/admin |
| Prometheus | http://localhost:9090 | None required |

---

## Troubleshooting

### Port Already in Use

```powershell
# Find process using port
netstat -ano | findstr ":8080"

# Kill process by PID
taskkill /F /PID <PID>
```

### Database Connection Issues

```powershell
# Check PostgreSQL is running
docker ps | findstr postgres

# Check database connectivity
docker exec designer-postgres-1 pg_isready -U marketplace_user -d marketplace_db
```

### Restart All Infrastructure

```powershell
cd c:\playground\designer\config
docker compose down
docker compose up -d
```

### Reset Database (Caution: Deletes all data!)

```powershell
cd c:\playground\designer\config
docker compose down -v postgres
docker volume rm config_postgres_data
docker compose up -d postgres
```

### View Service Logs

```powershell
# Docker container logs
docker logs designer-postgres-1 --tail 50
docker logs designer-kafka-1 --tail 50
```

---

## Quick Start Script

Save this as `start-all-services.ps1` in the project root:

```powershell
# Start All Designer Marketplace Services

Write-Host "Starting Designer Marketplace..." -ForegroundColor Cyan

# 1. Start Docker infrastructure
Write-Host "`n[1/4] Starting Docker infrastructure..." -ForegroundColor Yellow
Set-Location c:\playground\designer\config
docker compose up -d
Start-Sleep -Seconds 10

# 2. Start Java Marketplace Service
Write-Host "`n[2/4] Starting Java Marketplace Service..." -ForegroundColor Yellow
Start-Process -FilePath "java" -ArgumentList "-jar", "c:\playground\designer\services\marketplace-service\target\marketplace-service-1.0.0-SNAPSHOT.jar", "--spring.datasource.url=jdbc:postgresql://localhost:5432/marketplace_db", "--spring.datasource.username=marketplace_user", "--spring.datasource.password=marketplace_pass_dev" -WorkingDirectory "c:\playground\designer\services\marketplace-service\target"
Start-Sleep -Seconds 10

# 3. Start Go Messaging Service
Write-Host "`n[3/4] Starting Go Messaging Service..." -ForegroundColor Yellow
Start-Process -FilePath "c:\playground\designer\services\messaging-service\messaging-service.exe" -WorkingDirectory "c:\playground\designer\services\messaging-service"
Start-Sleep -Seconds 3

# 4. Start .NET LMS Service
Write-Host "`n[4/4] Starting .NET LMS Service..." -ForegroundColor Yellow
Start-Process -FilePath "dotnet" -ArgumentList "run", "--project", "c:\playground\designer\services\lms-service\lms-service.csproj" -WorkingDirectory "c:\playground\designer\services\lms-service"
Start-Sleep -Seconds 10

# Verify all services
Write-Host "`n=== Service Health Check ===" -ForegroundColor Cyan
$m = Invoke-RestMethod "http://localhost:8080/actuator/health" -ErrorAction SilentlyContinue
Write-Host "Java Marketplace (8080): $($m.status)"
$g = Invoke-RestMethod "http://localhost:8081/health" -ErrorAction SilentlyContinue  
Write-Host "Go Messaging (8081): $($g.status)"
$l = Invoke-RestMethod "http://localhost:8082/health" -ErrorAction SilentlyContinue
Write-Host ".NET LMS (8082): $l"

Write-Host "`nAll services started!" -ForegroundColor Green
Write-Host "Marketplace API: http://localhost:8080/swagger-ui/index.html"
Write-Host "Messaging API: http://localhost:8081/health"
Write-Host "LMS API: http://localhost:8082/health"
Write-Host "Grafana: http://localhost:3000"
Write-Host "Kafka UI: http://localhost:8085"
```

---

## Stop All Services

```powershell
# Stop application services
taskkill /F /IM java.exe
taskkill /F /IM messaging-service.exe
taskkill /F /IM dotnet.exe

# Stop Docker infrastructure
cd c:\playground\designer\config
docker compose down
```

---

## Technology Stack Summary

| Component | Technology | Version |
|-----------|------------|---------|
| Marketplace Service | Java Spring Boot | 3.3.0, Java 21 |
| Messaging Service | Go Gin | Go 1.24 |
| LMS Service | .NET ASP.NET Core | .NET 8 |
| Database (Relational) | PostgreSQL | 15 |
| Database (Document) | MongoDB | 7 |
| Cache | Redis | 7 |
| Message Broker | Apache Kafka | 7.4.0 (Confluent) |
| Monitoring | Prometheus + Grafana | Latest |

---

*Last updated: December 2025*
