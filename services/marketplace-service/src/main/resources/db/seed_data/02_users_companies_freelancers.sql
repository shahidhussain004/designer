-- =====================================================
-- SEED 02: Core Users, Companies & Freelancers
-- Description: Base user accounts with companies and freelancers
-- Dependencies: NONE (users table is independent)
-- Author: Senior DBA & Principal DB Architect
-- =====================================================
-- Load Order: 2nd (After reference data)
-- Password: All passwords are "Password123!" 
-- Hash: $2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i
-- =====================================================

-- =====================================================
-- ADMIN USER (1 record)
-- =====================================================
INSERT INTO users (email, username, password_hash, role, full_name, phone, bio, location, email_verified, is_active, created_at)
VALUES
('admin@marketplace.com', 'admin', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'ADMIN', 'System Administrator', '+1-555-0001', 'Platform administrator', 'Remote', true, true, NOW() - INTERVAL '365 days');

-- =====================================================
-- COMPANY USERS (10 records)
-- =====================================================
INSERT INTO users (email, username, password_hash, role, full_name, phone, bio, profile_image_url, location, email_verified, is_active, created_at)
VALUES
-- Tech Companies (4)
('contact@techcorp.com', 'techcorp', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'COMPANY', 'Tech Corporation', '+1-555-0101', 'Leading enterprise software solutions provider', 'https://images.example.com/companies/techcorp.jpg', 'New York, NY', true, true, NOW() - INTERVAL '180 days'),
('hr@innovatelab.com', 'innovatelab', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'COMPANY', 'Innovate Labs Inc.', '+1-555-0102', 'Innovation-driven technology startup', 'https://images.example.com/companies/innovatelab.jpg', 'San Francisco, CA', true, true, NOW() - INTERVAL '150 days'),
('careers@fintech.com', 'fintechsolutions', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'COMPANY', 'FinTech Solutions LLC', '+1-555-0104', 'Financial technology and payment processing', 'https://images.example.com/companies/fintech.jpg', 'New York, NY', true, true, NOW() - INTERVAL '200 days'),
('contact@cloudservices.com', 'cloudservices', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'COMPANY', 'Cloud Services Ltd', '+1-555-0108', 'Cloud infrastructure and DevOps consulting', 'https://images.example.com/companies/cloudservices.jpg', 'San Francisco, CA', true, true, NOW() - INTERVAL '30 days'),
-- Healthcare & Ecommerce (2)
('talent@healthtech.com', 'healthtechinc', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'COMPANY', 'HealthTech Inc.', '+1-555-0105', 'Healthcare technology and telemedicine platform', 'https://images.example.com/companies/healthtech.jpg', 'Los Angeles, CA', true, true, NOW() - INTERVAL '90 days'),
('info@ecommhub.com', 'ecommercehub', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'COMPANY', 'ECommerce Hub', '+1-555-0106', 'Online marketplace and retail solutions', 'https://images.example.com/companies/ecomm.jpg', 'Chicago, IL', true, true, NOW() - INTERVAL '60 days'),
-- Creative & Data (2)
('jobs@designstudio.com', 'designstudio', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'COMPANY', 'Design Studio Creative', '+1-555-0103', 'Creative design agency specializing in digital products', 'https://images.example.com/companies/designstudio.jpg', 'Chicago, IL', true, true, NOW() - INTERVAL '120 days'),
('team@dataanalytics.com', 'dataanalytics', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'COMPANY', 'Data Analytics Corp', '+1-555-0107', 'Big data and business intelligence solutions', 'https://images.example.com/companies/dataanalytics.jpg', 'New York, NY', true, true, NOW() - INTERVAL '45 days'),
-- Mobile & Gaming (2)
('hr@mobilefirst.com', 'mobilefirstltd', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'COMPANY', 'Mobile First Ltd', '+1-555-0109', 'Mobile app development company', 'https://images.example.com/companies/mobilefirst.jpg', 'Chicago, IL', true, true, NOW() - INTERVAL '75 days'),
('jobs@gamestudio.com', 'gamestudiopro', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'COMPANY', 'Game Studio Pro', '+1-555-0110', 'Video game development studio', 'https://images.example.com/companies/gamestudio.jpg', 'Los Angeles, CA', true, true, NOW() - INTERVAL '100 days');

