# OpenAPI 3.0 Specification - Marketplace API

**Version**: 1.0.0  
**Last Updated**: 2026-01-18  
**Base URL**: `/api`

---

## Table of Contents
1. [Authentication](#authentication)
2. [Core Resources](#core-resources)
3. [Endpoint Summary](#endpoint-summary)
4. [Detailed Endpoint Reference](#detailed-endpoint-reference)

---

## Authentication

All endpoints (except auth endpoints) require a Bearer token in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

---

## Core Resources

### Users
- **Plural noun**: ✅ `/api/users`
- **Kebab-case**: N/A (single word)
- **Pattern**: Collection + ID

### Companies
- **Plural noun**: ✅ `/api/companies`
- **Nested**: Jobs posted by company `/api/companies/{companyId}/jobs`

### Jobs
- **Plural noun**: ✅ `/api/jobs`
- **Kebab-case**: N/A (single word)
- **Nested**: By company `/api/companies/{companyId}/jobs`

### Job Applications
- **Plural noun**: ✅ `/api/job-applications`
- **Kebab-case**: ✅ `job-applications`

### Projects
- **Plural noun**: ✅ `/api/projects`
- **Kebab-case**: N/A (single word)

### Proposals
- **Plural noun**: ✅ `/api/proposals`
- **Nested**: By project `/api/projects/{projectId}/proposals`

### Contracts
- **Plural noun**: ✅ `/api/contracts`
- **Nested**: By user `/api/users/{userId}/contracts`

### Time Entries
- **Plural noun**: ✅ `/api/time-entries`
- **Kebab-case**: ✅ `time-entries`
- **Nested**: 
  - By contract: `/api/contracts/{contractId}/time-entries`
  - By freelancer: `/api/users/{freelancerId}/time-entries`

### Portfolio Items
- **Plural noun**: ✅ `/api/portfolio-items`
- **Kebab-case**: ✅ `portfolio-items`
- **Nested**: By user `/api/users/{userId}/portfolio-items`

### Reviews
- **Plural noun**: ✅ `/api/reviews`
- **Nested**:
  - Received: `/api/users/{userId}/reviews`
  - Given: `/api/users/{reviewerId}/reviews-given`

### Milestones
- **Plural noun**: ✅ `/api/milestones`
- **Nested**: By job `/api/jobs/{jobId}/milestones`

### Payments
- **Plural noun**: ✅ `/api/payments`

### Payouts
- **Plural noun**: ✅ `/api/payouts`
- **Nested**: By user `/api/users/{freelancerId}/payouts`

### Dashboards
- **Plural noun**: ✅ `/api/dashboards`
- **Routes**: 
  - Company: `/api/dashboards/company`
  - Freelancer: `/api/dashboards/freelancer`

### Categories
- **Job Categories**: `/api/job-categories`
- **Project Categories**: `/api/project-categories`
- **Experience Levels**: `/api/experience-levels`

### Invoices
- **Plural noun**: ✅ `/api/invoices`

### Notifications
- **Plural noun**: ✅ `/api/notifications`

### Webhooks
- **Plural noun**: ✅ `/api/webhooks`
- **Stripe**: `/api/webhooks/stripe`

---

## Endpoint Summary

### Authentication Endpoints
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
GET    /api/auth/test
GET    /api/auth/debug/authorities
```

### User Management
```
GET    /api/users/me
GET    /api/users/{id}
PUT    /api/users/{id}
GET    /api/users
GET    /api/users/{id}/profile
GET    /api/users/freelancers
GET    /api/companies/{id}
GET    /api/companies
```

### Jobs & Job Applications
```
GET    /api/jobs
GET    /api/jobs/{id}
GET    /api/jobs/search
GET    /api/jobs/featured
GET    /api/jobs/categories
GET    /api/jobs/categories/{slug}
GET    /api/companies/{companyId}/jobs
POST   /api/jobs
PUT    /api/jobs/{id}
DELETE /api/jobs/{id}
POST   /api/jobs/{id}/publish
POST   /api/jobs/{id}/close

GET    /api/job-applications
GET    /api/job-applications/my-applications
GET    /api/job-applications/{id}
POST   /api/job-applications
PUT    /api/job-applications/{id}/status
DELETE /api/job-applications/{id}
```

### Projects & Proposals
```
GET    /api/projects
GET    /api/projects/{id}
GET    /api/projects/search
GET    /api/projects/my-projects
POST   /api/projects
PUT    /api/projects/{id}
DELETE /api/projects/{id}

GET    /api/proposals
GET    /api/proposals/{id}
GET    /api/proposals/my-proposals
GET    /api/projects/{projectId}/proposals
POST   /api/proposals
PUT    /api/proposals/{id}/status
PUT    /api/proposals/{id}/accept
PUT    /api/proposals/{id}/reject
```

### Contracts & Time Entries
```
GET    /api/contracts
GET    /api/contracts/{id}
GET    /api/users/{userId}/contracts
POST   /api/contracts
PUT    /api/contracts/{id}
DELETE /api/contracts/{id}

GET    /api/time-entries
GET    /api/time-entries/{id}
GET    /api/contracts/{contractId}/time-entries
GET    /api/users/{freelancerId}/time-entries
GET    /api/contracts/{contractId}/time-entries/total-hours
POST   /api/time-entries
PUT    /api/time-entries/{id}
DELETE /api/time-entries/{id}
```

### Portfolio & Reviews
```
GET    /api/users/{userId}/portfolio-items
GET    /api/portfolio-items/{itemId}
POST   /api/portfolio-items
PUT    /api/portfolio-items/{itemId}
DELETE /api/portfolio-items/{itemId}
PATCH  /api/portfolio-items/reorder

GET    /api/reviews
GET    /api/reviews/{id}
GET    /api/users/{userId}/reviews
GET    /api/users/{reviewerId}/reviews-given
POST   /api/reviews
PUT    /api/reviews/{id}
DELETE /api/reviews/{id}
```

### Milestones & Payments
```
POST   /api/milestones
POST   /api/milestones/{milestoneId}/fund
POST   /api/milestones/{milestoneId}/start
POST   /api/milestones/{milestoneId}/submit
POST   /api/milestones/{milestoneId}/approve
POST   /api/milestones/{milestoneId}/request-revision
GET    /api/jobs/{jobId}/milestones
GET    /api/jobs/{jobId}/milestones/summary
GET    /api/milestones/company
GET    /api/milestones/freelancer

POST   /api/payments
GET    /api/payments/{id}
GET    /api/payments
POST   /api/payments/{id}/release
POST   /api/payments/{id}/refund
GET    /api/payments/statistics

GET    /api/invoices
GET    /api/invoices/{invoiceId}
GET    /api/invoices/number/{invoiceNumber}
POST   /api/invoices/generate/payment/{paymentId}
POST   /api/invoices/generate/milestone/{milestoneId}
```

### Payouts & Dashboards
```
POST   /api/payouts
POST   /api/payouts/{payoutId}/initiate
POST   /api/payouts/{payoutId}/complete
POST   /api/payouts/{payoutId}/fail
GET    /api/payouts/{payoutId}
GET    /api/payouts/my
GET    /api/payouts/summary
GET    /api/payouts/available-balance
GET    /api/payouts/pending
GET    /api/users/{freelancerId}/payouts
GET    /api/users/{freelancerId}/payouts/summary

GET    /api/dashboards/company
GET    /api/dashboards/freelancer
GET    /api/notifications
```

### Reference Data
```
GET    /api/job-categories
GET    /api/job-categories/{id}
GET    /api/job-categories/code/{code}

GET    /api/project-categories
GET    /api/project-categories/{slug}

GET    /api/experience-levels
GET    /api/experience-levels/{id}
GET    /api/experience-levels/code/{code}
```

### Webhooks
```
POST   /api/webhooks/stripe
```

---

## Detailed Endpoint Reference

### User Management

#### GET /api/users/me
Get current authenticated user profile
```
Headers:
  Authorization: Bearer <token>
  
Response:
  {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "fullName": "John Doe",
    "role": "FREELANCER",
    "profileImageUrl": "https://...",
    "bio": "...",
    "location": "San Francisco",
    "phone": "+1234567890",
    "hourlyRate": 85.00,
    "skills": ["React", "Node.js", "PostgreSQL"],
    "ratingAvg": 4.8,
    "ratingCount": 24
  }
```

#### GET /api/users/{id}
Get user profile by ID
```
Parameters:
  id (path): User ID (required)
  
Response: User object (same structure as /me)
```

#### PUT /api/users/{id}
Update user profile
```
Parameters:
  id (path): User ID (required)
  
Body:
  {
    "fullName": "...",
    "bio": "...",
    "location": "...",
    "phone": "...",
    "hourlyRate": 85.00,
    "skills": ["..."],
    ...
  }
```

#### GET /api/companies/{id}
Get company profile
```
Parameters:
  id (path): Company ID (required)
  
Response: Company object
```

---

### Jobs

#### GET /api/jobs
List all open jobs with pagination
```
Query Parameters:
  page (int): Page number (default: 0)
  size (int): Page size (default: 20)
  category (long): Filter by category ID
  experienceLevel (long): Filter by experience level ID
  minBudget (double): Minimum budget filter
  maxBudget (double): Maximum budget filter
  search (string): Search term
  sortBy (string): Sort field (default: "createdAt")
  sortDirection (string): ASC or DESC (default: "DESC")

Response:
  {
    "content": [
      {
        "id": 1,
        "title": "Build React Dashboard",
        "description": "...",
        "companyId": 5,
        "categoryId": 3,
        "status": "OPEN",
        "budget": 5000.00,
        "budgetType": "FIXED",
        "experienceLevelId": 2,
        "createdAt": "2026-01-18T10:00:00Z",
        ...
      }
    ],
    "totalElements": 150,
    "totalPages": 8,
    "currentPage": 0,
    "pageSize": 20
  }
```

#### POST /api/jobs
Create new job (COMPANY role required)
```
Headers:
  Authorization: Bearer <token>
  
Body:
  {
    "title": "Build React Dashboard",
    "description": "Create a responsive dashboard...",
    "categoryId": 3,
    "budgetType": "FIXED",
    "budget": 5000.00,
    "currencyCode": "USD",
    "experienceLevelId": 2,
    "requiredSkills": ["React", "Node.js"],
    "duration": "2-3 months"
  }

Response: Job object with id
```

#### GET /api/jobs/{id}
Get job details
```
Parameters:
  id (path): Job ID (required)
  
Response: Full Job object
```

#### PUT /api/jobs/{id}
Update job (COMPANY owner only)
```
Parameters:
  id (path): Job ID (required)
  
Body: Job update object

Response: Updated Job object
```

#### DELETE /api/jobs/{id}
Delete job (COMPANY owner only)
```
Parameters:
  id (path): Job ID (required)
  
Response: 204 No Content
```

#### GET /api/companies/{companyId}/jobs
Get all jobs posted by a company
```
Parameters:
  companyId (path): Company ID (required)
  
Query Parameters:
  page (int): Page number
  size (int): Page size
  
Response: Paginated list of Job objects
```

---

### Portfolio Items

#### GET /api/users/{userId}/portfolio-items
Get portfolio items for a user
```
Parameters:
  userId (path): User ID (required)
  
Response:
  [
    {
      "id": 1,
      "userId": 10,
      "title": "E-Commerce Platform",
      "description": "Full-stack e-commerce solution...",
      "projectUrl": "https://project.example.com",
      "githubUrl": "https://github.com/user/repo",
      "images": [
        {
          "url": "https://...",
          "caption": "Dashboard",
          "order": 1
        }
      ],
      "skillsDemonstrated": ["React", "Node.js", "PostgreSQL"],
      "toolsUsed": ["VS Code", "Docker"],
      "createdAt": "2026-01-18T10:00:00Z",
      "updatedAt": "2026-01-18T10:00:00Z"
    }
  ]
```

#### POST /api/portfolio-items
Create new portfolio item
```
Headers:
  Authorization: Bearer <token>
  
Query Parameters:
  userId (long): User ID (required)
  
Body:
  {
    "title": "E-Commerce Platform",
    "description": "...",
    "projectUrl": "https://...",
    "githubUrl": "https://...",
    "images": [...],
    "skillsDemonstrated": ["React", "Node.js"],
    "toolsUsed": ["Docker"]
  }

Response: Created PortfolioItem object
```

#### PUT /api/portfolio-items/{itemId}
Update portfolio item
```
Parameters:
  itemId (path): Portfolio item ID (required)
  
Query Parameters:
  userId (long): User ID (required)
  
Body: Portfolio item update

Response: Updated PortfolioItem object
```

#### DELETE /api/portfolio-items/{itemId}
Delete portfolio item
```
Parameters:
  itemId (path): Portfolio item ID (required)
  
Query Parameters:
  userId (long): User ID (required)
  
Response: 204 No Content
```

#### PATCH /api/portfolio-items/reorder
Reorder portfolio items
```
Headers:
  Authorization: Bearer <token>
  
Body:
  {
    "userId": 10,
    "orderedIds": [5, 2, 8, 1]
  }

Response: 200 OK
```

---

### Time Entries

#### GET /api/time-entries
Get all time entries
```
Response: [TimeEntry, ...]
```

#### GET /api/users/{freelancerId}/time-entries
Get time entries for a freelancer
```
Parameters:
  freelancerId (path): Freelancer/User ID (required)
  
Response: [TimeEntry, ...]
```

#### GET /api/contracts/{contractId}/time-entries
Get time entries for a contract
```
Parameters:
  contractId (path): Contract ID (required)
  
Response: [TimeEntry, ...]
```

#### GET /api/contracts/{contractId}/time-entries/total-hours
Get total hours worked on a contract
```
Parameters:
  contractId (path): Contract ID (required)
  
Response:
  {
    "totalHours": 45.5,
    "contractId": 3,
    "startDate": "2026-01-01",
    "endDate": "2026-01-18"
  }
```

#### POST /api/time-entries
Create new time entry
```
Headers:
  Authorization: Bearer <token>
  
Body:
  {
    "contractId": 3,
    "description": "UI component development",
    "startTime": "2026-01-18T09:00:00Z",
    "endTime": "2026-01-18T12:30:00Z",
    "billableHours": 3.5
  }

Response: Created TimeEntry object
```

---

### Reviews

#### GET /api/users/{userId}/reviews
Get reviews received by a user
```
Parameters:
  userId (path): User ID (required)
  
Response: [Review, ...]
```

#### GET /api/users/{reviewerId}/reviews-given
Get reviews written by a user
```
Parameters:
  reviewerId (path): Reviewer user ID (required)
  
Response: [Review, ...]
```

#### POST /api/reviews
Create new review
```
Headers:
  Authorization: Bearer <token>
  
Body:
  {
    "revieweeId": 5,
    "rating": 5,
    "title": "Excellent work!",
    "comment": "Great developer, very responsive...",
    "reviewType": "FREELANCER"
  }

Response: Created Review object
```

---

### Contracts

#### GET /api/users/{userId}/contracts
Get contracts for a user (either as company or freelancer)
```
Parameters:
  userId (path): User ID (required)
  
Response: [Contract, ...]
```

#### GET /api/contracts/{id}
Get contract details
```
Parameters:
  id (path): Contract ID (required)
  
Response: Contract object
```

#### POST /api/contracts
Create new contract
```
Headers:
  Authorization: Bearer <token>
  
Body:
  {
    "jobId": 5,
    "freelancerId": 10,
    "startDate": "2026-02-01",
    "endDate": "2026-03-01",
    "hourlyRate": 85.00,
    "totalBudget": 5000.00,
    "terms": "..."
  }

Response: Created Contract object
```

---

### Milestones

#### GET /api/jobs/{jobId}/milestones
Get milestones for a job
```
Parameters:
  jobId (path): Job ID (required)
  
Response: [Milestone, ...]
```

#### GET /api/jobs/{jobId}/milestones/summary
Get milestone summary for a job
```
Parameters:
  jobId (path): Job ID (required)
  
Response:
  {
    "jobId": 5,
    "totalMilestones": 4,
    "completedMilestones": 1,
    "totalAmount": 5000.00,
    "fundedAmount": 1250.00,
    "pendingAmount": 3750.00
  }
```

#### POST /api/milestones
Create milestones for a job
```
Headers:
  Authorization: Bearer <token>
  
Body:
  [
    {
      "jobId": 5,
      "title": "Design Phase",
      "description": "...",
      "amount": 1250.00,
      "dueDate": "2026-02-15",
      "deliverables": ["Wireframes", "Design mockups"]
    },
    ...
  ]

Response: [Milestone, ...]
```

#### POST /api/milestones/{milestoneId}/fund
Fund a milestone (escrow)
```
Parameters:
  milestoneId (path): Milestone ID (required)
  
Headers:
  Authorization: Bearer <token>
  
Response: Updated Milestone object
```

#### POST /api/milestones/{milestoneId}/submit
Freelancer submits completed milestone
```
Parameters:
  milestoneId (path): Milestone ID (required)
  
Headers:
  Authorization: Bearer <token>
  
Body:
  {
    "deliveryNotes": "All deliverables complete and tested...",
    "attachments": ["url1", "url2"]
  }

Response: Updated Milestone object
```

#### POST /api/milestones/{milestoneId}/approve
Company approves completed milestone
```
Parameters:
  milestoneId (path): Milestone ID (required)
  
Headers:
  Authorization: Bearer <token>
  
Body:
  {
    "approvalNotes": "Perfect work, exactly as requested"
  }

Response: Updated Milestone object
```

---

### Dashboards

#### GET /api/dashboards/company
Get company dashboard
```
Headers:
  Authorization: Bearer <token>
  Role: COMPANY
  
Response:
  {
    "stats": {
      "totalJobsPosted": 15,
      "openJobs": 3,
      "completedJobs": 12,
      "totalSpent": 45000.00,
      "activeContracts": 2
    },
    "openJobs": [
      {
        "id": 1,
        "title": "...",
        "applicationsCount": 5,
        "status": "OPEN"
      }
    ],
    "recentProposals": [...]
  }
```

#### GET /api/dashboards/freelancer
Get freelancer dashboard
```
Headers:
  Authorization: Bearer <token>
  Role: FREELANCER
  
Response:
  {
    "stats": {
      "proposalsSubmitted": 24,
      "proposalsAccepted": 8,
      "completedProjects": 6,
      "totalEarnings": 18500.00,
      "avgRating": 4.7,
      "ratingCount": 18
    },
    "myProposals": [...],
    "availableJobs": [...],
    "activeContracts": [...]
  }
```

#### GET /api/notifications
Get user notifications
```
Headers:
  Authorization: Bearer <token>
  
Response:
  [
    {
      "id": 1,
      "type": "NEW_JOB",
      "title": "New job matching your skills",
      "message": "...",
      "createdAt": "2026-01-18T15:30:00Z",
      "read": false,
      "link": "/jobs/123"
    }
  ]
```

---

## Response Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request succeeded |
| 201 | Created - Resource created successfully |
| 204 | No Content - Request succeeded, no content to return |
| 400 | Bad Request - Invalid parameters |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource does not exist |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation failed |
| 500 | Internal Server Error - Server error |

---

## Error Response Format

```json
{
  "timestamp": "2026-01-18T10:00:00Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Invalid request parameters",
  "path": "/api/jobs"
}
```

---

## Pagination

All list endpoints support pagination:

```
Query Parameters:
  page (int): 0-based page number (default: 0)
  size (int): Page size (default: 20, max: 100)

Response:
  {
    "content": [...],
    "totalElements": 150,
    "totalPages": 8,
    "currentPage": 0,
    "pageSize": 20,
    "hasNext": true,
    "hasPrevious": false
  }
```

---

## Rate Limiting

API requests are rate-limited to:
- **1000 requests per hour** for authenticated users
- **100 requests per hour** for unauthenticated requests

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 1642510800
```

---

## API Standardization Rules Applied

✅ **Plural Nouns**: All collection endpoints use plural names (`/jobs`, `/users`, `/contracts`)

✅ **Kebab-Case**: Multi-word resources use kebab-case (`/job-applications`, `/portfolio-items`, `/time-entries`)

✅ **Nouns Only**: Endpoints are noun-based, actions expressed via HTTP methods

✅ **Hierarchical Nesting**: Related resources are nested (`/users/{id}/contracts`, `/jobs/{id}/milestones`)

✅ **Consistent ID Naming**: ID parameters use `{id}` or `{resourceId}` consistently

✅ **HTTP Methods**:
- GET: Retrieve resources
- POST: Create resources
- PUT: Update entire resources
- PATCH: Partial updates
- DELETE: Remove resources

---

## Migration Notes

See [API_STANDARDIZATION_MIGRATION_GUIDE.md](API_STANDARDIZATION_MIGRATION_GUIDE.md) for detailed migration information from old endpoint patterns.

---

**Last Updated**: January 18, 2026
**API Version**: 1.0.0
