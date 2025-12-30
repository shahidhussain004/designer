# Database Schema Enhancement Plan

## Executive Summary
This document analyzes missing tables and columns from `config/init.sql` that should be added to the Flyway-managed database schema to enhance the marketplace platform's functionality.

**Date**: December 29, 2025  
**Status**: Pending Implementation

---

## Current State Analysis

### ID Type Difference (Critical)
- **init.sql**: Uses `UUID` for primary keys
- **Flyway (current)**: Uses `BIGSERIAL` (BIGINT) for primary keys
- **Decision**: Continue with BIGINT (simpler, better performance, already in production)

### Tables in init.sql but NOT in Production DB

1. **portfolio_items** ✅ HIGH PRIORITY
2. **contracts** ✅ HIGH PRIORITY
3. **time_entries** ✅ HIGH PRIORITY
4. **reviews** ✅ HIGH PRIORITY
5. **conversations** ⚠️ MEDIUM (messaging service handles this)
6. **audit_logs** ⚠️ MEDIUM (can use application-level logging initially)
7. **verification_records** ⚠️ MEDIUM (can be added later)
8. **user_profiles** ❌ LOW (data merged into users table)

---

## Recommended Enhancements

### Phase 1: Critical Features (Implement Now)

#### 1. Portfolio Items Table ⭐⭐⭐
**Business Value**: Essential for freelancers to showcase their work

