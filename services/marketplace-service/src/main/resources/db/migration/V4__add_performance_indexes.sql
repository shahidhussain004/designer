-- V4__add_performance_indexes.sql
-- Add additional indexes for performance optimization

-- Job search and filtering indexes
CREATE INDEX IF NOT EXISTS idx_jobs_budget ON jobs(budget);
CREATE INDEX IF NOT EXISTS idx_jobs_experience_status ON jobs(experience_level, status);
CREATE INDEX IF NOT EXISTS idx_jobs_category_status ON jobs(category, status);

-- Proposal filtering indexes
CREATE INDEX IF NOT EXISTS idx_proposals_status_created ON proposals(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_proposals_job_status ON proposals(job_id, status);
CREATE INDEX IF NOT EXISTS idx_proposals_freelancer_status ON proposals(freelancer_id, status);

-- Dashboard query optimization indexes
CREATE INDEX IF NOT EXISTS idx_jobs_client_status ON jobs(client_id, status);
CREATE INDEX IF NOT EXISTS idx_jobs_client_created ON jobs(client_id, created_at DESC);

-- Full-text search preparation (for PostgreSQL)
-- Note: This creates a GIN index for text search
CREATE INDEX IF NOT EXISTS idx_jobs_title_search ON jobs USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_jobs_description_search ON jobs USING gin(to_tsvector('english', description));
