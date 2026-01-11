-- =====================================================
-- V11: Create Invoices & Milestones Tables
-- Description: Invoice management and project milestones tracking
-- =====================================================

CREATE TABLE IF NOT EXISTS invoices (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    contract_id BIGINT REFERENCES contracts(id) ON DELETE SET NULL,
    milestone_id BIGINT,
    
    -- Parties
    company_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    freelancer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    payment_id BIGINT NOT NULL,
    
    -- Invoice Information
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    invoice_type VARCHAR(30) NOT NULL, -- PAYMENT, MILESTONE, REFUND, PAYOUT
    invoice_date TIMESTAMP NOT NULL,
    due_date TIMESTAMP,
    paid_at TIMESTAMP,
    
    -- Amounts
    subtotal BIGINT NOT NULL,
    tax_amount BIGINT,
    platform_fee BIGINT,
    total BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Details
    line_items TEXT,
    company_billing_info TEXT,
    freelancer_billing_info TEXT,
    notes TEXT,
    pdf_url TEXT,
    
    -- Status
    status VARCHAR(30) NOT NULL, -- DRAFT, SENT, PAID, OVERDUE, CANCELLED, REFUNDED
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_invoice_type CHECK (invoice_type IN ('PAYMENT', 'MILESTONE', 'REFUND', 'PAYOUT')),
    CONSTRAINT chk_invoice_status CHECK (status IN ('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED')),
    CONSTRAINT chk_invoice_amounts CHECK (total >= subtotal)
);

-- Create indexes for invoices
CREATE INDEX IF NOT EXISTS idx_invoices_project_id ON invoices(project_id);
CREATE INDEX IF NOT EXISTS idx_invoices_company_id ON invoices(company_id);
CREATE INDEX IF NOT EXISTS idx_invoices_freelancer_id ON invoices(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at ON invoices(created_at DESC);

CREATE TABLE IF NOT EXISTS milestones (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    contract_id BIGINT REFERENCES contracts(id) ON DELETE SET NULL,
    
    -- Milestone Details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    deliverables TEXT[],
    
    -- Financial
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Timeline
    due_date DATE NOT NULL,
    start_date DATE,
    completed_at TIMESTAMP,
    
    -- Status & Approval
    status VARCHAR(50) DEFAULT 'PENDING' NOT NULL, -- PENDING, IN_PROGRESS, SUBMITTED, APPROVED, REJECTED, CANCELLED
    order_number INTEGER,
    
    -- Approval & Feedback
    company_notes TEXT,
    freelancer_notes TEXT,
    approval_date TIMESTAMP,
    rejection_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_milestone_amount CHECK (amount > 0),
    CONSTRAINT chk_milestone_status CHECK (status IN ('PENDING', 'IN_PROGRESS', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED')),
    CONSTRAINT chk_milestone_dates CHECK (due_date IS NULL OR start_date IS NULL OR due_date >= start_date)
);

-- Create indexes for milestones
CREATE INDEX IF NOT EXISTS idx_milestones_project_id ON milestones(project_id);
CREATE INDEX IF NOT EXISTS idx_milestones_contract_id ON milestones(contract_id);
CREATE INDEX IF NOT EXISTS idx_milestones_status ON milestones(status);
CREATE INDEX IF NOT EXISTS idx_milestones_due_date ON milestones(due_date);
CREATE INDEX IF NOT EXISTS idx_milestones_created_at ON milestones(created_at DESC);

-- Create trigger for invoices updated_at
CREATE OR REPLACE FUNCTION update_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_invoices_updated_at
BEFORE UPDATE ON invoices
FOR EACH ROW
EXECUTE FUNCTION update_invoices_updated_at();

-- Create trigger for milestones updated_at
CREATE OR REPLACE FUNCTION update_milestones_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_milestones_updated_at
BEFORE UPDATE ON milestones
FOR EACH ROW
EXECUTE FUNCTION update_milestones_updated_at();

COMMENT ON TABLE invoices IS 'Invoicing and billing records for payments and transactions';
COMMENT ON COLUMN invoices.invoice_type IS 'Type: PAYMENT (for services), MILESTONE (for milestone completion), REFUND, PAYOUT';
COMMENT ON COLUMN invoices.status IS 'Invoice status: DRAFT, SENT, PAID, OVERDUE, CANCELLED, REFUNDED';
COMMENT ON TABLE milestones IS 'Project milestones with deliverables and payment tied to completion';
COMMENT ON COLUMN milestones.status IS 'Status: PENDING, IN_PROGRESS, SUBMITTED (by freelancer), APPROVED, REJECTED, CANCELLED';
