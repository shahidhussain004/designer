-- Add missing columns expected by JPA entity PortfolioItem
BEGIN;

ALTER TABLE IF EXISTS portfolio_items
  ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_visible BOOLEAN DEFAULT TRUE,
  ADD COLUMN IF NOT EXISTS technologies TEXT[];

-- Populate new columns from previous columns if present
UPDATE portfolio_items SET display_order = COALESCE(highlight_order, 0) WHERE display_order IS NULL OR display_order = 0;
UPDATE portfolio_items SET is_visible = COALESCE(is_public, TRUE) WHERE is_visible IS NULL;
UPDATE portfolio_items SET technologies = COALESCE(skills_demonstrated, ARRAY[]::text[]) WHERE technologies IS NULL;

ALTER TABLE portfolio_items ALTER COLUMN display_order SET NOT NULL;
ALTER TABLE portfolio_items ALTER COLUMN is_visible SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_portfolio_visible_order ON portfolio_items(is_visible, display_order);

COMMIT;
