-- =====================================================
-- V14: Create Portfolio & Time Tracking Tables
-- Description: Portfolio management and time tracking for hourly contracts
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
    images JSON DEFAULT '[]'::json, -- Array of image URLs
    
    -- External Links
    project_url TEXT,
    github_url TEXT,
    live_url TEXT,
    source_url TEXT,
    
    -- Metadata
    skills_demonstrated JSON DEFAULT '[]'::json,
    tools_used JSON DEFAULT '[]'::json,
    technologies JSON DEFAULT '[]'::json,
    project_category VARCHAR(100),
    start_date DATE,
    end_date DATE,
    
    -- Display & Ordering
    display_order INTEGER DEFAULT 0,
    highlight_order INTEGER, -- For featured items
    is_visible BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create indexes for portfolio_items
CREATE INDEX IF NOT EXISTS idx_portfolio_items_user_id ON portfolio_items(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_is_visible ON portfolio_items(is_visible);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_created_at ON portfolio_items(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolio_visible_order ON portfolio_items(is_visible, display_order);

CREATE TABLE IF NOT EXISTS time_entries (
    id BIGSERIAL PRIMARY KEY,
    contract_id BIGINT NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    freelancer_id BIGINT NOT NULL REFERENCES freelancers(id) ON DELETE CASCADE,
    
    -- Time Details
    date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    hours_logged NUMERIC(10,2) NOT NULL,
    
    -- Description
    description TEXT,
    task_description TEXT,
    work_diary JSONB, -- Detailed breakdown of work done
    
    -- Screenshots & Proof of Work
    screenshot_urls JSON DEFAULT '[]'::json,
    file_attachments JSON DEFAULT '[]'::json,
    
    -- Status & Approval
    status VARCHAR(50) DEFAULT 'SUBMITTED' NOT NULL, -- DRAFT, SUBMITTED, APPROVED, REJECTED
    approved_by BIGINT REFERENCES users(id) ON DELETE SET NULL,
    rejection_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_hours_logged CHECK (hours_logged > 0 AND hours_logged <= 24),
    CONSTRAINT chk_time_status CHECK (status IN ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED')),
    CONSTRAINT chk_time_times CHECK (start_time IS NULL OR end_time IS NULL OR end_time > start_time)
);

-- Create indexes for time_entries
CREATE INDEX IF NOT EXISTS idx_time_entries_contract_id ON time_entries(contract_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_freelancer_id ON time_entries(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_date ON time_entries(date DESC);
CREATE INDEX IF NOT EXISTS idx_time_entries_status ON time_entries(status);
CREATE INDEX IF NOT EXISTS idx_time_entries_created_at ON time_entries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_time_entries_contract_date ON time_entries(contract_id, date DESC);

-- Create trigger for portfolio_items updated_at
CREATE OR REPLACE FUNCTION update_portfolio_items_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_portfolio_items_updated_at
BEFORE UPDATE ON portfolio_items
FOR EACH ROW
EXECUTE FUNCTION update_portfolio_items_updated_at();

-- Create trigger for time_entries updated_at
CREATE OR REPLACE FUNCTION update_time_entries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_time_entries_updated_at
BEFORE UPDATE ON time_entries
FOR EACH ROW
EXECUTE FUNCTION update_time_entries_updated_at();

COMMENT ON TABLE portfolio_items IS 'Freelancer portfolio showcasing past work and projects';
COMMENT ON COLUMN portfolio_items.highlight_order IS 'Order for displaying featured items (lower = higher priority)';
COMMENT ON TABLE time_entries IS 'Time logging for hourly contracts with approval workflow';
COMMENT ON COLUMN time_entries.status IS 'Time entry status: DRAFT, SUBMITTED (waiting approval), APPROVED, REJECTED';
COMMENT ON COLUMN time_entries.work_diary IS 'JSON object with detailed breakdown of work tasks completed during logged time';
