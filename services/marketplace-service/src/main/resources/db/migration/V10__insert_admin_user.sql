-- Test user for login
-- Email: admin@designermarket.com
-- Password: Admin123!
-- Password hash: bcrypt($2a$10$...) for "Admin123!"
INSERT INTO users (email, username, password_hash, full_name, role, email_verified, is_active, rating_avg, rating_count)
VALUES (
  'admin@designermarket.com',
  'admin',
  -- Bcrypt hash of "Admin123!"
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/za.',
  'Admin User',
  'ADMIN',
  true,
  true,
  0.0,
  0
)
ON CONFLICT (email) DO UPDATE SET
  password_hash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/za.',
  updated_at = CURRENT_TIMESTAMP;
