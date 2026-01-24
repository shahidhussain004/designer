-- =====================================================
-- V15: Create Additional Audit & Support Tables
-- Description: Audit logs, support tickets, and other administrative tables
-- OPTIMIZED: json → jsonb, GIN indexes, partitioning-ready
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    
    -- User & Action Details
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT,
    
    -- Changes (CHANGED: json → jsonb)
    old_values JSONB,
    new_values JSONB,
    changes JSONB,
    
    -- Context
    ip_address VARCHAR(45),
    user_agent TEXT,
    request_id VARCHAR(255),
    endpoint VARCHAR(500),
    http_method VARCHAR(10),
    status_code INTEGER,
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Composite for user activity tracking
CREATE INDEX idx_audit_logs_user_action ON audit_logs(user_id, action, created_at DESC) WHERE user_id IS NOT NULL;

-- GIN indexes for JSONB searching
CREATE INDEX idx_audit_logs_changes_gin ON audit_logs USING GIN(changes);
CREATE INDEX idx_audit_logs_old_values_gin ON audit_logs USING GIN(old_values);
CREATE INDEX idx_audit_logs_new_values_gin ON audit_logs USING GIN(new_values);

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
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(20) DEFAULT 'MEDIUM' NOT NULL,
    status VARCHAR(50) DEFAULT 'OPEN' NOT NULL,
    
    -- Related Entity
    related_entity_type VARCHAR(100),
    related_entity_id BIGINT,
    
    -- Resolution
    resolution_notes TEXT,
    resolution_time TIMESTAMP(6),
    feedback_rating INTEGER,
    feedback_comment TEXT,
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    closed_at TIMESTAMP(6),
    
    CONSTRAINT support_tickets_priority_check CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'URGENT')),
    CONSTRAINT support_tickets_status_check CHECK (status IN ('OPEN', 'IN_PROGRESS', 'WAITING_USER', 'RESOLVED', 'CLOSED', 'REOPENED')),
    CONSTRAINT support_tickets_feedback_rating_check CHECK (feedback_rating IS NULL OR (feedback_rating >= 1 AND feedback_rating <= 5))
);

-- Indexes
CREATE INDEX idx_support_tickets_reported_by ON support_tickets(reported_by);
CREATE INDEX idx_support_tickets_assigned_to ON support_tickets(assigned_to) WHERE assigned_to IS NOT NULL;
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_category ON support_tickets(category);
CREATE INDEX idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX idx_support_tickets_created_at ON support_tickets(created_at DESC);

-- Open tickets queue
CREATE INDEX idx_support_tickets_open ON support_tickets(priority, created_at) 
    WHERE status IN ('OPEN', 'IN_PROGRESS');

-- Assigned tickets
CREATE INDEX idx_support_tickets_assigned_status ON support_tickets(assigned_to, status, created_at DESC) 
    WHERE assigned_to IS NOT NULL;

-- Related entity lookup
CREATE INDEX idx_support_tickets_related ON support_tickets(related_entity_type, related_entity_id) 
    WHERE related_entity_type IS NOT NULL;

-- Full-text search
CREATE INDEX idx_support_tickets_search ON support_tickets USING GIN(
    to_tsvector('english', title || ' ' || description)
);

CREATE TABLE IF NOT EXISTS support_ticket_replies (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    
    -- Reply Details
    author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    -- CHANGED: json → jsonb for attachments
    attachments JSONB DEFAULT '[]'::jsonb,
    
    -- Internal Notes (not visible to user)
    is_internal BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX idx_support_ticket_replies_ticket_id ON support_ticket_replies(ticket_id);
CREATE INDEX idx_support_ticket_replies_author_id ON support_ticket_replies(author_id);
CREATE INDEX idx_support_ticket_replies_created_at ON support_ticket_replies(created_at DESC);

-- External (customer-visible) replies
CREATE INDEX idx_support_ticket_replies_external ON support_ticket_replies(ticket_id, created_at) 
    WHERE is_internal = FALSE;

-- GIN index for attachments
CREATE INDEX idx_support_ticket_replies_attachments_gin ON support_ticket_replies USING GIN(attachments);

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
    theme VARCHAR(20) DEFAULT 'light',
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    CONSTRAINT user_preferences_theme_check CHECK (theme IN ('light', 'dark', 'auto'))
);

CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

CREATE TABLE IF NOT EXISTS blocklist (
    id BIGSERIAL PRIMARY KEY,
    
    -- Blocker & Blocked
    blocker_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    blocked_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Reason
    reason VARCHAR(255),
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Constraints
    CONSTRAINT blocklist_different_users_check CHECK (blocker_id != blocked_user_id),
    CONSTRAINT blocklist_unique_block UNIQUE(blocker_id, blocked_user_id)
);

-- Indexes
CREATE INDEX idx_blocklist_blocker_id ON blocklist(blocker_id);
CREATE INDEX idx_blocklist_blocked_user_id ON blocklist(blocked_user_id);

CREATE TABLE IF NOT EXISTS reported_content (
    id BIGSERIAL PRIMARY KEY,
    
    -- Reporter & Report Details
    reported_by BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    report_reason VARCHAR(100) NOT NULL,
    description TEXT,
    
    -- Content Being Reported
    content_type VARCHAR(100) NOT NULL,
    content_id BIGINT NOT NULL,
    reported_user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'PENDING' NOT NULL,
    resolution_notes TEXT,
    action_taken VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    resolved_at TIMESTAMP(6),
    
    CONSTRAINT reported_content_status_check CHECK (status IN ('PENDING', 'REVIEWING', 'RESOLVED', 'DISMISSED'))
);

-- Indexes
CREATE INDEX idx_reported_content_reported_by ON reported_content(reported_by);
CREATE INDEX idx_reported_content_reported_user ON reported_content(reported_user_id) WHERE reported_user_id IS NOT NULL;
CREATE INDEX idx_reported_content_content ON reported_content(content_type, content_id);
CREATE INDEX idx_reported_content_status ON reported_content(status);
CREATE INDEX idx_reported_content_created_at ON reported_content(created_at DESC);

-- Pending reports queue
CREATE INDEX idx_reported_content_pending ON reported_content(created_at) WHERE status = 'PENDING';

-- Triggers
CREATE TRIGGER support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER support_ticket_replies_updated_at BEFORE UPDATE ON support_ticket_replies FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER reported_content_updated_at BEFORE UPDATE ON reported_content FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Auto-generate ticket number
CREATE SEQUENCE IF NOT EXISTS ticket_number_seq START 1000;

CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.ticket_number IS NULL OR NEW.ticket_number = '' THEN
        NEW.ticket_number = 'TKT-' || TO_CHAR(CURRENT_DATE, 'YYYYMMDD') || '-' || 
                           LPAD(nextval('ticket_number_seq')::TEXT, 5, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER support_tickets_generate_number
    BEFORE INSERT ON support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION generate_ticket_number();

COMMENT ON TABLE audit_logs IS 'Complete audit trail of all system actions for compliance and debugging';
COMMENT ON TABLE support_tickets IS 'Customer support ticket management system';
COMMENT ON TABLE support_ticket_replies IS 'Replies and updates to support tickets';
COMMENT ON TABLE user_preferences IS 'User notification and preference settings';
COMMENT ON TABLE blocklist IS 'User blocklist - users who have blocked other users';
COMMENT ON TABLE reported_content IS 'Content reports and moderation queue';
COMMENT ON COLUMN support_ticket_replies.attachments IS 'JSONB array: [{"filename": "...", "url": "...", "size": 12345}]';