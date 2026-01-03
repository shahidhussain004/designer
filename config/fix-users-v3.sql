-- Convert skills which is still text type
ALTER TABLE users 
  ALTER COLUMN skills 
  TYPE json USING CASE 
    WHEN skills IS NULL OR skills = '' THEN '[]'::json
    WHEN skills ~ '^\[' THEN skills::json  -- Already JSON format
    ELSE ('"' || replace(skills, ',', '","') || '"')::json  -- Convert CSV to JSON array
  END;

-- Try languages again with better logic
UPDATE users SET languages = NULL WHERE languages = '';

ALTER TABLE users 
  ALTER COLUMN languages 
  TYPE json USING CASE 
    WHEN languages IS NULL THEN '[]'::json
    WHEN languages ~ '^\[' THEN languages::json
    ELSE ('"' || replace(languages, ',', '","') || '"')::json
  END;

-- Verify
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name IN ('skills', 'languages', 'certifications')
ORDER BY table_name, column_name;

SELECT id, email, skills, languages, certifications FROM users LIMIT 3;