-- =====================================================
-- FREELANCER USERS (25 diverse specialists)
-- =====================================================
INSERT INTO users (email, username, password_hash, role, full_name, phone, bio, profile_image_url, location, email_verified, is_active, created_at)
VALUES
-- Full Stack Developers (3)
('alice.johnson@email.com', 'alice_dev', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'FREELANCER', 'Alice Johnson', '+1-555-1001', 'Senior Full-Stack Developer specializing in React, Node.js, and cloud architecture', 'https://images.example.com/freelancers/alice.jpg', 'New York, NY', true, true, NOW() - INTERVAL '365 days'),
('bob.smith@email.com', 'bob_python', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'FREELANCER', 'Bob Smith', '+1-555-1002', 'Python/Django expert with 8 years experience in backend development', 'https://images.example.com/freelancers/bob.jpg', 'Chicago, IL', true, true, NOW() - INTERVAL '300 days'),
('carol.martinez@email.com', 'carol_java', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'FREELANCER', 'Carol Martinez', '+1-555-1003', 'Java/Spring Boot architect with microservices expertise', 'https://images.example.com/freelancers/carol.jpg', 'Los Angeles, CA', true, true, NOW() - INTERVAL '400 days'),
-- Mobile Developers (3)
('david.lee@email.com', 'david_ios', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'FREELANCER', 'David Lee', '+1-555-1004', 'iOS developer with Swift and SwiftUI mastery', 'https://images.example.com/freelancers/david.jpg', 'San Francisco, CA', true, true, NOW() - INTERVAL '250 days'),
('emma.wilson@email.com', 'emma_android', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'FREELANCER', 'Emma Wilson', '+1-555-1005', 'Android developer specializing in Kotlin and Jetpack Compose', 'https://images.example.com/freelancers/emma.jpg', 'New York, NY', true, true, NOW() - INTERVAL '200 days'),
('frank.garcia@email.com', 'frank_mobile', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'FREELANCER', 'Frank Garcia', '+1-555-1006', 'Cross-platform mobile developer using React Native and Flutter', 'https://images.example.com/freelancers/frank.jpg', 'Chicago, IL', true, true, NOW() - INTERVAL '180 days'),
-- Designers (3)
('grace.chen@email.com', 'grace_designer', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'FREELANCER', 'Grace Chen', '+1-555-1007', 'UI/UX designer with expertise in Figma and user research', 'https://images.example.com/freelancers/grace.jpg', 'Los Angeles, CA', true, true, NOW() - INTERVAL '150 days'),
('henry.brown@email.com', 'henry_graphic', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'FREELANCER', 'Henry Brown', '+1-555-1008', 'Graphic designer specializing in branding and visual identity', 'https://images.example.com/freelancers/henry.jpg', 'New York, NY', true, true, NOW() - INTERVAL '120 days'),
('isabel.rodriguez@email.com', 'isabel_3d', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'FREELANCER', 'Isabel Rodriguez', '+1-555-1009', '3D designer and animator for games and visualization', 'https://images.example.com/freelancers/isabel.jpg', 'Chicago, IL', true, true, NOW() - INTERVAL '90 days'),
-- DevOps Engineers (2)
('jack.taylor@email.com', 'jack_devops', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'FREELANCER', 'Jack Taylor', '+1-555-1010', 'DevOps engineer specializing in AWS, Kubernetes, and CI/CD', 'https://images.example.com/freelancers/jack.jpg', 'San Francisco, CA', true, true, NOW() - INTERVAL '280 days'),
('karen.anderson@email.com', 'karen_cloud', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'FREELANCER', 'Karen Anderson', '+1-555-1011', 'Cloud architect with Azure and GCP certifications', 'https://images.example.com/freelancers/karen.jpg', 'New York, NY', true, true, NOW() - INTERVAL '220 days'),
-- Data Scientists (2)
('luis.hernandez@email.com', 'luis_datascience', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'FREELANCER', 'Luis Hernandez', '+1-555-1012', 'Data scientist with ML and deep learning expertise', 'https://images.example.com/freelancers/luis.jpg', 'Chicago, IL', true, true, NOW() - INTERVAL '160 days'),
('maria.kim@email.com', 'maria_analytics', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'FREELANCER', 'Maria Kim', '+1-555-1013', 'Business intelligence analyst and data visualization expert', 'https://images.example.com/freelancers/maria.jpg', 'Los Angeles, CA', true, true, NOW() - INTERVAL '140 days'),
-- QA Engineers (2)
('nancy.jackson@email.com', 'nancy_qa', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'FREELANCER', 'Nancy Jackson', '+1-555-1014', 'QA automation engineer with Selenium and Cypress expertise', 'https://images.example.com/freelancers/nancy.jpg', 'New York, NY', true, true, NOW() - INTERVAL '100 days'),
('oscar.white@email.com', 'oscar_test', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'FREELANCER', 'Oscar White', '+1-555-1015', 'Manual testing specialist with accessibility focus', 'https://images.example.com/freelancers/oscar.jpg', 'Chicago, IL', true, true, NOW() - INTERVAL '80 days'),
-- Additional Specialists (10 more)
('patricia.thompson@email.com', 'patricia_frontend', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'FREELANCER', 'Patricia Thompson', '+1-555-1016', 'Frontend expert with Vue.js and Angular mastery', 'https://images.example.com/freelancers/patricia.jpg', 'San Francisco, CA', true, true, NOW() - INTERVAL '340 days'),
('quentin.parker@email.com', 'quentin_backend', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'FREELANCER', 'Quentin Parker', '+1-555-1017', 'Backend engineer with Go and Rust expertise', 'https://images.example.com/freelancers/quentin.jpg', 'New York, NY', true, true, NOW() - INTERVAL '260 days'),
('rachel.lewis@email.com', 'rachel_webdesign', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'FREELANCER', 'Rachel Lewis', '+1-555-1018', 'Web designer and WordPress specialist', 'https://images.example.com/freelancers/rachel.jpg', 'Los Angeles, CA', true, true, NOW() - INTERVAL '175 days'),
('samuel.clark@email.com', 'samuel_fullstack', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'FREELANCER', 'Samuel Clark', '+1-555-1019', 'Full-stack developer with Next.js and GraphQL skills', 'https://images.example.com/freelancers/samuel.jpg', 'Chicago, IL', true, true, NOW() - INTERVAL '220 days'),
('tanya.harris@email.com', 'tanya_database', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'FREELANCER', 'Tanya Harris', '+1-555-1020', 'Database architect and SQL optimization expert', 'https://images.example.com/freelancers/tanya.jpg', 'San Francisco, CA', true, true, NOW() - INTERVAL '310 days'),
('ulysses.martin@email.com', 'ulysses_security', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'FREELANCER', 'Ulysses Martin', '+1-555-1021', 'Security specialist and penetration tester', 'https://images.example.com/freelancers/ulysses.jpg', 'New York, NY', true, true, NOW() - INTERVAL '290 days'),
('violet.foster@email.com', 'violet_content', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'FREELANCER', 'Violet Foster', '+1-555-1022', 'Content strategist and technical writer', 'https://images.example.com/freelancers/violet.jpg', 'Los Angeles, CA', true, true, NOW() - INTERVAL '130 days'),
('walter.davis@email.com', 'walter_sysadmin', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'FREELANCER', 'Walter Davis', '+1-555-1023', 'System administrator and Linux specialist', 'https://images.example.com/freelancers/walter.jpg', 'Chicago, IL', true, true, NOW() - INTERVAL '240 days'),
('xenia.morgan@email.com', 'xenia_ux', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'FREELANCER', 'Xenia Morgan', '+1-555-1024', 'UX researcher and interaction designer', 'https://images.example.com/freelancers/xenia.jpg', 'San Francisco, CA', true, true, NOW() - INTERVAL '165 days'),
('yemen.scott@email.com', 'yemen_gamedev', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'FREELANCER', 'Yemen Scott', '+1-555-1025', 'Game developer with Unity and Unreal Engine expertise', 'https://images.example.com/freelancers/yemen.jpg', 'Los Angeles, CA', true, true, NOW() - INTERVAL '195 days');

