-- Seed Data: Job Categories
-- This file seeds the job_categories table with standard job categories
-- Idempotent: Uses INSERT ... ON CONFLICT to handle existing data

INSERT INTO job_categories (name, slug, description, icon, display_order) VALUES
('Web Development', 'web-development', 'Websites, web applications, and web services', '🌐', 1),
('Mobile Development', 'mobile-development', 'iOS, Android, and cross-platform mobile apps', '📱', 2),
('Design & Creative', 'design-creative', 'UI/UX design, graphic design, branding', '🎨', 3),
('Writing & Content', 'writing-content', 'Content writing, copywriting, technical writing', '✍️', 4),
('Marketing & Sales', 'marketing-sales', 'Digital marketing, SEO, social media management', '📈', 5),
('Data Science & Analytics', 'data-science-analytics', 'Data analysis, machine learning, AI', '📊', 6),
('DevOps & Cloud', 'devops-cloud', 'Cloud infrastructure, CI/CD, system administration', '☁️', 7),
('Software Development', 'software-development', 'Desktop applications, backend development', '💻', 8),
('Video & Animation', 'video-animation', 'Video editing, motion graphics, 3D animation', '🎬', 9),
('Consulting', 'consulting', 'Business consulting, technical consulting', '💼', 10),
('Testing & QA', 'testing-qa', 'Software testing, quality assurance', '🔍', 11),
('Other', 'other', 'Other professional services', '📦', 99)
ON CONFLICT (name) DO UPDATE SET
  slug = EXCLUDED.slug,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  display_order = EXCLUDED.display_order,
  updated_at = CURRENT_TIMESTAMP;
