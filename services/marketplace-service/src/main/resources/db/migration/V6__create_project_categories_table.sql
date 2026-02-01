-- =====================================================
-- V6: Create Project Categories Reference Table
-- Description: Categories for freelance/gig project postings
-- OPTIMIZED: Removed unused full-text search index (0 scans)
-- Author: Database Audit & Optimization 2026-01-26
-- =====================================================

CREATE TABLE IF NOT EXISTS project_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Constraints
    CONSTRAINT project_categories_display_order_check CHECK (display_order >= 0)
);

-- =====================================================
-- PROJECT_CATEGORIES INDEXES (OPTIMIZED)
-- =====================================================
-- Audit Result: Only slug lookup had scans
-- REMOVED: idx_project_categories_search (0 scans - full-text search not used)
-- KEPT: slug (unique constraint), display_order for sorting

-- KEPT: Slug lookup (unique constraint auto-creates index)
CREATE UNIQUE INDEX idx_project_categories_slug_active ON project_categories(slug) 
WHERE is_active = TRUE;

-- KEPT: Display order sorting
CREATE INDEX idx_project_categories_display_order ON project_categories(display_order) 
WHERE is_active = TRUE;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger for updated_at
CREATE TRIGGER project_categories_updated_at 
    BEFORE UPDATE ON project_categories 
    FOR EACH ROW 
    EXECUTE FUNCTION update_timestamp();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE project_categories IS 'Categories for freelance/gig project postings. Optimized with minimal indexes.';
COMMENT ON COLUMN project_categories.slug IS 'URL-friendly identifier for the project category';

-- =====================================================
-- ROLLBACK INSTRUCTIONS
-- =====================================================
-- To rollback this migration, run:
--
-- DROP TRIGGER IF EXISTS project_categories_updated_at ON project_categories;
-- DROP TABLE IF EXISTS project_categories CASCADE;
