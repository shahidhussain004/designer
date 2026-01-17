-- =====================================================
-- V11 REFACTORED: Optimized Invoices & Milestones
-- Key improvements:
-- 1. Changed line_items from TEXT to JSONB
-- 2. Changed deliverables from TEXT[] to JSONB for richer data
-- 3. Added proper amount validation
-- 4. Improved indexes for invoice number lookups
-- 5. Added invoice sequence for auto-numbering
-- =====================================================

-- Invoice number sequence
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1000;

CREATE TABLE IF NOT EXISTS invoices (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    contract_id BIGINT REFERENCES contracts(id) ON DELETE SET NULL,
    milestone_id BIGINT REFERENCES milestones(id) ON DELETE SET NULL,
    
    -- Parties
    company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    freelancer_id BIGINT NOT NULL REFERENCES freelancers(id) ON DELETE CASCADE,
    payment_id BIGINT REFERENCES payments(id) ON DELETE SET NULL,
    
    -- Invoice Information
    invoice_number VARCHAR(50) NOT NULL,
    invoice_type VARCHAR(30) NOT NULL,
    invoice_date TIMESTAMP(6) NOT NULL,
    due_date TIMESTAMP(6),
    paid_at TIMESTAMP(6),
    
    -- Amounts (using BIGINT for cents to avoid floating point issues)
    subtotal_cents BIGINT NOT NULL,
    tax_amount_cents BIGINT DEFAULT 0 NOT NULL,
    platform_fee_cents BIGINT DEFAULT 0 NOT NULL,
    total_cents BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    
    -- Details (CHANGED: TEXT → JSONB for line_items)
    line_items JSONB DEFAULT '[]'::jsonb NOT NULL,
    company_billing_info JSONB,
    freelancer_billing_info JSONB,
    notes TEXT,
    pdf_url TEXT,
    
    -- Status
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Constraints
    CONSTRAINT invoices_type_check CHECK (invoice_type IN ('PAYMENT', 'MILESTONE', 'REFUND', 'PAYOUT')),
    CONSTRAINT invoices_status_check CHECK (status IN ('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED')),
    CONSTRAINT invoices_amounts_check CHECK (
        subtotal_cents >= 0 AND 
        tax_amount_cents >= 0 AND 
        platform_fee_cents >= 0 AND
        total_cents = subtotal_cents + tax_amount_cents + platform_fee_cents
    ),
    CONSTRAINT invoices_due_date_check CHECK (due_date IS NULL OR due_date >= invoice_date),
    CONSTRAINT invoices_paid_check CHECK (
        (status = 'PAID' AND paid_at IS NOT NULL) OR
        (status != 'PAID')
    )
);

-- Unique index for invoice_number
CREATE UNIQUE INDEX idx_invoices_invoice_number ON invoices(invoice_number);

-- Indexes
CREATE INDEX idx_invoices_project_id ON invoices(project_id);
CREATE INDEX idx_invoices_contract_id ON invoices(contract_id) WHERE contract_id IS NOT NULL;
CREATE INDEX idx_invoices_milestone_id ON invoices(milestone_id) WHERE milestone_id IS NOT NULL;
CREATE INDEX idx_invoices_company_id ON invoices(company_id);
CREATE INDEX idx_invoices_freelancer_id ON invoices(freelancer_id);
CREATE INDEX idx_invoices_payment_id ON invoices(payment_id) WHERE payment_id IS NOT NULL;

-- Status-based partial indexes
CREATE INDEX idx_invoices_unpaid ON invoices(due_date, company_id) 
    WHERE status IN ('SENT', 'OVERDUE');
CREATE INDEX idx_invoices_overdue ON invoices(due_date, company_id) 
    WHERE status = 'OVERDUE';

-- Date-based indexes for reporting
CREATE INDEX idx_invoices_date_range ON invoices(invoice_date, status);
CREATE INDEX idx_invoices_created_desc ON invoices(created_at DESC);

-- GIN index for line_items searching
CREATE INDEX idx_invoices_line_items_gin ON invoices USING GIN(line_items);

