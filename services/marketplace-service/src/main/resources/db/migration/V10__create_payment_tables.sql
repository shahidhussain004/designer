-- =====================================================
-- V10: Create Escrow & Payment Tables
-- Description: Payment processing, escrow, and transaction management
-- OPTIMIZED: Amounts in cents (BIGINT), better indexes
-- =====================================================

CREATE TABLE IF NOT EXISTS escrow (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    payment_id BIGINT NOT NULL,
    
    -- Amount & Currency (CHANGED: Store in cents)
    amount_cents BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    
    -- Status & Release Condition
    status VARCHAR(50) NOT NULL,
    release_condition VARCHAR(100),
    
    -- Auto Release
    auto_release_date TIMESTAMP(6),
    released_at TIMESTAMP(6),
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Constraints
    CONSTRAINT escrow_status_check CHECK (status IN ('HELD', 'RELEASED', 'REFUNDED', 'DISPUTED')),
    CONSTRAINT escrow_release_condition_check CHECK (release_condition IN ('JOB_COMPLETED', 'MILESTONE_COMPLETED', 'MANUAL_RELEASE', 'AUTO_RELEASE', 'DISPUTE_RESOLVED')),
    CONSTRAINT escrow_amount_check CHECK (amount_cents > 0)
);

CREATE INDEX idx_escrow_project_id ON escrow(project_id);
CREATE INDEX idx_escrow_payment_id ON escrow(payment_id);
CREATE INDEX idx_escrow_status ON escrow(status);
CREATE INDEX idx_escrow_auto_release ON escrow(auto_release_date) WHERE status = 'HELD' AND auto_release_date IS NOT NULL;

CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    contract_id BIGINT REFERENCES contracts(id) ON DELETE SET NULL,
    payer_id BIGINT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    payee_id BIGINT NOT NULL REFERENCES freelancers(id) ON DELETE CASCADE,
    
    -- Payment Details (CHANGED: Store in cents)
    amount_cents BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    payment_method VARCHAR(50),
    description TEXT,
    
    -- Status
    status VARCHAR(50) DEFAULT 'PENDING' NOT NULL,
    
    -- External References
    transaction_id VARCHAR(255),
    reference_number VARCHAR(50),
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    processed_at TIMESTAMP(6),
    
    -- Constraints
    CONSTRAINT payments_amount_check CHECK (amount_cents > 0),
    CONSTRAINT payments_status_check CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED')),
    CONSTRAINT payments_method_check CHECK (payment_method IN ('CREDIT_CARD', 'BANK_TRANSFER', 'WALLET', 'PAYPAL'))
);

CREATE INDEX idx_payments_payer_id ON payments(payer_id);
CREATE INDEX idx_payments_payee_id ON payments(payee_id);
CREATE INDEX idx_payments_contract_id ON payments(contract_id) WHERE contract_id IS NOT NULL;
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id) WHERE transaction_id IS NOT NULL;
CREATE INDEX idx_payments_pending ON payments(created_at DESC) WHERE status = 'PENDING';

CREATE TABLE IF NOT EXISTS payouts (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES freelancers(id) ON DELETE CASCADE,
    
    -- Payout Details (CHANGED: Store in cents)
    amount_cents BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    payout_method VARCHAR(50),
    status VARCHAR(50) DEFAULT 'PENDING' NOT NULL,
    
    -- Bank/External Account Details
    payout_account VARCHAR(255),
    
    -- Period Information
    period_start DATE,
    period_end DATE,
    
    -- Tracking
    transaction_id VARCHAR(255),
    notes TEXT,
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    processed_at TIMESTAMP(6),
    
    -- Constraints
    CONSTRAINT payouts_amount_check CHECK (amount_cents > 0),
    CONSTRAINT payouts_status_check CHECK (status IN ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED')),
    CONSTRAINT payouts_method_check CHECK (payout_method IN ('BANK_TRANSFER', 'PAYPAL', 'WISE', 'CRYPTO')),
    CONSTRAINT payouts_period_check CHECK (period_end IS NULL OR period_start IS NULL OR period_end >= period_start)
);

CREATE INDEX idx_payouts_user_id ON payouts(user_id);
CREATE INDEX idx_payouts_status ON payouts(status);
CREATE INDEX idx_payouts_created_at ON payouts(created_at DESC);
CREATE INDEX idx_payouts_transaction_id ON payouts(transaction_id) WHERE transaction_id IS NOT NULL;
CREATE INDEX idx_payouts_pending ON payouts(user_id, created_at DESC) WHERE status = 'PENDING';

CREATE TABLE IF NOT EXISTS payment_history (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    payment_id BIGINT REFERENCES payments(id) ON DELETE SET NULL,
    
    -- Transaction Info (CHANGED: Store in cents)
    transaction_type VARCHAR(50),
    amount_cents BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    balance_before_cents BIGINT,
    balance_after_cents BIGINT,
    status VARCHAR(50),
    
    -- Description
    description TEXT,
    reference_id VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT payment_history_amount_check CHECK (amount_cents >= 0)
);

CREATE INDEX idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX idx_payment_history_created_at ON payment_history(created_at DESC);
CREATE INDEX idx_payment_history_transaction_type ON payment_history(transaction_type);
CREATE INDEX idx_payment_history_user_date ON payment_history(user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS transaction_ledger (
    id BIGSERIAL PRIMARY KEY,
    
    -- Account Info
    account_type VARCHAR(50),
    account_id VARCHAR(255),
    
    -- Transaction Details (CHANGED: Store in cents)
    debit_cents BIGINT DEFAULT 0 NOT NULL,
    credit_cents BIGINT DEFAULT 0 NOT NULL,
    balance_cents BIGINT,
    currency VARCHAR(3) DEFAULT 'USD' NOT NULL,
    
    -- Transaction Tracking
    transaction_id VARCHAR(255),
    reference_id VARCHAR(255),
    description TEXT,
    remarks TEXT,
    
    -- Status
    status VARCHAR(50),
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT transaction_ledger_amounts_check CHECK (debit_cents >= 0 AND credit_cents >= 0)
);

CREATE INDEX idx_transaction_ledger_account_id ON transaction_ledger(account_id);
CREATE INDEX idx_transaction_ledger_created_at ON transaction_ledger(created_at DESC);
CREATE INDEX idx_transaction_ledger_transaction_id ON transaction_ledger(transaction_id) WHERE transaction_id IS NOT NULL;
CREATE INDEX idx_transaction_ledger_account_date ON transaction_ledger(account_id, created_at DESC);

-- Triggers for updated_at
CREATE TRIGGER escrow_updated_at BEFORE UPDATE ON escrow FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER payouts_updated_at BEFORE UPDATE ON payouts FOR EACH ROW EXECUTE FUNCTION update_timestamp();

COMMENT ON TABLE escrow IS 'Escrow account holding for secure payment processing';
COMMENT ON TABLE payments IS 'Payment transactions between users';
COMMENT ON TABLE payouts IS 'Payout transactions for withdrawing earnings';
COMMENT ON TABLE payment_history IS 'Complete audit log of all payment transactions';
COMMENT ON TABLE transaction_ledger IS 'Double-entry ledger for financial accounting';
COMMENT ON COLUMN escrow.amount_cents IS 'Escrow amount in cents (e.g., $1000 = 100000)';
COMMENT ON COLUMN payments.amount_cents IS 'Payment amount in cents';
COMMENT ON COLUMN payouts.amount_cents IS 'Payout amount in cents';