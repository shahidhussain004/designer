UPDATE users 
SET password_hash = '$2a$12$bQz9.oL78bMWsGLevmcMNO8tE2Rh7RZoGBbSdF65kbSODvFo1KDUS'
WHERE email = 'admin@designermarket.com';
SELECT password_hash FROM users WHERE email = 'admin@designermarket.com';
