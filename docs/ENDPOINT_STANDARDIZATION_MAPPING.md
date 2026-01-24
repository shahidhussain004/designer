# REST API Endpoint Standardization - Complete Mapping

**Status:** Comprehensive endpoint migration guide
**Date:** January 18, 2026
**Priority:** Critical - Breaking changes - all clients must be updated

---

## 📋 Overview

This document provides a complete mapping of old → new REST API endpoints following industry best practices:
- ✅ Plural nouns for collections
- ✅ Kebab-case for multi-word resources
- ✅ No verbs in endpoints
- ✅ Consistent naming patterns

---

## 🔄 Complete Endpoint Mapping

### Core Entities (User Management)

| OLD Endpoint | NEW Endpoint | HTTP Method | Notes |
|---|---|---|---|
| `/api/users` | `/api/users` | GET | List all users - NO CHANGE |
| `/api/users/{id}` | `/api/users/{id}` | GET | Get user by ID - NO CHANGE |
| `/api/users/{id}` | `/api/users/{id}` | PUT | Update user - NO CHANGE |
| `/api/users/me` | `/api/users/me` | GET | Get current user - NO CHANGE |
| `/api/users/{id}/profile` | `/api/users/{id}/profile` | GET | Get user profile - NO CHANGE |
| `/api/company` | `/api/companies` | ✅ **CHANGE** | CompanyController |
| `/api/company/{id}` | `/api/companies/{id}` | ✅ **CHANGE** | CompanyController |

### Job Management

| OLD Endpoint | NEW Endpoint | HTTP Method | Notes |
|---|---|---|---|
| `/api/jobs` | `/api/jobs` | GET, POST | List/create jobs - NO CHANGE |
| `/api/jobs/{id}` | `/api/jobs/{id}` | GET, PUT, DELETE | Single job - NO CHANGE |
| `/api/jobs/search` | `/api/jobs/search` | GET | Search jobs - NO CHANGE |
| `/api/jobs/my-jobs` | `/api/jobs/my-projects` | ✅ **RENAME** | Company's jobs |
| `/api/job-categories` | `/api/job-categories` | GET | Categories - NO CHANGE |
| `/api/experience-levels` | `/api/experience-levels` | GET | Experience - NO CHANGE |

### Job Applications

| OLD Endpoint | NEW Endpoint | HTTP Method | Notes |
|---|---|---|---|
| `/api/jobApplications` | `/api/job-applications` | ✅ **KEBAB-CASE** | JobApplicationController |
| `/api/jobApplications/{id}` | `/api/job-applications/{id}` | ✅ **KEBAB-CASE** | JobApplicationController |
| `/api/jobApplications?jobId=X` | `/api/job-applications?jobId=X` | ✅ **KEBAB-CASE** | JobApplicationController |
| `/api/jobApplications/my-applications` | `/api/job-applications/my-applications` | ✅ **KEBAB-CASE** | JobApplicationController |
| `/api/jobApplications/{id}/status` | `/api/job-applications/{id}/status` | ✅ **KEBAB-CASE** | JobApplicationController |

### Project Management

| OLD Endpoint | NEW Endpoint | HTTP Method | Notes |
|---|---|---|---|
| `/api/projects` | `/api/projects` | GET, POST | Projects - NO CHANGE |
| `/api/projects/{id}` | `/api/projects/{id}` | GET, PUT, DELETE | Single project - NO CHANGE |
| `/api/projects/search` | `/api/projects/search` | GET | Search - NO CHANGE |
| `/api/projects/my-projects` | `/api/projects/my-projects` | GET | User's projects - NO CHANGE |
| `/api/project-categories` | `/api/project-categories` | GET | Categories - NO CHANGE |
| `/api/projects/{projectId}/proposals` | `/api/projects/{projectId}/proposals` | GET, POST | Proposals - NO CHANGE |

### Proposals

| OLD Endpoint | NEW Endpoint | HTTP Method | Notes |
|---|---|---|---|
| `/api/proposals` | `/api/proposals` | GET, POST | Proposals - NO CHANGE |
| `/api/proposals/{id}` | `/api/proposals/{id}` | GET | Get proposal - NO CHANGE |
| `/api/proposals/{id}/status` | `/api/proposals/{id}/status` | PUT | Update status - NO CHANGE |

### Contracts

| OLD Endpoint | NEW Endpoint | HTTP Method | Notes |
|---|---|---|---|
| `/api/contracts` | `/api/contracts` | GET, POST | Contracts - NO CHANGE |
| `/api/contracts/{id}` | `/api/contracts/{id}` | GET, PUT, DELETE | Single contract - NO CHANGE |
| `/api/contracts/user/{userId}` | `/api/users/{userId}/contracts` | ✅ **NESTED** | Nested resource |

### Time Entries

| OLD Endpoint | NEW Endpoint | HTTP Method | Notes |
|---|---|---|---|
| `/api/timeEntries` | `/api/time-entries` | ✅ **KEBAB-CASE** | TimeEntryController |
| `/api/timeEntries/{id}` | `/api/time-entries/{id}` | ✅ **KEBAB-CASE** | TimeEntryController |
| `/api/timeEntries/contract/{contractId}` | `/api/contracts/{contractId}/time-entries` | ✅ **NESTED** | TimeEntryController |
| `/api/timeEntries/freelancer/{freelancerId}` | `/api/users/{freelancerId}/time-entries` | ✅ **NESTED** | TimeEntryController |

### Portfolio

