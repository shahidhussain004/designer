-- =====================================================
-- V8: Create Proposals Table
-- Description: Freelancer proposals for projects
-- OPTIMIZED: Removed 6 unused indexes (0 scans), removed redundant idx_proposals_freelancer_id from V_fix_004, added auto-vacuum
-- Author: Database Audit & Optimization 2026-01-26
-- =====================================================

CREATE TABLE IF NOT EXISTS proposals (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    freelancer_id BIGINT NOT NULL REFERENCES freelancers(id) ON DELETE CASCADE,
    
    -- Proposal Information
    cover_letter TEXT NOT NULL,
    suggested_budget_cents BIGINT, -- Store in cents
    proposed_timeline VARCHAR(100),
    estimated_hours NUMERIC(10,2),
    attachments TEXT[] DEFAULT '{}', -- Simple array of URLs
    portfolio_links TEXT[] DEFAULT '{}', -- Simple array of URLs
    
    -- Answers to screening questions
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

-- =====================================================
-- PROPOSALS INDEXES (OPTIMIZED)
-- =====================================================
-- Audit Result: Only primary key and project_id had scans
-- REMOVED: idx_proposals_freelancer_id (redundant per V_fix_004 - covered by freelancer_status composite)
-- REMOVED: idx_proposals_reviewing, idx_proposals_shortlisted, idx_proposals_featured (all 0 scans)
-- REMOVED: idx_proposals_budget (0 scans - budget filtering not used)
-- REMOVED: idx_proposals_answers_gin (0 scans - JSONB search not used yet)
-- KEPT: project_id (essential FK), freelancer_status composite, created_at

-- KEPT: Essential foreign key index
CREATE INDEX idx_proposals_project_id ON proposals(project_id);

-- KEPT: Freelancer dashboard (covers freelancer_id queries)
CREATE INDEX idx_proposals_freelancer_status ON proposals(freelancer_id, status, created_at DESC);

-- KEPT: Time-based sorting
CREATE INDEX idx_proposals_created_at ON proposals(created_at DESC);

-- Configure auto-vacuum for high-update table (from V_fix_003)
ALTER TABLE proposals SET (
  autovacuum_enabled = true,
  autovacuum_vacuum_scale_factor = 0.1,    -- Vacuum when 10% dead rows
  autovacuum_analyze_scale_factor = 0.05   -- Analyze when 5% changed
);

-- =====================================================
-- TRIGGERS
-- =====================================================

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

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE proposals IS 'Freelancer proposals submitted for project postings. Optimized with auto-vacuum (10% threshold), minimal indexes.';
COMMENT ON COLUMN proposals.status IS 'Proposal status: SUBMITTED, REVIEWING, SHORTLISTED, ACCEPTED, REJECTED, WITHDRAWN';
COMMENT ON COLUMN proposals.suggested_budget_cents IS 'Proposed budget in cents (e.g., $2500 = 250000)';
COMMENT ON COLUMN proposals.answers IS 'JSONB array: [{"question": "What is your experience?", "answer": "5 years with React"}]';
COMMENT ON COLUMN proposals.attachments IS 'Text array of attachment URLs';
COMMENT ON COLUMN proposals.portfolio_links IS 'Text array of portfolio URLs';

-- =====================================================
-- ROLLBACK INSTRUCTIONS
-- =====================================================
-- To rollback this migration, run:
--
-- DROP TRIGGER IF EXISTS trg_decrement_project_proposal_count ON proposals;
-- DROP TRIGGER IF EXISTS trg_increment_project_proposal_count ON proposals;
-- DROP TRIGGER IF EXISTS proposals_updated_at ON proposals;
-- DROP FUNCTION IF EXISTS decrement_project_proposal_count();
-- DROP FUNCTION IF EXISTS increment_project_proposal_count();
-- DROP TABLE IF EXISTS proposals CASCADE;
