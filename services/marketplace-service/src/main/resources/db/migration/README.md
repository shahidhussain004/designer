# Database Migrations V7-V12: Schema Enhancements

## Overview
These migrations add critical missing features from the original `config/init.sql` to the Flyway-managed schema, enabling portfolio management, contracts, time tracking, and reviews.

---

## Migration Files

### V7 - Portfolio Items
**File**: `V7__create_portfolio_items_table.sql`  
**Purpose**: Allows freelancers to showcase their work with images and project details  
**Tables**: `portfolio_items`

### V8 - Contracts
**File**: `V8__create_contracts_table.sql`  
**Purpose**: Formal agreements between clients and freelancers with payment tracking  
**Tables**: `contracts`

### V9 - Time Entries
**File**: `V9__create_time_entries_table.sql`  
**Purpose**: Track hourly work with approval workflow  
**Tables**: `time_entries`  
**Dependencies**: Requires V8 (contracts)

### V10 - Reviews
**File**: `V10__create_reviews_table.sql`  
**Purpose**: Rating and feedback system with auto-updating user stats  
**Tables**: `reviews`  
**Triggers**: `update_user_rating_stats()`  
**Dependencies**: Requires V8 (contracts)

### V11 - User Profile Enhancements
**File**: `V11__enhance_users_table_profile_fields.sql`  
**Purpose**: Add social URLs, certifications, languages, verification, and performance metrics  
**Tables**: `users` (ALTER TABLE)

### V12 - Trigger Functions
**File**: `V12__add_trigger_update_functions.sql`  
**Purpose**: Helper functions for completion rates, proposal counts, and contract limits  
**Functions**: 
- `calculate_user_completion_rate()`
- `update_user_completion_rate()`
- `increment_job_proposal_count()`
- `get_user_active_contracts_count()`
- `can_user_create_contract()`

---

## Running Migrations

### Using Maven/Flyway Plugin
```bash
cd services/marketplace-service
./mvnw flyway:migrate
```

### Verify Migration Status
```bash
./mvnw flyway:info
```

### Check Applied Migrations
```sql
SELECT * FROM flyway_schema_history ORDER BY installed_rank DESC LIMIT 10;
```

---

## Testing After Migration

### Verify Tables Created
```sql
-- Check all tables
\dt

-- Describe new tables
\d portfolio_items
\d contracts
\d time_entries
\d reviews

-- Check users table for new columns
\d users
```

### Verify Indexes
```sql
SELECT indexname, tablename 
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('portfolio_items', 'contracts', 'time_entries', 'reviews')
ORDER BY tablename, indexname;
```

### Verify Triggers
```sql
SELECT tgname, tgrelid::regclass, tgtype, tgenabled
FROM pg_trigger
WHERE tgrelid IN ('portfolio_items'::regclass, 'contracts'::regclass, 'time_entries'::regclass, 'reviews'::regclass, 'users'::regclass)
ORDER BY tgrelid, tgname;
```

### Verify Functions
```sql
SELECT proname, prosrc 
FROM pg_proc 
WHERE proname IN (
    'calculate_user_completion_rate',
    'update_user_completion_rate',
    'update_user_rating_stats',
    'increment_job_proposal_count'
);
```

---

## Rollback Plan

If you need to rollback migrations, you can run these SQL commands in reverse order:

```sql
-- V12 rollback
DROP FUNCTION IF EXISTS can_user_create_contract(BIGINT, INTEGER);
DROP FUNCTION IF EXISTS get_user_active_contracts_count(BIGINT);
DROP TRIGGER IF EXISTS update_completion_rate_on_contract_change ON contracts;
DROP FUNCTION IF EXISTS update_user_completion_rate();
DROP FUNCTION IF EXISTS calculate_user_completion_rate(BIGINT);
DROP TRIGGER IF EXISTS update_job_proposal_count ON proposals;
DROP FUNCTION IF EXISTS increment_job_proposal_count();

-- V11 rollback
ALTER TABLE users DROP COLUMN IF EXISTS response_rate;
ALTER TABLE users DROP COLUMN IF EXISTS response_time_hours;
ALTER TABLE users DROP COLUMN IF EXISTS completion_rate;
ALTER TABLE users DROP COLUMN IF EXISTS identity_verified_at;
ALTER TABLE users DROP COLUMN IF EXISTS identity_verified;
ALTER TABLE users DROP COLUMN IF EXISTS verification_status;
ALTER TABLE users DROP COLUMN IF EXISTS experience_years;
ALTER TABLE users DROP COLUMN IF EXISTS languages;
ALTER TABLE users DROP COLUMN IF EXISTS certifications;
ALTER TABLE users DROP COLUMN IF EXISTS linkedin_url;
ALTER TABLE users DROP COLUMN IF EXISTS github_url;

-- V10 rollback
DROP TRIGGER IF EXISTS update_user_rating_stats_trigger ON reviews;
DROP FUNCTION IF EXISTS update_user_rating_stats();
DROP TABLE IF EXISTS reviews CASCADE;

-- V9 rollback
DROP TABLE IF EXISTS time_entries CASCADE;

-- V8 rollback
DROP TABLE IF EXISTS contracts CASCADE;

-- V7 rollback
DROP TABLE IF EXISTS portfolio_items CASCADE;
```

⚠️ **Warning**: Only rollback if absolutely necessary. These commands will delete data.

---

## Testing Checklist

After running migrations:

- [ ] All 6 migration files applied successfully
- [ ] No errors in Flyway output
- [ ] `flyway_schema_history` shows V7-V12 with success status
- [ ] All new tables created (portfolio_items, contracts, time_entries, reviews)
- [ ] Users table has 11 new columns
- [ ] All indexes created (run `\di` to list)
- [ ] All triggers created and enabled
- [ ] All functions created
- [ ] Foreign key constraints working
- [ ] CHECK constraints working (test with invalid data)
- [ ] Backend service starts without errors
- [ ] Run backend integration tests

---

## Next Steps

1. **Backend**: Implement entities, repositories, services, controllers
   - See: `docs/BACKEND_IMPLEMENTATION_GUIDE.md`

2. **Frontend**: Create UI components and API services
   - See: `docs/FRONTEND_IMPLEMENTATION_GUIDE.md`

3. **Testing**: Write comprehensive tests
   - Unit tests for repositories and services
   - Integration tests for API endpoints
   - E2E tests for complete workflows

4. **Deployment**:
   - Test on staging environment
   - Performance testing
   - Production deployment

---

## Documentation

- **Strategic Plan**: `docs/SCHEMA_ENHANCEMENT_PLAN.md`
- **Backend Guide**: `docs/BACKEND_IMPLEMENTATION_GUIDE.md`
- **Frontend Guide**: `docs/FRONTEND_IMPLEMENTATION_GUIDE.md`
- **Summary**: `docs/SCHEMA_ENHANCEMENT_SUMMARY.md`

---

## Questions?

Contact the development team or refer to the comprehensive documentation in the `docs/` directory.

---

*Last Updated: December 29, 2025*
