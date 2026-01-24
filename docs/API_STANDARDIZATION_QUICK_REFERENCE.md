# REST API Standardization - Quick Reference

**Date:** January 18, 2026 | **Status:** ✅ Completed

---

## 🚀 Quick Start

All REST endpoints now follow industry best practices:
- ✅ Plural nouns for collections
- ✅ Kebab-case for multi-word resources
- ✅ Nouns (no verbs)
- ✅ Consistent nesting

---

## 📌 Before & After Examples

### Portfolio Endpoints
```javascript
// BEFORE
GET  /api/portfolio
GET  /api/users/{userId}/portfolio
POST /api/portfolio
PUT  /api/portfolio/{itemId}

// AFTER
GET  /api/users/{userId}/portfolio-items
POST /api/portfolio-items
PUT  /api/portfolio-items/{itemId}
```

### Time Entries
```javascript
// BEFORE
GET /api/timeEntries
GET /api/time-entries/freelancer/{freelancerId}
GET /api/time-entries/contract/{contractId}

// AFTER
GET /api/time-entries
GET /api/users/{freelancerId}/time-entries
GET /api/contracts/{contractId}/time-entries
```

### Milestones
```javascript
// BEFORE
GET /api/milestones/job/{jobId}
POST /api/milestones

// AFTER
GET /api/jobs/{jobId}/milestones
POST /api/milestones
```

### Reviews
```javascript
// BEFORE
GET /api/reviews/reviewer/{reviewerId}
GET /api/reviews/user/{userId}

// AFTER
GET /api/users/{reviewerId}/reviews-given
GET /api/users/{userId}/reviews
```

### Contracts
```javascript
// BEFORE
GET /api/contracts/user/{userId}
GET /api/contracts/company/{companyId}

// AFTER
GET /api/users/{userId}/contracts
GET /api/users/{companyId}/contracts
```

---

## 🔑 Key Changes by Feature

### ✅ Already Standardized
- `/api/users` - Users
- `/api/companies` - Companies
- `/api/jobs` - Jobs
- `/api/projects` - Projects
- `/api/proposals` - Proposals
- `/api/payments` - Payments
- `/api/invoices` - Invoices
- `/api/milestones` - Milestones
- `/api/reviews` - Reviews
- `/api/notifications` - Notifications
- `/api/messages` - Messages
- `/api/job-applications` - Job Applications
- `/api/job-categories` - Job Categories
- `/api/experience-levels` - Experience Levels
- `/api/project-categories` - Project Categories

### 🔄 Recently Updated

| Feature | Old Endpoint | New Endpoint |
|---------|---|---|
| Portfolio Items | `/api/portfolio` | `/api/portfolio-items` |
| User Portfolio | `/api/users/{userId}/portfolio` | `/api/users/{userId}/portfolio-items` |
| Create Portfolio | POST `/api/portfolio` | POST `/api/portfolio-items` |
| Update Portfolio | PUT `/api/portfolio/{itemId}` | PUT `/api/portfolio-items/{itemId}` |
| Time Entries | `/api/timeEntries` | `/api/time-entries` |
| Freelancer Time | `/api/time-entries/freelancer/{id}` | `/api/users/{id}/time-entries` |
| Contract Time | `/api/time-entries/contract/{id}` | `/api/contracts/{id}/time-entries` |
| Job Milestones | `/api/milestones/job/{id}` | `/api/jobs/{id}/milestones` |
| Milestone Summary | `/api/milestones/job/{id}/summary` | `/api/jobs/{id}/milestones/summary` |
| User Reviews Given | `/api/reviews/reviewer/{id}` | `/api/users/{id}/reviews-given` |
| User Reviews Received | `/api/reviews/user/{id}` | `/api/users/{id}/reviews` |
| User Contracts | `/api/contracts/user/{id}` | `/api/users/{id}/contracts` |

---

## 💻 Frontend Update Examples

### TypeScript/React
```typescript
// BEFORE
const portfolio = await apiClient.get(`/users/${userId}/portfolio`);

// AFTER
const portfolio = await apiClient.get(`/users/${userId}/portfolio-items`);
```

