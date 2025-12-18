-- V2__seed_data.sql
-- Seed data for development and testing
-- Passwords are bcrypt-hashed 'password123' for all test users

-- Insert test users (5 clients, 5 freelancers)
INSERT INTO users (email, username, password_hash, full_name, role, bio, location, hourly_rate, skills, email_verified, is_active, rating_avg, rating_count, created_at, updated_at) VALUES
-- Clients
('client1@example.com', 'client_john', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYCj7qQlqSC', 'John Client', 'CLIENT', 'Looking for talented designers for my startup projects', 'New York, USA', NULL, NULL, true, true, 0.0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('client2@example.com', 'client_sarah', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYCj7qQlqSC', 'Sarah Johnson', 'CLIENT', 'Need help with mobile app design', 'London, UK', NULL, NULL, true, true, 0.0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('client3@example.com', 'client_mike', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYCj7qQlqSC', 'Mike Chen', 'CLIENT', 'Running an e-commerce business', 'Singapore', NULL, NULL, true, true, 0.0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('client4@example.com', 'client_emma', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYCj7qQlqSC', 'Emma Davis', 'CLIENT', 'Marketing agency owner', 'Sydney, Australia', NULL, NULL, true, true, 0.0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('client5@example.com', 'client_alex', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYCj7qQlqSC', 'Alex Brown', 'CLIENT', 'Tech startup founder', 'San Francisco, USA', NULL, NULL, true, true, 0.0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

-- Freelancers
('freelancer1@example.com', 'designer_lisa', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYCj7qQlqSC', 'Lisa Designer', 'FREELANCER', 'Senior UI/UX designer with 8+ years experience', 'Berlin, Germany', 85.00, ARRAY['UI Design', 'UX Design', 'Figma', 'Adobe XD'], true, true, 4.8, 32, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('freelancer2@example.com', 'dev_james', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYCj7qQlqSC', 'James Developer', 'FREELANCER', 'Full-stack developer specializing in React and Node.js', 'Toronto, Canada', 95.00, ARRAY['React', 'Node.js', 'TypeScript', 'MongoDB'], true, true, 4.9, 45, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('freelancer3@example.com', 'designer_maria', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYCj7qQlqSC', 'Maria Graphics', 'FREELANCER', 'Graphic designer and illustrator', 'Barcelona, Spain', 65.00, ARRAY['Graphic Design', 'Illustration', 'Branding', 'Photoshop'], true, true, 4.7, 28, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('freelancer4@example.com', 'dev_david', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYCj7qQlqSC', 'David Backend', 'FREELANCER', 'Backend engineer with Java and Python expertise', 'Mumbai, India', 55.00, ARRAY['Java', 'Spring Boot', 'Python', 'PostgreSQL'], true, true, 4.6, 38, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('freelancer5@example.com', 'designer_sophie', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYCj7qQlqSC', 'Sophie Web', 'FREELANCER', 'Web designer and front-end developer', 'Paris, France', 75.00, ARRAY['Web Design', 'HTML/CSS', 'JavaScript', 'Responsive Design'], true, true, 4.8, 41, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert test jobs (10 sample jobs)
INSERT INTO jobs (client_id, title, description, category, required_skills, budget, budget_type, duration, experience_level, status, is_featured, view_count, proposal_count, created_at, updated_at) VALUES
(1, 'Modern Landing Page Design', 'Need a creative landing page design for a SaaS product. Should be modern, clean, and conversion-focused.', 'Web Design', ARRAY['UI Design', 'Figma', 'Responsive Design'], 1500.00, 'FIXED', 14, 'INTERMEDIATE', 'OPEN', true, 23, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'Mobile App UI/UX Redesign', 'Complete redesign of our mobile banking app. Need someone with fintech experience.', 'Mobile Design', ARRAY['UI Design', 'UX Design', 'Mobile Design', 'Figma'], 5000.00, 'FIXED', 30, 'EXPERT', 'OPEN', true, 45, 8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'E-commerce Website Development', 'Build a custom e-commerce site using Next.js and Stripe integration.', 'Web Development', ARRAY['React', 'Next.js', 'TypeScript', 'Stripe API'], 8000.00, 'FIXED', 45, 'EXPERT', 'OPEN', false, 31, 12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Logo and Brand Identity', 'Need a complete brand identity package including logo, color palette, and brand guidelines.', 'Branding', ARRAY['Graphic Design', 'Branding', 'Illustrator'], 2000.00, 'FIXED', 21, 'INTERMEDIATE', 'OPEN', false, 18, 6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'REST API Development', 'Build a scalable REST API with authentication, rate limiting, and documentation.', 'Backend Development', ARRAY['Java', 'Spring Boot', 'PostgreSQL', 'REST API'], 6000.00, 'FIXED', 30, 'EXPERT', 'OPEN', false, 27, 9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 'Social Media Graphics', 'Create a series of social media graphics for Instagram and Facebook campaigns.', 'Graphic Design', ARRAY['Graphic Design', 'Photoshop', 'Social Media'], 800.00, 'FIXED', 7, 'ENTRY', 'OPEN', false, 15, 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'WordPress Site Customization', 'Customize existing WordPress site with new theme and plugins.', 'Web Development', ARRAY['WordPress', 'PHP', 'HTML/CSS'], 1200.00, 'HOURLY', 20, 'INTERMEDIATE', 'OPEN', false, 12, 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'Product Photography Editing', 'Edit 50 product photos for e-commerce listing. Remove background and color correction.', 'Photo Editing', ARRAY['Photoshop', 'Photo Editing'], 500.00, 'FIXED', 5, 'ENTRY', 'OPEN', false, 9, 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'Marketing Email Templates', 'Design responsive email templates for marketing campaigns.', 'Email Design', ARRAY['HTML/CSS', 'Email Design', 'Responsive Design'], 1000.00, 'FIXED', 10, 'INTERMEDIATE', 'OPEN', false, 14, 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'iOS App Development', 'Develop a simple iOS app for recipe sharing with SwiftUI.', 'Mobile Development', ARRAY['Swift', 'SwiftUI', 'iOS Development'], 7000.00, 'FIXED', 60, 'EXPERT', 'OPEN', true, 38, 11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert sample proposals (15 proposals across different jobs)
INSERT INTO proposals (job_id, freelancer_id, cover_letter, proposed_rate, estimated_duration, status, created_at, updated_at) VALUES
(1, 6, 'I have 8+ years of experience in UI/UX design and have created numerous landing pages for SaaS products. I would love to work on your project.', 1400.00, 12, 'SUBMITTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, 8, 'As a graphic designer specializing in web design, I can deliver a modern and conversion-focused landing page. Check out my portfolio!', 1500.00, 14, 'SUBMITTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 6, 'I have extensive experience in fintech app design. Recently completed a banking app redesign that increased user engagement by 40%.', 4800.00, 28, 'SHORTLISTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 10, 'Senior UI/UX designer with fintech background. I focus on user-centered design and accessibility. Would love to discuss your project.', 5200.00, 30, 'SUBMITTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 7, 'Full-stack developer with 6+ years React/Next.js experience. I have built several e-commerce platforms with Stripe integration.', 7500.00, 42, 'SUBMITTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 9, 'Backend engineer who can handle your Next.js and API requirements. Strong experience with Stripe and payment processing.', 7800.00, 45, 'SUBMITTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 8, 'Graphic designer specializing in brand identity. I will create a unique and memorable brand for your business.', 1900.00, 20, 'SUBMITTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 9, 'Java expert with Spring Boot and PostgreSQL. I have built numerous scalable REST APIs with proper authentication and documentation.', 5800.00, 28, 'SUBMITTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 7, 'I can build a robust REST API with best practices. Experience with Spring Security, JWT, and OpenAPI documentation.', 6200.00, 30, 'SUBMITTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 8, 'Experienced in social media design. I will create eye-catching graphics that drive engagement.', 750.00, 7, 'SUBMITTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 10, 'WordPress expert with 5+ years experience. I can customize your site and ensure mobile responsiveness.', 1100.00, 18, 'SUBMITTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(9, 10, 'Web designer with email template expertise. I ensure compatibility across all email clients.', 950.00, 10, 'SUBMITTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 7, 'Full-stack developer comfortable with iOS development. I have shipped multiple apps to the App Store.', 6800.00, 55, 'SUBMITTED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert more users to reach 50 total (45 more)
-- Note: In production, you would generate this programmatically
-- For brevity, showing a few more examples

INSERT INTO users (email, username, password_hash, full_name, role, bio, location, hourly_rate, skills, email_verified, is_active, rating_avg, rating_count, created_at, updated_at)
SELECT 
    'user' || generate_series || '@example.com',
    'user_' || generate_series,
    '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYCj7qQlqSC',
    'Test User ' || generate_series,
    CASE WHEN generate_series % 2 = 0 THEN 'FREELANCER' ELSE 'CLIENT' END,
    'Test user bio for development',
    'Test Location',
    CASE WHEN generate_series % 2 = 0 THEN (50.0 + (generate_series % 5) * 10) ELSE NULL END,
    CASE WHEN generate_series % 2 = 0 THEN ARRAY['Skill1', 'Skill2'] ELSE NULL END,
    true,
    true,
    CASE WHEN generate_series % 2 = 0 THEN (4.0 + (generate_series % 10) * 0.1) ELSE 0.0 END,
    CASE WHEN generate_series % 2 = 0 THEN (generate_series % 20) ELSE 0 END,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM generate_series(11, 50) AS generate_series;