-- =====================================================
-- COMPANY PROFILES (10 records)
-- =====================================================
INSERT INTO companies (user_id, company_name, company_type, industry, website_url, company_size, phone, headquarters_location, total_projects_posted, total_spent_cents, created_at)
SELECT 
    u.id, 
    u.full_name,
    CASE 
        WHEN u.username IN ('techcorp', 'innovatelab', 'fintechsolutions') THEN 'ENTERPRISE'
        WHEN u.username IN ('cloudservices', 'dataanalytics', 'healthtechinc') THEN 'MEDIUM'
        ELSE 'SMALL'
    END,
    CASE 
        WHEN u.username LIKE '%tech%' THEN 'Technology'
        WHEN u.username LIKE '%design%' THEN 'Creative Services'
        WHEN u.username LIKE '%health%' THEN 'Healthcare'
        WHEN u.username LIKE '%game%' THEN 'Gaming'
        WHEN u.username LIKE '%data%' THEN 'Data & Analytics'
        WHEN u.username LIKE '%cloud%' THEN 'Cloud Services'
        ELSE 'Technology'
    END,
    'https://www.' || u.username || '.com',
    CASE 
        WHEN u.username IN ('techcorp', 'innovatelab') THEN 'ENTERPRISE'
        WHEN u.username IN ('fintechsolutions', 'cloudservices', 'dataanalytics') THEN 'LARGE'
        WHEN u.username IN ('healthtechinc', 'designstudio') THEN 'MEDIUM'
        ELSE 'SMALL'
    END,
    u.phone,
    u.location,
    0, 0,
    u.created_at
