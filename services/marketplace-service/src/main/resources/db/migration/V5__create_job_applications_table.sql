-- =====================================================
-- V5: Create Job Applications Table
-- Description: Candidate applications for job postings
-- OPTIMIZED: json → jsonb, text[] for documents, GIN indexes, soft-delete support
-- =====================================================

CREATE TABLE IF NOT EXISTS job_applications (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    applicant_id BIGINT NOT NULL REFERENCES freelancers(id) ON DELETE CASCADE,
    
    -- Contact Information (separate from user profile for flexibility)
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    
    -- Application Information
    cover_letter TEXT,
    resume_url TEXT,
    portfolio_url TEXT,
    linkedin_url TEXT,
    additional_documents TEXT[] DEFAULT '{}', -- Simple array of URLs
    
    -- Answers to custom questions (CHANGED: json → jsonb)
    -- Format: {"question1": "answer1", "question2": "answer2"}
    answers JSONB DEFAULT '{}'::jsonb,
    
    -- Status & Review (9 states: PENDING→WITHDRAWN)
    status VARCHAR(50) DEFAULT 'PENDING' NOT NULL,
    company_notes TEXT,
    rejection_reason TEXT,
    reviewed_at TIMESTAMP(6),
    
    -- Timestamps
    applied_at TIMESTAMP(6),
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP(6),
    
    -- Constraints
    CONSTRAINT job_applications_status_check CHECK (status IN ('PENDING', 'SUBMITTED', 'REVIEWING', 'SHORTLISTED', 'INTERVIEWING', 'OFFERED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'))
);

-- Performance indexes (soft-delete aware)
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_job_applications_applicant_id ON job_applications(applicant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_job_applications_status ON job_applications(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_job_applications_created_at ON job_applications(created_at DESC) WHERE deleted_at IS NULL;

-- Status-based partial indexes
CREATE INDEX idx_job_applications_reviewing ON job_applications(job_id, created_at DESC) 
    WHERE status IN ('SUBMITTED', 'REVIEWING') AND deleted_at IS NULL;
CREATE INDEX idx_job_applications_shortlisted ON job_applications(job_id, created_at DESC) 
    WHERE status = 'SHORTLISTED' AND deleted_at IS NULL;
CREATE INDEX idx_job_applications_pending_decision ON job_applications(job_id, created_at DESC) 
    WHERE status IN ('SHORTLISTED', 'INTERVIEWING', 'OFFERED') AND deleted_at IS NULL;

-- GIN index for answers searching
CREATE INDEX idx_job_applications_answers_gin ON job_applications USING GIN(answers);

-- Trigger for updated_at
CREATE TRIGGER job_applications_updated_at 
    BEFORE UPDATE ON job_applications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_timestamp();

-- Trigger to increment job applications count
CREATE OR REPLACE FUNCTION increment_job_applications_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE jobs
    SET applications_count = applications_count + 1
    WHERE id = NEW.job_id AND NEW.deleted_at IS NULL;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_increment_job_applications_count
    AFTER INSERT ON job_applications
    FOR EACH ROW
    EXECUTE FUNCTION increment_job_applications_count();

-- Trigger to decrement job applications count (on soft-delete)
CREATE OR REPLACE FUNCTION decrement_job_applications_count()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
        UPDATE jobs
        SET applications_count = GREATEST(0, applications_count - 1)
        WHERE id = OLD.job_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_decrement_job_applications_count
    AFTER UPDATE ON job_applications
    FOR EACH ROW
    EXECUTE FUNCTION decrement_job_applications_count();

COMMENT ON TABLE job_applications IS 'Job applications submitted by freelancers for job postings (soft-delete enabled)';
COMMENT ON COLUMN job_applications.status IS 'Application status: PENDING, SUBMITTED, REVIEWING, SHORTLISTED, INTERVIEWING, OFFERED, ACCEPTED, REJECTED, WITHDRAWN';
COMMENT ON COLUMN job_applications.answers IS 'JSONB object: {"question_key": "answer_value"}';
COMMENT ON COLUMN job_applications.additional_documents IS 'Text array of document URLs';
COMMENT ON COLUMN job_applications.deleted_at IS 'Soft-delete timestamp - NULL means active, non-NULL means deleted';