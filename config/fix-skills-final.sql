-- Convert skills using USING clause
ALTER TABLE users 
  ALTER COLUMN skills 
  TYPE json USING (
    CASE 
      WHEN skills IS NULL OR trim(skills) = '' THEN '[]'::json
      WHEN skills ~ '^\[' THEN skills::json
      ELSE jsonb_build_array(string_to_array(trim(skills), ','))::json
    END
  );

-- Verify
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'users' AND column_name IN ('skills', 'languages', 'certifications');

-- Check data
SELECT id, email, skills FROM users WHERE id IN (1,4,5,6);
