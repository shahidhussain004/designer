-- =====================================================
-- V4: Create Traditional Job Postings Table
-- Description: Company job postings for FULL_TIME, PART_TIME, CONTRACT, TEMPORARY, INTERNSHIP positions
-- OPTIMIZED: json → jsonb, salary in cents, GIN indexes, partial indexes
-- =====================================================

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
    
    -- Compensation (CHANGED: Store in cents as BIGINT)
    salary_min_cents BIGINT,
    salary_max_cents BIGINT,
    salary_currency VARCHAR(3) DEFAULT 'USD',
    salary_period VARCHAR(20) DEFAULT 'ANNUAL',
    show_salary BOOLEAN DEFAULT TRUE,
    
    -- Benefits & Perks (CHANGED: json → jsonb)
    -- Format: [{"name": "Health Insurance", "description": "Full coverage"}, ...]
    benefits JSONB DEFAULT '[]'::jsonb,
    perks JSONB DEFAULT '[]'::jsonb,
    
    -- Skills & Qualifications (CHANGED: json → jsonb)
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
    CONSTRAINT jobs_counters_check CHECK (views_count >= 0 AND applications_count >= 0)
);

-- Performance indexes
CREATE INDEX idx_jobs_company_id ON jobs(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_jobs_category_id ON jobs(category_id) WHERE deleted_at IS NULL;

-- Status-based partial indexes (most queries filter by status)
CREATE INDEX idx_jobs_open ON jobs(created_at DESC, salary_min_cents, salary_max_cents) 
    WHERE status = 'OPEN' AND deleted_at IS NULL;
CREATE INDEX idx_jobs_featured ON jobs(created_at DESC) 
    WHERE is_featured = TRUE AND status = 'OPEN' AND deleted_at IS NULL;

-- Job type and experience level filtering
CREATE INDEX idx_jobs_type_level ON jobs(job_type, experience_level, created_at DESC) 
    WHERE status = 'OPEN' AND deleted_at IS NULL;

-- Location-based search
CREATE INDEX idx_jobs_location ON jobs(city, country, is_remote) 
    WHERE status = 'OPEN' AND deleted_at IS NULL;

-- Salary range queries
CREATE INDEX idx_jobs_salary_range ON jobs(salary_min_cents, salary_max_cents) 
    WHERE salary_min_cents IS NOT NULL AND status = 'OPEN' AND deleted_at IS NULL;

-- CRITICAL: GIN indexes for JSONB skill/benefit searches
CREATE INDEX idx_jobs_required_skills_gin ON jobs USING GIN(required_skills);
CREATE INDEX idx_jobs_preferred_skills_gin ON jobs USING GIN(preferred_skills);
CREATE INDEX idx_jobs_benefits_gin ON jobs USING GIN(benefits);
CREATE INDEX idx_jobs_perks_gin ON jobs USING GIN(perks);

-- Full-text search on title and description
CREATE INDEX idx_jobs_search ON jobs USING GIN(
    to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(requirements, ''))
) WHERE deleted_at IS NULL;

-- Composite index for company dashboard
CREATE INDEX idx_jobs_company_status ON jobs(company_id, status, created_at DESC) WHERE deleted_at IS NULL;

-- Trigger for updated_at
CREATE TRIGGER jobs_updated_at 
    BEFORE UPDATE ON jobs 
    FOR EACH ROW 
    EXECUTE FUNCTION update_timestamp();

-- Trigger to prevent negative counters
CREATE OR REPLACE FUNCTION prevent_negative_counters()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.views_count < 0 THEN NEW.views_count = 0; END IF;
    IF NEW.applications_count < 0 THEN NEW.applications_count = 0; END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER jobs_counter_check
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION prevent_negative_counters();

COMMENT ON TABLE jobs IS 'Traditional company job postings table';
COMMENT ON COLUMN jobs.job_type IS 'Job type: FULL_TIME, PART_TIME, CONTRACT, TEMPORARY, INTERNSHIP';
COMMENT ON COLUMN jobs.remote_type IS 'Work location option: FULLY_REMOTE, HYBRID, ON_SITE';
COMMENT ON COLUMN jobs.status IS 'Job posting status: DRAFT, OPEN, PAUSED, CLOSED, FILLED';
COMMENT ON COLUMN jobs.salary_min_cents IS 'Minimum salary in cents (e.g., $50000/year = 5000000)';
COMMENT ON COLUMN jobs.salary_max_cents IS 'Maximum salary in cents (e.g., $80000/year = 8000000)';
COMMENT ON COLUMN jobs.benefits IS 'JSONB array: [{"name": "Health Insurance", "description": "Full coverage"}]';
COMMENT ON COLUMN jobs.required_skills IS 'JSONB array: [{"skill": "Java", "required": true, "years": 3}]';