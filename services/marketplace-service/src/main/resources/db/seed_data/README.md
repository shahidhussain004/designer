# Database Seed Data Loading Guide

## Overview
This directory contains professionally organized seed data for the Marketplace application. All seed files are designed to work with the production schema and follow proper foreign key dependencies.

## Author
**Senior DBA & Principal DB Architect**

## Seed File Execution Order

### Critical: Load in This Exact Sequence

| Order | File | Dependencies | Description | Record Count |
|-------|------|--------------|-------------|--------------|
| **1** | `01_reference_data.sql` | NONE | Experience levels, job categories, project categories | 25 |
| **2** | `02_users_companies_freelancers.sql` | NONE | Users, companies, freelancers profiles | 26 users (1 admin, 10 companies, 15 freelancers) |
| **3** | `03_jobs_and_projects.sql` | Companies, categories, experience levels | Traditional job postings and freelance projects | 35 (15 jobs + 20 projects) |
| **4** | `04_proposals_and_contracts.sql` | Projects, freelancers | Freelancer proposals and resulting contracts | 30 proposals, 15 contracts |
| **5** | `05_milestones_payments_invoices.sql` | Contracts | Milestones, payments, invoices, escrow, financial data | 75+ financial records |
| **6** | `06_reviews_portfolio_timetracking.sql` | Contracts, freelancers | Reviews, portfolio items, time entries, job applications | 110+ activity records |
| **7** | `07_messaging_and_notifications.sql` | Users, projects, contracts | Message threads, messages, notifications | 150+ communication records |
| **8** | `08_administrative_data.sql` | Users | Support tickets, audit logs, user preferences, blocklist | 120+ admin records |

## Loading Methods

### Method 1: PostgreSQL Command Line (Recommended)
```bash
# Set PostgreSQL connection
export PGPASSWORD='your_password'
export PGHOST='localhost'
export PGPORT='5432'
export PGDATABASE='marketplace_db'
export PGUSER='postgres'

# Load all seed files in order
psql -f 01_reference_data.sql
psql -f 02_users_companies_freelancers.sql
psql -f 03_jobs_and_projects.sql
psql -f 04_proposals_and_contracts.sql
psql -f 05_milestones_payments_invoices.sql
psql -f 06_reviews_portfolio_timetracking.sql
psql -f 07_messaging_and_notifications.sql
psql -f 08_administrative_data.sql
```

### Method 2: Single Command (Linux/Mac)
```bash
for file in 0*.sql; do 
    echo "Loading $file..."
    psql -f "$file"
done
```

### Method 3: PowerShell (Windows)
```powershell
$env:PGPASSWORD='your_password'
Get-ChildItem -Filter "0*.sql" | Sort-Object Name | ForEach-Object {
    Write-Host "Loading $($_.Name)..."
    psql -U postgres -d marketplace_db -f $_.FullName
}
```

### Method 4: Spring Boot Application Properties
Add to `application.yml`:
```yaml
spring:
  sql:
    init:
      mode: always
      data-locations:
        - classpath:db/seed_data/01_reference_data.sql
        - classpath:db/seed_data/02_users_companies_freelancers.sql
        - classpath:db/seed_data/03_jobs_and_projects.sql
        - classpath:db/seed_data/04_proposals_and_contracts.sql
        - classpath:db/seed_data/05_milestones_payments_invoices.sql
        - classpath:db/seed_data/06_reviews_portfolio_timetracking.sql
        - classpath:db/seed_data/07_messaging_and_notifications.sql
        - classpath:db/seed_data/08_administrative_data.sql
```

## Test Accounts

### Admin Account
- **Email:** admin@marketplace.com
- **Username:** admin
- **Password:** Password123!
- **Role:** ADMIN

### Company Accounts (10)
All use password: **Password123!**

| Username | Email | Company Name | Location |
|----------|-------|--------------|----------|
| techcorp | contact@techcorp.com | Tech Corporation | New York, NY |
| innovatelab | hr@innovatelab.com | Innovate Labs Inc. | San Francisco, CA |
| fintechsolutions | careers@fintech.com | FinTech Solutions LLC | New York, NY |
| cloudservices | contact@cloudservices.com | Cloud Services Ltd | San Francisco, CA |
| healthtechinc | talent@healthtech.com | HealthTech Inc. | Los Angeles, CA |
| ecommercehub | info@ecommhub.com | ECommerce Hub | Chicago, IL |
| designstudio | jobs@designstudio.com | Design Studio Creative | Chicago, IL |
| dataanalytics | team@dataanalytics.com | Data Analytics Corp | New York, NY |
| mobilefirstltd | hr@mobilefirst.com | Mobile First Ltd | Chicago, IL |
| gamestudiopro | jobs@gamestudio.com | Game Studio Pro | Los Angeles, CA |

### Freelancer Accounts (15)
All use password: **Password123!**

