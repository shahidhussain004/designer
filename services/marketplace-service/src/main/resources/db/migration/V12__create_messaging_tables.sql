-- =====================================================
-- V12: Create Messaging & Communication Tables
-- Description: Real-time messaging and communication between users
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
    unread_count_user1 INTEGER DEFAULT 0,
    unread_count_user2 INTEGER DEFAULT 0,
    
    -- Last activity
    last_message_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    
    -- Constraint to ensure different users
    CONSTRAINT chk_different_users CHECK (user_id_1 < user_id_2),
    CONSTRAINT unique_thread UNIQUE(user_id_1, user_id_2, project_id, job_id, contract_id)
);

-- Create indexes for message threads
CREATE INDEX IF NOT EXISTS idx_message_threads_user_id_1 ON message_threads(user_id_1);
CREATE INDEX IF NOT EXISTS idx_message_threads_user_id_2 ON message_threads(user_id_2);
CREATE INDEX IF NOT EXISTS idx_message_threads_project_id ON message_threads(project_id);
CREATE INDEX IF NOT EXISTS idx_message_threads_job_id ON message_threads(job_id);
CREATE INDEX IF NOT EXISTS idx_message_threads_is_archived ON message_threads(is_archived);
CREATE INDEX IF NOT EXISTS idx_message_threads_last_message_at ON message_threads(last_message_at DESC);

CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    thread_id BIGINT NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,
    sender_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Message Content
    body TEXT NOT NULL,
    attachments TEXT[],
    
    -- Message Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    -- Edit History
    edited_at TIMESTAMP,
    edit_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create indexes for messages
CREATE INDEX IF NOT EXISTS idx_messages_thread_id ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_thread_created ON messages(thread_id, created_at DESC);

-- Create trigger for message_threads updated_at
CREATE OR REPLACE FUNCTION update_message_threads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_message_threads_updated_at
BEFORE UPDATE ON message_threads
FOR EACH ROW
EXECUTE FUNCTION update_message_threads_updated_at();

-- Create trigger for messages updated_at
CREATE OR REPLACE FUNCTION update_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_messages_updated_at
BEFORE UPDATE ON messages
FOR EACH ROW
EXECUTE FUNCTION update_messages_updated_at();

-- Create trigger to update thread last_message_at
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

COMMENT ON TABLE message_threads IS 'Conversation threads between two users';
COMMENT ON COLUMN message_threads.subject IS 'Optional subject for the conversation';
COMMENT ON COLUMN message_threads.project_id IS 'Associated project (optional) for context';
COMMENT ON TABLE messages IS 'Individual messages within a thread';
COMMENT ON COLUMN messages.is_read IS 'Read status of the message for the recipient';
