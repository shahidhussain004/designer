-- Fix all projects to have proper JSON arrays
UPDATE projects SET 
  required_skills = CASE 
    WHEN required_skills IS NULL THEN NULL
    ELSE required_skills
  END,
  preferred_skills = CASE 
    WHEN preferred_skills IS NULL THEN '[]'::json
    ELSE preferred_skills
  END;

-- Check what we have
SELECT id, title, required_skills::text as req_skills FROM projects LIMIT 10;
