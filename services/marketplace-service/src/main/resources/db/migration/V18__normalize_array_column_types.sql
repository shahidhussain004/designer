-- V18__normalize_array_column_types.sql
-- Normalize PostgreSQL array column types for Hibernate compatibility
-- Ensures all TEXT[] columns are properly recognized by Hibernate

-- Fix job_applications table additional_documents column
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'job_applications' 
        AND column_name = 'additional_documents'
        AND data_type = 'USER-DEFINED'
    ) THEN
        ALTER TABLE job_applications 
          ALTER COLUMN additional_documents SET DATA TYPE text[] USING additional_documents::text[];
    END IF;
END $$;

-- Fix jobs table array columns
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        AND column_name = 'benefits'
        AND data_type = 'USER-DEFINED'
    ) THEN
        ALTER TABLE jobs ALTER COLUMN benefits SET DATA TYPE text[] USING benefits::text[];
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        AND column_name = 'perks'
        AND data_type = 'USER-DEFINED'
    ) THEN
        ALTER TABLE jobs ALTER COLUMN perks SET DATA TYPE text[] USING perks::text[];
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        AND column_name = 'required_skills'
        AND data_type = 'USER-DEFINED'
    ) THEN
        ALTER TABLE jobs ALTER COLUMN required_skills SET DATA TYPE text[] USING required_skills::text[];
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        AND column_name = 'preferred_skills'
        AND data_type = 'USER-DEFINED'
    ) THEN
        ALTER TABLE jobs ALTER COLUMN preferred_skills SET DATA TYPE text[] USING preferred_skills::text[];
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        AND column_name = 'certifications'
        AND data_type = 'USER-DEFINED'
    ) THEN
        ALTER TABLE jobs ALTER COLUMN certifications SET DATA TYPE text[] USING certifications::text[];
    END IF;
END $$;