| Username | Email | Specialization | Hourly Rate |
|----------|-------|----------------|-------------|
| alice_dev | alice.johnson@email.com | Full-Stack (React, Node.js) | $150/hr |
| bob_python | bob.smith@email.com | Python/Django Backend | $150/hr |
| carol_java | carol.martinez@email.com | Java/Spring Boot | $150/hr |
| david_ios | david.lee@email.com | iOS Development | $120/hr |
| emma_android | emma.wilson@email.com | Android Development | $120/hr |
| frank_mobile | frank.garcia@email.com | React Native/Flutter | $120/hr |
| grace_designer | grace.chen@email.com | UI/UX Design | $100/hr |
| henry_graphic | henry.brown@email.com | Graphic Design | $100/hr |
| isabel_3d | isabel.rodriguez@email.com | 3D Design/Animation | $100/hr |
| jack_devops | jack.taylor@email.com | DevOps/AWS | $140/hr |
| karen_cloud | karen.anderson@email.com | Cloud Architect | $140/hr |
| luis_datascience | luis.hernandez@email.com | Machine Learning | $130/hr |
| maria_analytics | maria.kim@email.com | Business Intelligence | $130/hr |
| nancy_qa | nancy.jackson@email.com | QA Automation | $80/hr |
| oscar_test | oscar.white@email.com | Manual Testing | $80/hr |

## Data Coverage & Test Scenarios

### Core Entities
- ✅ 5 Experience Levels (Entry to Executive)
- ✅ 10 Job Categories (Software, Design, Marketing, etc.)
- ✅ 10 Project Categories (Web, Mobile, Design, etc.)
- ✅ 26 Users (1 admin, 10 companies, 15 freelancers)
- ✅ 10 Company Profiles (various industries and sizes)
- ✅ 15 Freelancer Profiles (diverse skills and experience)

### Work Postings
- ✅ 15 Job Postings (Full-time, Contract, Various levels)
- ✅ 20 Freelance Projects (Fixed price, Hourly, Milestone-based)
- ✅ Complete job details (skills, salary, benefits, requirements)
- ✅ Complete project details (budget, timeline, deliverables)

### Applications & Proposals
- ✅ 30 Proposals (Skill-matched to projects)
- ✅ 25 Job Applications (Skill-matched to jobs)
- ✅ Various proposal statuses (Submitted, Reviewing, Shortlisted, Accepted)
- ✅ Realistic cover letters and application data

### Contracts & Agreements
- ✅ 15 Contracts (Active, Pending, Completed)
- ✅ Proper contract types (Fixed Price, Hourly, Milestone-based)
- ✅ Payment schedules and terms
- ✅ Status progression tracking

### Financial Data
- ✅ 25 Milestones (Pending, In Progress, Approved)
- ✅ 20 Payments (Completed, Processing, Pending)
- ✅ 20 Invoices (with line items and calculations)
- ✅ 10 Escrow records (Held, Released)
- ✅ 30 Payment History entries (audit trail)
- ✅ Proper amount calculations (subtotal + tax + platform fee)

### Activity & Engagement
- ✅ 20 Reviews (4-5 star ratings with detailed feedback)
- ✅ 25 Portfolio Items (showcasing diverse work)
- ✅ 40 Time Entries (hourly tracking with work diaries)
- ✅ Realistic activity timestamps and patterns

### Communication
- ✅ 20 Message Threads (project discussions)
- ✅ 80 Messages (realistic conversations)
- ✅ 50 Notifications (various types and priorities)
- ✅ Unread counts and read status tracking

### Administrative
- ✅ 26 User Preferences (personalized settings)
- ✅ 15 Support Tickets (various categories and statuses)
- ✅ 30 Support Ticket Replies (ticket conversations)
- ✅ 50 Audit Logs (user activity tracking)
- ✅ 5 Blocklist entries (user blocking)

## Testing Scenarios Covered

### 1. Company Workflow
- Post jobs and projects ✅
- Receive proposals and applications ✅
- Review and shortlist candidates ✅
- Create contracts ✅
- Manage milestones and payments ✅
- Leave reviews ✅
- Message freelancers ✅

### 2. Freelancer Workflow
- Browse jobs and projects ✅
- Submit proposals and applications ✅
- Accept contracts ✅
- Track time and submit work ✅
- Receive payments ✅
- Build portfolio ✅
- Receive reviews ✅

### 3. Financial Workflows
- Payment processing ✅
- Escrow management ✅
- Invoice generation ✅
- Milestone-based payments ✅
- Hourly time tracking ✅
- Platform fee calculations ✅

### 4. Search & Discovery
- Search jobs by category and skills ✅
- Search projects by budget and experience ✅
- Filter freelancers by skills and rate ✅
- Browse by location and remote options ✅

### 5. Communication
- Direct messaging between users ✅
- Notifications for key events ✅
- Support ticket system ✅

## Data Quality Features

