-- Alter the users columns to JSON type
ALTER TABLE users 
  ALTER COLUMN skills 
  TYPE json USING CASE 
    WHEN skills IS NULL THEN NULL 
    ELSE ('"' || array_to_string(string_to_array(skills, ','), '","') || '"')::json
  END;

ALTER TABLE users 
  ALTER COLUMN languages 
  TYPE json USING CASE 
    WHEN languages IS NULL THEN NULL 
    ELSE ('"' || array_to_string(string_to_array(languages, ','), '","') || '"')::json
  END;

ALTER TABLE users 
  ALTER COLUMN certifications 
  TYPE json USING CASE 
    WHEN certifications IS NULL THEN NULL 
    ELSE ('"' || array_to_string(string_to_array(certifications, ','), '","') || '"')::json
  END;

-- Verify the conversion
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name IN ('skills', 'languages', 'certifications')
ORDER BY table_name, column_name;

-- Check data
SELECT id, email, skills, languages FROM users LIMIT 2;
