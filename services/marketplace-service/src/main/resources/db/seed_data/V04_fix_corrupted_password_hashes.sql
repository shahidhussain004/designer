-- ========================================================================
-- CRITICAL: Seed Data Password Fix
-- Fixes the corrupted placeholder hash used in 01_users_and_core_data.sql
-- ========================================================================
-- Date: January 25, 2026
-- Issue: Original seed data had placeholder hash that doesn't work with any password
-- Old Hash: $2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341
-- New Hash: $2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i
-- Password: password123
-- ========================================================================

-- This script should be run after 01_users_and_core_data.sql to fix all users
-- Or, update 01_users_and_core_data.sql directly by replacing the corrupted hash

UPDATE users 
SET password_hash = '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i'
WHERE password_hash = '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341';

-- Verify the update
SELECT COUNT(*) as fixed_users FROM users WHERE password_hash = '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i';

COMMIT;
