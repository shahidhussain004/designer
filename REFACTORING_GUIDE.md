# Jobs to Projects Refactoring Guide

## Overview
This document tracks the refactoring of the existing "jobs" feature to "projects" (freelance/gig work) and the addition of a new "Jobs" feature (traditional employment).

## Status: IN PROGRESS

---

## ✅ Completed Tasks

### 1. Database Migrations
- ✅ Created `V15__refactor_jobs_to_projects.sql`
  - Renamed `job_categories` → `project_categories`
  - Renamed `jobs` → `projects`
  - Updated all foreign key references in related tables (proposals, contracts, milestones, payments)
  - Updated triggers and functions

- ✅ Created `V16__create_jobs_for_employment.sql`
  - Created new `job_categories` table for employment
  - Created new `jobs` table with comprehensive fields for traditional employment
  - Created `job_applications` table
  - Added seed data (10 categories, 5 sample jobs)
  - Created triggers for application count tracking

### 2. Backend Entities
- ✅ Created `Project.java` (formerly Job - for freelance work)
- ✅ Created `ProjectCategory.java` (formerly JobCategory)
- ✅ Created `EmploymentJob.java` (new - traditional employment)
- ✅ Created `EmploymentJobCategory.java` (new)
- ✅ Created `JobApplication.java` (new)
- ✅ Updated `Proposal.java` to reference `Project` instead of `Job`

### 3. Backend Repositories
- ✅ Created `ProjectRepository.java`
- ✅ Created `ProjectCategoryRepository.java`
- ✅ Created `EmploymentJobRepository.java`
- ✅ Created `EmploymentJobCategoryRepository.java`
- ✅ Created `JobApplicationRepository.java`
- ✅ Updated `ProposalRepository.java` to use projects

### 4. Backend Services
- ✅ Created `EmploymentJobService.java`

### 5. Backend Controllers
- ✅ Created `EmploymentJobController.java`

### 6. DTOs
- ✅ Created `EmploymentJobResponse.java`

### 7. Dependencies
- ✅ Added `hypersistence-utils-hibernate-63` for JSONB support

---

## 🔄 Remaining Backend Tasks

### Phase 1: Update Existing Services/Controllers for Projects
- [ ] Rename `JobService.java` → `ProjectService.java`
- [ ] Update all references from `Job` to `Project` in `ProjectService`
- [ ] Update all references from `JobCategory` to `ProjectCategory`
- [ ] Rename `JobController.java` → `ProjectController.java`
- [ ] Update all endpoints from `/api/jobs` to `/api/projects`
- [ ] Update `ProposalService.java` to use `Project` instead of `Job`
- [ ] Update `ProposalController.java` references

### Phase 2: Update Related Services
Files that need updates:
- [ ] `PaymentService.java` - Update job references
- [ ] `MilestoneService.java` - Update job references
- [ ] `DashboardService.java` - Update statistics queries
- [ ] `NotificationService.java` - Update messages

### Phase 3: Update DTOs
- [ ] Rename `JobResponse.java` → `ProjectResponse.java`
- [ ] Rename `CreateJobRequest.java` → `CreateProjectRequest.java`
- [ ] Rename `UpdateJobRequest.java` → `UpdateProjectRequest.java`
- [ ] Rename `JobCategoryResponse.java` → `ProjectCategoryResponse.java`
- [ ] Update `ProposalResponse.java` to use projectId
- [ ] Create `CreateJobApplicationRequest.java`
- [ ] Create `JobApplicationResponse.java`

### Phase 4: Update Kafka/Messaging
- [ ] Update event publishers (job created → project created)
- [ ] Update event consumers

### Phase 5: Additional Employment Jobs Features
- [ ] Create `JobApplicationService.java`
- [ ] Create `JobApplicationController.java`
- [ ] Add authorization checks (employers can only see their jobs/applications)
- [ ] Add application submission workflow
- [ ] Add application status management

---

## 🎨 Frontend Tasks

### Phase 1: Update API Types
File: `frontend/marketplace-web/lib/apiTypes.ts`
- [ ] Rename `Job` interface → `Project`
- [ ] Rename `JobCategory` → `ProjectCategory`
- [ ] Update all related types
- [ ] Create new `EmploymentJob` interface
- [ ] Create new `EmploymentJobCategory` interface
- [ ] Create `JobApplication` interface

### Phase 2: Update API Endpoints
File: `frontend/marketplace-web/lib/api.ts` (or similar)
- [ ] Update `/api/jobs` → `/api/projects`
- [ ] Update `/api/job-categories` → `/api/project-categories`
- [ ] Add new `/api/employment-jobs` endpoints
- [ ] Add new `/api/employment-jobs/categories` endpoints
- [ ] Add new `/api/job-applications` endpoints