FROM users u
WHERE u.role = 'COMPANY';

-- =====================================================
-- FREELANCER PROFILES (15 records)
-- =====================================================
INSERT INTO freelancers (user_id, hourly_rate_cents, experience_years, headline, skills, languages, completion_rate, total_earnings_cents, total_projects_completed, created_at)
SELECT 
    u.id,
    CASE 
        WHEN u.username LIKE '%_dev' OR u.username LIKE '%_java' OR u.username LIKE '%_python' THEN 15000  -- $150/hr for senior devs
        WHEN u.username LIKE '%_ios' OR u.username LIKE '%_android' OR u.username LIKE '%_mobile' THEN 12000  -- $120/hr for mobile
        WHEN u.username LIKE '%_devops' OR u.username LIKE '%_cloud' THEN 14000  -- $140/hr for DevOps
        WHEN u.username LIKE '%_designer' OR u.username LIKE '%_graphic' OR u.username LIKE '%_3d' THEN 10000  -- $100/hr for design
        WHEN u.username LIKE '%_datascience' OR u.username LIKE '%_analytics' THEN 13000  -- $130/hr for data
        ELSE 8000  -- $80/hr for QA
    END,
    CASE 
        WHEN u.created_at < NOW() - INTERVAL '350 days' THEN 8
        WHEN u.created_at < NOW() - INTERVAL '200 days' THEN 5
        ELSE 3
    END,
    SUBSTRING(u.bio, 1, 100),
    CASE 
        WHEN u.username LIKE '%_dev' THEN '["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker"]'::jsonb
        WHEN u.username LIKE '%_python' THEN '["Python", "Django", "PostgreSQL", "Redis", "Docker", "REST APIs"]'::jsonb
        WHEN u.username LIKE '%_java' THEN '["Java", "Spring Boot", "Microservices", "PostgreSQL", "Kubernetes"]'::jsonb
        WHEN u.username LIKE '%_ios' THEN '["Swift", "SwiftUI", "iOS", "CoreData", "REST APIs"]'::jsonb
        WHEN u.username LIKE '%_android' THEN '["Kotlin", "Android", "Jetpack Compose", "Room", "Firebase"]'::jsonb
        WHEN u.username LIKE '%_mobile' THEN '["React Native", "Flutter", "JavaScript", "Dart", "Mobile Apps"]'::jsonb
        WHEN u.username LIKE '%_designer' THEN '["Figma", "UI/UX", "User Research", "Prototyping", "Design Systems"]'::jsonb
        WHEN u.username LIKE '%_graphic' THEN '["Adobe Illustrator", "Photoshop", "Branding", "Logo Design"]'::jsonb
        WHEN u.username LIKE '%_3d' THEN '["Blender", "3D Modeling", "Animation", "Unity", "Unreal Engine"]'::jsonb
        WHEN u.username LIKE '%_devops' THEN '["AWS", "Kubernetes", "Docker", "CI/CD", "Terraform", "Jenkins"]'::jsonb
        WHEN u.username LIKE '%_cloud' THEN '["Azure", "GCP", "CloudFormation", "Infrastructure as Code"]'::jsonb
        WHEN u.username LIKE '%_datascience' THEN '["Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning"]'::jsonb
        WHEN u.username LIKE '%_analytics' THEN '["SQL", "Tableau", "Power BI", "Data Visualization", "Python"]'::jsonb
        WHEN u.username LIKE '%_qa' THEN '["Selenium", "Cypress", "Test Automation", "Java", "Python"]'::jsonb
        ELSE '["Manual Testing", "Test Cases", "Bug Tracking", "Accessibility Testing"]'::jsonb
    END,
    '[{"language": "English", "proficiency": "native"}]'::jsonb,
    CASE 
        WHEN u.created_at < NOW() - INTERVAL '200 days' THEN 98.5
        ELSE 95.0
    END,
    0, 0,
    u.created_at
