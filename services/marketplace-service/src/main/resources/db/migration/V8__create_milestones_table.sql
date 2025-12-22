-- V8: Create milestones table for milestone-based payments
-- Description: Creates milestones table to support breaking jobs into smaller deliverables with separate payments

-- Milestones table - supports milestone-based payments for jobs
CREATE TABLE milestones (
    id BIGSERIAL PRIMARY KEY,
    
    -- Relationships
    job_id BIGINT NOT NULL REFERENCES jobs(id),
    proposal_id BIGINT REFERENCES proposals(id),
    payment_id BIGINT REFERENCES payments(id),
    escrow_id BIGINT REFERENCES escrow(id),
    
    -- Milestone details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    sequence_order INTEGER NOT NULL,
    
    -- Amount for this milestone (in cents to avoid floating point issues)
    amount BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Deliverables and revision tracking
    deliverables TEXT,
    revision_notes TEXT,
    
    -- Status tracking
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    
    -- Due date
    due_date TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMP,
    submitted_at TIMESTAMP,
    approved_at TIMESTAMP,
    
    CONSTRAINT chk_milestone_status CHECK (status IN ('PENDING', 'FUNDED', 'IN_PROGRESS', 'SUBMITTED', 'REVISION_REQUESTED', 'APPROVED', 'CANCELLED', 'DISPUTED'))
);

-- Add foreign key constraint for invoices.milestone_id
ALTER TABLE invoices ADD CONSTRAINT fk_invoices_milestone FOREIGN KEY (milestone_id) REFERENCES milestones(id);

-- Add foreign key constraint for invoices.job_id
ALTER TABLE invoices ADD CONSTRAINT fk_invoices_job FOREIGN KEY (job_id) REFERENCES jobs(id);

-- Performance indexes for milestones
CREATE INDEX idx_milestones_job ON milestones(job_id);
CREATE INDEX idx_milestones_proposal ON milestones(proposal_id);
CREATE INDEX idx_milestones_payment ON milestones(payment_id);
CREATE INDEX idx_milestones_escrow ON milestones(escrow_id);
CREATE INDEX idx_milestones_status ON milestones(status);
CREATE INDEX idx_milestones_due_date ON milestones(due_date);
CREATE INDEX idx_milestones_sequence ON milestones(job_id, sequence_order);

-- Create trigger to automatically update updated_at on changes
CREATE OR REPLACE FUNCTION update_milestones_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_milestones_updated_at_trigger
BEFORE UPDATE ON milestones
FOR EACH ROW
EXECUTE FUNCTION update_milestones_updated_at();