CREATE TABLE IF NOT EXISTS milestones (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    contract_id BIGINT REFERENCES contracts(id) ON DELETE SET NULL,
    
    -- Milestone Details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    deliverables JSONB DEFAULT '[]'::jsonb NOT NULL, -- CHANGED: TEXT[] → JSONB
    
    -- Financial (using cents for precision)
    amount_cents BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    
    -- Timeline
    due_date DATE NOT NULL,
    start_date DATE,
    completed_at TIMESTAMP(6),
    
    -- Status & Approval
    status VARCHAR(50) DEFAULT 'PENDING' NOT NULL,
    order_number INTEGER NOT NULL,
    
    -- Approval & Feedback
    company_notes TEXT,
    freelancer_notes TEXT,
    approval_date TIMESTAMP(6),
    rejection_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Constraints
    CONSTRAINT milestones_amount_check CHECK (amount_cents > 0),
    CONSTRAINT milestones_status_check CHECK (status IN ('PENDING', 'IN_PROGRESS', 'SUBMITTED', 'APPROVED', 'REJECTED', 'CANCELLED')),
    CONSTRAINT milestones_dates_check CHECK (due_date IS NULL OR start_date IS NULL OR due_date >= start_date),
    CONSTRAINT milestones_order_check CHECK (order_number > 0),
    CONSTRAINT milestones_approval_check CHECK (
        (status = 'APPROVED' AND approval_date IS NOT NULL) OR
        (status != 'APPROVED')
    )
);

-- Indexes
CREATE INDEX idx_milestones_project_id ON milestones(project_id);
CREATE INDEX idx_milestones_contract_id ON milestones(contract_id) WHERE contract_id IS NOT NULL;
CREATE INDEX idx_milestones_status ON milestones(status);
CREATE INDEX idx_milestones_due_date ON milestones(due_date);

-- Composite index for project milestone ordering
CREATE INDEX idx_milestones_project_order ON milestones(project_id, order_number);

-- Pending approval queue
CREATE INDEX idx_milestones_pending ON milestones(project_id, created_at DESC) 
    WHERE status = 'SUBMITTED';

-- Overdue milestones
CREATE INDEX idx_milestones_overdue ON milestones(due_date, project_id) 
    WHERE status IN ('PENDING', 'IN_PROGRESS') AND due_date < CURRENT_DATE;

-- GIN index for deliverables
CREATE INDEX idx_milestones_deliverables_gin ON milestones USING GIN(deliverables);

-- Triggers
CREATE TRIGGER invoices_updated_at 
    BEFORE UPDATE ON invoices 
    FOR EACH ROW 
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER milestones_updated_at 
    BEFORE UPDATE ON milestones 
    FOR EACH ROW 
    EXECUTE FUNCTION update_timestamp();

-- Auto-generate invoice number if not provided
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.invoice_number IS NULL OR NEW.invoice_number = '' THEN
        NEW.invoice_number = 'INV-' || TO_CHAR(NEW.invoice_date, 'YYYYMM') || '-' || 
                            LPAD(nextval('invoice_number_seq')::TEXT, 6, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER invoices_generate_number
    BEFORE INSERT ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION generate_invoice_number();

-- Trigger to set approval_date
CREATE OR REPLACE FUNCTION set_milestone_approval_date()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'APPROVED' AND OLD.status != 'APPROVED' THEN
        NEW.approval_date = CURRENT_TIMESTAMP;
        NEW.completed_at = CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER milestones_approval_date
    BEFORE UPDATE ON milestones
    FOR EACH ROW
    EXECUTE FUNCTION set_milestone_approval_date();

COMMENT ON TABLE invoices IS 'Invoice records for payments and transactions';
COMMENT ON COLUMN invoices.line_items IS 'JSONB array: [{"description": "...", "quantity": 1, "unit_price": 5000, "total": 5000}]';
COMMENT ON COLUMN invoices.subtotal_cents IS 'Amount in cents (e.g., $100.00 = 10000)';
COMMENT ON COLUMN invoices.company_billing_info IS 'JSONB: {"name": "...", "address": "...", "tax_id": "..."}';

COMMENT ON TABLE milestones IS 'Project milestones with deliverables and payment';
COMMENT ON COLUMN milestones.deliverables IS 'JSONB array: [{"description": "...", "completed": false, "approved": false}]';
COMMENT ON COLUMN milestones.amount_cents IS 'Milestone payment in cents';