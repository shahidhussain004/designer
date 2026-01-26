-- =====================================================
-- V5: Create Job Applications Table
-- Description: Candidate applications for job postings
-- OPTIMIZED: Removed 3 unused GIN indexes (0 scans), removed redundant idx_job_applications_applicant_id (covered by status composite)
-- Author: Database Audit & Optimization 2026-01-26
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
    
    -- Answers to custom questions
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

-- =====================================================
-- JOB_APPLICATIONS INDEXES (OPTIMIZED)
-- =====================================================
-- Audit Result: All partial and GIN indexes had 0 scans
-- REMOVED: idx_job_applications_applicant_id (redundant - covered by freelancer_status composite)
-- REMOVED: idx_job_applications_reviewing, idx_job_applications_shortlisted, 
--          idx_job_applications_pending_decision (all 0 scans - premature optimization)
-- REMOVED: idx_job_applications_answers_gin (0 scans - search feature not built yet)
-- KEPT: job_id (essential FK), status, created_at, freelancer_status composite

-- KEPT: Essential foreign key index
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id) 
WHERE deleted_at IS NULL;

-- KEPT: Status filtering
CREATE INDEX idx_job_applications_status ON job_applications(status) 
WHERE deleted_at IS NULL;

-- KEPT: Time-based sorting
CREATE INDEX idx_job_applications_created_at ON job_applications(created_at DESC) 
WHERE deleted_at IS NULL;

-- KEPT: Freelancer dashboard (instead of redundant applicant_id index)
CREATE INDEX idx_job_applications_freelancer_status ON job_applications(applicant_id, status, created_at DESC)
WHERE deleted_at IS NULL;

-- =====================================================
-- TRIGGERS
-- =====================================================

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

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE job_applications IS 'Job applications submitted by freelancers. Optimized with minimal indexes.';
COMMENT ON COLUMN job_applications.status IS 'Application status: PENDING, SUBMITTED, REVIEWING, SHORTLISTED, INTERVIEWING, OFFERED, ACCEPTED, REJECTED, WITHDRAWN';
COMMENT ON COLUMN job_applications.answers IS 'JSONB object: {"question_key": "answer_value"}';
COMMENT ON COLUMN job_applications.additional_documents IS 'Text array of document URLs';
COMMENT ON COLUMN job_applications.deleted_at IS 'Soft-delete timestamp - NULL means active, non-NULL means deleted';

-- =====================================================
-- ROLLBACK INSTRUCTIONS
-- =====================================================
-- To rollback this migration, run:
--
-- DROP TRIGGER IF EXISTS trg_decrement_job_applications_count ON job_applications;
-- DROP TRIGGER IF EXISTS trg_increment_job_applications_count ON job_applications;
-- DROP TRIGGER IF EXISTS job_applications_updated_at ON job_applications;
-- DROP FUNCTION IF EXISTS decrement_job_applications_count();
-- DROP FUNCTION IF EXISTS increment_job_applications_count();
-- DROP TABLE IF EXISTS job_applications CASCADE;
