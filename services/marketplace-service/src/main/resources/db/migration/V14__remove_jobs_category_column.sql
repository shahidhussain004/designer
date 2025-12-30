-- V14__remove_jobs_category_column.sql
-- Remove the old 'category' column from jobs table
-- All jobs now use the category_id foreign key to jobs_categories table

-- Drop the index on the old category column first
DROP INDEX IF EXISTS idx_jobs_category;

-- Drop the old category column
ALTER TABLE jobs DROP COLUMN IF EXISTS category;
