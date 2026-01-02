-- =====================================================
-- V10: Create Escrow & Payment Tables
-- Description: Payment processing, escrow, and transaction management
-- =====================================================

CREATE TABLE IF NOT EXISTS escrow (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    payment_id BIGINT NOT NULL,
    
    -- Amount & Currency
    amount BIGINT NOT NULL,
    currency VARCHAR(3),
    
    -- Status & Release Condition
    status VARCHAR(50) NOT NULL, -- HELD, RELEASED, REFUNDED, DISPUTED
    release_condition VARCHAR(100), -- JOB_COMPLETED, MILESTONE_COMPLETED, MANUAL_RELEASE, AUTO_RELEASE, DISPUTE_RESOLVED
    
    -- Auto Release
    auto_release_date TIMESTAMP(6),
    released_at TIMESTAMP(6),
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT escrow_status_check CHECK (status IN ('HELD', 'RELEASED', 'REFUNDED', 'DISPUTED')),
    CONSTRAINT escrow_release_condition_check CHECK (release_condition IN ('JOB_COMPLETED', 'MILESTONE_COMPLETED', 'MANUAL_RELEASE', 'AUTO_RELEASE', 'DISPUTE_RESOLVED'))
);

-- Create indexes for escrow
CREATE INDEX IF NOT EXISTS idx_escrow_project_id ON escrow(project_id);
CREATE INDEX IF NOT EXISTS idx_escrow_payment_id ON escrow(payment_id);
CREATE INDEX IF NOT EXISTS idx_escrow_status ON escrow(status);

CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    contract_id BIGINT REFERENCES contracts(id) ON DELETE SET NULL,
    payer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    payee_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Payment Details
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50), -- CREDIT_CARD, BANK_TRANSFER, WALLET, PAYPAL
    description TEXT,
    
    -- Status
    status VARCHAR(50) DEFAULT 'PENDING' NOT NULL, -- PENDING, PROCESSING, COMPLETED, FAILED, REFUNDED
    
    -- External References
    transaction_id VARCHAR(255),
    reference_number VARCHAR(50),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_payment_amount CHECK (amount > 0),
    CONSTRAINT chk_payment_status CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED')),
    CONSTRAINT chk_payment_method CHECK (payment_method IN ('CREDIT_CARD', 'BANK_TRANSFER', 'WALLET', 'PAYPAL'))
);

-- Create indexes for payments
CREATE INDEX IF NOT EXISTS idx_payments_payer_id ON payments(payer_id);
CREATE INDEX IF NOT EXISTS idx_payments_payee_id ON payments(payee_id);
CREATE INDEX IF NOT EXISTS idx_payments_contract_id ON payments(contract_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);

CREATE TABLE IF NOT EXISTS payouts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Payout Details
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payout_method VARCHAR(50), -- BANK_TRANSFER, PAYPAL, WISE, CRYPTO
    status VARCHAR(50) DEFAULT 'PENDING' NOT NULL, -- PENDING, PROCESSING, COMPLETED, FAILED, CANCELLED
    
    -- Bank/External Account Details
    payout_account VARCHAR(255),
    
    -- Period Information
    period_start DATE,
    period_end DATE,
    
    -- Tracking
    transaction_id VARCHAR(255),
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_payout_amount CHECK (amount > 0),
    CONSTRAINT chk_payout_status CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED')),
    CONSTRAINT chk_payout_method CHECK (payout_method IN ('BANK_TRANSFER', 'PAYPAL', 'WISE', 'CRYPTO')),
    CONSTRAINT chk_payout_period CHECK (period_end IS NULL OR period_start IS NULL OR period_end >= period_start)
);

-- Create indexes for payouts
CREATE INDEX IF NOT EXISTS idx_payouts_user_id ON payouts(user_id);
CREATE INDEX IF NOT EXISTS idx_payouts_status ON payouts(status);
CREATE INDEX IF NOT EXISTS idx_payouts_created_at ON payouts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payouts_transaction_id ON payouts(transaction_id);

CREATE TABLE IF NOT EXISTS payment_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    payment_id BIGINT REFERENCES payments(id) ON DELETE SET NULL,
    
    -- Transaction Info
    transaction_type VARCHAR(50), -- PAYMENT_SENT, PAYMENT_RECEIVED, PAYOUT, REFUND, ESCROW_HELD, ESCROW_RELEASED
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    balance_before DECIMAL(15,2),
    balance_after DECIMAL(15,2),
    status VARCHAR(50),
    
    -- Description
    description TEXT,
    reference_id VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for payment_history
CREATE INDEX IF NOT EXISTS idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_created_at ON payment_history(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_history_transaction_type ON payment_history(transaction_type);

CREATE TABLE IF NOT EXISTS transaction_ledger (
    id BIGSERIAL PRIMARY KEY,
    
    -- Account Info
    account_type VARCHAR(50), -- USER_WALLET, ESCROW, PLATFORM_RESERVE
    account_id VARCHAR(255),
    
    -- Transaction Details
    debit DECIMAL(15,2) DEFAULT 0,
    credit DECIMAL(15,2) DEFAULT 0,
    balance DECIMAL(15,2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Transaction Tracking
    transaction_id VARCHAR(255),
    reference_id VARCHAR(255),
    description TEXT,
    remarks TEXT,
    
    -- Status
    status VARCHAR(50), -- PENDING, COMPLETED, REVERSED
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for transaction_ledger
CREATE INDEX IF NOT EXISTS idx_transaction_ledger_account_id ON transaction_ledger(account_id);
CREATE INDEX IF NOT EXISTS idx_transaction_ledger_created_at ON transaction_ledger(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transaction_ledger_transaction_id ON transaction_ledger(transaction_id);

-- Create trigger for payment updated_at
CREATE OR REPLACE FUNCTION update_payments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_payments_updated_at
BEFORE UPDATE ON payments
FOR EACH ROW
EXECUTE FUNCTION update_payments_updated_at();

-- Create trigger for payouts updated_at
CREATE OR REPLACE FUNCTION update_payouts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_payouts_updated_at
BEFORE UPDATE ON payouts
FOR EACH ROW
EXECUTE FUNCTION update_payouts_updated_at();

COMMENT ON TABLE escrow IS 'Escrow account holding for secure payment processing';
COMMENT ON TABLE payments IS 'Payment transactions between users';
COMMENT ON TABLE payouts IS 'Payout transactions for withdrawing earnings';
COMMENT ON TABLE payment_history IS 'Complete audit log of all payment transactions';
COMMENT ON TABLE transaction_ledger IS 'Double-entry ledger for financial accounting';
