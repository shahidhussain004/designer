UPDATE users 
SET password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/za.'
WHERE email = 'admin@designermarket.com';
SELECT password_hash FROM users WHERE email = 'admin@designermarket.com';
