-- V17__fix_array_column_types.sql
-- Fix PostgreSQL array column type definitions for Hibernate compatibility
-- Changes uppercase TEXT[] to lowercase text[] for proper type detection

BEGIN;

-- Fix job_applications table
ALTER TABLE job_applications 
  ALTER COLUMN additional_documents SET DATA TYPE text[] USING additional_documents::text[];

-- Fix jobs table
ALTER TABLE jobs
  ALTER COLUMN benefits SET DATA TYPE text[] USING benefits::text[];

ALTER TABLE jobs
  ALTER COLUMN perks SET DATA TYPE text[] USING perks::text[];

ALTER TABLE jobs
  ALTER COLUMN required_skills SET DATA TYPE text[] USING required_skills::text[];

ALTER TABLE jobs
  ALTER COLUMN preferred_skills SET DATA TYPE text[] USING preferred_skills::text[];

ALTER TABLE jobs
  ALTER COLUMN certifications SET DATA TYPE text[] USING certifications::text[];

COMMIT;

-- Add comments for clarity
COMMENT ON COLUMN job_applications.additional_documents IS 'Array of document URLs for the application';
COMMENT ON COLUMN jobs.benefits IS 'Array of benefits offered';
COMMENT ON COLUMN jobs.perks IS 'Array of perks offered';
COMMENT ON COLUMN jobs.required_skills IS 'Array of required skills';
COMMENT ON COLUMN jobs.preferred_skills IS 'Array of preferred skills';
COMMENT ON COLUMN jobs.certifications IS 'Array of required certifications';
