-- =====================================================
-- V14 REFACTORED: Optimized Portfolio & Time Tracking
-- Key improvements:
-- 1. Standardized ALL json → jsonb
-- 2. Proper array structure for images/screenshots
-- 3. Added GIN indexes for JSONB columns
-- 4. Improved time entry validation
-- 5. Added materialized view for work_diary aggregations
-- =====================================================

CREATE TABLE IF NOT EXISTS portfolio_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES freelancers(id) ON DELETE CASCADE,
    
    -- Portfolio Item Details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    
    -- Media & Links (CHANGED: json → jsonb)
    image_url TEXT,
    thumbnail_url TEXT,
    images JSONB DEFAULT '[]'::jsonb NOT NULL, -- [{"url": "...", "caption": "..."}]
    
    -- External Links
    project_url TEXT,
    github_url TEXT,
    live_url TEXT,
    source_url TEXT,
    
    -- Metadata (CHANGED: json → jsonb)
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

-- Indexes
CREATE INDEX idx_portfolio_user_id ON portfolio_items(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_portfolio_visible ON portfolio_items(user_id, is_visible, display_order) 
    WHERE is_visible = TRUE AND deleted_at IS NULL;
CREATE INDEX idx_portfolio_featured ON portfolio_items(user_id, highlight_order) 
    WHERE highlight_order IS NOT NULL AND is_visible = TRUE AND deleted_at IS NULL;
CREATE INDEX idx_portfolio_category ON portfolio_items(project_category) 
    WHERE project_category IS NOT NULL AND deleted_at IS NULL;

-- GIN indexes for skill/tech searching
CREATE INDEX idx_portfolio_skills_gin ON portfolio_items USING GIN(skills_demonstrated);
CREATE INDEX idx_portfolio_tools_gin ON portfolio_items USING GIN(tools_used);
CREATE INDEX idx_portfolio_tech_gin ON portfolio_items USING GIN(technologies);

-- Full-text search
CREATE INDEX idx_portfolio_search ON portfolio_items USING GIN(
    to_tsvector('english', title || ' ' || COALESCE(description, ''))
) WHERE deleted_at IS NULL;

CREATE TABLE IF NOT EXISTS time_entries (
    id BIGSERIAL PRIMARY KEY,
    contract_id BIGINT NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    freelancer_id BIGINT NOT NULL REFERENCES freelancers(id) ON DELETE CASCADE,
    
    -- Time Details
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    hours_logged NUMERIC(5,2) NOT NULL, -- Changed from 10,2 to 5,2 (max 999.99 hours)
    
    -- Description
    description TEXT,
    task_description TEXT,
    work_diary JSONB DEFAULT '{}'::jsonb NOT NULL, -- CHANGED: Structured work breakdown
    
    -- Proof of Work (CHANGED: json → jsonb)
    screenshot_urls JSONB DEFAULT '[]'::jsonb NOT NULL,
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

-- Indexes for time_entries
CREATE INDEX idx_time_contract_id ON time_entries(contract_id);
CREATE INDEX idx_time_freelancer_id ON time_entries(freelancer_id);
CREATE INDEX idx_time_date_desc ON time_entries(date DESC);
CREATE INDEX idx_time_status ON time_entries(status);

-- Composite indexes for common queries
CREATE INDEX idx_time_contract_date ON time_entries(contract_id, date DESC, status);
CREATE INDEX idx_time_freelancer_date ON time_entries(freelancer_id, date DESC, status);
CREATE INDEX idx_time_approval_queue ON time_entries(contract_id, status, created_at DESC) 
    WHERE status = 'SUBMITTED';

-- GIN index for work_diary searching
CREATE INDEX idx_time_work_diary_gin ON time_entries USING GIN(work_diary);

-- Partial index for approved hours aggregation
CREATE INDEX idx_time_approved_hours ON time_entries(contract_id, date, hours_logged) 
    WHERE status = 'APPROVED';

-- Triggers
CREATE TRIGGER portfolio_items_updated_at 
    BEFORE UPDATE ON portfolio_items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER time_entries_updated_at 
    BEFORE UPDATE ON time_entries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_timestamp();

-- Trigger to set approved_at timestamp
CREATE OR REPLACE FUNCTION set_time_approval_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'APPROVED' AND OLD.status != 'APPROVED' THEN
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
    MAX(date) as last_entry_date,
    MIN(date) as first_entry_date
FROM time_entries
GROUP BY contract_id;

CREATE UNIQUE INDEX idx_contract_time_summary ON contract_time_summary(contract_id);

-- Refresh function (call this periodically or via trigger)
CREATE OR REPLACE FUNCTION refresh_contract_time_summary()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY contract_time_summary;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE portfolio_items IS 'Freelancer portfolio showcasing past work';
COMMENT ON COLUMN portfolio_items.images IS 'JSONB array: [{"url": "...", "caption": "...", "order": 1}]';
COMMENT ON COLUMN portfolio_items.skills_demonstrated IS 'JSONB array: ["React", "Node.js", "PostgreSQL"]';
COMMENT ON COLUMN portfolio_items.tools_used IS 'JSONB array: ["VS Code", "Docker", "Git"]';

COMMENT ON TABLE time_entries IS 'Hourly time tracking with approval workflow';
COMMENT ON COLUMN time_entries.work_diary IS 'JSONB object: {"tasks": [{"task": "...", "hours": 2.5, "completed": true}], "notes": "..."}';
COMMENT ON COLUMN time_entries.screenshot_urls IS 'JSONB array: [{"url": "...", "timestamp": "..."}]';
COMMENT ON COLUMN time_entries.file_attachments IS 'JSONB array: [{"filename": "...", "url": "...", "size": 12345}]';