| OLD Endpoint | NEW Endpoint | HTTP Method | Notes |
|---|---|---|---|
| `/api/portfolio` | `/api/portfolio-items` | ✅ **KEBAB-CASE** | PortfolioController |
| `/api/portfolio/{itemId}` | `/api/portfolio-items/{itemId}` | ✅ **KEBAB-CASE** | PortfolioController |
| `/api/users/{userId}/portfolio` | `/api/users/{userId}/portfolio-items` | ✅ **KEBAB-CASE** | PortfolioController |
| `/api/portfolio/reorder` | `/api/portfolio-items/reorder` | ✅ **KEBAB-CASE** | PortfolioController |

### Payments & Invoices

| OLD Endpoint | NEW Endpoint | HTTP Method | Notes |
|---|---|---|---|
| `/api/payments` | `/api/payments` | GET, POST | Payments - NO CHANGE |
| `/api/payments/{id}` | `/api/payments/{id}` | GET | Get payment - NO CHANGE |
| `/api/payments/{id}/release` | `/api/payments/{id}/release` | POST | Release - NO CHANGE |
| `/api/payments/{id}/refund` | `/api/payments/{id}/refund` | POST | Refund - NO CHANGE |
| `/api/invoices` | `/api/invoices` | GET, POST | Invoices - NO CHANGE |
| `/api/invoices/{id}` | `/api/invoices/{id}` | GET | Get invoice - NO CHANGE |
| `/api/invoices/generate/payment/{paymentId}` | `/api/invoices/generate/payment/{paymentId}` | POST | Generate - NO CHANGE |
| `/api/invoices/my` | `/api/invoices/my` | GET | My invoices - NO CHANGE |

### Milestones

| OLD Endpoint | NEW Endpoint | HTTP Method | Notes |
|---|---|---|---|
| `/api/milestones` | `/api/milestones` | POST | Create - NO CHANGE |
| `/api/milestones/{id}` | `/api/milestones/{id}` | GET | Get - NO CHANGE |
| `/api/milestones/{id}/fund` | `/api/milestones/{id}/fund` | POST | Fund - NO CHANGE |
| `/api/milestones/{id}/submit` | `/api/milestones/{id}/submit` | POST | Submit - NO CHANGE |
| `/api/milestones/{id}/approve` | `/api/milestones/{id}/approve` | POST | Approve - NO CHANGE |
| `/api/milestones/job/{jobId}` | `/api/jobs/{jobId}/milestones` | ✅ **NESTED** | Nested resource |

### Reviews

| OLD Endpoint | NEW Endpoint | HTTP Method | Notes |
|---|---|---|---|
| `/api/reviews` | `/api/reviews` | GET, POST | Reviews - NO CHANGE |
| `/api/reviews/{id}` | `/api/reviews/{id}` | GET, PUT, DELETE | Single review - NO CHANGE |
| `/api/reviews/user/{userId}` | `/api/users/{userId}/reviews` | ✅ **NESTED** | Nested resource |
| `/api/reviews/reviewer/{reviewerId}` | `/api/users/{reviewerId}/reviews-given` | ✅ **NESTED** | Reviews written by user |

### Messages & Notifications

| OLD Endpoint | NEW Endpoint | HTTP Method | Notes |
|---|---|---|---|
| `/api/messages` | `/api/messages` | GET, POST | Messages - NO CHANGE |
| `/api/messages/{id}` | `/api/messages/{id}` | GET | Get message - NO CHANGE |
| `/api/messageThreads` | `/api/message-threads` | ✅ **KEBAB-CASE** | Message threads |
| `/api/notifications` | `/api/notifications` | GET, POST | Notifications - NO CHANGE |

---

## 📝 Implementation Summary

### Backend Changes Required

**Files to Modify:**
1. ✅ `CompanyController.java` - `/api/company` → `/api/companies`
2. ✅ `JobApplicationController.java` - `/api/jobApplications` → `/api/job-applications`
3. ✅ `TimeEntryController.java` - `/api/timeEntries` → `/api/time-entries` + nested resources
4. ✅ `PortfolioController.java` - `/api/portfolio` → `/api/portfolio-items`
5. ⚪ Other controllers are already standardized

### Frontend Changes Required

**API Service Files to Update:**
1. ✅ Frontend API calls using old endpoints
2. ✅ Service layer method names (optional, for consistency)
3. ✅ Test files
4. ✅ Route configurations

---

## 🔄 Request/Response Example

```java
// BEFORE (non-standard)
@RestController
@RequestMapping("/api/company")
public class CompanyController {
    @GetMapping("/{id}")
    public ResponseEntity<CompanyDTO> getCompany(@PathVariable Long id) { }
}

// AFTER (standardized)
@RestController
@RequestMapping("/api/companies")
public class CompanyController {
    @GetMapping("/{id}")
    public ResponseEntity<CompanyDTO> getCompany(@PathVariable Long id) { }
}
```

---

## 🎯 Deprecation Notice

**Breaking Changes:**
- All old endpoints will be removed
- Clients must update within release cycle
- Migration guide available for each endpoint

**Migration Timeline:**
- Phase 1: Deploy new endpoints alongside old ones (with deprecation warnings)
- Phase 2: Monitor client updates
- Phase 3: Remove old endpoints

---

## ✅ Verification Checklist

- [ ] All controller paths updated
- [ ] All frontend API services updated
- [ ] All test files updated
- [ ] Route configurations updated
- [ ] Swagger/OpenAPI documentation updated
- [ ] Backward compatibility tests (if needed)
- [ ] Integration tests passing
- [ ] Documentation updated

---

