# HireFlow™ - Comprehensive Product & Technical Specification
## White-Label Applicant Tracking System as a Service

**Document Version:** 1.0  
**Last Updated:** April 25, 2026  
**Classification:** Strategic Product Plan  

---

# Table of Contents

1. [Executive Vision](#1-executive-vision)
2. [Market Analysis](#2-market-analysis)
3. [Product Architecture](#3-product-architecture)
4. [Technical Specification](#4-technical-specification)
5. [Feature Specification](#5-feature-specification)
6. [Integration Options](#6-integration-options)
7. [White-Label & Customization](#7-white-label--customization)
8. [HR Compliance & Best Practices](#8-hr-compliance--best-practices)
9. [Analytics & Reporting](#9-analytics--reporting)
10. [Security & Privacy](#10-security--privacy)
11. [Pricing Strategy](#11-pricing-strategy)
12. [Go-To-Market Strategy](#12-go-to-market-strategy)
13. [Implementation Roadmap](#13-implementation-roadmap)
14. [Risk Assessment](#14-risk-assessment)
15. [Success Metrics](#15-success-metrics)
16. [Appendices](#16-appendices)

---

# 1. Executive Vision

## 1.1 Mission Statement

**HireFlow™** empowers companies of all sizes to deliver world-class hiring experiences without the complexity and cost of building their own Applicant Tracking System. Through seamless integration and full white-label capabilities, HireFlow becomes an invisible extension of each company's brand.

## 1.2 Vision Statement

To become the #1 embedded hiring platform for growing companies, processing 1 million applications annually by 2028, while maintaining the simplest integration experience in the market.

## 1.3 Core Values

| Value | Description |
|-------|-------------|
| **Simplicity** | 1-day integration, not 6-month projects |
| **Flexibility** | API-first, customize everything |
| **Candidate-First** | Modern UX that candidates love |
| **Compliance** | Built-in HR best practices |
| **Transparency** | Fair pricing, no hidden fees |

## 1.4 Problem Statement

### Current Market Pain Points

**For Companies:**
- Building ATS from scratch costs $200K-$500K and takes 6-12 months
- Enterprise ATS tools are complex, expensive, and overkill for SMBs
- Generic job boards don't match company branding
- No visibility into hiring funnel analytics
- Compliance requirements are confusing and risky

**For HR Teams:**
- Scattered candidate data across email, spreadsheets, calendars
- No standardized interview process
- Can't track time-to-hire or source effectiveness
- Offer management is manual and error-prone
- Poor candidate experience hurts employer brand

**For Candidates:**
- Clunky, outdated application forms
- Black hole experience (no status updates)
- Must re-enter information already on resume
- Can't track multiple applications
- Offer process is confusing

## 1.5 Solution Overview

HireFlow provides a complete hiring infrastructure that companies can integrate into their existing systems with three levels of engagement:

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│  LEVEL 1: API-Only        LEVEL 2: Widgets        LEVEL 3: Hosted  │
│  ──────────────────       ──────────────          ──────────────── │
│  • REST & GraphQL         • React Components      • careers.company│
│  • Webhooks               • Vue Components        • Full portal    │
│  • Mobile SDKs            • Web Components        • Admin dashboard│
│  • Full control           • Drop-in ready         • Zero code      │
│  • Custom UX              • Theme-able            • Quick launch   │
│                                                                     │
│  For: Engineering teams   For: Dev teams with     For: Non-tech    │
│  who want full control    limited time            companies        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

# 2. Market Analysis

## 2.1 Market Size & Growth

### Global ATS Market
- **2024:** $2.3 billion
- **2030:** $3.8 billion (projected)
- **CAGR:** 8.4%

### Addressable Market Segments

| Segment | Companies | Annual Spend | Growth |
|---------|-----------|--------------|--------|
| Enterprise (1000+) | 50,000 | $10K-$100K/yr | 5% |
| Mid-Market (100-999) | 200,000 | $3K-$15K/yr | 12% |
| SMB (10-99) | 2,000,000 | $500-$5K/yr | 18% |
| Micro (<10) | 10,000,000 | $0-$1K/yr | 25% |

**Our Target:** Mid-Market and SMB segments (underserved, high growth)

## 2.2 Competitive Landscape

### Enterprise Competitors

| Competitor | Strengths | Weaknesses | Pricing |
|------------|-----------|------------|---------|
| **Greenhouse** | Full-featured, integrations | Expensive, complex | $6K-$50K/yr |
| **Lever** | Modern UX, collaboration | Enterprise-focused | $8K-$25K/yr |
| **iCIMS** | Enterprise-grade | Outdated UX, expensive | $10K-$100K/yr |
| **Taleo (Oracle)** | Enterprise scale | Legacy system | $20K-$200K/yr |
| **Workday** | Full HCM suite | Overkill for hiring | $50K+/yr |

### SMB Competitors

| Competitor | Strengths | Weaknesses | Pricing |
|------------|-----------|------------|---------|
| **Workable** | Easy to use | Limited customization | $149-$799/mo |
| **JazzHR** | Affordable | Basic features | $39-$239/mo |
| **BambooHR** | HR suite | ATS is secondary | $99-$499/mo |
| **Breezy HR** | Visual pipeline | Limited integrations | $157-$439/mo |
| **Recruitee** | Good UX | Limited white-label | €199-€399/mo |

### Our Differentiation

```
┌───────────────────────────────────────────────────────────────────┐
│                    HIREFLOW COMPETITIVE MOAT                      │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. API-FIRST ARCHITECTURE                                        │
│     • Not a bolt-on API, designed for embedding                  │
│     • GraphQL + REST + Webhooks + SDKs                           │
│     • Real-time updates via WebSockets                           │
│                                                                   │
│  2. TRUE WHITE-LABEL                                              │
│     • Zero HireFlow branding visible to candidates               │
│     • Custom domains with SSL                                    │
│     • Complete CSS/theming control                               │
│                                                                   │
│  3. MODERN OFFER WORKFLOW                                         │
│     • Formal offer generation                                    │
│     • E-signature integration                                    │
│     • Offer comparison for candidates                            │
│     • Counter-offer handling                                     │
│                                                                   │
│  4. SIMPLEST INTEGRATION                                          │
│     • 1-day implementation (not 6 months)                        │
│     • Copy-paste widget embed                                    │
│     • Comprehensive documentation                                │
│                                                                   │
│  5. TRANSPARENT PRICING                                           │
│     • No per-seat fees                                           │
│     • No hidden implementation costs                             │
│     • Month-to-month available                                   │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

## 2.3 Target Customer Profiles

### Primary: Growth-Stage Companies

**Company Profile:**
- 50-500 employees
- Hiring 10-50 people/year
- Has existing website/product
- Engineering capacity but limited HR tech budget
- Values speed and simplicity

**Decision Makers:**
- VP of People/HR
- CTO/VP Engineering (for integration)
- CEO (for budget approval)

**Pain Points:**
- Outgrowing spreadsheets
- Can't justify enterprise ATS cost
- Need to maintain brand consistency
- Want analytics without complexity

### Secondary: Tech-Forward SMBs

**Company Profile:**
- 10-50 employees
- Hiring 5-20 people/year
- Strong technical founder
- Values modern tools

**Decision Makers:**
- CEO/Founder
- Head of Ops

**Pain Points:**
- No dedicated HR
- Manual hiring processes
- Want "just works" solution
- Budget-conscious

### Tertiary: Staffing Agencies & Recruiters

**Company Profile:**
- Recruitment firms
- Staffing agencies
- HR consultants

**Decision Makers:**
- Managing Director
- Operations Lead

**Pain Points:**
- Need client-facing portals
- Multiple client brands
- Volume processing
- Commission tracking

---

# 3. Product Architecture

## 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CUSTOMER TOUCHPOINTS                          │
├─────────────────┬─────────────────┬─────────────────┬──────────────────┤
│ Customer Website│  Hosted Portal  │   Mobile App    │   Admin Portal   │
│  (Embedded)     │ (careers.xyz)   │  (iOS/Android)  │   (Dashboard)    │
└────────┬────────┴────────┬────────┴────────┬────────┴────────┬─────────┘
         │                 │                 │                 │
         ▼                 ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                            API GATEWAY                                  │
│            (Rate Limiting, Auth, Routing, Caching)                     │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  JOBS SERVICE   │   │ APPLICATIONS    │   │    OFFERS       │
│                 │   │    SERVICE      │   │   SERVICE       │
│ • Job CRUD      │   │ • Apply flow    │   │ • Offer create  │
│ • Publishing    │   │ • Status mgmt   │   │ • Negotiation   │
│ • Categories    │   │ • Pipeline      │   │ • E-signature   │
│ • Search/Filter │   │ • Notes/Rating  │   │ • Acceptance    │
└────────┬────────┘   └────────┬────────┘   └────────┬────────┘
         │                     │                     │
         └──────────┬──────────┴──────────┬──────────┘
                    │                     │
         ┌──────────▼──────────┐ ┌────────▼────────┐
         │   TENANT SERVICE    │ │ NOTIFICATION    │
         │                     │ │    SERVICE      │
         │ • Multi-tenancy     │ │                 │
         │ • Branding          │ │ • Email         │
         │ • Billing           │ │ • SMS           │
         │ • Settings          │ │ • Push          │
         └──────────┬──────────┘ │ • Webhooks      │
                    │            └────────┬────────┘
         ┌──────────▼──────────────────────▼────────┐
         │              DATA LAYER                  │
         │                                          │
         │  PostgreSQL    Redis    S3/Blob         │
         │  (Primary DB)  (Cache)  (Documents)     │
         │                                          │
         │  Elasticsearch  TimescaleDB              │
         │  (Search)       (Analytics)              │
         └──────────────────────────────────────────┘
```

## 3.2 Multi-Tenant Data Architecture

### Database Isolation Strategy

**Option A: Schema-per-Tenant (Recommended for <1000 tenants)**
```sql
-- Each tenant gets own schema
CREATE SCHEMA tenant_acme;
CREATE SCHEMA tenant_globex;

-- Tables are duplicated per schema
tenant_acme.jobs
tenant_acme.applications
tenant_globex.jobs
tenant_globex.applications
```

**Benefits:**
- Strong data isolation
- Easy backup/restore per tenant
- Tenant-specific indexes
- Simpler queries (no tenant_id filter)

**Option B: Row-level Security (For scale)**
```sql
-- Single schema with tenant_id column
CREATE TABLE jobs (
    id BIGSERIAL PRIMARY KEY,
    tenant_id UUID NOT NULL,
    title VARCHAR(255),
    ...
);

-- RLS policy
CREATE POLICY tenant_isolation ON jobs
    USING (tenant_id = current_setting('app.tenant_id')::uuid);
```

**Benefits:**
- Scales to unlimited tenants
- Simpler schema management
- Better resource sharing

### Recommended Approach
- Start with **Schema-per-Tenant** for first 100 customers
- Migrate to **Row-level Security** when scaling beyond

## 3.3 Service Boundaries

### Jobs Service
```yaml
responsibilities:
  - Job CRUD operations
  - Job publishing/unpublishing
  - Job status management (DRAFT, OPEN, CLOSED, FILLED)
  - Job search and filtering
  - Category/tag management
  - Job templates

apis:
  - POST   /jobs
  - GET    /jobs
  - GET    /jobs/{id}
  - PUT    /jobs/{id}
  - DELETE /jobs/{id}
  - POST   /jobs/{id}/publish
  - POST   /jobs/{id}/close
  - POST   /jobs/{id}/mark-filled

events_published:
  - job.created
  - job.published
  - job.closed
  - job.filled
  - job.deleted
```

### Applications Service
```yaml
responsibilities:
  - Application submission
  - Application pipeline management
  - Status transitions
  - Candidate notes and ratings
  - Interview scheduling hooks
  - Application search

apis:
  - POST   /applications
  - GET    /applications
  - GET    /applications/{id}
  - PUT    /applications/{id}/status
  - POST   /applications/{id}/notes
  - POST   /applications/{id}/rate
  - GET    /jobs/{id}/applications

events_published:
  - application.submitted
  - application.status_changed
  - application.shortlisted
  - application.rejected
```

### Offers Service
```yaml
responsibilities:
  - Formal offer creation
  - Offer delivery
  - Offer tracking (viewed, accepted, rejected)
  - Counter-offer handling
  - E-signature integration
  - Offer expiration management

apis:
  - POST   /applications/{id}/offer
  - GET    /offers/{id}
  - PUT    /offers/{id}
  - POST   /offers/{id}/send
  - POST   /offers/{id}/respond
  - GET    /offers/{id}/document

events_published:
  - offer.created
  - offer.sent
  - offer.viewed
  - offer.accepted
  - offer.rejected
  - offer.expired
```

### Tenant Service
```yaml
responsibilities:
  - Tenant provisioning
  - Branding configuration
  - Billing management
  - User management
  - API key management
  - Settings/preferences

apis:
  - POST   /tenants
  - GET    /tenants/{id}
  - PUT    /tenants/{id}/branding
  - PUT    /tenants/{id}/settings
  - GET    /tenants/{id}/usage
  - POST   /tenants/{id}/api-keys
```

### Notification Service
```yaml
responsibilities:
  - Email sending (transactional)
  - SMS notifications
  - Push notifications
  - Webhook delivery
  - Template management
  - Delivery tracking

events_consumed:
  - application.submitted → Send confirmation to candidate
  - application.status_changed → Notify candidate
  - offer.sent → Deliver offer email
  - offer.accepted → Notify employer
```

---

# 4. Technical Specification

## 4.1 Technology Stack

### Backend Services

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Runtime | Java 21 / Spring Boot 3.x | Mature, performant, enterprise-ready |
| API Style | REST + GraphQL | REST for simplicity, GraphQL for flexibility |
| Database | PostgreSQL 15+ | JSONB support, excellent performance |
| Cache | Redis | Session, rate limiting, caching |
| Search | Elasticsearch | Full-text search, analytics |
| Queue | Apache Kafka | Event streaming, reliability |
| Storage | S3-compatible | Documents, resumes, attachments |

### Frontend Options

| Component | Technology | Use Case |
|-----------|------------|----------|
| Admin Dashboard | Next.js 14+ / React 18 | Internal admin portal |
| Widget Library | Web Components | Framework-agnostic embeds |
| React SDK | React 18 + TypeScript | React integrations |
| Vue SDK | Vue 3 + TypeScript | Vue integrations |
| Mobile SDK | React Native | Mobile apps |

### Infrastructure

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Container | Docker | Standardized deployment |
| Orchestration | Kubernetes | Scaling, self-healing |
| Cloud | AWS / GCP / Azure | Multi-cloud ready |
| CDN | CloudFlare | Global edge caching |
| DNS | Route53 / CloudFlare | Custom domain support |
| SSL | Let's Encrypt | Automated certificates |

## 4.2 API Design

### REST API Structure

```
Base URL: https://api.hireflow.io/v1

Authentication:
  Header: Authorization: Bearer {api_key}
  Header: X-Tenant-ID: {tenant_id} (optional, inferred from API key)

Rate Limits:
  - Starter: 100 req/min
  - Growth: 500 req/min
  - Business: 2000 req/min
  - Enterprise: Custom

Response Format:
{
  "data": { ... },
  "meta": {
    "request_id": "uuid",
    "timestamp": "ISO8601"
  },
  "pagination": {
    "page": 1,
    "per_page": 20,
    "total": 100,
    "total_pages": 5
  }
}

Error Format:
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human readable message",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  },
  "meta": {
    "request_id": "uuid"
  }
}
```

### Key Endpoints

```yaml
# Jobs
POST   /v1/jobs                    # Create job
GET    /v1/jobs                    # List jobs (with filters)
GET    /v1/jobs/{id}               # Get job details
PUT    /v1/jobs/{id}               # Update job
DELETE /v1/jobs/{id}               # Delete job
POST   /v1/jobs/{id}/publish       # Publish draft job
POST   /v1/jobs/{id}/close         # Close job
POST   /v1/jobs/{id}/mark-filled   # Mark as filled

# Applications
POST   /v1/applications            # Submit application
GET    /v1/applications            # List applications
GET    /v1/applications/{id}       # Get application
PUT    /v1/applications/{id}       # Update application
POST   /v1/applications/{id}/status # Change status
POST   /v1/applications/{id}/offer  # Create offer

# Offers
GET    /v1/offers/{id}             # Get offer details
POST   /v1/offers/{id}/respond     # Accept/reject offer
GET    /v1/offers/{id}/document    # Download offer letter

# Candidates (deduplicated across jobs)
GET    /v1/candidates              # List all candidates
GET    /v1/candidates/{id}         # Get candidate profile
GET    /v1/candidates/{id}/applications # Candidate's applications

# Analytics
GET    /v1/analytics/overview      # Dashboard metrics
GET    /v1/analytics/pipeline      # Pipeline metrics
GET    /v1/analytics/sources       # Source attribution
GET    /v1/analytics/time-to-hire  # Time metrics
```

### GraphQL Schema (Excerpt)

```graphql
type Query {
  jobs(filter: JobFilter, pagination: Pagination): JobConnection!
  job(id: ID!): Job
  applications(filter: ApplicationFilter): ApplicationConnection!
  application(id: ID!): Application
  analytics: Analytics!
}

type Mutation {
  createJob(input: CreateJobInput!): Job!
  updateJob(id: ID!, input: UpdateJobInput!): Job!
  publishJob(id: ID!): Job!
  closeJob(id: ID!): Job!
  markJobFilled(id: ID!, applicationId: ID): Job!
  
  submitApplication(input: ApplicationInput!): Application!
  updateApplicationStatus(id: ID!, status: ApplicationStatus!): Application!
  
  createOffer(applicationId: ID!, input: OfferInput!): Offer!
  respondToOffer(id: ID!, response: OfferResponse!): Offer!
}

type Subscription {
  applicationReceived(jobId: ID): Application!
  applicationStatusChanged(applicationId: ID): Application!
  offerResponded(offerId: ID): Offer!
}

type Job {
  id: ID!
  title: String!
  description: String!
  status: JobStatus!
  location: Location
  salary: SalaryRange
  requirements: [String!]
  skills: [Skill!]
  applications: ApplicationConnection!
  analytics: JobAnalytics!
  createdAt: DateTime!
  publishedAt: DateTime
  closedAt: DateTime
  filledAt: DateTime
}

type Application {
  id: ID!
  job: Job!
  candidate: Candidate!
  status: ApplicationStatus!
  coverLetter: String
  resumeUrl: String
  answers: [ApplicationAnswer!]
  notes: [Note!]
  rating: Float
  offer: Offer
  timeline: [TimelineEvent!]!
  createdAt: DateTime!
}

enum JobStatus {
  DRAFT
  OPEN
  CLOSED
  FILLED
}

enum ApplicationStatus {
  PENDING
  REVIEWING
  SHORTLISTED
  INTERVIEWING
  OFFERED
  ACCEPTED
  REJECTED
  WITHDRAWN
}
```

### Webhooks

```yaml
Available Events:
  # Jobs
  - job.created
  - job.published
  - job.updated
  - job.closed
  - job.filled
  - job.deleted

  # Applications
  - application.submitted
  - application.status_changed
  - application.shortlisted
  - application.interviewed
  - application.rejected
  - application.withdrawn

  # Offers
  - offer.created
  - offer.sent
  - offer.viewed
  - offer.accepted
  - offer.rejected
  - offer.expired
  - offer.countered

Webhook Payload:
{
  "event": "application.submitted",
  "timestamp": "2026-04-25T12:00:00Z",
  "tenant_id": "uuid",
  "data": {
    "application": { ... },
    "job": { ... },
    "candidate": { ... }
  }
}

Webhook Security:
  - HMAC-SHA256 signature in X-HireFlow-Signature header
  - Retry with exponential backoff (5 attempts)
  - Webhook logs available in dashboard
```

## 4.3 Database Schema (Key Tables)

```sql
-- =====================================================
-- TENANT/ORGANIZATION TABLES
-- =====================================================

CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    domain VARCHAR(255),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    plan VARCHAR(50) DEFAULT 'STARTER',
    settings JSONB DEFAULT '{}',
    branding JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tenant_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'MEMBER',
    permissions JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, email)
);

CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES tenants(id),
    name VARCHAR(100),
    key_hash VARCHAR(255) NOT NULL,
    key_prefix VARCHAR(20) NOT NULL,
    scopes JSONB DEFAULT '["read", "write"]',
    last_used_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- JOB TABLES
-- =====================================================

CREATE TABLE jobs (
    id BIGSERIAL PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    external_id VARCHAR(100), -- Customer's own ID
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    description TEXT,
    responsibilities TEXT,
    requirements TEXT,
    status VARCHAR(20) DEFAULT 'DRAFT',
    
    -- Location
    location_type VARCHAR(20), -- ONSITE, REMOTE, HYBRID
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    timezone VARCHAR(50),
    
    -- Compensation
    salary_min_cents BIGINT,
    salary_max_cents BIGINT,
    salary_currency VARCHAR(3) DEFAULT 'USD',
    salary_period VARCHAR(20), -- HOURLY, MONTHLY, YEARLY
    show_salary BOOLEAN DEFAULT true,
    
    -- Classification
    job_type VARCHAR(50), -- FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP
    experience_level VARCHAR(50),
    category_id BIGINT,
    department VARCHAR(100),
    
    -- Skills & Requirements
    required_skills JSONB DEFAULT '[]',
    preferred_skills JSONB DEFAULT '[]',
    benefits JSONB DEFAULT '[]',
    
    -- Application Settings
    application_deadline TIMESTAMP,
    max_applications INT,
    custom_questions JSONB DEFAULT '[]',
    
    -- SEO & Display
    is_featured BOOLEAN DEFAULT false,
    is_urgent BOOLEAN DEFAULT false,
    
    -- Tracking
    views_count INT DEFAULT 0,
    applications_count INT DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    published_at TIMESTAMP,
    closed_at TIMESTAMP,
    filled_at TIMESTAMP,
    filled_by_application_id BIGINT,
    
    UNIQUE(tenant_id, slug)
);

-- =====================================================
-- APPLICATION TABLES
-- =====================================================

CREATE TABLE candidates (
    id BIGSERIAL PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    email VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(50),
    linkedin_url VARCHAR(500),
    portfolio_url VARCHAR(500),
    resume_url VARCHAR(500),
    location VARCHAR(255),
    source VARCHAR(100),
    tags JSONB DEFAULT '[]',
    custom_fields JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, email)
);

CREATE TABLE applications (
    id BIGSERIAL PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    job_id BIGINT REFERENCES jobs(id),
    candidate_id BIGINT REFERENCES candidates(id),
    
    status VARCHAR(30) DEFAULT 'PENDING',
    stage VARCHAR(50),
    
    -- Application Content
    cover_letter TEXT,
    resume_url VARCHAR(500),
    answers JSONB DEFAULT '[]',
    
    -- Evaluation
    rating DECIMAL(3,2),
    rating_count INT DEFAULT 0,
    
    -- Internal
    rejection_reason TEXT,
    company_notes TEXT,
    
    -- Source Tracking
    source VARCHAR(100),
    referrer_url VARCHAR(500),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    shortlisted_at TIMESTAMP,
    interviewed_at TIMESTAMP,
    offered_at TIMESTAMP,
    responded_at TIMESTAMP,
    
    UNIQUE(job_id, candidate_id)
);

CREATE TABLE application_notes (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT REFERENCES applications(id),
    user_id UUID,
    content TEXT NOT NULL,
    is_private BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE application_ratings (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT REFERENCES applications(id),
    user_id UUID,
    criteria VARCHAR(100),
    score INT CHECK (score >= 1 AND score <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(application_id, user_id, criteria)
);

-- =====================================================
-- OFFER TABLES
-- =====================================================

CREATE TABLE offers (
    id BIGSERIAL PRIMARY KEY,
    tenant_id UUID REFERENCES tenants(id),
    application_id BIGINT REFERENCES applications(id),
    
    -- Compensation
    salary_cents BIGINT NOT NULL,
    salary_currency VARCHAR(3) DEFAULT 'USD',
    salary_period VARCHAR(20) NOT NULL,
    signing_bonus_cents BIGINT,
    equity_percentage DECIMAL(5,4),
    
    -- Terms
    start_date DATE,
    contract_type VARCHAR(50),
    contract_duration_months INT,
    probation_months INT,
    
    -- Benefits
    benefits TEXT,
    additional_terms TEXT,
    
    -- Document
    offer_letter_url VARCHAR(500),
    signed_document_url VARCHAR(500),
    
    -- Status
    status VARCHAR(30) DEFAULT 'DRAFT',
    expires_at TIMESTAMP,
    
    -- Tracking
    sent_at TIMESTAMP,
    viewed_at TIMESTAMP,
    responded_at TIMESTAMP,
    response VARCHAR(20), -- ACCEPTED, REJECTED, COUNTERED
    response_notes TEXT,
    
    -- E-Signature
    signature_request_id VARCHAR(255),
    signature_status VARCHAR(30),
    signed_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- ANALYTICS TABLES (TimescaleDB hypertables)
-- =====================================================

CREATE TABLE analytics_events (
    time TIMESTAMPTZ NOT NULL,
    tenant_id UUID NOT NULL,
    event_type VARCHAR(50) NOT NULL,
    job_id BIGINT,
    application_id BIGINT,
    candidate_id BIGINT,
    user_id UUID,
    metadata JSONB DEFAULT '{}'
);

-- Convert to hypertable for time-series queries
SELECT create_hypertable('analytics_events', 'time');

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_jobs_tenant_status ON jobs(tenant_id, status);
CREATE INDEX idx_jobs_tenant_published ON jobs(tenant_id, published_at DESC);
CREATE INDEX idx_applications_job_status ON applications(job_id, status);
CREATE INDEX idx_applications_candidate ON applications(candidate_id);
CREATE INDEX idx_applications_tenant_created ON applications(tenant_id, created_at DESC);
CREATE INDEX idx_candidates_tenant_email ON candidates(tenant_id, email);
CREATE INDEX idx_offers_application ON offers(application_id);
CREATE INDEX idx_analytics_tenant_time ON analytics_events(tenant_id, time DESC);
```

---

# 5. Feature Specification

## 5.1 Job Management Features

### Job Creation & Editing

| Feature | Starter | Growth | Business | Enterprise |
|---------|---------|--------|----------|------------|
| Basic job posting | ✅ | ✅ | ✅ | ✅ |
| Rich text editor | ✅ | ✅ | ✅ | ✅ |
| Custom application questions | 3 | 10 | Unlimited | Unlimited |
| Job templates | 2 | 10 | Unlimited | Unlimited |
| Salary range settings | ✅ | ✅ | ✅ | ✅ |
| Skills tagging | ✅ | ✅ | ✅ | ✅ |
| Benefits/perks listing | ✅ | ✅ | ✅ | ✅ |
| SEO optimization | Basic | Advanced | Advanced | Custom |
| Draft/publish workflow | ✅ | ✅ | ✅ | ✅ |
| Scheduled publishing | ❌ | ✅ | ✅ | ✅ |
| Application deadline | ✅ | ✅ | ✅ | ✅ |
| Max applications limit | ❌ | ✅ | ✅ | ✅ |

### Job Lifecycle States

```
┌─────────────────────────────────────────────────────────────────┐
│                     JOB LIFECYCLE                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌───────┐      ┌──────┐      ┌────────┐      ┌────────┐     │
│   │ DRAFT │ ──▶  │ OPEN │ ──▶  │ CLOSED │ ──▶  │ FILLED │     │
│   └───┬───┘      └──┬───┘      └────┬───┘      └────────┘     │
│       │             │               │                          │
│       │             │               │                          │
│       │             ▼               ▼                          │
│       │        ┌──────────────────────────┐                    │
│       └──────▶ │         DELETE           │                    │
│                └──────────────────────────┘                    │
│                                                                 │
│   Transitions:                                                  │
│   • DRAFT → OPEN (Publish)                                     │
│   • OPEN → CLOSED (Close/Pause)                                │
│   • OPEN → FILLED (Mark as Filled)                             │
│   • CLOSED → OPEN (Reopen)                                     │
│   • CLOSED → FILLED (Mark as Filled)                           │
│   • Any → DELETE (with confirmation)                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 5.2 Application Pipeline Features

### Pipeline Stages (Configurable)

```
Default Pipeline:
┌──────────┐   ┌───────────┐   ┌─────────────┐   ┌──────────────┐
│ PENDING  │ → │ REVIEWING │ → │ SHORTLISTED │ → │ INTERVIEWING │
└──────────┘   └───────────┘   └─────────────┘   └──────┬───────┘
                                                        │
                     ┌──────────────────────────────────┘
                     │
                     ▼
              ┌──────────┐   ┌──────────┐
              │ OFFERED  │ → │ ACCEPTED │
              └────┬─────┘   └──────────┘
                   │
                   ▼
              ┌──────────┐
              │ REJECTED │
              └──────────┘
```

### Pipeline Features

| Feature | Description |
|---------|-------------|
| Kanban View | Drag-and-drop cards between stages |
| List View | Sortable/filterable table |
| Bulk Actions | Move, reject, or email multiple candidates |
| Quick Actions | One-click status changes |
| Keyboard Shortcuts | j/k navigation, s for star, r for reject |
| Saved Filters | Custom filter combinations |
| Smart Labels | Auto-tagging based on resume content |

### Application Actions

| Action | Description | Automation |
|--------|-------------|------------|
| Review | Move to reviewing stage | Auto-send acknowledgment |
| Shortlist | Mark as strong candidate | Optional notification |
| Schedule Interview | Set interview date/time | Calendar integration |
| Request Info | Ask candidate for more details | Email template |
| Make Offer | Create formal offer | Offer workflow |
| Reject | Decline with optional reason | Rejection email |
| Archive | Remove from active pipeline | No notification |

## 5.3 Offer Workflow Features

### Offer Creation

```
┌─────────────────────────────────────────────────────────────────┐
│                    MAKE OFFER WORKFLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STEP 1: Compensation                                          │
│  ├─ Base Salary: $_______ per [hour/month/year]               │
│  ├─ Currency: [USD ▼]                                          │
│  ├─ Signing Bonus: $_______                                    │
│  └─ Equity: ___.___ %                                          │
│                                                                 │
│  STEP 2: Contract Details                                      │
│  ├─ Contract Type: [Full-time ▼]                               │
│  ├─ Start Date: [Date Picker]                                  │
│  ├─ Duration: [Permanent/Fixed-term]                           │
│  └─ Probation Period: ___ months                               │
│                                                                 │
│  STEP 3: Benefits & Terms                                      │
│  ├─ Benefits: [Multi-select or text]                           │
│  └─ Additional Terms: [Text area]                              │
│                                                                 │
│  STEP 4: Offer Expiration                                      │
│  ├─ Expires: [Date/Time Picker]                                │
│  └─ Reminder: Send reminder [2 days] before expiry             │
│                                                                 │
│  STEP 5: Documents                                             │
│  ├─ Attach Offer Letter: [Upload PDF]                          │
│  └─ Require E-Signature: [Yes/No]                              │
│                                                                 │
│  STEP 6: Internal Notes                                        │
│  └─ Notes (not visible to candidate): [Text area]              │
│                                                                 │
│  [Cancel]  [Save Draft]  [Preview]  [Send Offer]               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Offer States

| State | Description | Candidate Can |
|-------|-------------|---------------|
| DRAFT | Not sent, editable | Nothing |
| SENT | Delivered to candidate | View, respond |
| VIEWED | Candidate opened offer | View, respond |
| ACCEPTED | Candidate accepted | View only |
| REJECTED | Candidate declined | View only |
| COUNTERED | Candidate made counter-offer | View, negotiate |
| EXPIRED | Deadline passed | Nothing |
| WITHDRAWN | Company withdrew offer | Nothing |

### E-Signature Integration

Supported Providers:
- DocuSign
- HelloSign
- Adobe Sign
- PandaDoc

Workflow:
1. Company attaches offer letter PDF
2. Marks signature fields
3. Sends offer via HireFlow
4. Candidate receives email with view link
5. Candidate reviews and signs digitally
6. Signed document stored in HireFlow
7. Both parties notified

## 5.4 Candidate Experience Features

### Application Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    CANDIDATE APPLICATION FLOW                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STEP 1: View Job (Public)                                     │
│  ├─ Full job description                                       │
│  ├─ Company info                                               │
│  ├─ Salary range (if shown)                                    │
│  └─ [Apply Now] button                                         │
│                                                                 │
│  STEP 2: Quick Profile                                         │
│  ├─ Name, Email, Phone                                         │
│  ├─ LinkedIn (auto-fill option)                                │
│  └─ Resume upload or paste                                     │
│                                                                 │
│  STEP 3: Custom Questions (if any)                             │
│  ├─ Screening questions                                        │
│  ├─ Work authorization                                         │
│  └─ Availability                                               │
│                                                                 │
│  STEP 4: Cover Letter (optional)                               │
│  └─ Text area or file upload                                   │
│                                                                 │
│  STEP 5: Review & Submit                                       │
│  ├─ Preview all entered info                                   │
│  ├─ Edit before submitting                                     │
│  └─ [Submit Application]                                       │
│                                                                 │
│  STEP 6: Confirmation                                          │
│  ├─ Success message                                            │
│  ├─ Confirmation email                                         │
│  ├─ Application ID                                             │
│  └─ [Track Your Application] link                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Candidate Portal Features

| Feature | Description |
|---------|-------------|
| Application Tracking | See status of all applications |
| Status Updates | Real-time notifications |
| Document Management | Upload/update resume |
| Interview Scheduling | Self-schedule from available slots |
| Offer Review | View and respond to offers |
| Communication | Message with hiring team |
| Profile Reuse | Apply to multiple jobs easily |

---

# 6. Integration Options

## 6.1 Level 1: API-Only Integration

**For:** Engineering teams who want full control over UX

### How It Works
- Customer builds their own UI
- Uses HireFlow REST or GraphQL APIs
- Webhooks for real-time updates
- Full data ownership

### Integration Steps
```
1. Create HireFlow account
2. Generate API key
3. Configure webhooks
4. Build custom UI
5. Call HireFlow APIs
6. Handle webhook events
```

### Example: Post a Job
```javascript
const response = await fetch('https://api.hireflow.io/v1/jobs', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer hf_live_xxx',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Senior Frontend Engineer',
    description: '...',
    location: { city: 'San Francisco', remote: true },
    salary: { min: 150000, max: 200000, currency: 'USD', period: 'YEARLY' },
    requirements: ['React', 'TypeScript', '5+ years'],
    status: 'OPEN'
  })
});
```

### Example: Receive Application Webhook
```javascript
app.post('/webhooks/hireflow', (req, res) => {
  const signature = req.headers['x-hireflow-signature'];
  if (!verifySignature(req.body, signature)) {
    return res.status(401).send('Invalid signature');
  }
  
  const { event, data } = req.body;
  
  if (event === 'application.submitted') {
    // Notify hiring manager
    notifyTeam(data.application);
    
    // Update internal system
    syncToHRIS(data.candidate);
  }
  
  res.status(200).send('OK');
});
```

## 6.2 Level 2: Widget/Component Integration

**For:** Dev teams who want quick integration with some customization

### Available Widgets

| Widget | Description | Customization |
|--------|-------------|---------------|
| Job Board | List of open positions | Colors, layout, filters |
| Job Detail | Single job view | Template, actions |
| Application Form | Apply form | Fields, questions |
| Application Tracker | Candidate status view | Branding |
| Offer Viewer | Offer details | Template, actions |

### React Component Example

```jsx
import { HireFlowProvider, JobBoard, ApplicationForm } from '@hireflow/react';

function CareersPage() {
  return (
    <HireFlowProvider 
      apiKey="hf_pub_xxx"
      theme={{
        primaryColor: '#007bff',
        fontFamily: 'Inter, sans-serif',
        borderRadius: '8px'
      }}
    >
      <div className="careers-page">
        <h1>Join Our Team</h1>
        <JobBoard 
          filters={['location', 'department', 'type']}
          layout="grid"
          onJobClick={(job) => navigate(`/careers/${job.slug}`)}
        />
      </div>
    </HireFlowProvider>
  );
}

function JobPage({ jobId }) {
  return (
    <HireFlowProvider apiKey="hf_pub_xxx">
      <ApplicationForm 
        jobId={jobId}
        fields={['name', 'email', 'phone', 'resume', 'linkedin']}
        customQuestions={true}
        onSuccess={(application) => {
          track('application_submitted', { jobId });
          navigate('/careers/thank-you');
        }}
      />
    </HireFlowProvider>
  );
}
```

### Web Component Example (Framework-Agnostic)

```html
<!-- Include HireFlow script -->
<script src="https://cdn.hireflow.io/widgets.js"></script>

<!-- Job Board Widget -->
<hireflow-job-board
  api-key="hf_pub_xxx"
  layout="list"
  show-search="true"
  show-filters="location,department"
  primary-color="#007bff"
></hireflow-job-board>

<!-- Application Form Widget -->
<hireflow-apply-form
  api-key="hf_pub_xxx"
  job-id="123"
  success-redirect="/thank-you"
></hireflow-apply-form>

<style>
  /* Full CSS customization */
  hireflow-job-board {
    --hf-primary: #007bff;
    --hf-font-family: 'Inter', sans-serif;
    --hf-border-radius: 8px;
    --hf-card-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
</style>
```

## 6.3 Level 3: Hosted Portal

**For:** Non-technical companies who want zero-code solution

### How It Works
- Full careers portal hosted by HireFlow
- Custom subdomain: careers.yourcompany.com
- Or CNAME to your own domain
- No code required
- Admin dashboard for management

### Setup Process
```
1. Sign up for HireFlow
2. Upload logo and set brand colors
3. Connect custom domain (optional)
4. Create job postings in dashboard
5. Share careers page link
6. Manage applications in dashboard
```

### Customization Options

| Option | Description |
|--------|-------------|
| Logo | Upload company logo |
| Favicon | Custom browser icon |
| Colors | Primary, secondary, accent |
| Typography | Google Fonts selection |
| Header | Custom navigation links |
| Footer | Links, social media, legal |
| Layout | Grid or list, sidebar options |
| Content | About page, team page |
| Domain | Custom domain with SSL |

---

# 7. White-Label & Customization

## 7.1 Branding Configuration

### Brand Kit Upload

```json
{
  "branding": {
    "companyName": "Acme Corp",
    "logo": {
      "primary": "https://assets.acme.com/logo.svg",
      "white": "https://assets.acme.com/logo-white.svg",
      "favicon": "https://assets.acme.com/favicon.ico"
    },
    "colors": {
      "primary": "#007bff",
      "primaryHover": "#0056b3",
      "secondary": "#6c757d",
      "success": "#28a745",
      "warning": "#ffc107",
      "error": "#dc3545",
      "background": "#ffffff",
      "surface": "#f8f9fa",
      "text": "#212529",
      "textMuted": "#6c757d"
    },
    "typography": {
      "fontFamily": "'Inter', -apple-system, sans-serif",
      "headingFont": "'Poppins', sans-serif",
      "baseFontSize": "16px",
      "lineHeight": "1.5"
    },
    "borderRadius": "8px",
    "shadows": {
      "card": "0 2px 4px rgba(0,0,0,0.1)",
      "modal": "0 4px 20px rgba(0,0,0,0.15)"
    }
  }
}
```

### CSS Override System

```css
/* Customer can provide CSS overrides */
:root {
  /* Colors */
  --hf-color-primary: #007bff;
  --hf-color-primary-hover: #0056b3;
  --hf-color-secondary: #6c757d;
  --hf-color-success: #28a745;
  --hf-color-warning: #ffc107;
  --hf-color-error: #dc3545;
  --hf-color-background: #ffffff;
  --hf-color-surface: #f8f9fa;
  --hf-color-text: #212529;
  --hf-color-text-muted: #6c757d;
  --hf-color-border: #dee2e6;
  
  /* Typography */
  --hf-font-family: 'Inter', sans-serif;
  --hf-font-heading: 'Poppins', sans-serif;
  --hf-font-size-base: 16px;
  --hf-font-size-sm: 14px;
  --hf-font-size-lg: 18px;
  --hf-font-size-h1: 2.5rem;
  --hf-font-size-h2: 2rem;
  --hf-font-size-h3: 1.5rem;
  --hf-line-height: 1.5;
  
  /* Spacing */
  --hf-spacing-xs: 0.25rem;
  --hf-spacing-sm: 0.5rem;
  --hf-spacing-md: 1rem;
  --hf-spacing-lg: 1.5rem;
  --hf-spacing-xl: 2rem;
  
  /* Layout */
  --hf-border-radius: 8px;
  --hf-border-radius-sm: 4px;
  --hf-border-radius-lg: 12px;
  --hf-shadow-sm: 0 1px 2px rgba(0,0,0,0.05);
  --hf-shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --hf-shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}

/* Component-specific overrides */
.hf-job-card {
  /* Customer can style job cards */
}

.hf-apply-button {
  /* Customer can style apply button */
}

.hf-application-form {
  /* Customer can style application form */
}
```

## 7.2 Email Template Customization

### Available Templates

| Template | Trigger | Variables |
|----------|---------|-----------|
| Application Received | On submit | {candidate_name}, {job_title}, {company_name} |
| Application Updated | Status change | {candidate_name}, {status}, {job_title} |
| Interview Scheduled | Interview set | {candidate_name}, {datetime}, {location}, {interviewer} |
| Offer Sent | Offer created | {candidate_name}, {job_title}, {salary}, {offer_link} |
| Offer Accepted | Candidate accepts | {candidate_name}, {job_title}, {start_date} |
| Offer Rejected | Candidate declines | {candidate_name}, {job_title} |
| Rejection | Application rejected | {candidate_name}, {job_title}, {reason} |

### Email Builder

```html
<!-- Example: Offer Email Template -->
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Inline styles for email compatibility */
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header with logo -->
    <div class="header">
      <img src="{{company_logo}}" alt="{{company_name}}" />
    </div>
    
    <!-- Main content -->
    <div class="content">
      <h1>Congratulations, {{candidate_first_name}}!</h1>
      
      <p>We're thrilled to offer you the position of <strong>{{job_title}}</strong> at {{company_name}}.</p>
      
      <div class="offer-summary">
        <p><strong>Position:</strong> {{job_title}}</p>
        <p><strong>Salary:</strong> {{formatted_salary}}</p>
        <p><strong>Start Date:</strong> {{start_date}}</p>
        <p><strong>Offer Expires:</strong> {{expiration_date}}</p>
      </div>
      
      <a href="{{offer_link}}" class="button">View Your Offer</a>
      
      <p>If you have any questions, please don't hesitate to reach out.</p>
      
      <p>Best regards,<br>
      The {{company_name}} Team</p>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p>{{company_address}}</p>
      <p><a href="{{privacy_policy_url}}">Privacy Policy</a></p>
    </div>
  </div>
</body>
</html>
```

## 7.3 Custom Domain Configuration

### Subdomain Setup
```
Default: acme.hireflow.io
- Automatic SSL certificate
- Immediate availability
- HireFlow DNS management
```

### Custom Domain Setup
```
Customer domain: careers.acme.com

Steps:
1. Add CNAME record: careers.acme.com → acme.hireflow.io
2. Verify DNS propagation in HireFlow dashboard
3. Automatic SSL certificate provisioning (Let's Encrypt)
4. Custom domain active within 24 hours

Alternative (A Record):
1. Add A record: careers.acme.com → 123.45.67.89 (HireFlow IP)
2. Follow same verification process
```

---

# 8. HR Compliance & Best Practices

## 8.1 Data Privacy Compliance

### GDPR (European Union)

| Requirement | HireFlow Implementation |
|-------------|------------------------|
| Right to Access | Candidate portal shows all stored data |
| Right to Rectification | Candidates can update their info |
| Right to Erasure | Self-service or admin-initiated deletion |
| Data Portability | Export to JSON/CSV |
| Consent | Explicit opt-in checkboxes |
| Data Processing Agreement | Standard DPA available |
| Data Location | EU-hosted option |
| Breach Notification | 72-hour notification SLA |

### CCPA (California)

| Requirement | HireFlow Implementation |
|-------------|------------------------|
| Right to Know | Data inventory available |
| Right to Delete | Self-service deletion |
| Right to Opt-Out | Opt-out of data selling (N/A - we don't sell) |
| Non-Discrimination | Equal service regardless of privacy choices |

### PDPA (Singapore), LGPD (Brazil), etc.
- Configurable consent flows per region
- Data residency options
- Localized privacy policies

## 8.2 Equal Employment Opportunity (EEO)

### EEOC Compliance (US)

| Requirement | HireFlow Implementation |
|-------------|------------------------|
| Voluntary Self-ID | Optional EEO survey |
| Data Separation | EEO data stored separately from hiring data |
| Reporting | EEOC-1 report generation |
| Non-Discrimination | Bias detection in job descriptions |
| Accessibility | WCAG 2.1 AA compliant |

### Voluntary Self-Identification Survey

```
┌─────────────────────────────────────────────────────────────────┐
│           VOLUNTARY SELF-IDENTIFICATION                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Company Name] is an equal opportunity employer. We invite   │
│  you to voluntarily self-identify for statistical purposes.   │
│  This information will not be used in the hiring decision.    │
│                                                                 │
│  Gender:                                                        │
│  ○ Male  ○ Female  ○ Non-binary  ○ Prefer not to answer       │
│                                                                 │
│  Ethnicity:                                                     │
│  ○ White                                                        │
│  ○ Black or African American                                   │
│  ○ Hispanic or Latino                                          │
│  ○ Asian                                                        │
│  ○ Native American or Alaska Native                            │
│  ○ Native Hawaiian or Pacific Islander                         │
│  ○ Two or More Races                                           │
│  ○ Prefer not to answer                                        │
│                                                                 │
│  Veteran Status:                                                │
│  ○ I am a veteran  ○ I am not a veteran  ○ Prefer not to say  │
│                                                                 │
│  Disability Status:                                             │
│  ○ Yes, I have a disability                                    │
│  ○ No, I don't have a disability                               │
│  ○ Prefer not to answer                                        │
│                                                                 │
│  [Skip]  [Submit]                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 8.3 Accessibility (WCAG 2.1)

### Level AA Compliance

| Criterion | Implementation |
|-----------|---------------|
| Perceivable | Alt text, color contrast, resizable text |
| Operable | Keyboard navigation, focus indicators, skip links |
| Understandable | Clear labels, error messages, predictable behavior |
| Robust | Semantic HTML, ARIA labels, screen reader tested |

### Accessibility Features

- **Keyboard Navigation:** Tab through all interactive elements
- **Screen Reader:** Full ARIA support, announced form errors
- **Color Contrast:** Minimum 4.5:1 ratio
- **Focus Indicators:** Visible focus states
- **Text Scaling:** Up to 200% without loss
- **Reduced Motion:** Respects prefers-reduced-motion
- **Captions:** Video content captioned

## 8.4 Bias Detection & Reduction

### Job Description Analysis

```
┌─────────────────────────────────────────────────────────────────┐
│                 JOB DESCRIPTION ANALYZER                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Your job description has been analyzed for potential bias:    │
│                                                                 │
│  ⚠️  GENDERED LANGUAGE                                          │
│  "We're looking for a rockstar ninja developer"                │
│  → Suggestion: "We're looking for a skilled developer"         │
│                                                                 │
│  ⚠️  AGE BIAS                                                   │
│  "Digital native preferred"                                    │
│  → Suggestion: "Strong digital skills required"                │
│                                                                 │
│  ⚠️  EXCESSIVE REQUIREMENTS                                     │
│  "10+ years of React experience" (React is 10 years old)      │
│  → Suggestion: "Extensive React experience"                    │
│                                                                 │
│  ✅  INCLUSIVE LANGUAGE                                         │
│  Good use of "you/your" instead of "he/she"                   │
│                                                                 │
│  Score: 72/100 (Fair)                                          │
│                                                                 │
│  [Apply Suggestions]  [Ignore]  [Learn More]                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Blind Hiring Mode

Optional feature to reduce bias:
- Hide candidate names
- Hide photos
- Anonymize education institutions
- Focus on skills and experience
- Reveal identity only at interview stage

---

# 9. Analytics & Reporting

## 9.1 Dashboard Overview

### Key Metrics (Real-Time)

| Metric | Description | Target |
|--------|-------------|--------|
| Open Positions | Active job postings | — |
| Applications This Period | New applications received | ↑ |
| Applications in Pipeline | Currently under review | — |
| Offers Extended | Offers sent | ↑ |
| Offers Accepted | Offers accepted | ↑ |
| Offer Acceptance Rate | Accepted / Extended | > 80% |
| Time to Hire | Days from job post to acceptance | < 30 days |
| Cost per Hire | Total spend / hires | ↓ |

### Dashboard Visualization

```
┌─────────────────────────────────────────────────────────────────┐
│                    HIRING DASHBOARD                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Open Jobs    │  │ Applications │  │ Time to Hire │          │
│  │     12       │  │    156       │  │   24 days    │          │
│  │   ↑ 3        │  │   ↑ 23%      │  │   ↓ 5 days   │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                 │
│  PIPELINE FUNNEL                                                │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ █████████████████████████████████████ 156 Applied       │   │
│  │ ████████████████████ 89 Reviewed                        │   │
│  │ ██████████ 45 Shortlisted                               │   │
│  │ █████ 23 Interviewed                                    │   │
│  │ ██ 8 Offered                                             │   │
│  │ █ 5 Hired                                                │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  SOURCE ATTRIBUTION                                             │
│  ┌──────────────────────────────────────────┐                  │
│  │ LinkedIn      ████████████████  45%      │                  │
│  │ Company Site  ████████  25%              │                  │
│  │ Indeed        █████  15%                 │                  │
│  │ Referrals     ████  10%                  │                  │
│  │ Other         ██  5%                     │                  │
│  └──────────────────────────────────────────┘                  │
│                                                                 │
│  JOBS BY STATUS              TIME TO HIRE TREND                │
│  ┌────────────┐              ┌────────────────┐                │
│  │  OPEN  12  │              │ 30d ──────╮    │                │
│  │  FILLED 8  │              │ 25d ───╮  ╰──  │                │
│  │  CLOSED 3  │              │ 20d    ╰──     │                │
│  │  DRAFT  5  │              │ Jan Feb Mar Apr│                │
│  └────────────┘              └────────────────┘                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 9.2 Available Reports

### Standard Reports

| Report | Description | Format |
|--------|-------------|--------|
| Pipeline Summary | Current state of all applications | PDF, CSV |
| Time to Hire | Average days per stage | PDF, CSV |
| Source Effectiveness | Applications and hires by source | PDF, CSV |
| Offer Analysis | Offer sent/accepted/rejected rates | PDF, CSV |
| Recruiter Performance | Metrics per hiring manager | PDF, CSV |
| EEO Report | Diversity statistics (anonymized) | PDF (EEOC format) |
| Activity Log | All actions taken in system | CSV |
| Job Performance | Views, applications, conversion per job | PDF, CSV |

### Custom Report Builder

```sql
-- Example: Custom report query
SELECT 
  j.title as job_title,
  COUNT(a.id) as total_applications,
  AVG(EXTRACT(DAY FROM a.reviewed_at - a.created_at)) as avg_days_to_review,
  SUM(CASE WHEN a.status = 'ACCEPTED' THEN 1 ELSE 0 END) as hires,
  SUM(CASE WHEN a.status = 'REJECTED' THEN 1 ELSE 0 END) as rejections
FROM jobs j
LEFT JOIN applications a ON j.id = a.job_id
WHERE j.tenant_id = :tenant_id
  AND j.created_at >= :start_date
  AND j.created_at <= :end_date
GROUP BY j.id, j.title
ORDER BY total_applications DESC;
```

## 9.3 Advanced Analytics

### Predictive Insights

| Insight | Description |
|---------|-------------|
| Hiring Forecast | Predicted time to fill based on pipeline |
| Quality Score | Likelihood of application success |
| Bottleneck Detection | Stages where candidates get stuck |
| Drop-off Analysis | Where candidates abandon applications |
| Salary Benchmarking | Market comparison for positions |

### A/B Testing

Test variations of:
- Job titles
- Job descriptions
- Application questions
- Career page layouts
- Email templates

---

# 10. Security & Privacy

## 10.1 Security Architecture

### Infrastructure Security

| Layer | Protection |
|-------|-----------|
| Network | VPC, private subnets, WAF |
| Compute | Encrypted instances, no public IPs |
| Database | Encrypted at rest (AES-256), encrypted in transit (TLS 1.3) |
| Storage | S3 with SSE-S3 encryption |
| Secrets | AWS Secrets Manager / HashiCorp Vault |
| Access | IAM roles, least privilege |

### Application Security

| Control | Implementation |
|---------|----------------|
| Authentication | OAuth 2.0 / OIDC, MFA support |
| Authorization | RBAC with granular permissions |
| API Security | API keys, rate limiting, request signing |
| Input Validation | Server-side validation, parameterized queries |
| Output Encoding | XSS prevention, CSP headers |
| Session Management | Secure cookies, short expiry |
| Audit Logging | All actions logged with user/IP |

### Compliance Certifications

| Certification | Status | Notes |
|---------------|--------|-------|
| SOC 2 Type II | Planned Year 1 | Security, availability, confidentiality |
| ISO 27001 | Planned Year 2 | Information security management |
| GDPR | Compliant | Data protection regulation |
| HIPAA | On request | Healthcare customers |

## 10.2 Data Retention & Deletion

### Default Retention Policies

| Data Type | Retention | After Expiry |
|-----------|-----------|--------------|
| Active Applications | Indefinite | Tenant controls |
| Rejected Applications | 2 years | Auto-anonymize |
| Inactive Candidates | 3 years | Auto-delete |
| Analytics Data | 5 years | Aggregate only |
| Audit Logs | 7 years | Required for compliance |
| Deleted Jobs | 30 days | Hard delete |

### Data Deletion Process

```
Candidate Deletion Request:
1. Candidate submits deletion request
2. System verifies identity
3. 30-day grace period (can cancel)
4. All personal data deleted
5. Anonymized records kept for analytics
6. Confirmation sent to candidate
```

---

# 11. Pricing Strategy

## 11.1 Pricing Tiers

### Self-Serve Plans

| Plan | Monthly | Annual (20% off) | Target |
|------|---------|------------------|--------|
| **Starter** | $99/mo | $950/yr | 1-10 employees |
| **Growth** | $299/mo | $2,870/yr | 11-100 employees |
| **Business** | $599/mo | $5,750/yr | 101-500 employees |
| **Enterprise** | Custom | Custom | 500+ employees |

### Feature Comparison

| Feature | Starter | Growth | Business | Enterprise |
|---------|---------|--------|----------|------------|
| Active Jobs | 5 | 25 | Unlimited | Unlimited |
| Applications/month | 100 | 500 | 2,500 | Unlimited |
| Team Members | 3 | 10 | 50 | Unlimited |
| Custom Questions | 3 | 10 | Unlimited | Unlimited |
| Email Templates | Basic | Custom | Custom | Full white-label |
| Analytics | Basic | Advanced | Advanced | Custom + API |
| API Access | Read-only | Full | Full | Priority |
| Webhooks | ❌ | ✅ | ✅ | ✅ |
| Custom Domain | ❌ | ✅ | ✅ | ✅ |
| SSO/SAML | ❌ | ❌ | ✅ | ✅ |
| SLA | 99.5% | 99.9% | 99.9% | 99.99% |
| Support | Email | Email + Chat | Priority | Dedicated |
| Implementation | Self-serve | Guided | White-glove | Custom |

### Add-On Pricing

| Add-On | Price | Description |
|--------|-------|-------------|
| Job Board Distribution | $49/job | Post to Indeed, LinkedIn, etc. |
| Video Interviews | $99/mo | Integrated video screening |
| Background Checks | $15/check | Integrated screening |
| E-Signatures | $5/signature | DocuSign/HelloSign integration |
| SMS Notifications | $0.05/SMS | Candidate text updates |
| Extra API Calls | $0.001/call | Beyond included quota |
| Data Export | Free | Full data portability |
| Custom Development | $150/hr | Bespoke features |

## 11.2 Enterprise Pricing

### Custom Pricing Factors

| Factor | Impact |
|--------|--------|
| Number of employees | Base tier |
| Hiring volume | API limits, storage |
| Multi-region | Data residency requirements |
| Integrations | HRIS, calendar, etc. |
| Support level | Dedicated CSM, SLA |
| Compliance needs | SOC 2, HIPAA, etc. |
| Custom development | One-time + ongoing |

### Enterprise Features

- Dedicated infrastructure (optional)
- Custom integrations
- Dedicated customer success manager
- Quarterly business reviews
- Custom SLA (up to 99.99%)
- Training and onboarding
- Volume discounts
- Multi-year agreements

---

# 12. Go-To-Market Strategy

## 12.1 Launch Phases

### Phase 1: Beta (Months 1-3)
**Goal:** Validate product-market fit

| Activity | Timeline | Metric |
|----------|----------|--------|
| Recruit 10 beta customers | Month 1 | 10 signups |
| Launch beta with core features | Month 2 | 10 active tenants |
| Collect feedback and iterate | Month 2-3 | NPS > 30 |
| Fix critical issues | Ongoing | < 5 P0 bugs |
| Create case studies | Month 3 | 3 case studies |

### Phase 2: Launch (Months 4-6)
**Goal:** Public launch and initial traction

| Activity | Timeline | Metric |
|----------|----------|--------|
| Product Hunt launch | Month 4 | Top 5 of day |
| Content marketing launch | Month 4 | 10 blog posts |
| Self-serve signup flow | Month 4 | 50 trials |
| Sales outreach begins | Month 5 | 20 demos/month |
| Partner program launch | Month 6 | 5 agency partners |
| First paying customers | Month 4-6 | 50 customers |

### Phase 3: Growth (Months 7-12)
**Goal:** Scale customer acquisition

| Activity | Timeline | Metric |
|----------|----------|--------|
| Paid advertising (Google, LinkedIn) | Month 7+ | 100 qualified leads/mo |
| Integration marketplace | Month 8 | 20 integrations |
| Mobile SDKs | Month 9 | iOS + Android |
| Enterprise features | Month 10 | 10 enterprise deals |
| International expansion | Month 11 | UK, EU markets |
| Series A preparation | Month 12 | $2M ARR run rate |

## 12.2 Marketing Channels

### Primary Channels

| Channel | Strategy | Budget % |
|---------|----------|----------|
| Content Marketing | SEO, blog, guides, webinars | 30% |
| Paid Search | Google Ads, Bing | 25% |
| Social (LinkedIn) | Organic + paid | 20% |
| Product Hunt / HN | Launch campaigns | 5% |
| Partner/Affiliate | Agency partnerships | 10% |
| Events | HR Tech conferences | 10% |

### Content Strategy

| Content Type | Frequency | Topic Examples |
|--------------|-----------|----------------|
| Blog Posts | 2/week | Hiring best practices, product updates |
| Guides | 1/month | "Complete Guide to Remote Hiring" |
| Webinars | 1/month | Feature demos, industry experts |
| Case Studies | 1/quarter | Customer success stories |
| Templates | Ongoing | Job description templates |
| Videos | 2/month | Product tutorials, tips |

## 12.3 Sales Process

### Self-Serve (Starter/Growth)

```
Website → Free Trial (14 days) → Onboarding Email Sequence → Conversion
                                        ↓
                              Usage Triggers → Upgrade Prompts
```

### Sales-Assisted (Business/Enterprise)

```
Lead Capture → SDR Qualification → Demo Call → Proposal → Negotiation → Close
     ↓                ↓                 ↓           ↓            ↓
  Marketing      5-min call         30-min      Custom      Contract
  Qualified                         demo        pricing     signing
```

---

# 13. Implementation Roadmap

## 13.1 Phase 1: Foundation (Months 1-3)

### Month 1: Core Infrastructure

| Week | Deliverables |
|------|--------------|
| 1 | Multi-tenant database design, tenant service |
| 2 | Jobs service (CRUD, publish, close, fill) |
| 3 | Applications service (submit, status, pipeline) |
| 4 | Basic API authentication, documentation |

### Month 2: MVP Features

| Week | Deliverables |
|------|--------------|
| 5 | Offers service (create, send, respond) |
| 6 | Email notifications (templates, sending) |
| 7 | Admin dashboard (basic) |
| 8 | Candidate portal (basic) |

### Month 3: Integration & Polish

| Week | Deliverables |
|------|--------------|
| 9 | Widget library (React, Web Components) |
| 10 | Branding/customization system |
| 11 | Webhooks implementation |
| 12 | Beta testing, bug fixes |

## 13.2 Phase 2: Launch (Months 4-6)

### Month 4: Public Launch Prep

| Week | Deliverables |
|------|--------------|
| 13 | Self-serve signup flow |
| 14 | Billing integration (Stripe) |
| 15 | Documentation site |
| 16 | Public launch |

### Month 5: Advanced Features

| Week | Deliverables |
|------|--------------|
| 17 | Advanced analytics dashboard |
| 18 | Custom application forms |
| 19 | Interview scheduling |
| 20 | GraphQL API |

### Month 6: Scale Prep

| Week | Deliverables |
|------|--------------|
| 21 | Performance optimization |
| 22 | Rate limiting, quotas |
| 23 | Partner API program |
| 24 | Enterprise features (SSO) |

## 13.3 Phase 3: Scale (Months 7-12)

### Months 7-9: Enterprise Features

- E-signature integration
- Advanced permissions/roles
- Compliance reporting
- Custom integrations API

### Months 10-12: Expansion

- Mobile SDKs (iOS, Android)
- AI features (resume parsing, scoring)
- International data residency
- Additional languages (i18n)

## 13.4 Existing Codebase Assessment

### Current State
Based on the existing Designer Marketplace codebase:

**Strengths:**
- ✅ Spring Boot 3.x / Java 21 foundation
- ✅ PostgreSQL with Flyway migrations
- ✅ Job posting CRUD operations
- ✅ Application submission and tracking
- ✅ Offer workflow (salary, terms, accept/reject)
- ✅ Email notifications system
- ✅ React/Next.js frontend
- ✅ TypeScript with React Query

**Gaps for Multi-Tenant SaaS:**
- ❌ Multi-tenancy (tenant isolation)
- ❌ API key authentication
- ❌ Usage metering and billing
- ❌ White-label branding system
- ❌ Widget library (embeddable)
- ❌ Webhook delivery system
- ❌ Rate limiting
- ❌ GraphQL API
- ❌ SSO/SAML support

### Migration Strategy

```
Phase 1: Multi-tenancy Layer
├─ Add tenant_id to all tables
├─ Implement tenant-aware repositories
├─ API key authentication
└─ Tenant provisioning API

Phase 2: API Hardening
├─ Rate limiting middleware
├─ Request validation
├─ Error standardization
└─ API versioning

Phase 3: Widget Library
├─ Extract UI components
├─ Build React SDK package
├─ Build Web Components version
└─ Create embed documentation

Phase 4: Branding & White-label
├─ Theme configuration storage
├─ CSS variable injection
├─ Logo/favicon management
└─ Email template customization

Phase 5: Billing & Metering
├─ Stripe integration
├─ Usage tracking
├─ Quota enforcement
└─ Invoicing
```

---

# 14. Risk Assessment

## 14.1 Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Multi-tenant data leak | Low | Critical | Row-level security, thorough testing |
| API availability issues | Medium | High | CDN, multi-region, circuit breakers |
| Integration failures | Medium | Medium | Retry logic, monitoring, fallbacks |
| Security breach | Low | Critical | Pen testing, bug bounty, encryption |
| Performance degradation | Medium | Medium | Load testing, auto-scaling |

## 14.2 Business Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Low market adoption | Medium | Critical | Strong positioning, content marketing |
| Price-sensitive market | High | Medium | Value demonstration, flexible pricing |
| Enterprise sales cycle | High | Medium | Self-serve focus, land-and-expand |
| Competition response | High | Medium | Feature differentiation, customer success |
| Key person dependency | Medium | High | Documentation, cross-training |

## 14.3 Compliance Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| GDPR violation | Low | Critical | Privacy by design, DPO |
| EEO lawsuit | Low | High | Compliance features, legal review |
| Data breach notification | Low | High | Incident response plan |
| SOC 2 audit failure | Medium | Medium | Early compliance investment |

---

# 15. Success Metrics

## 15.1 North Star Metric

**Applications Processed per Month**
- Target: 10,000 by Month 6
- Target: 50,000 by Month 12
- Target: 200,000 by Month 24

## 15.2 Key Performance Indicators

### Product Metrics

| Metric | Month 6 | Month 12 | Method |
|--------|---------|----------|--------|
| Active Tenants | 100 | 500 | Count |
| Jobs Posted | 500 | 2,500 | Sum |
| Applications | 5,000 | 25,000 | Sum |
| Offers Sent | 250 | 1,500 | Sum |
| Offers Accepted | 200 | 1,200 | Sum |
| API Calls/Day | 50K | 500K | Sum |

### Business Metrics

| Metric | Month 6 | Month 12 | Method |
|--------|---------|----------|--------|
| MRR | $15K | $80K | Revenue |
| ARR | $180K | $960K | Revenue |
| Customers | 100 | 400 | Count |
| ARPU | $150 | $200 | Avg |
| Churn Rate | < 5% | < 3% | % |
| LTV:CAC | > 3:1 | > 4:1 | Ratio |

### Customer Success Metrics

| Metric | Target | Method |
|--------|--------|--------|
| NPS | > 50 | Survey |
| CSAT | > 4.5/5 | Feedback |
| Time to Value | < 7 days | Tracking |
| Support Response | < 4 hours | Helpdesk |
| Feature Adoption | > 70% | Usage |

## 15.3 Tracking & Reporting

### Weekly Dashboard

- New signups
- Trial conversions
- MRR change
- Churn events
- Support tickets
- API uptime

### Monthly Review

- Customer cohort analysis
- Feature usage reports
- Competitive landscape
- Roadmap progress
- Financial statements

### Quarterly Business Review

- Strategic goals progress
- Customer advisory board feedback
- Market position analysis
- Next quarter planning

---

# 16. Appendices

## Appendix A: Glossary

| Term | Definition |
|------|------------|
| ATS | Applicant Tracking System |
| HRIS | Human Resource Information System |
| Tenant | A customer organization using the platform |
| Widget | Embeddable UI component |
| Webhook | HTTP callback for real-time notifications |
| White-label | Branding customization to hide vendor identity |
| Time to Hire | Days from job posting to offer acceptance |
| Cost per Hire | Total recruiting spend divided by hires |
| Offer Acceptance Rate | Accepted offers / total offers |
| Pipeline | Stages candidates move through |

## Appendix B: Integration Partners

### Planned Integrations

| Category | Partners |
|----------|----------|
| Job Boards | Indeed, LinkedIn, Glassdoor, ZipRecruiter |
| HRIS | Workday, BambooHR, Gusto, Rippling |
| Calendar | Google Calendar, Outlook, Calendly |
| Video | Zoom, Microsoft Teams, Google Meet |
| E-Signature | DocuSign, HelloSign, Adobe Sign |
| Background Check | Checkr, Sterling, GoodHire |
| Assessment | Codility, HackerRank, TestGorilla |
| Communication | Slack, Microsoft Teams |
| CRM | Salesforce, HubSpot |
| SSO | Okta, Auth0, Azure AD |

## Appendix C: Sample API Documentation

See separate API documentation at: `docs/api/README.md`

## Appendix D: Competitive Feature Matrix

See separate competitive analysis at: `docs/competitive-analysis.md`

## Appendix E: Customer Interview Template

```markdown
# HireFlow Customer Interview Guide

## Company Background
1. Company name, size, industry?
2. Current hiring volume (positions/year)?
3. Current tools used for hiring?

## Pain Points
4. Biggest challenges with current hiring process?
5. What do you wish your current tools could do?
6. How do you track applications today?

## Evaluation Criteria
7. What's most important in an ATS?
8. Who would use the system? (roles)
9. Integration requirements?

## Product Feedback
10. [Demo product] Initial impressions?
11. What's missing?
12. Would you pay for this? How much?

## Closing
13. Would you be interested in a beta program?
14. Can we follow up in 2 weeks?
```

---

# Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-04-25 | HireFlow Team | Initial version |

---

**End of Document**

*HireFlow™ - Enterprise hiring, startup simple.*
