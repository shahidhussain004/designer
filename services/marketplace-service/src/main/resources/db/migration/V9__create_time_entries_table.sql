-- V9__create_time_entries_table.sql
-- Create time_entries table for tracking work hours on hourly contracts
-- Freelancers log time, clients approve/reject entries before payment

CREATE TABLE time_entries (
    id BIGSERIAL PRIMARY KEY,
    contract_id BIGINT NOT NULL,
    freelancer_id BIGINT NOT NULL,
    description TEXT,
    hours_worked DECIMAL(8, 2) NOT NULL,
    rate_per_hour DECIMAL(10, 2) NOT NULL,
    work_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING', -- 'PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED', 'PAID'
    approved_at TIMESTAMP,
    paid_at TIMESTAMP,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_time_entry_contract FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
    CONSTRAINT fk_time_entry_freelancer FOREIGN KEY (freelancer_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_time_entry_status CHECK (status IN ('PENDING', 'SUBMITTED', 'APPROVED', 'REJECTED', 'PAID')),
    CONSTRAINT chk_hours_worked_positive CHECK (hours_worked > 0),
    CONSTRAINT chk_rate_per_hour_positive CHECK (rate_per_hour > 0)
);

-- Indexes for efficient queries
CREATE INDEX idx_time_entries_contract_id ON time_entries(contract_id);
CREATE INDEX idx_time_entries_freelancer_id ON time_entries(freelancer_id);
CREATE INDEX idx_time_entries_status ON time_entries(status);
CREATE INDEX idx_time_entries_work_date ON time_entries(work_date DESC);
CREATE INDEX idx_time_entries_contract_date ON time_entries(contract_id, work_date DESC);
CREATE INDEX idx_time_entries_contract_status ON time_entries(contract_id, status);

-- Trigger for updated_at timestamp
CREATE TRIGGER update_time_entries_updated_at
    BEFORE UPDATE ON time_entries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE time_entries IS 'Time tracking entries for hourly contracts with approval workflow';
COMMENT ON COLUMN time_entries.hours_worked IS 'Number of hours worked (can be fractional, e.g., 2.5 hours)';
COMMENT ON COLUMN time_entries.rate_per_hour IS 'Hourly rate agreed upon in the contract';
COMMENT ON COLUMN time_entries.status IS 'Entry status: PENDING, SUBMITTED, APPROVED, REJECTED, or PAID';
COMMENT ON COLUMN time_entries.work_date IS 'Date when the work was performed';