```typescript
// BEFORE
const timeEntries = await apiClient.get(`/time-entries/freelancer/${id}`);

// AFTER
const timeEntries = await apiClient.get(`/users/${id}/time-entries`);
```

```typescript
// BEFORE
const milestones = await apiClient.get(`/milestones/job/${jobId}`);

// AFTER
const milestones = await apiClient.get(`/jobs/${jobId}/milestones`);
```

---

## 🧪 Testing Your Changes

### cURL Examples
```bash
# Get portfolio items for user
curl -X GET "http://localhost:8080/api/users/1/portfolio-items"

# Get time entries for contract
curl -X GET "http://localhost:8080/api/contracts/1/time-entries"

# Get milestones for job
curl -X GET "http://localhost:8080/api/jobs/1/milestones"

# Get reviews written by user
curl -X GET "http://localhost:8080/api/users/1/reviews-given"

# Get reviews for user
curl -X GET "http://localhost:8080/api/users/1/reviews"

# Get user contracts
curl -X GET "http://localhost:8080/api/users/1/contracts"
```

### Postman
1. Import collection: `postman/Designer-API.postman_collection.json`
2. Update environment variables
3. Run updated collection
4. Verify all requests pass

---

## 📋 HTTP Methods by Endpoint

### Collections (Plural)
```
GET    /api/users              → List all
POST   /api/users              → Create new
```

### Single Resource
```
GET    /api/users/{id}         → Retrieve
PUT    /api/users/{id}         → Update full
PATCH  /api/users/{id}         → Update partial
DELETE /api/users/{id}         → Delete
```

### State Changes
```
POST   /api/resources/{id}/action          → Perform action
PUT    /api/resources/{id}/status          → Change status
POST   /api/resources/{id}/approve         → Approve
POST   /api/resources/{id}/reject          → Reject
```

### Nested Resources
```
GET    /api/parent/{id}/children           → List children
POST   /api/parent/{id}/children           → Create child
GET    /api/parent/{id}/children/{childId} → Get child
PUT    /api/parent/{id}/children/{childId} → Update child
DELETE /api/parent/{id}/children/{childId} → Delete child
```

---

## 🚨 Common Mistakes to Avoid

```javascript
// ❌ DON'T: Use singular
GET /api/user
GET /api/company
GET /api/job

// ✅ DO: Use plural
GET /api/users
GET /api/companies
GET /api/jobs

// ❌ DON'T: Use camelCase for multi-word
GET /api/jobApplications
GET /api/timeEntries
GET /api/portfolioItems

// ✅ DO: Use kebab-case
GET /api/job-applications
GET /api/time-entries
GET /api/portfolio-items

// ❌ DON'T: Use verbs
POST /api/createUser
GET  /api/getUser
DELETE /api/deleteUser

// ✅ DO: Use nouns with HTTP verbs
POST   /api/users
GET    /api/users/{id}
DELETE /api/users/{id}

// ❌ DON'T: Flatten nested paths
GET /api/contracts/user/{userId}
GET /api/time-entries/contract/{contractId}

// ✅ DO: Use proper nesting
GET /api/users/{userId}/contracts
GET /api/contracts/{contractId}/time-entries
```

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `ENDPOINT_STANDARDIZATION_MAPPING.md` | Complete OLD → NEW mapping reference |
| `API_STANDARDIZATION_MIGRATION_GUIDE.md` | Detailed implementation guide |
| `API_BEST_PRACTICES.md` | RESTful API design principles |
| This file | Quick reference for developers |

---

## ✅ Verification Checklist

- [ ] All backend controllers compile successfully
- [ ] All frontend API calls use new endpoints
- [ ] All tests pass with new endpoints
- [ ] Postman collection updated
- [ ] Documentation updated
- [ ] Team members notified
- [ ] Old endpoints removed (if applicable)

---

## 🔗 Useful Links

- REST API Best Practices: https://restfulapi.net/
- HTTP Methods: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
- API Design Guidelines: https://swagger.io/resources/articles/best-practices-in-api-design/

---

**Questions?** Check the full migration guide or contact the development team.

