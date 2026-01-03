-- First, let's look at the current state
SELECT id, email, skills, length(skills) as skill_len FROM users WHERE skills IS NOT NULL AND skills <> '' LIMIT 5;
