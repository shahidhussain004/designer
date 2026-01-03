UPDATE projects SET 
  required_skills = '["UI Design", "React", "Web Development", "UX Research"]'::json,
  preferred_skills = '["Figma", "Adobe XD"]'::json
WHERE id = 1;

UPDATE projects SET 
  required_skills = '["Python", "Django", "PostgreSQL"]'::json,
  preferred_skills = '["Docker", "AWS"]'::json
WHERE id = 2;

UPDATE portfolio_items SET 
  technologies = '["React", "Node.js", "PostgreSQL"]'::json,
  images = '["https://example.com/img1.jpg", "https://example.com/img2.jpg"]'::json,
  tools_used = '["VS Code", "Git", "Docker"]'::json
WHERE id = 1;

SELECT id, title, required_skills, preferred_skills FROM projects LIMIT 2;
SELECT id, title, technologies, images FROM portfolio_items LIMIT 1;
