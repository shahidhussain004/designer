-- V22: Add flagged_reason column to reviews table
-- Description: Add moderation flag reason field for flagged reviews
-- Author: Backend Fix 2026-04-24

ALTER TABLE reviews 
ADD COLUMN IF NOT EXISTS flagged_reason TEXT;

-- Add comment for documentation
COMMENT ON COLUMN reviews.flagged_reason IS 'Moderation flag reason - populated when status = FLAGGED';
