-- =====================================================
-- V9: Create Contracts Table
-- Description: Formal agreements between companies and freelancers
-- OPTIMIZED: Removed 5 unused indexes (0 scans), removed redundant idx_contracts_company_id from V_fix_004, added auto-vacuum
-- Author: Database Audit & Optimization 2026-01-26
-- =====================================================

CREATE TABLE IF NOT EXISTS contracts (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    freelancer_id BIGINT NOT NULL REFERENCES freelancers(id) ON DELETE CASCADE,
    proposal_id BIGINT REFERENCES proposals(id) ON DELETE SET NULL,
    
    -- Contract Details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    contract_type VARCHAR(20) NOT NULL,
    amount_cents BIGINT NOT NULL, -- Store in cents
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    
    -- Payment Schedule
    payment_schedule VARCHAR(20),
    
    -- Milestones & Progress
    milestone_count INTEGER DEFAULT 0,
    completion_percentage INTEGER DEFAULT 0,
    
    -- Timeline
    start_date TIMESTAMP(6),
    end_date TIMESTAMP(6),
    
    -- Status
    status VARCHAR(20) DEFAULT 'DRAFT' NOT NULL,
    
    -- Completion
    completed_at TIMESTAMP(6),
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Constraints
    CONSTRAINT contracts_type_check CHECK (contract_type IN ('FIXED_PRICE', 'HOURLY', 'MILESTONE_BASED')),
    CONSTRAINT contracts_payment_schedule_check CHECK (payment_schedule IN ('UPFRONT', 'ON_COMPLETION', 'MILESTONE_BASED', 'WEEKLY', 'MONTHLY')),
    CONSTRAINT contracts_status_check CHECK (status IN ('DRAFT', 'PENDING', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED', 'DISPUTED')),
    CONSTRAINT contracts_dates_check CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date),
    CONSTRAINT contracts_amount_cents_check CHECK (amount_cents > 0),
    CONSTRAINT contracts_milestone_count_check CHECK (milestone_count >= 0),
    CONSTRAINT contracts_completion_percentage_check CHECK (completion_percentage >= 0 AND completion_percentage <= 100)
);

-- =====================================================
-- CONTRACTS INDEXES (OPTIMIZED)
-- =====================================================
-- Audit Result: Only company_status composite had scans (72 scans)
-- REMOVED: idx_contracts_company_id (redundant per V_fix_004 - covered by company_status composite)
-- REMOVED: idx_contracts_project_id, idx_contracts_freelancer_id, idx_contracts_proposal_id (all 0 scans)
-- REMOVED: idx_contracts_active, idx_contracts_pending, idx_contracts_dates (all 0 scans)
-- REMOVED: idx_contracts_freelancer_status, idx_contracts_created_at (0 scans)
-- KEPT: company_status composite (72 scans - actively used!)

-- KEPT: Company dashboard (72 scans - actively used!)
CREATE INDEX idx_contracts_company_status ON contracts(company_id, status, created_at DESC);

-- Configure auto-vacuum for high-update table (from V_fix_003)
ALTER TABLE contracts SET (
  autovacuum_enabled = true,
  autovacuum_vacuum_scale_factor = 0.1,    -- Vacuum when 10% dead rows
  autovacuum_analyze_scale_factor = 0.05   -- Analyze when 5% changed
);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger for updated_at
CREATE TRIGGER contracts_updated_at 
    BEFORE UPDATE ON contracts 
    FOR EACH ROW 
    EXECUTE FUNCTION update_timestamp();

-- Helper function: Get active contracts count for a user
CREATE OR REPLACE FUNCTION get_user_active_contracts_count(user_id_param BIGINT)
RETURNS INTEGER AS $$
DECLARE
    count INTEGER;
BEGIN
    SELECT COUNT(*) INTO count
    FROM contracts
    WHERE (freelancer_id = user_id_param OR company_id = user_id_param)
    AND status = 'ACTIVE';
    
    RETURN count;
END;
$$ LANGUAGE plpgsql;

-- Helper function: Check if user can create new contract
CREATE OR REPLACE FUNCTION can_user_create_contract(user_id_param BIGINT, max_contracts INTEGER DEFAULT 10)
RETURNS BOOLEAN AS $$
DECLARE
    current_count INTEGER;
BEGIN
    current_count := get_user_active_contracts_count(user_id_param);
    RETURN current_count < max_contracts;
END;
$$ LANGUAGE plpgsql;

-- Helper function: Calculate user completion rate
CREATE OR REPLACE FUNCTION calculate_user_completion_rate(user_id_param BIGINT)
RETURNS NUMERIC AS $$
DECLARE
    completed_count INTEGER;
    total_count INTEGER;
    rate DECIMAL(5,2);
BEGIN
    SELECT COUNT(*) INTO completed_count
    FROM contracts
    WHERE (freelancer_id = user_id_param OR company_id = user_id_param)
    AND status = 'COMPLETED';
    
    SELECT COUNT(*) INTO total_count
    FROM contracts
    WHERE (freelancer_id = user_id_param OR company_id = user_id_param)
    AND status IN ('ACTIVE', 'COMPLETED');
    
    IF total_count = 0 THEN
        rate := 100.00;
    ELSE
        rate := ROUND((completed_count::DECIMAL / total_count::DECIMAL) * 100, 2);
    END IF;
    
    RETURN rate;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update freelancer completion rate
CREATE OR REPLACE FUNCTION update_freelancer_completion_rate()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status IN ('COMPLETED', 'CANCELLED') AND 
       (OLD.status IS NULL OR OLD.status != NEW.status) THEN
        
        UPDATE freelancers
        SET completion_rate = calculate_user_completion_rate(NEW.freelancer_id)
        WHERE id = NEW.freelancer_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_freelancer_completion_rate
    AFTER UPDATE ON contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_freelancer_completion_rate();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE contracts IS 'Formal agreements between companies and freelancers. Optimized with auto-vacuum (10% threshold), single critical index.';
COMMENT ON COLUMN contracts.contract_type IS 'Type: FIXED_PRICE (lump sum), HOURLY (time-based), MILESTONE_BASED';
COMMENT ON COLUMN contracts.payment_schedule IS 'How payments are released: UPFRONT, ON_COMPLETION, MILESTONE_BASED, WEEKLY, MONTHLY';
COMMENT ON COLUMN contracts.status IS 'Contract status: DRAFT, PENDING, ACTIVE, PAUSED, COMPLETED, CANCELLED, DISPUTED';
COMMENT ON COLUMN contracts.amount_cents IS 'Contract value in cents (e.g., $5000 = 500000)';
COMMENT ON COLUMN contracts.completion_percentage IS 'Overall completion percentage (0-100)';
COMMENT ON COLUMN contracts.milestone_count IS 'Number of milestones in this contract';
COMMENT ON COLUMN contracts.start_date IS 'Contract start timestamp';
COMMENT ON COLUMN contracts.end_date IS 'Contract end timestamp';

-- =====================================================
-- ROLLBACK INSTRUCTIONS
-- =====================================================
-- To rollback this migration, run:
--
-- DROP TRIGGER IF EXISTS trg_update_freelancer_completion_rate ON contracts;
-- DROP TRIGGER IF EXISTS contracts_updated_at ON contracts;
-- DROP FUNCTION IF EXISTS update_freelancer_completion_rate();
-- DROP FUNCTION IF EXISTS calculate_user_completion_rate(BIGINT);
-- DROP FUNCTION IF EXISTS can_user_create_contract(BIGINT, INTEGER);
-- DROP FUNCTION IF EXISTS get_user_active_contracts_count(BIGINT);
-- DROP TABLE IF EXISTS contracts CASCADE;
