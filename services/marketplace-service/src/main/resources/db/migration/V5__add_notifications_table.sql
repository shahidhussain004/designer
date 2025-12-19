-- V5__add_notifications_table.sql
-- Create notifications table for user notifications

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
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- Insert sample notifications for testing
INSERT INTO notifications (user_id, type, title, message, related_entity_type, related_entity_id, is_read) VALUES
    (1, 'PROPOSAL_RECEIVED', 'New Proposal Received', 'You have received a new proposal for your job "Full-Stack Developer Needed"', 'JOB', 1, false),
    (2, 'PROPOSAL_ACCEPTED', 'Proposal Accepted', 'Your proposal has been accepted!', 'PROPOSAL', 1, false),
    (3, 'JOB_POSTED', 'Job Successfully Posted', 'Your job "UI/UX Designer for Mobile App" has been posted successfully', 'JOB', 2, true);

COMMENT ON TABLE notifications IS 'User notifications for various events';
COMMENT ON COLUMN notifications.type IS 'Notification type: JOB_POSTED, PROPOSAL_RECEIVED, PROPOSAL_ACCEPTED, etc.';
COMMENT ON COLUMN notifications.is_read IS 'Whether the notification has been read by the user';
