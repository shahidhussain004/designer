# Marketplace Design Spec

This document captures the product vision, competitor synthesis, prioritized MVP features, system architecture, data model, matching & verification approach, UX flows, roadmap, AI prompts, and deliverables for a design & dev freelance marketplace.

## 1. Product Vision

- Target users: graphic designers (initial), later web developers and other design-related professionals.
- Primary goals (year 1): acquire X active users, achieve Y posted jobs/month, and reach a time-to-hire under Z days.
- Value proposition: fast discovery of vetted designers for small tasks and scalable expansion to larger scoped projects and other disciplines.

## 2. High-impact Questions to Ask Experts or AI

- Product Vision: Describe your target market and give 3 prioritized business goals for year 1 (revenue, users, retention).
- User Needs: What are the core jobs-to-be-done for both `job-creator` and `job-seeker` in this niche?
- Business Model: Which monetization mix do you prefer: commissions, subscription, listing fees, featured listings, managed services?
- Trust & Safety: What verification, fraud detection, and escrow rules are required to reduce disputes?
- Matching: What trade-offs do you want between algorithmic matching, manual curation, and user search/bidding?
- UX & Conversion: What must happen in the first 3 minutes of a new user session to maximize conversion?
- Ops & Scale: What targets for latency, availability (SLA), and monthly active users should the architecture support?
- Legal/Compliance: Which regions / regulations (e.g., GDPR, CCPA, KYC) must be covered at launch?
- Budget & Timeline: What is the expected dev budget and timeline for a 3‑month MVP vs 6‑12 month full product?

## 3. AI Prompt Templates

- Product Brief Prompt
- MVP Technical Spec Prompt
- Acceptance Criteria Prompt
- UI/UX Wireframe Prompt
- Matching Algorithm Prompt
- Verification & Trust Prompt
- Dev Task Template Prompt

Use these as copy/paste prompts to get consistent, actionable output from AI or experts.

## 4. Competitor Synthesis (quick take)

- Fiverr / Freelancer: Micro-gigs, discoverability, tiered pricing, large supply. Strength: low friction for buyers; downside: mixed quality.
- 99designs: Contest model + curated designers. Strength: design-first workflows; good for discovery.
- FreeUp / Codeable: Strong vetting and high-trust niche marketplaces (vetted talent, higher rates).
- Guru / Workana: Mix of bidding and profiles, region/timezone focus.
- Opportunity: Combine curated vetting (like FreeUp/Codeable) + discoverability/low friction (like Fiverr) + contest/model options (like 99designs).

## 5. Prioritized MVP Features

1. Account & Roles
2. Job Posting Wizard
3. Search & Filters
4. Basic Matching
5. Messaging
6. Payments & Escrow (Stripe Connect recommended)
7. Portfolio & Reviews
8. Admin Dashboard
9. Minimum Vetting

Each feature should have testable acceptance criteria (see separate AI prompt to expand these into tickets).

## 6. Multi-Technology Microservices Architecture

**Philosophy:** Use a microservices approach where different technologies are chosen based on their strengths for specific domains. This provides both practical benefits and learning opportunities without over-engineering.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Layer                          │
├────────────────┬───────────────────┬──────────────────────────┤
│   Next.js       │   React SPA       │   Angular            │
│  (Main Portal)  │ (Admin Dashboard) │ (Learning Platform)  │
└────────┬────────┴────────┬──────────┴──────────┬───────────┘
         │                 │                      │
         └─────────────────┼──────────────────────┘
                           │
                    ┌──────▼──────┐
                    │  API Gateway │
                    │   (Kong/    │
                    │   Nginx)    │
                    └──────┬──────┘
                           │
      ┌────────────────────┼────────────────────┐
      │                    │                    │
┌─────▼─────┐      ┌──────▼──────┐     ┌──────▼──────┐
│Java Spring│      │   Go/Golang │     │ .NET Core   │
│   Boot    │      │   Services  │     │   Service   │
│ (Core API)│      │  (Real-time)│     │   (LMS)     │
└─────┬─────┘      └──────┬──────┘     └──────┬──────┘
      │                   │                    │
