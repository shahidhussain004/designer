-- =====================================================
-- V7: Create Freelance Projects Table
-- Description: Freelance/gig project postings by clients
-- =====================================================

CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    client_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id BIGINT REFERENCES project_categories(id) ON DELETE SET NULL,
    
    -- Basic Information
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    scope_of_work TEXT,
    deliverables TEXT[],
    
    -- Project Budget & Timeline
    budget_min DECIMAL(12,2),
    budget_max DECIMAL(12,2),
    budget_type VARCHAR(50), -- HOURLY, FIXED_PRICE, NOT_SURE
    currency VARCHAR(3) DEFAULT 'USD',
    timeline VARCHAR(100), -- ASAP, 1-3_MONTHS, 3-6_MONTHS, 6_PLUS_MONTHS
    estimated_duration VARCHAR(100),
    
    -- Skills & Requirements
    required_skills TEXT[],
    preferred_skills TEXT[],
    experience_level VARCHAR(50), -- ENTRY, INTERMEDIATE, SENIOR, LEAD, EXECUTIVE
    
    -- Project Details
    project_type VARCHAR(50), -- SINGLE_PROJECT, ONGOING, CONTRACT
    priority_level VARCHAR(50), -- LOW, MEDIUM, HIGH, URGENT
    is_featured BOOLEAN DEFAULT FALSE,
    is_urgent BOOLEAN DEFAULT FALSE,
    
    -- Status & Engagement
    status VARCHAR(50) DEFAULT 'OPEN' NOT NULL,
    visibility VARCHAR(50) DEFAULT 'PUBLIC', -- PUBLIC, PRIVATE, INVITE_ONLY
    proposal_count INTEGER DEFAULT 0,
    attachment_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    
    -- Engagement & Communication
    apply_instructions TEXT,
    screening_questions JSONB,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    closed_at TIMESTAMP,
    deleted_at TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_project_budget CHECK (budget_max IS NULL OR budget_min IS NULL OR budget_max >= budget_min),
    CONSTRAINT chk_project_budget_type CHECK (budget_type IN ('HOURLY', 'FIXED_PRICE', 'NOT_SURE')),
    CONSTRAINT chk_project_timeline CHECK (timeline IN ('ASAP', '1-3_MONTHS', '3-6_MONTHS', '6_PLUS_MONTHS')),
    CONSTRAINT chk_project_status CHECK (status IN ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ARCHIVED')),
    CONSTRAINT chk_project_visibility CHECK (visibility IN ('PUBLIC', 'PRIVATE', 'INVITE_ONLY')),
    CONSTRAINT chk_project_type CHECK (project_type IN ('SINGLE_PROJECT', 'ONGOING', 'CONTRACT')),
    CONSTRAINT chk_priority_level CHECK (priority_level IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    CONSTRAINT chk_experience_level CHECK (experience_level IN ('ENTRY', 'INTERMEDIATE', 'SENIOR', 'LEAD', 'EXECUTIVE'))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_client_id ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_category_id ON projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_budget_min_max ON projects(budget_min, budget_max);
CREATE INDEX IF NOT EXISTS idx_projects_experience_level ON projects(experience_level);
CREATE INDEX IF NOT EXISTS idx_projects_visibility ON projects(visibility);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON projects(is_featured, status);
CREATE INDEX IF NOT EXISTS idx_projects_title_desc ON projects USING GIN(to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX IF NOT EXISTS idx_projects_deleted_at ON projects(deleted_at);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_projects_updated_at
BEFORE UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION update_projects_updated_at();

COMMENT ON TABLE projects IS 'Freelance and gig projects posted by clients';
COMMENT ON COLUMN projects.budget_type IS 'Budget type: HOURLY (pay per hour), FIXED_PRICE (flat rate), NOT_SURE';
COMMENT ON COLUMN projects.timeline IS 'Estimated project timeline for completion';
COMMENT ON COLUMN projects.project_type IS 'Type: SINGLE_PROJECT (one-time), ONGOING (multiple milestones), CONTRACT (long-term)';
COMMENT ON COLUMN projects.status IS 'Project status: OPEN (accepting proposals), IN_PROGRESS, COMPLETED, CANCELLED, ARCHIVED';
