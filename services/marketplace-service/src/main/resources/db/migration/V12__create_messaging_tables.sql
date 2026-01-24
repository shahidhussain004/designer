-- =====================================================
-- V12: Create Messaging & Communication Tables
-- Description: Real-time messaging and communication between users
-- OPTIMIZED: Better indexes, text[] for attachments
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

-- Indexes
CREATE INDEX idx_message_threads_user_id_1 ON message_threads(user_id_1) WHERE deleted_at IS NULL;
CREATE INDEX idx_message_threads_user_id_2 ON message_threads(user_id_2) WHERE deleted_at IS NULL;
CREATE INDEX idx_message_threads_project_id ON message_threads(project_id) WHERE project_id IS NOT NULL;
CREATE INDEX idx_message_threads_job_id ON message_threads(job_id) WHERE job_id IS NOT NULL;
CREATE INDEX idx_message_threads_contract_id ON message_threads(contract_id) WHERE contract_id IS NOT NULL;
CREATE INDEX idx_message_threads_last_message_at ON message_threads(last_message_at DESC) WHERE deleted_at IS NULL;

-- Unread threads
CREATE INDEX idx_message_threads_unread_user1 ON message_threads(user_id_1, last_message_at DESC) 
    WHERE unread_count_user1 > 0 AND deleted_at IS NULL;
CREATE INDEX idx_message_threads_unread_user2 ON message_threads(user_id_2, last_message_at DESC) 
    WHERE unread_count_user2 > 0 AND deleted_at IS NULL;

-- Active (non-archived) threads
CREATE INDEX idx_message_threads_active ON message_threads(last_message_at DESC) 
    WHERE is_archived = FALSE AND deleted_at IS NULL;

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

-- Indexes
CREATE INDEX idx_messages_thread_id ON messages(thread_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_thread_created ON messages(thread_id, created_at DESC) WHERE deleted_at IS NULL;

-- Unread messages
CREATE INDEX idx_messages_unread ON messages(thread_id, created_at DESC) WHERE is_read = FALSE AND deleted_at IS NULL;

-- Full-text search on message body
CREATE INDEX idx_messages_search ON messages USING GIN(to_tsvector('english', body)) WHERE deleted_at IS NULL;

-- Triggers
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

COMMENT ON TABLE message_threads IS 'Conversation threads between two users';
COMMENT ON TABLE messages IS 'Individual messages within a thread';
COMMENT ON COLUMN messages.attachments IS 'Text array of attachment URLs';