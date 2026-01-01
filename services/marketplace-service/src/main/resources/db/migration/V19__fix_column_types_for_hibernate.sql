-- V19__fix_column_types_for_hibernate.sql
-- Fix PostgreSQL column types to ensure proper Hibernate compatibility
-- Converts any bytea types to appropriate text types for string fields

-- ============================================================================
-- Fix users table array columns
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'skills'
    ) THEN
        ALTER TABLE users 
          ALTER COLUMN skills SET DATA TYPE text[] USING 
          CASE 
            WHEN skills IS NULL THEN NULL
            WHEN pg_typeof(skills) = 'bytea'::regtype THEN convert_from(skills, 'UTF8')::text[]
            ELSE skills::text[]
          END;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'certifications'
    ) THEN
        ALTER TABLE users 
          ALTER COLUMN certifications SET DATA TYPE text[] USING 
          CASE 
            WHEN certifications IS NULL THEN NULL
            WHEN pg_typeof(certifications) = 'bytea'::regtype THEN convert_from(certifications, 'UTF8')::text[]
            ELSE certifications::text[]
          END;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'languages'
    ) THEN
        ALTER TABLE users 
          ALTER COLUMN languages SET DATA TYPE text[] USING 
          CASE 
            WHEN languages IS NULL THEN NULL
            WHEN pg_typeof(languages) = 'bytea'::regtype THEN convert_from(languages, 'UTF8')::text[]
            ELSE languages::text[]
          END;
    END IF;
END $$;

-- ============================================================================
-- Fix jobs table string and array columns
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        AND column_name = 'location'
    ) THEN
        -- Fix location if it's bytea
        ALTER TABLE jobs 
          ALTER COLUMN location SET DATA TYPE varchar(255) USING 
          CASE 
            WHEN location IS NULL THEN NULL
            WHEN pg_typeof(location) = 'bytea'::regtype THEN convert_from(location, 'UTF8')
            ELSE location::varchar(255)
          END;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        AND column_name = 'required_skills'
    ) THEN
        ALTER TABLE jobs 
          ALTER COLUMN required_skills SET DATA TYPE text[] USING 
          CASE 
            WHEN required_skills IS NULL THEN NULL
            WHEN pg_typeof(required_skills) = 'bytea'::regtype THEN convert_from(required_skills, 'UTF8')::text[]
            ELSE required_skills::text[]
          END;
    END IF;
END $$;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'jobs' 
        AND column_name = 'preferred_skills'
    ) THEN
        ALTER TABLE jobs 
          ALTER COLUMN preferred_skills SET DATA TYPE text[] USING 
          CASE 
            WHEN preferred_skills IS NULL THEN NULL
            WHEN pg_typeof(preferred_skills) = 'bytea'::regtype THEN convert_from(preferred_skills, 'UTF8')::text[]
            ELSE preferred_skills::text[]
          END;
    END IF;
END $$;

-- ============================================================================
-- Fix projects table array columns
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'projects' 
        AND column_name = 'required_skills'
    ) THEN
        ALTER TABLE projects 
          ALTER COLUMN required_skills SET DATA TYPE text[] USING 
          CASE 
            WHEN required_skills IS NULL THEN NULL
            WHEN pg_typeof(required_skills) = 'bytea'::regtype THEN convert_from(required_skills, 'UTF8')::text[]
            ELSE required_skills::text[]
          END;
    END IF;
END $$;
