-- =====================================================
-- V6: Create Project Categories Reference Table
-- Description: Categories for freelance/gig project postings
-- OPTIMIZED: Added partial indexes, better constraints
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

-- Indexes (partial indexes for active records)
CREATE UNIQUE INDEX idx_project_categories_slug_active ON project_categories(slug) WHERE is_active = TRUE;
CREATE INDEX idx_project_categories_display_order ON project_categories(display_order) WHERE is_active = TRUE;

-- Full-text search
CREATE INDEX idx_project_categories_search ON project_categories USING GIN(
    to_tsvector('english', name || ' ' || COALESCE(description, ''))
) WHERE is_active = TRUE;

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

-- Trigger for updated_at
CREATE TRIGGER project_categories_updated_at 
    BEFORE UPDATE ON project_categories 
    FOR EACH ROW 
    EXECUTE FUNCTION update_timestamp();

COMMENT ON TABLE project_categories IS 'Categories for freelance/gig project postings';
COMMENT ON COLUMN project_categories.slug IS 'URL-friendly identifier for the project category';