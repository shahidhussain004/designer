-- =====================================================
-- V3: Create Job Categories Reference Table
-- Description: Categories for traditional company job postings
-- OPTIMIZED: Removed unused indexes, kept only essential constraints
-- Author: Database Audit & Optimization 2026-01-26
-- =====================================================

CREATE TABLE IF NOT EXISTS job_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Constraints
    CONSTRAINT job_categories_display_order_check CHECK (display_order >= 0)
);

-- =====================================================
-- JOB_CATEGORIES INDEXES (OPTIMIZED)
-- =====================================================
-- Audit Result: job_categories_pkey (141 scans), name_key (30 scans) - both auto-created
--               slug_active (0 scans), display_order (0 scans), search (0 scans) - all unused
-- REMOVED: idx_job_categories_slug_active, idx_job_categories_display_order, idx_job_categories_search
-- KEPT: Primary key (auto-created), unique constraints on name and slug (auto-indexed)

-- No additional indexes needed - unique constraints provide sufficient indexing

-- Seed data: See resources/db/seed_data/01_job_categories_seed.sql

-- Trigger for updated_at
CREATE TRIGGER job_categories_updated_at 
    BEFORE UPDATE ON job_categories 
    FOR EACH ROW 
    EXECUTE FUNCTION update_timestamp();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE job_categories IS 'Categories for traditional company job postings';
COMMENT ON COLUMN job_categories.slug IS 'URL-friendly identifier for the category';

-- =====================================================
-- ROLLBACK INSTRUCTIONS
-- =====================================================
-- To rollback this migration, run:
--
-- DROP TRIGGER IF EXISTS job_categories_updated_at ON job_categories;
-- DROP TABLE IF EXISTS job_categories CASCADE;
