-- V007: Create tutorials tables
-- Tables for tutorials, sections, and topics

-- Difficulty level enum
DO $$ BEGIN
    CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tutorials table
CREATE TABLE IF NOT EXISTS tutorials (
    id SERIAL PRIMARY KEY,
    slug VARCHAR(500) NOT NULL UNIQUE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    featured_image VARCHAR(500),
    difficulty_level difficulty_level DEFAULT 'beginner',
    estimated_time INTEGER, -- in minutes
    author_id INTEGER REFERENCES authors(id) ON DELETE SET NULL,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    completion_count INTEGER DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    prerequisites JSONB DEFAULT '[]',
    learning_outcomes JSONB DEFAULT '[]',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tutorial sections table
CREATE TABLE IF NOT EXISTS tutorial_sections (
    id SERIAL PRIMARY KEY,
    tutorial_id INTEGER NOT NULL REFERENCES tutorials(id) ON DELETE CASCADE,
    slug VARCHAR(500) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    estimated_time INTEGER, -- in minutes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tutorial_id, slug)
);

-- Tutorial topics table
CREATE TABLE IF NOT EXISTS tutorial_topics (
    id SERIAL PRIMARY KEY,
    section_id INTEGER NOT NULL REFERENCES tutorial_sections(id) ON DELETE CASCADE,
    slug VARCHAR(500) NOT NULL,
    title VARCHAR(500) NOT NULL,
    content TEXT,
    code_examples JSONB DEFAULT '[]',
    sort_order INTEGER DEFAULT 0,
    estimated_time INTEGER, -- in minutes
    video_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(section_id, slug)
);

-- Tutorial media table
CREATE TABLE IF NOT EXISTS tutorial_media (
    id SERIAL PRIMARY KEY,
    tutorial_id INTEGER NOT NULL REFERENCES tutorials(id) ON DELETE CASCADE,
    topic_id INTEGER REFERENCES tutorial_topics(id) ON DELETE SET NULL,
    media_type VARCHAR(50) NOT NULL,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tutorial progress table
CREATE TABLE IF NOT EXISTS tutorial_progress (
    id SERIAL PRIMARY KEY,
    tutorial_id INTEGER NOT NULL REFERENCES tutorials(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL,
    topic_id INTEGER REFERENCES tutorial_topics(id) ON DELETE SET NULL,
    is_completed BOOLEAN DEFAULT false,
    progress_percentage DECIMAL(5, 2) DEFAULT 0,
    last_accessed_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tutorial_id, user_id)
);

-- Tutorial bookmarks table
CREATE TABLE IF NOT EXISTS tutorial_bookmarks (
    id SERIAL PRIMARY KEY,
    tutorial_id INTEGER NOT NULL REFERENCES tutorials(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL,
    topic_id INTEGER REFERENCES tutorial_topics(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tutorial_id, user_id, topic_id)
);

-- Indexes for tutorials
CREATE INDEX IF NOT EXISTS idx_tutorials_slug ON tutorials(slug);
CREATE INDEX IF NOT EXISTS idx_tutorials_author_id ON tutorials(author_id);
CREATE INDEX IF NOT EXISTS idx_tutorials_category_id ON tutorials(category_id);
CREATE INDEX IF NOT EXISTS idx_tutorials_is_published ON tutorials(is_published);
CREATE INDEX IF NOT EXISTS idx_tutorials_is_featured ON tutorials(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_tutorials_difficulty ON tutorials(difficulty_level);

-- Indexes for tutorial_sections
CREATE INDEX IF NOT EXISTS idx_tutorial_sections_tutorial_id ON tutorial_sections(tutorial_id);
CREATE INDEX IF NOT EXISTS idx_tutorial_sections_sort_order ON tutorial_sections(sort_order);

-- Indexes for tutorial_topics
CREATE INDEX IF NOT EXISTS idx_tutorial_topics_section_id ON tutorial_topics(section_id);
CREATE INDEX IF NOT EXISTS idx_tutorial_topics_sort_order ON tutorial_topics(sort_order);

-- Indexes for tutorial_progress
CREATE INDEX IF NOT EXISTS idx_tutorial_progress_tutorial_id ON tutorial_progress(tutorial_id);
CREATE INDEX IF NOT EXISTS idx_tutorial_progress_user_id ON tutorial_progress(user_id);

-- Triggers for updated_at
CREATE TRIGGER update_tutorials_updated_at
    BEFORE UPDATE ON tutorials
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tutorial_sections_updated_at
    BEFORE UPDATE ON tutorial_sections
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tutorial_topics_updated_at
    BEFORE UPDATE ON tutorial_topics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tutorial_progress_updated_at
    BEFORE UPDATE ON tutorial_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