┌─────▼─────┐      ┌─────▼──────┐     ┌──────▼──────┐
│ Postgres  │      │  Postgres  │     │  MongoDB    │
│(Core Data)│      │  (Messages)│     │ (Content)   │
└───────────┘      └────────────┘     └─────────────┘
```

### Service Breakdown

#### **1. Core Marketplace Service** (Java Spring Boot + Postgres)
**Why:** Mature ecosystem, strong transaction support, excellent for business logic
- Handles: Users, Jobs, Proposals, Contracts, Payments, Reviews, Verification
- Database: **Postgres** (ACID compliance for financial transactions, strong relational integrity)
- Port: 8080
- Key dependencies: Spring Security, Spring Data JPA, Stripe Java SDK

#### **2. Real-time Messaging & Feed Service** (Go/Golang + Postgres/Redis)
**Why:** Excellent concurrency model, low latency, perfect for WebSocket connections
- Handles: Real-time chat, notifications, feed aggregation from external APIs
- Database: **Postgres** for message persistence + **Redis** for pub/sub and presence
- Port: 8081
- Key dependencies: gorilla/websocket, go-redis, gofeed (RSS parser)

#### **3. Learning Management Service** (ASP.NET Core + MongoDB)
**Why:** Great for content-heavy apps, flexible schema for varied course content
- Handles: Courses, Lessons, Quizzes, Enrollments, Progress tracking, Certificates
- Database: **MongoDB** (flexible schema for lessons with varied content types, rapid iteration)
- Port: 8082
- Key dependencies: MongoDB.Driver, SignalR (for live course updates)

#### **4. Blog & Content Service** (.NET Core or Go + MongoDB)
**Why:** Flexible document storage, fast writes for aggregated feeds
- Handles: Blog posts, external feed aggregation, comments, content moderation
- Database: **MongoDB** (document-oriented for rich text, tags, varied metadata)
- Port: 8083
- Alternative: Could merge with LMS service if using .NET

### Frontend Architecture

#### **Next.js Application** (Main Portal)
**Responsibility:** Public marketplace, job listings, talent profiles, SEO-critical pages
- Routes: `/`, `/jobs`, `/talents`, `/jobs/:id`, `/profile/:id`
- Deployment: Vercel
- Why: SSR/SSG for SEO, fast page loads, built-in API routes

#### **React SPA** (Admin Dashboard)
**Responsibility:** Admin operations, moderation queue, analytics, system management
- Routes: `/admin/*`
- Deployment: Vercel or S3 + CloudFront
- Why: Complex state management (Redux/Zustand), data-heavy tables, charts
- Libraries: React Query, Recharts, AG-Grid

#### **Angular Application** (Learning Platform)
**Responsibility:** Course catalog, lesson player, quiz interface, progress tracking
- Routes: `/learn/*`, `/courses/*`
- Deployment: Netlify or Firebase Hosting
- Why: Enterprise patterns, RxJS for reactive data, form validation (Reactive Forms)
- Libraries: Angular Material, NgRx (if complex state needed)

### Shared Infrastructure

- **API Gateway:** Kong or Nginx (routing, rate limiting, CORS)
- **Auth Service:** Auth0 or Keycloak (SSO across all services)
- **Cache:** Redis (shared sessions, rate limiting, pub/sub)
- **Search:** Elasticsearch (indexes from Postgres & MongoDB)
- **Storage:** S3-compatible (portfolios, course videos, attachments)
- **Payments:** Stripe Connect (integrated via Java service)
- **Monitoring:** Prometheus + Grafana (metrics), ELK Stack (logs), Sentry (errors)
- **CI/CD:** GitHub Actions (separate workflows per service)
- **Container Orchestration:** Docker Compose (dev), Kubernetes or AWS ECS (production)

### Database Strategy

**Postgres** (Primary transactional data)
- users, jobs, proposals, contracts, payments, reviews, verification_records
- messages (persistence with full-text search)
- Why: ACID, foreign keys, complex joins, proven for financial data

**MongoDB** (Content & flexible schemas)
- courses, lessons, quizzes, enrollments, badges
- posts, feed_sources, comments
- Why: Flexible schema, fast writes, embedded documents, horizontal scaling

**Redis** (Cache & real-time)
- Session store, rate limiting, pub/sub for notifications, presence tracking
- Cache layer for frequently accessed data

### Inter-Service Communication

- **Synchronous:** REST APIs via API Gateway (for user-facing requests)
- **Asynchronous:** RabbitMQ or Kafka (for events like "job_posted", "course_completed", "payment_received")
- **Service Discovery:** Consul or Kubernetes DNS
- **API Contracts:** OpenAPI 3.0 specs for each service

### Practical Justification

This isn't just for learning—each choice has real benefits:
1. **Java Spring Boot** handles complex business logic and payment flows with battle-tested libraries
2. **Go** excels at concurrent WebSocket connections and fast feed parsing
3. **.NET** provides robust CMS capabilities and excellent tooling for content management
4. **Postgres** ensures data integrity for critical transactions
5. **MongoDB** allows rapid iteration on course content structure without migrations
6. **Next.js** delivers SEO and performance for public pages
7. **React** offers flexibility for complex admin interfaces
8. **Angular** provides structure for the educational portal with built-in patterns

### Deployment Strategy

**Development:**
- Docker Compose with all services
- Shared volumes for hot reload

**Staging/Production:**
- Kubernetes cluster or AWS ECS
- Separate namespaces per environment
- Horizontal pod autoscaling based on traffic
- Database managed services (RDS Postgres, MongoDB Atlas)

### Phased Implementation

**Phase 1 (Month 1-2):** Core marketplace (Java + Postgres + Next.js)
**Phase 2 (Month 3):** Messaging (Go) + Admin (React)
**Phase 3 (Month 4-5):** Learning platform (.NET + MongoDB + Angular)
**Phase 4 (Month 6):** Blog/Feeds (integrate with existing .NET or separate Go service)

## 7. Core Data Model by Service

### Postgres (Core Marketplace Service - Java Spring Boot)

**users**
- id (UUID), email, passwordHash, role (ENUM), firstName, lastName
- skills (JSONB or separate table), avatarUrl, rating (DECIMAL), totalJobs
- verificationStatus (ENUM), createdAt, updatedAt

**jobs**
- id (UUID), creatorId (FK → users), title, description, category
- skills (JSONB), budgetMin, budgetMax, budgetType (ENUM: fixed/hourly)
- status (ENUM), attachments (JSONB), createdAt, deadline

**proposals**
- id (UUID), jobId (FK → jobs), seekerId (FK → users)
- price, timeline, message, status (ENUM), createdAt

**contracts**
- id (UUID), jobId (FK → jobs), seekerId (FK → users), creatorId (FK → users)
- milestones (JSONB), totalAmount, escrowStatus (ENUM), stripePaymentIntentId

**reviews**
- id (UUID), contractId (FK → contracts), reviewerId (FK → users), revieweeId (FK → users)
- rating (1-5), text, createdAt

**verification_records**
- id (UUID), userId (FK → users), type (ENUM: email/phone/id/portfolio)
- status (ENUM), providerId, metadata (JSONB), verifiedAt

**portfolio_items**
- id (UUID), userId (FK → users), title, description, imageUrls (ARRAY), projectUrl, tags (ARRAY)

### Postgres (Messaging Service - Go)

**messages**
- id (UUID), threadId (UUID), senderId (UUID), receiverId (UUID)
- body (TEXT), attachments (JSONB), readAt, createdAt
- Index on threadId, senderId, receiverId for fast queries

**threads**
- id (UUID), participants (ARRAY of UUIDs), lastMessageAt, jobId (optional)

### MongoDB (Learning Service - .NET Core)

**courses** (collection)
```json
{
  _id: ObjectId,
  title: String,
  slug: String,
  description: String,
  category: String,
  level: String (beginner/intermediate/advanced),
  price: Number,
  authorId: String (UUID from Postgres),
  lessons: [ObjectId refs],
  badges: [ObjectId refs],
  thumbnail: String,
  enrollmentCount: Number,
  rating: Number,
  published: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

**lessons** (collection)
```json
{
  _id: ObjectId,
  courseId: ObjectId,
  title: String,
  type: String (video/article/interactive/quiz),
  content: { // flexible schema
    videoUrl: String,
    articleBody: String,
    interactiveConfig: Object,
    quiz: Object
  },
  duration: Number (minutes),
  order: Number,
  assets: [String]
}
```

**enrollments** (collection)
```json
{
  _id: ObjectId,
  userId: String (UUID),
  courseId: ObjectId,
  progress: Number (0-100),
  completedLessons: [ObjectId],
  score: Number,
  certificateId: String,
  enrolledAt: Date,
  completedAt: Date
}
```

**badges** (collection)
```json
{
  _id: ObjectId,
  name: String,
  description: String,
  criteria: Object,
  icon: String
}
```

### MongoDB (Blog/Content Service)

**posts** (collection)
```json
{
  _id: ObjectId,
  title: String,
  slug: String,
  authorId: String (UUID or null for aggregated),
  body: String (Markdown or HTML),
  excerpt: String,
  tags: [String],
  category: String,
  type: String (original/aggregated),
  sourceUrl: String,
  canonical: String,
  featuredImage: String,
  publishedAt: Date,
  views: Number,
  likes: Number
}
```

**feed_sources** (collection)
```json
{
  _id: ObjectId,
  name: String,
  url: String (RSS/ATOM feed URL),
  lastFetchedAt: Date,
  etag: String,
  status: String (active/paused/error),
  fetchIntervalMinutes: Number
}
```

**comments** (collection)
```json
{
  _id: ObjectId,
  postId: ObjectId,
  userId: String (UUID),
  body: String,
  parentId: ObjectId (for nested comments),
  status: String (approved/pending/rejected),
  createdAt: Date
}
```

### Redis (Cache & Real-time)

- Keys: `session:{userId}`, `rate_limit:{ip}`, `cache:job:{id}`, `presence:user:{id}`
- Pub/Sub channels: `notifications:{userId}`, `job_updates`, `message_sent`

## 8. API Endpoints by Service

### Core Marketplace Service (Java Spring Boot) - Port 8080

**Auth & Users**
- `POST /api/v1/auth/register` — register user
- `POST /api/v1/auth/login` — login and get JWT
- `GET /api/v1/users/:id` — get user profile
- `PUT /api/v1/users/:id` — update profile
- `GET /api/v1/users/search` — search talents (filters: skills, rating, price)

**Jobs**
- `GET /api/v1/jobs` — list jobs (pagination, filters, search)
- `POST /api/v1/jobs` — create job
- `GET /api/v1/jobs/:id` — job detail
- `PUT /api/v1/jobs/:id` — update job
- `DELETE /api/v1/jobs/:id` — delete job

**Proposals**
- `POST /api/v1/jobs/:id/proposals` — submit proposal
- `GET /api/v1/proposals` — list my proposals (seeker) or received proposals (creator)
- `PUT /api/v1/proposals/:id/accept` — accept proposal
- `PUT /api/v1/proposals/:id/reject` — reject proposal

**Contracts & Payments**
- `POST /api/v1/contracts` — create contract from accepted proposal
- `GET /api/v1/contracts/:id` — contract detail
- `POST /api/v1/payments/escrow` — create escrow (Stripe PaymentIntent)
- `POST /api/v1/payments/release` — release milestone payment
- `GET /api/v1/payments/history` — payment history

**Reviews**
- `POST /api/v1/reviews` — create review
- `GET /api/v1/users/:id/reviews` — get user reviews

**Verification**
- `POST /api/v1/verifications` — start verification (email/phone/KYC)
- `GET /api/v1/verifications/:id/status` — check verification status

**Matching**
- `GET /api/v1/jobs/:id/matches` — get top matched talents for job
- `GET /api/v1/users/:id/job-matches` — get recommended jobs for talent

### Messaging Service (Go) - Port 8081

**Messages**
- `WS /ws/chat` — WebSocket connection for real-time chat
- `GET /api/v1/messages/threads` — list user's threads
- `GET /api/v1/messages/threads/:id` — get messages in thread
- `POST /api/v1/messages` — send message (fallback REST endpoint)
- `PUT /api/v1/messages/:id/read` — mark as read

**Notifications**
- `WS /ws/notifications` — WebSocket for real-time notifications
- `GET /api/v1/notifications` — list notifications
- `PUT /api/v1/notifications/:id/read` — mark as read

**Feed Aggregation**
- `POST /api/v1/feeds/aggregate` — trigger feed fetch (admin)
- `GET /api/v1/feeds/sources` — list feed sources

### Learning Service (.NET Core) - Port 8082

**Courses**
- `GET /api/v1/courses` — list courses (filters: category, level, price)
- `GET /api/v1/courses/:id` — course detail with lessons
- `POST /api/v1/courses` — create course (admin/instructor)
- `PUT /api/v1/courses/:id` — update course
- `DELETE /api/v1/courses/:id` — delete course

**Enrollments**
- `POST /api/v1/courses/:id/enroll` — enroll in course
- `GET /api/v1/users/:id/enrollments` — list user enrollments
- `GET /api/v1/enrollments/:id/progress` — get progress

**Lessons**
- `GET /api/v1/lessons/:id` — get lesson content
- `POST /api/v1/lessons/:id/complete` — mark lesson complete
- `POST /api/v1/lessons/:id/submit` — submit quiz/assignment

**Certificates**
- `GET /api/v1/certificates/:id` — get certificate
- `POST /api/v1/enrollments/:id/certificate` — generate certificate (after completion)

### Blog/Content Service (.NET Core or Go) - Port 8083

**Posts**
- `GET /api/v1/posts` — list posts (filters: category, tag, type)
- `GET /api/v1/posts/:slug` — get post by slug
- `POST /api/v1/posts` — create post (admin)
- `PUT /api/v1/posts/:id` — update post
- `DELETE /api/v1/posts/:id` — delete post

**Comments**
- `GET /api/v1/posts/:id/comments` — list comments
- `POST /api/v1/posts/:id/comments` — add comment
- `DELETE /api/v1/comments/:id` — delete comment

**Feed Sources**
- `POST /api/v1/feedsources` — add RSS feed (admin)
- `GET /api/v1/feedsources` — list feed sources
- `PUT /api/v1/feedsources/:id` — update feed source

## 9. Matching & Ranking (hybrid)

- Step 1 — Rule Filter: filter by required skills, budget bounds, availability
- Step 2 — Scoring: weighted score = alpha*skill_match + beta*portfolio_score + gamma*rating + delta*recent_activity + epsilon*response_time
- Step 3 — ML Re-rank: train ranking model on successful-hire features
- Step 4 — Explainability: show top 3 reasons for match

Signals to collect: skills, portfolio similarity, past success rate, on-time delivery, dispute history, timezone overlap, language

## 10. Verification & Trust Flow

- Level 0 (email + phone + portfolio)
- Level 1 (ID selfie & paid KYC)
- Level 2 (manual portfolio review & curated badges)
- Reputation system: escrow completion + reviews + badges
- Fraud detection: anomaly detection rules and monitoring

## 11. UX Flows (key screens)

- Onboarding (role selection, skills, portfolio)
- Post Job Wizard (title, category, budget, deadlines, attachments)
- Talent Card (photo, top skills, sample work, rating, badges)
- Project Page (specs, milestones, chat, files, payment status)
- Admin / Moderation Queue

## 12. Roadmap & Timeline (6-month Phased Implementation)

### Phase 1: Core Marketplace (Months 1-2)
**Tech Stack:** Java Spring Boot + Postgres + Next.js

- Week 1-2: Setup & Foundation
  - Project scaffolding (Spring Boot, Next.js, Postgres, Docker Compose)
  - CI/CD pipelines (GitHub Actions)
  - Auth service integration (Auth0/Keycloak)
  - Database schema for users, jobs, proposals
  
- Week 3-4: Core Features
  - User registration & authentication
  - User profiles with portfolio upload (S3)
  - Job posting wizard (Next.js forms)
  - Job listing & search (Postgres full-text search)
  
- Week 5-6: Matching & Proposals
  - Proposal submission flow
  - Basic matching algorithm (rule-based scoring)
  - Email notifications (SendGrid/AWS SES)
  
- Week 7-8: Payments & Reviews
  - Stripe Connect integration
  - Escrow creation & milestone payments
  - Review system
  - Testing & bug fixes

**Deliverables:** Working marketplace for job posting, talent discovery, proposals, and payments

### Phase 2: Real-time Messaging & Admin (Month 3)
**Tech Stack:** Go + Postgres/Redis + React SPA

- Week 1-2: Messaging Service (Go)
  - WebSocket server with gorilla/websocket
  - Message persistence (Postgres)
  - Redis pub/sub for real-time delivery
  - Thread management
  - Integration with API Gateway
  
- Week 3-4: Admin Dashboard (React)
  - Admin authentication & RBAC
  - User management (suspend, verify, delete)
  - Job moderation queue
  - Payment dispute handling
  - Analytics dashboard (Recharts)
  - Verification workflow UI

**Deliverables:** Real-time chat between users, comprehensive admin tools

### Phase 3: Learning Platform (Months 4-5)
**Tech Stack:** ASP.NET Core + MongoDB + Angular

- Week 1-2: LMS Backend (.NET)
  - .NET Core API project setup
  - MongoDB connection & repositories
  - Course CRUD APIs
  - Lesson content management
  - Enrollment system
  
- Week 3-4: Learning Portal (Angular)
  - Angular project setup with routing
  - Course catalog with filters
  - Course detail & lesson player
  - Video player integration (Video.js)
  - Quiz interface with Angular Reactive Forms
  
- Week 5-6: Progress & Certificates
  - Progress tracking logic
  - Certificate generation (PDF)
  - Badge system
  - Learning path recommendations
  
- Week 7-8: Advanced Features
  - Interactive tutorials (embedded CodePen/Figma)
  - Instructor dashboard
  - Course analytics
  - Integration with marketplace (badges on profiles)

**Deliverables:** Full learning management system with courses, quizzes, progress tracking, certificates

### Phase 4: Blog & Content Aggregation (Month 6)
**Tech Stack:** .NET Core or Go + MongoDB

- Week 1-2: Blog CMS
  - Blog API (reuse .NET service or new Go service)
  - Rich text editor integration
  - SEO optimization (meta tags, sitemaps)
  - Category & tag management
  
- Week 3: Feed Aggregation
  - RSS/ATOM feed parser (Go: gofeed or .NET: SyndicationFeed)
  - Background worker (cron jobs)
  - Content moderation queue
  - Attribution & copyright handling
  
- Week 4: Engagement Features
  - Comment system
  - Social sharing
  - Newsletter integration (Mailchimp API)
  - Analytics (Google Analytics)

**Deliverables:** Blog with original & aggregated content, comment system, newsletter

### Post-Launch (Month 7+)

- **Optimization:** Performance tuning, caching strategies, CDN setup
- **ML Matching:** Train ML model for better job-talent matching
- **Mobile Apps:** React Native or Flutter apps
- **Advanced Verification:** ID verification via Jumio/Checkr
- **Contest Model:** 99designs-style contest feature
- **Internationalization:** Multi-language support
- **Payment Expansion:** Support for additional payment methods

### Development Environment Setup

**Prerequisites:**
- Java 17+ (OpenJDK)
- Go 1.21+
- .NET 8 SDK
- Node.js 20+ (for Next.js, React, Angular)
- Docker & Docker Compose
- Postgres 15+
- MongoDB 7+
- Redis 7+

**Quick Start:**
```bash
# Clone repo
git clone <repo-url>
cd marketplace-platform

# Start infrastructure
docker-compose up -d postgres mongodb redis

# Start Java service
cd services/marketplace-core
./mvnw spring-boot:run

# Start Go service
cd services/messaging-service
go run main.go

# Start .NET service
cd services/learning-service
dotnet run

# Start Next.js frontend
cd frontend/marketplace-web
npm install && npm run dev

# Start React admin
cd frontend/admin-dashboard
npm install && npm run dev

# Start Angular learning portal
cd frontend/learning-portal
npm install && npm start
```

## 13. Technology Learning Strategy

### Why This Multi-Tech Approach Works

This architecture serves dual purposes:
1. **Practical:** Each technology genuinely excels in its assigned domain
2. **Educational:** Provides hands-on experience with industry-standard tools in realistic contexts

### Learning Path Recommendations

#### Java Spring Boot (Core Service)
**Start here** - Most critical and complex service

**Focus Areas:**
- Spring Security (JWT, OAuth2)
- Spring Data JPA (complex queries, transactions)
- Stripe API integration
- Exception handling & validation
- Testing (JUnit 5, Mockito)

**Resources:**
- Spring Boot official guides
- Baeldung tutorials
- "Spring in Action" book

**Time Investment:** 3-4 weeks if already familiar with Java

#### Go/Golang (Messaging Service)
**Second priority** - Simpler scope, great for learning concurrency

**Focus Areas:**
- Goroutines and channels
- WebSocket with gorilla/websocket
- Context package for cancellation
- Database connections (pgx for Postgres)
- HTTP middleware patterns

**Resources:**
- "Go by Example"
- "Concurrency in Go" by Katherine Cox-Buday
- Official Go tour

**Time Investment:** 2-3 weeks for basics, concurrent patterns take practice

#### .NET Core (LMS Service)
**Third priority** - Can be built after core marketplace is stable

**Focus Areas:**
- ASP.NET Core Web API
- MongoDB C# driver
- Dependency injection
- SignalR for real-time updates
- Razor Pages (if adding server-side rendering)

**Resources:**
- Microsoft Learn (free, excellent)
- "Pro ASP.NET Core" book
- .NET YouTube channel

**Time Investment:** 2-3 weeks

#### Frontend Technologies

**Next.js:**
- Server-side rendering (SSR) vs Static Site Generation (SSG)
- API routes
- Image optimization
- SEO best practices
**Time:** 1-2 weeks

**React (for Admin):**
- Hooks (useState, useEffect, useMemo)
- React Query for data fetching
- State management (Context API or Zustand)
**Time:** 1 week if you know Next.js

**Angular (Learning Portal):**
- Components, Services, Modules
- Reactive Forms
- RxJS observables
- HttpClient
**Time:** 2-3 weeks (steeper learning curve)

### Development Best Practices

#### Code Organization
```
marketplace-platform/
├── services/
│   ├── marketplace-core/      # Java Spring Boot
│   ├── messaging-service/     # Go
│   ├── learning-service/      # .NET Core
│   └── blog-service/          # .NET Core or Go
├── frontend/
│   ├── marketplace-web/       # Next.js
│   ├── admin-dashboard/       # React
│   └── learning-portal/       # Angular
├── shared/
│   ├── api-contracts/         # OpenAPI specs
│   └── docker/                # Docker Compose files
└── docs/
    ├── architecture/
    └── api/
```

#### API Contracts & Versioning
- Use OpenAPI 3.0 for all services
- Version APIs from day 1 (`/api/v1/...`)
- Generate client SDKs from OpenAPI specs
- Document breaking vs non-breaking changes

#### Testing Strategy
- **Unit Tests:** All services (JUnit, Go testing, xUnit)
- **Integration Tests:** Database interactions, API endpoints
- **E2E Tests:** Cypress for frontend flows
- **Load Tests:** k6 or JMeter for high-traffic endpoints
- Target: 80%+ coverage on business logic

#### Docker & Local Development
```yaml
# docker-compose.yml snippet
services:
  postgres:
    image: postgres:15-alpine
    ports: ["5432:5432"]
  
  mongodb:
    image: mongo:7
    ports: ["27017:27017"]
  
  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]
  
  marketplace-core:
    build: ./services/marketplace-core
    ports: ["8080:8080"]
    depends_on: [postgres, redis]
  
  # ... other services
```

#### Observability
- **Logging:** Structured JSON logs (logback for Java, zap for Go, Serilog for .NET)
- **Metrics:** Prometheus exporters in each service
- **Tracing:** OpenTelemetry for distributed tracing
- **Dashboards:** Grafana with pre-built dashboards

#### Security Checklist
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS protection (sanitize user content)
- [ ] CSRF tokens on state-changing operations
- [ ] Rate limiting (Redis-based)
- [ ] HTTPS everywhere
- [ ] Secrets in environment variables (never in code)
- [ ] Regular dependency updates (Dependabot)

### Common Pitfalls & Solutions

**Problem:** Services can't talk to each other locally
**Solution:** Use Docker networking or ensure all services bind to `0.0.0.0` not `localhost`

**Problem:** Database migrations become messy
**Solution:** Use Flyway (Java), golang-migrate (Go), EF Core migrations (.NET)

**Problem:** Different date formats across services
**Solution:** Always use ISO 8601 (e.g., `2025-12-17T10:30:00Z`) in APIs

**Problem:** CORS issues between frontend and backend
**Solution:** Configure API Gateway to handle CORS, or use proxy in Next.js config

**Problem:** Inconsistent error responses
**Solution:** Define standard error schema in OpenAPI:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid email format",
    "details": [...]
  }
}
```

### Progressive Learning Approach

**Month 1-2:** Focus only on Java + Postgres + Next.js
- Get comfortable with one stack first
- Deploy a working MVP
- Learn CI/CD patterns

**Month 3:** Add Go service
- Compare concurrency patterns vs Java threads
- Learn WebSocket development
- Practice inter-service communication

**Month 4-5:** Add .NET service
- Compare framework patterns (Spring vs ASP.NET)
- Learn NoSQL with MongoDB
- Practice document modeling

**Month 6:** Add remaining frontend
- React (easier if you know Next.js)
- Angular (most different, requires mindset shift)

### Skill Transferability

What you learn is applicable beyond this project:
- **Java Spring Boot:** Enterprise backend development, fintech
- **Go:** Cloud infrastructure, DevOps tooling, microservices
- **.NET:** Enterprise apps, game backends (Unity), Windows development
- **Next.js:** Modern web development, Jamstack
- **React:** Most popular UI library, mobile (React Native)
- **Angular:** Enterprise frontends, TypeScript expertise

## 14. Free & Open-Source Alternatives (Complete Onboarding Guide)

**YES, this plan is 100% valid with FREE tools.** Every premium service has excellent free alternatives. Here's your complete guide:

### Cost Breakdown: Free vs. Premium

| Component | Free/Open-Source | Premium | Recommendation |
|-----------|-----------------|---------|-----------------|
| **API Gateway** | Nginx, Traefik, Kong OSS | Kong Enterprise | Start: Nginx |
| **Database - SQL** | PostgreSQL | AWS RDS, Managed | Start: Local PostgreSQL |
| **Database - NoSQL** | MongoDB Community | MongoDB Atlas | Start: MongoDB Atlas Free Tier |
| **Cache** | Redis (self-hosted) | AWS ElastiCache | Start: Local Redis |
| **Project Management** | Jira Free, GitHub Projects, OpenProject | Jira Cloud | Start: GitHub Projects |
| **Monitoring** | Prometheus, Grafana, ELK | Datadog, New Relic | Start: Prometheus + Grafana |
| **CI/CD** | GitHub Actions (free tier) | - | GitHub Actions (unlimited free) |
| **Container Reg** | Docker Hub, GitHub Container Registry | - | Start: GitHub Container Registry |
| **Hosting** | Vercel (free tier) + AWS Free Tier | - | Start: Vercel + AWS Free Tier |

**Total Cost to Start:** $0 (Completely Free for 12 months or more)

---

### 1. API Gateway: Nginx (Instead of Kong)

**What:** Lightweight, production-proven reverse proxy and load balancer  
**Why Free:** Open-source, unlimited use, no licensing  
**Best For:** Start with Nginx, migrate to Kong later if needed

#### Quick Start

```bash
# Install locally on Windows using WSL/Docker
docker pull nginx:latest
docker run -d -p 80:80 -p 443:443 \
  -v $(pwd)/nginx.conf:/etc/nginx/nginx.conf \
  --name api-gateway nginx

# Or install via Homebrew (Mac)
brew install nginx
nginx

# Or install on Linux
sudo apt-get install nginx
sudo systemctl start nginx
```

#### Sample nginx.conf for microservices

```nginx
upstream marketplace_core {
    server localhost:8080;
}

upstream messaging_service {
    server localhost:8081;
}

upstream learning_service {
    server localhost:8082;
}

upstream blog_service {
    server localhost:8083;
}

server {
    listen 80;
    server_name api.marketplace.local;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=general:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=auth:10m rate=5r/s;

    location /api/v1/auth/ {
        limit_req zone=auth burst=20;
        proxy_pass http://marketplace_core;
    }

    location /api/v1/jobs/ {
        limit_req zone=general burst=50;
        proxy_pass http://marketplace_core;
    }

    location /api/v1/messages/ {
        proxy_pass http://messaging_service;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";  # WebSocket support
    }

    location /api/v1/courses/ {
        limit_req zone=general burst=50;
        proxy_pass http://learning_service;
    }

    location /api/v1/posts/ {
        limit_req zone=general burst=50;
        proxy_pass http://blog_service;
    }

    # CORS headers
    add_header 'Access-Control-Allow-Origin' '*' always;
    add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
}
```

**Migration Path:** If you outgrow Nginx, switch to Kong Enterprise (no code changes, just configuration migration).

---

### 2. Databases

#### PostgreSQL (Already Free & Open-Source)

**Installation:**

```bash
# macOS
brew install postgresql@15
brew services start postgresql@15

# Windows
# Download installer: https://www.postgresql.org/download/windows/
# Or use Docker
docker run -d \
  -e POSTGRES_PASSWORD=yourpassword \
  -v postgres_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:15-alpine

# Linux
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Free Forever:** PostgreSQL is 100% free, open-source, no limits

**Connection String:**
```
jdbc:postgresql://localhost:5432/marketplace (Java)
postgres://user:password@localhost:5432/marketplace (Go)
Server=localhost;Port=5432;Database=marketplace; (C#)
```

#### MongoDB: Use Free Tier (Not Premium)

**Option A: MongoDB Atlas (Cloud - Recommended for beginners)**

MongoDB offers a **FREE tier** that's perfect for learning:

```
✅ 512 MB storage (enough for MVP)
✅ Shared cloud cluster (no credit card required initially)
✅ Automatic backups
✅ Data stored globally for free
```

**How to Get Started:**

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Sign up free"
3. Create account (email/password or Google login)
4. Create new project "Marketplace"
5. Create cluster (select "M0 Free Tier")
6. Add connection string
7. Get connection URL: `mongodb+srv://username:password@cluster.mongodb.net/marketplace?...`

**Cost:** $0 forever (512 MB), upgrade only when you exceed storage

**Connection Examples:**

```java
// Java: MongoDB Java Driver
MongoClient mongoClient = MongoClients.create(
    "mongodb+srv://user:password@cluster.mongodb.net/marketplace"
);

// C# .NET
var client = new MongoClient(
    "mongodb+srv://user:password@cluster.mongodb.net/marketplace"
);

// Go
client, err := mongo.Connect(ctx, options.Client().
    ApplyURI("mongodb+srv://user:password@cluster.mongodb.net/marketplace"))
```

**Option B: MongoDB Community Edition (Self-Hosted)**

If you want everything local:

```bash
# macOS
brew install mongodb-community
brew services start mongodb-community

# Docker
docker run -d \
  -v mongodb_data:/data/db \
  -p 27017:27017 \
  mongo:7

# Windows
# Download: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
```

**Recommendation:** Start with **MongoDB Atlas free tier** (less setup hassle), migrate to self-hosted or AWS if you need more storage.

#### Redis (Free & Open-Source)

```bash
# macOS
brew install redis
redis-server

# Docker
docker run -d \
  -v redis_data:/data \
  -p 6379:6379 \
  redis:7-alpine

# Or use free Redis cloud: https://redis.io/try-free/
```

**Cost:** $0 (fully free forever)

---

### 3. Project Management: GitHub Projects (Instead of Jira)

**What:** Built-in GitHub project boards, completely free  
**Why:** No sign-up, included with GitHub, integrates with code  
**Best For:** Start here, switch to Jira if you need advanced workflows later

#### How to Set Up

1. Go to your GitHub repo
2. Click "Projects" tab
3. Create new project → select "Table" view (better for Kanban)
4. Create columns: `Backlog`, `In Progress`, `In Review`, `Done`
5. Add issues and drag between columns

#### Sample Workflow

```markdown
# Phase 1 Tasks

### Core Marketplace (Java + Postgres + Next.js)

## Backlog
- [ ] Setup Spring Boot project structure
- [ ] Create database schema
- [ ] Implement user authentication

## In Progress
- [ ] Setup Docker Compose for local dev
- [ ] Create Postgres migrations

## In Review
- [ ] Java Spring Boot API skeleton

## Done
- [x] Architecture decision complete
- [x] Technology stack finalized
```

**GitHub API Integration:**
```bash
# Move issue to "In Progress" via CLI
gh issue edit 1 --state open
gh project item-add <project-id> --id 1

# Auto-close with commits
git commit -m "Fix authentication bug - closes #42"
```

**Migration Path:** When you need advanced workflows (custom fields, automation, reports), upgrade to Jira (no data loss, export then import).

---

### 4. Monitoring & Logging: Prometheus + Grafana (Free Stack)

**What:** Industry-standard monitoring without licensing costs  
**Cost:** $0 (fully open-source)

#### Setup (Docker Compose)

```yaml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus:latest
    ports: ["9090:9090"]
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'

  grafana:
    image: grafana/grafana:latest
    ports: ["3000:3000"]
    volumes:
      - grafana_data:/var/lib/grafana
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
      - GF_SECURITY_ADMIN_USER=admin

  alertmanager:
    image: prom/alertmanager:latest
    ports: ["9093:9093"]
    volumes:
      - ./alertmanager.yml:/etc/alertmanager/alertmanager.yml

volumes:
  prometheus_data:
  grafana_data:
```

#### Prometheus Config (prometheus.yml)

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'java-marketplace'
    static_configs:
      - targets: ['localhost:8080']

  - job_name: 'go-messaging'
    static_configs:
      - targets: ['localhost:8081']

  - job_name: 'dotnet-learning'
    static_configs:
      - targets: ['localhost:8082']
```

**Access Points:**
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3000` (admin/admin)

**Pre-built Dashboards:**
- Java Spring Boot: Search "Spring Boot" in Grafana Dashboards → Import ID 9145
- Go: Import ID 1598
- .NET: Import ID 11159

**Cost:** $0 forever (fully free)

---

### 5. CI/CD: GitHub Actions (Already Free)

GitHub Actions provides unlimited free CI/CD for public repos.

#### Sample Workflow for Java Service

```yaml
# .github/workflows/java-build.yml
name: Java Build & Test

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Build with Maven
        run: cd services/marketplace-core && ./mvnw clean package

      - name: Run tests
        run: cd services/marketplace-core && ./mvnw test

      - name: Push to Docker Hub (optional)
        if: github.ref == 'refs/heads/main'
        run: docker build -t yourrepo/marketplace-core:latest services/marketplace-core
```

**Cost:** Completely free (unlimited for public repos, 2000 min/month for private)

---

### 6. Container Registry: GitHub Container Registry (Free)

```bash
# Login
docker login ghcr.io -u USERNAME -p GITHUB_TOKEN

# Push image
docker tag marketplace-core:latest ghcr.io/username/marketplace-core:latest
docker push ghcr.io/username/marketplace-core:latest

# Pull image
docker pull ghcr.io/username/marketplace-core:latest
```

**Cost:** $0 free for public images, $5/month for unlimited private

---

### 7. Hosting: AWS Free Tier + Vercel (Free)

#### For Next.js Frontend
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy with one command
cd frontend/marketplace-web
vercel

# Auto-deploys on git push with Vercel GitHub integration
```

**Cost:** Vercel free tier: 100 GB bandwidth/month, unlimited deployments

#### For Java/Go/.NET Backend
Use **AWS Free Tier** (12 months free):

```bash
# Create EC2 t2.micro instance (free for 12 months)
# Or use AWS ECS free tier
# Or use Docker Compose on a t2.micro or t3.micro instance
```

**Cost:** 
- EC2 t2.micro: Free for 12 months
- RDS Postgres: Free for 12 months (20GB)
- After 12 months: ~$10-15/month

---

### 8. DNS & SSL (Free)

```bash
# Free SSL certificates with Let's Encrypt (automatic with most platforms)
# Nginx setup:
sudo certbot --nginx -d api.marketplace.com

# Free DNS: Cloudflare, Route53 (free tier), etc.
```

---

### Complete Free Stack Setup (All Together)

```bash
# 1. Clone and navigate
git clone <your-repo>
cd marketplace-platform

# 2. Start infrastructure (all free, all local/cloud-free-tier)
docker-compose up -d

# 3. Services start automatically
# Java: localhost:8080
# Go: localhost:8081
# .NET: localhost:8082
# Nginx: localhost:80
# PostgreSQL: localhost:5432
# MongoDB Atlas: cloud (free tier)
# Redis: localhost:6379
# Prometheus: localhost:9090
# Grafana: localhost:3000
# GitHub Projects: No setup needed

# 4. Run tests via GitHub Actions (free)
git push  # Automatically triggers CI/CD

# 5. Deploy frontend to Vercel (free)
vercel --prod

# 6. Monitor with free stack
# Open Grafana: http://localhost:3000
# Open Prometheus: http://localhost:9090
```

---

### 9. Onboarding Timeline (No Cost)

**Week 1: Setup Free Stack**
- [ ] Create GitHub repo with GitHub Projects board
- [ ] Docker Compose with all services locally
- [ ] Postgresql + MongoDB Atlas setup
- [ ] Nginx config for local routing
- [ ] GitHub Actions workflow

**Week 2-3: Development**
- [ ] Start building Phase 1 (Java service)
- [ ] All code runs locally on free stack
- [ ] CI/CD automatically tests code

**Week 4+: Deployment**
- [ ] Deploy frontend to Vercel (free)
- [ ] Deploy backend to AWS free tier EC2
- [ ] Monitor with Prometheus + Grafana

---

### 10. When to Consider Paid Tiers (Optional)

**After 12 months or 10K users:**

| Service | Free Cost | When to Upgrade | Paid Cost |
|---------|-----------|-----------------|-----------|
| AWS EC2 | Free 12mo | After 12 months | $10-50/mo |
| MongoDB | 512 MB | Storage > 512 MB | $57/mo |
| Jira | Free | > 3 team members | $5/mo per user |
| Datadog | Limited | Want advanced analytics | $15/mo |
| Kong | OSS free | Need advanced API gateway | $500+/mo |

**Recommendation:** Start completely free, pay only when you hit actual business metrics (users, revenue).

---

### Quick Reference: Your Free Stack

```
Frontend
├── Next.js → Vercel (free tier) ✅
├── React Admin → Vercel (free tier) ✅
└── Angular → Netlify (free tier) ✅

Backend Services
├── Java Spring Boot → AWS EC2 t2.micro (free 12mo) ✅
├── Go → AWS EC2 t2.micro (free 12mo) ✅
└── .NET Core → AWS EC2 t2.micro (free 12mo) ✅

Databases
├── PostgreSQL → AWS RDS free tier or local Docker ✅
├── MongoDB → MongoDB Atlas free tier (512 MB) ✅
└── Redis → Local Docker ✅

Infrastructure
├── API Gateway → Nginx (OSS, free) ✅
├── Container Registry → GitHub Container Registry (free) ✅
├── CI/CD → GitHub Actions (free unlimited) ✅
├── Monitoring → Prometheus + Grafana (OSS, free) ✅
└── Project Mgmt → GitHub Projects (free) ✅

Auth
└── Auth0 → Free tier (7000 users) ✅

Total Cost: $0 for first 12+ months
```

---

### Switching from Free to Paid (Easy Path)

**You WON'T need to rewrite code or change architecture if you upgrade:**

- **Nginx → Kong Enterprise:** Same API Gateway interface
- **Local PostgreSQL → AWS RDS:** Change connection string, done
- **MongoDB Atlas Free → MongoDB Atlas Paid:** Auto-upgrade, no migration
- **GitHub Actions → Jenkins/GitLab CI:** Same GitHub integration available
- **Prometheus/Grafana → Datadog:** Export metrics, import elsewhere
- **Vercel → AWS/Azure:** Same Next.js code, different hosting

This architecture is designed to **scale from free to enterprise without code changes.**

## KPIs

- Supply: active job-seekers with portfolios
- Demand: posted jobs weekly
- Time-to-hire: median time from post to accepted proposal
- Conversion: visit → signup → post job
- Match Success: hires from top-5 suggestions
- Trust Signals: % users verified, dispute rate

## 15. Deliverables (pick one to generate next)

- Detailed API spec (OpenAPI 3 YAML)
- ERD and Postgres schema SQL
- Jira-ready tickets for the roadmap
- Implementation-ready AI prompts for dev roles
- Wireframes for 6 key screens
- Matching algorithm pseudocode and scoring formula

## 16. Next Steps

Now that you have a comprehensive multi-technology architecture:

**Choose deliverables to generate:**
- **Detailed API spec** (OpenAPI 3 YAML) for each service (Java, Go, .NET)
- **Complete ERD** and SQL schema for Postgres + MongoDB schemas
- **Jira-ready tickets** for the 6-month roadmap with story points and dependencies
- **Docker Compose** setup for local development with all services
- **Implementation-ready AI prompts** for each service and frontend (see section 3 templates)
- **Wireframes & UI mockups** for 8 key screens across all 3 frontends
- **Matching algorithm** pseudocode with scoring formula implementation
- **CI/CD pipeline** GitHub Actions workflows for each service
- **Security implementation guide** with code examples for JWT, rate limiting, input validation

**Recommended starting sequence:**
1. Generate OpenAPI specs for Phase 1 (Java service core endpoints)
2. Generate Postgres schema SQL for core entities
3. Generate Jira tickets for Phase 1 (Weeks 1-8)
4. Set up Docker Compose for local development
5. Create implementation prompts for Java Spring Boot service

Tell me which deliverable(s) you want first, or say "start with phase 1" and I'll generate everything needed for the Java + Next.js core marketplace.

## 17. Training / Tutorials Section

Goal: Provide structured learning resources for designers (and later developers) to onboard, upskill, and prepare sample work — increasing supply quality and retention.

Key features:

- Learning Paths: curated series (e.g., "Logo Design Basics", "UI for Mobile", "Brand Identity") with ordered lessons and estimated completion time.
- Interactive Tutorials: embedded code/design sandboxes or image editors, quizzes, and mini-projects.
- Video & Article Library: host original videos or embed from platforms (YouTube/Vimeo) and articles.
- Assessments & Badges: short tests and assignments that grant badges or skill-level tags when completed.
- Authoring Tools: admin/editor UI to create courses, lessons, quizzes, and upload assets.
- Progress Tracking: dashboard for users to view progress, certificates, and recommended next steps.
- Monetization Options: free, freemium (paid courses), or instructor revenue share.

Data model additions:

- Course {id, title, description, category, lessons[], level, price, authorId, badges[]}
- Lesson {id, courseId, title, type(video/article/interactive), contentRef, duration, assets[]}
- Quiz {id, lessonId, questions[], passingScore}
- Enrollment {userId, courseId, progress, score, certificateId}
- Badge {id, name, criteria, icon}

API endpoints (examples):

- `GET /courses` — list courses, filters, and search
- `GET /courses/:id` — course detail and lessons
- `POST /courses` — create course (admin/instructor)
- `POST /courses/:id/enroll` — enroll user
- `GET /users/:id/learning-progress` — user progress
- `POST /lessons/:id/submit` — submit assignment or quiz

Integration ideas & tools:

- Use an LMS or elearning platform (Moodle, Canvas) or embed content via headless CMS (Strapi, Sanity) for faster authoring.
- For interactive design sandbox, integrate third-party embeddable editors (Figma Embed, CodePen for front-end code, or a lightweight HTML5 canvas editor).
- Use video hosting (Vimeo Pro or YouTube unlisted) and CDN for assets.
- Track learning events with analytics (Segment, Mixpanel) to feed recommendations into the matching algorithm.

UX considerations:

- Lightweight onboarding lessons appearing in new `job-seeker` onboarding to encourage completion.
- Offer recommended micro-paths (3–5 lessons) that map directly to marketplace roles and badges shown on profiles.

## 18. Blog & External Feeds Section

Goal: Publish design-related articles, tutorials, trend pieces, and aggregated feeds to drive SEO, keep users engaged, and provide curated industry knowledge.

Key features:

- Blog CMS: admin/editor for original posts, categories, tags, and scheduled publishing.
- Feed Aggregator: fetch and display feeds (RSS/ATOM) from trusted sources and partner sites.
- Content Curation: manually curated front page with featured posts and categories (e.g., UX, Branding, Tools).
- Syndication & Attribution: respect source attribution, caching policies, and configurable refresh intervals.
- Comments & Reactions: allow registered users to comment, upvote, and share posts.
- SEO: structured data, sitemaps, and optimized meta tags for each post.
- Newsletter Integration: subscribe users and send curated weekly digests.

Data model additions:

- Post {id, title, slug, authorId, body, excerpt, tags[], category, publishedAt, type(original|aggregated), sourceUrl, canonical}
- FeedSource {id, name, url, lastFetchedAt, etag}
- Comment {id, postId, userId, body, parentId, status}

API endpoints (examples):

- `GET /posts` — list posts with filters (category, tag, source)
- `GET /posts/:slug` — single post
- `POST /posts` — create post (admin)
- `POST /feedsources` — add RSS/ATOM feed source
- `POST /posts/:id/comments` — add comment

Feed integration approach:

- Use a background worker (cron) to poll feed sources respecting `ETag`/`Last-Modified` headers.
- For each feed item:
	- Fetch metadata (title, excerpt, published date, link).
	- Decide whether to import full content or only link + excerpt (consider copyright & permissive reuse).
	- Store as `Post` with type `aggregated` and keep `sourceUrl` and attribution.
- Respect robots and source terms; provide a configurable cache TTL and rate-limiting for each source.

Moderation & copyright:

- Add a moderation queue for aggregated content acceptance.
- Provide a takedown mechanism and an easy way to credit and link back to the original source.

Analytics & growth:

- Track top posts, referral traffic, and engagement metrics (time-on-page, scroll depth).
- Use the blog to seed course content and to recommend learning paths in the Training section.

