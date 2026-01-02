# Content Service Database Refactoring

## Overview

**Decision: Keep both marketplace and content services in a single `marketplace_db` database with separate schemas for architectural clarity and operational simplicity.**

### Architecture Decision Record (ADR)

**Chosen: Single Database, Multiple Schemas**
```
marketplace_db
├── public schema (marketplace microservice)
│   ├── users, projects, jobs, contracts, etc.
│   └── flyway_schema_history (tracks all marketplace migrations)
│
└── content schema (content microservice)
    ├── tutorials, articles, categories, comments, etc.
    └── (future: separate migration tracking per schema or in public)
```

---

## Database → Schema → Table Hierarchy (Simple Explanation)

### Level 1: DATABASE (Top)
- **What it is**: A complete, isolated data instance. Think of it as a separate building.
- **In this project**: `marketplace_db` (one building for everything)
- **Example**: 
  - ❌ OLD: `content_db` (tried to be separate building but was never created)
  - ✅ NEW: `marketplace_db` (one building with multiple departments)

### Level 2: SCHEMA (Middle)
- **What it is**: A logical namespace/folder inside a database. Think of it as departments in the building.
- **In this project**: 
  - `public` schema = Marketplace Department (users, projects, jobs)
  - `content` schema = Content Department (tutorials, articles, categories)
- **Benefit**: Clear separation, easy to backup/restore by department

### Level 3: TABLE (Bottom)
- **What it is**: The actual data containers. Think of it as desks in each department.
- **Examples**:
  - `public.users` (desk in marketplace department)
  - `content.tutorials` (desk in content department)
  - `content.articles` (another desk in content department)

---

## Why Single Database with Multiple Schemas?

### ✅ Advantages (Why This Is Better)
1. **Operational Simplicity**
   - One database to backup/restore
   - One set of database credentials
   - One connection pool
   - Simpler Docker/Kubernetes setup

2. **Development Experience**
   - Easier local setup (one Docker Postgres container instead of two)
   - Same database connection parameters for all microservices
   - Easier to add new microservices later

3. **Transaction Support**
   - Can write transactions that span both schemas if needed
   - Atomic operations across marketplace and content

4. **Maintenance & Security**
   - Single Postgres instance to patch/update
   - Centralized user/permission management
   - Easier to implement row-level security policies

### ❌ Disadvantages (Trade-offs)
1. If one schema gets corrupted, affects entire database
2. Need schema-aware naming/organization practices
3. Resource contention if one schema grows very large

---

## Implementation Details

### Connection String Structure

**Old (Broken)**:
```
DATABASE_URL=postgresql://marketplace_user:marketplace_pass_dev@localhost:5432/content_db
```
Problem: `content_db` database doesn't exist

**New (Fixed)**:
```
DATABASE_URL=postgresql://marketplace_user:marketplace_pass_dev@localhost:5432/marketplace_db?schema=content
```
Benefits:
- Points to existing `marketplace_db`
- Uses schema prefix to tell Prisma to use `content` schema
- Same credentials as marketplace service

### Migration Strategy

**Marketplace Service**: Uses **Flyway** for migrations (Java/Spring ecosystem)
- Files: `services/marketplace-service/src/main/resources/db/migration/V*.sql`
- Tracked in: `public.flyway_schema_history`

**Content Service**: Uses **Prisma** for migrations (Node.js/TypeScript ecosystem)
- Files: `services/content-service/prisma/migrations/*/migration.sql`
- Tracked in: `_prisma_migrations` table (auto-created by Prisma)

**Both run independently**:
- Flyway watches for `V*.sql` files and applies to public schema
- Prisma watches for migration folders and applies to content schema
- Both use separate version tracking tables

---

## Tables in Each Schema

### public schema (Marketplace Service - 20 tables)
- **Users**: users, experience_levels
- **Projects**: projects, project_categories, proposals
- **Jobs**: jobs, job_categories, job_applications
- **Contracts**: contracts, invoices, milestones
- **Payments**: payments, payouts, escrow, transaction_ledger
- **Communications**: messages, message_threads, notifications
- **Portfolio**: portfolio_items
- **Reviews**: reviews
- **Time Tracking**: time_entries
- **Migrations**: flyway_schema_history

### content schema (Content Service - 16 tables)
- **Core Content**: content, categories, tags, content_tags
- **Authors**: authors
- **Comments**: comments, content_likes
- **Tutorials**: tutorials, tutorial_sections, tutorial_topics, tutorial_media, tutorial_bookmarks
- **Engagement**: content_views
- **Media**: media_assets

---

## Implementation Checklist

- [x] Verified both schemas exist in `marketplace_db`
- [x] Identified all tables in each schema
- [x] Identified root cause: content service configured for non-existent `content_db`
- [ ] Update content-service `.env` to use correct DATABASE_URL
- [ ] Create Flyway migration scripts for content schema setup
- [ ] Seed test data into content tables
- [ ] Update docker-compose configuration if needed
- [ ] Test content-service startup
- [ ] Verify all content endpoints work
- [ ] Document the final setup

---

## Next Steps

1. **Update content-service connection** → Point to `marketplace_db` with content schema
2. **Create Flyway migrations** → Schemas for content tables (alternative: let Prisma handle it)
3. **Seed data** → Add test tutorials, articles, categories for frontend testing
4. **Test endpoints** → Verify all content service APIs return data
5. **Document final architecture** → Create architecture diagram

