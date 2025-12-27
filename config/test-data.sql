-- Test data for Designer Marketplace
-- Insert test users for development/testing

-- Admin user for testing
-- Email: admin@designermarket.com
-- Password: Admin123!
-- Hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/za.
INSERT INTO users (email, username, password_hash, full_name, role, email_verified, is_active)
VALUES (
  'admin@designermarket.com',
  'admin',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/za.',
  'Admin User',
  'ADMIN',
  true,
  true
) ON CONFLICT (email) DO NOTHING;

-- Client user for testing
-- Email: client@designermarket.com
-- Password: Client123!
INSERT INTO users (email, username, password_hash, full_name, role, email_verified, is_active)
VALUES (
  'client@designermarket.com',
  'client_user',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/za.',
  'Client User',
  'CLIENT',
  true,
  true
) ON CONFLICT (email) DO NOTHING;

-- Freelancer user for testing
-- Email: freelancer@designermarket.com
-- Password: Freelancer123!
INSERT INTO users (email, username, password_hash, full_name, role, email_verified, is_active)
VALUES (
  'freelancer@designermarket.com',
  'freelancer_user',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P4/za.',
  'Freelancer User',
  'FREELANCER',
  true,
  true
) ON CONFLICT (email) DO NOTHING;

-- Insert sample jobs for testing
INSERT INTO jobs (client_id, title, description, category, budget, experience_level, status)
SELECT 
  u.id,
  'Web Design Project',
  'Need a modern website design with responsive layout',
  'WEB_DESIGN',
  5000.00,
  'INTERMEDIATE',
  'OPEN'
FROM users u
WHERE u.email = 'client@designermarket.com'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO jobs (client_id, title, description, category, budget, experience_level, status)
SELECT 
  u.id,
  'Logo Design Needed',
  'Create a professional logo for our startup',
  'LOGO_DESIGN',
  500.00,
  'ENTRY',
  'OPEN'
FROM users u
WHERE u.email = 'client@designermarket.com'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO jobs (client_id, title, description, category, budget, experience_level, status)
SELECT 
  u.id,
  'Graphic Design for Marketing',
  'Design marketing materials including brochures and banners',
  'GRAPHIC_DESIGN',
  2000.00,
  'INTERMEDIATE',
  'OPEN'
FROM users u
WHERE u.email = 'client@designermarket.com'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO jobs (client_id, title, description, category, budget, experience_level, status)
SELECT 
  u.id,
  'UI/UX Design for Mobile App',
  'Design beautiful and intuitive mobile app interface',
  'UI_UX',
  3500.00,
  'EXPERT',
  'OPEN'
FROM users u
WHERE u.email = 'client@designermarket.com'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO jobs (client_id, title, description, category, budget, experience_level, status)
SELECT 
  u.id,
  'Product Photography',
  'Professional photography for e-commerce products',
  'PHOTOGRAPHY',
  1500.00,
  'INTERMEDIATE',
  'OPEN'
FROM users u
WHERE u.email = 'client@designermarket.com'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO jobs (client_id, title, description, category, budget, experience_level, status)
SELECT 
  u.id,
  'Motion Graphics Animation',
  'Create animated explainer video for product launch',
  'MOTION_GRAPHICS',
  4000.00,
  'EXPERT',
  'OPEN'
FROM users u
WHERE u.email = 'client@designermarket.com'
LIMIT 1
ON CONFLICT DO NOTHING;

INSERT INTO jobs (client_id, title, description, category, budget, experience_level, status)
SELECT 
  u.id,
  '3D Product Modeling',
  'Create 3D models of our product line for visualization',
  '3D_MODELING',
  6000.00,
  'EXPERT',
  'OPEN'
FROM users u
WHERE u.email = 'client@designermarket.com'
LIMIT 1
ON CONFLICT DO NOTHING;
