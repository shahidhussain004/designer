-- =====================================================
-- V4: Create Traditional Job Postings Table
-- Description: Company job postings for FULL_TIME, PART_TIME, CONTRACT, TEMPORARY, INTERNSHIP positions
-- OPTIMIZED: Removed unused indexes, kept only essential ones, added auto-vacuum
-- Author: Database Audit & Optimization 2026-01-26
-- =====================================================

-- Create the counter validation function for jobs
CREATE OR REPLACE FUNCTION prevent_negative_counters_jobs()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.views_count < 0 THEN NEW.views_count = 0; END IF;
    IF NEW.applications_count < 0 THEN NEW.applications_count = 0; END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TABLE IF NOT EXISTS jobs (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    category_id BIGINT REFERENCES job_categories(id) ON DELETE SET NULL,
    
    -- Basic Information
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    responsibilities TEXT,
    requirements TEXT,
    
    -- Company Details
    job_type VARCHAR(50) DEFAULT 'FULL_TIME' NOT NULL,
    experience_level VARCHAR(50) DEFAULT 'INTERMEDIATE',
    
    -- Location & Remote Work
    location VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    is_remote BOOLEAN DEFAULT FALSE,
    remote_type VARCHAR(50),
    
    -- Compensation (Store in cents as BIGINT)
    salary_min_cents BIGINT,
    salary_max_cents BIGINT,
    salary_currency VARCHAR(3) DEFAULT 'USD',
    salary_period VARCHAR(20) DEFAULT 'ANNUAL',
    show_salary BOOLEAN DEFAULT TRUE,
    
    -- Benefits & Perks (JSONB)
    -- Format: [{"name": "Health Insurance", "description": "Full coverage"}, ...]
    benefits JSONB DEFAULT '[]'::jsonb,
    perks JSONB DEFAULT '[]'::jsonb,
    
    -- Skills & Qualifications (JSONB)
    -- Format: [{"skill": "Java", "required": true, "years": 3}, ...]
    required_skills JSONB DEFAULT '[]'::jsonb,
    preferred_skills JSONB DEFAULT '[]'::jsonb,
    education_level VARCHAR(50),
    certifications JSONB DEFAULT '[]'::jsonb,
    
    -- Application & Company Details
    positions_available INTEGER DEFAULT 1,
    application_deadline TIMESTAMP(6),
    application_email VARCHAR(255),
    application_url TEXT,
    apply_instructions TEXT,
    
    -- Company Information
    company_name VARCHAR(255),
    company_description TEXT,
    company_logo_url TEXT,
    company_website TEXT,
    company_size VARCHAR(50),
    industry VARCHAR(100),
    
    -- Special Requirements
    start_date DATE,
    travel_requirement VARCHAR(50),
    security_clearance_required BOOLEAN DEFAULT FALSE,
    visa_sponsorship BOOLEAN DEFAULT FALSE,
    
    -- Engagement & Status
    status VARCHAR(20) DEFAULT 'DRAFT' NOT NULL,
    views_count INTEGER DEFAULT 0 NOT NULL,
    applications_count INTEGER DEFAULT 0 NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    is_urgent BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    published_at TIMESTAMP(6),
    closed_at TIMESTAMP(6),
    deleted_at TIMESTAMP(6),
    
    -- Constraints
    CONSTRAINT jobs_type_check CHECK (job_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY', 'INTERNSHIP')),
    CONSTRAINT jobs_experience_check CHECK (experience_level IN ('ENTRY', 'INTERMEDIATE', 'SENIOR', 'LEAD', 'EXECUTIVE')),
    CONSTRAINT jobs_remote_type_check CHECK (remote_type IN ('FULLY_REMOTE', 'HYBRID', 'ON_SITE')),
    CONSTRAINT jobs_salary_period_check CHECK (salary_period IN ('ANNUAL', 'MONTHLY', 'HOURLY')),
    CONSTRAINT jobs_salary_range_check CHECK (salary_max_cents IS NULL OR salary_min_cents IS NULL OR salary_max_cents >= salary_min_cents),
    CONSTRAINT jobs_positions_check CHECK (positions_available > 0),
    CONSTRAINT jobs_status_check CHECK (status IN ('DRAFT', 'OPEN', 'PAUSED', 'CLOSED', 'FILLED')),
    CONSTRAINT jobs_travel_check CHECK (travel_requirement IN ('NONE', 'MINIMAL', 'MODERATE', 'EXTENSIVE')),
    CONSTRAINT jobs_counters_check CHECK (views_count >= 0 AND applications_count >= 0),
    CONSTRAINT jobs_education_level_check CHECK (education_level IS NULL OR education_level IN ('BACHELOR', 'MASTER', 'PHD'))
);

-- =====================================================
-- JOBS INDEXES (OPTIMIZED)
-- =====================================================
-- Audit Result: jobs_pkey (36 scans), idx_jobs_company_status (72 scans), idx_jobs_location (42 scans)
-- REMOVED: 11 unused indexes - company_id, category_id, open, featured, type_level, salary_range,
--          required_skills_gin, preferred_skills_gin, benefits_gin, perks_gin, search
-- KEPT: Primary key (auto-created), company_status (72 scans), location (42 scans)
-- NOTE: JSONB GIN indexes removed - were never used (0 scans), can add when search features built

-- KEPT: Composite index for company dashboard (72 scans - actively used!)
CREATE INDEX idx_jobs_company_status ON jobs(company_id, status, created_at DESC) 
WHERE deleted_at IS NULL;

-- KEPT: Location-based search (42 scans - actively used!)
CREATE INDEX idx_jobs_location ON jobs(city, country, is_remote) 
WHERE status = 'OPEN' AND deleted_at IS NULL;

-- Configure auto-vacuum for high-update table (from V_fix_003)
ALTER TABLE jobs SET (
  autovacuum_enabled = true,
  autovacuum_vacuum_scale_factor = 0.1,    -- Vacuum when 10% dead rows
  autovacuum_analyze_scale_factor = 0.05   -- Analyze when 5% changed
);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger for updated_at
CREATE TRIGGER jobs_updated_at 
    BEFORE UPDATE ON jobs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_timestamp();

-- Trigger to prevent negative counters
CREATE TRIGGER jobs_counter_check
    BEFORE UPDATE ON jobs 
    FOR EACH ROW 
    EXECUTE FUNCTION prevent_negative_counters_jobs();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE jobs IS 'Traditional company job postings. Optimized with auto-vacuum (10% threshold), minimal indexes.';
COMMENT ON COLUMN jobs.salary_min_cents IS 'Minimum salary in cents (e.g., $50000/year = 5000000)';
COMMENT ON COLUMN jobs.salary_max_cents IS 'Maximum salary in cents (e.g., $80000/year = 8000000)';
COMMENT ON COLUMN jobs.benefits IS 'JSONB array of benefits: [{"name": "Health Insurance", "description": "..."}]';
COMMENT ON COLUMN jobs.required_skills IS 'JSONB array of skills: [{"skill": "Java", "required": true, "years": 3}]';

-- =====================================================
-- ROLLBACK INSTRUCTIONS
-- =====================================================
-- To rollback this migration, run:
--
-- DROP TRIGGER IF EXISTS jobs_counter_check ON jobs;
-- DROP TRIGGER IF EXISTS jobs_updated_at ON jobs;
-- DROP TABLE IF EXISTS jobs CASCADE;
-- DROP FUNCTION IF EXISTS prevent_negative_counters_jobs();
