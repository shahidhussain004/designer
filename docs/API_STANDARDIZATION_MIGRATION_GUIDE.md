# API Endpoint Standardization - Migration Guide

**Completed:** January 18, 2026
**Status:** All endpoints standardized across backend and frontend

---

## 📊 Executive Summary

Successfully standardized ALL REST API endpoints across the entire application to follow RESTful best practices:

✅ **Backend Changes:** All Spring Boot controllers updated  
✅ **Frontend Changes:** All API service calls updated  
✅ **Documentation:** Complete mapping provided  

---

## 🔄 Breaking Changes Summary

### From:
- `/api/portfolio` → To: `/api/portfolio-items` (kebab-case)
- `/api/timeEntries` → To: `/api/time-entries` (kebab-case)  
- `/api/time-entries/freelancer/{id}` → To: `/api/users/{id}/time-entries` (nested)
- `/api/time-entries/contract/{id}` → To: `/api/contracts/{id}/time-entries` (nested)
- `/api/milestones/job/{id}` → To: `/api/jobs/{id}/milestones` (nested)
- `/api/contracts/user/{id}` → To: `/api/users/{id}/contracts` (nested)
- `/api/reviews/reviewer/{id}` → To: `/api/users/{id}/reviews-given` (nested)
- `/api/reviews/user/{id}` → To: `/api/users/{id}/reviews` (nested)

---

## 📝 Implementation Details

### Backend Changes (Spring Boot)

**Modified Controllers:**
1. ✅ **CompanyController** - `/api/companies` (already correct)
2. ✅ **JobApplicationController** - `/api/job-applications` (already correct)
3. ✅ **TimeEntryController** - Updated to `/api/time-entries` with nested resources
4. ✅ **PortfolioController** - Updated to `/api/portfolio-items` with kebab-case
5. ✅ **ContractController** - Updated nested to `/api/users/{userId}/contracts`
6. ✅ **ReviewController** - Updated nested endpoints for reviews
7. ✅ **MilestoneController** - Updated to use `/milestones` base with nested `/jobs/{jobId}/milestones`
8. ⚠️ All other controllers already follow standard patterns

### Frontend Changes (React/TypeScript)

**Updated Files:**
1. ✅ `frontend/marketplace-web/lib/payments.ts`
   - `/milestones/job/{jobId}` → `/jobs/{jobId}/milestones`

2. ✅ `frontend/marketplace-web/hooks/useUsers.ts`
   - `/users/{userId}/portfolio` → `/users/{userId}/portfolio-items`
   - `/users/{userId}/portfolio` (POST) → `/portfolio-items` (POST)
   - `/time-entries/freelancer/{id}` → `/users/{id}/time-entries`
   - `/time-entries/contract/{id}` → `/contracts/{id}/time-entries`
   - `/reviews/reviewer/{id}` → `/users/{id}/reviews-given`
   - `/reviews/reviewee/{id}` → `/users/{id}/reviews`
   - `/contracts/company/{id}` → `/users/{id}/contracts`
   - `/contracts/freelancer/{id}` → `/users/{id}/contracts`
   - `/contracts/user/{id}` → `/users/{id}/contracts`

3. ⚠️ Other API files already use correct endpoints:
   - `lib/jobs.ts` - ✅ Correct
   - `lib/dashboard.ts` - ✅ Correct
   - `hooks/useJobs.ts` - ✅ Correct
   - `hooks/useProjects.ts` - ✅ Correct

---

## 🎯 Standardization Rules Applied

### Rule 1: Always Use Plural Nouns
```
❌ /api/company → ✅ /api/companies
❌ /api/user → ✅ /api/users
❌ /api/job → ✅ /api/jobs
```

### Rule 2: Use Kebab-Case for Multi-Word Resources
```
❌ /api/jobApplications → ✅ /api/job-applications
❌ /api/timeEntries → ✅ /api/time-entries
❌ /api/portfolioItems → ✅ /api/portfolio-items
❌ /api/messageThreads → ✅ /api/message-threads
❌ /api/supportTickets → ✅ /api/support-tickets
```

### Rule 3: Use Nouns, Never Verbs
```
❌ POST /api/createUser → ✅ POST /api/users
❌ GET /api/getUser/123 → ✅ GET /api/users/{id}
❌ POST /api/submitApplication → ✅ POST /api/job-applications
```

### Rule 4: Nested Resources Follow Hierarchy
```
❌ /api/time-entries/contract/{id} → ✅ /api/contracts/{id}/time-entries
❌ /api/reviews/reviewer/{id} → ✅ /api/users/{id}/reviews-given
❌ /api/milestones/job/{id} → ✅ /api/jobs/{id}/milestones
```

### Rule 5: Consistent ID Parameter Naming
```
✅ /api/users/{id} - Single resource
✅ /api/users/{userId}/contracts/{contractId} - Nested specific
✅ /api/jobs/{jobId}/milestones/{milestoneId} - Nested specific
```

---

## 📋 Complete Endpoint Reference

