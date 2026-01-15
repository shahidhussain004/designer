# Database Migrations - Marketplace Service (Clean Schema)

## Overview

This folder contains a complete set of clean, well-organized database migrations for the Marketplace Service.
The schema is designed from scratch based on the actual running database, following best practices in database design.

## Migration Order & Purpose

### V1-V2: Core Infrastructure
- **V1__create_core_users_table.sql**: Core users table supporting COMPANY, FREELANCER, and ADMIN roles
  - 80+ columns for complete user profile, verification, ratings, and metrics
  - 8 strategic indexes for common queries
  - Automatic updated_at trigger
  
- **V2__create_experience_levels_table.sql**: Reference table for job experience levels
  - 5 default levels: ENTRY, INTERMEDIATE, SENIOR, LEAD, EXECUTIVE
  - Used by jobs table for experience_level field

### V3-V5: Traditional Job Market
- **V3__create_job_categories_table.sql**: Job categories reference table
  - 10 default categories: Software Development, Design, Marketing, Sales, Data Science, etc.
  - Slug-based lookups for SEO-friendly URLs
  
- **V4__create_jobs_table.sql**: Traditional company job postings
  - Comprehensive 50+ column table for full job posting details
  - Support for remote work, salary ranges, benefits, requirements
  - Array fields for multi-valued data (skills[], perks[], benefits[])
  - 13 indexes for optimal query performance
  
- **V5__create_job_applications_table.sql**: Candidate applications for jobs
  - UNIQUE constraint on (job_id, applicant_id) to prevent duplicate applications
  - Auto-increment application counter on jobs table via triggers
  - JSON field for custom question answers
  - 5 indexes covering common query patterns

### V6-V8: Freelance Project Market
- **V6__create_project_categories_table.sql**: Project categories reference table
  - 10 default categories for freelance work types
  - Similar structure to job_categories for consistency
  
- **V7__create_projects_table.sql**: Freelance project postings by companies
  - 50+ columns for comprehensive project details
  - Budget tracking (min/max), timeline, visibility controls
  - Proposal counter auto-maintained via triggers
  - 11 indexes including full-text search on title/description
  
- **V8__create_proposals_table.sql**: Freelancer proposals for projects
  - UNIQUE constraint on (project_id, freelancer_id)
  - Company ratings and review comments stored
  - Auto-increment proposal counter on projects
  - Screening question answers in JSON format

### V9: Contract Management
- **V9__create_contracts_table.sql**: Formal agreements between parties
  - Support for FIXED_PRICE, HOURLY, and MILESTONE_BASED contracts
  - Payment schedule options: UPFRONT, ON_COMPLETION, MILESTONE_BASED, WEEKLY, MONTHLY
  - Completion tracking and status management
  - Helper functions for contract limits and completion rate calculation
  - Automatic user completion rate updates via triggers

### V10-V11: Financial System
- **V10__create_payment_tables.sql**: Multi-table financial system
  - **escrow**: Holds payments securely until job completion
  - **payments**: Individual transactions between users
  - **payouts**: Withdrawals of earnings by users
  - **payment_history**: Audit log of all transactions
  - **transaction_ledger**: Double-entry accounting for financial reconciliation
  - 20+ indexes for transaction tracking and reporting
  
- **V11__create_invoices_milestones_tables.sql**: Billing and project tracking
  - **invoices**: Complete invoice management with PDF generation support
  - **milestones**: Project phases with deliverables and payment attachment
  - Status workflows for approval processes
  - 10 indexes for invoice and milestone queries

### V12: Real-time Communication
- **V12__create_messaging_tables.sql**: User messaging system
  - **message_threads**: Conversations between two users
  - **messages**: Individual messages within threads
  - Project/job/contract context linking
  - Unread count tracking per user
  - Full-text search support for message content
  - Automatic thread last_message_at updates

### V13-V14: Engagement & Trust Systems
- **V13__create_notifications_reviews_tables.sql**: Notifications and ratings
  - **notifications**: Event notifications (JOB_POSTED, MESSAGE_RECEIVED, PAYMENT_RECEIVED, etc.)
  - **reviews**: Rating and feedback with auto-updating user stats
  - Verified purchase badges for credibility
  - Helpful/unhelpful counts for review quality
  - Author response comments for engagement
  
