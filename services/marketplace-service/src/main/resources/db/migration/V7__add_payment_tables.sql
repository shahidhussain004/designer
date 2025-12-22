-- V7: Add payment and escrow tables for Sprint 10: Payment Foundation
-- Description: Creates tables for payment processing, escrow management, and transaction history

-- Payments table - stores all payment transactions
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    payment_intent_id VARCHAR(255) UNIQUE,
    stripe_charge_id VARCHAR(255),
    
    -- Relationships
    client_id BIGINT NOT NULL REFERENCES users(id),
    freelancer_id BIGINT NOT NULL REFERENCES users(id),
    job_id BIGINT NOT NULL REFERENCES jobs(id),
    proposal_id BIGINT REFERENCES proposals(id),
    
    -- Amount details (in cents to avoid floating point issues)
    amount BIGINT NOT NULL,
    platform_fee BIGINT DEFAULT 0,
    freelancer_amount BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Status tracking
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    escrow_status VARCHAR(50) DEFAULT 'NOT_ESCROWED',
    
    -- Stripe metadata
    stripe_payment_method VARCHAR(255),
    stripe_receipt_url TEXT,
    failure_code VARCHAR(100),
    failure_message TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP,
    released_at TIMESTAMP,
    refunded_at TIMESTAMP,
    
    CONSTRAINT chk_payment_status CHECK (status IN ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'REFUNDED', 'CANCELLED')),
    CONSTRAINT chk_escrow_status CHECK (escrow_status IN ('NOT_ESCROWED', 'HELD', 'RELEASED', 'REFUNDED', 'DISPUTED'))
);

-- Escrow table - manages held funds
CREATE TABLE escrow (
    id BIGSERIAL PRIMARY KEY,
    payment_id BIGINT NOT NULL REFERENCES payments(id),
    job_id BIGINT NOT NULL REFERENCES jobs(id),
    
    -- Amount held
    amount BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'HELD',
    
    -- Release conditions
    release_condition VARCHAR(100) DEFAULT 'JOB_COMPLETED',
    auto_release_date TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    released_at TIMESTAMP,
    
    CONSTRAINT chk_escrow_condition CHECK (release_condition IN ('JOB_COMPLETED', 'MILESTONE_COMPLETED', 'MANUAL_RELEASE', 'AUTO_RELEASE', 'DISPUTE_RESOLVED'))
);

-- Transaction ledger - audit trail for all money movements
CREATE TABLE transaction_ledger (
    id BIGSERIAL PRIMARY KEY,
    transaction_type VARCHAR(50) NOT NULL,
    
    -- References
    payment_id BIGINT REFERENCES payments(id),
    escrow_id BIGINT REFERENCES escrow(id),
    user_id BIGINT REFERENCES users(id),
    
    -- Amount
    amount BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    balance_before BIGINT,
    balance_after BIGINT,
    
    -- Description
    description TEXT,
    reference_id VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_transaction_type CHECK (transaction_type IN ('PAYMENT_RECEIVED', 'ESCROW_HOLD', 'ESCROW_RELEASE', 'PLATFORM_FEE', 'PAYOUT', 'REFUND', 'ADJUSTMENT'))
);

-- Invoices table
CREATE TABLE invoices (
    id BIGSERIAL PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Relationships
    payment_id BIGINT NOT NULL REFERENCES payments(id),
    milestone_id BIGINT,
    client_id BIGINT NOT NULL REFERENCES users(id),
    freelancer_id BIGINT NOT NULL REFERENCES users(id),
    job_id BIGINT,
    
    -- Invoice type
    invoice_type VARCHAR(30) DEFAULT 'PAYMENT',
    
    -- Invoice details
    subtotal BIGINT NOT NULL,
    platform_fee BIGINT DEFAULT 0,
    tax_amount BIGINT DEFAULT 0,
    total BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Status
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    
    -- Billing info (JSON)
    client_billing_info TEXT,
    freelancer_billing_info TEXT,
    line_items TEXT,
    notes TEXT,
    
    -- PDF storage
    pdf_url TEXT,
    
    -- Timestamps
    invoice_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_date TIMESTAMP,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_invoice_type CHECK (invoice_type IN ('PAYMENT', 'MILESTONE', 'REFUND', 'PAYOUT')),
    CONSTRAINT chk_invoice_status CHECK (status IN ('DRAFT', 'SENT', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED'))
);

-- Payouts table - for freelancer withdrawals
CREATE TABLE payouts (
    id BIGSERIAL PRIMARY KEY,
    payout_reference VARCHAR(50) UNIQUE NOT NULL,
    stripe_payout_id VARCHAR(255),
    stripe_transfer_id VARCHAR(255),
    
    -- Relationships
    freelancer_id BIGINT NOT NULL REFERENCES users(id),
    
    -- Amount
    amount BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Status
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    payout_method VARCHAR(30) DEFAULT 'BANK_TRANSFER',
    
    -- Destination details (masked)
    destination_last4 VARCHAR(4),
    destination_name VARCHAR(100),
    
    -- Payout period
    period_start TIMESTAMP,
    period_end TIMESTAMP,
    
    -- Associated payments
    included_payments TEXT,
    payment_count INTEGER DEFAULT 0,
    
    -- Error handling
    failure_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    initiated_at TIMESTAMP,
    completed_at TIMESTAMP,
    
    CONSTRAINT chk_payout_status CHECK (status IN ('PENDING', 'PROCESSING', 'IN_TRANSIT', 'PAID', 'FAILED', 'CANCELLED')),
    CONSTRAINT chk_payout_method CHECK (payout_method IN ('BANK_TRANSFER', 'PAYPAL', 'STRIPE_CONNECT', 'CHECK', 'WIRE'))
);

-- Performance indexes
CREATE INDEX idx_payments_client ON payments(client_id);
CREATE INDEX idx_payments_freelancer ON payments(freelancer_id);
CREATE INDEX idx_payments_job ON payments(job_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created ON payments(created_at);
CREATE INDEX idx_payments_intent ON payments(payment_intent_id);

CREATE INDEX idx_escrow_payment ON escrow(payment_id);
CREATE INDEX idx_escrow_job ON escrow(job_id);
CREATE INDEX idx_escrow_status ON escrow(status);

CREATE INDEX idx_ledger_payment ON transaction_ledger(payment_id);
CREATE INDEX idx_ledger_user ON transaction_ledger(user_id);
CREATE INDEX idx_ledger_type ON transaction_ledger(transaction_type);
CREATE INDEX idx_ledger_created ON transaction_ledger(created_at);

CREATE INDEX idx_invoices_payment ON invoices(payment_id);
CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_number ON invoices(invoice_number);

CREATE INDEX idx_payouts_freelancer ON payouts(freelancer_id);
CREATE INDEX idx_payouts_status ON payouts(status);
CREATE INDEX idx_payouts_created ON payouts(created_at);
