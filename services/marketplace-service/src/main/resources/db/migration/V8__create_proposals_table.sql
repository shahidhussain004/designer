-- =====================================================
-- V8: Create Proposals Table
-- Description: Freelancer proposals for projects
-- =====================================================

CREATE TABLE IF NOT EXISTS proposals (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    freelancer_id BIGINT NOT NULL REFERENCES freelancers(id) ON DELETE CASCADE,
    
    -- Proposal Information
    cover_letter TEXT NOT NULL,
    suggested_budget NUMERIC(12,2),
    proposed_timeline VARCHAR(100),
    estimated_hours NUMERIC(10,2),
    attachments TEXT[],
    portfolio_links TEXT[],
    
    -- Answers to screening questions
    answers JSONB,
    
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
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    
    -- Unique constraint to prevent duplicate proposals per project-freelancer
    CONSTRAINT unique_project_freelancer UNIQUE(project_id, freelancer_id),
    CONSTRAINT chk_proposal_status CHECK (status IN ('SUBMITTED', 'REVIEWING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN')),
    CONSTRAINT chk_ratings CHECK (company_rating IS NULL OR (company_rating >= 0 AND company_rating <= 5)),
    CONSTRAINT chk_freelancer_rating CHECK (freelancer_rating IS NULL OR (freelancer_rating >= 0 AND freelancer_rating <= 5))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_proposals_project_id ON proposals(project_id);
CREATE INDEX IF NOT EXISTS idx_proposals_freelancer_id ON proposals(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_proposals_status ON proposals(status);
CREATE INDEX IF NOT EXISTS idx_proposals_created_at ON proposals(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_proposals_is_featured ON proposals(is_featured);
CREATE INDEX IF NOT EXISTS idx_proposals_project_freelancer ON proposals(project_id, freelancer_id);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_proposals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_proposals_updated_at
BEFORE UPDATE ON proposals
FOR EACH ROW
EXECUTE FUNCTION update_proposals_updated_at();

-- Create trigger to increment project proposal count
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

-- Create trigger to decrement project proposal count
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
COMMENT ON COLUMN proposals.answers IS 'JSON object with answers to project screening questions';
