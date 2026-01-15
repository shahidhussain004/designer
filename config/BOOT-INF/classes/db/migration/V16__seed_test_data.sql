
-- =====================================================
-- V16: Seed Test Data (UPDATED for proper schema)
-- Description: Populate initial test data for all tables
--              Now properly handles companies and freelancers tables
-- =====================================================

SET session_replication_role = 'replica';

CREATE EXTENSION IF NOT EXISTS pgcrypto;

BEGIN;

-- =====================================================
-- USERS & ROLE-SPECIFIC DATA
-- =====================================================

-- Insert Companies into users table
INSERT INTO users (
    email, username, password_hash, full_name, role,
    bio, location, is_active, email_verified,
    created_at, updated_at
)
VALUES
('company1@example.com', 'company_john', crypt('password123', gen_salt('bf', 12)), 'John Company', 'COMPANY',
 'Product Manager at Tech Corp', 'San Francisco, CA', true, true,
 NOW(), NOW()),

('company2@example.com', 'company_sarah', crypt('password123', gen_salt('bf', 12)), 'Sarah Martinez', 'COMPANY',
 'Startup Founder', 'New York, NY', true, true,
 NOW(), NOW()),

('company3@example.com', 'company_mike', crypt('password123', gen_salt('bf', 12)), 'Mike Johnson', 'COMPANY',
 'Marketing Director', 'Los Angeles, CA', true, true,
 NOW(), NOW()),

-- Insert Freelancers into users table
('freelancer1@example.com', 'dev_alice', crypt('password123', gen_salt('bf', 12)), 'Alice Chen', 'FREELANCER',
 'Full-stack developer with 8+ years experience', 'Remote - Seattle', true, true,
 NOW(), NOW()),

('freelancer2@example.com', 'designer_bob', crypt('password123', gen_salt('bf', 12)), 'Bob Smith', 'FREELANCER',
 'UI/UX Designer - Brand specialist', 'Remote - London', true, true,
 NOW(), NOW()),

('freelancer3@example.com', 'dev_carol', crypt('password123', gen_salt('bf', 12)), 'Carol Davis', 'FREELANCER',
 'Backend specialist with database expertise', 'Remote - Toronto', true, true,
 NOW(), NOW()),

('freelancer4@example.com', 'dev_david', crypt('password123', gen_salt('bf', 12)), 'David Wilson', 'FREELANCER',
 'Mobile app developer - Native iOS and Android', 'Remote - Sydney', true, true,
 NOW(), NOW()),

('freelancer5@example.com', 'writer_elena', crypt('password123', gen_salt('bf', 12)), 'Elena Rodriguez', 'FREELANCER',
 'Technical writer and documentation specialist', 'Remote - Mexico City', true, true,
 NOW(), NOW()),

