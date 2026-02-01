-- =====================================================
-- V2: Create Experience Levels Reference Table
-- Description: Lookup table for job experience level requirements
-- OPTIMIZED: Removed unused indexes, kept only essential constraints
-- Author: Database Audit & Optimization 2026-01-26
-- =====================================================

CREATE TABLE IF NOT EXISTS experience_levels (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    years_min INTEGER,
    years_max INTEGER,
    display_order INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    created_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Constraints
    CONSTRAINT experience_years_check CHECK (years_max IS NULL OR years_min IS NULL OR years_max >= years_min),
    CONSTRAINT experience_display_order_check CHECK (display_order >= 0)
);

-- =====================================================
-- EXPERIENCE_LEVELS INDEXES (OPTIMIZED)
-- =====================================================
-- Audit Result: ALL indexes had 0 scans except primary key and unique constraints
-- REMOVED: idx_experience_levels_code, idx_experience_levels_display_order
-- KEPT: Primary key (auto-created), unique constraints on name and code (auto-indexed)

-- No additional indexes needed - unique constraints provide sufficient indexing

-- Seed data: See resources/db/seed_data/01_experience_levels_seed.sql

-- Trigger for updated_at
CREATE TRIGGER experience_levels_updated_at 
    BEFORE UPDATE ON experience_levels 
    FOR EACH ROW 
    EXECUTE FUNCTION update_timestamp();

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE experience_levels IS 'Reference lookup table for job experience level requirements';
COMMENT ON COLUMN experience_levels.code IS 'Machine-readable code: ENTRY, INTERMEDIATE, SENIOR, LEAD, EXECUTIVE';

-- =====================================================
-- ROLLBACK INSTRUCTIONS
-- =====================================================
-- To rollback this migration, run:
--
-- DROP TRIGGER IF EXISTS experience_levels_updated_at ON experience_levels;
-- DROP TABLE IF EXISTS experience_levels CASCADE;