### Core Entities (Plural)
```
/api/users              → GET, POST (users)
/api/users/{id}         → GET, PUT, DELETE (single user)
/api/companies          → GET, POST (companies)
/api/companies/{id}     → GET (company profile)
/api/jobs               → GET, POST (jobs)
/api/jobs/{id}          → GET, PUT, DELETE (single job)
/api/projects           → GET, POST (projects)
/api/projects/{id}      → GET, PUT, DELETE (single project)
/api/contracts          → GET, POST (contracts)
/api/contracts/{id}     → GET, PUT, DELETE (single contract)
/api/payments           → GET, POST (payments)
/api/invoices           → GET, POST (invoices)
/api/reviews            → GET, POST (reviews)
/api/notifications      → GET, POST (notifications)
/api/messages           → GET, POST (messages)
```

### Multi-Word Resources (Kebab-Case)
```
/api/job-applications           → GET, POST
/api/job-applications/{id}      → GET, PUT, DELETE
/api/job-categories             → GET (read-only)
/api/experience-levels          → GET (read-only)
/api/project-categories         → GET (read-only)
/api/time-entries               → GET, POST
/api/time-entries/{id}          → GET, PUT, DELETE
/api/portfolio-items            → GET, POST
/api/portfolio-items/{id}       → GET, PUT, DELETE
/api/message-threads            → GET, POST
/api/support-tickets            → GET, POST (future)
/api/audit-logs                 → GET (read-only)
```

### Nested Resources (Hierarchical)
```
/api/users/{userId}/contracts                    → User's contracts
/api/users/{userId}/time-entries                 → User's time entries
/api/users/{userId}/reviews                      → Reviews for user
/api/users/{userId}/reviews-given                → Reviews written by user
/api/users/{userId}/portfolio-items              → User's portfolio
/api/contracts/{contractId}/time-entries         → Time entries for contract
/api/contracts/{contractId}/time-entries/total   → Total hours for contract
/api/jobs/{jobId}/applications                   → Applications for job
/api/jobs/{jobId}/milestones                     → Milestones for job
/api/jobs/{jobId}/milestones/summary             → Milestone summary for job
/api/projects/{projectId}/proposals              → Proposals for project
```

### State-Change Endpoints (Special)
```
POST   /api/payments/{id}/release                → Release escrow
POST   /api/payments/{id}/refund                 → Refund payment
POST   /api/milestones/{id}/fund                 → Fund milestone
POST   /api/milestones/{id}/start                → Start milestone
POST   /api/milestones/{id}/submit               → Submit milestone
POST   /api/milestones/{id}/approve              → Approve milestone
PUT    /api/job-applications/{id}/status         → Update application status
PUT    /api/proposals/{id}/status                → Update proposal status
```

---

## ⚠️ Client Migration Checklist

### For Backend Consumers
- [ ] Update Postman collections
- [ ] Update API test files
- [ ] Update documentation wikis
- [ ] Notify API consumers of changes
- [ ] Provide deprecation period (if needed)

### For Frontend Consumers
- [ ] Update all API service imports
- [ ] Update all API calls
- [ ] Test all endpoints
- [ ] Update routing if needed
- [ ] Clear browser cache
- [ ] Test in production-like environment

### For Documentation
- [ ] Update Swagger/OpenAPI specs
- [ ] Update API documentation
- [ ] Create migration guide (THIS DOCUMENT)
- [ ] Update developer handbook
- [ ] Record changelog entry

---

## 🧪 Testing Recommendations

### Unit Tests
```bash
# Verify all controller methods
npm test -- src/main/java/com/designer/marketplace/controller/

# Verify all API client methods
npm test -- frontend/marketplace-web/lib/
npm test -- frontend/marketplace-web/hooks/
```

### Integration Tests
```bash
# Test full request/response cycle
npm test -- __tests__/integration.test.ts
npm test -- __tests__/api.test.ts
```

### Postman/API Tests
- [ ] Test all GET endpoints with various filters
- [ ] Test all POST endpoints with valid payloads
- [ ] Test all PUT endpoints with updates
- [ ] Test all DELETE endpoints
- [ ] Test authentication/authorization
- [ ] Test pagination
- [ ] Test error responses

---

## 📞 Support & Questions

For questions about the standardization:
1. Check [ENDPOINT_STANDARDIZATION_MAPPING.md](./ENDPOINT_STANDARDIZATION_MAPPING.md) for full reference
2. Review this guide for implementation details
3. Check controller source code for latest endpoint definitions
4. Test endpoints in Postman collection

---

## 🔗 Related Documentation

- [ENDPOINT_STANDARDIZATION_MAPPING.md](./ENDPOINT_STANDARDIZATION_MAPPING.md) - Complete OLD → NEW mapping
- [API_BEST_PRACTICES.md](./API_BEST_PRACTICES.md) - RESTful API design principles
- [BACKEND_IMPLEMENTATION_GUIDE.md](./BACKEND_IMPLEMENTATION_GUIDE.md) - Backend details
- [FRONTEND_IMPLEMENTATION_GUIDE.md](./FRONTEND_IMPLEMENTATION_GUIDE.md) - Frontend details

---