FROM users u
WHERE u.role = 'FREELANCER';

-- =====================================================
-- BULK INSERT: 100+ ADDITIONAL FREELANCERS (for pagination testing)
-- =====================================================
WITH bulk_freelancers AS (
    SELECT 
        'freelancer' || i || '@example.com' AS email,
        'freelancer_' || i AS username,
        (ARRAY['Alice', 'Bob', 'Carol', 'David', 'Emma', 'Frank', 'Grace', 'Henry', 'Isabel', 'Jack', 
               'Karen', 'Luis', 'Maria', 'Nancy', 'Oscar', 'Patricia', 'Quentin', 'Rachel', 'Samuel', 'Tanya',
               'Ulysses', 'Violet', 'Walter', 'Xenia', 'Yemen', 'Zoe', 'Aaron', 'Bella', 'Chris', 'Diana'])[((i - 1) % 30) + 1] ||
        ' ' ||
        (ARRAY['Anderson', 'Bailey', 'Brown', 'Chen', 'Davis', 'Evans', 'Foster', 'Garcia', 'Harris', 'Jackson',
               'Johnson', 'Kim', 'Lee', 'Lewis', 'Martin', 'Miller', 'Nelson', 'Parker', 'Quinn', 'Rodriguez',
               'Smith', 'Taylor', 'Thompson', 'White', 'Williams', 'Wilson', 'Young', 'Zhang', 'Adams', 'Bell'])[((i - 1) % 30) + 1] 
        AS full_name,
        '+1-555-' || LPAD((10000 + i)::text, 4, '0') AS phone,
        (ARRAY['New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Seattle', 'Boston', 'Denver', 'Austin', 'Miami', 'Portland'])[((i - 1) % 10) + 1] || 
        ', ' ||
        (ARRAY['NY', 'CA', 'CA', 'IL', 'WA', 'MA', 'CO', 'TX', 'FL', 'OR'])[((i - 1) % 10) + 1] 
        AS location,
        (ARRAY['React expert with 5+ years', 'Python Django specialist', 'iOS Swift developer', 'Mobile app expert', 'UI/UX Designer',
               'DevOps and Cloud specialist', 'Full-stack developer', 'Database architect', 'Game developer', 'Data scientist',
               'Vue.js expert', 'Angular specialist', 'Node.js backend dev', 'Android Kotlin expert', 'QA automation engineer',
               'Security specialist', 'Technical writer', 'Systems administrator', 'Graphics designer', 'AI/ML engineer'])[((i - 1) % 20) + 1] 
        AS bio,
        (ARRAY[
            '["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker"]',
            '["Python", "Django", "PostgreSQL", "Redis", "Docker", "REST APIs"]',
            '["Swift", "SwiftUI", "iOS", "CoreData", "REST APIs"]',
            '["Kotlin", "Android", "Jetpack Compose", "Firebase"]',
            '["Figma", "UI/UX", "Design Systems", "Prototyping"]',
            '["AWS", "Kubernetes", "Docker", "CI/CD", "Terraform"]',
            '["JavaScript", "React", "Node.js", "MongoDB", "Express"]',
            '["SQL", "PostgreSQL", "MongoDB", "Oracle", "Database Design"]',
            '["C#", "Unity", "Unreal Engine", "Game Development"]',
            '["Python", "TensorFlow", "Machine Learning", "Data Analysis"]',
            '["Vue.js", "JavaScript", "CSS", "Web Design"]',
            '["Angular", "TypeScript", "RxJS", "Material Design"]',
            '["Node.js", "Express", "API Design", "Microservices"]',
            '["Kotlin", "Android", "Material Design", "Firebase"]',
            '["Selenium", "Cypress", "Test Automation", "Java"]',
            '["Security", "Penetration Testing", "OWASP", "Compliance"]',
            '["Technical Writing", "API Documentation", "Markdown"]',
            '["Linux", "Bash", "System Administration", "Networking"]',
            '["Photoshop", "Illustrator", "Branding", "Logo Design"]',
            '["TensorFlow", "PyTorch", "Deep Learning", "Computer Vision"]'
        ])[((i - 1) % 20) + 1]::jsonb 
        AS skills,
        (ARRAY[7500, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000])[((i - 1) % 12) + 1] AS hourly_rate_cents,
        ((i - 1) % 10) + 1 AS experience_years,
        ((i - 1) % 4) + 90.0 AS completion_rate,
        (((i - 1) / 10)::int * 100000) AS total_earnings_cents,
        (i - 1) % 50 AS projects_completed,
        NOW() - ((RANDOM() * 400)::INT || ' days')::INTERVAL AS created_at
    FROM generate_series(26, 125) AS i
)
INSERT INTO users (email, username, password_hash, role, full_name, phone, bio, location, email_verified, is_active, created_at)
SELECT 
    email, 
    username, 
    '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i',
    'FREELANCER',
    full_name,
    phone,
    bio,
    location,
    true,
    true,
    created_at
