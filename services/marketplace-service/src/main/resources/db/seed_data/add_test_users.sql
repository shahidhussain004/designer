INSERT INTO users (email, username, password_hash, role, full_name, is_active)
VALUES 
  ('admin@example.com', 'admin', '$2b$10$cGdXgENddAQXKKSH/BnLwOiSfjRS0/y/TciWaBJYJEUtmYZ9m0OH2', 'ADMIN', 'Admin User', true),
  ('company1@example.com', 'company1', '$2b$10$bMajPZKWICpit.GjmD8hWegAsBvUDSUs3eh/ntn2qzcqmF6bZMcnS', 'COMPANY', 'Company One', true),
  ('freelancer1@example.com', 'freelancer1', '$2b$10$bMajPZKWICpit.GjmD8hWegAsBvUDSUs3eh/ntn2qzcqmF6bZMcnS', 'FREELANCER', 'Freelancer One', true);
