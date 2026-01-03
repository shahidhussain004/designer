-- Drop default constraints first
ALTER TABLE users ALTER COLUMN skills DROP DEFAULT;
ALTER TABLE users ALTER COLUMN languages DROP DEFAULT;
ALTER TABLE users ALTER COLUMN certifications DROP DEFAULT;

-- Now convert to JSON type
ALTER TABLE users 
  ALTER COLUMN skills 
  TYPE json USING CASE 
    WHEN skills IS NULL OR skills = '' THEN '[]'::json
    ELSE skills::json
  END;

ALTER TABLE users 
  ALTER COLUMN languages 
  TYPE json USING CASE 
    WHEN languages IS NULL OR languages = '' THEN '[]'::json
    ELSE languages::json
  END;

ALTER TABLE users 
  ALTER COLUMN certifications 
  TYPE json USING CASE 
    WHEN certifications IS NULL OR certifications = '' THEN '[]'::json
    ELSE certifications::json
  END;

-- Set proper defaults for JSON
ALTER TABLE users ALTER COLUMN skills SET DEFAULT '[]'::json;
ALTER TABLE users ALTER COLUMN languages SET DEFAULT '[]'::json;
ALTER TABLE users ALTER COLUMN certifications SET DEFAULT '[]'::json;

-- Verify
SELECT table_name, column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name IN ('skills', 'languages', 'certifications')
ORDER BY table_name, column_name;

SELECT id, email, skills FROM users WHERE id = 1;
