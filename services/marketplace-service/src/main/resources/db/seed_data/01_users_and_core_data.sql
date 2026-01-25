-- =====================================================
-- COMPREHENSIVE SEED DATA FOR MARKETPLACE_DB
-- Author: Senior DBA & Principal Data Architect
-- Description: Realistic test data matching actual database schema
-- Date: 2026-01-18 (Corrected)
-- =====================================================

-- Disable triggers temporarily for faster insertion
SET session_replication_role = 'replica';

BEGIN;

-- =====================================================
-- 1. EXPERIENCE LEVELS (Reference Data)
-- =====================================================
INSERT INTO experience_levels (name, code, description, years_min, years_max, display_order, is_active)
VALUES
('Entry Level', 'ENTRY', 'Less than 2 years of professional experience', 0, 2, 1, true),
('Intermediate', 'INTERMEDIATE', '2-5 years of professional experience', 2, 5, 2, true),
('Senior', 'SENIOR', '5-10 years of professional experience', 5, 10, 3, true),
('Lead', 'LEAD', '10+ years and leadership experience', 10, 99, 4, true),
('Executive', 'EXECUTIVE', 'C-suite or executive management level', 15, 99, 5, true)
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- 2. JOB CATEGORIES (Reference Data)
-- =====================================================
INSERT INTO job_categories (name, slug, description, icon, display_order, is_active)
VALUES
('Software Development', 'software-development', 'Full-stack, backend, frontend, mobile development', 'code', 1, true),
('Design & Creative', 'design-creative', 'UI/UX, graphic design, video editing, animation', 'palette', 2, true),
('Marketing & Sales', 'marketing-sales', 'Digital marketing, SEO, content marketing, sales', 'trending-up', 3, true),
('Data Science & Analytics', 'data-science-analytics', 'Data analysis, machine learning, BI', 'bar-chart', 4, true),
('DevOps & Infrastructure', 'devops-infrastructure', 'Cloud architecture, CI/CD, system administration', 'server', 5, true),
('Quality Assurance', 'quality-assurance', 'Manual testing, automation, performance testing', 'check-circle', 6, true),
('Content Writing', 'content-writing', 'Technical writing, copywriting, blogging', 'file-text', 7, true),
('Project Management', 'project-management', 'Agile, Scrum, product management', 'clipboard', 8, true),
('Consulting', 'consulting', 'Business consulting, technical consulting', 'users', 9, true),
('Other', 'other', 'Miscellaneous freelance services', 'grid', 10, true)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 3. PROJECT CATEGORIES (Reference Data)
-- =====================================================
INSERT INTO project_categories (name, slug, description, icon, display_order, is_active)
VALUES
('Web Development', 'web-development', 'Website and web application development', 'globe', 1, true),
('Mobile Apps', 'mobile-apps', 'iOS and Android mobile applications', 'smartphone', 2, true),
('Design Projects', 'design-projects', 'UI/UX, Graphic Design, Branding', 'paintbrush', 3, true),
('Content Writing', 'content-writing', 'Blog posts, technical writing, copywriting', 'edit', 4, true),
('Marketing', 'marketing', 'Digital marketing, SEO, social media', 'megaphone', 5, true),
('Data & Analytics', 'data-analytics', 'Data analysis, visualization, reporting', 'bar-chart', 6, true),
('DevOps', 'devops', 'CI/CD, infrastructure, cloud deployment', 'server', 7, true),
('QA & Testing', 'qa-testing', 'Software testing and quality assurance', 'check-square', 8, true),
('Consulting', 'consulting', 'Technical and business consulting', 'users', 9, true),
('Other', 'other', 'Miscellaneous projects', 'grid', 10, true)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 4. USERS (10 Companies + 30 Freelancers)
-- Schema: email, username, password_hash, role, full_name, phone, bio, profile_image_url, location, 
--         email_verified, is_active, created_at
-- =====================================================

