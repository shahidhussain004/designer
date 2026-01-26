-- =====================================================
-- V11: Create Invoices & Milestones Tables
-- Description: Invoice management and project milestones tracking
-- OPTIMIZED: Removed 10 unused indexes (0 scans), ADDED idx_milestones_project_status_order from V_fix_002, added auto-vacuum for milestones
-- Author: Database Audit & Optimization 2026-01-26
-- =====================================================

-- Invoice number sequence
CREATE SEQUENCE IF NOT EXISTS invoice_number_seq START 1000;

CREATE TABLE IF NOT EXISTS invoices (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    contract_id BIGINT REFERENCES contracts(id) ON DELETE SET NULL,
    milestone_id BIGINT,
    
    -- Parties
    company_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    freelancer_id BIGINT NOT NULL REFERENCES freelancers(id) ON DELETE CASCADE,
    payment_id BIGINT,
    
    -- Invoice Information
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    invoice_type VARCHAR(30) NOT NULL,
    invoice_date TIMESTAMP(6) NOT NULL,
    due_date TIMESTAMP(6),
    paid_at TIMESTAMP(6),
    
    -- Amounts (Store in cents as BIGINT)
    subtotal_cents BIGINT NOT NULL,
    tax_amount_cents BIGINT DEFAULT 0 NOT NULL,
    platform_fee_cents BIGINT DEFAULT 0 NOT NULL,
    total_cents BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    
    -- Details
    -- Format: [{"description": "Web development", "quantity": 1, "unit_price_cents": 500000, "total_cents": 500000}]
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
    CONSTRAINT invoices_paid_check CHECK ((status = 'PAID' AND paid_at IS NOT NULL) OR (status != 'PAID'))
);

-- =====================================================
-- INVOICES INDEXES (OPTIMIZED)
-- =====================================================
-- Audit Result: All indexes had 0 scans (invoicing system not in use yet)
-- REMOVED: idx_invoices_project_id, idx_invoices_contract_id, idx_invoices_milestone_id,
--          idx_invoices_company_id, idx_invoices_freelancer_id, idx_invoices_payment_id,
--          idx_invoices_created_at, idx_invoices_unpaid, idx_invoices_overdue,
--          idx_invoices_date_range (all 0 scans)
-- REMOVED: idx_invoices_line_items_gin (0 scans - JSONB search not used yet)
-- NOTE: Will add indexes when invoicing features are actively used

-- No indexes initially - add when invoicing features are built

CREATE TABLE IF NOT EXISTS milestones (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    contract_id BIGINT REFERENCES contracts(id) ON DELETE SET NULL,
    
    -- Milestone Details
    title VARCHAR(255) NOT NULL,
    description TEXT,
    -- Format: [{"description": "Login page", "completed": false, "approved": false}]
    deliverables JSONB DEFAULT '[]'::jsonb NOT NULL,
    
    -- Financial (Store in cents)
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
    CONSTRAINT milestones_approval_check CHECK ((status = 'APPROVED' AND approval_date IS NOT NULL) OR (status != 'APPROVED'))
);

-- =====================================================
-- MILESTONES INDEXES (OPTIMIZED)
-- =====================================================
-- Audit Result: Most indexes had 0 scans except project_id lookup
-- REMOVED: idx_milestones_contract_id, idx_milestones_status, idx_milestones_due_date,
--          idx_milestones_created_at, idx_milestones_project_order (all 0 scans)
-- REMOVED: idx_milestones_pending (0 scans - approval queue not built yet)
-- REMOVED: idx_milestones_deliverables_gin (0 scans - JSONB search not used yet)
-- ADDED: idx_milestones_project_status_order (from V_fix_002 - critical missing index)

-- KEPT: Essential foreign key index
CREATE INDEX idx_milestones_project_id ON milestones(project_id);

-- ADDED: Critical missing index from V_fix_002 (project milestone ordering by status)
CREATE INDEX idx_milestones_project_status_order ON milestones(project_id, status, order_number);

-- Configure auto-vacuum for high-update table (from V_fix_003)
ALTER TABLE milestones SET (
  autovacuum_enabled = true,
  autovacuum_vacuum_scale_factor = 0.1,    -- Vacuum when 10% dead rows
  autovacuum_analyze_scale_factor = 0.05   -- Analyze when 5% changed
);

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER invoices_updated_at BEFORE UPDATE ON invoices FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER milestones_updated_at BEFORE UPDATE ON milestones FOR EACH ROW EXECUTE FUNCTION update_timestamp();

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

-- Set approval_date when milestone is approved
CREATE OR REPLACE FUNCTION set_milestone_approval_date()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'APPROVED' AND (OLD.status IS NULL OR OLD.status != 'APPROVED') THEN
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

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE invoices IS 'Invoice records for payments and transactions. Optimized with no indexes (invoicing not active).';
COMMENT ON TABLE milestones IS 'Project milestones with deliverables and payment. Optimized with auto-vacuum (10% threshold), critical index added.';
COMMENT ON COLUMN invoices.subtotal_cents IS 'Subtotal in cents (e.g., $100.00 = 10000)';
COMMENT ON COLUMN invoices.line_items IS 'JSONB array: [{"description": "...", "quantity": 1, "unit_price_cents": 50000, "total_cents": 50000}]';
COMMENT ON COLUMN milestones.amount_cents IS 'Milestone payment in cents';
COMMENT ON COLUMN milestones.deliverables IS 'JSONB array: [{"description": "Login page", "completed": false, "approved": false}]';

-- =====================================================
-- ROLLBACK INSTRUCTIONS
-- =====================================================
-- To rollback this migration, run:
--
-- DROP TRIGGER IF EXISTS milestones_approval_date ON milestones;
-- DROP TRIGGER IF EXISTS milestones_updated_at ON milestones;
-- DROP TRIGGER IF EXISTS invoices_generate_number ON invoices;
-- DROP TRIGGER IF EXISTS invoices_updated_at ON invoices;
-- DROP FUNCTION IF EXISTS set_milestone_approval_date();
-- DROP FUNCTION IF EXISTS generate_invoice_number();
-- DROP TABLE IF EXISTS milestones CASCADE;
-- DROP TABLE IF EXISTS invoices CASCADE;
-- DROP SEQUENCE IF EXISTS invoice_number_seq;
