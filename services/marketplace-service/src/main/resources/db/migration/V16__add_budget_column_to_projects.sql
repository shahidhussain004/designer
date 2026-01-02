-- =====================================================
-- V16: Add Missing Columns to Projects Table
-- Description: Add budget column and experience_level_id to match Project entity
-- =====================================================

-- Add budget column if it doesn't exist
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS budget NUMERIC(10,2);

-- Add experience_level_id foreign key column
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS experience_level_id BIGINT;

-- Add duration column
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS duration INTEGER;

-- Add view_count column (migration created views_count, but entity expects view_count)
ALTER TABLE projects
ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;

-- Set default values for existing projects (use budget_max or budget_min)
UPDATE projects 
SET budget = COALESCE(budget_max, budget_min, 0)
WHERE budget IS NULL;

-- For experience_level_id, we don't populate it yet as it's optional
-- The entity can work with just the experience_level enum column

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_projects_budget ON projects(budget);
CREATE INDEX IF NOT EXISTS idx_projects_experience_level_id ON projects(experience_level_id);
CREATE INDEX IF NOT EXISTS idx_projects_duration ON projects(duration);
CREATE INDEX IF NOT EXISTS idx_projects_view_count ON projects(view_count);

-- Add foreign key constraint if needed (nullable since experience_level enum exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'fk_projects_experience_level_id'
    ) THEN
        ALTER TABLE projects
        ADD CONSTRAINT fk_projects_experience_level_id 
        FOREIGN KEY (experience_level_id) REFERENCES experience_levels(id) ON DELETE SET NULL;
    END IF;
END$$;

COMMENT ON COLUMN projects.budget IS 'Project budget amount';
COMMENT ON COLUMN projects.experience_level_id IS 'Optional foreign key reference to experience_levels table';


