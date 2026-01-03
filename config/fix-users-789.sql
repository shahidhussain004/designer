UPDATE users SET skills = '["Content Writing", "SEO", "Technical Documentation", "Copywriting"]' WHERE id = 7;
UPDATE users SET skills = '["Swift", "Kotlin", "React Native", "Mobile Development"]' WHERE id = 8;
UPDATE users SET skills = '["SEO", "Google Ads", "Social Media", "Analytics"]' WHERE id = 9;

SELECT id, email, skills FROM users WHERE id IN (7,8,9);
