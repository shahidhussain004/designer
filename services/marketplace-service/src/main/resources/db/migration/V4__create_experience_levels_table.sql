-- Create experience_levels table
CREATE TABLE experience_levels (
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

-- Add index for common queries
CREATE INDEX idx_experience_levels_code ON experience_levels(code);
CREATE INDEX idx_experience_levels_active ON experience_levels(is_active);
CREATE INDEX idx_experience_levels_order ON experience_levels(display_order);

-- Add comment
COMMENT ON TABLE experience_levels IS 'Experience level requirements lookup table';
