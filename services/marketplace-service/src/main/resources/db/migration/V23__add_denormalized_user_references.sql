-- ═══════════════════════════════════════════════════════════════════════════
-- Migration V23: Add Denormalized Company/Freelancer References to Users
-- Purpose: Enable O(1) permission checks without JOINs
-- Author: Senior Solutions Architect
-- Date: 2026-04-24
-- ═══════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────────
-- Step 1: Add new columns to users table (nullable for backward compatibility)
-- ───────────────────────────────────────────────────────────────────────────

ALTER TABLE users 
    ADD COLUMN IF NOT EXISTS company_id BIGINT,
    ADD COLUMN IF NOT EXISTS freelancer_id BIGINT;

COMMENT ON COLUMN users.company_id IS 'Denormalized FK to companies - enables O(1) permission checks';
COMMENT ON COLUMN users.freelancer_id IS 'Denormalized FK to freelancers - enables O(1) profile lookups';


-- ───────────────────────────────────────────────────────────────────────────
-- Step 2: Backfill existing data
-- ───────────────────────────────────────────────────────────────────────────

-- Populate company_id for COMPANY users
UPDATE users u
SET company_id = c.id
FROM companies c
WHERE c.user_id = u.id
  AND u.role = 'COMPANY';

-- Populate freelancer_id for FREELANCER users  
UPDATE users u
SET freelancer_id = f.id
FROM freelancers f
WHERE f.user_id = u.id
  AND u.role = 'FREELANCER';


-- ───────────────────────────────────────────────────────────────────────────
-- Step 3: Add indexes for performance
-- ───────────────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_users_company_id ON users(company_id);
CREATE INDEX IF NOT EXISTS idx_users_freelancer_id ON users(freelancer_id);


-- ───────────────────────────────────────────────────────────────────────────
-- Step 4: Add foreign key constraints (with ON DELETE SET NULL for safety)
-- ───────────────────────────────────────────────────────────────────────────

ALTER TABLE users 
    ADD CONSTRAINT fk_users_company 
        FOREIGN KEY (company_id) 
        REFERENCES companies(id) 
        ON DELETE SET NULL;

ALTER TABLE users 
    ADD CONSTRAINT fk_users_freelancer 
        FOREIGN KEY (freelancer_id) 
        REFERENCES freelancers(id) 
        ON DELETE SET NULL;


-- ───────────────────────────────────────────────────────────────────────────
-- Step 5: Verification queries (logged but not executed)
-- ───────────────────────────────────────────────────────────────────────────

DO $$
DECLARE
    company_users_with_ref INT;
    company_users_without_ref INT;
    freelancer_users_with_ref INT;
    freelancer_users_without_ref INT;
BEGIN
    SELECT COUNT(*) INTO company_users_with_ref 
    FROM users WHERE role = 'COMPANY' AND company_id IS NOT NULL;
    
    SELECT COUNT(*) INTO company_users_without_ref 
    FROM users WHERE role = 'COMPANY' AND company_id IS NULL;
    
    SELECT COUNT(*) INTO freelancer_users_with_ref 
    FROM users WHERE role = 'FREELANCER' AND freelancer_id IS NOT NULL;
    
    SELECT COUNT(*) INTO freelancer_users_without_ref 
    FROM users WHERE role = 'FREELANCER' AND freelancer_id IS NULL;
    
    RAISE NOTICE '✓ Migration V23 completed';
    RAISE NOTICE '  Company users with company_id: %', company_users_with_ref;
    RAISE NOTICE '  Company users WITHOUT company_id: %', company_users_without_ref;
    RAISE NOTICE '  Freelancer users with freelancer_id: %', freelancer_users_with_ref;
    RAISE NOTICE '  Freelancer users WITHOUT freelancer_id: %', freelancer_users_without_ref;
    
    IF company_users_without_ref > 0 THEN
        RAISE WARNING 'Some COMPANY users missing company_id - needs investigation';
    END IF;
    
    IF freelancer_users_without_ref > 0 THEN
        RAISE WARNING 'Some FREELANCER users missing freelancer_id - needs investigation';
    END IF;
END $$;
