-- ═══════════════════════════════════════════════════════════════════════════
-- Migration V24: Add RBAC Tables (Role-Based Access Control)
-- Purpose: Support multi-role users and flexible permission system
-- Author: Senior Solutions Architect
-- Date: 2026-04-24
-- ═══════════════════════════════════════════════════════════════════════════

-- ───────────────────────────────────────────────────────────────────────────
-- Step 1: Create user_roles table (many-to-many)
-- ───────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_roles (
    user_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL,
    granted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    granted_by_user_id BIGINT,
    
    PRIMARY KEY (user_id, role),
    CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_roles_granted_by FOREIGN KEY (granted_by_user_id) 
        REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);
CREATE INDEX IF NOT EXISTS idx_user_roles_granted_at ON user_roles(granted_at);

COMMENT ON TABLE user_roles IS 'RBAC: Many-to-many user roles - supports users with multiple roles';
COMMENT ON COLUMN user_roles.role IS 'Role name: FREELANCER, COMPANY, ADMIN, INSTRUCTOR, etc.';


-- ───────────────────────────────────────────────────────────────────────────
-- Step 2: Migrate existing roles from users.role ENUM to user_roles table
-- ───────────────────────────────────────────────────────────────────────────

INSERT INTO user_roles (user_id, role, granted_at)
SELECT 
    id, 
    role::TEXT, 
    created_at
FROM users
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;


-- ───────────────────────────────────────────────────────────────────────────
-- Step 3: Create company_users table (team support)
-- ───────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS company_users (
    company_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'MEMBER',
    joined_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    invited_by_user_id BIGINT,
    
    PRIMARY KEY (company_id, user_id),
    CONSTRAINT fk_company_users_company FOREIGN KEY (company_id) 
        REFERENCES companies(id) ON DELETE CASCADE,
    CONSTRAINT fk_company_users_user FOREIGN KEY (user_id) 
        REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_company_users_invited_by FOREIGN KEY (invited_by_user_id) 
        REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_company_users_user_id ON company_users(user_id);
CREATE INDEX IF NOT EXISTS idx_company_users_role ON company_users(company_id, role);

COMMENT ON TABLE company_users IS 'Company team members - supports multiple admins and hiring managers';
COMMENT ON COLUMN company_users.role IS 'Company role: OWNER, ADMIN, MEMBER, HIRING_MANAGER';


-- ───────────────────────────────────────────────────────────────────────────
-- Step 4: Populate company_users with existing company owners
-- ───────────────────────────────────────────────────────────────────────────

INSERT INTO company_users (company_id, user_id, role, joined_at)
SELECT 
    c.id AS company_id,
    c.user_id,
    'OWNER' AS role,
    c.created_at AS joined_at
FROM companies c
WHERE c.user_id IS NOT NULL
ON CONFLICT (company_id, user_id) DO NOTHING;


-- ───────────────────────────────────────────────────────────────────────────
-- Step 5: Add audit columns to companies table
-- ───────────────────────────────────────────────────────────────────────────

ALTER TABLE companies 
    ADD COLUMN IF NOT EXISTS created_by_user_id BIGINT;

-- Backfill created_by_user_id from existing user_id
UPDATE companies SET created_by_user_id = user_id WHERE created_by_user_id IS NULL AND user_id IS NOT NULL;

ALTER TABLE companies 
    ADD CONSTRAINT fk_companies_created_by 
        FOREIGN KEY (created_by_user_id) 
        REFERENCES users(id) 
        ON DELETE SET NULL;

COMMENT ON COLUMN companies.created_by_user_id IS 'User who created the company (historical record, not necessarily current owner)';


-- ───────────────────────────────────────────────────────────────────────────
-- Step 6: Add audit columns to jobs table
-- ───────────────────────────────────────────────────────────────────────────

ALTER TABLE jobs 
    ADD COLUMN IF NOT EXISTS created_by_user_id BIGINT,
    ADD COLUMN IF NOT EXISTS updated_by_user_id BIGINT;

ALTER TABLE jobs 
    ADD CONSTRAINT fk_jobs_created_by 
        FOREIGN KEY (created_by_user_id) 
        REFERENCES users(id) 
        ON DELETE SET NULL,
    ADD CONSTRAINT fk_jobs_updated_by 
        FOREIGN KEY (updated_by_user_id) 
        REFERENCES users(id) 
        ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_jobs_created_by ON jobs(created_by_user_id);
CREATE INDEX IF NOT EXISTS idx_jobs_updated_by ON jobs(updated_by_user_id);


-- ───────────────────────────────────────────────────────────────────────────
-- Step 7: Verification and statistics
-- ───────────────────────────────────────────────────────────────────────────

DO $$
DECLARE
    total_user_roles INT;
    total_company_users INT;
    companies_with_owner INT;
BEGIN
    SELECT COUNT(*) INTO total_user_roles FROM user_roles;
    SELECT COUNT(*) INTO total_company_users FROM company_users;
    SELECT COUNT(DISTINCT company_id) INTO companies_with_owner 
    FROM company_users WHERE role = 'OWNER';
    
    RAISE NOTICE '✓ Migration V24 completed (RBAC)';
    RAISE NOTICE '  Total user_roles records: %', total_user_roles;
    RAISE NOTICE '  Total company_users records: %', total_company_users;
    RAISE NOTICE '  Companies with OWNER: %', companies_with_owner;
END $$;
