-- V1__complete_schema_and_seed_data.sql
-- Complete Marketplace Database Schema with All Tables and Test Data
-- Consolidated migration for easier testing and development

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(100) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'FREELANCER',
    bio TEXT,
    profile_image_url VARCHAR(500),
    location VARCHAR(100),
    phone VARCHAR(20),
    hourly_rate DECIMAL(10, 2),
    skills TEXT[],
    portfolio_url VARCHAR(500),
    stripe_customer_id VARCHAR(100),
    stripe_account_id VARCHAR(100),
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    rating_avg DECIMAL(3, 2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_role CHECK (role IN ('CLIENT', 'FREELANCER', 'ADMIN'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);

-- Jobs table
CREATE TABLE jobs (
    id BIGSERIAL PRIMARY KEY,
    client_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50),
    required_skills TEXT[],
    budget DECIMAL(10, 2),
    budget_type VARCHAR(20) DEFAULT 'FIXED',
    duration INTEGER,
    experience_level VARCHAR(20) DEFAULT 'INTERMEDIATE',
    status VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    proposal_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP,
    CONSTRAINT check_budget_type CHECK (budget_type IN ('FIXED', 'HOURLY')),
    CONSTRAINT check_experience CHECK (experience_level IN ('ENTRY', 'INTERMEDIATE', 'EXPERT')),
    CONSTRAINT check_status CHECK (status IN ('DRAFT', 'OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'CLOSED'))
);

CREATE INDEX idx_jobs_client ON jobs(client_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_category ON jobs(category);
CREATE INDEX idx_jobs_created ON jobs(created_at);
CREATE INDEX idx_jobs_budget ON jobs(budget);
CREATE INDEX idx_jobs_status_created_client ON jobs(status, created_at, client_id);

-- Proposals table
CREATE TABLE proposals (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    freelancer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    cover_letter TEXT NOT NULL,
    proposed_rate DECIMAL(10, 2) NOT NULL,
    estimated_duration INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'SUBMITTED',
    client_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(job_id, freelancer_id),
    CONSTRAINT check_proposal_status CHECK (status IN ('DRAFT', 'SUBMITTED', 'SHORTLISTED', 'ACCEPTED', 'REJECTED', 'WITHDRAWN'))
);

CREATE INDEX idx_proposals_job ON proposals(job_id);
CREATE INDEX idx_proposals_freelancer ON proposals(freelancer_id);
CREATE INDEX idx_proposals_status ON proposals(status);

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================

CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    related_entity_type VARCHAR(50),
    related_entity_id BIGINT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_user_created ON notifications(user_id, created_at);
CREATE INDEX idx_notifications_type_created ON notifications(type, created_at);

-- ============================================================================
-- PAYMENT AND ESCROW TABLES
-- ============================================================================

-- Payments table
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    payment_intent_id VARCHAR(255) UNIQUE,
    stripe_charge_id VARCHAR(255),
    client_id BIGINT NOT NULL REFERENCES users(id),
    freelancer_id BIGINT NOT NULL REFERENCES users(id),
    job_id BIGINT NOT NULL REFERENCES jobs(id),
    proposal_id BIGINT REFERENCES proposals(id),
    amount BIGINT NOT NULL,
    platform_fee BIGINT DEFAULT 0,
    freelancer_amount BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    escrow_status VARCHAR(50) DEFAULT 'NOT_ESCROWED',
    stripe_payment_method VARCHAR(255),
    stripe_receipt_url TEXT,
    failure_code VARCHAR(100),
    failure_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP,
    released_at TIMESTAMP,
    refunded_at TIMESTAMP,
    CONSTRAINT chk_payment_status CHECK (status IN ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'REFUNDED', 'CANCELLED')),
    CONSTRAINT chk_escrow_status CHECK (escrow_status IN ('NOT_ESCROWED', 'HELD', 'RELEASED', 'REFUNDED', 'DISPUTED'))
);

CREATE INDEX idx_payments_client ON payments(client_id);
CREATE INDEX idx_payments_freelancer ON payments(freelancer_id);
CREATE INDEX idx_payments_job ON payments(job_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created ON payments(created_at);

-- Escrow table
CREATE TABLE escrow (
    id BIGSERIAL PRIMARY KEY,
    payment_id BIGINT NOT NULL REFERENCES payments(id),
    job_id BIGINT NOT NULL REFERENCES jobs(id),
    amount BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) NOT NULL DEFAULT 'HELD',
    release_condition VARCHAR(100) DEFAULT 'JOB_COMPLETED',
    auto_release_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    released_at TIMESTAMP,
    CONSTRAINT chk_escrow_escrow_status CHECK (status IN ('HELD', 'RELEASED', 'REFUNDED', 'DISPUTED')),
    CONSTRAINT chk_escrow_release_condition CHECK (release_condition IN ('JOB_COMPLETED', 'MILESTONE_COMPLETED', 'MANUAL_RELEASE', 'AUTO_RELEASE', 'DISPUTE_RESOLVED'))
);

CREATE INDEX idx_escrow_payment ON escrow(payment_id);
CREATE INDEX idx_escrow_job ON escrow(job_id);
CREATE INDEX idx_escrow_status ON escrow(status);

-- Payment History table
CREATE TABLE payment_history (
    id BIGSERIAL PRIMARY KEY,
    payment_id BIGINT NOT NULL REFERENCES payments(id),
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_payment_history_payment ON payment_history(payment_id);
CREATE INDEX idx_payment_history_created ON payment_history(created_at);

-- Invoices table
CREATE TABLE invoices (
    id BIGSERIAL PRIMARY KEY,
    payment_id BIGINT NOT NULL REFERENCES payments(id),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    client_id BIGINT NOT NULL REFERENCES users(id),
    freelancer_id BIGINT NOT NULL REFERENCES users(id),
    job_id BIGINT NOT NULL REFERENCES jobs(id),
    amount BIGINT NOT NULL,
    platform_fee BIGINT NOT NULL,
    total_amount BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    issued_at TIMESTAMP,
    due_at TIMESTAMP,
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_invoice_status CHECK (status IN ('DRAFT', 'ISSUED', 'PAID', 'OVERDUE', 'CANCELLED'))
);

CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_invoices_freelancer ON invoices(freelancer_id);
CREATE INDEX idx_invoices_payment ON invoices(payment_id);
CREATE INDEX idx_invoices_status ON invoices(status);

-- Create trigger to automatically update updated_at on invoices changes
CREATE OR REPLACE FUNCTION update_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_invoices_updated_at
BEFORE UPDATE ON invoices
FOR EACH ROW
EXECUTE FUNCTION update_invoices_updated_at();

-- ============================================================================
-- MILESTONES TABLE
-- ============================================================================

CREATE TABLE milestones (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    proposal_id BIGINT REFERENCES proposals(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    amount BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    due_date TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    payment_id BIGINT REFERENCES payments(id),
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    approved_at TIMESTAMP,
    CONSTRAINT chk_milestone_status CHECK (status IN ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'APPROVED', 'PAID', 'CANCELLED'))
);

CREATE INDEX idx_milestones_job ON milestones(job_id);
CREATE INDEX idx_milestones_proposal ON milestones(proposal_id);
CREATE INDEX idx_milestones_status ON milestones(status);
CREATE INDEX idx_milestones_payment ON milestones(payment_id);
