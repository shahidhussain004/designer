-- =====================================================
-- V2: Create Experience Levels Reference Table
-- Description: Lookup table for job experience level requirements
-- OPTIMIZED: Added partial indexes, better constraints
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

-- Indexes (partial index for active records only)
CREATE INDEX idx_experience_levels_code ON experience_levels(code) WHERE is_active = TRUE;
CREATE INDEX idx_experience_levels_display_order ON experience_levels(display_order) WHERE is_active = TRUE;

-- Insert default experience levels
INSERT INTO experience_levels (name, code, description, years_min, years_max, display_order) VALUES
('Entry Level', 'ENTRY', 'Less than 2 years of professional experience', 0, 2, 1),
('Intermediate', 'INTERMEDIATE', '2-5 years of professional experience', 2, 5, 2),
('Senior', 'SENIOR', '5-10 years of professional experience', 5, 10, 3),
('Lead', 'LEAD', '10+ years and leadership experience', 10, 99, 4),
('Executive', 'EXECUTIVE', 'C-suite or executive management level', 15, 99, 5)
ON CONFLICT (name) DO NOTHING;

-- Trigger for updated_at
CREATE TRIGGER experience_levels_updated_at 
    BEFORE UPDATE ON experience_levels 
    FOR EACH ROW 
    EXECUTE FUNCTION update_timestamp();

COMMENT ON TABLE experience_levels IS 'Reference lookup table for job experience level requirements';
COMMENT ON COLUMN experience_levels.code IS 'Machine-readable code: ENTRY, INTERMEDIATE, SENIOR, LEAD, EXECUTIVE';