- **V14__create_portfolio_time_tracking_tables.sql**: Work showcase and tracking
  - **portfolio_items**: Freelancer portfolio with images and external links
  - **time_entries**: Hourly work tracking with approval workflow
  - Screenshot and attachment support for work proof
  - Status tracking for approval/rejection flows

### V15: Development Data
- **V15__seed_development_data.sql**: Sample data for testing
  - 5 sample users (3 freelancers, 2 companies, 1 admin)
  - 3 job postings across different categories
  - 3 freelance projects with active proposals
  - 1 active contract with milestone structure
  - Sample reviews and applications

## Database Design Principles

### 1. **Normalization (3NF)**
All tables follow Third Normal Form to eliminate redundancy while maintaining data integrity.

### 2. **Comprehensive Indexing**
- Primary key indexes on all id fields
- Foreign key indexes for join performance
- UNIQUE indexes on constraint fields (email, username, slug, invoice_number)
- Composite indexes on common filter combinations (status, created_at)
- Expression indexes for JSON fields and array operations
- Full-text search indexes for title/description fields

### 3. **Audit & Compliance**
- All tables include created_at (insertion time) and updated_at (modification time)
- Soft delete support via deleted_at nullable timestamp
- Change triggers automatically maintain updated_at values
- Complete audit trail preserved for historical analysis

### 4. **Data Integrity**
- Foreign key constraints with CASCADE DELETE for parent-child relationships
- CHECK constraints for enum-like fields and business logic validation
- UNIQUE constraints to prevent duplicates
- NOT NULL constraints on required fields
- Numeric constraints for amounts, ratings, percentages

### 5. **Flexible Data Storage**
- **TEXT[] arrays**: For multi-valued fields (skills[], benefits[], perks[])
- **JSONB objects**: For semi-structured data (answers, custom_fields, work_diary)
- Enables rich functionality without schema changes

### 6. **Automatic Calculations**
PostgreSQL triggers automatically maintain:
- `updated_at` timestamps on all updates
- `applications_count` on jobs when applications added/removed
- `proposal_count` on projects when proposals added/removed
- `rating_avg` and `rating_count` on users when reviews published
- `completion_rate` on users when contracts completed

## Key Statistics

| Aspect | Count |
|--------|-------|
| Total Tables | 23 |
| Total Indexes | 70+ |
| Foreign Key Constraints | 40+ |
| Check Constraints | 50+ |
| Trigger Functions | 15+ |
| Default Data Inserts | 27 |

## Performance Optimizations

1. **Query Performance**
   - Indexes on all WHERE clause columns
   - Composite indexes for common filter combinations
   - Full-text search indexes for content discovery

2. **Write Performance**
   - Minimal triggers for automated calculations
   - Deferred foreign key checks during bulk inserts
   - Batch insert optimization in seed data

3. **Storage Efficiency**
   - Proper data types (VARCHAR for strings, DECIMAL for money, DATE for dates)
   - Array compression for multi-valued fields
   - JSONB compression for semi-structured data

## Connecting to the Database

```
Host: localhost
Port: 5432
Database: marketplace_db
Username: marketplace_user
Password: marketplace_pass_dev
```

## Running Migrations

Migrations execute automatically on application startup via Flyway.

To manually run:
```bash
# Check migration status
mvn flyway:info

# Run all pending migrations
mvn flyway:migrate

# Repair migration history (if needed)
mvn flyway:repair
```

## Migration History

All legacy migrations (V1-V103 from previous system) have been archived in:
- `old_migrations/archived/` - Contains all historical migration files

This clean schema (V1-V15) replaces the legacy schema and is designed for optimal performance and maintainability.

## Emergency Procedures

### Reset Database to Initial State
```sql
-- WARNING: This deletes all data!
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO marketplace_user;
```

Then restart the application to re-run all migrations.

### Check Migration Status
```sql
SELECT * FROM flyway_schema_history ORDER BY installed_rank;
```

### View Current Schema
```sql
\dt -- List all tables
\di -- List all indexes
```

## Support & Maintenance

- All migrations are idempotent (safe to run multiple times)
- Flyway automatically tracks successful migrations
- Failed migrations must be fixed and manually repaired
- Regular backups recommended before major migrations
