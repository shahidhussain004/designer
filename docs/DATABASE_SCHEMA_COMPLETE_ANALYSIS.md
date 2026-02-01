# PostgreSQL Database Schema - Complete Analysis

**Database:** marketplace_db  
**Generated:** January 26, 2026  
**Migration Files:** V1 through V15  
**Total Tables:** 29 tables + 1 materialized view

---

## Table of Contents

1. [PostgreSQL Extensions](#postgresql-extensions)
2. [Core Tables (V1)](#v1-core-tables)
3. [Reference Tables (V2-V3, V6)](#reference-tables)
4. [Job & Application Tables (V4-V5)](#job--application-tables)
5. [Project & Proposal Tables (V7-V8)](#project--proposal-tables)
6. [Contract & Financial Tables (V9-V11)](#contract--financial-tables)
7. [Communication Tables (V12)](#communication-tables)
8. [Notification & Review Tables (V13)](#notification--review-tables)
9. [Portfolio & Time Tracking Tables (V14)](#portfolio--time-tracking-tables)
10. [Support & Audit Tables (V15)](#support--audit-tables)
11. [Schema Summary](#schema-summary)
12. [JSONB Fields Reference](#jsonb-fields-reference)
13. [Soft Delete Tables](#soft-delete-tables)
14. [Triggers & Functions](#triggers--functions)
15. [Foreign Key Relationships](#foreign-key-relationships)

---

## PostgreSQL Extensions

**Enabled in V1:**
- `pg_trgm` - Trigram similarity and fuzzy text search
- `btree_gin` - Composite GIN indexes for better performance

---

## V1: Core Tables

### Table: `users`
**Purpose:** Base users table for authentication and common profile data

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| email | VARCHAR(255) | NOT NULL | - | - |
| username | VARCHAR(100) | NOT NULL | - | - |
| password_hash | VARCHAR(255) | NOT NULL | - | - |
| role | VARCHAR(20) | NOT NULL | 'FREELANCER' | CHECK: IN ('FREELANCER', 'COMPANY', 'ADMIN') |
| full_name | VARCHAR(100) | NULL | - | - |
| phone | VARCHAR(20) | NULL | - | - |
| bio | TEXT | NULL | - | - |
| profile_image_url | VARCHAR(500) | NULL | - | - |
| location | VARCHAR(100) | NULL | - | - |
| email_verified | BOOLEAN | NOT NULL | FALSE | - |
| identity_verified | BOOLEAN | NOT NULL | FALSE | - |
| identity_verified_at | TIMESTAMP(6) | NULL | - | - |
| verification_status | VARCHAR(20) | NOT NULL | 'UNVERIFIED' | CHECK: IN ('UNVERIFIED', 'VERIFIED', 'REJECTED') |
| is_active | BOOLEAN | NOT NULL | TRUE | - |
| rating_avg | NUMERIC(3,2) | NULL | 0.00 | CHECK: >= 0 AND <= 5 |
| rating_count | INTEGER | NULL | 0 | CHECK: >= 0 |
| stripe_customer_id | VARCHAR(100) | NULL | - | - |
| stripe_account_id | VARCHAR(100) | NULL | - | - |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| updated_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| deleted_at | TIMESTAMP(6) | NULL | - | **SOFT DELETE** |

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_users_email_active | UNIQUE | LOWER(email) | WHERE deleted_at IS NULL |
| idx_users_username_active | UNIQUE | LOWER(username) | WHERE deleted_at IS NULL |
| idx_users_role_active | B-TREE | role, is_active | WHERE deleted_at IS NULL |
| idx_users_created_at_desc | B-TREE | created_at DESC | WHERE deleted_at IS NULL |
| idx_users_rating | B-TREE | rating_avg DESC, rating_count DESC | WHERE is_active = TRUE AND deleted_at IS NULL |
| idx_users_location | B-TREE | location | WHERE location IS NOT NULL AND deleted_at IS NULL |
| idx_users_stripe_customer | B-TREE | stripe_customer_id | WHERE stripe_customer_id IS NOT NULL |
| idx_users_email_verified | B-TREE | email_verified | WHERE email_verified = TRUE AND deleted_at IS NULL |
| idx_users_search | GIN | to_tsvector('english', ...) | WHERE deleted_at IS NULL |

#### Triggers
- `users_updated_at` - Auto-update `updated_at` on UPDATE

---

### Table: `companies`
**Purpose:** Company-specific profile data (role-specific entity for COMPANY users)

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| user_id | BIGINT | NOT NULL | - | UNIQUE, FK → users(id) ON DELETE CASCADE |
| company_name | VARCHAR(255) | NOT NULL | - | - |
| company_type | VARCHAR(100) | NULL | - | - |
| industry | VARCHAR(100) | NULL | - | - |
| website_url | VARCHAR(500) | NULL | - | - |
| company_size | VARCHAR(50) | NULL | - | CHECK: IN ('STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE') |
| registration_number | VARCHAR(100) | NULL | - | - |
| tax_id | VARCHAR(100) | NULL | - | - |
| phone | VARCHAR(20) | NULL | - | - |
| headquarters_location | VARCHAR(255) | NULL | - | - |
| total_projects_posted | INTEGER | NOT NULL | 0 | CHECK: >= 0 |
| total_spent_cents | BIGINT | NOT NULL | 0 | CHECK: >= 0 (stored in cents) |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| updated_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_companies_user_id | B-TREE | user_id | - |
| idx_companies_industry | B-TREE | industry | WHERE industry IS NOT NULL |
| idx_companies_size | B-TREE | company_size | WHERE company_size IS NOT NULL |
| idx_companies_created_at | B-TREE | created_at DESC | - |
| idx_companies_name_search | GIN | to_tsvector('english', company_name) | - |

#### Triggers
- `companies_updated_at` - Auto-update `updated_at` on UPDATE

---

### Table: `freelancers`
**Purpose:** Freelancer-specific profile data (role-specific entity for FREELANCER users)

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| user_id | BIGINT | NOT NULL | - | UNIQUE, FK → users(id) ON DELETE CASCADE |
| hourly_rate_cents | BIGINT | NULL | - | CHECK: >= 0 (stored in cents) |
| experience_years | INTEGER | NULL | - | CHECK: >= 0 |
| headline | VARCHAR(255) | NULL | - | - |
| portfolio_url | VARCHAR(500) | NULL | - | - |
| github_url | VARCHAR(500) | NULL | - | - |
| linkedin_url | VARCHAR(500) | NULL | - | - |
| skills | **JSONB** | NOT NULL | '[]'::jsonb | **Format:** [{"name": "React", "level": "expert", "years": 5}] |
| certifications | **JSONB** | NOT NULL | '[]'::jsonb | **Format:** [{"name": "AWS Certified", "issuer": "Amazon", "year": 2023, "credential_id": "ABC123"}] |
| languages | **JSONB** | NOT NULL | '[]'::jsonb | **Format:** [{"language": "English", "proficiency": "native"}] |
| completion_rate | NUMERIC(5,2) | NULL | 0.00 | CHECK: >= 0 AND <= 100 |
| response_rate | NUMERIC(5,2) | NULL | - | CHECK: >= 0 AND <= 100 |
| response_time_hours | INTEGER | NULL | - | - |
| total_earnings_cents | BIGINT | NOT NULL | 0 | CHECK: >= 0 (stored in cents) |
| total_projects_completed | INTEGER | NOT NULL | 0 | CHECK: >= 0 |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| updated_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_freelancers_user_id | B-TREE | user_id | - |
| idx_freelancers_hourly_rate | B-TREE | hourly_rate_cents | WHERE hourly_rate_cents IS NOT NULL |
| idx_freelancers_completion_rate | B-TREE | completion_rate DESC, total_projects_completed DESC | - |
| idx_freelancers_experience | B-TREE | experience_years DESC | WHERE experience_years IS NOT NULL |
| idx_freelancers_created_at | B-TREE | created_at DESC | - |
| idx_freelancers_skills_gin | **GIN** | skills | **JSONB INDEX** |
| idx_freelancers_certifications_gin | **GIN** | certifications | **JSONB INDEX** |
| idx_freelancers_languages_gin | **GIN** | languages | **JSONB INDEX** |
| idx_freelancers_search | B-TREE | hourly_rate_cents, completion_rate DESC, total_projects_completed DESC | WHERE hourly_rate_cents IS NOT NULL |

#### Triggers
- `freelancers_updated_at` - Auto-update `updated_at` on UPDATE

---

## Reference Tables

### Table: `experience_levels` (V2)
**Purpose:** Lookup table for job experience level requirements

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| name | VARCHAR(50) | NOT NULL | - | UNIQUE |
| code | VARCHAR(20) | NOT NULL | - | UNIQUE (Values: ENTRY, INTERMEDIATE, SENIOR, LEAD, EXECUTIVE) |
| description | TEXT | NULL | - | - |
| years_min | INTEGER | NULL | - | - |
| years_max | INTEGER | NULL | - | CHECK: years_max >= years_min |
| display_order | INTEGER | NOT NULL | 0 | CHECK: >= 0 |
| is_active | BOOLEAN | NOT NULL | TRUE | - |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| updated_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_experience_levels_code | B-TREE | code | WHERE is_active = TRUE |
| idx_experience_levels_display_order | B-TREE | display_order | WHERE is_active = TRUE |

#### Triggers
- `experience_levels_updated_at` - Auto-update `updated_at` on UPDATE

---

### Table: `job_categories` (V3)
**Purpose:** Categories for traditional company job postings

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| name | VARCHAR(100) | NOT NULL | - | UNIQUE |
| slug | VARCHAR(100) | NOT NULL | - | UNIQUE |
| description | TEXT | NULL | - | - |
| icon | VARCHAR(50) | NULL | - | - |
| display_order | INTEGER | NOT NULL | 0 | CHECK: >= 0 |
| is_active | BOOLEAN | NOT NULL | TRUE | - |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| updated_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_job_categories_slug_active | UNIQUE | slug | WHERE is_active = TRUE |
| idx_job_categories_display_order | B-TREE | display_order | WHERE is_active = TRUE |
| idx_job_categories_search | GIN | to_tsvector('english', name || ' ' || COALESCE(description, '')) | WHERE is_active = TRUE |

#### Triggers
- `job_categories_updated_at` - Auto-update `updated_at` on UPDATE

---

### Table: `project_categories` (V6)
**Purpose:** Categories for freelance/gig project postings

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| name | VARCHAR(50) | NOT NULL | - | UNIQUE |
| slug | VARCHAR(50) | NOT NULL | - | UNIQUE |
| description | TEXT | NULL | - | - |
| icon | VARCHAR(50) | NULL | - | - |
| display_order | INTEGER | NOT NULL | 0 | CHECK: >= 0 |
| is_active | BOOLEAN | NOT NULL | TRUE | - |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| updated_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_project_categories_slug_active | UNIQUE | slug | WHERE is_active = TRUE |
| idx_project_categories_display_order | B-TREE | display_order | WHERE is_active = TRUE |
| idx_project_categories_search | GIN | to_tsvector('english', name || ' ' || COALESCE(description, '')) | WHERE is_active = TRUE |

#### Triggers
- `project_categories_updated_at` - Auto-update `updated_at` on UPDATE

---

## Job & Application Tables

### Table: `jobs` (V4)
**Purpose:** Company job postings for FULL_TIME, PART_TIME, CONTRACT, TEMPORARY, INTERNSHIP positions

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| company_id | BIGINT | NOT NULL | - | FK → companies(id) ON DELETE CASCADE |
| category_id | BIGINT | NULL | - | FK → job_categories(id) ON DELETE SET NULL |
| title | VARCHAR(255) | NOT NULL | - | - |
| description | TEXT | NOT NULL | - | - |
| responsibilities | TEXT | NULL | - | - |
| requirements | TEXT | NULL | - | - |
| job_type | VARCHAR(50) | NOT NULL | 'FULL_TIME' | CHECK: IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY', 'INTERNSHIP') |
| experience_level | VARCHAR(50) | NULL | 'INTERMEDIATE' | CHECK: IN ('ENTRY', 'INTERMEDIATE', 'SENIOR', 'LEAD', 'EXECUTIVE') |
| location | VARCHAR(255) | NULL | - | - |
| city | VARCHAR(100) | NULL | - | - |
| state | VARCHAR(100) | NULL | - | - |
| country | VARCHAR(100) | NULL | - | - |
| is_remote | BOOLEAN | NULL | FALSE | - |
| remote_type | VARCHAR(50) | NULL | - | CHECK: IN ('FULLY_REMOTE', 'HYBRID', 'ON_SITE') |
| salary_min_cents | BIGINT | NULL | - | - (stored in cents) |
| salary_max_cents | BIGINT | NULL | - | CHECK: >= salary_min_cents (stored in cents) |
| salary_currency | VARCHAR(3) | NULL | 'USD' | - |
| salary_period | VARCHAR(20) | NULL | 'ANNUAL' | CHECK: IN ('ANNUAL', 'MONTHLY', 'HOURLY') |
| show_salary | BOOLEAN | NULL | TRUE | - |
| benefits | **JSONB** | NULL | '[]'::jsonb | **Format:** [{"name": "Health Insurance", "description": "Full coverage"}] |
| perks | **JSONB** | NULL | '[]'::jsonb | - |
| required_skills | **JSONB** | NULL | '[]'::jsonb | **Format:** [{"skill": "Java", "required": true, "years": 3}] |
| preferred_skills | **JSONB** | NULL | '[]'::jsonb | - |
| education_level | VARCHAR(50) | NULL | - | CHECK: IN ('BACHELOR', 'MASTER', 'PHD') |
| certifications | **JSONB** | NULL | '[]'::jsonb | - |
| positions_available | INTEGER | NULL | 1 | CHECK: > 0 |
| application_deadline | TIMESTAMP(6) | NULL | - | - |
| application_email | VARCHAR(255) | NULL | - | - |
| application_url | TEXT | NULL | - | - |
| apply_instructions | TEXT | NULL | - | - |
| company_name | VARCHAR(255) | NULL | - | - |
| company_description | TEXT | NULL | - | - |
| company_logo_url | TEXT | NULL | - | - |
| company_website | TEXT | NULL | - | - |
| company_size | VARCHAR(50) | NULL | - | - |
| industry | VARCHAR(100) | NULL | - | - |
| start_date | DATE | NULL | - | - |
| travel_requirement | VARCHAR(50) | NULL | - | CHECK: IN ('NONE', 'MINIMAL', 'MODERATE', 'EXTENSIVE') |
| security_clearance_required | BOOLEAN | NULL | FALSE | - |
| visa_sponsorship | BOOLEAN | NULL | FALSE | - |
| status | VARCHAR(20) | NOT NULL | 'DRAFT' | CHECK: IN ('DRAFT', 'OPEN', 'PAUSED', 'CLOSED', 'FILLED') |
| views_count | INTEGER | NOT NULL | 0 | CHECK: >= 0 |
| applications_count | INTEGER | NOT NULL | 0 | CHECK: >= 0 |
| is_featured | BOOLEAN | NULL | FALSE | - |
| is_urgent | BOOLEAN | NULL | FALSE | - |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| updated_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| published_at | TIMESTAMP(6) | NULL | - | - |
| closed_at | TIMESTAMP(6) | NULL | - | - |
| deleted_at | TIMESTAMP(6) | NULL | - | **SOFT DELETE** |

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_jobs_company_id | B-TREE | company_id | WHERE deleted_at IS NULL |
| idx_jobs_category_id | B-TREE | category_id | WHERE deleted_at IS NULL |
| idx_jobs_open | B-TREE | created_at DESC, salary_min_cents, salary_max_cents | WHERE status = 'OPEN' AND deleted_at IS NULL |
| idx_jobs_featured | B-TREE | created_at DESC | WHERE is_featured = TRUE AND status = 'OPEN' AND deleted_at IS NULL |
| idx_jobs_type_level | B-TREE | job_type, experience_level, created_at DESC | WHERE status = 'OPEN' AND deleted_at IS NULL |
| idx_jobs_location | B-TREE | city, country, is_remote | WHERE status = 'OPEN' AND deleted_at IS NULL |
| idx_jobs_salary_range | B-TREE | salary_min_cents, salary_max_cents | WHERE salary_min_cents IS NOT NULL AND status = 'OPEN' AND deleted_at IS NULL |
| idx_jobs_required_skills_gin | **GIN** | required_skills | **JSONB INDEX** |
| idx_jobs_preferred_skills_gin | **GIN** | preferred_skills | **JSONB INDEX** |
| idx_jobs_benefits_gin | **GIN** | benefits | **JSONB INDEX** |
| idx_jobs_perks_gin | **GIN** | perks | **JSONB INDEX** |
| idx_jobs_search | GIN | to_tsvector('english', title || ' ' || ...) | WHERE deleted_at IS NULL |
| idx_jobs_company_status | B-TREE | company_id, status, created_at DESC | WHERE deleted_at IS NULL |

#### Triggers
- `jobs_updated_at` - Auto-update `updated_at` on UPDATE
- `jobs_counter_check` - Prevent negative counters

#### Functions
- `prevent_negative_counters_jobs()` - Ensures views_count and applications_count never go negative

---

### Table: `job_applications` (V5)
**Purpose:** Candidate applications for job postings

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| job_id | BIGINT | NOT NULL | - | FK → jobs(id) ON DELETE CASCADE |
| applicant_id | BIGINT | NOT NULL | - | FK → freelancers(id) ON DELETE CASCADE |
| full_name | VARCHAR(255) | NOT NULL | - | - |
| email | VARCHAR(255) | NOT NULL | - | - |
| phone | VARCHAR(20) | NULL | - | - |
| cover_letter | TEXT | NULL | - | - |
| resume_url | TEXT | NULL | - | - |
| portfolio_url | TEXT | NULL | - | - |
| linkedin_url | TEXT | NULL | - | - |
| additional_documents | TEXT[] | NULL | '{}' | Simple array of URLs |
| answers | **JSONB** | NULL | '{}'::jsonb | **Format:** {"question1": "answer1", "question2": "answer2"} |
| status | VARCHAR(50) | NOT NULL | 'PENDING' | CHECK: IN ('PENDING', 'SUBMITTED', 'REVIEWING', 'SHORTLISTED', 'INTERVIEWING', 'OFFERED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN') |
| company_notes | TEXT | NULL | - | - |
| rejection_reason | TEXT | NULL | - | - |
| reviewed_at | TIMESTAMP(6) | NULL | - | - |
| applied_at | TIMESTAMP(6) | NULL | - | - |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| updated_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| deleted_at | TIMESTAMP(6) | NULL | - | **SOFT DELETE** |

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_job_applications_job_id | B-TREE | job_id | WHERE deleted_at IS NULL |
| idx_job_applications_applicant_id | B-TREE | applicant_id | WHERE deleted_at IS NULL |
| idx_job_applications_status | B-TREE | status | WHERE deleted_at IS NULL |
| idx_job_applications_created_at | B-TREE | created_at DESC | WHERE deleted_at IS NULL |
| idx_job_applications_reviewing | B-TREE | job_id, created_at DESC | WHERE status IN ('SUBMITTED', 'REVIEWING') AND deleted_at IS NULL |
| idx_job_applications_shortlisted | B-TREE | job_id, created_at DESC | WHERE status = 'SHORTLISTED' AND deleted_at IS NULL |
| idx_job_applications_pending_decision | B-TREE | job_id, created_at DESC | WHERE status IN ('SHORTLISTED', 'INTERVIEWING', 'OFFERED') AND deleted_at IS NULL |
| idx_job_applications_answers_gin | **GIN** | answers | **JSONB INDEX** |

#### Triggers
- `job_applications_updated_at` - Auto-update `updated_at` on UPDATE
- `trg_increment_job_applications_count` - Increment job applications_count
- `trg_decrement_job_applications_count` - Decrement job applications_count on soft-delete

#### Functions
- `increment_job_applications_count()` - Increments applications_count in jobs table
- `decrement_job_applications_count()` - Decrements applications_count in jobs table on soft-delete

---

## Project & Proposal Tables

### Table: `projects` (V7)
**Purpose:** Freelance/gig project postings by companies

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| company_id | BIGINT | NOT NULL | - | FK → companies(id) ON DELETE CASCADE |
| category_id | BIGINT | NULL | - | FK → project_categories(id) ON DELETE SET NULL |
| title | VARCHAR(255) | NOT NULL | - | - |
| description | TEXT | NOT NULL | - | - |
| scope_of_work | TEXT | NULL | - | - |
| deliverables | TEXT[] | NULL | '{}' | Simple string array for deliverable items |
| budget_min_cents | BIGINT | NULL | - | - (stored in cents) |
| budget_max_cents | BIGINT | NULL | - | CHECK: >= budget_min_cents (stored in cents) |
| budget_type | VARCHAR(50) | NOT NULL | 'FIXED_PRICE' | CHECK: IN ('HOURLY', 'FIXED_PRICE', 'NOT_SURE') |
| currency | VARCHAR(3) | NOT NULL | 'USD' | - |
| timeline | VARCHAR(100) | NULL | - | CHECK: IN ('ASAP', '1-3_MONTHS', '3-6_MONTHS', '6_PLUS_MONTHS') |
| estimated_duration_days | INTEGER | NULL | - | CHECK: > 0 |
| required_skills | **JSONB** | NOT NULL | '[]'::jsonb | **Format:** [{"skill": "React", "level": "expert", "required": true, "years": 3}] |
| preferred_skills | **JSONB** | NOT NULL | '[]'::jsonb | - |
| experience_level | VARCHAR(50) | NULL | - | CHECK: IN ('ENTRY', 'INTERMEDIATE', 'SENIOR', 'LEAD', 'EXECUTIVE') |
| project_type | VARCHAR(50) | NOT NULL | 'SINGLE_PROJECT' | CHECK: IN ('SINGLE_PROJECT', 'ONGOING', 'CONTRACT') |
| priority_level | VARCHAR(50) | NOT NULL | 'MEDIUM' | CHECK: IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT') |
| is_featured | BOOLEAN | NOT NULL | FALSE | - |
| is_urgent | BOOLEAN | NOT NULL | FALSE | - |
| status | VARCHAR(50) | NOT NULL | 'DRAFT' | CHECK: IN ('DRAFT', 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ARCHIVED') |
| visibility | VARCHAR(50) | NOT NULL | 'PUBLIC' | CHECK: IN ('PUBLIC', 'PRIVATE', 'INVITE_ONLY') |
| proposal_count | INTEGER | NOT NULL | 0 | CHECK: >= 0 |
| views_count | INTEGER | NOT NULL | 0 | CHECK: >= 0 |
| screening_questions | **JSONB** | NULL | '[]'::jsonb | **Format:** [{"question": "What is your experience with React?", "required": true}] |
| apply_instructions | TEXT | NULL | - | - |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| updated_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| published_at | TIMESTAMP(6) | NULL | - | - |
| closed_at | TIMESTAMP(6) | NULL | - | - |
| deleted_at | TIMESTAMP(6) | NULL | - | **SOFT DELETE** |

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_projects_company_id | B-TREE | company_id | WHERE deleted_at IS NULL |
| idx_projects_category_id | B-TREE | category_id | WHERE deleted_at IS NULL |
| idx_projects_open | B-TREE | created_at DESC, budget_min_cents, budget_max_cents | WHERE status = 'OPEN' AND visibility = 'PUBLIC' AND deleted_at IS NULL |
| idx_projects_featured | B-TREE | created_at DESC | WHERE is_featured = TRUE AND status = 'OPEN' AND deleted_at IS NULL |
| idx_projects_budget_range | B-TREE | budget_min_cents, budget_max_cents, budget_type | WHERE budget_min_cents IS NOT NULL AND status = 'OPEN' AND deleted_at IS NULL |
| idx_projects_experience | B-TREE | experience_level, created_at DESC | WHERE experience_level IS NOT NULL AND status = 'OPEN' AND deleted_at IS NULL |
| idx_projects_type_priority | B-TREE | project_type, priority_level, created_at DESC | WHERE status = 'OPEN' AND deleted_at IS NULL |
| idx_projects_required_skills_gin | **GIN** | required_skills | **JSONB INDEX** |
| idx_projects_preferred_skills_gin | **GIN** | preferred_skills | **JSONB INDEX** |
| idx_projects_screening_questions_gin | **GIN** | screening_questions | **JSONB INDEX** |
| idx_projects_search | GIN | to_tsvector('english', title || ' ' || ...) | WHERE deleted_at IS NULL |
| idx_projects_company_status | B-TREE | company_id, status, created_at DESC | WHERE deleted_at IS NULL |
| idx_projects_public_browse | B-TREE | created_at DESC | WHERE visibility = 'PUBLIC' AND status = 'OPEN' AND deleted_at IS NULL |

#### Triggers
- `projects_updated_at` - Auto-update `updated_at` on UPDATE
- `projects_counter_check` - Prevent negative counters

#### Functions
- `prevent_negative_counters_projects()` - Ensures views_count and proposal_count never go negative

---

### Table: `proposals` (V8)
**Purpose:** Freelancer proposals for projects

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| project_id | BIGINT | NOT NULL | - | FK → projects(id) ON DELETE CASCADE |
| freelancer_id | BIGINT | NOT NULL | - | FK → freelancers(id) ON DELETE CASCADE, UNIQUE(project_id, freelancer_id) |
| cover_letter | TEXT | NOT NULL | - | - |
| suggested_budget_cents | BIGINT | NULL | - | CHECK: >= 0 (stored in cents) |
| proposed_timeline | VARCHAR(100) | NULL | - | - |
| estimated_hours | NUMERIC(10,2) | NULL | - | CHECK: > 0 |
| attachments | TEXT[] | NULL | '{}' | Simple array of URLs |
| portfolio_links | TEXT[] | NULL | '{}' | Simple array of URLs |
| answers | **JSONB** | NULL | '[]'::jsonb | **Format:** [{"question": "What is your experience?", "answer": "5 years with React"}] |
| status | VARCHAR(50) | NOT NULL | 'SUBMITTED' | CHECK: IN ('SUBMITTED', 'REVIEWING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN') |
| is_featured | BOOLEAN | NULL | FALSE | - |
| company_notes | TEXT | NULL | - | - |
| rejection_reason | TEXT | NULL | - | - |
| company_rating | NUMERIC(3,1) | NULL | - | CHECK: >= 0 AND <= 5 |
| company_review | TEXT | NULL | - | - |
| freelancer_rating | NUMERIC(3,1) | NULL | - | CHECK: >= 0 AND <= 5 |
| freelancer_review | TEXT | NULL | - | - |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| updated_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| reviewed_at | TIMESTAMP(6) | NULL | - | - |

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_proposals_project_id | B-TREE | project_id | - |
| idx_proposals_freelancer_id | B-TREE | freelancer_id | - |
| idx_proposals_created_at | B-TREE | created_at DESC | - |
| idx_proposals_reviewing | B-TREE | project_id, created_at DESC | WHERE status IN ('SUBMITTED', 'REVIEWING') |
| idx_proposals_shortlisted | B-TREE | project_id, created_at DESC | WHERE status = 'SHORTLISTED' |
| idx_proposals_featured | B-TREE | project_id, created_at DESC | WHERE is_featured = TRUE |
| idx_proposals_budget | B-TREE | suggested_budget_cents | WHERE suggested_budget_cents IS NOT NULL |
| idx_proposals_answers_gin | **GIN** | answers | **JSONB INDEX** |
| idx_proposals_freelancer_status | B-TREE | freelancer_id, status, created_at DESC | - |

#### Triggers
- `proposals_updated_at` - Auto-update `updated_at` on UPDATE
- `trg_increment_project_proposal_count` - Increment project proposal_count
- `trg_decrement_project_proposal_count` - Decrement project proposal_count

#### Functions
- `increment_project_proposal_count()` - Increments proposal_count in projects table
- `decrement_project_proposal_count()` - Decrements proposal_count in projects table

---

## Contract & Financial Tables

### Table: `contracts` (V9)
**Purpose:** Formal agreements between companies and freelancers

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| project_id | BIGINT | NOT NULL | - | FK → projects(id) ON DELETE CASCADE |
| company_id | BIGINT | NOT NULL | - | FK → companies(id) ON DELETE CASCADE |
| freelancer_id | BIGINT | NOT NULL | - | FK → freelancers(id) ON DELETE CASCADE |
| proposal_id | BIGINT | NULL | - | FK → proposals(id) ON DELETE SET NULL |
| title | VARCHAR(255) | NOT NULL | - | - |
| description | TEXT | NULL | - | - |
| contract_type | VARCHAR(20) | NOT NULL | - | CHECK: IN ('FIXED_PRICE', 'HOURLY', 'MILESTONE_BASED') |
| amount_cents | BIGINT | NOT NULL | - | CHECK: > 0 (stored in cents) |
| currency | VARCHAR(3) | NOT NULL | 'USD' | - |
| payment_schedule | VARCHAR(20) | NULL | - | CHECK: IN ('UPFRONT', 'ON_COMPLETION', 'MILESTONE_BASED', 'WEEKLY', 'MONTHLY') |
| milestone_count | INTEGER | NULL | 0 | CHECK: >= 0 |
| completion_percentage | INTEGER | NULL | 0 | CHECK: >= 0 AND <= 100 |
| start_date | TIMESTAMP(6) | NULL | - | - |
| end_date | TIMESTAMP(6) | NULL | - | CHECK: >= start_date |
| status | VARCHAR(20) | NOT NULL | 'DRAFT' | CHECK: IN ('DRAFT', 'PENDING', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED', 'DISPUTED') |
| completed_at | TIMESTAMP(6) | NULL | - | - |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| updated_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_contracts_project_id | B-TREE | project_id | - |
| idx_contracts_company_id | B-TREE | company_id | - |
| idx_contracts_freelancer_id | B-TREE | freelancer_id | - |
| idx_contracts_proposal_id | B-TREE | proposal_id | WHERE proposal_id IS NOT NULL |
| idx_contracts_created_at | B-TREE | created_at DESC | - |
| idx_contracts_active | B-TREE | company_id, freelancer_id, created_at DESC | WHERE status = 'ACTIVE' |
| idx_contracts_pending | B-TREE | company_id, created_at DESC | WHERE status = 'PENDING' |
| idx_contracts_company_status | B-TREE | company_id, status, created_at DESC | - |
| idx_contracts_freelancer_status | B-TREE | freelancer_id, status, created_at DESC | - |
| idx_contracts_dates | B-TREE | start_date, end_date | WHERE start_date IS NOT NULL |

#### Triggers
- `contracts_updated_at` - Auto-update `updated_at` on UPDATE
- `trg_update_freelancer_completion_rate` - Update freelancer completion_rate

#### Functions
- `get_user_active_contracts_count(user_id_param)` - Returns count of active contracts for a user
- `can_user_create_contract(user_id_param, max_contracts)` - Check if user can create new contract
- `calculate_user_completion_rate(user_id_param)` - Calculate completion rate percentage
- `update_freelancer_completion_rate()` - Trigger function to update freelancer completion rate

---

### Table: `escrow` (V10)
**Purpose:** Escrow account holding for secure payment processing

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| project_id | BIGINT | NOT NULL | - | FK → projects(id) ON DELETE CASCADE |
| payment_id | BIGINT | NOT NULL | - | - |
| amount_cents | BIGINT | NOT NULL | - | CHECK: > 0 (stored in cents) |
| currency | VARCHAR(3) | NOT NULL | 'USD' | - |
| status | VARCHAR(50) | NOT NULL | - | CHECK: IN ('HELD', 'RELEASED', 'REFUNDED', 'DISPUTED') |
| release_condition | VARCHAR(100) | NULL | - | CHECK: IN ('JOB_COMPLETED', 'MILESTONE_COMPLETED', 'MANUAL_RELEASE', 'AUTO_RELEASE', 'DISPUTE_RESOLVED') |
| auto_release_date | TIMESTAMP(6) | NULL | - | - |
| released_at | TIMESTAMP(6) | NULL | - | - |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| updated_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_escrow_project_id | B-TREE | project_id | - |
| idx_escrow_payment_id | B-TREE | payment_id | - |
| idx_escrow_status | B-TREE | status | - |
| idx_escrow_auto_release | B-TREE | auto_release_date | WHERE status = 'HELD' AND auto_release_date IS NOT NULL |

#### Triggers
- `escrow_updated_at` - Auto-update `updated_at` on UPDATE

---

### Table: `payments` (V10)
**Purpose:** Payment transactions between users

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| contract_id | BIGINT | NULL | - | FK → contracts(id) ON DELETE SET NULL |
| payer_id | BIGINT | NOT NULL | - | FK → companies(id) ON DELETE CASCADE |
| payee_id | BIGINT | NOT NULL | - | FK → freelancers(id) ON DELETE CASCADE |
| amount_cents | BIGINT | NOT NULL | - | CHECK: > 0 (stored in cents) |
| currency | VARCHAR(3) | NOT NULL | 'USD' | - |
| payment_method | VARCHAR(50) | NULL | - | CHECK: IN ('CREDIT_CARD', 'BANK_TRANSFER', 'WALLET', 'PAYPAL') |
| description | TEXT | NULL | - | - |
| status | VARCHAR(50) | NOT NULL | 'PENDING' | CHECK: IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED') |
| transaction_id | VARCHAR(255) | NULL | - | - |
| reference_number | VARCHAR(50) | NULL | - | - |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| updated_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| processed_at | TIMESTAMP(6) | NULL | - | - |

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_payments_payer_id | B-TREE | payer_id | - |
| idx_payments_payee_id | B-TREE | payee_id | - |
| idx_payments_contract_id | B-TREE | contract_id | WHERE contract_id IS NOT NULL |
| idx_payments_status | B-TREE | status | - |
| idx_payments_created_at | B-TREE | created_at DESC | - |
| idx_payments_transaction_id | B-TREE | transaction_id | WHERE transaction_id IS NOT NULL |
| idx_payments_pending | B-TREE | created_at DESC | WHERE status = 'PENDING' |

#### Triggers
- `payments_updated_at` - Auto-update `updated_at` on UPDATE

---

### Table: `payouts` (V10)
**Purpose:** Payout transactions for withdrawing earnings

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| user_id | BIGINT | NOT NULL | - | FK → freelancers(id) ON DELETE CASCADE |
| amount_cents | BIGINT | NOT NULL | - | CHECK: > 0 (stored in cents) |
| currency | VARCHAR(3) | NOT NULL | 'USD' | - |
| payout_method | VARCHAR(50) | NULL | - | CHECK: IN ('BANK_TRANSFER', 'PAYPAL', 'WISE', 'CRYPTO') |
| status | VARCHAR(50) | NOT NULL | 'PENDING' | CHECK: IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED') |
| payout_account | VARCHAR(255) | NULL | - | - |
| period_start | DATE | NULL | - | - |
| period_end | DATE | NULL | - | CHECK: >= period_start |
| transaction_id | VARCHAR(255) | NULL | - | - |
| notes | TEXT | NULL | - | - |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| updated_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| processed_at | TIMESTAMP(6) | NULL | - | - |

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_payouts_user_id | B-TREE | user_id | - |
| idx_payouts_status | B-TREE | status | - |
| idx_payouts_created_at | B-TREE | created_at DESC | - |
| idx_payouts_transaction_id | B-TREE | transaction_id | WHERE transaction_id IS NOT NULL |
| idx_payouts_pending | B-TREE | user_id, created_at DESC | WHERE status = 'PENDING' |

#### Triggers
- `payouts_updated_at` - Auto-update `updated_at` on UPDATE

---

### Table: `payment_history` (V10)
**Purpose:** Complete audit log of all payment transactions

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| user_id | BIGINT | NOT NULL | - | FK → users(id) ON DELETE CASCADE |
| payment_id | BIGINT | NULL | - | FK → payments(id) ON DELETE SET NULL |
| transaction_type | VARCHAR(50) | NULL | - | - |
| amount_cents | BIGINT | NOT NULL | - | CHECK: >= 0 (stored in cents) |
| currency | VARCHAR(3) | NOT NULL | 'USD' | - |
| balance_before_cents | BIGINT | NULL | - | - (stored in cents) |
| balance_after_cents | BIGINT | NULL | - | - (stored in cents) |
| status | VARCHAR(50) | NULL | - | - |
| description | TEXT | NULL | - | - |
| reference_id | VARCHAR(255) | NULL | - | - |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_payment_history_user_id | B-TREE | user_id | - |
| idx_payment_history_created_at | B-TREE | created_at DESC | - |
| idx_payment_history_transaction_type | B-TREE | transaction_type | - |
| idx_payment_history_user_date | B-TREE | user_id, created_at DESC | - |

---

### Table: `transaction_ledger` (V10)
**Purpose:** Double-entry ledger for financial accounting

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| account_type | VARCHAR(50) | NULL | - | - |
| account_id | VARCHAR(255) | NULL | - | - |
| debit_cents | BIGINT | NOT NULL | 0 | CHECK: >= 0 (stored in cents) |
| credit_cents | BIGINT | NOT NULL | 0 | CHECK: >= 0 (stored in cents) |
| balance_cents | BIGINT | NULL | - | - (stored in cents) |
| currency | VARCHAR(3) | NOT NULL | 'USD' | - |
| transaction_id | VARCHAR(255) | NULL | - | - |
| reference_id | VARCHAR(255) | NULL | - | - |
| description | TEXT | NULL | - | - |
| remarks | TEXT | NULL | - | - |
| status | VARCHAR(50) | NULL | - | - |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_transaction_ledger_account_id | B-TREE | account_id | - |
| idx_transaction_ledger_created_at | B-TREE | created_at DESC | - |
| idx_transaction_ledger_transaction_id | B-TREE | transaction_id | WHERE transaction_id IS NOT NULL |
| idx_transaction_ledger_account_date | B-TREE | account_id, created_at DESC | - |

---

### Table: `invoices` (V11)
**Purpose:** Invoice records for payments and transactions

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| project_id | BIGINT | NOT NULL | - | FK → projects(id) ON DELETE CASCADE |
| contract_id | BIGINT | NULL | - | FK → contracts(id) ON DELETE SET NULL |
| milestone_id | BIGINT | NULL | - | - |
| company_id | BIGINT | NOT NULL | - | FK → companies(id) ON DELETE CASCADE |
| freelancer_id | BIGINT | NOT NULL | - | FK → freelancers(id) ON DELETE CASCADE |
| payment_id | BIGINT | NULL | - | - |
| invoice_number | VARCHAR(50) | NOT NULL | - | UNIQUE (auto-generated: INV-YYYYMM-######) |
| invoice_type | VARCHAR(30) | NOT NULL | - | CHECK: IN ('PAYMENT', 'MILESTONE', 'REFUND', 'PAYOUT') |
| invoice_date | TIMESTAMP(6) | NOT NULL | - | - |
| due_date | TIMESTAMP(6) | NULL | - | CHECK: >= invoice_date |
| paid_at | TIMESTAMP(6) | NULL | - | - |
| subtotal_cents | BIGINT | NOT NULL | - | CHECK: >= 0 (stored in cents) |
| tax_amount_cents | BIGINT | NOT NULL | 0 | CHECK: >= 0 (stored in cents) |
| platform_fee_cents | BIGINT | NOT NULL | 0 | CHECK: >= 0 (stored in cents) |
| total_cents | BIGINT | NOT NULL | - | CHECK: = subtotal_cents + tax_amount_cents + platform_fee_cents (stored in cents) |
| currency | VARCHAR(3) | NOT NULL | 'USD' | - |
| line_items | **JSONB** | NOT NULL | '[]'::jsonb | **Format:** [{"description": "Web development", "quantity": 1, "unit_price_cents": 500000, "total_cents": 500000}] |
| company_billing_info | **JSONB** | NULL | - | - |
| freelancer_billing_info | **JSONB** | NULL | - | - |
| notes | TEXT | NULL | - | - |
| pdf_url | TEXT | NULL | - | - |
| status | VARCHAR(30) | NOT NULL | 'DRAFT' | CHECK: IN ('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED') |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| updated_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |

#### Sequences
- `invoice_number_seq` - Starts at 1000, used for auto-generating invoice numbers

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_invoices_project_id | B-TREE | project_id | - |
| idx_invoices_contract_id | B-TREE | contract_id | WHERE contract_id IS NOT NULL |
| idx_invoices_milestone_id | B-TREE | milestone_id | WHERE milestone_id IS NOT NULL |
| idx_invoices_company_id | B-TREE | company_id | - |
| idx_invoices_freelancer_id | B-TREE | freelancer_id | - |
| idx_invoices_payment_id | B-TREE | payment_id | WHERE payment_id IS NOT NULL |
| idx_invoices_created_at | B-TREE | created_at DESC | - |
| idx_invoices_unpaid | B-TREE | due_date, company_id | WHERE status IN ('SENT', 'OVERDUE') |
| idx_invoices_overdue | B-TREE | due_date, company_id | WHERE status = 'OVERDUE' |
| idx_invoices_date_range | B-TREE | invoice_date, status | - |
| idx_invoices_line_items_gin | **GIN** | line_items | **JSONB INDEX** |

#### Triggers
- `invoices_updated_at` - Auto-update `updated_at` on UPDATE
- `invoices_generate_number` - Auto-generate invoice_number on INSERT

#### Functions
- `generate_invoice_number()` - Auto-generates invoice number in format INV-YYYYMM-######

---

### Table: `milestones` (V11)
**Purpose:** Project milestones with deliverables and payment

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| project_id | BIGINT | NOT NULL | - | FK → projects(id) ON DELETE CASCADE |
| contract_id | BIGINT | NULL | - | FK → contracts(id) ON DELETE SET NULL |
| title | VARCHAR(255) | NOT NULL | - | - |
| description | TEXT | NULL | - | - |
| deliverables | **JSONB** | NOT NULL | '[]'::jsonb | **Format:** [{"description": "Login page", "completed": false, "approved": false}] |
| amount_cents | BIGINT | NOT NULL | - | CHECK: > 0 (stored in cents) |
| currency | VARCHAR(3) | NOT NULL | 'USD' | - |
| due_date | DATE | NOT NULL | - | CHECK: >= start_date |
| start_date | DATE | NULL | - | - |
| completed_at | TIMESTAMP(6) | NULL | - | - |
| status | VARCHAR(50) | NOT NULL | 'PENDING' | CHECK: IN ('PENDING', 'IN_PROGRESS', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED') |
| order_number | INTEGER | NOT NULL | - | CHECK: > 0 |
| company_notes | TEXT | NULL | - | - |
| freelancer_notes | TEXT | NULL | - | - |
| approval_date | TIMESTAMP(6) | NULL | - | - |
| rejection_reason | TEXT | NULL | - | - |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| updated_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_milestones_project_id | B-TREE | project_id | - |
| idx_milestones_contract_id | B-TREE | contract_id | WHERE contract_id IS NOT NULL |
| idx_milestones_status | B-TREE | status | - |
| idx_milestones_due_date | B-TREE | due_date | - |
| idx_milestones_created_at | B-TREE | created_at DESC | - |
| idx_milestones_project_order | B-TREE | project_id, order_number | - |
| idx_milestones_pending | B-TREE | project_id, created_at DESC | WHERE status = 'SUBMITTED' |
| idx_milestones_deliverables_gin | **GIN** | deliverables | **JSONB INDEX** |

#### Triggers
- `milestones_updated_at` - Auto-update `updated_at` on UPDATE
- `milestones_approval_date` - Auto-set approval_date and completed_at when status = 'APPROVED'

#### Functions
- `set_milestone_approval_date()` - Sets approval_date and completed_at when milestone approved

---

## Communication Tables

### Table: `message_threads` (V12)
**Purpose:** Conversation threads between two users

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| user_id_1 | BIGINT | NOT NULL | - | FK → users(id) ON DELETE CASCADE, CHECK: < user_id_2 |
| user_id_2 | BIGINT | NOT NULL | - | FK → users(id) ON DELETE CASCADE, CHECK: > user_id_1 |
| project_id | BIGINT | NULL | - | FK → projects(id) ON DELETE SET NULL |
| job_id | BIGINT | NULL | - | FK → jobs(id) ON DELETE SET NULL |
| contract_id | BIGINT | NULL | - | FK → contracts(id) ON DELETE SET NULL |
| subject | VARCHAR(255) | NULL | - | - |
| is_archived | BOOLEAN | NULL | FALSE | - |
| unread_count_user1 | INTEGER | NOT NULL | 0 | CHECK: >= 0 |
| unread_count_user2 | INTEGER | NOT NULL | 0 | CHECK: >= 0 |
| last_message_at | TIMESTAMP(6) | NULL | - | - |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| updated_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| deleted_at | TIMESTAMP(6) | NULL | - | **SOFT DELETE** |

#### Constraints
- UNIQUE(user_id_1, user_id_2, project_id, job_id, contract_id)

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_message_threads_user_id_1 | B-TREE | user_id_1 | WHERE deleted_at IS NULL |
| idx_message_threads_user_id_2 | B-TREE | user_id_2 | WHERE deleted_at IS NULL |
| idx_message_threads_project_id | B-TREE | project_id | WHERE project_id IS NOT NULL |
| idx_message_threads_job_id | B-TREE | job_id | WHERE job_id IS NOT NULL |
| idx_message_threads_contract_id | B-TREE | contract_id | WHERE contract_id IS NOT NULL |
| idx_message_threads_last_message_at | B-TREE | last_message_at DESC | WHERE deleted_at IS NULL |
| idx_message_threads_unread_user1 | B-TREE | user_id_1, last_message_at DESC | WHERE unread_count_user1 > 0 AND deleted_at IS NULL |
| idx_message_threads_unread_user2 | B-TREE | user_id_2, last_message_at DESC | WHERE unread_count_user2 > 0 AND deleted_at IS NULL |
| idx_message_threads_active | B-TREE | last_message_at DESC | WHERE is_archived = FALSE AND deleted_at IS NULL |

#### Triggers
- `message_threads_updated_at` - Auto-update `updated_at` on UPDATE

---

### Table: `messages` (V12)
**Purpose:** Individual messages within a thread

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| thread_id | BIGINT | NOT NULL | - | FK → message_threads(id) ON DELETE CASCADE |
| sender_id | BIGINT | NOT NULL | - | FK → users(id) ON DELETE CASCADE |
| body | TEXT | NOT NULL | - | - |
| attachments | TEXT[] | NULL | '{}' | Simple array of attachment URLs |
| is_read | BOOLEAN | NULL | FALSE | - |
| read_at | TIMESTAMP(6) | NULL | - | - |
| edited_at | TIMESTAMP(6) | NULL | - | - |
| edit_count | INTEGER | NOT NULL | 0 | CHECK: >= 0 |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| updated_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| deleted_at | TIMESTAMP(6) | NULL | - | **SOFT DELETE** |

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_messages_thread_id | B-TREE | thread_id | WHERE deleted_at IS NULL |
| idx_messages_sender_id | B-TREE | sender_id | - |
| idx_messages_created_at | B-TREE | created_at DESC | - |
| idx_messages_thread_created | B-TREE | thread_id, created_at DESC | WHERE deleted_at IS NULL |
| idx_messages_unread | B-TREE | thread_id, created_at DESC | WHERE is_read = FALSE AND deleted_at IS NULL |
| idx_messages_search | GIN | to_tsvector('english', body) | WHERE deleted_at IS NULL |

#### Triggers
- `messages_updated_at` - Auto-update `updated_at` on UPDATE
- `trg_update_thread_last_message` - Update thread last_message_at on INSERT
- `trg_increment_unread_count` - Increment appropriate unread_count on INSERT

#### Functions
- `update_thread_last_message()` - Updates last_message_at in message_threads
- `increment_unread_count()` - Increments unread counter for recipient user

---

## Notification & Review Tables

### Table: `notifications` (V13)
**Purpose:** User notifications for various platform events and activities

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| user_id | BIGINT | NOT NULL | - | FK → users(id) ON DELETE CASCADE |
| type | VARCHAR(100) | NOT NULL | - | - |
| title | VARCHAR(255) | NOT NULL | - | - |
| message | TEXT | NULL | - | - |
| related_entity_type | VARCHAR(50) | NULL | - | - |
| related_entity_id | BIGINT | NULL | - | - |
| action_url | TEXT | NULL | - | - |
| is_read | BOOLEAN | NULL | FALSE | - |
| read_at | TIMESTAMP(6) | NULL | - | - |
| is_archived | BOOLEAN | NULL | FALSE | - |
| notification_channel | VARCHAR(50) | NULL | - | - |
| priority | VARCHAR(20) | NULL | - | - |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| deleted_at | TIMESTAMP(6) | NULL | - | **SOFT DELETE** |

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_notifications_user_id | B-TREE | user_id | WHERE deleted_at IS NULL |
| idx_notifications_type | B-TREE | type | - |
| idx_notifications_created_at | B-TREE | created_at DESC | WHERE deleted_at IS NULL |
| idx_notifications_unread | B-TREE | user_id, created_at DESC | WHERE is_read = FALSE AND deleted_at IS NULL |
| idx_notifications_priority | B-TREE | user_id, priority, created_at DESC | WHERE is_read = FALSE AND priority IN ('HIGH', 'URGENT') AND deleted_at IS NULL |
| idx_notifications_related_entity | B-TREE | related_entity_type, related_entity_id | WHERE related_entity_type IS NOT NULL |

---

### Table: `reviews` (V13)
**Purpose:** User ratings and reviews for completed work and collaborations

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| reviewer_id | BIGINT | NOT NULL | - | FK → users(id) ON DELETE CASCADE |
| reviewed_user_id | BIGINT | NOT NULL | - | FK → users(id) ON DELETE CASCADE, CHECK: != reviewer_id |
| contract_id | BIGINT | NULL | - | FK → contracts(id) ON DELETE SET NULL, UNIQUE(contract_id, reviewer_id) |
| project_id | BIGINT | NULL | - | FK → projects(id) ON DELETE SET NULL |
| rating | NUMERIC(3,2) | NOT NULL | - | CHECK: >= 0 AND <= 5 |
| title | VARCHAR(255) | NULL | - | - |
| comment | TEXT | NULL | - | - |
| categories | **JSONB** | NULL | '{}'::jsonb | **Format:** {"communication": 5.0, "quality": 4.5, "timeliness": 4.0, "professionalism": 5.0} |
| status | VARCHAR(50) | NOT NULL | 'PUBLISHED' | CHECK: IN ('DRAFT', 'PUBLISHED', 'FLAGGED', 'REMOVED') |
| is_verified_purchase | BOOLEAN | NULL | FALSE | - |
| helpful_count | INTEGER | NOT NULL | 0 | CHECK: >= 0 |
| unhelpful_count | INTEGER | NOT NULL | 0 | CHECK: >= 0 |
| response_comment | TEXT | NULL | - | - |
| response_at | TIMESTAMP(6) | NULL | - | - |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| updated_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_reviews_reviewer_id | B-TREE | reviewer_id | - |
| idx_reviews_reviewed_user_id | B-TREE | reviewed_user_id | - |
| idx_reviews_contract_id | B-TREE | contract_id | WHERE contract_id IS NOT NULL |
| idx_reviews_project_id | B-TREE | project_id | WHERE project_id IS NOT NULL |
| idx_reviews_created_at | B-TREE | created_at DESC | - |
| idx_reviews_published | B-TREE | reviewed_user_id, rating DESC, created_at DESC | WHERE status = 'PUBLISHED' |
| idx_reviews_verified | B-TREE | reviewed_user_id, created_at DESC | WHERE is_verified_purchase = TRUE AND status = 'PUBLISHED' |
| idx_reviews_rating | B-TREE | rating DESC | WHERE status = 'PUBLISHED' |
| idx_reviews_categories_gin | **GIN** | categories | **JSONB INDEX** |
| idx_reviews_search | GIN | to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(comment, '')) | WHERE status = 'PUBLISHED' |

#### Triggers
- `reviews_updated_at` - Auto-update `updated_at` on UPDATE
- `trg_update_user_rating_stats` - Update user rating_avg and rating_count on INSERT/UPDATE/DELETE

#### Functions
- `update_user_rating_stats()` - Updates rating_avg and rating_count in users table

---

## Portfolio & Time Tracking Tables

### Table: `portfolio_items` (V14)
**Purpose:** Freelancer portfolio showcasing past work

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| user_id | BIGINT | NOT NULL | - | FK → freelancers(id) ON DELETE CASCADE |
| title | VARCHAR(255) | NOT NULL | - | - |
| description | TEXT | NULL | - | - |
| image_url | TEXT | NULL | - | - |
| thumbnail_url | TEXT | NULL | - | - |
| images | **JSONB** | NOT NULL | '[]'::jsonb | **Format:** [{"url": "https://...", "caption": "Screenshot 1", "order": 1}] |
| project_url | TEXT | NULL | - | - |
| github_url | TEXT | NULL | - | - |
| live_url | TEXT | NULL | - | - |
| source_url | TEXT | NULL | - | - |
| skills_demonstrated | **JSONB** | NOT NULL | '[]'::jsonb | **Format:** ["React", "Node.js", "PostgreSQL"] |
| tools_used | **JSONB** | NOT NULL | '[]'::jsonb | - |
| technologies | **JSONB** | NOT NULL | '[]'::jsonb | - |
| project_category | VARCHAR(100) | NULL | - | - |
| start_date | DATE | NULL | - | - |
| end_date | DATE | NULL | - | CHECK: >= start_date |
| display_order | INTEGER | NOT NULL | 0 | CHECK: >= 0 |
| highlight_order | INTEGER | NULL | - | - |
| is_visible | BOOLEAN | NOT NULL | TRUE | - |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| updated_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| deleted_at | TIMESTAMP(6) | NULL | - | **SOFT DELETE** |

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_portfolio_user_id | B-TREE | user_id | WHERE deleted_at IS NULL |
| idx_portfolio_category | B-TREE | project_category | WHERE project_category IS NOT NULL AND deleted_at IS NULL |
| idx_portfolio_created_at | B-TREE | created_at DESC | WHERE deleted_at IS NULL |
| idx_portfolio_visible | B-TREE | user_id, is_visible, display_order | WHERE is_visible = TRUE AND deleted_at IS NULL |
| idx_portfolio_featured | B-TREE | user_id, highlight_order | WHERE highlight_order IS NOT NULL AND is_visible = TRUE AND deleted_at IS NULL |
| idx_portfolio_skills_gin | **GIN** | skills_demonstrated | **JSONB INDEX** |
| idx_portfolio_tools_gin | **GIN** | tools_used | **JSONB INDEX** |
| idx_portfolio_tech_gin | **GIN** | technologies | **JSONB INDEX** |
| idx_portfolio_search | GIN | to_tsvector('english', title || ' ' || COALESCE(description, '')) | WHERE deleted_at IS NULL |

#### Triggers
- `portfolio_items_updated_at` - Auto-update `updated_at` on UPDATE

---

### Table: `time_entries` (V14)
**Purpose:** Hourly time tracking with approval workflow

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| contract_id | BIGINT | NOT NULL | - | FK → contracts(id) ON DELETE CASCADE |
| freelancer_id | BIGINT | NOT NULL | - | FK → freelancers(id) ON DELETE CASCADE |
| date | DATE | NOT NULL | - | - |
| start_time | TIME | NULL | - | - |
| end_time | TIME | NULL | - | CHECK: > start_time |
| hours_logged | NUMERIC(5,2) | NOT NULL | - | CHECK: > 0 AND <= 24 |
| description | TEXT | NULL | - | - |
| task_description | TEXT | NULL | - | - |
| work_diary | **JSONB** | NOT NULL | '{}'::jsonb | **Format:** {"tasks": [{"task": "Implemented login", "hours": 3.5, "completed": true}], "notes": "..."} |
| screenshot_urls | **JSONB** | NOT NULL | '[]'::jsonb | **Format:** [{"url": "https://...", "timestamp": "2024-01-15T10:30:00Z"}] |
| file_attachments | **JSONB** | NOT NULL | '[]'::jsonb | **Format:** [{"filename": "report.pdf", "url": "https://...", "size": 12345}] |
| status | VARCHAR(50) | NOT NULL | 'DRAFT' | CHECK: IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED') |
| approved_by | BIGINT | NULL | - | FK → users(id) ON DELETE SET NULL |
| rejection_reason | TEXT | NULL | - | - |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| updated_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| approved_at | TIMESTAMP(6) | NULL | - | - |

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_time_contract_id | B-TREE | contract_id | - |
| idx_time_freelancer_id | B-TREE | freelancer_id | - |
| idx_time_date_desc | B-TREE | date DESC | - |
| idx_time_created_at | B-TREE | created_at DESC | - |
| idx_time_status | B-TREE | contract_id, status | - |
| idx_time_pending | B-TREE | contract_id, created_at DESC | WHERE status = 'SUBMITTED' |
| idx_time_contract_date | B-TREE | contract_id, date DESC, status | - |
| idx_time_freelancer_date | B-TREE | freelancer_id, date DESC, status | - |
| idx_time_approved_hours | B-TREE | contract_id, date, hours_logged | WHERE status = 'APPROVED' |
| idx_time_work_diary_gin | **GIN** | work_diary | **JSONB INDEX** |
| idx_time_screenshots_gin | **GIN** | screenshot_urls | **JSONB INDEX** |
| idx_time_attachments_gin | **GIN** | file_attachments | **JSONB INDEX** |

#### Triggers
- `time_entries_updated_at` - Auto-update `updated_at` on UPDATE
- `time_approval_timestamp` - Set approved_at when status = 'APPROVED'

#### Functions
- `set_time_approval_timestamp()` - Sets approved_at timestamp when time entry approved

---

### Materialized View: `contract_time_summary` (V14)
**Purpose:** Performance optimization for contract time summaries

#### Columns

| Column | Type | Description |
|--------|------|-------------|
| contract_id | BIGINT | Foreign key to contracts |
| total_entries | BIGINT | Count of all time entries |
| approved_hours | NUMERIC | Sum of approved hours |
| pending_hours | NUMERIC | Sum of submitted/pending hours |
| rejected_hours | NUMERIC | Sum of rejected hours |
| last_entry_date | DATE | Most recent time entry date |
| first_entry_date | DATE | Earliest time entry date |

#### Indexes

| Index Name | Type | Columns |
|------------|------|---------|
| idx_contract_time_summary | UNIQUE | contract_id |

#### Functions
- `refresh_contract_time_summary()` - Refreshes the materialized view concurrently

---

## Support & Audit Tables

### Table: `audit_logs` (V15)
**Purpose:** Complete audit trail of all system actions for compliance and debugging

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| user_id | BIGINT | NULL | - | FK → users(id) ON DELETE SET NULL |
| action | VARCHAR(100) | NOT NULL | - | - |
| entity_type | VARCHAR(100) | NOT NULL | - | - |
| entity_id | BIGINT | NULL | - | - |
| old_values | **JSONB** | NULL | - | - |
| new_values | **JSONB** | NULL | - | - |
| changes | **JSONB** | NULL | - | - |
| ip_address | VARCHAR(45) | NULL | - | - |
| user_agent | TEXT | NULL | - | - |
| request_id | VARCHAR(255) | NULL | - | - |
| endpoint | VARCHAR(500) | NULL | - | - |
| http_method | VARCHAR(10) | NULL | - | - |
| status_code | INTEGER | NULL | - | - |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_audit_logs_user_id | B-TREE | user_id | WHERE user_id IS NOT NULL |
| idx_audit_logs_entity | B-TREE | entity_type, entity_id | - |
| idx_audit_logs_action | B-TREE | action | - |
| idx_audit_logs_created_at | B-TREE | created_at DESC | - |
| idx_audit_logs_user_action | B-TREE | user_id, action, created_at DESC | WHERE user_id IS NOT NULL |
| idx_audit_logs_changes_gin | **GIN** | changes | **JSONB INDEX** |
| idx_audit_logs_old_values_gin | **GIN** | old_values | **JSONB INDEX** |
| idx_audit_logs_new_values_gin | **GIN** | new_values | **JSONB INDEX** |

---

### Table: `support_tickets` (V15)
**Purpose:** Customer support ticket management system

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| ticket_number | VARCHAR(50) | NOT NULL | - | UNIQUE (auto-generated: TKT-YYYYMMDD-#####) |
| title | VARCHAR(255) | NOT NULL | - | - |
| description | TEXT | NOT NULL | - | - |
| reported_by | BIGINT | NOT NULL | - | FK → users(id) ON DELETE CASCADE |
| assigned_to | BIGINT | NULL | - | FK → users(id) ON DELETE SET NULL |
| category | VARCHAR(100) | NOT NULL | - | - |
| priority | VARCHAR(20) | NOT NULL | 'MEDIUM' | CHECK: IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT') |
| status | VARCHAR(50) | NOT NULL | 'OPEN' | CHECK: IN ('OPEN', 'IN_PROGRESS', 'WAITING_USER', 'RESOLVED', 'CLOSED', 'REOPENED') |
| related_entity_type | VARCHAR(100) | NULL | - | - |
| related_entity_id | BIGINT | NULL | - | - |
| resolution_notes | TEXT | NULL | - | - |
| resolution_time | TIMESTAMP(6) | NULL | - | - |
| feedback_rating | INTEGER | NULL | - | CHECK: >= 1 AND <= 5 |
| feedback_comment | TEXT | NULL | - | - |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| updated_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| closed_at | TIMESTAMP(6) | NULL | - | - |

#### Sequences
- `ticket_number_seq` - Starts at 1000, used for auto-generating ticket numbers

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_support_tickets_reported_by | B-TREE | reported_by | - |
| idx_support_tickets_assigned_to | B-TREE | assigned_to | WHERE assigned_to IS NOT NULL |
| idx_support_tickets_status | B-TREE | status | - |
| idx_support_tickets_category | B-TREE | category | - |
| idx_support_tickets_priority | B-TREE | priority | - |
| idx_support_tickets_created_at | B-TREE | created_at DESC | - |
| idx_support_tickets_open | B-TREE | priority, created_at | WHERE status IN ('OPEN', 'IN_PROGRESS') |
| idx_support_tickets_assigned_status | B-TREE | assigned_to, status, created_at DESC | WHERE assigned_to IS NOT NULL |
| idx_support_tickets_related | B-TREE | related_entity_type, related_entity_id | WHERE related_entity_type IS NOT NULL |
| idx_support_tickets_search | GIN | to_tsvector('english', title || ' ' || description) | - |

#### Triggers
- `support_tickets_updated_at` - Auto-update `updated_at` on UPDATE
- `support_tickets_generate_number` - Auto-generate ticket_number on INSERT

#### Functions
- `generate_ticket_number()` - Auto-generates ticket number in format TKT-YYYYMMDD-#####

---

### Table: `support_ticket_replies` (V15)
**Purpose:** Replies and updates to support tickets

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| ticket_id | BIGINT | NOT NULL | - | FK → support_tickets(id) ON DELETE CASCADE |
| author_id | BIGINT | NOT NULL | - | FK → users(id) ON DELETE CASCADE |
| message | TEXT | NOT NULL | - | - |
| attachments | **JSONB** | NULL | '[]'::jsonb | **Format:** [{"filename": "...", "url": "...", "size": 12345}] |
| is_internal | BOOLEAN | NULL | FALSE | - |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| updated_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_support_ticket_replies_ticket_id | B-TREE | ticket_id | - |
| idx_support_ticket_replies_author_id | B-TREE | author_id | - |
| idx_support_ticket_replies_created_at | B-TREE | created_at DESC | - |
| idx_support_ticket_replies_external | B-TREE | ticket_id, created_at | WHERE is_internal = FALSE |
| idx_support_ticket_replies_attachments_gin | **GIN** | attachments | **JSONB INDEX** |

#### Triggers
- `support_ticket_replies_updated_at` - Auto-update `updated_at` on UPDATE

---

### Table: `user_preferences` (V15)
**Purpose:** User notification and preference settings

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| user_id | BIGINT | NOT NULL | - | UNIQUE, FK → users(id) ON DELETE CASCADE |
| email_notifications | BOOLEAN | NULL | TRUE | - |
| email_weekly_digest | BOOLEAN | NULL | TRUE | - |
| email_marketing | BOOLEAN | NULL | TRUE | - |
| notify_project_updates | BOOLEAN | NULL | TRUE | - |
| notify_job_updates | BOOLEAN | NULL | TRUE | - |
| notify_proposal_updates | BOOLEAN | NULL | TRUE | - |
| notify_contract_updates | BOOLEAN | NULL | TRUE | - |
| notify_message_received | BOOLEAN | NULL | TRUE | - |
| notify_payment_received | BOOLEAN | NULL | TRUE | - |
| notify_rating_received | BOOLEAN | NULL | TRUE | - |
| show_profile_to_public | BOOLEAN | NULL | TRUE | - |
| show_contact_info | BOOLEAN | NULL | FALSE | - |
| show_earnings_history | BOOLEAN | NULL | FALSE | - |
| language | VARCHAR(10) | NULL | 'en' | - |
| timezone | VARCHAR(50) | NULL | 'UTC' | - |
| theme | VARCHAR(20) | NULL | 'light' | CHECK: IN ('light', 'dark', 'auto') |
| currency | VARCHAR(3) | NULL | 'USD' | - |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| updated_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |

#### Indexes

| Index Name | Type | Columns |
|------------|------|---------|
| idx_user_preferences_user_id | B-TREE | user_id |

#### Triggers
- `user_preferences_updated_at` - Auto-update `updated_at` on UPDATE

---

### Table: `blocklist` (V15)
**Purpose:** User blocklist - users who have blocked other users

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| blocker_id | BIGINT | NOT NULL | - | FK → users(id) ON DELETE CASCADE, CHECK: != blocked_user_id |
| blocked_user_id | BIGINT | NOT NULL | - | FK → users(id) ON DELETE CASCADE, CHECK: != blocker_id |
| reason | VARCHAR(255) | NULL | - | - |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |

#### Constraints
- UNIQUE(blocker_id, blocked_user_id)

#### Indexes

| Index Name | Type | Columns |
|------------|------|---------|
| idx_blocklist_blocker_id | B-TREE | blocker_id |
| idx_blocklist_blocked_user_id | B-TREE | blocked_user_id |

---

### Table: `reported_content` (V15)
**Purpose:** Content reports and moderation queue

#### Columns

| Column | Type | Nullable | Default | Constraints |
|--------|------|----------|---------|-------------|
| id | BIGSERIAL | NOT NULL | AUTO | PRIMARY KEY |
| reported_by | BIGINT | NOT NULL | - | FK → users(id) ON DELETE CASCADE |
| report_reason | VARCHAR(100) | NOT NULL | - | - |
| description | TEXT | NULL | - | - |
| content_type | VARCHAR(100) | NOT NULL | - | - |
| content_id | BIGINT | NOT NULL | - | - |
| reported_user_id | BIGINT | NULL | - | FK → users(id) ON DELETE CASCADE |
| status | VARCHAR(50) | NOT NULL | 'PENDING' | CHECK: IN ('PENDING', 'REVIEWING', 'RESOLVED', 'DISMISSED') |
| resolution_notes | TEXT | NULL | - | - |
| action_taken | VARCHAR(100) | NULL | - | - |
| created_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| updated_at | TIMESTAMP(6) | NOT NULL | CURRENT_TIMESTAMP | - |
| resolved_at | TIMESTAMP(6) | NULL | - | - |

#### Indexes

| Index Name | Type | Columns | Condition |
|------------|------|---------|-----------|
| idx_reported_content_reported_by | B-TREE | reported_by | - |
| idx_reported_content_reported_user | B-TREE | reported_user_id | WHERE reported_user_id IS NOT NULL |
| idx_reported_content_content | B-TREE | content_type, content_id | - |
| idx_reported_content_status | B-TREE | status | - |
| idx_reported_content_created_at | B-TREE | created_at DESC | - |
| idx_reported_content_pending | B-TREE | created_at | WHERE status = 'PENDING' |

#### Triggers
- `reported_content_updated_at` - Auto-update `updated_at` on UPDATE

---

## Schema Summary

### Total Database Objects

| Object Type | Count |
|-------------|-------|
| **Tables** | 29 |
| **Materialized Views** | 1 |
| **Sequences** | 3 (invoice_number_seq, ticket_number_seq, plus BIGSERIAL sequences) |
| **Functions** | 16 |
| **Triggers** | 35+ |
| **Extensions** | 2 (pg_trgm, btree_gin) |

### Tables by Category

| Category | Tables | Count |
|----------|--------|-------|
| **Core User Management** | users, companies, freelancers | 3 |
| **Reference/Lookup** | experience_levels, job_categories, project_categories | 3 |
| **Jobs** | jobs, job_applications | 2 |
| **Projects** | projects, proposals | 2 |
| **Contracts & Payments** | contracts, escrow, payments, payouts, payment_history, transaction_ledger, invoices, milestones | 8 |
| **Communication** | message_threads, messages | 2 |
| **Social** | notifications, reviews | 2 |
| **Portfolio & Time** | portfolio_items, time_entries | 2 |
| **Support & Admin** | audit_logs, support_tickets, support_ticket_replies, user_preferences, blocklist, reported_content | 6 |

---

## JSONB Fields Reference

### Tables with JSONB Columns

| Table | Column | Format | Description |
|-------|--------|--------|-------------|
| **freelancers** | skills | [{"name": "React", "level": "expert", "years": 5}] | Freelancer skills with proficiency levels |
| **freelancers** | certifications | [{"name": "AWS Certified", "issuer": "Amazon", "year": 2023, "credential_id": "ABC123"}] | Professional certifications |
| **freelancers** | languages | [{"language": "English", "proficiency": "native"}] | Languages spoken with proficiency |
| **jobs** | benefits | [{"name": "Health Insurance", "description": "Full coverage"}] | Job benefits offered |
| **jobs** | perks | [...] | Job perks offered |
| **jobs** | required_skills | [{"skill": "Java", "required": true, "years": 3}] | Required skills for job |
| **jobs** | preferred_skills | [...] | Preferred skills for job |
| **jobs** | certifications | [...] | Required certifications |
| **job_applications** | answers | {"question1": "answer1", "question2": "answer2"} | Answers to application questions |
| **projects** | required_skills | [{"skill": "React", "level": "expert", "required": true, "years": 3}] | Required skills for project |
| **projects** | preferred_skills | [...] | Preferred skills for project |
| **projects** | screening_questions | [{"question": "What is your experience with React?", "required": true}] | Screening questions for applicants |
| **proposals** | answers | [{"question": "...", "answer": "..."}] | Answers to screening questions |
| **invoices** | line_items | [{"description": "Web development", "quantity": 1, "unit_price_cents": 500000, "total_cents": 500000}] | Invoice line items |
| **invoices** | company_billing_info | {...} | Company billing information |
| **invoices** | freelancer_billing_info | {...} | Freelancer billing information |
| **milestones** | deliverables | [{"description": "Login page", "completed": false, "approved": false}] | Milestone deliverables |
| **reviews** | categories | {"communication": 5.0, "quality": 4.5, "timeliness": 4.0} | Category-based ratings |
| **portfolio_items** | images | [{"url": "https://...", "caption": "Screenshot 1", "order": 1}] | Portfolio images |
| **portfolio_items** | skills_demonstrated | ["React", "Node.js", "PostgreSQL"] | Skills shown in portfolio item |
| **portfolio_items** | tools_used | [...] | Tools used in project |
| **portfolio_items** | technologies | [...] | Technologies used in project |
| **time_entries** | work_diary | {"tasks": [{"task": "Implemented login", "hours": 3.5, "completed": true}], "notes": "..."} | Detailed work breakdown |
| **time_entries** | screenshot_urls | [{"url": "...", "timestamp": "2024-01-15T10:30:00Z"}] | Proof of work screenshots |
| **time_entries** | file_attachments | [{"filename": "report.pdf", "url": "...", "size": 12345}] | Attached files for time entry |
| **audit_logs** | old_values | {...} | Previous values before change |
| **audit_logs** | new_values | {...} | New values after change |
| **audit_logs** | changes | {...} | Detailed change information |
| **support_ticket_replies** | attachments | [{"filename": "...", "url": "...", "size": 12345}] | Attached files to ticket reply |

### Total JSONB Fields: 29 columns across 13 tables

---

## Soft Delete Tables

Tables implementing soft delete pattern (with `deleted_at` column):

1. **users** - User accounts soft delete
2. **jobs** - Job postings soft delete
3. **job_applications** - Job applications soft delete
4. **projects** - Project postings soft delete
5. **message_threads** - Message threads soft delete
6. **messages** - Individual messages soft delete
7. **notifications** - Notifications soft delete
8. **portfolio_items** - Portfolio items soft delete

**Total: 8 tables with soft delete**

---

## Triggers & Functions

### Reusable Functions

1. **update_timestamp()** - Updates `updated_at` to CURRENT_TIMESTAMP (used by 20+ tables)

### Counter Management Functions

2. **prevent_negative_counters_jobs()** - Ensures jobs counters never go negative
3. **prevent_negative_counters_projects()** - Ensures projects counters never go negative
4. **increment_job_applications_count()** - Increments job applications_count
5. **decrement_job_applications_count()** - Decrements job applications_count on soft-delete
6. **increment_project_proposal_count()** - Increments project proposal_count
7. **decrement_project_proposal_count()** - Decrements project proposal_count

### Contract & Completion Functions

8. **get_user_active_contracts_count(user_id_param)** - Returns active contracts count
9. **can_user_create_contract(user_id_param, max_contracts)** - Checks contract creation eligibility
10. **calculate_user_completion_rate(user_id_param)** - Calculates completion rate percentage
11. **update_freelancer_completion_rate()** - Updates freelancer completion_rate on contract completion

### Invoice & Ticket Functions

12. **generate_invoice_number()** - Auto-generates invoice numbers (INV-YYYYMM-######)
13. **generate_ticket_number()** - Auto-generates ticket numbers (TKT-YYYYMMDD-#####)

### Milestone Functions

14. **set_milestone_approval_date()** - Sets approval_date and completed_at when approved

### Time Tracking Functions

15. **set_time_approval_timestamp()** - Sets approved_at when time entry approved
16. **refresh_contract_time_summary()** - Refreshes materialized view

### Messaging Functions

17. **update_thread_last_message()** - Updates last_message_at in message_threads
18. **increment_unread_count()** - Increments unread counter for recipient

### Review Functions

19. **update_user_rating_stats()** - Updates rating_avg and rating_count in users table

---

## Foreign Key Relationships

### Core Entity Relationships

```
users (1) ←→ (1) companies [user_id]
users (1) ←→ (1) freelancers [user_id]
users (1) ←→ (1) user_preferences [user_id]

companies (1) ←→ (*) jobs [company_id]
companies (1) ←→ (*) projects [company_id]
companies (1) ←→ (*) contracts [company_id]
companies (1) ←→ (*) invoices [company_id]
companies (1) ←→ (*) payments (as payer) [payer_id]

freelancers (1) ←→ (*) job_applications [applicant_id]
freelancers (1) ←→ (*) proposals [freelancer_id]
freelancers (1) ←→ (*) contracts [freelancer_id]
freelancers (1) ←→ (*) invoices [freelancer_id]
freelancers (1) ←→ (*) payments (as payee) [payee_id]
freelancers (1) ←→ (*) payouts [user_id]
freelancers (1) ←→ (*) portfolio_items [user_id]
freelancers (1) ←→ (*) time_entries [freelancer_id]
```

### Job Flow

```
job_categories (1) ←→ (*) jobs [category_id]
jobs (1) ←→ (*) job_applications [job_id]
jobs (1) ←→ (*) message_threads [job_id]
```

### Project Flow

```
project_categories (1) ←→ (*) projects [category_id]
projects (1) ←→ (*) proposals [project_id]
projects (1) ←→ (*) contracts [project_id]
projects (1) ←→ (*) escrow [project_id]
projects (1) ←→ (*) invoices [project_id]
projects (1) ←→ (*) milestones [project_id]
projects (1) ←→ (*) message_threads [project_id]
projects (1) ←→ (*) reviews [project_id]
```

### Contract Flow

```
proposals (1) ←→ (*) contracts [proposal_id]
contracts (1) ←→ (*) payments [contract_id]
contracts (1) ←→ (*) invoices [contract_id]
contracts (1) ←→ (*) milestones [contract_id]
contracts (1) ←→ (*) time_entries [contract_id]
contracts (1) ←→ (*) message_threads [contract_id]
contracts (1) ←→ (*) reviews [contract_id]
```

### Payment Flow

```
payments (1) ←→ (*) escrow [payment_id]
payments (1) ←→ (*) payment_history [payment_id]
payments (1) ←→ (*) invoices [payment_id]
```

### Communication & Social

```
users (1) ←→ (*) message_threads [user_id_1, user_id_2]
message_threads (1) ←→ (*) messages [thread_id]
users (1) ←→ (*) messages (as sender) [sender_id]
users (1) ←→ (*) notifications [user_id]
users (1) ←→ (*) reviews (as reviewer) [reviewer_id]
users (1) ←→ (*) reviews (as reviewed) [reviewed_user_id]
```

### Support & Audit

```
users (1) ←→ (*) support_tickets (as reporter) [reported_by]
users (1) ←→ (*) support_tickets (as assignee) [assigned_to]
support_tickets (1) ←→ (*) support_ticket_replies [ticket_id]
users (1) ←→ (*) support_ticket_replies [author_id]
users (1) ←→ (*) audit_logs [user_id]
users (1) ←→ (*) payment_history [user_id]
users (1) ←→ (*) blocklist (as blocker) [blocker_id]
users (1) ←→ (*) blocklist (as blocked) [blocked_user_id]
users (1) ←→ (*) reported_content (as reporter) [reported_by]
users (1) ←→ (*) reported_content (as reported user) [reported_user_id]
```

---

## Data Types Summary

### Monetary Values
**All monetary values stored in CENTS as BIGINT:**
- companies.total_spent_cents
- freelancers.hourly_rate_cents
- freelancers.total_earnings_cents
- jobs.salary_min_cents, salary_max_cents
- projects.budget_min_cents, budget_max_cents
- contracts.amount_cents
- escrow.amount_cents
- payments.amount_cents
- payouts.amount_cents
- payment_history.amount_cents, balance_before_cents, balance_after_cents
- transaction_ledger.debit_cents, credit_cents, balance_cents
- invoices.subtotal_cents, tax_amount_cents, platform_fee_cents, total_cents
- milestones.amount_cents

### Array Types
- TEXT[] used for simple lists: deliverables, attachments, portfolio_links, additional_documents
- JSONB used for structured arrays with metadata

### JSONB Usage
- 29 JSONB columns across 13 tables
- Used for: skills, certifications, languages, benefits, answers, line_items, deliverables, categories, work_diary, etc.

### Timestamp Precision
- All timestamps use TIMESTAMP(6) for microsecond precision

### Text Search
- Full-text search indexes (GIN) on 11 tables
- Uses `to_tsvector('english', ...)` for search functionality

---

## Index Strategy

### Index Types Used

1. **B-TREE Indexes:** Standard indexes for sorting and range queries
2. **GIN Indexes:** Used for JSONB columns and full-text search
3. **UNIQUE Indexes:** Enforce uniqueness constraints
4. **Partial Indexes:** Conditional indexes (e.g., WHERE deleted_at IS NULL)
5. **Composite Indexes:** Multi-column indexes for complex queries

### Optimization Techniques

- **Partial Indexes:** Applied WHERE clauses to reduce index size (e.g., active records only)
- **Soft Delete Awareness:** Most indexes exclude soft-deleted records
- **Status-Based Indexes:** Optimized for common status queries (OPEN, ACTIVE, PENDING)
- **Denormalized Counters:** rating_avg, rating_count, views_count, applications_count, proposal_count
- **Materialized View:** contract_time_summary for performance optimization

---

## Constraints Summary

### Check Constraints Categories

1. **Enum-like Constraints:** Status fields, types, categories (CHECK column IN (...))
2. **Range Constraints:** Ratings (0-5), percentages (0-100), hours (0-24)
3. **Date Logic:** end_date >= start_date, due_date >= invoice_date
4. **Amount Validation:** All _cents columns CHECK: > 0 or >= 0
5. **Counter Validation:** All count fields CHECK: >= 0
6. **User Logic:** reviewer_id != reviewed_user_id, blocker_id != blocked_user_id
7. **Approval Logic:** (status = 'APPROVED' AND approved_at IS NOT NULL)

### Unique Constraints

- Email and username (case-insensitive, active records only)
- Invoice numbers, ticket numbers
- User-entity relationships (user_id in companies/freelancers)
- Unique combinations: (contract_id, reviewer_id), (project_id, freelancer_id), (blocker_id, blocked_user_id)

### Foreign Key Actions

- **ON DELETE CASCADE:** Most parent-child relationships (removes children when parent deleted)
- **ON DELETE SET NULL:** Reference tables, optional relationships
- **No specific action:** Maintain referential integrity (prevent deletion if references exist)

---

## Database Statistics

### Estimated Row Capacity
- Designed for horizontal scaling with proper indexing
- Partitioning-ready structure for audit_logs and large transactional tables
- Materialized views for performance optimization

### Performance Considerations
- **GIN Indexes:** Fast JSONB queries and full-text search
- **Partial Indexes:** Reduced index size for frequently filtered columns
- **Denormalized Data:** rating_avg, rating_count, various counters for fast reads
- **Triggers:** Maintain data consistency automatically
- **Sequences:** Auto-generate unique identifiers (invoice numbers, ticket numbers)

---

**End of Complete Schema Analysis**
