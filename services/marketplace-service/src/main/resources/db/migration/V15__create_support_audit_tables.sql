-- =====================================================
-- V15: Create Additional Audit & Support Tables
-- Description: Audit logs, support tickets, and other administrative tables
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    
    -- User & Action Details
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- CREATE, UPDATE, DELETE, LOGIN, LOGOUT, VIEW, DOWNLOAD, etc.
    entity_type VARCHAR(100) NOT NULL, -- USER, PROJECT, JOB, PROPOSAL, CONTRACT, PAYMENT, etc.
    entity_id BIGINT,
    
    -- Changes
    old_values JSONB,
    new_values JSONB,
    changes JSONB, -- Diff of what changed
    
    -- Context
    ip_address VARCHAR(45),
    user_agent TEXT,
    request_id VARCHAR(255),
    endpoint VARCHAR(500),
    http_method VARCHAR(10),
    status_code INTEGER,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_type_id ON audit_logs(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_action ON audit_logs(user_id, action);

CREATE TABLE IF NOT EXISTS support_tickets (
    id BIGSERIAL PRIMARY KEY,
    
    -- Ticket Metadata
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    -- Reporting
    reported_by BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_to BIGINT REFERENCES users(id) ON DELETE SET NULL,
    
    -- Classification
    category VARCHAR(100) NOT NULL, -- PAYMENT_ISSUE, DISPUTE, COMPLAINT, BUG_REPORT, FEATURE_REQUEST, ACCOUNT_ISSUE
    priority VARCHAR(20) DEFAULT 'MEDIUM' NOT NULL, -- LOW, MEDIUM, HIGH, URGENT
    status VARCHAR(50) DEFAULT 'OPEN' NOT NULL, -- OPEN, IN_PROGRESS, WAITING_USER, RESOLVED, CLOSED, REOPENED
    
    -- Related Entity
    related_entity_type VARCHAR(100), -- PROJECT, JOB, CONTRACT, PROPOSAL, PAYMENT, USER
    related_entity_id BIGINT,
    
    -- Resolution
    resolution_notes TEXT,
    resolution_time TIMESTAMP,
    feedback_rating INTEGER, -- 1-5 stars
    feedback_comment TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP
);

-- Create indexes for support_tickets
CREATE INDEX IF NOT EXISTS idx_support_tickets_ticket_number ON support_tickets(ticket_number);
CREATE INDEX IF NOT EXISTS idx_support_tickets_reported_by ON support_tickets(reported_by);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_to ON support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_category ON support_tickets(category);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_tickets_related ON support_tickets(related_entity_type, related_entity_id);

CREATE TABLE IF NOT EXISTS support_ticket_replies (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    
    -- Reply Details
    author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    attachments JSON DEFAULT '[]'::json,
    
    -- Internal Notes (not visible to user)
    is_internal BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for support_ticket_replies
CREATE INDEX IF NOT EXISTS idx_support_ticket_replies_ticket_id ON support_ticket_replies(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_ticket_replies_author_id ON support_ticket_replies(author_id);
CREATE INDEX IF NOT EXISTS idx_support_ticket_replies_created_at ON support_ticket_replies(created_at DESC);

CREATE TABLE IF NOT EXISTS user_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Email Preferences
    email_notifications BOOLEAN DEFAULT TRUE,
    email_weekly_digest BOOLEAN DEFAULT TRUE,
    email_marketing BOOLEAN DEFAULT TRUE,
    
    -- Notification Preferences
    notify_project_updates BOOLEAN DEFAULT TRUE,
    notify_job_updates BOOLEAN DEFAULT TRUE,
    notify_proposal_updates BOOLEAN DEFAULT TRUE,
    notify_contract_updates BOOLEAN DEFAULT TRUE,
    notify_message_received BOOLEAN DEFAULT TRUE,
    notify_payment_received BOOLEAN DEFAULT TRUE,
    notify_rating_received BOOLEAN DEFAULT TRUE,
    
    -- Profile Visibility
    show_profile_to_public BOOLEAN DEFAULT TRUE,
    show_contact_info BOOLEAN DEFAULT FALSE,
    show_earnings_history BOOLEAN DEFAULT FALSE,
    
    -- Other Settings
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    theme VARCHAR(20) DEFAULT 'light', -- light, dark, auto
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for user_preferences
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

CREATE TABLE IF NOT EXISTS blocklist (
    id BIGSERIAL PRIMARY KEY,
    
    -- Blocker & Blocked
    blocker_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    blocked_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Reason
    reason VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_different_users CHECK (blocker_id != blocked_user_id),
    CONSTRAINT unique_block UNIQUE(blocker_id, blocked_user_id)
);

-- Create indexes for blocklist
CREATE INDEX IF NOT EXISTS idx_blocklist_blocker_id ON blocklist(blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocklist_blocked_user_id ON blocklist(blocked_user_id);

CREATE TABLE IF NOT EXISTS reported_content (
    id BIGSERIAL PRIMARY KEY,
    
    -- Reporter & Report Details
    reported_by BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    report_reason VARCHAR(100) NOT NULL, -- SPAM, INAPPROPRIATE, SCAM, COPYRIGHT, HARASSMENT, OTHER
    description TEXT,
    
    -- Content Being Reported
    content_type VARCHAR(100) NOT NULL, -- USER_PROFILE, PROJECT, JOB, REVIEW, MESSAGE, COMMENT
    content_id BIGINT NOT NULL,
    reported_user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'PENDING' NOT NULL, -- PENDING, REVIEWING, RESOLVED, DISMISSED
    resolution_notes TEXT,
    action_taken VARCHAR(100), -- NONE, WARNING, SUSPENSION, DELETION, USER_BANNED
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP
);

-- Create indexes for reported_content
CREATE INDEX IF NOT EXISTS idx_reported_content_reported_by ON reported_content(reported_by);
CREATE INDEX IF NOT EXISTS idx_reported_content_reported_user ON reported_content(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_reported_content_content_type ON reported_content(content_type, content_id);
CREATE INDEX IF NOT EXISTS idx_reported_content_status ON reported_content(status);
CREATE INDEX IF NOT EXISTS idx_reported_content_created_at ON reported_content(created_at DESC);

-- Create trigger for audit_logs if needed
CREATE OR REPLACE FUNCTION update_support_tickets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_support_tickets_updated_at
BEFORE UPDATE ON support_tickets
FOR EACH ROW
EXECUTE FUNCTION update_support_tickets_updated_at();

CREATE OR REPLACE FUNCTION update_support_ticket_replies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_support_ticket_replies_updated_at
BEFORE UPDATE ON support_ticket_replies
FOR EACH ROW
EXECUTE FUNCTION update_support_ticket_replies_updated_at();

CREATE OR REPLACE FUNCTION update_user_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_preferences_updated_at
BEFORE UPDATE ON user_preferences
FOR EACH ROW
EXECUTE FUNCTION update_user_preferences_updated_at();

-- Add comments
COMMENT ON TABLE audit_logs IS 'Complete audit trail of all system actions for compliance and debugging';
COMMENT ON TABLE support_tickets IS 'Customer support ticket management system';
COMMENT ON TABLE support_ticket_replies IS 'Replies and updates to support tickets';
COMMENT ON TABLE user_preferences IS 'User notification and preference settings';
COMMENT ON TABLE blocklist IS 'User blocklist - users who have blocked other users';
COMMENT ON TABLE reported_content IS 'Content reports and moderation queue';