### ✅ Schema Compliance
- All inserts match V1-V15 migration schemas exactly
- Correct column names (e.g., `full_name` not `first_name`)
- Proper data types (BIGINT for cents, JSONB not JSON)
- Timestamp precision (TIMESTAMP(6))

### ✅ Referential Integrity
- All foreign keys properly referenced
- No orphaned records
- Cascade relationships respected
- Proper NULL handling

### ✅ Data Realism
- Realistic names, emails, and descriptions
- Proper timestamp sequences (created_at < updated_at)
- Logical status progressions
- Skill-matched proposals to projects
- Experience-appropriate hourly rates

### ✅ Idempotency
- All seed files use `ON CONFLICT DO NOTHING`
- Can be run multiple times safely
- No duplicate data insertion

## Verification Queries

After loading, verify data with these queries:

```sql
-- Verify record counts
SELECT 'users' AS table_name, COUNT(*) FROM users
UNION ALL SELECT 'companies', COUNT(*) FROM companies
UNION ALL SELECT 'freelancers', COUNT(*) FROM freelancers
UNION ALL SELECT 'jobs', COUNT(*) FROM jobs
UNION ALL SELECT 'projects', COUNT(*) FROM projects
UNION ALL SELECT 'proposals', COUNT(*) FROM proposals
UNION ALL SELECT 'contracts', COUNT(*) FROM contracts
UNION ALL SELECT 'payments', COUNT(*) FROM payments
UNION ALL SELECT 'reviews', COUNT(*) FROM reviews
UNION ALL SELECT 'messages', COUNT(*) FROM messages;

-- Verify foreign key relationships
SELECT 
    c.id, c.company_id, c.freelancer_id, c.project_id,
    co.company_name, u.full_name AS freelancer_name, p.title AS project_title
FROM contracts c
JOIN companies co ON c.company_id = co.id
JOIN freelancers f ON c.freelancer_id = f.id
JOIN users u ON f.user_id = u.id
JOIN projects p ON c.project_id = p.id
LIMIT 5;

-- Verify financial calculations
SELECT 
    i.id, i.invoice_number,
    i.subtotal_cents, i.tax_amount_cents, i.platform_fee_cents, i.total_cents,
    (i.subtotal_cents + i.tax_amount_cents + i.platform_fee_cents) AS calculated_total
FROM invoices i
WHERE i.total_cents != (i.subtotal_cents + i.tax_amount_cents + i.platform_fee_cents);
-- Should return 0 rows

-- Verify proposal-contract relationships
SELECT 
    p.id AS proposal_id, p.status AS proposal_status,
    c.id AS contract_id, c.status AS contract_status
FROM proposals p
LEFT JOIN contracts c ON c.proposal_id = p.id
WHERE p.status = 'ACCEPTED';
```

## Troubleshooting

### Issue: Foreign Key Violation
**Solution:** Ensure files are loaded in the exact order specified. Reference tables must be loaded before dependent tables.

### Issue: Duplicate Key Error
**Solution:** Drop and recreate the database, or manually delete existing seed data before reloading.

### Issue: Column Not Found
**Solution:** Verify migrations V1-V15 have been run successfully before loading seed data.

### Issue: Data Type Mismatch
**Solution:** Ensure using PostgreSQL 13+ with proper JSONB support.

## Cleanup (Reset to Clean State)

```sql
-- WARNING: This will delete all data!
TRUNCATE TABLE 
    payment_history, transaction_ledger, audit_logs, 
    support_ticket_replies, support_tickets, user_preferences,
    blocklist, notifications, messages, message_threads,
    time_entries, portfolio_items, reviews,
    invoices, milestones, escrow, payouts, payments,
    contracts, proposals, job_applications,
    projects, jobs,
    freelancers, companies, users,
    experience_levels, job_categories, project_categories
CASCADE;

-- Reset sequences
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE companies_id_seq RESTART WITH 1;
ALTER SEQUENCE freelancers_id_seq RESTART WITH 1;
-- ... (add others as needed)
```

## Performance Notes

- Total seed load time: ~5-10 seconds on standard hardware
- Approximately 600+ total records across all tables
- Indexes are automatically used during insertion
- No manual VACUUM needed (PostgreSQL autovacuum will handle)

## Future Enhancements

Potential additions for more comprehensive testing:
- [ ] More job categories and subcategories
- [ ] Additional payment methods and currency support
- [ ] Multi-language content examples
- [ ] More complex project milestone structures
- [ ] Advanced search test cases
- [ ] Dispute resolution scenarios
- [ ] Subscription/membership tiers

## Support

For issues or questions about seed data:
1. Check schema migrations are up-to-date (V1-V19)
2. Verify PostgreSQL version compatibility (13+)
3. Review error logs for specific constraint violations
4. Consult migration files for current schema structure

---

**Last Updated:** 2026-01-25  
**Version:** 1.0.0  
**Compatible with:** Migrations V1-V19