### Phase 3: Rename Existing Pages/Components
- [ ] Rename `app/jobs/` → `app/projects/`
- [ ] Update `app/projects/page.tsx` (listing page)
- [ ] Update `app/projects/[id]/page.tsx` (detail page)
- [ ] Update `app/projects/create/page.tsx` (if exists)
- [ ] Update all imports and references

### Phase 4: Update Components
- [ ] Update job cards → project cards
- [ ] Update job filters → project filters
- [ ] Update proposal submission forms
- [ ] Update navigation links

### Phase 5: Create New Jobs Feature (Employment)
New directory: `app/jobs/`
- [ ] Create `app/jobs/page.tsx` (jobs listing page)
  - Display employment opportunities
  - Filters: category, job type, remote, location, experience level
  - Search functionality
  - Featured jobs section
  
- [ ] Create `app/jobs/[id]/page.tsx` (job detail page)
  - Display full job description
  - Display requirements and responsibilities
  - Display company information
  - Display salary range (if shown)
  - Display benefits and perks
  - "Apply" button/section
  - Application form or redirect

- [ ] Create `app/jobs/categories/[slug]/page.tsx` (category listing)
  - Jobs filtered by category
  
- [ ] Create components:
  - `components/employment/JobCard.tsx`
  - `components/employment/JobDetail.tsx`
  - `components/employment/JobFilters.tsx`
  - `components/employment/JobApplication.tsx`
  - `components/employment/ApplicationForm.tsx`

### Phase 6: Update Navigation
File: `frontend/marketplace-web/components/Navbar.tsx` (or similar)
- [ ] Update "Find Work" link to point to `/projects`
- [ ] Add new "Jobs" link pointing to `/jobs`
- [ ] Update mobile navigation
- [ ] Update any breadcrumbs

### Phase 7: Update Landing Page
File: `app/landing/page.tsx`
- [ ] Update references from jobs to projects
- [ ] Add section for Employment Jobs
- [ ] Update CTAs and links

### Phase 8: Update Dashboard
- [ ] Update client dashboard to show projects (not jobs)
- [ ] Update freelancer dashboard to show projects
- [ ] Consider adding employer dashboard for job postings

---

## 🧪 Testing Tasks

### Database Testing
- [ ] Run migrations on development database
- [ ] Verify all tables renamed correctly
- [ ] Verify foreign keys updated
- [ ] Verify triggers work
- [ ] Test with existing data (if any)

### Backend Testing
- [ ] Test all project endpoints (formerly jobs)
- [ ] Test all employment job endpoints
- [ ] Test proposal submission to projects
- [ ] Test job application submission
- [ ] Test filtering and searching
- [ ] Test authorization (users can only modify their own content)

### Frontend Testing
- [ ] Test project listing page
- [ ] Test project detail page
- [ ] Test project creation/editing
- [ ] Test employment jobs listing page
- [ ] Test employment job detail page
- [ ] Test job application submission
- [ ] Test navigation between sections
- [ ] Test responsive design
- [ ] Test error handling

### Integration Testing
- [ ] Test end-to-end flow: Create project → Submit proposal
- [ ] Test end-to-end flow: Post job → Receive applications
- [ ] Test notifications
- [ ] Test dashboard statistics
- [ ] Test search across both features

---

## 📝 Documentation Tasks
- [ ] Update API documentation (Swagger/OpenAPI)
- [ ] Update README files
- [ ] Update environment variables documentation
- [ ] Create user guide for new Jobs feature
- [ ] Update admin handbook

---

## 🚀 Deployment Checklist
- [ ] Backup production database
- [ ] Test migrations on staging environment
- [ ] Run migrations on production
- [ ] Deploy backend service
- [ ] Build and deploy frontend
- [ ] Verify all endpoints accessible
- [ ] Monitor error logs
- [ ] Test critical user flows

---

## 📋 Key Files Modified

