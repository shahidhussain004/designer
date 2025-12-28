-- Migrate existing data and alter jobs table to use foreign keys

-- Step 1: Add new columns for foreign keys
ALTER TABLE jobs ADD COLUMN category_id BIGINT;
ALTER TABLE jobs ADD COLUMN experience_level_id BIGINT;

-- Step 2: Migrate existing category data
-- Map old string values to new category IDs
UPDATE jobs SET category_id = (SELECT id FROM job_categories WHERE slug = 'web-development') WHERE LOWER(category) LIKE '%web%';
UPDATE jobs SET category_id = (SELECT id FROM job_categories WHERE slug = 'mobile-development') WHERE LOWER(category) LIKE '%mobile%';
UPDATE jobs SET category_id = (SELECT id FROM job_categories WHERE slug = 'design-creative') WHERE LOWER(category) LIKE '%design%';
UPDATE jobs SET category_id = (SELECT id FROM job_categories WHERE slug = 'writing-content') WHERE LOWER(category) LIKE '%writing%' OR LOWER(category) LIKE '%content%';
UPDATE jobs SET category_id = (SELECT id FROM job_categories WHERE slug = 'marketing-sales') WHERE LOWER(category) LIKE '%marketing%';
UPDATE jobs SET category_id = (SELECT id FROM job_categories WHERE slug = 'data-science-analytics') WHERE LOWER(category) LIKE '%data%' OR LOWER(category) LIKE '%analytics%';
UPDATE jobs SET category_id = (SELECT id FROM job_categories WHERE slug = 'software-development') WHERE LOWER(category) LIKE '%software%' OR LOWER(category) LIKE '%development%';
-- Default to 'Other' for unmapped categories
UPDATE jobs SET category_id = (SELECT id FROM job_categories WHERE slug = 'other') WHERE category_id IS NULL AND category IS NOT NULL;

-- Step 3: Migrate existing experience_level data
-- Map old enum values to new experience level IDs
UPDATE jobs SET experience_level_id = (SELECT id FROM experience_levels WHERE code = 'ENTRY') WHERE experience_level = 'ENTRY';
UPDATE jobs SET experience_level_id = (SELECT id FROM experience_levels WHERE code = 'INTERMEDIATE') WHERE experience_level = 'INTERMEDIATE';
UPDATE jobs SET experience_level_id = (SELECT id FROM experience_levels WHERE code = 'EXPERT') WHERE experience_level = 'EXPERT';
-- Default to INTERMEDIATE for NULL values
UPDATE jobs SET experience_level_id = (SELECT id FROM experience_levels WHERE code = 'INTERMEDIATE') WHERE experience_level_id IS NULL;

-- Step 4: Add foreign key constraints
ALTER TABLE jobs ADD CONSTRAINT fk_jobs_category 
    FOREIGN KEY (category_id) REFERENCES job_categories(id);

ALTER TABLE jobs ADD CONSTRAINT fk_jobs_experience_level 
    FOREIGN KEY (experience_level_id) REFERENCES experience_levels(id);

-- Step 5: Add indexes for foreign keys
CREATE INDEX idx_jobs_category_id ON jobs(category_id);
CREATE INDEX idx_jobs_experience_level_id ON jobs(experience_level_id);

-- Step 6: Make the new columns NOT NULL after migration
ALTER TABLE jobs ALTER COLUMN category_id SET NOT NULL;
ALTER TABLE jobs ALTER COLUMN experience_level_id SET NOT NULL;

-- Step 7: Drop old columns (keeping them for now for backward compatibility)
-- Uncomment these lines after verifying the migration works
-- ALTER TABLE jobs DROP COLUMN category;
-- ALTER TABLE jobs DROP COLUMN experience_level;

-- Add comment
COMMENT ON COLUMN jobs.category_id IS 'Foreign key reference to job_categories table';
COMMENT ON COLUMN jobs.experience_level_id IS 'Foreign key reference to experience_levels table';
