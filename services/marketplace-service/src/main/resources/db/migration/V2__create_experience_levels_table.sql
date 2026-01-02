-- =====================================================
-- V2: Create Experience Levels Reference Table
-- Description: Lookup table for job experience level requirements
-- =====================================================

CREATE TABLE IF NOT EXISTS experience_levels (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    code VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    years_min INTEGER,
    years_max INTEGER,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_experience_levels_code ON experience_levels(code);
CREATE INDEX IF NOT EXISTS idx_experience_levels_is_active ON experience_levels(is_active);
CREATE INDEX IF NOT EXISTS idx_experience_levels_display_order ON experience_levels(display_order);

-- Insert default experience levels
INSERT INTO experience_levels (name, code, description, years_min, years_max, display_order) VALUES
('Entry Level', 'ENTRY', 'Less than 2 years of professional experience', 0, 2, 1),
('Intermediate', 'INTERMEDIATE', '2-5 years of professional experience', 2, 5, 2),
('Senior', 'SENIOR', '5-10 years of professional experience', 5, 10, 3),
('Lead', 'LEAD', '10+ years and leadership experience', 10, 99, 4),
('Executive', 'EXECUTIVE', 'C-suite or executive management level', 15, 99, 5)
ON CONFLICT (name) DO NOTHING;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_experience_levels_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_experience_levels_updated_at
BEFORE UPDATE ON experience_levels
FOR EACH ROW
EXECUTE FUNCTION update_experience_levels_updated_at();

COMMENT ON TABLE experience_levels IS 'Reference lookup table for job experience level requirements';
COMMENT ON COLUMN experience_levels.code IS 'Machine-readable code: ENTRY, INTERMEDIATE, SENIOR, LEAD, EXECUTIVE';
