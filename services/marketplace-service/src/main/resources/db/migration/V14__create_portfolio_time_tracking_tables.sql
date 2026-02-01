-- =====================================================
-- V14: Create Portfolio & Time Tracking Tables
-- Description: Portfolio management and time tracking for hourly contracts
-- OPTIMIZED: Removed 11 unused indexes (0 scans), removed 4 JSONB GIN indexes, removed full-text search index
-- Author: Database Audit & Optimization 2026-01-26
-- =====================================================

CREATE TABLE IF NOT EXISTS portfolio_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES freelancers(id) ON DELETE CASCADE,
    
    -- Portfolio Item Details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Media & Links
    image_url TEXT,
    thumbnail_url TEXT,
    -- Format: [{"url": "https://...", "caption": "Screenshot 1", "order": 1}]
    images JSONB DEFAULT '[]'::jsonb NOT NULL,
    
    -- External Links
    project_url TEXT,
    github_url TEXT,
    live_url TEXT,
    source_url TEXT,
    
    -- Metadata
    -- Format: ["React", "Node.js", "PostgreSQL"]
    skills_demonstrated JSONB DEFAULT '[]'::jsonb NOT NULL,
    tools_used JSONB DEFAULT '[]'::jsonb NOT NULL,
    technologies JSONB DEFAULT '[]'::jsonb NOT NULL,
    project_category VARCHAR(100),
    start_date DATE,
    end_date DATE,
    
    -- Display & Ordering
    display_order INTEGER DEFAULT 0 NOT NULL,
    highlight_order INTEGER,
    is_visible BOOLEAN DEFAULT TRUE NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP(6),
    
    CONSTRAINT portfolio_display_order_check CHECK (display_order >= 0),
    CONSTRAINT portfolio_dates_check CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

-- =====================================================
-- PORTFOLIO_ITEMS INDEXES (OPTIMIZED)
-- =====================================================
-- Audit Result: All indexes had 0 scans (portfolio system not in use yet)
-- REMOVED: idx_portfolio_user_id, idx_portfolio_category, idx_portfolio_created_at,
--          idx_portfolio_visible, idx_portfolio_featured (all 0 scans)
-- REMOVED: idx_portfolio_skills_gin, idx_portfolio_tools_gin, idx_portfolio_tech_gin (0 scans - JSONB search not used yet)
-- REMOVED: idx_portfolio_search (0 scans - full-text search not implemented)
-- NOTE: Will add indexes when portfolio features are actively used

-- No indexes initially - add when portfolio features are built

