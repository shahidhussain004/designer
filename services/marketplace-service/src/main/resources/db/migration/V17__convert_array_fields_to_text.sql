-- Convert array fields to simple TEXT fields to handle Hibernate compatibility
-- This addresses the issue where Hibernate sends VARCHAR instead of ARRAY type

ALTER TABLE users 
    ALTER COLUMN skills TYPE TEXT,
    ALTER COLUMN certifications TYPE TEXT,
    ALTER COLUMN languages TYPE TEXT;

-- Ensure default values are empty strings instead of NULLs
UPDATE users SET skills = '' WHERE skills IS NULL;
UPDATE users SET certifications = '' WHERE certifications IS NULL;
UPDATE users SET languages = '' WHERE languages IS NULL;

-- Add NOT NULL constraints if needed
ALTER TABLE users 
    ALTER COLUMN skills SET DEFAULT '',
    ALTER COLUMN certifications SET DEFAULT '',
    ALTER COLUMN languages SET DEFAULT '';
