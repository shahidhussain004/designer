-- =====================================================
-- V13: Create Notifications & Reviews Tables
-- Description: User notifications and rating/review system
-- OPTIMIZED: json → jsonb for categories, better indexes
-- =====================================================

CREATE TABLE IF NOT EXISTS notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification Details
    type VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    
    -- Related Entity (polymorphic)
    related_entity_type VARCHAR(50),
    related_entity_id BIGINT,
    action_url TEXT,
    
    -- Status
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP(6),
    is_archived BOOLEAN DEFAULT FALSE,
    
    -- Preferences
    notification_channel VARCHAR(50),
    priority VARCHAR(20),
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deleted_at TIMESTAMP(6)
);

-- Indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC) WHERE deleted_at IS NULL;

-- Unread notifications
CREATE INDEX idx_notifications_unread ON notifications(user_id, created_at DESC) 
    WHERE is_read = FALSE AND deleted_at IS NULL;

-- High priority notifications
CREATE INDEX idx_notifications_priority ON notifications(user_id, priority, created_at DESC) 
    WHERE is_read = FALSE AND priority IN ('HIGH', 'URGENT') AND deleted_at IS NULL;

-- Related entity lookup
CREATE INDEX idx_notifications_related_entity ON notifications(related_entity_type, related_entity_id) 
    WHERE related_entity_type IS NOT NULL;

CREATE TABLE IF NOT EXISTS reviews (
    id BIGSERIAL PRIMARY KEY,
    
    -- Reviewer and Reviewed
    reviewer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewed_user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Related Contract/Project
    contract_id BIGINT REFERENCES contracts(id) ON DELETE SET NULL,
    project_id BIGINT REFERENCES projects(id) ON DELETE SET NULL,
    
    -- Review Content
    rating NUMERIC(3,2) NOT NULL,
    title VARCHAR(255),
    comment TEXT,
    -- CHANGED: json → jsonb for detailed category ratings
    -- Format: {"communication": 5.0, "quality": 4.5, "timeliness": 4.0, "professionalism": 5.0}
    categories JSONB DEFAULT '{}'::jsonb,
    
    -- Status & Moderation
    status VARCHAR(50) DEFAULT 'PUBLISHED' NOT NULL,
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    
    -- Engagement
    helpful_count INTEGER DEFAULT 0 NOT NULL,
    unhelpful_count INTEGER DEFAULT 0 NOT NULL,
    
    -- Response from Reviewed User
    response_comment TEXT,
    response_at TIMESTAMP(6),
    
    -- Timestamps
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Constraints
    CONSTRAINT reviews_rating_check CHECK (rating >= 0 AND rating <= 5),
    CONSTRAINT reviews_status_check CHECK (status IN ('DRAFT', 'PUBLISHED', 'FLAGGED', 'REMOVED')),
    CONSTRAINT reviews_different_users_check CHECK (reviewer_id != reviewed_user_id),
    CONSTRAINT reviews_unique_contract_reviewer UNIQUE(contract_id, reviewer_id),
    CONSTRAINT reviews_helpful_check CHECK (helpful_count >= 0 AND unhelpful_count >= 0)
);

-- Indexes
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_reviewed_user_id ON reviews(reviewed_user_id);
CREATE INDEX idx_reviews_contract_id ON reviews(contract_id) WHERE contract_id IS NOT NULL;
CREATE INDEX idx_reviews_project_id ON reviews(project_id) WHERE project_id IS NOT NULL;
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- Published reviews only
CREATE INDEX idx_reviews_published ON reviews(reviewed_user_id, rating DESC, created_at DESC) 
    WHERE status = 'PUBLISHED';

-- Verified reviews
CREATE INDEX idx_reviews_verified ON reviews(reviewed_user_id, created_at DESC) 
    WHERE is_verified_purchase = TRUE AND status = 'PUBLISHED';

-- Rating range queries
CREATE INDEX idx_reviews_rating ON reviews(rating DESC) WHERE status = 'PUBLISHED';

-- GIN index for categories
CREATE INDEX idx_reviews_categories_gin ON reviews USING GIN(categories);

-- Full-text search on comment
CREATE INDEX idx_reviews_search ON reviews USING GIN(to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(comment, ''))) 
    WHERE status = 'PUBLISHED';

-- Triggers
CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Update user rating stats when review is created/updated/deleted
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
COMMENT ON TABLE reviews IS 'User ratings and reviews for completed work and collaborations';
COMMENT ON COLUMN reviews.categories IS 'JSONB object: {"communication": 5.0, "quality": 4.5, "timeliness": 4.0}';