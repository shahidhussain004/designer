-- =====================================================
-- V6: Create Project Categories Reference Table
-- Description: Categories for freelance/gig project postings
-- =====================================================

CREATE TABLE IF NOT EXISTS project_categories (
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

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_project_categories_slug ON project_categories(slug);
CREATE INDEX IF NOT EXISTS idx_project_categories_is_active ON project_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_project_categories_display_order ON project_categories(display_order);

-- Insert default project categories
INSERT INTO project_categories (name, slug, description, icon, display_order) VALUES
('Web Development', 'web-development', 'Website design and development projects', 'globe', 1),
('Mobile Development', 'mobile-development', 'iOS and Android app development', 'smartphone', 2),
('Design', 'design', 'Graphic design, UI/UX design, branding', 'palette', 3),
('Writing & Content', 'writing-content', 'Content writing, copywriting, blogging', 'feather', 4),
('Marketing', 'marketing', 'Digital marketing, SEO, social media', 'trending-up', 5),
('Data Science', 'data-science', 'Machine learning, data analysis, data engineering', 'chart-bar', 6),
('DevOps & Cloud', 'devops-cloud', 'Cloud infrastructure, deployment, DevOps', 'server', 7),
('IT & Networking', 'it-networking', 'IT support, networking, security', 'shield', 8),
('Consulting', 'consulting', 'Business consulting, strategy, advice', 'briefcase', 9),
('Other', 'other', 'Other types of projects', 'folder', 10)
ON CONFLICT (name) DO NOTHING;

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_project_categories_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_project_categories_updated_at
BEFORE UPDATE ON project_categories
FOR EACH ROW
EXECUTE FUNCTION update_project_categories_updated_at();

COMMENT ON TABLE project_categories IS 'Categories for freelance/gig project postings';
COMMENT ON COLUMN project_categories.slug IS 'URL-friendly identifier for the project category';
