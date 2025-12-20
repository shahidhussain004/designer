# Designer Marketplace Service - Java Spring Boot

**Phase 1-3: Core Marketplace + Payment + LMS + Admin + Security**  
**Status:** ✅ Production Ready (Dec 20, 2025)  
**Last Updated:** December 20, 2025

## Overview

Java Spring Boot REST API service for the Designer Marketplace platform with comprehensive features:
- ✅ Authentication (JWT + BCrypt)
- ✅ User Management & Profiles
- ✅ Job Marketplace (CRUD, search, filtering)
- ✅ Proposals & Contracts
- ✅ Payment Integration (Stripe)
- ✅ Learning Management System (MongoDB, courses, quizzes, certificates)
- ✅ Admin Portal (dashboard, moderation, user management)
- ✅ Security Hardening (rate limiting, brute force protection, audit logging)
- ✅ Production Deployment (Docker, SSL/TLS, optimized configs)

## Overview

Java Spring Boot REST API service for the Designer Marketplace platform. Provides authentication, user management, job postings, proposals, and payment integration with Stripe.

## Tech Stack

- **Java 21**
- **Spring Boot 3.3.0**
- **Spring Security 6.1.8** (JWT + BCrypt)
- **PostgreSQL 15** (via Docker) - 74 users, 18 jobs
- **MongoDB 7** (LMS content storage)
- **Redis** (caching & sessions)
- **Kafka** (event streaming)
- **Flyway** (database migrations - V1-V3)
- **JWT** (HS512 authentication)
- **Stripe API** (payment integration)
- **Bucket4j** (rate limiting)
- **Jakarta Validation** (input validation)
- **Lombok** (1.18.32) - code generation

## Project Structure

```
marketplace-service/
├── src/
│   ├── main/
│   │   ├── java/com/designer/marketplace/
│   │   │   ├── MarketplaceApplication.java
│   │   │   ├── config/           # Security, Redis, Kafka configs
│   │   │   ├── controller/       # REST API endpoints
│   │   │   ├── entity/           # JPA entities
│   │   │   ├── repository/       # Data access layer
│   │   │   ├── service/          # Business logic
│   │   │   ├── dto/              # Data transfer objects
│   │   │   ├── security/         # JWT, auth filters
│   │   │   └── exception/        # Global exception handlers
│   │   └── resources/
│   │       ├── application.yml
│   │       └── db/migration/     # Flyway migrations
│   └── test/
│       └── java/com/designer/marketplace/
└── pom.xml
```

## Prerequisites

- Java 21 or higher
- Maven 3.8+
- Docker (for PostgreSQL, Redis, Kafka)
- IDE (IntelliJ IDEA recommended)

## Setup

### 1. Start Infrastructure

From project root:
```bash
docker-compose -f config/docker-compose.yml up -d
```

### 2. Build Project

```bash
cd services/marketplace-service
mvn clean install
```

### 3. Run Application

```bash
mvn spring-boot:run
```

Or run from IDE: `MarketplaceApplication.java`

## Configuration

Environment variables (or `application.yml`):

```yaml
# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=marketplace_db
DB_USER=marketplace_user
DB_PASSWORD=marketplace_pass_dev

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Kafka
KAFKA_BOOTSTRAP_SERVERS=localhost:9092

# JWT
JWT_SECRET=your-256-bit-secret-change-this-in-production

# Stripe
STRIPE_API_KEY=sk_test_your_test_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token
- `POST /api/auth/refresh` - Refresh access token

### Users
- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile
- `GET /api/users/{id}` - Get user by ID

### Jobs
- `GET /api/jobs` - List jobs (with filters)
- `POST /api/jobs` - Create job posting
- `GET /api/jobs/{id}` - Get job details
- `PUT /api/jobs/{id}` - Update job
- `DELETE /api/jobs/{id}` - Delete job

### Proposals
- `GET /api/proposals` - List proposals
- `POST /api/proposals` - Submit proposal
- `GET /api/proposals/{id}` - Get proposal details
- `PUT /api/proposals/{id}` - Update proposal

## API Documentation

Swagger UI available at: http://localhost:8080/swagger-ui.html

OpenAPI JSON: http://localhost:8080/api-docs

## Database Migrations

Using Flyway:

```bash
# Run migrations
mvn flyway:migrate

# Check status
mvn flyway:info

# Rollback (if needed)
mvn flyway:clean
```

## Testing

```bash
# Run all tests
mvn test

# Run with coverage
mvn test jacoco:report
```

## Current Status

✅ **Completed:**
- Project setup with Maven
- Application properties configuration
- JPA entities (User, Job, Proposal)
- Flyway migration V1

🔄 **In Progress:**
- Security configuration (JWT, bcrypt)
- Repository layer
- Service layer
- REST controllers
- Exception handling

⏳ **Upcoming:**
- Unit tests
- Integration tests
- Stripe integration
- Kafka event publishing

## Next Steps

1. Configure Spring Security + JWT
2. Create repositories (JpaRepository)
3. Implement service layer
4. Build REST controllers
5. Add validation and error handling
6. Write unit tests (50% coverage)
7. Integration tests

## Team Notes

- Follow [PROJECT_TIMELINE_TRACKER.md](../../docs/PROJECT_TIMELINE_TRACKER.md) for task order
- Update [INDEX.md](../../docs/INDEX.md) NEXT STEPS section after completing tasks
- Commit regularly with clear messages

## Support

See main project docs:
- [PROJECT_SUMMARY.md](../../PROJECT_SUMMARY.md)
- [docs/INDEX.md](../../docs/INDEX.md)
- [docs/marketplace_design.md](../../docs/marketplace_design.md)
