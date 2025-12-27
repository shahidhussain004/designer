-- V11__update_admin_password.sql
-- Updates the admin user's password hash to use the standard test password.
-- Password: password123
-- Hash: $2a$12$bQz9.oL78bMWsGLevmcMNO8tE2Rh7RZoGBbSdF65kbSODvFo1KDUS (bcrypt strength 12)

UPDATE users
SET password_hash = '$2a$12$bQz9.oL78bMWsGLevmcMNO8tE2Rh7RZoGBbSdF65kbSODvFo1KDUS',
    updated_at = NOW()
WHERE email = 'admin@designermarket.com';
