-- =====================================================
-- V16: Create Saved Jobs Table
-- Description: Junction table for users to save/favorite jobs they're interested in
-- =====================================================

CREATE TABLE IF NOT EXISTS saved_jobs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    
    -- Metadata
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Ensure user can only save a job once
    CONSTRAINT saved_jobs_unique UNIQUE (user_id, job_id)
);

-- Indexes for query optimization
CREATE INDEX idx_saved_jobs_user_id ON saved_jobs(user_id, created_at DESC);
CREATE INDEX idx_saved_jobs_job_id ON saved_jobs(job_id);

-- Comment
COMMENT ON TABLE saved_jobs IS 'Junction table tracking which jobs users have saved/favorited for later viewing';