CREATE TABLE IF NOT EXISTS time_entries (
    id BIGSERIAL PRIMARY KEY,
    contract_id BIGINT NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    freelancer_id BIGINT NOT NULL REFERENCES freelancers(id) ON DELETE CASCADE,
    
    -- Time Details
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    hours_logged NUMERIC(5,2) NOT NULL,
    
    -- Description
    description TEXT,
    task_description TEXT,
    -- Format: {"tasks": [{"task": "Implemented login", "hours": 3.5, "completed": true}], "notes": "..."}
    work_diary JSONB DEFAULT '{}'::jsonb NOT NULL,
    
    -- Proof of Work
    -- Format: [{"url": "https://...", "timestamp": "2024-01-15T10:30:00Z"}]
    screenshot_urls JSONB DEFAULT '[]'::jsonb NOT NULL,
    -- Format: [{"filename": "report.pdf", "url": "https://...", "size": 12345}]
    file_attachments JSONB DEFAULT '[]'::jsonb NOT NULL,
    
    -- Status & Approval
    status VARCHAR(50) DEFAULT 'DRAFT' NOT NULL,
    approved_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    rejection_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    approved_at TIMESTAMP(6),
    
    -- Constraints
    CONSTRAINT time_hours_check CHECK (hours_logged > 0 AND hours_logged <= 24),
    CONSTRAINT time_status_check CHECK (status IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED')),
    CONSTRAINT time_times_check CHECK (start_time IS NULL OR end_time IS NULL OR end_time > start_time),
    CONSTRAINT time_approval_check CHECK (
        (status = 'APPROVED' AND approved_by IS NOT NULL AND approved_at IS NOT NULL) OR
        (status != 'APPROVED')
    )
);

-- =====================================================
-- TIME_ENTRIES INDEXES (OPTIMIZED)
-- =====================================================
-- Audit Result: All indexes had 0 scans (time tracking system not in use yet)
-- REMOVED: idx_time_contract_id, idx_time_freelancer_id, idx_time_date_desc,
--          idx_time_created_at, idx_time_status, idx_time_pending,
--          idx_time_contract_date, idx_time_freelancer_date, idx_time_approved_hours (all 0 scans)
-- REMOVED: idx_time_work_diary_gin, idx_time_screenshots_gin, idx_time_attachments_gin (0 scans - JSONB search not used yet)
-- NOTE: Will add indexes when time tracking features are actively used

-- No indexes initially - add when time tracking features are built

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER portfolio_items_updated_at BEFORE UPDATE ON portfolio_items FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER time_entries_updated_at BEFORE UPDATE ON time_entries FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Set approved_at timestamp when status changes to APPROVED
CREATE OR REPLACE FUNCTION set_time_approval_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'APPROVED' AND (OLD.status IS NULL OR OLD.status != 'APPROVED') THEN
        NEW.approved_at = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER time_approval_timestamp
    BEFORE UPDATE ON time_entries
    FOR EACH ROW
    EXECUTE FUNCTION set_time_approval_timestamp();

-- Materialized view for contract time summaries (performance optimization)
CREATE MATERIALIZED VIEW IF NOT EXISTS contract_time_summary AS
SELECT 
    contract_id,
    COUNT(*) as total_entries,
    SUM(CASE WHEN status = 'APPROVED' THEN hours_logged ELSE 0 END) as approved_hours,
    SUM(CASE WHEN status = 'SUBMITTED' THEN hours_logged ELSE 0 END) as pending_hours,
    SUM(CASE WHEN status = 'REJECTED' THEN hours_logged ELSE 0 END) as rejected_hours,
    MAX(date) as last_entry_date,
    MIN(date) as first_entry_date
FROM time_entries
GROUP BY contract_id;

CREATE UNIQUE INDEX idx_contract_time_summary ON contract_time_summary(contract_id);

-- Function to refresh materialized view
CREATE OR REPLACE FUNCTION refresh_contract_time_summary()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY contract_time_summary;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE portfolio_items IS 'Freelancer portfolio showcasing past work. Optimized with no indexes (portfolio not active).';
COMMENT ON TABLE time_entries IS 'Hourly time tracking with approval workflow. Optimized with no indexes (time tracking not active).';
COMMENT ON COLUMN portfolio_items.images IS 'JSONB array: [{"url": "...", "caption": "...", "order": 1}]';
COMMENT ON COLUMN portfolio_items.skills_demonstrated IS 'JSONB array: ["React", "Node.js", "PostgreSQL"]';
COMMENT ON COLUMN time_entries.work_diary IS 'JSONB object: {"tasks": [{"task": "...", "hours": 2.5, "completed": true}], "notes": "..."}';
COMMENT ON COLUMN time_entries.screenshot_urls IS 'JSONB array: [{"url": "...", "timestamp": "..."}]';
COMMENT ON COLUMN time_entries.file_attachments IS 'JSONB array: [{"filename": "...", "url": "...", "size": 12345}]';

-- =====================================================
-- ROLLBACK INSTRUCTIONS
-- =====================================================
-- To rollback this migration, run:
--
-- DROP FUNCTION IF EXISTS refresh_contract_time_summary();
-- DROP MATERIALIZED VIEW IF EXISTS contract_time_summary CASCADE;
-- DROP TRIGGER IF EXISTS time_approval_timestamp ON time_entries;
-- DROP TRIGGER IF EXISTS time_entries_updated_at ON time_entries;
-- DROP TRIGGER IF EXISTS portfolio_items_updated_at ON portfolio_items;
-- DROP FUNCTION IF EXISTS set_time_approval_timestamp();
-- DROP TABLE IF EXISTS time_entries CASCADE;
-- DROP TABLE IF EXISTS portfolio_items CASCADE;