**New Table**: `portfolio_items`
```sql
CREATE TABLE portfolio_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    project_url TEXT,
    technologies TEXT[],
    completion_date DATE,
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Frontend Integration**:
- Designer profile page: display portfolio grid
- Portfolio management page: CRUD operations
- Public profile: showcase best work

**Backend Implementation**:
- Entity: `PortfolioItem.java`
- Repository: `PortfolioItemRepository.java`
- Service: `PortfolioService.java`
- Controller endpoints:
  - `GET /api/users/{userId}/portfolio`
  - `POST /api/portfolio`
  - `PUT /api/portfolio/{id}`
  - `DELETE /api/portfolio/{id}`
  - `PATCH /api/portfolio/{id}/reorder`

**API Already Defined**: Yes (in `openapi.yaml` line 1383)

---

#### 2. Contracts Table ⭐⭐⭐
**Business Value**: Formal agreements between clients and freelancers

**New Table**: `contracts`
```sql
CREATE TABLE contracts (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    client_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    freelancer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    proposal_id BIGINT REFERENCES proposals(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    contract_type VARCHAR(20) NOT NULL, -- 'FIXED' or 'HOURLY'
    total_amount DECIMAL(12, 2) NOT NULL,
    payment_schedule VARCHAR(20), -- 'UPFRONT', 'MILESTONE', 'HOURLY'
    status VARCHAR(20) DEFAULT 'DRAFT', -- 'DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'DISPUTED'
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);
```

**Usage**: Messaging service already references contracts (`contracts.signed` event in Kafka)

---

#### 3. Time Entries Table ⭐⭐
**Business Value**: Track hourly work for time-based contracts

**New Table**: `time_entries`
```sql
CREATE TABLE time_entries (
    id BIGSERIAL PRIMARY KEY,
    contract_id BIGINT NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    freelancer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    description TEXT,
    hours_worked DECIMAL(8, 2) NOT NULL,
    rate_per_hour DECIMAL(10, 2) NOT NULL,
    work_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'SUBMITTED', 'APPROVED', 'PAID'
    approved_at TIMESTAMP,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Dependency**: Requires `contracts` table

---

#### 4. Reviews Table ⭐⭐⭐
**Business Value**: Trust and reputation system

**New Table**: `reviews`
```sql
CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    contract_id BIGINT NOT NULL UNIQUE REFERENCES contracts(id) ON DELETE CASCADE,
    reviewer_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewed_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    categories JSONB, -- {communication: 5, quality: 4, timeliness: 5}
    is_anonymous BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'PUBLISHED', -- 'DRAFT', 'PUBLISHED', 'HIDDEN'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**API Already Defined**: Yes (Reviews endpoints in OpenAPI)

---

### Phase 2: Enhanced User Profiles

#### 5. Additional User Profile Fields ⭐⭐
**Business Value**: Richer freelancer profiles

**Add to `users` table**:
```sql
ALTER TABLE users 
ADD COLUMN github_url VARCHAR(500),
ADD COLUMN linkedin_url VARCHAR(500),
ADD COLUMN certifications TEXT[],
ADD COLUMN languages TEXT[],
ADD COLUMN experience_years INTEGER,
ADD COLUMN verification_status VARCHAR(20) DEFAULT 'UNVERIFIED',
ADD COLUMN identity_verified BOOLEAN DEFAULT false,
ADD COLUMN identity_verified_at TIMESTAMP,
ADD COLUMN completion_rate DECIMAL(5, 2) DEFAULT 100.00,
ADD COLUMN response_time_hours DECIMAL(5, 1),
ADD COLUMN response_rate DECIMAL(5, 2);
```

**Frontend Integration**:
- Profile edit form: add fields for social links, certifications, languages
- Profile display: show verification badges, completion rate
- Freelancer search: filter by verification status, languages

---

### Phase 3: Optional Enhancements (Future)

#### 6. Conversations Table ⚠️
**Status**: Messaging service may handle this
**Decision**: Review messaging-service implementation first

#### 7. Audit Logs Table ⚠️
**Status**: Can use application logging initially
**Decision**: Add when security compliance required

#### 8. Verification Records Table ⚠️
**Status**: Part of KYC/verification workflow
**Decision**: Add when implementing identity verification

---

## Implementation Strategy

### Migration Order

```
V7__create_portfolio_items_table.sql
V8__create_contracts_table.sql
V9__create_time_entries_table.sql
V10__create_reviews_table.sql
V11__enhance_users_table_profile_fields.sql
V12__add_indexes_portfolio_contracts_reviews.sql
```

### Backend Development Order

1. **Portfolio Items** (standalone, no dependencies)
   - Entity + Repository + Service + Controller
   - File upload integration for images
   
2. **Contracts** (depends on existing jobs, proposals)
   - Entity + Repository + Service + Controller
   - Kafka event publishing
   
3. **Time Entries** (depends on contracts)
   - Entity + Repository + Service + Controller
   - Time tracking UI components
   
4. **Reviews** (depends on contracts)
   - Entity + Repository + Service + Controller
   - Rating aggregation logic
   
5. **Enhanced User Fields** (extend existing User entity)
   - Update DTOs and API responses
   - Update frontend forms

### Frontend Development Priorities

1. **Portfolio Management** (high ROI)
   - Portfolio item CRUD UI
   - Image upload component
   - Drag-and-drop reordering
   
2. **Contract Workflow** (critical for payments)
   - Contract creation wizard
   - Status tracking dashboard
   - Milestone management
   
3. **Time Tracking** (for hourly contracts)
   - Time entry form
   - Weekly timesheet view
   - Approval workflow
   
4. **Reviews & Ratings** (trust building)
   - Review submission form
   - Review display components
   - Rating aggregation widgets

---

## Data Type Decisions

### Array Columns
- **technologies**, **skills**, **certifications**, **languages**: Use `TEXT[]` (PostgreSQL native array)
- **Rationale**: Simple queries, no separate junction table needed, good for small lists

### JSON Columns
- **review categories**: Use `JSONB`
- **Rationale**: Flexible structure, queryable, good for nested data

### Timestamps
- **created_at**, **updated_at**: Use `TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
- **Triggers**: Use `update_updated_at_column()` function (already exists in V1)

### Enums vs Strings
- Use `VARCHAR(20)` with CHECK constraints for status fields
- **Rationale**: More flexible than database enums, easier to extend

---

## Security Considerations

1. **Soft Deletes**: Add `deleted_at` columns where needed
2. **Ownership Checks**: Ensure controllers verify user owns resources
3. **Privacy**: Mark sensitive fields (e.g., hourly_rate) as accessible only to owner
4. **Rate Limiting**: Implement for portfolio/review creation

---

## Performance Considerations

### Indexes to Add

```sql
-- Portfolio Items
CREATE INDEX idx_portfolio_user_id ON portfolio_items(user_id);
CREATE INDEX idx_portfolio_is_visible ON portfolio_items(is_visible);
CREATE INDEX idx_portfolio_display_order ON portfolio_items(user_id, display_order);

-- Contracts
CREATE INDEX idx_contracts_client_id ON contracts(client_id);
CREATE INDEX idx_contracts_freelancer_id ON contracts(freelancer_id);
CREATE INDEX idx_contracts_job_id ON contracts(job_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_status_dates ON contracts(status, created_at);

-- Time Entries
CREATE INDEX idx_time_entries_contract_id ON time_entries(contract_id);
CREATE INDEX idx_time_entries_freelancer_id ON time_entries(freelancer_id);
CREATE INDEX idx_time_entries_status ON time_entries(status);
CREATE INDEX idx_time_entries_work_date ON time_entries(work_date DESC);

-- Reviews
CREATE INDEX idx_reviews_reviewed_user_id ON reviews(reviewed_user_id);
CREATE INDEX idx_reviews_reviewer_user_id ON reviews(reviewer_user_id);
CREATE INDEX idx_reviews_contract_id ON reviews(contract_id);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Users (new fields)
CREATE INDEX idx_users_verification_status ON users(verification_status);
CREATE INDEX idx_users_completion_rate ON users(completion_rate DESC);
```

---

## Testing Strategy

### Unit Tests
- Repository CRUD operations
- Service layer business logic
- DTO conversions

### Integration Tests
- API endpoints
- Database constraints
- Cascade deletes

### E2E Tests
- Portfolio CRUD workflow
- Contract creation and completion flow
- Time entry submission and approval
- Review submission after contract completion

---

## Rollback Plan

Each migration should be tested with:
1. Forward migration (apply)
2. Data insertion test
3. Rollback migration (if needed)

Store rollback scripts in `db/migration/rollback/` directory.

---

## Success Metrics

### Technical Metrics
- [ ] All migrations apply cleanly
- [ ] No performance degradation in existing queries
- [ ] Full test coverage (>80%) for new entities

### Business Metrics
- [ ] 50%+ of freelancers add portfolio items within 30 days
- [ ] Contract completion rate increases
- [ ] Review submission rate >60% for completed contracts
- [ ] User profile completion rate increases

---

## Next Steps

1. ✅ Review this plan with team
2. ⏭️ Create Flyway migration files (V7-V12)
3. ⏭️ Implement backend entities, repositories, services
4. ⏭️ Create API controllers and DTOs
5. ⏭️ Update OpenAPI spec with new endpoints
6. ⏭️ Implement frontend components
7. ⏭️ Write comprehensive tests
8. ⏭️ Deploy to staging and test
9. ⏭️ Production deployment with monitoring

---

## Questions / Decisions Needed

1. **Portfolio Image Storage**: Use AWS S3 or local storage?
2. **Contract Workflow**: Should contracts auto-generate from accepted proposals?
3. **Time Tracking**: Integrate with external time tracking tools (e.g., Toggl)?
4. **Review Timing**: Auto-prompt for review after contract completion?
5. **Verification**: External KYC provider (e.g., Stripe Identity) or custom?

---

## References

- Original schema: `config/init.sql`
- Current migrations: `services/marketplace-service/src/main/resources/db/migration/`
- API spec: `docs/api/openapi.yaml`
- Existing entities: `services/marketplace-service/src/main/java/com/designer/marketplace/entity/`
