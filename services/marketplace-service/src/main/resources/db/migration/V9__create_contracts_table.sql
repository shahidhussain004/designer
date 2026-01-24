-- =====================================================
-- V9: Create Contracts Table
-- Description: Formal agreements between companies and freelancers
-- OPTIMIZED: Amount in cents, better indexes, helper functions
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
    total_amount_cents BIGINT NOT NULL, -- CHANGED: Store in cents
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    
    -- Payment Schedule
    payment_schedule VARCHAR(20),
    
    -- Timeline
    start_date DATE,
    end_date DATE,
    
    -- Status
    status VARCHAR(20) DEFAULT 'PENDING' NOT NULL,
    
    -- Completion
    completed_at TIMESTAMP(6),
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Constraints
    CONSTRAINT contracts_type_check CHECK (contract_type IN ('FIXED_PRICE', 'HOURLY', 'MILESTONE_BASED')),
    CONSTRAINT contracts_payment_schedule_check CHECK (payment_schedule IN ('UPFRONT', 'ON_COMPLETION', 'MILESTONE_BASED', 'WEEKLY', 'MONTHLY')),
    CONSTRAINT contracts_status_check CHECK (status IN ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'DISPUTED')),
    CONSTRAINT contracts_dates_check CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date),
    CONSTRAINT contracts_amount_check CHECK (total_amount_cents > 0)
);

-- Performance indexes
CREATE INDEX idx_contracts_project_id ON contracts(project_id);
CREATE INDEX idx_contracts_company_id ON contracts(company_id);
CREATE INDEX idx_contracts_freelancer_id ON contracts(freelancer_id);
CREATE INDEX idx_contracts_proposal_id ON contracts(proposal_id) WHERE proposal_id IS NOT NULL;
CREATE INDEX idx_contracts_created_at ON contracts(created_at DESC);

-- Status-based partial indexes
CREATE INDEX idx_contracts_active ON contracts(company_id, freelancer_id, created_at DESC) 
    WHERE status = 'ACTIVE';
CREATE INDEX idx_contracts_pending ON contracts(company_id, created_at DESC) 
    WHERE status = 'PENDING';

-- Composite indexes for dashboards
CREATE INDEX idx_contracts_company_status ON contracts(company_id, status, created_at DESC);
CREATE INDEX idx_contracts_freelancer_status ON contracts(freelancer_id, status, created_at DESC);

-- Date-based filtering
CREATE INDEX idx_contracts_dates ON contracts(start_date, end_date) 
    WHERE start_date IS NOT NULL;

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

COMMENT ON TABLE contracts IS 'Formal agreements between companies and freelancers for project completion';
COMMENT ON COLUMN contracts.contract_type IS 'Type: FIXED_PRICE (lump sum), HOURLY (time-based), MILESTONE_BASED';
COMMENT ON COLUMN contracts.payment_schedule IS 'How payments are released: UPFRONT, ON_COMPLETION, MILESTONE_BASED, WEEKLY, MONTHLY';
COMMENT ON COLUMN contracts.status IS 'Contract status: PENDING, ACTIVE, COMPLETED, CANCELLED, DISPUTED';
COMMENT ON COLUMN contracts.total_amount_cents IS 'Total contract value in cents (e.g., $5000 = 500000)';