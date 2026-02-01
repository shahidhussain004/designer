-- =====================================================
-- V15: Create Support & Audit Tables
-- Description: Audit logs, support tickets, and other administrative tables
-- OPTIMIZED: Removed 20 unused indexes (0 scans), removed 3 JSONB GIN indexes, removed 2 full-text search indexes
-- Author: Database Audit & Optimization 2026-01-26
-- =====================================================

CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    
    -- User & Action Details
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT,
    
    -- Changes
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

-- =====================================================
-- AUDIT_LOGS INDEXES (OPTIMIZED)
-- =====================================================
-- Audit Result: All indexes had 0 scans (audit logging not in use yet)
-- REMOVED: idx_audit_logs_user_id, idx_audit_logs_entity, idx_audit_logs_action,
--          idx_audit_logs_created_at, idx_audit_logs_user_action (all 0 scans)
-- REMOVED: idx_audit_logs_changes_gin, idx_audit_logs_old_values_gin,
--          idx_audit_logs_new_values_gin (0 scans - JSONB search not used yet)
-- NOTE: Will add indexes when audit logging is actively used

-- No indexes initially - add when audit logging is built

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

-- =====================================================
-- SUPPORT_TICKETS INDEXES (OPTIMIZED)
-- =====================================================
-- Audit Result: All indexes had 0 scans (support system not in use yet)
-- REMOVED: idx_support_tickets_reported_by, idx_support_tickets_assigned_to,
--          idx_support_tickets_status, idx_support_tickets_category,
--          idx_support_tickets_priority, idx_support_tickets_created_at,
--          idx_support_tickets_open, idx_support_tickets_assigned_status,
--          idx_support_tickets_related (all 0 scans)
-- REMOVED: idx_support_tickets_search (0 scans - full-text search not implemented)
-- NOTE: Will add indexes when support features are actively used

-- No indexes initially - add when support features are built

CREATE TABLE IF NOT EXISTS support_ticket_replies (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    
    -- Reply Details
    author_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    attachments JSONB DEFAULT '[]'::jsonb,
    
    -- Internal Notes (not visible to user)
    is_internal BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- =====================================================
-- SUPPORT_TICKET_REPLIES INDEXES (OPTIMIZED)
-- =====================================================
-- Audit Result: All indexes had 0 scans (support system not in use yet)
-- REMOVED: idx_support_ticket_replies_ticket_id, idx_support_ticket_replies_author_id,
--          idx_support_ticket_replies_created_at, idx_support_ticket_replies_external (all 0 scans)
-- REMOVED: idx_support_ticket_replies_attachments_gin (0 scans - JSONB search not used yet)
-- NOTE: Will add indexes when support features are actively used

-- No indexes initially - add when support features are built

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

-- =====================================================
-- USER_PREFERENCES INDEXES (OPTIMIZED)
-- =====================================================
-- Audit Result: Unique constraint auto-creates index on user_id
-- REMOVED: idx_user_preferences_user_id (redundant - unique constraint covers this)
-- NOTE: No additional indexes needed (always queried by user_id with unique constraint)

-- No additional indexes needed (unique constraint on user_id is sufficient)

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

-- =====================================================
-- BLOCKLIST INDEXES (OPTIMIZED)
-- =====================================================
-- Audit Result: All indexes had 0 scans (blocklist not in use yet)
-- REMOVED: idx_blocklist_blocker_id, idx_blocklist_blocked_user_id (all 0 scans)
-- NOTE: Will add indexes when blocklist features are actively used

-- No indexes initially - add when blocklist features are built

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

-- =====================================================
-- REPORTED_CONTENT INDEXES (OPTIMIZED)
-- =====================================================
-- Audit Result: All indexes had 0 scans (content reporting not in use yet)
-- REMOVED: idx_reported_content_reported_by, idx_reported_content_reported_user,
--          idx_reported_content_content, idx_reported_content_status,
--          idx_reported_content_created_at, idx_reported_content_pending (all 0 scans)
-- NOTE: Will add indexes when content reporting features are actively used

-- No indexes initially - add when content reporting features are built

-- =====================================================
-- TRIGGERS
-- =====================================================

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

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE audit_logs IS 'Audit trail of all system actions. Optimized with no indexes (audit logging not active).';
COMMENT ON TABLE support_tickets IS 'Customer support tickets. Optimized with no indexes (support system not active).';
COMMENT ON TABLE support_ticket_replies IS 'Replies to support tickets. Optimized with no indexes (support system not active).';
COMMENT ON TABLE user_preferences IS 'User preferences and settings. Optimized with unique constraint only (no additional indexes needed).';
COMMENT ON TABLE blocklist IS 'User blocklist for preventing interactions. Optimized with no indexes (blocklist not active).';
COMMENT ON TABLE reported_content IS 'Content reporting and moderation. Optimized with no indexes (reporting not active).';

-- =====================================================
-- ROLLBACK INSTRUCTIONS
-- =====================================================
-- To rollback this migration, run:
--
-- DROP TRIGGER IF EXISTS support_tickets_generate_number ON support_tickets;
-- DROP TRIGGER IF EXISTS reported_content_updated_at ON reported_content;
-- DROP TRIGGER IF EXISTS user_preferences_updated_at ON user_preferences;
-- DROP TRIGGER IF EXISTS support_ticket_replies_updated_at ON support_ticket_replies;
-- DROP TRIGGER IF EXISTS support_tickets_updated_at ON support_tickets;
-- DROP FUNCTION IF EXISTS generate_ticket_number();
-- DROP SEQUENCE IF EXISTS ticket_number_seq;
-- DROP TABLE IF EXISTS reported_content CASCADE;
-- DROP TABLE IF EXISTS blocklist CASCADE;
-- DROP TABLE IF EXISTS user_preferences CASCADE;
-- DROP TABLE IF EXISTS support_ticket_replies CASCADE;
-- DROP TABLE IF EXISTS support_tickets CASCADE;
-- DROP TABLE IF EXISTS audit_logs CASCADE;
