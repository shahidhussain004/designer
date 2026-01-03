-- Let's use a simpler approach - delete the nested array data and set it fresh
-- Update users 4, 5, 6 with proper flat arrays
UPDATE users SET skills = '["JavaScript", "React", "Node.js", "PostgreSQL", "Docker"]' WHERE id = 4;
UPDATE users SET skills = '["Figma", "Adobe XD", "UI Design", "Branding"]' WHERE id = 5;
UPDATE users SET skills = '["Python", "Django", "SQL", "Data Analysis", "Machine Learning"]' WHERE id = 6;

-- Verify all users now have proper skills
SELECT id, email, skills::text FROM users WHERE skills IS NOT NULL AND skills::text <> '[]';