### Backend
```
services/marketplace-service/
├── pom.xml                                    ✅ Updated (added hypersistence-utils)
├── src/main/resources/db/migration/
│   ├── V15__refactor_jobs_to_projects.sql     ✅ Created
│   └── V16__create_jobs_for_employment.sql    ✅ Created
├── src/main/java/com/designer/marketplace/
│   ├── entity/
│   │   ├── Project.java                       ✅ Created
│   │   ├── ProjectCategory.java               ✅ Created
│   │   ├── EmploymentJob.java                 ✅ Created
│   │   ├── EmploymentJobCategory.java         ✅ Created
│   │   ├── JobApplication.java                ✅ Created
│   │   ├── Proposal.java                      ✅ Updated
│   │   ├── Job.java                           ⚠️  Keep for now (will be replaced)
│   │   └── JobCategory.java                   ⚠️  Keep for now (will be replaced)
│   ├── repository/
│   │   ├── ProjectRepository.java             ✅ Created
│   │   ├── ProjectCategoryRepository.java     ✅ Created
│   │   ├── EmploymentJobRepository.java       ✅ Created
│   │   ├── EmploymentJobCategoryRepository.java ✅ Created
│   │   ├── JobApplicationRepository.java      ✅ Created
│   │   ├── ProposalRepository.java            ✅ Updated
│   │   ├── JobRepository.java                 ⚠️  To be replaced
│   │   └── JobCategoryRepository.java         ⚠️  To be replaced
│   ├── service/
│   │   ├── EmploymentJobService.java          ✅ Created
│   │   ├── JobService.java                    ⏳ To be refactored → ProjectService
│   │   ├── ProposalService.java               ⏳ To be updated
│   │   ├── PaymentService.java                ⏳ To be updated
│   │   └── MilestoneService.java              ⏳ To be updated
│   ├── controller/
│   │   ├── EmploymentJobController.java       ✅ Created
│   │   ├── JobController.java                 ⏳ To be refactored → ProjectController
│   │   └── ProposalController.java            ⏳ To be updated
│   └── dto/
│       ├── EmploymentJobResponse.java         ✅ Created
│       ├── JobResponse.java                   ⏳ To be renamed → ProjectResponse
│       ├── CreateJobRequest.java              ⏳ To be renamed → CreateProjectRequest
│       └── ...                                ⏳ Multiple DTOs to update
```

### Frontend
```
frontend/marketplace-web/
├── app/
│   ├── jobs/                                  ⏳ To be renamed → projects/
│   │   ├── page.tsx                           ⏳ To be updated
│   │   ├── [id]/page.tsx                      ⏳ To be updated
│   │   └── create/page.tsx                    ⏳ To be updated (if exists)
│   ├── jobs/ (new)                            📝 To be created
│   │   ├── page.tsx                           📝 New employment jobs listing
│   │   ├── [id]/page.tsx                      📝 New employment job detail
│   │   └── categories/[slug]/page.tsx         📝 New category listing
│   ├── landing/page.tsx                       ⏳ To be updated
│   └── dashboard/page.tsx                     ⏳ To be updated
├── components/
│   ├── Navbar.tsx                             ⏳ To be updated
│   └── employment/ (new)                      📝 To be created
│       ├── JobCard.tsx                        📝 New
│       ├── JobDetail.tsx                      📝 New
│       ├── JobFilters.tsx                     📝 New
│       └── ApplicationForm.tsx                📝 New
└── lib/
    ├── apiTypes.ts                            ⏳ To be updated
    ├── api.ts                                 ⏳ To be updated
    └── apiParsers.ts                          ⏳ To be updated
```

---

## ⚠️ Important Notes

1. **Database Migrations**: Run V15 first, then V16. Do NOT run them in parallel.

2. **Backward Compatibility**: The old `Job` and `JobCategory` classes are kept temporarily to avoid breaking existing code. They should be removed only after all references are updated.

3. **API Versioning**: Consider API versioning (`/api/v1/` vs `/api/v2/`) if you need to maintain backward compatibility for external clients.

4. **Environment Variables**: No new environment variables required for this refactoring.

5. **User Roles**: Employment job posting may require a new role or permission. Currently using `CLIENT` role for employers.

6. **File Uploads**: Job applications may need resume upload functionality. Consider:
   - Using existing file storage service
   - Adding S3/Azure Blob Storage integration
   - Setting file size limits

7. **Email Notifications**: Consider adding:
   - Application confirmation emails
   - Application status update emails
   - New application notifications for employers

---

## 🔗 Related Files to Review

- `application.properties` - Check Flyway configuration
- `SecurityConfig.java` - May need role updates
- `CorsConfig.java` - Verify CORS settings for new endpoints
- Any caching configurations - Update cache keys if needed
- Monitoring/logging configs - Add new endpoints to monitoring

---

## Next Steps (Immediate)

1. **Run Database Migrations** (highest priority)
   - Start marketplace-service
   - Flyway will auto-run migrations
   - Verify database schema

2. **Update Existing Services** (critical)
   - Update JobService → ProjectService
   - Update JobController → ProjectController
   - Update ProposalService

3. **Frontend Updates** (user-facing)
   - Rename jobs directory
   - Update API calls
   - Create new jobs pages

4. **Testing** (before production)
   - Test all features thoroughly
   - Verify no broken links
   - Test user flows

---

## Questions/Decisions Needed

- [ ] Should we support file uploads for job applications in this phase?
- [ ] Do we need email notifications for applications?
- [ ] Should there be an "Employer" role separate from "Client"?
- [ ] Do we need application tracking/ATS features?
- [ ] Should jobs support multiple locations (e.g., remote + office)?
- [ ] Do we need video interview scheduling integration?

---

Last Updated: 2025-12-31
Status: Backend entities and migrations complete, services in progress
