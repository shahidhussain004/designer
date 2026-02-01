-- =====================================================
-- V13: Create Notifications & Reviews Tables
-- Description: User notifications and rating/review system
-- OPTIMIZED: Removed 8 unused indexes (0 scans), removed JSONB GIN index, removed full-text search index
-- Author: Database Audit & Optimization 2026-01-26
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

-- =====================================================
-- NOTIFICATIONS INDEXES (OPTIMIZED)
-- =====================================================
-- Audit Result: All indexes had 0 scans (notification system not in use yet)
-- REMOVED: idx_notifications_user_id, idx_notifications_type, idx_notifications_created_at,
--          idx_notifications_unread, idx_notifications_priority, idx_notifications_related_entity (all 0 scans)
-- NOTE: Will add indexes when notification features are actively used

-- No indexes initially - add when notification features are built

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

-- =====================================================
-- REVIEWS INDEXES (OPTIMIZED)
-- =====================================================
-- Audit Result: All indexes had 0 scans (review system not in use yet)
-- REMOVED: idx_reviews_reviewer_id, idx_reviews_reviewed_user_id, idx_reviews_contract_id,
--          idx_reviews_project_id, idx_reviews_created_at, idx_reviews_published,
--          idx_reviews_verified, idx_reviews_rating (all 0 scans)
-- REMOVED: idx_reviews_categories_gin (0 scans - JSONB search not used yet)
-- REMOVED: idx_reviews_search (0 scans - full-text search not implemented)
-- NOTE: Will add indexes when review features are actively used

-- No indexes initially - add when review features are built

-- =====================================================
-- TRIGGERS
-- =====================================================

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

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE notifications IS 'User notifications for various platform events. Optimized with no indexes (notification system not active).';
COMMENT ON TABLE reviews IS 'User ratings and reviews for completed work. Optimized with no indexes (review system not active).';
COMMENT ON COLUMN reviews.categories IS 'JSONB object: {"communication": 5.0, "quality": 4.5, "timeliness": 4.0}';

-- =====================================================
-- ROLLBACK INSTRUCTIONS
-- =====================================================
-- To rollback this migration, run:
--
-- DROP TRIGGER IF EXISTS trg_update_user_rating_stats ON reviews;
-- DROP TRIGGER IF EXISTS reviews_updated_at ON reviews;
-- DROP FUNCTION IF EXISTS update_user_rating_stats();
-- DROP TABLE IF EXISTS reviews CASCADE;
-- DROP TABLE IF EXISTS notifications CASCADE;