('admin@example.com', 'admin_user', crypt('password123', gen_salt('bf', 12)), 'Admin User', 'ADMIN',
 'System Administrator', 'Remote', true, true,
 NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Insert Company Details
INSERT INTO companies (
    user_id, company_name, company_type, industry, website_url, company_size,
    phone, headquarters_location, rating_avg, rating_count, total_projects_posted,
    created_at, updated_at
)
SELECT 
    u.id, u.full_name, 'TECH', 'Technology', 'https://company1.example.com', 'LARGE',
    '+1-415-555-0101', u.location, 4.8, 42, 12,
    NOW(), NOW()
FROM users u WHERE u.email = 'company1@example.com' AND u.role = 'COMPANY'
AND NOT EXISTS (SELECT 1 FROM companies WHERE user_id = u.id)
UNION ALL
SELECT 
    u.id, u.full_name, 'STARTUP', 'SaaS', 'https://company2.example.com', 'SMALL',
    '+1-212-555-0202', u.location, 4.6, 28, 8,
    NOW(), NOW()
FROM users u WHERE u.email = 'company2@example.com' AND u.role = 'COMPANY'
AND NOT EXISTS (SELECT 1 FROM companies WHERE user_id = u.id)
UNION ALL
SELECT 
    u.id, u.full_name, 'AGENCY', 'Marketing', 'https://company3.example.com', 'MEDIUM',
    '+1-323-555-0303', u.location, 4.9, 55, 25,
    NOW(), NOW()
FROM users u WHERE u.email = 'company3@example.com' AND u.role = 'COMPANY'
AND NOT EXISTS (SELECT 1 FROM companies WHERE user_id = u.id);

-- Insert Freelancer Details
INSERT INTO freelancers (
    user_id, hourly_rate, experience_years, headline, portfolio_url,
    github_url, linkedin_url, skills, certifications, languages,
    rating_avg, rating_count, completion_rate, response_rate, 
    total_projects_completed, total_earnings,
    created_at, updated_at
)
SELECT
    u.id, 85.0, 8, 'Full-stack Developer', 'https://alice.portfolio.com',
    'https://github.com/alice', 'https://linkedin.com/in/alice',
    '["JavaScript","React","Node.js","PostgreSQL","Docker","AWS"]'::json,
    '["AWS Certified","React Certification"]'::json,
    '["English","Mandarin"]'::json,
    4.9, 45, 99.0, 98.0, 45, 95000.0, NOW(), NOW()
FROM users u WHERE u.email = 'freelancer1@example.com' AND u.role = 'FREELANCER'
AND NOT EXISTS (SELECT 1 FROM freelancers WHERE user_id = u.id)
UNION ALL
SELECT
    u.id, 75.0, 6, 'UI/UX Designer', 'https://bob.portfolio.com',
    'https://github.com/bob', 'https://linkedin.com/in/bob',
    '["Figma","Adobe XD","UI Design","Branding","Web Design"]'::json,
    '["UX Certification"]'::json,
    '["English","Spanish"]'::json,
    4.7, 32, 97.0, 95.0, 32, 72000.0, NOW(), NOW()
FROM users u WHERE u.email = 'freelancer2@example.com' AND u.role = 'FREELANCER'
AND NOT EXISTS (SELECT 1 FROM freelancers WHERE user_id = u.id)
UNION ALL
SELECT
    u.id, 80.0, 7, 'Database & Backend Specialist', 'https://carol.portfolio.com',
    'https://github.com/carol', 'https://linkedin.com/in/carol',
    '["Python","Java","PostgreSQL","MongoDB","Redis","System Design"]'::json,
    '["Java Certification","PostgreSQL Expert"]'::json,
    '["English","French"]'::json,
    4.8, 38, 98.0, 96.0, 38, 84000.0, NOW(), NOW()
FROM users u WHERE u.email = 'freelancer3@example.com' AND u.role = 'FREELANCER'
AND NOT EXISTS (SELECT 1 FROM freelancers WHERE user_id = u.id)
UNION ALL
SELECT
    u.id, 70.0, 5, 'Mobile Developer', 'https://david.portfolio.com',
    'https://github.com/david', 'https://linkedin.com/in/david',
    '["Swift","Kotlin","React Native","iOS","Android"]'::json,
    '["iOS Certification","Android Certification"]'::json,
    '["English","Hindi"]'::json,
    4.6, 28, 96.0, 94.0, 28, 65000.0, NOW(), NOW()
FROM users u WHERE u.email = 'freelancer4@example.com' AND u.role = 'FREELANCER'
AND NOT EXISTS (SELECT 1 FROM freelancers WHERE user_id = u.id)
UNION ALL
SELECT
    u.id, 55.0, 4, 'Technical Writer', 'https://elena.portfolio.com',
    NULL, 'https://linkedin.com/in/elena',
    '["Technical Writing","Documentation","UX Writing","API Documentation"]'::json,
    '["Technical Writing Certification"]'::json,
    '["English","Spanish","Portuguese"]'::json,
    4.9, 20, 100.0, 99.0, 20, 44000.0, NOW(), NOW()
FROM users u WHERE u.email = 'freelancer5@example.com' AND u.role = 'FREELANCER'
AND NOT EXISTS (SELECT 1 FROM freelancers WHERE user_id = u.id);

COMMIT;
SET session_replication_role = 'origin';
