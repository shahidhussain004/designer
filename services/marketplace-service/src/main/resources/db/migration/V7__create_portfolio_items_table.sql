-- V7__create_portfolio_items_table.sql
-- Create portfolio_items table for freelancers to showcase their work
-- This table allows freelancers to display multiple portfolio projects with images and descriptions

CREATE TABLE portfolio_items (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    project_url TEXT,
    technologies TEXT[],
    completion_date DATE,
    display_order INTEGER DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_portfolio_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Indexes for efficient queries
CREATE INDEX idx_portfolio_user_id ON portfolio_items(user_id);
CREATE INDEX idx_portfolio_is_visible ON portfolio_items(is_visible);
CREATE INDEX idx_portfolio_display_order ON portfolio_items(user_id, display_order);
CREATE INDEX idx_portfolio_created_at ON portfolio_items(created_at DESC);

-- Trigger for updated_at timestamp
CREATE TRIGGER update_portfolio_items_updated_at
    BEFORE UPDATE ON portfolio_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comment for documentation
COMMENT ON TABLE portfolio_items IS 'Stores freelancer portfolio items with project details, images, and technologies used';
COMMENT ON COLUMN portfolio_items.display_order IS 'Order in which portfolio items appear on profile (lower = first)';
COMMENT ON COLUMN portfolio_items.is_visible IS 'Whether the portfolio item is publicly visible';
