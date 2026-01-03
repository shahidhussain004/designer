UPDATE users SET 
  skills = '["JavaScript", "React", "Node.js"]'::json,
  languages = '["English", "Spanish"]'::json,
  certifications = '["AWS Certified", "Java Professional"]'::json
WHERE id = 1;

SELECT id, email, first_name, skills, languages FROM users WHERE id = 1;
