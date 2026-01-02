-- =====================================================
-- V5: Create Job Applications Table
-- Description: Candidate applications for job postings
-- =====================================================

CREATE TABLE IF NOT EXISTS job_applications (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    applicant_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Application Information
    cover_letter TEXT,
    resume_url TEXT,
    portfolio_url TEXT,
    linkedin_url TEXT,
    additional_documents TEXT[],
    answers JSONB, -- Custom questions and answers
    
    -- Status & Review
    status VARCHAR(50) DEFAULT 'SUBMITTED' NOT NULL,
    recruiter_notes TEXT,
    rejection_reason TEXT,
    reviewed_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Unique constraint to prevent duplicate applications
    CONSTRAINT unique_job_applicant UNIQUE(job_id, applicant_id),
    CONSTRAINT chk_application_status CHECK (status IN ('SUBMITTED', 'REVIEWING', 'SHORTLISTED', 'INTERVIEWING', 'OFFERED', 'REJECTED', 'WITHDRAWN', 'ACCEPTED'))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_applicant_id ON job_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON job_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_job_applications_job_applicant ON job_applications(job_id, applicant_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_job_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_job_applications_updated_at
BEFORE UPDATE ON job_applications
FOR EACH ROW
EXECUTE FUNCTION update_job_applications_updated_at();

-- Create trigger to increment job applications count
CREATE OR REPLACE FUNCTION increment_job_applications_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE jobs
    SET applications_count = applications_count + 1
    WHERE id = NEW.job_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_increment_job_applications_count
AFTER INSERT ON job_applications
FOR EACH ROW
EXECUTE FUNCTION increment_job_applications_count();

-- Create trigger to decrement job applications count
CREATE OR REPLACE FUNCTION decrement_job_applications_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE jobs
    SET applications_count = GREATEST(0, applications_count - 1)
    WHERE id = OLD.job_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_decrement_job_applications_count
AFTER DELETE ON job_applications
FOR EACH ROW
EXECUTE FUNCTION decrement_job_applications_count();

COMMENT ON TABLE job_applications IS 'Job applications submitted by candidates for job postings';
COMMENT ON COLUMN job_applications.status IS 'Application status: SUBMITTED, REVIEWING, SHORTLISTED, INTERVIEWING, OFFERED, REJECTED, WITHDRAWN, ACCEPTED';
COMMENT ON COLUMN job_applications.answers IS 'JSON object containing answers to custom application questions';
