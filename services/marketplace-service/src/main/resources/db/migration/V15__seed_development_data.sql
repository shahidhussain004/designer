-- =====================================================
-- V15: Seed Sample Data for Development & Testing
-- Description: Development data for testing all features
-- WARNING: For development/testing only - do not use in production
-- =====================================================

-- Disable foreign key constraints temporarily for bulk insert
SET CONSTRAINTS ALL DEFERRED;

-- Insert sample users with minimal fields
INSERT INTO users (
    username, email, password_hash, user_type
) VALUES
('john_dev', 'john@example.com', '$2a$10$demo.hash.for.john.developer', 'FREELANCER'),
('jane_designer', 'jane@example.com', '$2a$10$demo.hash.for.jane.designer', 'FREELANCER'),
('tech_startup', 'contact@techstartup.com', '$2a$10$demo.hash.for.tech.startup', 'EMPLOYER'),
('global_corp', 'careers@globalcorp.com', '$2a$10$demo.hash.for.global.corp', 'EMPLOYER'),
('admin_user', 'admin@marketplace.com', '$2a$10$demo.hash.for.admin.user', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- Insert sample job postings with minimal fields
INSERT INTO jobs (
    employer_id, category_id, title, description, job_type, employment_type, 
    experience_level, status, published_at
) SELECT
    (SELECT id FROM users WHERE email = 'contact@techstartup.com'),
    1,
    'Senior Backend Engineer',
    'Looking for experienced backend engineers to build scalable systems.',
    'FULL_TIME',
    'PERMANENT',
    'SENIOR',
    'ACTIVE',
    CURRENT_TIMESTAMP
ON CONFLICT DO NOTHING;

INSERT INTO jobs (
    employer_id, category_id, title, description, job_type, employment_type, 
    experience_level, status, published_at
) SELECT
    (SELECT id FROM users WHERE email = 'contact@techstartup.com'),
    3,
    'Product Designer',
    'Join our design team to create beautiful and intuitive user experiences.',
    'FULL_TIME',
    'PERMANENT',
    'INTERMEDIATE',
    'ACTIVE',
    CURRENT_TIMESTAMP
ON CONFLICT DO NOTHING;

INSERT INTO jobs (
    employer_id, category_id, title, description, job_type, employment_type, 
    experience_level, status, published_at
) SELECT
    (SELECT id FROM users WHERE email = 'careers@globalcorp.com'),
    2,
    'Data Scientist',
    'Looking for a data scientist to drive insights and build ML models.',
    'FULL_TIME',
    'PERMANENT',
    'SENIOR',
    'ACTIVE',
    CURRENT_TIMESTAMP
ON CONFLICT DO NOTHING;

-- Insert sample job applications
INSERT INTO job_applications (
    job_id, applicant_id, cover_letter, status, created_at
) SELECT
    (SELECT MIN(id) FROM jobs WHERE title = 'Senior Backend Engineer'),
    (SELECT id FROM users WHERE email = 'john@example.com'),
    'I am excited to apply for this position.',
    'SUBMITTED',
    CURRENT_TIMESTAMP
ON CONFLICT DO NOTHING;

INSERT INTO job_applications (
    job_id, applicant_id, cover_letter, status, created_at
) SELECT
    (SELECT MIN(id) FROM jobs WHERE title = 'Product Designer'),
    (SELECT id FROM users WHERE email = 'jane@example.com'),
    'I have successfully designed many interfaces.',
    'SUBMITTED',
    CURRENT_TIMESTAMP
ON CONFLICT DO NOTHING;

-- Commit changes
COMMIT;
COMMIT;
