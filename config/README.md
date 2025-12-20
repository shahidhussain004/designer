# ⚙️ Configuration Files

**Last Updated:** December 20, 2025  
**Status:** ✅ Production Ready (Sprints 1-15 Complete)

This folder contains all infrastructure configuration files for development and production deployments.

## 📁 File Structure

### Core Configuration
- **[docker-compose.yml](docker-compose.yml)** - Development environment (9 services)
- **[docker-compose.prod.yml](docker-compose.prod.yml)** - Production environment (NEW - Sprint 15)
- **[nginx.conf](nginx.conf)** - Development Nginx configuration
- **[nginx.prod.conf](nginx.prod.conf)** - Production Nginx with SSL/TLS (NEW - Sprint 15)

### Application Configuration
- **[application-production.yml](application-production.yml)** - Production Spring Boot profile (NEW - Sprint 15)
- **[example.env](example.env)** - Development environment variables template
- **[env.production.template](env.production.template)** - Production environment variables template (NEW - Sprint 15)

### Database
- **[init.sql](init.sql)** - PostgreSQL schema (deprecated - use Flyway migrations)
- **[init.sql/ folder](init.sql/)** - Legacy initialization scripts

### Monitoring
- **[prometheus.yml](prometheus.yml)** - Prometheus metrics collection config

### SSL/TLS
- **[ssl/ folder](ssl/)** - SSL certificates for local development

### Grafana
- **[grafana/ folder](grafana/)** - Grafana provisioning and dashboards

---

## 🐳 Docker Services

### Overview
```
docker-compose.yml includes 9 services:

1. PostgreSQL 15 (Port 5432) - Core database
2. MongoDB 7 (Port 27017) - Content database
3. Redis 7 (Port 6379) - Cache/sessions
4. Zookeeper (Port 2181) - Kafka coordinator
5. Kafka 7.4 (Port 9092) - Event streaming
6. Kafka UI (Port 8085) - Kafka management
7. Prometheus (Port 9090) - Metrics
8. Grafana (Port 3000) - Dashboards
9. Nginx (Port 80) - API Gateway
```

### Volume Mounts
```yaml
PostgreSQL:
  - postgres_data:/var/lib/postgresql/data
  - ./init.sql:/docker-entrypoint-initdb.d/init.sql

MongoDB:
  - mongodb_data:/data/db

Redis:
  - redis_data:/data

Nginx:
  - ./nginx.conf:/etc/nginx/nginx.conf:ro
  - ./ssl:/etc/nginx/ssl:ro

Prometheus:
  - ./prometheus.yml:/etc/prometheus/prometheus.yml
  - prometheus_data:/prometheus

Grafana:
  - grafana_data:/var/lib/grafana
```

---

## 🗄️ PostgreSQL Schema (init.sql)

### 15 Tables

**Users & Profiles:**
- users - All user accounts
- user_profiles - Detailed information
- portfolio_items - Work samples

**Jobs & Proposals:**
- jobs - Posted opportunities
- proposals - Applications
- contracts - Agreements

**Payments:**
- milestones - Deliverables
- time_entries - Hour tracking
- payments - Transactions
- escrow - Payment holding

**Reviews & Chat:**
- reviews - Feedback
- messages - Real-time chat
- conversations - Metadata

**Compliance:**
- verification_records - Identity checks
- audit_logs - Change tracking

---

## 🔌 Nginx Configuration (nginx.conf)

### Features
- ✅ Rate limiting (auth: 5r/s, api: 30r/s, general: 10r/s)
- ✅ CORS configuration
- ✅ Gzip compression
- ✅ Upstream service routing
- ✅ Health check endpoints
- ✅ Security headers (ready for HTTPS)

### Upstream Services
```nginx
upstream java_backend {
    server localhost:8080;  # Core marketplace
}

upstream go_backend {
    server localhost:8081;  # Messaging (Phase 2)
}

upstream dotnet_backend {
    server localhost:8082;  # LMS (Phase 3)
}
```

### Rate Limiting
```
/api/v1/auth/*     → 5 requests/sec per IP
/api/v1/jobs/*     → 30 requests/sec per IP
/api/v1/users/*    → 30 requests/sec per IP
/* (general)       → 10 requests/sec per IP
```

---

## 📊 Prometheus Configuration (prometheus.yml)

### Scrape Targets
- prometheus:9090 - Self-monitoring
- postgres:5432 - Database metrics
- redis:6379 - Cache metrics
- kafka:9101 - Event broker metrics
- nginx:80 - Gateway metrics

### Service Targets (Added Later)
- java-service:8080 - Spring Boot metrics
- go-service:8081 - Go service metrics
- dotnet-service:8082 - .NET service metrics

---

## 🔐 Security Notes

### Production Checklist
- [ ] Change all passwords
- [ ] Enable SSL/TLS in Nginx
- [ ] Enable Redis authentication
- [ ] Configure MongoDB authentication
- [ ] Use environment variables for secrets
- [ ] Configure firewall rules
- [ ] Setup automated backups

---

**Last Updated:** December 17, 2025
**Status:** Ready to use (paths need update after folder move)
