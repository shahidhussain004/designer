-- Check the actual column type definition
SELECT table_name, column_name, column_default, is_nullable, udt_name, data_type, ordinal_position
FROM information_schema.columns
WHERE table_name = 'projects' AND column_name IN ('required_skills', 'preferred_skills')
ORDER BY table_name, ordinal_position;

-- Also check User table for reference
SELECT table_name, column_name, column_default, is_nullable, udt_name, data_type, ordinal_position
FROM information_schema.columns  
WHERE table_name = 'users' AND column_name = 'skills'
ORDER BY table_name, ordinal_position;
