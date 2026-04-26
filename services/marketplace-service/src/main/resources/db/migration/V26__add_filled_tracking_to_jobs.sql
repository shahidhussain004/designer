-- =====================================================
-- V26: Add Filled Tracking to Jobs
-- Description: Add filled_at timestamp and filled_by_application_id to track when and by which application a job was filled
-- Author: System Enhancement - 2026-04-26
-- =====================================================

-- Add filled_at timestamp column
ALTER TABLE jobs
ADD COLUMN filled_at TIMESTAMP(6);

-- Add filled_by_application_id to track which application resulted in the hire
ALTER TABLE jobs
ADD COLUMN filled_by_application_id BIGINT REFERENCES job_applications(id) ON DELETE SET NULL;

-- Add index for filled status queries
CREATE INDEX idx_jobs_filled_at ON jobs(filled_at) WHERE filled_at IS NOT NULL;

-- Add comment explaining the columns
COMMENT ON COLUMN jobs.filled_at IS 'Timestamp when the job was marked as filled (status changed to FILLED)';
COMMENT ON COLUMN jobs.filled_by_application_id IS 'Reference to the job application that resulted in the hire (optional)';
