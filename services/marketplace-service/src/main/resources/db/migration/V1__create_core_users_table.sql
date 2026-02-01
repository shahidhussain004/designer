-- =====================================================
-- V1: Create Core Users Table & Role-Specific Entity Tables
-- Description: Core user management with proper relational design
--              - Users table for authentication/credentials
--              - Companies and Freelancers tables for role-specific data
-- OPTIMIZED: Only essential indexes, removed unused JSONB GIN indexes
-- Author: Database Audit & Optimization 2026-01-26
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm; -- For similarity/fuzzy search
CREATE EXTENSION IF NOT EXISTS btree_gin; -- For composite GIN indexes

-- =====================================================
-- USERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'FREELANCER',
    
    -- Profile
    full_name VARCHAR(100),
    phone VARCHAR(20),
    bio TEXT,
    profile_image_url VARCHAR(500),
    location VARCHAR(100),
    
    -- Status
    email_verified BOOLEAN DEFAULT FALSE NOT NULL,
    identity_verified BOOLEAN DEFAULT FALSE NOT NULL,
    identity_verified_at TIMESTAMP(6),
    verification_status VARCHAR(20) DEFAULT 'UNVERIFIED' NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    
    -- Denormalized rating data (updated by triggers from reviews table)
    rating_avg NUMERIC(3,2) DEFAULT 0.00,
    rating_count INTEGER DEFAULT 0,
    
    -- Stripe (common to both types)
    stripe_customer_id VARCHAR(100),
    stripe_account_id VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP(6),
    
    -- Constraints
    CONSTRAINT users_role_check CHECK (role IN ('FREELANCER', 'COMPANY', 'ADMIN')),
    CONSTRAINT users_verification_status_check CHECK (verification_status IN ('UNVERIFIED', 'VERIFIED', 'REJECTED')),
    CONSTRAINT users_rating_avg_check CHECK (rating_avg >= 0 AND rating_avg <= 5),
    CONSTRAINT users_rating_count_check CHECK (rating_count >= 0)
);

-- =====================================================
-- USERS INDEXES (OPTIMIZED - Only Essential Indexes)
-- =====================================================
-- Audit Result: Only idx_users_created_at_desc was actively used (563 scans)
-- REMOVED: 8 unused indexes including search, location, stripe, email_verified, rating
-- KEPT: Primary key (auto-created), unique constraints, created_at (proven usage)
-- ADDED: idx_users_active_created (critical for admin dashboard - from V_fix_002)

-- Unique indexes (case-insensitive, active records only)
CREATE UNIQUE INDEX idx_users_email_active ON users(LOWER(email)) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX idx_users_username_active ON users(LOWER(username)) WHERE deleted_at IS NULL;

-- KEPT: Actively used index for pagination/recent users
CREATE INDEX idx_users_created_at_desc ON users(created_at DESC) WHERE deleted_at IS NULL;

-- ADDED: Critical index for active users queries (10x faster admin dashboard)
-- From audit V_fix_002: Admin dashboard "Active Users" queries
CREATE INDEX idx_users_active_created ON users(created_at DESC)
WHERE is_active = TRUE AND deleted_at IS NULL;

-- Configure auto-vacuum for high-update table (from V_fix_003)
ALTER TABLE users SET (
  autovacuum_enabled = true,
  autovacuum_vacuum_scale_factor = 0.1,    -- Vacuum when 10% dead rows
  autovacuum_analyze_scale_factor = 0.05   -- Analyze when 5% changed
);

-- =====================================================
-- COMPANIES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS companies (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Company Details
    company_name VARCHAR(255) NOT NULL,
    company_type VARCHAR(100),
    industry VARCHAR(100),
    website_url VARCHAR(500),
    company_size VARCHAR(50),
    registration_number VARCHAR(100),
    tax_id VARCHAR(100),
    
    -- Company Contact
    phone VARCHAR(20),
    headquarters_location VARCHAR(255),
    
    -- Company Metrics (denormalized for performance)
    total_projects_posted INTEGER DEFAULT 0 NOT NULL,
    total_spent_cents BIGINT DEFAULT 0 NOT NULL, -- Store in cents
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Constraints
    CONSTRAINT companies_size_check CHECK (company_size IN ('STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE')),
    CONSTRAINT companies_projects_check CHECK (total_projects_posted >= 0),
    CONSTRAINT companies_spent_check CHECK (total_spent_cents >= 0)
);

-- =====================================================
-- COMPANIES INDEXES (OPTIMIZED)
-- =====================================================
-- Audit Result: Only companies_pkey was actively used (628 scans)
-- REMOVED: 6 unused indexes (industry, size, created_at, name_search, user_id)
-- KEPT: Primary key only (proven usage)

