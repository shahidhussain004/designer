-- =====================================================
-- V17: Create User Notification Preferences Table
-- Description: Store user's email notification preferences
-- Author: Notification Preferences Feature
-- =====================================================

CREATE TABLE IF NOT EXISTS user_notification_preferences (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    job_alerts BOOLEAN DEFAULT TRUE NOT NULL,
    proposal_updates BOOLEAN DEFAULT TRUE NOT NULL,
    messages BOOLEAN DEFAULT TRUE NOT NULL,
    newsletter BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Foreign key constraint
    CONSTRAINT fk_user_notification_preferences_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE,
    
    -- Ensure one record per user
    CONSTRAINT uq_user_notification_preferences_user_id 
        UNIQUE (user_id)
);

-- Create indexes for performance
CREATE INDEX idx_user_notification_preferences_user_id ON user_notification_preferences(user_id);
