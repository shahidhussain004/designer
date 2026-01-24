-- =====================================================
-- V8: Create Proposals Table
-- Description: Freelancer proposals for projects
-- OPTIMIZED: json → jsonb, budget in cents, GIN indexes
-- =====================================================

CREATE TABLE IF NOT EXISTS proposals (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    freelancer_id BIGINT NOT NULL REFERENCES freelancers(id) ON DELETE CASCADE,
    
    -- Proposal Information
    cover_letter TEXT NOT NULL,
    suggested_budget_cents BIGINT, -- CHANGED: Store in cents
    proposed_timeline VARCHAR(100),
    estimated_hours NUMERIC(10,2),
    attachments TEXT[] DEFAULT '{}', -- Simple array of URLs
    portfolio_links TEXT[] DEFAULT '{}', -- Simple array of URLs
    
    -- Answers to screening questions (CHANGED: json → jsonb)
    -- Format: [{"question": "What is your experience?", "answer": "5 years with React"}]
    answers JSONB DEFAULT '[]'::jsonb,
    
    -- Status & Engagement
    status VARCHAR(50) DEFAULT 'SUBMITTED' NOT NULL,
    is_featured BOOLEAN DEFAULT FALSE,
    company_notes TEXT,
    rejection_reason TEXT,
    
    -- Ratings & Reviews (after completion)
    company_rating NUMERIC(3,1),
    company_review TEXT,
    freelancer_rating NUMERIC(3,1),
    freelancer_review TEXT,
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    reviewed_at TIMESTAMP(6),
    
    -- Unique constraint to prevent duplicate proposals per project-freelancer
    CONSTRAINT unique_project_freelancer UNIQUE(project_id, freelancer_id),
    CONSTRAINT proposals_status_check CHECK (status IN ('SUBMITTED', 'REVIEWING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN')),
    CONSTRAINT proposals_company_rating_check CHECK (company_rating IS NULL OR (company_rating >= 0 AND company_rating <= 5)),
    CONSTRAINT proposals_freelancer_rating_check CHECK (freelancer_rating IS NULL OR (freelancer_rating >= 0 AND freelancer_rating <= 5)),
    CONSTRAINT proposals_budget_check CHECK (suggested_budget_cents IS NULL OR suggested_budget_cents >= 0),
    CONSTRAINT proposals_hours_check CHECK (estimated_hours IS NULL OR estimated_hours > 0)
);

-- Performance indexes
CREATE INDEX idx_proposals_project_id ON proposals(project_id);
CREATE INDEX idx_proposals_freelancer_id ON proposals(freelancer_id);
CREATE INDEX idx_proposals_created_at ON proposals(created_at DESC);

-- Status-based partial indexes
CREATE INDEX idx_proposals_reviewing ON proposals(project_id, created_at DESC) 
    WHERE status IN ('SUBMITTED', 'REVIEWING');
CREATE INDEX idx_proposals_shortlisted ON proposals(project_id, created_at DESC) 
    WHERE status = 'SHORTLISTED';
CREATE INDEX idx_proposals_featured ON proposals(project_id, created_at DESC) 
    WHERE is_featured = TRUE;

-- Budget range for filtering
CREATE INDEX idx_proposals_budget ON proposals(suggested_budget_cents) 
    WHERE suggested_budget_cents IS NOT NULL;

-- GIN index for answers searching
CREATE INDEX idx_proposals_answers_gin ON proposals USING GIN(answers);

-- Composite index for freelancer dashboard
CREATE INDEX idx_proposals_freelancer_status ON proposals(freelancer_id, status, created_at DESC);

-- Trigger for updated_at
CREATE TRIGGER proposals_updated_at 
    BEFORE UPDATE ON proposals 
    FOR EACH ROW 
    EXECUTE FUNCTION update_timestamp();

-- Trigger to increment project proposal count
CREATE OR REPLACE FUNCTION increment_project_proposal_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE projects
    SET proposal_count = proposal_count + 1
    WHERE id = NEW.project_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_increment_project_proposal_count
    AFTER INSERT ON proposals
    FOR EACH ROW
    EXECUTE FUNCTION increment_project_proposal_count();

-- Trigger to decrement project proposal count
CREATE OR REPLACE FUNCTION decrement_project_proposal_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE projects
    SET proposal_count = GREATEST(0, proposal_count - 1)
    WHERE id = OLD.project_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_decrement_project_proposal_count
    AFTER DELETE ON proposals
    FOR EACH ROW
    EXECUTE FUNCTION decrement_project_proposal_count();

COMMENT ON TABLE proposals IS 'Freelancer proposals submitted for project postings';
COMMENT ON COLUMN proposals.status IS 'Proposal status: SUBMITTED, REVIEWING, SHORTLISTED, ACCEPTED, REJECTED, WITHDRAWN';
COMMENT ON COLUMN proposals.suggested_budget_cents IS 'Proposed budget in cents (e.g., $2500 = 250000)';
COMMENT ON COLUMN proposals.answers IS 'JSONB array: [{"question": "What is your experience?", "answer": "5 years with React"}]';
COMMENT ON COLUMN proposals.attachments IS 'Text array of attachment URLs';
COMMENT ON COLUMN proposals.portfolio_links IS 'Text array of portfolio URLs';