FROM bulk_freelancers
ON CONFLICT(email) DO NOTHING;

-- Insert freelancer profiles for bulk users
INSERT INTO freelancers (user_id, hourly_rate_cents, experience_years, headline, skills, languages, completion_rate, total_earnings_cents, total_projects_completed, created_at)
SELECT 
    u.id,
    bf.hourly_rate_cents,
    bf.experience_years,
    SUBSTRING(bf.bio, 1, 100),
    bf.skills,
    '[{"language": "English", "proficiency": "native"}]'::jsonb,
    bf.completion_rate,
    bf.total_earnings_cents,
    bf.projects_completed,
    bf.created_at
FROM (
    SELECT 
        'freelancer' || i || '@example.com' AS email,
        (ARRAY[7500, 8000, 9000, 10000, 11000, 12000, 13000, 14000, 15000, 16000, 17000, 18000])[((i - 1) % 12) + 1] AS hourly_rate_cents,
        ((i - 1) % 10) + 1 AS experience_years,
        (ARRAY['React expert with 5+ years', 'Python Django specialist', 'iOS Swift developer', 'Mobile app expert', 'UI/UX Designer',
               'DevOps and Cloud specialist', 'Full-stack developer', 'Database architect', 'Game developer', 'Data scientist',
               'Vue.js expert', 'Angular specialist', 'Node.js backend dev', 'Android Kotlin expert', 'QA automation engineer',
               'Security specialist', 'Technical writer', 'Systems administrator', 'Graphics designer', 'AI/ML engineer'])[((i - 1) % 20) + 1] AS bio,
        ((i - 1) % 4) + 90.0 AS completion_rate,
        (((i - 1) / 10)::int * 100000) AS total_earnings_cents,
        (i - 1) % 50 AS projects_completed,
        NOW() - ((RANDOM() * 400)::INT || ' days')::INTERVAL AS created_at
    FROM generate_series(26, 125) AS i
) bf
JOIN users u ON u.email = bf.email
ON CONFLICT DO NOTHING;

