-- =====================================================
-- V12: Create Messaging & Communication Tables
-- Description: Real-time messaging and communication between users
-- OPTIMIZED: Removed 8 unused indexes (0 scans), removed full-text search index
-- Author: Database Audit & Optimization 2026-01-26
-- =====================================================

CREATE TABLE IF NOT EXISTS message_threads (
    id BIGSERIAL PRIMARY KEY,
    
    -- Participants
    user_id_1 BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_id_2 BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Context (optional)
    project_id BIGINT REFERENCES projects(id) ON DELETE SET NULL,
    job_id BIGINT REFERENCES jobs(id) ON DELETE SET NULL,
    contract_id BIGINT REFERENCES contracts(id) ON DELETE SET NULL,
    
    -- Thread Information
    subject VARCHAR(255),
    is_archived BOOLEAN DEFAULT FALSE,
    
    -- Unread counts
    unread_count_user1 INTEGER DEFAULT 0 NOT NULL,
    unread_count_user2 INTEGER DEFAULT 0 NOT NULL,
    
    -- Last activity
    last_message_at TIMESTAMP(6),
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP(6),
    
    -- Constraint to ensure different users
    CONSTRAINT message_threads_different_users_check CHECK (user_id_1 < user_id_2),
    CONSTRAINT message_threads_unique_thread UNIQUE(user_id_1, user_id_2, project_id, job_id, contract_id),
    CONSTRAINT message_threads_unread_check CHECK (unread_count_user1 >= 0 AND unread_count_user2 >= 0)
);

-- =====================================================
-- MESSAGE_THREADS INDEXES (OPTIMIZED)
-- =====================================================
-- Audit Result: All indexes had 0 scans (messaging system not in use yet)
-- REMOVED: idx_message_threads_user_id_1, idx_message_threads_user_id_2,
--          idx_message_threads_project_id, idx_message_threads_job_id,
--          idx_message_threads_contract_id, idx_message_threads_last_message_at,
--          idx_message_threads_unread_user1, idx_message_threads_unread_user2,
--          idx_message_threads_active (all 0 scans)
-- NOTE: Will add indexes when messaging features are actively used

-- No indexes initially - add when messaging features are built

CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    thread_id BIGINT NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,
    sender_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Message Content
    body TEXT NOT NULL,
    attachments TEXT[] DEFAULT '{}', -- Simple array of attachment URLs
    
    -- Message Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP(6),
    
    -- Edit History
    edited_at TIMESTAMP(6),
    edit_count INTEGER DEFAULT 0 NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP(6),
    
    CONSTRAINT messages_edit_count_check CHECK (edit_count >= 0)
);

-- =====================================================
-- MESSAGES INDEXES (OPTIMIZED)
-- =====================================================
-- Audit Result: All indexes had 0 scans (messaging system not in use yet)
-- REMOVED: idx_messages_thread_id, idx_messages_sender_id, idx_messages_created_at,
--          idx_messages_thread_created, idx_messages_unread (all 0 scans)
-- REMOVED: idx_messages_search (0 scans - full-text search not implemented)
-- NOTE: Will add indexes when messaging features are actively used

-- No indexes initially - add when messaging features are built

-- =====================================================
-- TRIGGERS
-- =====================================================

CREATE TRIGGER message_threads_updated_at BEFORE UPDATE ON message_threads FOR EACH ROW EXECUTE FUNCTION update_timestamp();
CREATE TRIGGER messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Update thread last_message_at when message is created
CREATE OR REPLACE FUNCTION update_thread_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE message_threads
    SET last_message_at = NEW.created_at,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.thread_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_thread_last_message
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_thread_last_message();

-- Increment unread count when message is created
CREATE OR REPLACE FUNCTION increment_unread_count()
RETURNS TRIGGER AS $$
DECLARE
    thread_user1 BIGINT;
    thread_user2 BIGINT;
BEGIN
    SELECT user_id_1, user_id_2 INTO thread_user1, thread_user2
    FROM message_threads
    WHERE id = NEW.thread_id;
    
    IF NEW.sender_id = thread_user1 THEN
        UPDATE message_threads
        SET unread_count_user2 = unread_count_user2 + 1
        WHERE id = NEW.thread_id;
    ELSE
        UPDATE message_threads
        SET unread_count_user1 = unread_count_user1 + 1
        WHERE id = NEW.thread_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_increment_unread_count
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION increment_unread_count();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE message_threads IS 'Conversation threads between two users. Optimized with no indexes (messaging not active).';
COMMENT ON TABLE messages IS 'Individual messages within a thread. Optimized with no indexes (messaging not active).';
COMMENT ON COLUMN messages.attachments IS 'Text array of attachment URLs';

-- =====================================================
-- ROLLBACK INSTRUCTIONS
-- =====================================================
-- To rollback this migration, run:
--
-- DROP TRIGGER IF EXISTS trg_increment_unread_count ON messages;
-- DROP TRIGGER IF EXISTS trg_update_thread_last_message ON messages;
-- DROP TRIGGER IF EXISTS messages_updated_at ON messages;
-- DROP TRIGGER IF EXISTS message_threads_updated_at ON message_threads;
-- DROP FUNCTION IF EXISTS increment_unread_count();
-- DROP FUNCTION IF EXISTS update_thread_last_message();
-- DROP TABLE IF EXISTS messages CASCADE;
-- DROP TABLE IF EXISTS message_threads CASCADE;
