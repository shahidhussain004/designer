-- =====================================================
-- V13: Create Notifications & Reviews Tables
-- Description: User notifications and rating/review system
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification Details
    type VARCHAR(100) NOT NULL, -- JOB_POSTED, PROPOSAL_RECEIVED, MESSAGE_RECEIVED, PAYMENT_RECEIVED, etc.
    title VARCHAR(255) NOT NULL,
    message TEXT,
    
    -- Related Entity (polymorphic)
    related_entity_type VARCHAR(50), -- JOB, PROJECT, PROPOSAL, MESSAGE, PAYMENT, REVIEW, CONTRACT
    related_entity_id BIGINT,
    action_url TEXT,
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    is_archived BOOLEAN DEFAULT FALSE,
    
    -- Preferences
    notification_channel VARCHAR(50), -- IN_APP, EMAIL, SMS, PUSH
    priority VARCHAR(20), -- LOW, MEDIUM, HIGH, URGENT
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

-- Create indexes for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);

CREATE TABLE IF NOT EXISTS reviews (
    id BIGSERIAL PRIMARY KEY,
    
    -- Reviewer and Reviewed
    reviewer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewed_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Related Contract/Project
    contract_id BIGINT REFERENCES contracts(id) ON DELETE SET NULL,
    project_id BIGINT REFERENCES projects(id) ON DELETE SET NULL,
    
    -- Review Content
    rating DECIMAL(3,2) NOT NULL,
    title VARCHAR(255),
    comment TEXT,
    categories JSONB, -- Store detailed ratings like 'communication', 'quality', 'timeliness'
    
    -- Status & Moderation
    status VARCHAR(50) DEFAULT 'PUBLISHED' NOT NULL, -- DRAFT, PUBLISHED, FLAGGED, REMOVED
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    
    -- Engagement
    helpful_count INTEGER DEFAULT 0,
    unhelpful_count INTEGER DEFAULT 0,
    
    -- Response from Reviewed User
    response_comment TEXT,
    response_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_rating CHECK (rating >= 0 AND rating <= 5),
    CONSTRAINT chk_review_status CHECK (status IN ('DRAFT', 'PUBLISHED', 'FLAGGED', 'REMOVED')),
    CONSTRAINT chk_different_users CHECK (reviewer_id != reviewed_user_id),
    CONSTRAINT unique_contract_reviewer UNIQUE(contract_id, reviewer_id)
);

-- Create indexes for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewed_user_id ON reviews(reviewed_user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_contract_id ON reviews(contract_id);
CREATE INDEX IF NOT EXISTS idx_reviews_project_id ON reviews(project_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_verified_purchase ON reviews(is_verified_purchase);

-- Create trigger for reviews updated_at
CREATE OR REPLACE FUNCTION update_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reviews_updated_at
BEFORE UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_reviews_updated_at();

-- Create trigger to update user rating stats
CREATE OR REPLACE FUNCTION update_user_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE users
        SET 
            rating_avg = (
                SELECT ROUND(AVG(rating)::numeric, 2)
                FROM reviews
                WHERE reviewed_user_id = NEW.reviewed_user_id
                AND status = 'PUBLISHED'
            ),
            rating_count = (
                SELECT COUNT(*)
                FROM reviews
                WHERE reviewed_user_id = NEW.reviewed_user_id
                AND status = 'PUBLISHED'
            )
        WHERE id = NEW.reviewed_user_id;
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        UPDATE users
        SET 
            rating_avg = (
                SELECT COALESCE(ROUND(AVG(rating)::numeric, 2), 0)
                FROM reviews
                WHERE reviewed_user_id = OLD.reviewed_user_id
                AND status = 'PUBLISHED'
            ),
            rating_count = (
                SELECT COUNT(*)
                FROM reviews
                WHERE reviewed_user_id = OLD.reviewed_user_id
                AND status = 'PUBLISHED'
            )
        WHERE id = OLD.reviewed_user_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_user_rating_stats
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_user_rating_stats();

COMMENT ON TABLE notifications IS 'User notifications for various platform events and activities';
COMMENT ON COLUMN notifications.type IS 'Notification type: JOB_POSTED, PROPOSAL_RECEIVED, MESSAGE_RECEIVED, PAYMENT_RECEIVED, etc.';
COMMENT ON COLUMN notifications.priority IS 'Notification priority: LOW, MEDIUM, HIGH, URGENT';
COMMENT ON TABLE reviews IS 'User ratings and reviews for completed work and collaborations';
COMMENT ON COLUMN reviews.status IS 'Review status: DRAFT (not public), PUBLISHED, FLAGGED (under review), REMOVED (deleted)';
COMMENT ON COLUMN reviews.categories IS 'JSON object with category-specific ratings (e.g., communication, quality, timeliness)';
