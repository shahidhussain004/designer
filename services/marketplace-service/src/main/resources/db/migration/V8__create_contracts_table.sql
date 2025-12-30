-- V8__create_contracts_table.sql
-- Create contracts table for formal agreements between clients and freelancers
-- Supports both fixed-price and hourly contracts with milestone and payment tracking

CREATE TABLE contracts (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL,
    client_id BIGINT NOT NULL,
    freelancer_id BIGINT NOT NULL,
    proposal_id BIGINT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    contract_type VARCHAR(20) NOT NULL, -- 'FIXED' or 'HOURLY'
    total_amount DECIMAL(12, 2) NOT NULL,
    payment_schedule VARCHAR(20), -- 'UPFRONT', 'MILESTONE', 'HOURLY'
    status VARCHAR(20) DEFAULT 'DRAFT', -- 'DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'DISPUTED'
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    CONSTRAINT fk_contract_job FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    CONSTRAINT fk_contract_client FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_contract_freelancer FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_contract_proposal FOREIGN KEY (proposal_id) REFERENCES proposals(id) ON DELETE SET NULL,
    CONSTRAINT chk_contract_type CHECK (contract_type IN ('FIXED', 'HOURLY')),
    CONSTRAINT chk_contract_payment_schedule CHECK (payment_schedule IN ('UPFRONT', 'MILESTONE', 'HOURLY')),
    CONSTRAINT chk_contract_status CHECK (status IN ('DRAFT', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'DISPUTED'))
);

-- Indexes for efficient queries
CREATE INDEX idx_contracts_job_id ON contracts(job_id);
CREATE INDEX idx_contracts_client_id ON contracts(client_id);
CREATE INDEX idx_contracts_freelancer_id ON contracts(freelancer_id);
CREATE INDEX idx_contracts_proposal_id ON contracts(proposal_id);
CREATE INDEX idx_contracts_status ON contracts(status);
CREATE INDEX idx_contracts_status_dates ON contracts(status, created_at DESC);
CREATE INDEX idx_contracts_type_status ON contracts(contract_type, status);

-- Trigger for updated_at timestamp
CREATE TRIGGER update_contracts_updated_at
    BEFORE UPDATE ON contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE contracts IS 'Formal agreements between clients and freelancers for job completion';
COMMENT ON COLUMN contracts.contract_type IS 'Type of contract: FIXED (fixed price) or HOURLY (time-based)';
COMMENT ON COLUMN contracts.payment_schedule IS 'How payments are released: UPFRONT, MILESTONE, or HOURLY';
COMMENT ON COLUMN contracts.status IS 'Current contract status: DRAFT, ACTIVE, COMPLETED, CANCELLED, or DISPUTED';
