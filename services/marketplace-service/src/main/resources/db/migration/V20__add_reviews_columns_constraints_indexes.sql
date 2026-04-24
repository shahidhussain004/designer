-- V20__add_reviews_columns_constraints_indexes.sql
-- Add performance indexes to reviews table
-- NOTE: Columns, check constraints, and foreign keys already exist from V13
-- This migration only adds missing indexes for query optimization

-- No need to add columns or constraints - they already exist from V13 migration
-- Schema validation:
-- - Columns: id, reviewer_id, reviewed_user_id, contract_id, project_id, rating, title, 
--           comment, categories, status, is_verified_purchase, helpful_count, unhelpful_count,
--           response_comment, response_at, created_at, updated_at ✓
-- - Check constraints: rating range, status values, self-review prevention, helpful counts ✓
-- - Foreign keys: contract_id, project_id ✓
-- - Unique constraint: (contract_id, reviewer_id) ✓

-- ============================================================================
-- PHASE 1: Create missing performance indexes
-- ============================================================================

-- Index for "reviews by" queries (reviewer lookup)
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id 
  ON reviews (reviewer_id);

-- Index for "reviews for" queries (reviewed user lookup)
CREATE INDEX IF NOT EXISTS idx_reviews_reviewed_user_id 
  ON reviews (reviewed_user_id);

-- Composite covering index for published reviews (most common query pattern)
-- Covers: filter by user + status + order by time
CREATE INDEX IF NOT EXISTS idx_reviews_published 
  ON reviews (reviewed_user_id, status, created_at DESC) 
  WHERE status = 'PUBLISHED';

-- Partial index for verified purchases (subset query)
CREATE INDEX IF NOT EXISTS idx_reviews_verified 
  ON reviews (reviewed_user_id, created_at DESC) 
  WHERE is_verified_purchase = TRUE AND status = 'PUBLISHED';

-- Index for contract-based lookups
CREATE INDEX IF NOT EXISTS idx_reviews_contract_id 
  ON reviews (contract_id) 
  WHERE contract_id IS NOT NULL;

-- Index for rating-based queries (leaderboards)
CREATE INDEX IF NOT EXISTS idx_reviews_rating 
  ON reviews (rating DESC) 
  WHERE status = 'PUBLISHED';

-- Index for time-based queries
CREATE INDEX IF NOT EXISTS idx_reviews_created_at 
  ON reviews (created_at DESC);

-- GIN index for JSONB category searches (nested field queries)
CREATE INDEX IF NOT EXISTS idx_reviews_categories_gin 
  ON reviews USING GIN(categories);

-- Full-text search index on title and comment
CREATE INDEX IF NOT EXISTS idx_reviews_search 
  ON reviews USING GIN(to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(comment, '')))
  WHERE status = 'PUBLISHED';
