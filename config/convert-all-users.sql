-- Convert skills from text to json, handling both CSV and JSON formats
UPDATE users SET 
  skills = CASE 
    WHEN skills IS NULL OR trim(skills) = '' THEN '[]'::json
    WHEN skills::text ~ '^\[' THEN skills::text::json  -- Already JSON
    ELSE to_jsonb(string_to_array(trim(skills), ',')) -- CSV to JSON array
  END::json;

-- Clean up certifications 
UPDATE users SET certifications = '[]'::json WHERE certifications IS NULL OR certifications::text = '';

-- Now convert skills type if still text
ALTER TABLE users 
  ALTER COLUMN skills 
  TYPE json;

-- Verify all are JSON now
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name IN ('skills', 'languages', 'certifications')
ORDER BY table_name, column_name;

-- Check the data
SELECT id, email, skills, languages FROM users LIMIT 5;
