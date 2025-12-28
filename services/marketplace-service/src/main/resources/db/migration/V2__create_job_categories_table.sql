-- Create job_categories table
CREATE TABLE job_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add index for common queries
CREATE INDEX idx_job_categories_slug ON job_categories(slug);
CREATE INDEX idx_job_categories_active ON job_categories(is_active);
CREATE INDEX idx_job_categories_order ON job_categories(display_order);

-- Add comment
COMMENT ON TABLE job_categories IS 'Job categories lookup table';
