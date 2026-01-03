-- Fix nested arrays - flatten them
UPDATE users SET 
  skills = skills -> 0
WHERE jsonb_typeof(skills) = 'array' AND jsonb_array_length(skills) = 1 
  AND jsonb_typeof(skills -> 0) = 'array';

-- Trim whitespace from skill names
UPDATE users SET 
  skills = (
    SELECT jsonb_agg(TRIM(value)) 
    FROM jsonb_array_elements_text(skills)
  )
WHERE skills IS NOT NULL;

-- Verify
SELECT id, email, skills FROM users WHERE id IN (1,4,5,6);
