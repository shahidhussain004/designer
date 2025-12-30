-- V10__create_reviews_table.sql
-- Create reviews table for rating and feedback system
-- One review per contract, supports detailed category ratings

CREATE TABLE reviews (
    id BIGSERIAL PRIMARY KEY,
    contract_id BIGINT NOT NULL UNIQUE,
    reviewer_user_id BIGINT NOT NULL,
    reviewed_user_id BIGINT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    categories JSONB, -- {communication: 5, quality: 4, timeliness: 5, professionalism: 5}
    is_anonymous BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'PUBLISHED', -- 'DRAFT', 'PUBLISHED', 'HIDDEN', 'FLAGGED'
    flagged_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_contract FOREIGN KEY (contract_id) REFERENCES contracts(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_reviewer FOREIGN KEY (reviewer_user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_reviewed FOREIGN KEY (reviewed_user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_rating_range CHECK (rating >= 1 AND rating <= 5),
    CONSTRAINT chk_review_status CHECK (status IN ('DRAFT', 'PUBLISHED', 'HIDDEN', 'FLAGGED'))
);

-- Indexes for efficient queries
CREATE INDEX idx_reviews_contract_id ON reviews(contract_id);
CREATE INDEX idx_reviews_reviewer_user_id ON reviews(reviewer_user_id);
CREATE INDEX idx_reviews_reviewed_user_id ON reviews(reviewed_user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_reviewed_user_rating ON reviews(reviewed_user_id, rating DESC);
CREATE INDEX idx_reviews_reviewed_user_created ON reviews(reviewed_user_id, created_at DESC);

-- Trigger for updated_at timestamp
CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE reviews IS 'Reviews and ratings for completed contracts, supports detailed category scoring';
COMMENT ON COLUMN reviews.contract_id IS 'Contract being reviewed (one review per contract)';
COMMENT ON COLUMN reviews.reviewer_user_id IS 'User who wrote the review';
COMMENT ON COLUMN reviews.reviewed_user_id IS 'User being reviewed (freelancer or client)';
COMMENT ON COLUMN reviews.rating IS 'Overall rating from 1 (poor) to 5 (excellent)';
COMMENT ON COLUMN reviews.categories IS 'JSON object with detailed category ratings (e.g., {communication: 5, quality: 4})';
COMMENT ON COLUMN reviews.is_anonymous IS 'If true, reviewer name is hidden in public display';
COMMENT ON COLUMN reviews.status IS 'Review status: DRAFT, PUBLISHED, HIDDEN (by user), or FLAGGED (by admin)';

-- Function to update user rating statistics after review insert/update/delete
CREATE OR REPLACE FUNCTION update_user_rating_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the reviewed user's rating average and count
    -- This function recalculates stats whenever a review is added, updated, or deleted
    
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

-- Trigger to automatically update user rating statistics
CREATE TRIGGER update_user_rating_stats_trigger
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_user_rating_stats();

COMMENT ON FUNCTION update_user_rating_stats() IS 'Automatically recalculates user rating_avg and rating_count when reviews change';
