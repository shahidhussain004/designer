-- =====================================================
-- V3: Create Job Categories Reference Table
-- Description: Categories for traditional company job postings
-- =====================================================

CREATE TABLE IF NOT EXISTS job_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_job_categories_slug ON job_categories(slug);
CREATE INDEX IF NOT EXISTS idx_job_categories_is_active ON job_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_job_categories_display_order ON job_categories(display_order);

-- Insert default job categories
INSERT INTO job_categories (name, slug, description, icon, display_order) VALUES
('Software Development', 'software-development', 'Full-stack, backend, frontend, mobile development roles', 'code', 1),
('Data Science & Analytics', 'data-science', 'Data scientists, analysts, ML engineers, statisticians', 'chart-bar', 2),
('Design & UX', 'design-ux', 'UI/UX designers, graphic designers, product designers', 'palette', 3),
('Product Management', 'product-management', 'Product managers, product owners, technical product leads', 'briefcase', 4),
('Sales & Business Development', 'sales-bd', 'Sales executives, business development, account managers', 'trending-up', 5),
('Marketing', 'marketing', 'Digital marketers, content creators, marketing managers', 'megaphone', 6),
('DevOps & Infrastructure', 'devops-infrastructure', 'DevOps engineers, cloud architects, infrastructure specialists', 'server', 7),
('Finance & Accounting', 'finance-accounting', 'Accountants, financial analysts, CFOs, controllers', 'calculator', 8),
('Human Resources', 'human-resources', 'HR managers, recruiters, talent acquisition specialists', 'users', 9),
('Customer Support', 'customer-support', 'Customer service, support specialists, success managers', 'headphones', 10)
ON CONFLICT (name) DO NOTHING;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_job_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_job_categories_updated_at
BEFORE UPDATE ON job_categories
FOR EACH ROW
EXECUTE FUNCTION update_job_categories_updated_at();

COMMENT ON TABLE job_categories IS 'Categories for traditional company job postings';
COMMENT ON COLUMN job_categories.slug IS 'URL-friendly identifier for the category';
