-- =====================================================
-- V4: Create Traditional Job Postings Table
-- Description: Employment job postings for permanent/contract positions
-- =====================================================

CREATE TABLE IF NOT EXISTS jobs (
    id BIGSERIAL PRIMARY KEY,
    employer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id BIGINT REFERENCES job_categories(id) ON DELETE SET NULL,
    
    -- Basic Information
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    responsibilities TEXT,
    requirements TEXT,
    
    -- Employment Details
    job_type VARCHAR(50) DEFAULT 'FULL_TIME' NOT NULL,
    employment_type VARCHAR(50) DEFAULT 'PERMANENT',
    experience_level VARCHAR(50) DEFAULT 'INTERMEDIATE',
    
    -- Location & Remote Work
    location VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    is_remote BOOLEAN DEFAULT FALSE,
    remote_type VARCHAR(50), -- FULLY_REMOTE, HYBRID, ON_SITE
    
    -- Compensation
    salary_min DECIMAL(12,2),
    salary_max DECIMAL(12,2),
    salary_currency VARCHAR(3) DEFAULT 'USD',
    salary_period VARCHAR(20) DEFAULT 'ANNUAL', -- ANNUAL, MONTHLY, HOURLY
    show_salary BOOLEAN DEFAULT TRUE,
    
    -- Benefits & Perks
    benefits JSON,
    perks JSON,
    
    -- Skills & Qualifications
    required_skills JSON,
    preferred_skills JSON,
    education_level VARCHAR(50),
    certifications JSON,
    
    -- Application & Company Details
    positions_available INTEGER DEFAULT 1,
    application_deadline TIMESTAMP,
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
    travel_requirement VARCHAR(50), -- NONE, MINIMAL, MODERATE, EXTENSIVE
    security_clearance_required BOOLEAN DEFAULT FALSE,
    visa_sponsorship BOOLEAN DEFAULT FALSE,
    
    -- Engagement & Status
    status VARCHAR(20) DEFAULT 'ACTIVE' NOT NULL,
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    proposal_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_urgent BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    closed_at TIMESTAMP,
    deleted_at TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_job_type CHECK (job_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY', 'INTERNSHIP')),
    CONSTRAINT chk_employment_type CHECK (employment_type IN ('PERMANENT', 'CONTRACT', 'TEMPORARY')),
    CONSTRAINT chk_experience_level CHECK (experience_level IN ('ENTRY', 'INTERMEDIATE', 'SENIOR', 'LEAD', 'EXECUTIVE')),
    CONSTRAINT chk_remote_type CHECK (remote_type IN ('FULLY_REMOTE', 'HYBRID', 'ON_SITE')),
    CONSTRAINT chk_salary_period CHECK (salary_period IN ('ANNUAL', 'MONTHLY', 'HOURLY')),
    CONSTRAINT chk_salary_range CHECK (salary_max IS NULL OR salary_min IS NULL OR salary_max >= salary_min),
    CONSTRAINT chk_positions_available CHECK (positions_available > 0),
    CONSTRAINT chk_status CHECK (status IN ('DRAFT', 'ACTIVE', 'PAUSED', 'CLOSED', 'FILLED')),
    CONSTRAINT chk_travel_requirement CHECK (travel_requirement IN ('NONE', 'MINIMAL', 'MODERATE', 'EXTENSIVE')),
    CONSTRAINT chk_views_applications CHECK (views_count >= 0 AND applications_count >= 0)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_jobs_employer_id ON jobs(employer_id);
CREATE INDEX IF NOT EXISTS idx_jobs_category_id ON jobs(category_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_job_type ON jobs(job_type);
CREATE INDEX IF NOT EXISTS idx_jobs_experience_level ON jobs(experience_level);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs(city, country);
CREATE INDEX IF NOT EXISTS idx_jobs_is_remote ON jobs(is_remote);
CREATE INDEX IF NOT EXISTS idx_jobs_salary_min_max ON jobs(salary_min, salary_max);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_published_at ON jobs(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_deleted_at ON jobs(deleted_at);
CREATE INDEX IF NOT EXISTS idx_jobs_is_featured ON jobs(is_featured, status);
CREATE INDEX IF NOT EXISTS idx_jobs_title_desc ON jobs USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_jobs_updated_at
BEFORE UPDATE ON jobs
FOR EACH ROW
EXECUTE FUNCTION update_jobs_updated_at();

COMMENT ON TABLE jobs IS 'Traditional employment job postings table';
COMMENT ON COLUMN jobs.employer_id IS 'User ID of the employer/recruiter posting the job';
COMMENT ON COLUMN jobs.job_type IS 'Employment type: FULL_TIME, PART_TIME, CONTRACT, TEMPORARY, INTERNSHIP';
COMMENT ON COLUMN jobs.remote_type IS 'Work location option: FULLY_REMOTE, HYBRID, ON_SITE';
COMMENT ON COLUMN jobs.status IS 'Job posting status: DRAFT, ACTIVE, PAUSED, CLOSED, FILLED';