-- Companies (10)
INSERT INTO users (email, username, password_hash, full_name, phone, role, bio, profile_image_url, location, email_verified, is_active, created_at)
VALUES
('contact@techcorp.com', 'techcorp', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Tech Corporation', '+1-555-0101', 'COMPANY', 'Leading enterprise software solutions provider', 'https://images.example.com/companies/techcorp.jpg', 'New York, NY', true, true, NOW() - INTERVAL '180 days'),
('hr@innovatelab.com', 'innovatelab', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Innovate Labs Inc.', '+1-555-0102', 'COMPANY', 'Innovation-driven technology startup', 'https://images.example.com/companies/innovatelab.jpg', 'San Francisco, CA', true, true, NOW() - INTERVAL '150 days'),
('jobs@designstudio.com', 'designstudio', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Design Studio Creative', '+1-555-0103', 'COMPANY', 'Creative design agency specializing in digital products', 'https://images.example.com/companies/designstudio.jpg', 'Chicago, IL', true, true, NOW() - INTERVAL '120 days'),
('careers@fintech.com', 'fintechsolutions', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'FinTech Solutions LLC', '+1-555-0104', 'COMPANY', 'Financial technology and payment processing', 'https://images.example.com/companies/fintech.jpg', 'New York, NY', true, true, NOW() - INTERVAL '200 days'),
('talent@healthtech.com', 'healthtechinc', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'HealthTech Inc.', '+1-555-0105', 'COMPANY', 'Healthcare technology and telemedicine platform', 'https://images.example.com/companies/healthtech.jpg', 'Los Angeles, CA', true, true, NOW() - INTERVAL '90 days'),
('info@ecommhub.com', 'ecommercehub', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'ECommerce Hub', '+1-555-0106', 'COMPANY', 'Online marketplace and retail solutions', 'https://images.example.com/companies/ecomm.jpg', 'Chicago, IL', true, true, NOW() - INTERVAL '60 days'),
('team@dataanalytics.com', 'dataanalytics', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Data Analytics Corp', '+1-555-0107', 'COMPANY', 'Big data and business intelligence solutions', 'https://images.example.com/companies/dataanalytics.jpg', 'New York, NY', true, true, NOW() - INTERVAL '45 days'),
('contact@cloudservices.com', 'cloudservices', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Cloud Services Ltd', '+1-555-0108', 'COMPANY', 'Cloud infrastructure and DevOps consulting', 'https://images.example.com/companies/cloudservices.jpg', 'San Francisco, CA', true, true, NOW() - INTERVAL '30 days'),
('hr@mobilefirst.com', 'mobilefirstltd', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Mobile First Ltd', '+1-555-0109', 'COMPANY', 'Mobile app development company', 'https://images.example.com/companies/mobilefirst.jpg', 'Chicago, IL', true, true, NOW() - INTERVAL '75 days'),
('jobs@gamestudio.com', 'gamestudiopro', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Game Studio Pro', '+1-555-0110', 'COMPANY', 'Video game development studio', 'https://images.example.com/companies/gamestudio.jpg', 'Los Angeles, CA', true, true, NOW() - INTERVAL '100 days');

-- Freelancers (30)
INSERT INTO users (email, username, password_hash, full_name, phone, role, bio, profile_image_url, location, email_verified, is_active, created_at)
VALUES
-- Senior Full Stack Developers (3)
('alice.johnson@email.com', 'alice_dev', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Alice Johnson', '+1-555-1001', 'FREELANCER', 'Senior Full-Stack Developer specializing in React, Node.js, and cloud architecture', 'https://images.example.com/freelancers/alice.jpg', 'New York, NY', true, true, NOW() - INTERVAL '365 days'),
('bob.smith@email.com', 'bob_python', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Bob Smith', '+1-555-1002', 'FREELANCER', 'Python/Django expert with 8 years experience in backend development', 'https://images.example.com/freelancers/bob.jpg', 'Chicago, IL', true, true, NOW() - INTERVAL '300 days'),
('carol.martinez@email.com', 'carol_java', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Carol Martinez', '+1-555-1003', 'FREELANCER', 'Java/Spring Boot architect with microservices expertise', 'https://images.example.com/freelancers/carol.jpg', 'Los Angeles, CA', true, true, NOW() - INTERVAL '400 days'),
-- Mobile Developers (3)
('david.lee@email.com', 'david_ios', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'David Lee', '+1-555-1004', 'FREELANCER', 'iOS developer with Swift and SwiftUI mastery', 'https://images.example.com/freelancers/david.jpg', 'San Francisco, CA', true, true, NOW() - INTERVAL '250 days'),
('emma.wilson@email.com', 'emma_android', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Emma Wilson', '+1-555-1005', 'FREELANCER', 'Android developer specializing in Kotlin and Jetpack Compose', 'https://images.example.com/freelancers/emma.jpg', 'New York, NY', true, true, NOW() - INTERVAL '200 days'),
('frank.garcia@email.com', 'frank_mobile', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Frank Garcia', '+1-555-1006', 'FREELANCER', 'Cross-platform mobile developer using React Native and Flutter', 'https://images.example.com/freelancers/frank.jpg', 'Chicago, IL', true, true, NOW() - INTERVAL '180 days'),
-- Designers (3)
('grace.chen@email.com', 'grace_designer', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Grace Chen', '+1-555-1007', 'FREELANCER', 'UI/UX designer with expertise in Figma and user research', 'https://images.example.com/freelancers/grace.jpg', 'Los Angeles, CA', true, true, NOW() - INTERVAL '150 days'),
('henry.brown@email.com', 'henry_graphic', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Henry Brown', '+1-555-1008', 'FREELANCER', 'Graphic designer specializing in branding and visual identity', 'https://images.example.com/freelancers/henry.jpg', 'New York, NY', true, true, NOW() - INTERVAL '120 days'),
('isabel.rodriguez@email.com', 'isabel_3d', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Isabel Rodriguez', '+1-555-1009', 'FREELANCER', '3D designer and animator for games and visualization', 'https://images.example.com/freelancers/isabel.jpg', 'Chicago, IL', true, true, NOW() - INTERVAL '90 days'),
-- DevOps Engineers (2)
('jack.taylor@email.com', 'jack_devops', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Jack Taylor', '+1-555-1010', 'FREELANCER', 'DevOps engineer specializing in AWS, Kubernetes, and CI/CD', 'https://images.example.com/freelancers/jack.jpg', 'San Francisco, CA', true, true, NOW() - INTERVAL '280 days'),
('karen.anderson@email.com', 'karen_cloud', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Karen Anderson', '+1-555-1011', 'FREELANCER', 'Cloud architect with Azure and GCP certifications', 'https://images.example.com/freelancers/karen.jpg', 'New York, NY', true, true, NOW() - INTERVAL '220 days'),
-- Data Scientists (2)
('luis.hernandez@email.com', 'luis_datascience', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Luis Hernandez', '+1-555-1012', 'FREELANCER', 'Data scientist with ML and deep learning expertise', 'https://images.example.com/freelancers/luis.jpg', 'Chicago, IL', true, true, NOW() - INTERVAL '160 days'),
('maria.kim@email.com', 'maria_analytics', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Maria Kim', '+1-555-1013', 'FREELANCER', 'Business intelligence analyst and data visualization expert', 'https://images.example.com/freelancers/maria.jpg', 'Los Angeles, CA', true, true, NOW() - INTERVAL '140 days'),
-- QA Engineers (2)
('nathan.white@email.com', 'nathan_qa', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Nathan White', '+1-555-1014', 'FREELANCER', 'QA automation engineer with Selenium and Cypress', 'https://images.example.com/freelancers/nathan.jpg', 'New York, NY', true, true, NOW() - INTERVAL '110 days'),
('olivia.jones@email.com', 'olivia_tester', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Olivia Jones', '+1-555-1015', 'FREELANCER', 'Manual QA tester with strong attention to detail', 'https://images.example.com/freelancers/olivia.jpg', 'Chicago, IL', true, true, NOW() - INTERVAL '80 days'),
-- Security Expert (1)
('peter.davis@email.com', 'peter_security', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Peter Davis', '+1-555-1016', 'FREELANCER', 'Cybersecurity specialist and penetration tester', 'https://images.example.com/freelancers/peter.jpg', 'San Francisco, CA', true, true, NOW() - INTERVAL '260 days'),
-- Content Writers (3)
('quinn.miller@email.com', 'quinn_writer', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Quinn Miller', '+1-555-1017', 'FREELANCER', 'Technical writer with software documentation expertise', 'https://images.example.com/freelancers/quinn.jpg', 'New York, NY', true, true, NOW() - INTERVAL '70 days'),
('rachel.moore@email.com', 'rachel_content', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Rachel Moore', '+1-555-1018', 'FREELANCER', 'Marketing copywriter and content strategist', 'https://images.example.com/freelancers/rachel.jpg', 'Chicago, IL', true, true, NOW() - INTERVAL '50 days'),
('samuel.taylor@email.com', 'samuel_social', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Samuel Taylor', '+1-555-1019', 'FREELANCER', 'Social media manager and content creator', 'https://images.example.com/freelancers/samuel.jpg', 'Los Angeles, CA', true, true, NOW() - INTERVAL '40 days'),
-- Product Manager (1)
('tina.harris@email.com', 'tina_pm', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Tina Harris', '+1-555-1020', 'FREELANCER', 'Product manager with Agile/Scrum certification', 'https://images.example.com/freelancers/tina.jpg', 'New York, NY', true, true, NOW() - INTERVAL '130 days'),
-- Junior Developers (3)
('uma.patel@email.com', 'uma_junior', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Uma Patel', '+1-555-1021', 'FREELANCER', 'Junior frontend developer learning React and TypeScript', 'https://images.example.com/freelancers/uma.jpg', 'Chicago, IL', true, true, NOW() - INTERVAL '60 days'),
('victor.santos@email.com', 'victor_entry', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Victor Santos', '+1-555-1022', 'FREELANCER', 'Entry-level data analyst with Python skills', 'https://images.example.com/freelancers/victor.jpg', 'Los Angeles, CA', true, true, NOW() - INTERVAL '45 days'),
('wendy.clark@email.com', 'wendy_newbie', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Wendy Clark', '+1-555-1023', 'FREELANCER', 'Junior UI designer starting freelance career', 'https://images.example.com/freelancers/wendy.jpg', 'New York, NY', true, true, NOW() - INTERVAL '30 days'),
-- Specialized Experts (7)
('xavier.nguyen@email.com', 'xavier_blockchain', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Xavier Nguyen', '+1-555-1024', 'FREELANCER', 'Blockchain developer specializing in Ethereum and smart contracts', 'https://images.example.com/freelancers/xavier.jpg', 'San Francisco, CA', true, true, NOW() - INTERVAL '190 days'),
('yara.ahmed@email.com', 'yara_ai', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Yara Ahmed', '+1-555-1025', 'FREELANCER', 'AI/ML engineer with NLP and computer vision expertise', 'https://images.example.com/freelancers/yara.jpg', 'New York, NY', true, true, NOW() - INTERVAL '170 days'),
('zack.thompson@email.com', 'zack_game', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Zack Thompson', '+1-555-1026', 'FREELANCER', 'Game developer with Unity and Unreal Engine experience', 'https://images.example.com/freelancers/zack.jpg', 'Chicago, IL', true, true, NOW() - INTERVAL '210 days'),
('amy.wong@email.com', 'amy_architect', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Amy Wong', '+1-555-1027', 'FREELANCER', 'Solutions architect with enterprise system design expertise', 'https://images.example.com/freelancers/amy.jpg', 'San Francisco, CA', true, true, NOW() - INTERVAL '320 days'),
('brian.otoole@email.com', 'brian_video', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Brian O''Toole', '+1-555-1028', 'FREELANCER', 'Video editor and motion graphics designer', 'https://images.example.com/freelancers/brian.jpg', 'New York, NY', true, true, NOW() - INTERVAL '95 days'),
('chloe.martin@email.com', 'chloe_legal', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Chloe Martin', '+1-555-1029', 'FREELANCER', 'Legal tech specialist with contract automation expertise', 'https://images.example.com/freelancers/chloe.jpg', 'Chicago, IL', true, true, NOW() - INTERVAL '105 days'),
('daniel.fischer@email.com', 'daniel_dba', '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i', 'Daniel Fischer', '+1-555-1030', 'FREELANCER', 'Database administrator with PostgreSQL and MongoDB expertise', 'https://images.example.com/freelancers/daniel.jpg', 'San Francisco, CA', true, true, NOW() - INTERVAL '240 days');

-- =====================================================
-- 5. COMPANIES (Derived from COMPANY users)
-- Schema: user_id, company_name, company_type, industry, website_url, company_size, headquarters_location
-- =====================================================
INSERT INTO companies (user_id, company_name, company_type, industry, website_url, company_size, headquarters_location)
SELECT 
    u.id,
    u.full_name,
    CASE u.username
        WHEN 'techcorp' THEN 'Corporation'
        WHEN 'innovatelab' THEN 'Startup'
        WHEN 'designstudio' THEN 'Agency'
        WHEN 'fintechsolutions' THEN 'LLC'
        WHEN 'healthtechinc' THEN 'Inc'
        WHEN 'ecommercehub' THEN 'Corporation'
        WHEN 'dataanalytics' THEN 'Corporation'
        WHEN 'cloudservices' THEN 'Ltd'
        WHEN 'mobilefirstltd' THEN 'Ltd'
        WHEN 'gamestudiopro' THEN 'Studio'
    END,
    CASE u.username
        WHEN 'techcorp' THEN 'Technology'
        WHEN 'innovatelab' THEN 'Technology'
        WHEN 'designstudio' THEN 'Creative Services'
        WHEN 'fintechsolutions' THEN 'Financial Services'
        WHEN 'healthtechinc' THEN 'Healthcare'
        WHEN 'ecommercehub' THEN 'E-Commerce'
        WHEN 'dataanalytics' THEN 'Data & Analytics'
        WHEN 'cloudservices' THEN 'Cloud Computing'
        WHEN 'mobilefirstltd' THEN 'Mobile Technology'
        WHEN 'gamestudiopro' THEN 'Entertainment'
    END,
    CASE u.username
        WHEN 'techcorp' THEN 'https://www.techcorp.example.com'
        WHEN 'innovatelab' THEN 'https://www.innovatelabs.example.com'
        WHEN 'designstudio' THEN 'https://www.designstudio.example.com'
        WHEN 'fintechsolutions' THEN 'https://www.fintechsolutions.example.com'
        WHEN 'healthtechinc' THEN 'https://www.healthtechinc.example.com'
        WHEN 'ecommercehub' THEN 'https://www.ecommercehub.example.com'
        WHEN 'dataanalytics' THEN 'https://www.dataanalytics.example.com'
        WHEN 'cloudservices' THEN 'https://www.cloudservices.example.com'
        WHEN 'mobilefirstltd' THEN 'https://www.mobilefirst.example.com'
        WHEN 'gamestudiopro' THEN 'https://www.gamestudio.example.com'
    END,
    CASE u.username
        WHEN 'techcorp' THEN 'LARGE'
        WHEN 'innovatelab' THEN 'MEDIUM'
        WHEN 'designstudio' THEN 'SMALL'
        WHEN 'fintechsolutions' THEN 'MEDIUM'
        WHEN 'healthtechinc' THEN 'MEDIUM'
        WHEN 'ecommercehub' THEN 'LARGE'
        WHEN 'dataanalytics' THEN 'SMALL'
        WHEN 'cloudservices' THEN 'MEDIUM'
        WHEN 'mobilefirstltd' THEN 'SMALL'
        WHEN 'gamestudiopro' THEN 'MEDIUM'
    END,
    u.location
FROM users u
WHERE u.role = 'COMPANY';

-- =====================================================
-- 6. FREELANCERS (Derived from FREELANCER users)
-- Schema: user_id, hourly_rate_cents, experience_years, headline, skills (jsonb), 
--         certifications (jsonb), languages (jsonb), completion_rate, total_earnings_cents, 
--         total_projects_completed
-- =====================================================
INSERT INTO freelancers (
    user_id, 
    hourly_rate_cents, 
    experience_years,
    headline,
    skills, 
    certifications,
    languages,
    completion_rate,
    total_earnings_cents,
    total_projects_completed
)
SELECT 
    u.id,
    -- Hourly rate in cents
    CASE u.username
        -- Senior/Lead rates (150-200/hr = 15000-20000 cents)
        WHEN 'alice_dev' THEN 15000
        WHEN 'bob_python' THEN 14000
        WHEN 'carol_java' THEN 16000
        WHEN 'david_ios' THEN 13500
        WHEN 'jack_devops' THEN 15500
        WHEN 'karen_cloud' THEN 16500
        WHEN 'luis_datascience' THEN 17500
        WHEN 'peter_security' THEN 18000
        WHEN 'amy_architect' THEN 20000
        WHEN 'xavier_blockchain' THEN 17000
        WHEN 'yara_ai' THEN 18500
        WHEN 'daniel_dba' THEN 15000
        -- Mid-level rates (80-120/hr = 8000-12000 cents)
        WHEN 'emma_android' THEN 13000
        WHEN 'frank_mobile' THEN 14500
        WHEN 'grace_designer' THEN 11000
        WHEN 'henry_graphic' THEN 9500
        WHEN 'isabel_3d' THEN 12500
        WHEN 'maria_analytics' THEN 10500
        WHEN 'nathan_qa' THEN 10000
        WHEN 'olivia_tester' THEN 7500
        WHEN 'quinn_writer' THEN 8500
        WHEN 'rachel_content' THEN 9000
        WHEN 'samuel_social' THEN 8000
        WHEN 'tina_pm' THEN 12000
        WHEN 'zack_game' THEN 14000
        WHEN 'brian_video' THEN 10000
        WHEN 'chloe_legal' THEN 11500
        -- Junior rates (50-70/hr = 5000-7000 cents)
        WHEN 'uma_junior' THEN 6500
        WHEN 'victor_entry' THEN 5500
        WHEN 'wendy_newbie' THEN 5000
    END,
    -- Experience years
    CASE u.username
        -- Senior/Lead (8-15 years)
        WHEN 'alice_dev' THEN 9
        WHEN 'bob_python' THEN 8
        WHEN 'carol_java' THEN 12
        WHEN 'david_ios' THEN 7
        WHEN 'jack_devops' THEN 10
        WHEN 'karen_cloud' THEN 11
        WHEN 'luis_datascience' THEN 8
        WHEN 'peter_security' THEN 9
        WHEN 'amy_architect' THEN 15
        WHEN 'xavier_blockchain' THEN 6
        WHEN 'yara_ai' THEN 7
        WHEN 'daniel_dba' THEN 10
        -- Intermediate (3-6 years)
        WHEN 'emma_android' THEN 5
        WHEN 'frank_mobile' THEN 4
        WHEN 'grace_designer' THEN 5
        WHEN 'henry_graphic' THEN 4
        WHEN 'isabel_3d' THEN 6
        WHEN 'maria_analytics' THEN 4
        WHEN 'nathan_qa' THEN 5
        WHEN 'olivia_tester' THEN 3
        WHEN 'quinn_writer' THEN 4
        WHEN 'rachel_content' THEN 3
        WHEN 'samuel_social' THEN 3
        WHEN 'tina_pm' THEN 6
        WHEN 'zack_game' THEN 5
        WHEN 'brian_video' THEN 4
        WHEN 'chloe_legal' THEN 5
        -- Entry (1-2 years)
        WHEN 'uma_junior' THEN 1
        WHEN 'victor_entry' THEN 1
        WHEN 'wendy_newbie' THEN 2
    END,
    -- Headline (extracted from bio, first sentence)
    u.bio,
    -- Skills (JSONB format: [{"name": "React", "level": "expert", "years": 5}])
    CASE u.username
        -- Senior developers
        WHEN 'alice_dev' THEN '[
            {"name": "JavaScript", "level": "expert", "years": 9},
            {"name": "TypeScript", "level": "expert", "years": 7},
            {"name": "React", "level": "expert", "years": 8},
            {"name": "Node.js", "level": "expert", "years": 9},
            {"name": "AWS", "level": "advanced", "years": 6}
        ]'::jsonb
        WHEN 'bob_python' THEN '[
            {"name": "Python", "level": "expert", "years": 8},
            {"name": "Django", "level": "expert", "years": 7},
            {"name": "PostgreSQL", "level": "advanced", "years": 6},
            {"name": "Redis", "level": "intermediate", "years": 4}
        ]'::jsonb
        WHEN 'carol_java' THEN '[
            {"name": "Java", "level": "expert", "years": 12},
            {"name": "Spring Boot", "level": "expert", "years": 10},
            {"name": "Microservices", "level": "expert", "years": 8},
            {"name": "Kubernetes", "level": "advanced", "years": 5}
        ]'::jsonb
        -- Mobile
        WHEN 'david_ios' THEN '[
            {"name": "Swift", "level": "expert", "years": 7},
            {"name": "SwiftUI", "level": "advanced", "years": 3},
            {"name": "iOS", "level": "expert", "years": 7}
        ]'::jsonb
        WHEN 'emma_android' THEN '[
            {"name": "Kotlin", "level": "advanced", "years": 5},
            {"name": "Android", "level": "advanced", "years": 5},
            {"name": "Jetpack Compose", "level": "intermediate", "years": 2}
        ]'::jsonb
        WHEN 'frank_mobile' THEN '[
            {"name": "React Native", "level": "advanced", "years": 4},
            {"name": "Flutter", "level": "intermediate", "years": 2},
            {"name": "JavaScript", "level": "advanced", "years": 4}
        ]'::jsonb
        -- Designers
        WHEN 'grace_designer' THEN '[
            {"name": "UI/UX Design", "level": "advanced", "years": 5},
            {"name": "Figma", "level": "expert", "years": 4},
            {"name": "User Research", "level": "advanced", "years": 3}
        ]'::jsonb
        WHEN 'henry_graphic' THEN '[
            {"name": "Adobe Photoshop", "level": "expert", "years": 4},
            {"name": "Adobe Illustrator", "level": "expert", "years": 4},
            {"name": "Branding", "level": "advanced", "years": 3}
        ]'::jsonb
        WHEN 'isabel_3d' THEN '[
            {"name": "Blender", "level": "expert", "years": 6},
            {"name": "3D Modeling", "level": "expert", "years": 6},
            {"name": "Animation", "level": "advanced", "years": 4}
        ]'::jsonb
        -- DevOps
        WHEN 'jack_devops' THEN '[
            {"name": "AWS", "level": "expert", "years": 10},
            {"name": "Kubernetes", "level": "expert", "years": 7},
            {"name": "Docker", "level": "expert", "years": 8},
            {"name": "Terraform", "level": "advanced", "years": 5}
        ]'::jsonb
        WHEN 'karen_cloud' THEN '[
            {"name": "Azure", "level": "expert", "years": 11},
            {"name": "GCP", "level": "advanced", "years": 6},
            {"name": "Cloud Architecture", "level": "expert", "years": 10}
        ]'::jsonb
        -- Data
        WHEN 'luis_datascience' THEN '[
            {"name": "Python", "level": "expert", "years": 8},
            {"name": "TensorFlow", "level": "advanced", "years": 5},
            {"name": "Machine Learning", "level": "expert", "years": 6}
        ]'::jsonb
        WHEN 'maria_analytics' THEN '[
            {"name": "SQL", "level": "advanced", "years": 4},
            {"name": "Tableau", "level": "advanced", "years": 3},
            {"name": "Power BI", "level": "intermediate", "years": 2}
        ]'::jsonb
        -- QA
        WHEN 'nathan_qa' THEN '[
            {"name": "Selenium", "level": "advanced", "years": 5},
            {"name": "Test Automation", "level": "advanced", "years": 5},
            {"name": "Python", "level": "intermediate", "years": 3}
        ]'::jsonb
        WHEN 'olivia_tester' THEN '[
            {"name": "Manual Testing", "level": "advanced", "years": 3},
            {"name": "Test Cases", "level": "advanced", "years": 3},
            {"name": "Jira", "level": "intermediate", "years": 2}
        ]'::jsonb
        -- Security
        WHEN 'peter_security' THEN '[
            {"name": "Penetration Testing", "level": "expert", "years": 9},
            {"name": "Network Security", "level": "expert", "years": 9},
            {"name": "OWASP", "level": "expert", "years": 7}
        ]'::jsonb
        -- Content
        WHEN 'quinn_writer' THEN '[
            {"name": "Technical Writing", "level": "advanced", "years": 4},
            {"name": "Documentation", "level": "advanced", "years": 4},
            {"name": "API Documentation", "level": "intermediate", "years": 2}
        ]'::jsonb
        WHEN 'rachel_content' THEN '[
            {"name": "Content Strategy", "level": "advanced", "years": 3},
            {"name": "SEO", "level": "intermediate", "years": 2},
            {"name": "Copywriting", "level": "advanced", "years": 3}
        ]'::jsonb
        WHEN 'samuel_social' THEN '[
            {"name": "Social Media Marketing", "level": "intermediate", "years": 3},
            {"name": "Content Creation", "level": "intermediate", "years": 3}
        ]'::jsonb
        -- PM
        WHEN 'tina_pm' THEN '[
            {"name": "Product Management", "level": "advanced", "years": 6},
            {"name": "Agile", "level": "expert", "years": 6},
            {"name": "Scrum", "level": "expert", "years": 6}
        ]'::jsonb
        -- Junior
        WHEN 'uma_junior' THEN '[
            {"name": "React", "level": "beginner", "years": 1},
            {"name": "JavaScript", "level": "beginner", "years": 1},
            {"name": "HTML/CSS", "level": "intermediate", "years": 1}
        ]'::jsonb
        WHEN 'victor_entry' THEN '[
            {"name": "Python", "level": "beginner", "years": 1},
            {"name": "SQL", "level": "beginner", "years": 1},
            {"name": "Excel", "level": "intermediate", "years": 1}
        ]'::jsonb
        WHEN 'wendy_newbie' THEN '[
            {"name": "Figma", "level": "beginner", "years": 2},
            {"name": "UI Design", "level": "beginner", "years": 2}
        ]'::jsonb
        -- Specialized
        WHEN 'xavier_blockchain' THEN '[
            {"name": "Blockchain", "level": "expert", "years": 6},
            {"name": "Ethereum", "level": "expert", "years": 6},
            {"name": "Solidity", "level": "expert", "years": 5}
        ]'::jsonb
        WHEN 'yara_ai' THEN '[
            {"name": "Machine Learning", "level": "expert", "years": 7},
            {"name": "Deep Learning", "level": "expert", "years": 6},
            {"name": "NLP", "level": "advanced", "years": 5}
        ]'::jsonb
        WHEN 'zack_game' THEN '[
            {"name": "Unity", "level": "advanced", "years": 5},
            {"name": "Unreal Engine", "level": "intermediate", "years": 3},
            {"name": "C#", "level": "advanced", "years": 5}
        ]'::jsonb
        WHEN 'amy_architect' THEN '[
            {"name": "System Architecture", "level": "expert", "years": 15},
            {"name": "Microservices", "level": "expert", "years": 12},
            {"name": "Cloud Architecture", "level": "expert", "years": 10}
        ]'::jsonb
        WHEN 'brian_video' THEN '[
            {"name": "Adobe Premiere Pro", "level": "advanced", "years": 4},
            {"name": "After Effects", "level": "intermediate", "years": 3},
            {"name": "Video Editing", "level": "advanced", "years": 4}
        ]'::jsonb
        WHEN 'chloe_legal' THEN '[
            {"name": "Legal Technology", "level": "advanced", "years": 5},
            {"name": "Contract Automation", "level": "advanced", "years": 4},
            {"name": "Compliance", "level": "intermediate", "years": 3}
        ]'::jsonb
        WHEN 'daniel_dba' THEN '[
            {"name": "PostgreSQL", "level": "expert", "years": 10},
            {"name": "MongoDB", "level": "advanced", "years": 7},
            {"name": "Database Design", "level": "expert", "years": 10}
        ]'::jsonb
    END,
    -- Certifications (JSONB format: [{"name": "AWS Certified", "issuer": "Amazon", "year": 2023}])
    CASE u.username
        WHEN 'alice_dev' THEN '[{"name": "AWS Solutions Architect", "issuer": "Amazon", "year": 2022}]'::jsonb
        WHEN 'carol_java' THEN '[{"name": "Oracle Certified Professional", "issuer": "Oracle", "year": 2020}]'::jsonb
        WHEN 'jack_devops' THEN '[{"name": "AWS DevOps Engineer", "issuer": "Amazon", "year": 2021}, {"name": "CKA", "issuer": "CNCF", "year": 2022}]'::jsonb
        WHEN 'karen_cloud' THEN '[{"name": "Azure Solutions Architect", "issuer": "Microsoft", "year": 2021}, {"name": "GCP Professional Cloud Architect", "issuer": "Google", "year": 2022}]'::jsonb
        WHEN 'peter_security' THEN '[{"name": "OSCP", "issuer": "Offensive Security", "year": 2020}, {"name": "CEH", "issuer": "EC-Council", "year": 2019}]'::jsonb
        WHEN 'tina_pm' THEN '[{"name": "Certified Scrum Master", "issuer": "Scrum Alliance", "year": 2021}]'::jsonb
        ELSE '[]'::jsonb
    END,
    -- Languages (JSONB format: [{"language": "English", "proficiency": "native"}])
    CASE u.username
        WHEN 'carol_java' THEN '[{"language": "English", "proficiency": "native"}, {"language": "Spanish", "proficiency": "professional"}]'::jsonb
        WHEN 'grace_designer' THEN '[{"language": "English", "proficiency": "native"}, {"language": "Mandarin", "proficiency": "native"}]'::jsonb
        WHEN 'luis_datascience' THEN '[{"language": "English", "proficiency": "professional"}, {"language": "Spanish", "proficiency": "native"}]'::jsonb
        WHEN 'maria_kim' THEN '[{"language": "English", "proficiency": "professional"}, {"language": "Korean", "proficiency": "native"}]'::jsonb
        WHEN 'isabel_rodriguez' THEN '[{"language": "English", "proficiency": "professional"}, {"language": "Spanish", "proficiency": "native"}]'::jsonb
        WHEN 'xavier_nguyen' THEN '[{"language": "English", "proficiency": "professional"}, {"language": "Vietnamese", "proficiency": "native"}]'::jsonb
        WHEN 'yara_ai' THEN '[{"language": "English", "proficiency": "professional"}, {"language": "Arabic", "proficiency": "native"}]'::jsonb
        WHEN 'amy_wong' THEN '[{"language": "English", "proficiency": "native"}, {"language": "Cantonese", "proficiency": "native"}]'::jsonb
        WHEN 'chloe_legal' THEN '[{"language": "English", "proficiency": "native"}, {"language": "French", "proficiency": "professional"}]'::jsonb
        WHEN 'daniel_dba' THEN '[{"language": "English", "proficiency": "professional"}, {"language": "German", "proficiency": "native"}]'::jsonb
        ELSE '[{"language": "English", "proficiency": "native"}]'::jsonb
    END,
    -- Completion rate
    CASE u.username
        -- Very high success (95-99%)
        WHEN 'alice_dev' THEN 98.5
        WHEN 'carol_java' THEN 99.0
        WHEN 'amy_architect' THEN 97.8
        -- High success (90-94%)
        WHEN 'bob_python' THEN 94.2
        WHEN 'david_ios' THEN 92.5
        WHEN 'jack_devops' THEN 93.8
        WHEN 'karen_cloud' THEN 91.5
        WHEN 'luis_datascience' THEN 90.2
        WHEN 'peter_security' THEN 95.5
        WHEN 'xavier_blockchain' THEN 91.0
        WHEN 'yara_ai' THEN 90.8
        WHEN 'daniel_dba' THEN 93.2
        -- Good success (85-89%)
        WHEN 'emma_android' THEN 88.5
        WHEN 'frank_mobile' THEN 87.2
        WHEN 'grace_designer' THEN 89.0
        WHEN 'henry_graphic' THEN 85.5
        WHEN 'isabel_3d' THEN 86.8
        WHEN 'maria_analytics' THEN 87.5
        WHEN 'nathan_qa' THEN 88.2
        WHEN 'tina_pm' THEN 89.5
        WHEN 'zack_game' THEN 85.0
        WHEN 'chloe_legal' THEN 86.0
        -- Average success (80-84%)
        WHEN 'olivia_tester' THEN 82.0
        WHEN 'quinn_writer' THEN 83.5
        WHEN 'rachel_content' THEN 84.2
        WHEN 'samuel_social' THEN 80.5
        WHEN 'brian_video' THEN 81.8
        -- Entry success (75-79%)
        WHEN 'uma_junior' THEN 78.0
        WHEN 'victor_entry' THEN 75.5
        WHEN 'wendy_newbie' THEN 76.2
    END,
    -- Total earnings in cents
    CASE u.username
        -- High earners ($200k-$350k = 20000000-35000000 cents)
        WHEN 'alice_dev' THEN 25000000
        WHEN 'bob_python' THEN 18000000
        WHEN 'carol_java' THEN 30000000
        WHEN 'amy_architect' THEN 35000000
        WHEN 'peter_security' THEN 22000000
        -- Mid earners ($120k-$200k = 12000000-20000000 cents)
        WHEN 'david_ios' THEN 15000000
        WHEN 'emma_android' THEN 12000000
        WHEN 'frank_mobile' THEN 14000000
        WHEN 'jack_devops' THEN 20000000
        WHEN 'karen_cloud' THEN 18000000
        WHEN 'luis_datascience' THEN 16000000
        WHEN 'xavier_blockchain' THEN 19000000
        WHEN 'yara_ai' THEN 17000000
        WHEN 'daniel_dba' THEN 13000000
        -- Lower mid ($40k-$100k = 4000000-10000000 cents)
        WHEN 'grace_designer' THEN 8000000
        WHEN 'henry_graphic' THEN 6000000
        WHEN 'isabel_3d' THEN 9000000
        WHEN 'maria_analytics' THEN 7000000
        WHEN 'nathan_qa' THEN 7500000
        WHEN 'olivia_tester' THEN 4500000
        WHEN 'quinn_writer' THEN 5000000
        WHEN 'rachel_content' THEN 5500000
        WHEN 'samuel_social' THEN 4000000
        WHEN 'tina_pm' THEN 10000000
        WHEN 'zack_game' THEN 8500000
        WHEN 'brian_video' THEN 6500000
        WHEN 'chloe_legal' THEN 9500000
        -- Entry level ($8k-$15k = 800000-1500000 cents)
        WHEN 'uma_junior' THEN 1500000
        WHEN 'victor_entry' THEN 1000000
        WHEN 'wendy_newbie' THEN 800000
    END,
    -- Total projects completed
    CASE u.username
        -- Experienced (50-100 projects)
        WHEN 'alice_dev' THEN 87
        WHEN 'bob_python' THEN 65
        WHEN 'carol_java' THEN 91
        WHEN 'amy_architect' THEN 78
        WHEN 'peter_security' THEN 52
        -- Mid experience (30-49 projects)
        WHEN 'david_ios' THEN 45
        WHEN 'emma_android' THEN 38
        WHEN 'frank_mobile' THEN 42
        WHEN 'jack_devops' THEN 48
        WHEN 'karen_cloud' THEN 43
        WHEN 'luis_datascience' THEN 36
        WHEN 'xavier_blockchain' THEN 34
        WHEN 'yara_ai' THEN 31
        WHEN 'daniel_dba' THEN 40
        WHEN 'grace_designer' THEN 41
        WHEN 'isabel_3d' THEN 33
        WHEN 'tina_pm' THEN 37
        WHEN 'zack_game' THEN 29
        WHEN 'chloe_legal' THEN 26
        -- Lower experience (15-29 projects)
        WHEN 'henry_graphic' THEN 28
        WHEN 'maria_analytics' THEN 25
        WHEN 'nathan_qa' THEN 27
        WHEN 'olivia_tester' THEN 22
        WHEN 'quinn_writer' THEN 24
        WHEN 'rachel_content' THEN 21
        WHEN 'samuel_social' THEN 19
        WHEN 'brian_video' THEN 23
        -- New (5-14 projects)
        WHEN 'uma_junior' THEN 12
        WHEN 'victor_entry' THEN 8
        WHEN 'wendy_newbie' THEN 5
    END
FROM users u
WHERE u.role = 'FREELANCER';

COMMIT;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
SELECT 'Seed data inserted successfully!' as status;
SELECT 'Users: ' || COUNT(*) as summary FROM users;
SELECT 'Companies: ' || COUNT(*) as summary FROM companies;
SELECT 'Freelancers: ' || COUNT(*) as summary FROM freelancers;
SELECT 'Experience Levels: ' || COUNT(*) as summary FROM experience_levels;
SELECT 'Job Categories: ' || COUNT(*) as summary FROM job_categories;
SELECT 'Project Categories: ' || COUNT(*) as summary FROM project_categories;