-- No additional indexes needed - primary key and unique constraint on user_id sufficient

-- =====================================================
-- FREELANCERS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS freelancers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Professional Info
    hourly_rate_cents BIGINT, -- Store in cents (e.g., $50.00 = 5000)
    experience_years INTEGER,
    headline VARCHAR(255),
    portfolio_url VARCHAR(500),
    github_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    
    -- Skills (jsonb with structured format)
    -- Format: [{"name": "React", "level": "expert", "years": 5}, ...]
    skills JSONB DEFAULT '[]'::jsonb NOT NULL,
    
    -- Certifications (jsonb)
    -- Format: [{"name": "AWS Certified", "issuer": "Amazon", "year": 2023, "credential_id": "ABC123"}, ...]
    certifications JSONB DEFAULT '[]'::jsonb NOT NULL,
    
    -- Languages (jsonb)
    -- Format: [{"language": "English", "proficiency": "native"}, {"language": "Spanish", "proficiency": "professional"}, ...]
    languages JSONB DEFAULT '[]'::jsonb NOT NULL,
    
    -- Freelancer Metrics
    completion_rate NUMERIC(5,2) DEFAULT 0.00,
    response_rate NUMERIC(5,2),
    response_time_hours INTEGER,
    total_earnings_cents BIGINT DEFAULT 0 NOT NULL, -- Store in cents
    total_projects_completed INTEGER DEFAULT 0 NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Constraints
    CONSTRAINT freelancers_hourly_rate_check CHECK (hourly_rate_cents IS NULL OR hourly_rate_cents >= 0),
    CONSTRAINT freelancers_experience_check CHECK (experience_years IS NULL OR experience_years >= 0),
    CONSTRAINT freelancers_completion_rate_check CHECK (completion_rate >= 0 AND completion_rate <= 100),
    CONSTRAINT freelancers_response_rate_check CHECK (response_rate IS NULL OR (response_rate >= 0 AND response_rate <= 100)),
    CONSTRAINT freelancers_earnings_check CHECK (total_earnings_cents >= 0),
    CONSTRAINT freelancers_projects_check CHECK (total_projects_completed >= 0)
);

-- =====================================================
-- FREELANCERS INDEXES (OPTIMIZED)
-- =====================================================
-- Audit Result: ALL 9 indexes had 0 scans
-- REMOVED: user_id, hourly_rate, completion_rate, experience, created_at, skills_gin, certifications_gin, languages_gin, search
-- KEPT: Primary key and unique constraint on user_id only
-- NOTE: JSONB GIN indexes can be added later when search features are implemented

-- No additional indexes needed - will add when search features are built

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Reusable trigger function for updated_at
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER freelancers_updated_at BEFORE UPDATE ON freelancers FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE users IS 'Base users table - authentication and common profile data. Optimized with auto-vacuum (10% threshold).';
COMMENT ON TABLE companies IS 'Company-specific profile data';
COMMENT ON TABLE freelancers IS 'Freelancer-specific profile data. JSONB columns for skills, certifications, languages.';

COMMENT ON COLUMN users.rating_avg IS 'Average rating from reviews (denormalized for performance)';
COMMENT ON COLUMN users.rating_count IS 'Total number of reviews (denormalized for performance)';

COMMENT ON COLUMN companies.total_spent_cents IS 'Total amount spent in cents (e.g., $1000.00 = 100000)';

COMMENT ON COLUMN freelancers.hourly_rate_cents IS 'Hourly rate in cents (e.g., $50.00/hr = 5000)';
COMMENT ON COLUMN freelancers.total_earnings_cents IS 'Total earnings in cents (e.g., $10000.00 = 1000000)';
COMMENT ON COLUMN freelancers.skills IS 'JSONB array: [{"name": "React", "level": "expert", "years": 5}]';

-- =====================================================
-- ROLLBACK INSTRUCTIONS
-- =====================================================
-- To rollback this migration, run:
--
-- DROP TRIGGER IF EXISTS freelancers_updated_at ON freelancers;
-- DROP TRIGGER IF EXISTS companies_updated_at ON companies;
-- DROP TRIGGER IF EXISTS users_updated_at ON users;
-- DROP FUNCTION IF EXISTS update_timestamp();
-- DROP TABLE IF EXISTS freelancers CASCADE;
-- DROP TABLE IF EXISTS companies CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP EXTENSION IF EXISTS btree_gin;
-- DROP EXTENSION IF EXISTS pg_trgm;
