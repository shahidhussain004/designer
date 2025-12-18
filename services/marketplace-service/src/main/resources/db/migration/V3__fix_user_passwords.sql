-- V3__fix_user_passwords.sql
-- Fix password hashes - BCrypt hash of "password123" with strength 12

UPDATE users 
SET password_hash = '$2a$12$bQz9.oL78bMWsGLevmcMNO8tE2Rh7RZoGBbSdF65kbSODvFo1KDUS'
WHERE password_hash = '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYCj7qQlqSC';