-- =====================================================
-- BULK INSERT: 50 ADDITIONAL COMPANIES (for diverse search results)
-- =====================================================
INSERT INTO users (email, username, password_hash, role, full_name, phone, bio, location, email_verified, is_active, created_at)
WITH bulk_companies AS (
    SELECT 
        'company' || i || '@example.com' AS email,
        'company_' || i AS username,
        (ARRAY['Tech', 'Cloud', 'Mobile', 'Data', 'Design', 'Consulting', 'Software', 'Digital', 'Creative', 'Innovation',
               'Enterprise', 'Strategic', 'Advanced', 'Next Gen', 'Smart', 'Intelligent', 'Dynamic', 'Agile', 'Rapid', 'Future'])[((i - 1) % 20) + 1] || ' ' ||
        (ARRAY['Solutions', 'Systems', 'Services', 'Labs', 'Hub', 'Group', 'Corp', 'Inc', 'Ltd', 'Pro',
               'Co', 'Partners', 'Networks', 'Studios', 'Works', 'Ventures', 'Innovations', 'Technologies', 'Consultants', 'Experts'])[((i - 1) % 20) + 1] 
        AS company_name,
        (ARRAY['SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE'])[((i - 1) % 4) + 1] AS company_type,
        (ARRAY['Technology', 'Creative Services', 'Healthcare', 'Finance', 'E-Commerce', 'Data & Analytics', 'Cloud Services', 'Gaming', 
               'Education', 'Consulting', 'Manufacturing', 'Real Estate', 'Transportation', 'Retail', 'Media', 'Entertainment', 'SaaS', 'Startup', 'Research', 'Development'])[((i - 1) % 20) + 1] 
        AS industry,
        (ARRAY['New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Seattle', 'Boston', 'Denver', 'Austin', 'Miami', 'Portland'])[((i - 1) % 10) + 1] ||
        ', ' ||
        (ARRAY['NY', 'CA', 'CA', 'IL', 'WA', 'MA', 'CO', 'TX', 'FL', 'OR'])[((i - 1) % 10) + 1] 
        AS location,
        '+1-555-' || LPAD((20000 + i)::text, 4, '0') AS phone,
        NOW() - ((RANDOM() * 350)::INT || ' days')::INTERVAL AS created_at
    FROM generate_series(1, 50) AS i
)
INSERT INTO users (email, username, password_hash, role, full_name, phone, bio, location, email_verified, is_active, created_at)
SELECT 
    email, 
    username, 
    '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i',
    'COMPANY',
    company_name,
    phone,
    company_name || ' is a leading provider of ' || industry || ' solutions',
    location,
    true,
    true,
    created_at
FROM bulk_companies
ON CONFLICT(email) DO NOTHING;

-- Insert company profiles for bulk companies
INSERT INTO companies (user_id, company_name, company_type, industry, website_url, company_size, phone, headquarters_location, total_projects_posted, total_spent_cents, created_at)
SELECT 
    u.id,
    bc.company_name,
    bc.company_type,
    bc.industry,
    'https://www.' || bc.username || '.com',
    bc.company_type,
    bc.phone,
    bc.location,
    0, 0,
    u.created_at
FROM users u
JOIN bulk_companies bc ON u.email = bc.email
WHERE u.role = 'COMPANY' AND u.username LIKE 'company_%'
ON CONFLICT DO NOTHING;

-- Verify insertions
DO $$
BEGIN
    RAISE NOTICE 'Extended data loaded: % users (% companies, % freelancers, % admins)',
        (SELECT COUNT(*) FROM users),
        (SELECT COUNT(*) FROM companies),
        (SELECT COUNT(*) FROM freelancers),
        (SELECT COUNT(*) FROM users WHERE role = 'ADMIN');
END $$;
