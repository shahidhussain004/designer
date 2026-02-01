-- V008: Create resources table
-- Resources for downloadable content, guides, templates

CREATE TABLE IF NOT EXISTS resources (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(500) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    content TEXT,
    resource_type VARCHAR(100) DEFAULT 'guide',
    category VARCHAR(100),
    tags TEXT[] DEFAULT '{}',
    file_url VARCHAR(500),
    file_size INTEGER, -- in bytes
    file_type VARCHAR(50),
    thumbnail_url VARCHAR(500),
    author_id INTEGER REFERENCES authors(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_premium BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    meta_title VARCHAR(255),
    meta_description TEXT,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_resources_slug ON resources(slug);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_resource_type ON resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_resources_is_published ON resources(is_published);
CREATE INDEX IF NOT EXISTS idx_resources_is_featured ON resources(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_resources_author_id ON resources(author_id);
CREATE INDEX IF NOT EXISTS idx_resources_tags ON resources USING gin(tags);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_resources_search ON resources 
    USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(content, '')));

-- Trigger for updated_at
CREATE TRIGGER update_resources_updated_at
    BEFORE UPDATE ON resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
