-- Set default empty JSON arrays for NULL values
UPDATE projects SET 
  required_skills = COALESCE(required_skills, '[]'::json),
  preferred_skills = COALESCE(preferred_skills, '[]'::json);

-- Verify
SELECT COUNT(*) as total, 
       COUNT(*) FILTER (WHERE required_skills IS NULL) as null_required,
       COUNT(*) FILTER (WHERE preferred_skills IS NULL) as null_preferred
FROM projects;

-- Show all projects
SELECT id, title, required_skills, preferred_skills FROM projects;
