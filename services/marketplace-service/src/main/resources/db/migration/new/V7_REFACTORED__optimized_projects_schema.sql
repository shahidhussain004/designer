-- =====================================================
-- V7 REFACTORED: Optimized Projects Table
-- Key improvements:
-- 1. Standardized json → jsonb for all structured data
-- 2. text[] for deliverables (simple string list)
-- 3. Removed duplicate fields (budget vs budget_min/max)
-- 4. Added GIN indexes for JSONB columns
-- 5. Partitioning-ready with created_at
-- 6. Improved constraint names
-- =====================================================

CREATE TABLE IF NOT EXISTS projects (
    id BIGSERIAL PRIMARY KEY,
    company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    category_id BIGINT REFERENCES project_categories(id) ON DELETE SET NULL,
    
    -- Basic Information
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    scope_of_work TEXT,
    deliverables TEXT[] DEFAULT '{}', -- Simple string array
    
    -- Budget & Timeline
    budget_min NUMERIC(12,2),
    budget_max NUMERIC(12,2),
    budget_type VARCHAR(50) NOT NULL DEFAULT 'FIXED_PRICE',
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    timeline VARCHAR(100),
    estimated_duration_days INTEGER,
    
    -- Skills & Requirements (CHANGED: json → jsonb)
    required_skills JSONB DEFAULT '[]'::jsonb NOT NULL,
    preferred_skills JSONB DEFAULT '[]'::jsonb NOT NULL,
    experience_level VARCHAR(50),
    
    -- Project Details
    project_type VARCHAR(50) NOT NULL DEFAULT 'SINGLE_PROJECT',
    priority_level VARCHAR(50) NOT NULL DEFAULT 'MEDIUM',
    is_featured BOOLEAN DEFAULT FALSE NOT NULL,
    is_urgent BOOLEAN DEFAULT FALSE NOT NULL,
    
    -- Status & Engagement
    status VARCHAR(50) DEFAULT 'DRAFT' NOT NULL,
    visibility VARCHAR(50) DEFAULT 'PUBLIC' NOT NULL,
    
    -- Counters (denormalized for performance)
    proposal_count INTEGER DEFAULT 0 NOT NULL,
    views_count INTEGER DEFAULT 0 NOT NULL,
    
    -- Engagement & Communication (CHANGED: json → jsonb)
    screening_questions JSONB DEFAULT '[]'::jsonb,
    apply_instructions TEXT,
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    published_at TIMESTAMP(6),
    closed_at TIMESTAMP(6),
    deleted_at TIMESTAMP(6),
    
    -- Constraints
    CONSTRAINT projects_budget_check CHECK (budget_max IS NULL OR budget_min IS NULL OR budget_max >= budget_min),
    CONSTRAINT projects_budget_type_check CHECK (budget_type IN ('HOURLY', 'FIXED_PRICE', 'NOT_SURE')),
    CONSTRAINT projects_timeline_check CHECK (timeline IN ('ASAP', '1-3_MONTHS', '3-6_MONTHS', '6_PLUS_MONTHS')),
    CONSTRAINT projects_status_check CHECK (status IN ('DRAFT', 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'ARCHIVED')),
    CONSTRAINT projects_visibility_check CHECK (visibility IN ('PUBLIC', 'PRIVATE', 'INVITE_ONLY')),
    CONSTRAINT projects_type_check CHECK (project_type IN ('SINGLE_PROJECT', 'ONGOING', 'CONTRACT')),
    CONSTRAINT projects_priority_check CHECK (priority_level IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    CONSTRAINT projects_experience_check CHECK (experience_level IN ('ENTRY', 'INTERMEDIATE', 'SENIOR', 'LEAD', 'EXECUTIVE')),
    CONSTRAINT projects_counters_check CHECK (proposal_count >= 0 AND views_count >= 0),
    CONSTRAINT projects_duration_check CHECK (estimated_duration_days IS NULL OR estimated_duration_days > 0)
);

-- Performance Indexes
CREATE INDEX idx_projects_company_id ON projects(company_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_projects_category_id ON projects(category_id) WHERE deleted_at IS NULL;

-- Status-based partial indexes (most queries filter by status)
CREATE INDEX idx_projects_open ON projects(created_at DESC, budget_min, budget_max) 
    WHERE status = 'OPEN' AND deleted_at IS NULL;
CREATE INDEX idx_projects_featured ON projects(created_at DESC) 
    WHERE is_featured = TRUE AND status = 'OPEN' AND deleted_at IS NULL;

-- Budget range queries
CREATE INDEX idx_projects_budget_range ON projects(budget_min, budget_max) 
    WHERE budget_min IS NOT NULL AND status = 'OPEN' AND deleted_at IS NULL;

-- Experience level filtering
CREATE INDEX idx_projects_experience ON projects(experience_level, created_at DESC) 
    WHERE experience_level IS NOT NULL AND status = 'OPEN' AND deleted_at IS NULL;

-- CRITICAL: GIN indexes for JSONB skill matching
CREATE INDEX idx_projects_required_skills_gin ON projects USING GIN(required_skills);
CREATE INDEX idx_projects_preferred_skills_gin ON projects USING GIN(preferred_skills);
CREATE INDEX idx_projects_screening_questions_gin ON projects USING GIN(screening_questions);

-- Full-text search (GIN index)
CREATE INDEX idx_projects_search ON projects USING GIN(
    to_tsvector('english', title || ' ' || COALESCE(description, '') || ' ' || COALESCE(scope_of_work, ''))
) WHERE deleted_at IS NULL;

-- Composite index for common dashboard queries
CREATE INDEX idx_projects_company_status ON projects(company_id, status, created_at DESC) 
    WHERE deleted_at IS NULL;

-- Visibility and status combination
CREATE INDEX idx_projects_public_open ON projects(created_at DESC) 
    WHERE visibility = 'PUBLIC' AND status = 'OPEN' AND deleted_at IS NULL;

-- Trigger for updated_at
CREATE TRIGGER projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW 
    EXECUTE FUNCTION update_timestamp();

-- Trigger to prevent negative counters
CREATE OR REPLACE FUNCTION prevent_negative_counters()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.proposal_count < 0 THEN
        NEW.proposal_count = 0;
    END IF;
    IF NEW.views_count < 0 THEN
        NEW.views_count = 0;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_counter_check
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION prevent_negative_counters();

COMMENT ON TABLE projects IS 'Freelance and gig projects posted by companies';
COMMENT ON COLUMN projects.required_skills IS 'JSONB array: [{"skill": "React", "years": 2, "required": true}]';
COMMENT ON COLUMN projects.preferred_skills IS 'JSONB array: [{"skill": "TypeScript", "nice_to_have": true}]';
COMMENT ON COLUMN projects.screening_questions IS 'JSONB array: [{"question": "Experience with AWS?", "required": true}]';
COMMENT ON COLUMN projects.deliverables IS 'Text array of simple deliverable strings';