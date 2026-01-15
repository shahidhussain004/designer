-- =====================================================
-- V9: Create Contracts Table
-- Description: Formal agreements between companies and freelancers
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
    contract_type VARCHAR(20) NOT NULL, -- FIXED_PRICE, HOURLY, MILESTONE_BASED
    total_amount NUMERIC(12,2) NOT NULL,
    
    -- Payment Schedule
    payment_schedule VARCHAR(20), -- UPFRONT, ON_COMPLETION, MILESTONE_BASED, WEEKLY, MONTHLY
    
    -- Timeline
    start_date DATE,
    end_date DATE,
    
    -- Status
    status VARCHAR(20) DEFAULT 'DRAFT' NOT NULL,
    
    -- Completion
    completed_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_contract_type CHECK (contract_type IN ('FIXED_PRICE', 'HOURLY', 'MILESTONE_BASED')),
    CONSTRAINT chk_payment_schedule CHECK (payment_schedule IN ('UPFRONT', 'ON_COMPLETION', 'MILESTONE_BASED', 'WEEKLY', 'MONTHLY')),
    CONSTRAINT chk_contract_status CHECK (status IN ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'DISPUTED')),
    CONSTRAINT chk_contract_dates CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_contracts_project_id ON contracts(project_id);
CREATE INDEX IF NOT EXISTS idx_contracts_company_id ON contracts(company_id);
CREATE INDEX IF NOT EXISTS idx_contracts_freelancer_id ON contracts(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts(status);
CREATE INDEX IF NOT EXISTS idx_contracts_created_at ON contracts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contracts_company_freelancer ON contracts(company_id, freelancer_id);
-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_contracts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_contracts_updated_at
BEFORE UPDATE ON contracts
FOR EACH ROW
EXECUTE FUNCTION update_contracts_updated_at();

-- Create trigger to update user completion rate
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

CREATE OR REPLACE FUNCTION can_user_create_contract(user_id_param BIGINT, max_contracts INTEGER DEFAULT 10)
RETURNS BOOLEAN AS $$
DECLARE
    current_count INTEGER;
BEGIN
    current_count := get_user_active_contracts_count(user_id_param);
    RETURN current_count < max_contracts;
END;
$$ LANGUAGE plpgsql;

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

CREATE OR REPLACE FUNCTION update_user_completion_rate()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status IN ('COMPLETED', 'CANCELLED') AND 
       (OLD.status IS NULL OR OLD.status != NEW.status) THEN
        
        UPDATE users
        SET completion_rate = calculate_user_completion_rate(NEW.freelancer_id)
        WHERE id = NEW.freelancer_id;
        
        UPDATE users
        SET completion_rate = calculate_user_completion_rate(NEW.company_id)
        WHERE id = NEW.company_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_user_completion_rate
AFTER UPDATE ON contracts
FOR EACH ROW
EXECUTE FUNCTION update_user_completion_rate();

COMMENT ON TABLE contracts IS 'Formal agreements between companies and freelancers for project completion';
COMMENT ON COLUMN contracts.contract_type IS 'Type: FIXED_PRICE (lump sum), HOURLY (time-based), MILESTONE_BASED';
COMMENT ON COLUMN contracts.payment_schedule IS 'How payments are released: UPFRONT, ON_COMPLETION, MILESTONE_BASED, WEEKLY, MONTHLY';
COMMENT ON COLUMN contracts.status IS 'Contract status: PENDING, ACTIVE, COMPLETED, CANCELLED, DISPUTED';
