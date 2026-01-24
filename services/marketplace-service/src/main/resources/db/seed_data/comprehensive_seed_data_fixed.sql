-- =====================================================
-- COMPREHENSIVE SEED DATA FOR MARKETPLACE_DB
-- Author: Senior DBA & Principal Data Architect
-- Description: Realistic test data covering all scenarios
-- Date: 2026-01-18
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
-- =====================================================

-- Companies (10)
INSERT INTO users (email, username, password_hash, first_name, last_name, phone_number, role, status, bio, profile_image_url, timezone, language, is_email_verified, is_phone_verified, email_notifications_enabled, sms_notifications_enabled, terms_accepted_at, privacy_accepted_at, last_login_at)
VALUES
('contact@techcorp.com', 'techcorp', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Tech', 'Corporation', '+1-555-0101', 'COMPANY', 'ACTIVE', 'Leading enterprise software solutions provider', 'https://images.example.com/companies/techcorp.jpg', 'America/New_York', 'en', true, true, true, false, NOW() - INTERVAL '180 days', NOW() - INTERVAL '180 days', NOW() - INTERVAL '1 day'),

('hr@innovatelab.com', 'innovatelab', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Innovate', 'Labs', '+1-555-0102', 'COMPANY', 'ACTIVE', 'Innovation-driven technology startup', 'https://images.example.com/companies/innovatelab.jpg', 'America/Los_Angeles', 'en', true, false, true, false, NOW() - INTERVAL '150 days', NOW() - INTERVAL '150 days', NOW() - INTERVAL '2 days'),

('jobs@designstudio.com', 'designstudio', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Design', 'Studio', '+1-555-0103', 'COMPANY', 'ACTIVE', 'Creative design agency specializing in digital products', 'https://images.example.com/companies/designstudio.jpg', 'America/Chicago', 'en', true, true, true, true, NOW() - INTERVAL '120 days', NOW() - INTERVAL '120 days', NOW() - INTERVAL '3 hours'),

('careers@fintech.com', 'fintechsolutions', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'FinTech', 'Solutions', '+1-555-0104', 'COMPANY', 'ACTIVE', 'Financial technology and payment processing', 'https://images.example.com/companies/fintech.jpg', 'America/New_York', 'en', true, true, true, false, NOW() - INTERVAL '200 days', NOW() - INTERVAL '200 days', NOW() - INTERVAL '12 hours'),

('talent@healthtech.com', 'healthtechinc', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'HealthTech', 'Inc', '+1-555-0105', 'COMPANY', 'ACTIVE', 'Healthcare technology and telemedicine platform', 'https://images.example.com/companies/healthtech.jpg', 'America/Los_Angeles', 'en', true, false, true, false, NOW() - INTERVAL '90 days', NOW() - INTERVAL '90 days', NOW() - INTERVAL '5 days'),

('info@ecommhub.com', 'ecommercehub', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'ECommerce', 'Hub', '+1-555-0106', 'COMPANY', 'ACTIVE', 'Online marketplace and retail solutions', 'https://images.example.com/companies/ecomm.jpg', 'America/Chicago', 'en', true, true, true, true, NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days', NOW() - INTERVAL '1 hour'),

('team@dataanalytics.com', 'dataanalytics', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Data', 'Analytics', '+1-555-0107', 'COMPANY', 'ACTIVE', 'Big data and business intelligence solutions', 'https://images.example.com/companies/dataanalytics.jpg', 'America/New_York', 'en', true, true, true, false, NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days', NOW() - INTERVAL '2 hours'),

('contact@cloudservices.com', 'cloudservices', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Cloud', 'Services', '+1-555-0108', 'COMPANY', 'ACTIVE', 'Cloud infrastructure and DevOps consulting', 'https://images.example.com/companies/cloudservices.jpg', 'America/Los_Angeles', 'en', true, false, true, false, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days', NOW() - INTERVAL '6 hours'),

('hr@mobilefirst.com', 'mobilefirstltd', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Mobile', 'First', '+1-555-0109', 'COMPANY', 'ACTIVE', 'Mobile app development company', 'https://images.example.com/companies/mobilefirst.jpg', 'America/Chicago', 'en', true, true, true, true, NOW() - INTERVAL '75 days', NOW() - INTERVAL '75 days', NOW() - INTERVAL '1 day'),

('jobs@gamestudio.com', 'gamestudiopro', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Game', 'Studio', '+1-555-0110', 'COMPANY', 'ACTIVE', 'Video game development studio', 'https://images.example.com/companies/gamestudio.jpg', 'America/Los_Angeles', 'en', true, true, true, false, NOW() - INTERVAL '100 days', NOW() - INTERVAL '100 days', NOW() - INTERVAL '3 days');

-- Freelancers (30)
INSERT INTO users (email, username, password_hash, first_name, last_name, phone_number, role, status, bio, profile_image_url, timezone, language, is_email_verified, is_phone_verified, email_notifications_enabled, sms_notifications_enabled, terms_accepted_at, privacy_accepted_at, last_login_at)
VALUES
-- Senior Full Stack Developers (3)
('alice.johnson@email.com', 'alice_dev', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Alice', 'Johnson', '+1-555-1001', 'FREELANCER', 'ACTIVE', 'Senior Full-Stack Developer specializing in React, Node.js, and cloud architecture', 'https://images.example.com/freelancers/alice.jpg', 'America/New_York', 'en', true, true, true, true, NOW() - INTERVAL '365 days', NOW() - INTERVAL '365 days', NOW() - INTERVAL '30 minutes'),
('bob.smith@email.com', 'bob_python', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Bob', 'Smith', '+1-555-1002', 'FREELANCER', 'ACTIVE', 'Python/Django expert with 8 years experience in backend development', 'https://images.example.com/freelancers/bob.jpg', 'America/Chicago', 'en', true, false, true, false, NOW() - INTERVAL '300 days', NOW() - INTERVAL '300 days', NOW() - INTERVAL '1 hour'),
('carol.martinez@email.com', 'carol_java', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Carol', 'Martinez', '+1-555-1003', 'FREELANCER', 'ACTIVE', 'Java/Spring Boot architect with microservices expertise', 'https://images.example.com/freelancers/carol.jpg', 'America/Los_Angeles', 'en', true, true, true, false, NOW() - INTERVAL '400 days', NOW() - INTERVAL '400 days', NOW() - INTERVAL '2 hours'),

-- Mobile Developers (3)
('david.lee@email.com', 'david_ios', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'David', 'Lee', '+1-555-1004', 'FREELANCER', 'ACTIVE', 'iOS developer with Swift and SwiftUI mastery', 'https://images.example.com/freelancers/david.jpg', 'America/Los_Angeles', 'en', true, true, true, true, NOW() - INTERVAL '250 days', NOW() - INTERVAL '250 days', NOW() - INTERVAL '15 minutes'),
('emma.wilson@email.com', 'emma_android', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Emma', 'Wilson', '+1-555-1005', 'FREELANCER', 'ACTIVE', 'Android developer specializing in Kotlin and Jetpack Compose', 'https://images.example.com/freelancers/emma.jpg', 'America/New_York', 'en', true, false, true, false, NOW() - INTERVAL '200 days', NOW() - INTERVAL '200 days', NOW() - INTERVAL '45 minutes'),
('frank.garcia@email.com', 'frank_mobile', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Frank', 'Garcia', '+1-555-1006', 'FREELANCER', 'ACTIVE', 'Cross-platform mobile developer using React Native and Flutter', 'https://images.example.com/freelancers/frank.jpg', 'America/Chicago', 'en', true, true, true, true, NOW() - INTERVAL '180 days', NOW() - INTERVAL '180 days', NOW() - INTERVAL '3 hours'),

-- Designers (3)
('grace.chen@email.com', 'grace_designer', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Grace', 'Chen', '+1-555-1007', 'FREELANCER', 'ACTIVE', 'UI/UX designer with expertise in Figma and user research', 'https://images.example.com/freelancers/grace.jpg', 'America/Los_Angeles', 'en', true, true, true, false, NOW() - INTERVAL '150 days', NOW() - INTERVAL '150 days', NOW() - INTERVAL '1 day'),
('henry.brown@email.com', 'henry_graphic', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Henry', 'Brown', '+1-555-1008', 'FREELANCER', 'ACTIVE', 'Graphic designer specializing in branding and visual identity', 'https://images.example.com/freelancers/henry.jpg', 'America/New_York', 'en', true, false, true, false, NOW() - INTERVAL '120 days', NOW() - INTERVAL '120 days', NOW() - INTERVAL '6 hours'),
('isabel.rodriguez@email.com', 'isabel_3d', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Isabel', 'Rodriguez', '+1-555-1009', 'FREELANCER', 'ACTIVE', '3D designer and animator for games and visualization', 'https://images.example.com/freelancers/isabel.jpg', 'America/Chicago', 'en', true, true, true, true, NOW() - INTERVAL '90 days', NOW() - INTERVAL '90 days', NOW() - INTERVAL '12 hours'),

-- DevOps Engineers (2)
('jack.taylor@email.com', 'jack_devops', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Jack', 'Taylor', '+1-555-1010', 'FREELANCER', 'ACTIVE', 'DevOps engineer specializing in AWS, Kubernetes, and CI/CD', 'https://images.example.com/freelancers/jack.jpg', 'America/Los_Angeles', 'en', true, true, true, false, NOW() - INTERVAL '280 days', NOW() - INTERVAL '280 days', NOW() - INTERVAL '2 hours'),
('karen.anderson@email.com', 'karen_cloud', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Karen', 'Anderson', '+1-555-1011', 'FREELANCER', 'ACTIVE', 'Cloud architect with Azure and GCP certifications', 'https://images.example.com/freelancers/karen.jpg', 'America/New_York', 'en', true, false, true, false, NOW() - INTERVAL '220 days', NOW() - INTERVAL '220 days', NOW() - INTERVAL '5 hours'),

-- Data Scientists (2)
('luis.hernandez@email.com', 'luis_datascience', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Luis', 'Hernandez', '+1-555-1012', 'FREELANCER', 'ACTIVE', 'Data scientist with ML and deep learning expertise', 'https://images.example.com/freelancers/luis.jpg', 'America/Chicago', 'en', true, true, true, true, NOW() - INTERVAL '160 days', NOW() - INTERVAL '160 days', NOW() - INTERVAL '8 hours'),
('maria.kim@email.com', 'maria_analytics', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Maria', 'Kim', '+1-555-1013', 'FREELANCER', 'ACTIVE', 'Business intelligence analyst and data visualization expert', 'https://images.example.com/freelancers/maria.jpg', 'America/Los_Angeles', 'en', true, true, true, false, NOW() - INTERVAL '140 days', NOW() - INTERVAL '140 days', NOW() - INTERVAL '1 day'),

-- QA Engineers (2)
('nathan.white@email.com', 'nathan_qa', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Nathan', 'White', '+1-555-1014', 'FREELANCER', 'ACTIVE', 'QA automation engineer with Selenium and Cypress', 'https://images.example.com/freelancers/nathan.jpg', 'America/New_York', 'en', true, false, true, false, NOW() - INTERVAL '110 days', NOW() - INTERVAL '110 days', NOW() - INTERVAL '3 hours'),
('olivia.jones@email.com', 'olivia_tester', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Olivia', 'Jones', '+1-555-1015', 'FREELANCER', 'ACTIVE', 'Manual QA tester with strong attention to detail', 'https://images.example.com/freelancers/olivia.jpg', 'America/Chicago', 'en', true, true, true, true, NOW() - INTERVAL '80 days', NOW() - INTERVAL '80 days', NOW() - INTERVAL '10 hours'),

-- Security Expert (1)
('peter.davis@email.com', 'peter_security', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Peter', 'Davis', '+1-555-1016', 'FREELANCER', 'ACTIVE', 'Cybersecurity specialist and penetration tester', 'https://images.example.com/freelancers/peter.jpg', 'America/Los_Angeles', 'en', true, true, true, false, NOW() - INTERVAL '260 days', NOW() - INTERVAL '260 days', NOW() - INTERVAL '4 hours'),

-- Content Writers (3)
('quinn.miller@email.com', 'quinn_writer', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Quinn', 'Miller', '+1-555-1017', 'FREELANCER', 'ACTIVE', 'Technical writer with software documentation expertise', 'https://images.example.com/freelancers/quinn.jpg', 'America/New_York', 'en', true, false, true, false, NOW() - INTERVAL '70 days', NOW() - INTERVAL '70 days', NOW() - INTERVAL '2 days'),
('rachel.moore@email.com', 'rachel_content', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Rachel', 'Moore', '+1-555-1018', 'FREELANCER', 'ACTIVE', 'Marketing copywriter and content strategist', 'https://images.example.com/freelancers/rachel.jpg', 'America/Chicago', 'en', true, true, true, true, NOW() - INTERVAL '50 days', NOW() - INTERVAL '50 days', NOW() - INTERVAL '18 hours'),
('samuel.taylor@email.com', 'samuel_social', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Samuel', 'Taylor', '+1-555-1019', 'FREELANCER', 'ACTIVE', 'Social media manager and content creator', 'https://images.example.com/freelancers/samuel.jpg', 'America/Los_Angeles', 'en', true, true, true, false, NOW() - INTERVAL '40 days', NOW() - INTERVAL '40 days', NOW() - INTERVAL '5 hours'),

-- Product Manager (1)
('tina.harris@email.com', 'tina_pm', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Tina', 'Harris', '+1-555-1020', 'FREELANCER', 'ACTIVE', 'Product manager with Agile/Scrum certification', 'https://images.example.com/freelancers/tina.jpg', 'America/New_York', 'en', true, false, true, false, NOW() - INTERVAL '130 days', NOW() - INTERVAL '130 days', NOW() - INTERVAL '1 day'),

-- Junior Developers (3)
('uma.patel@email.com', 'uma_junior', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Uma', 'Patel', '+1-555-1021', 'FREELANCER', 'ACTIVE', 'Junior frontend developer learning React and TypeScript', 'https://images.example.com/freelancers/uma.jpg', 'America/Chicago', 'en', true, true, true, true, NOW() - INTERVAL '60 days', NOW() - INTERVAL '60 days', NOW() - INTERVAL '6 hours'),
('victor.santos@email.com', 'victor_entry', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Victor', 'Santos', '+1-555-1022', 'FREELANCER', 'ACTIVE', 'Entry-level data analyst with Python skills', 'https://images.example.com/freelancers/victor.jpg', 'America/Los_Angeles', 'en', true, false, true, false, NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days', NOW() - INTERVAL '12 hours'),
('wendy.clark@email.com', 'wendy_newbie', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Wendy', 'Clark', '+1-555-1023', 'FREELANCER', 'ACTIVE', 'Junior UI designer starting freelance career', 'https://images.example.com/freelancers/wendy.jpg', 'America/New_York', 'en', true, true, true, false, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days', NOW() - INTERVAL '1 hour'),

-- Specialized Experts (7)
('xavier.nguyen@email.com', 'xavier_blockchain', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Xavier', 'Nguyen', '+1-555-1024', 'FREELANCER', 'ACTIVE', 'Blockchain developer specializing in Ethereum and smart contracts', 'https://images.example.com/freelancers/xavier.jpg', 'America/Los_Angeles', 'en', true, true, true, true, NOW() - INTERVAL '190 days', NOW() - INTERVAL '190 days', NOW() - INTERVAL '3 hours'),
('yara.ahmed@email.com', 'yara_ai', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Yara', 'Ahmed', '+1-555-1025', 'FREELANCER', 'ACTIVE', 'AI/ML engineer with NLP and computer vision expertise', 'https://images.example.com/freelancers/yara.jpg', 'America/New_York', 'en', true, false, true, false, NOW() - INTERVAL '170 days', NOW() - INTERVAL '170 days', NOW() - INTERVAL '7 hours'),
('zack.thompson@email.com', 'zack_game', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Zack', 'Thompson', '+1-555-1026', 'FREELANCER', 'ACTIVE', 'Game developer with Unity and Unreal Engine experience', 'https://images.example.com/freelancers/zack.jpg', 'America/Chicago', 'en', true, true, true, false, NOW() - INTERVAL '210 days', NOW() - INTERVAL '210 days', NOW() - INTERVAL '9 hours'),
('amy.wong@email.com', 'amy_architect', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Amy', 'Wong', '+1-555-1027', 'FREELANCER', 'ACTIVE', 'Solutions architect with enterprise system design expertise', 'https://images.example.com/freelancers/amy.jpg', 'America/Los_Angeles', 'en', true, true, true, true, NOW() - INTERVAL '320 days', NOW() - INTERVAL '320 days', NOW() - INTERVAL '2 hours'),
('brian.otoole@email.com', 'brian_video', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Brian', 'O''Toole', '+1-555-1028', 'FREELANCER', 'ACTIVE', 'Video editor and motion graphics designer', 'https://images.example.com/freelancers/brian.jpg', 'America/New_York', 'en', true, false, true, false, NOW() - INTERVAL '95 days', NOW() - INTERVAL '95 days', NOW() - INTERVAL '14 hours'),
('chloe.martin@email.com', 'chloe_legal', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Chloe', 'Martin', '+1-555-1029', 'FREELANCER', 'ACTIVE', 'Legal tech specialist with contract automation expertise', 'https://images.example.com/freelancers/chloe.jpg', 'America/Chicago', 'en', true, true, true, false, NOW() - INTERVAL '105 days', NOW() - INTERVAL '105 days', NOW() - INTERVAL '20 hours'),
('daniel.fischer@email.com', 'daniel_dba', '$2a$10$EIXyXIxaasdasd12312312312312312341234123412341234123412341', 'Daniel', 'Fischer', '+1-555-1030', 'FREELANCER', 'ACTIVE', 'Database administrator with PostgreSQL and MongoDB expertise', 'https://images.example.com/freelancers/daniel.jpg', 'America/Los_Angeles', 'en', true, true, true, true, NOW() - INTERVAL '240 days', NOW() - INTERVAL '240 days', NOW() - INTERVAL '4 hours');

-- =====================================================
-- 5. COMPANIES (Derived from COMPANY users)
-- =====================================================
INSERT INTO companies (user_id, company_name, company_size, industry, website, founded_year, description, logo_url)
SELECT 
    u.id,
    CASE u.username
        WHEN 'techcorp' THEN 'Tech Corporation'
        WHEN 'innovatelab' THEN 'Innovate Labs Inc.'
        WHEN 'designstudio' THEN 'Design Studio Creative'
        WHEN 'fintechsolutions' THEN 'FinTech Solutions LLC'
        WHEN 'healthtechinc' THEN 'HealthTech Inc.'
        WHEN 'ecommercehub' THEN 'ECommerce Hub'
        WHEN 'dataanalytics' THEN 'Data Analytics Corp'
        WHEN 'cloudservices' THEN 'Cloud Services Ltd'
        WHEN 'mobilefirstltd' THEN 'Mobile First Ltd'
        WHEN 'gamestudiopro' THEN 'Game Studio Pro'
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
        WHEN 'techcorp' THEN 2010
        WHEN 'innovatelab' THEN 2018
        WHEN 'designstudio' THEN 2015
        WHEN 'fintechsolutions' THEN 2016
        WHEN 'healthtechinc' THEN 2019
        WHEN 'ecommercehub' THEN 2012
        WHEN 'dataanalytics' THEN 2020
        WHEN 'cloudservices' THEN 2017
        WHEN 'mobilefirstltd' THEN 2021
        WHEN 'gamestudiopro' THEN 2014
    END,
    u.bio,
    u.profile_image_url
FROM users u
WHERE u.role = 'COMPANY';

-- =====================================================
-- 6. FREELANCERS (Derived from FREELANCER users)
-- =====================================================
INSERT INTO freelancers (
    user_id, 
    title, 
    hourly_rate, 
    availability_status, 
    experience_level_id, 
    total_earnings_cents, 
    rating, 
    review_count, 
    success_rate, 
    skills, 
    languages
)
SELECT 
    u.id,
    CASE u.username
        -- Senior developers
        WHEN 'alice_dev' THEN 'Senior Full-Stack Developer'
        WHEN 'bob_python' THEN 'Python Backend Engineer'
        WHEN 'carol_java' THEN 'Java Solutions Architect'
        -- Mobile
        WHEN 'david_ios' THEN 'iOS Developer'
        WHEN 'emma_android' THEN 'Android Developer'
        WHEN 'frank_mobile' THEN 'Cross-Platform Mobile Developer'
        -- Designers
        WHEN 'grace_designer' THEN 'UI/UX Designer'
        WHEN 'henry_graphic' THEN 'Graphic Designer'
        WHEN 'isabel_3d' THEN '3D Designer & Animator'
        -- DevOps
        WHEN 'jack_devops' THEN 'DevOps Engineer'
        WHEN 'karen_cloud' THEN 'Cloud Architect'
        -- Data
        WHEN 'luis_datascience' THEN 'Data Scientist'
        WHEN 'maria_analytics' THEN 'Business Intelligence Analyst'
        -- QA
        WHEN 'nathan_qa' THEN 'QA Automation Engineer'
        WHEN 'olivia_tester' THEN 'Manual QA Tester'
        -- Security
        WHEN 'peter_security' THEN 'Cybersecurity Specialist'
        -- Content
        WHEN 'quinn_writer' THEN 'Technical Writer'
        WHEN 'rachel_content' THEN 'Content Strategist'
        WHEN 'samuel_social' THEN 'Social Media Manager'
        -- PM
        WHEN 'tina_pm' THEN 'Product Manager'
        -- Junior
        WHEN 'uma_junior' THEN 'Junior Frontend Developer'
        WHEN 'victor_entry' THEN 'Entry-Level Data Analyst'
        WHEN 'wendy_newbie' THEN 'Junior UI Designer'
        -- Specialized
        WHEN 'xavier_blockchain' THEN 'Blockchain Developer'
        WHEN 'yara_ai' THEN 'AI/ML Engineer'
        WHEN 'zack_game' THEN 'Game Developer'
        WHEN 'amy_architect' THEN 'Solutions Architect'
        WHEN 'brian_video' THEN 'Video Editor'
        WHEN 'chloe_legal' THEN 'Legal Tech Specialist'
        WHEN 'daniel_dba' THEN 'Database Administrator'
    END,
    CASE u.username
        -- Senior/Lead rates (150-200)
        WHEN 'alice_dev' THEN 150.00
        WHEN 'bob_python' THEN 140.00
        WHEN 'carol_java' THEN 160.00
        WHEN 'david_ios' THEN 135.00
        WHEN 'emma_android' THEN 130.00
        WHEN 'frank_mobile' THEN 145.00
        WHEN 'jack_devops' THEN 155.00
        WHEN 'karen_cloud' THEN 165.00
        WHEN 'luis_datascience' THEN 175.00
        WHEN 'peter_security' THEN 180.00
        WHEN 'amy_architect' THEN 200.00
        WHEN 'xavier_blockchain' THEN 170.00
        WHEN 'yara_ai' THEN 185.00
        WHEN 'zack_game' THEN 140.00
        WHEN 'daniel_dba' THEN 150.00
        -- Mid-level rates (80-120)
        WHEN 'grace_designer' THEN 110.00
        WHEN 'henry_graphic' THEN 95.00
        WHEN 'isabel_3d' THEN 125.00
        WHEN 'maria_analytics' THEN 105.00
        WHEN 'nathan_qa' THEN 100.00
        WHEN 'olivia_tester' THEN 75.00
        WHEN 'quinn_writer' THEN 85.00
        WHEN 'rachel_content' THEN 90.00
        WHEN 'samuel_social' THEN 80.00
        WHEN 'tina_pm' THEN 120.00
        WHEN 'brian_video' THEN 100.00
        WHEN 'chloe_legal' THEN 115.00
        -- Junior rates (50-70)
        WHEN 'uma_junior' THEN 65.00
        WHEN 'victor_entry' THEN 55.00
        WHEN 'wendy_newbie' THEN 50.00
    END,
    CASE u.username
        WHEN 'alice_dev' THEN 'AVAILABLE'
        WHEN 'bob_python' THEN 'AVAILABLE'
        WHEN 'carol_java' THEN 'BUSY'
        WHEN 'david_ios' THEN 'AVAILABLE'
        WHEN 'emma_android' THEN 'AVAILABLE'
        WHEN 'frank_mobile' THEN 'BUSY'
        WHEN 'grace_designer' THEN 'AVAILABLE'
        WHEN 'henry_graphic' THEN 'AVAILABLE'
        WHEN 'isabel_3d' THEN 'AVAILABLE'
        WHEN 'jack_devops' THEN 'BUSY'
        WHEN 'karen_cloud' THEN 'AVAILABLE'
        WHEN 'luis_datascience' THEN 'AVAILABLE'
        WHEN 'maria_analytics' THEN 'AVAILABLE'
        WHEN 'nathan_qa' THEN 'BUSY'
        WHEN 'olivia_tester' THEN 'AVAILABLE'
        WHEN 'peter_security' THEN 'AVAILABLE'
        WHEN 'quinn_writer' THEN 'AVAILABLE'
        WHEN 'rachel_content' THEN 'AVAILABLE'
        WHEN 'samuel_social' THEN 'AVAILABLE'
        WHEN 'tina_pm' THEN 'BUSY'
        WHEN 'uma_junior' THEN 'AVAILABLE'
        WHEN 'victor_entry' THEN 'AVAILABLE'
        WHEN 'wendy_newbie' THEN 'AVAILABLE'
        WHEN 'xavier_blockchain' THEN 'AVAILABLE'
        WHEN 'yara_ai' THEN 'BUSY'
        WHEN 'zack_game' THEN 'AVAILABLE'
        WHEN 'amy_architect' THEN 'AVAILABLE'
        WHEN 'brian_video' THEN 'AVAILABLE'
        WHEN 'chloe_legal' THEN 'AVAILABLE'
        WHEN 'daniel_dba' THEN 'AVAILABLE'
    END,
    (SELECT id FROM experience_levels WHERE code = CASE u.username
        -- Senior/Lead
        WHEN 'alice_dev' THEN 'SENIOR'
        WHEN 'bob_python' THEN 'SENIOR'
        WHEN 'carol_java' THEN 'LEAD'
        WHEN 'david_ios' THEN 'SENIOR'
        WHEN 'jack_devops' THEN 'SENIOR'
        WHEN 'karen_cloud' THEN 'LEAD'
        WHEN 'luis_datascience' THEN 'SENIOR'
        WHEN 'peter_security' THEN 'SENIOR'
        WHEN 'amy_architect' THEN 'LEAD'
        WHEN 'xavier_blockchain' THEN 'SENIOR'
        WHEN 'yara_ai' THEN 'SENIOR'
        WHEN 'daniel_dba' THEN 'SENIOR'
        -- Intermediate
        WHEN 'emma_android' THEN 'INTERMEDIATE'
        WHEN 'frank_mobile' THEN 'INTERMEDIATE'
        WHEN 'grace_designer' THEN 'INTERMEDIATE'
        WHEN 'henry_graphic' THEN 'INTERMEDIATE'
        WHEN 'isabel_3d' THEN 'INTERMEDIATE'
        WHEN 'maria_analytics' THEN 'INTERMEDIATE'
        WHEN 'nathan_qa' THEN 'INTERMEDIATE'
        WHEN 'olivia_tester' THEN 'INTERMEDIATE'
        WHEN 'quinn_writer' THEN 'INTERMEDIATE'
        WHEN 'rachel_content' THEN 'INTERMEDIATE'
        WHEN 'samuel_social' THEN 'INTERMEDIATE'
        WHEN 'tina_pm' THEN 'INTERMEDIATE'
        WHEN 'zack_game' THEN 'INTERMEDIATE'
        WHEN 'brian_video' THEN 'INTERMEDIATE'
        WHEN 'chloe_legal' THEN 'INTERMEDIATE'
        -- Entry
        WHEN 'uma_junior' THEN 'ENTRY'
        WHEN 'victor_entry' THEN 'ENTRY'
        WHEN 'wendy_newbie' THEN 'ENTRY'
    END LIMIT 1),
    CASE u.username
        -- High earners
        WHEN 'alice_dev' THEN 25000000 -- $250k
        WHEN 'bob_python' THEN 18000000 -- $180k
        WHEN 'carol_java' THEN 30000000 -- $300k
        WHEN 'amy_architect' THEN 35000000 -- $350k
        WHEN 'peter_security' THEN 22000000 -- $220k
        -- Mid earners
        WHEN 'david_ios' THEN 15000000
        WHEN 'emma_android' THEN 12000000
        WHEN 'frank_mobile' THEN 14000000
        WHEN 'jack_devops' THEN 20000000
        WHEN 'karen_cloud' THEN 18000000
        WHEN 'luis_datascience' THEN 16000000
        WHEN 'xavier_blockchain' THEN 19000000
        WHEN 'yara_ai' THEN 17000000
        WHEN 'daniel_dba' THEN 13000000
        -- Lower mid
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
        -- Entry level
        WHEN 'uma_junior' THEN 1500000
        WHEN 'victor_entry' THEN 1000000
        WHEN 'wendy_newbie' THEN 800000
    END,
    CASE u.username
        -- Top rated (4.8-4.9)
        WHEN 'alice_dev' THEN 4.9
        WHEN 'carol_java' THEN 4.9
        WHEN 'amy_architect' THEN 4.9
        WHEN 'peter_security' THEN 4.8
        -- High rated (4.6-4.7)
        WHEN 'bob_python' THEN 4.7
        WHEN 'david_ios' THEN 4.7
        WHEN 'jack_devops' THEN 4.8
        WHEN 'karen_cloud' THEN 4.7
        WHEN 'luis_datascience' THEN 4.6
        WHEN 'xavier_blockchain' THEN 4.7
        WHEN 'yara_ai' THEN 4.6
        WHEN 'daniel_dba' THEN 4.7
        -- Good rated (4.4-4.5)
        WHEN 'emma_android' THEN 4.5
        WHEN 'frank_mobile' THEN 4.5
        WHEN 'grace_designer' THEN 4.6
        WHEN 'isabel_3d' THEN 4.5
        WHEN 'maria_analytics' THEN 4.4
        WHEN 'nathan_qa' THEN 4.5
        WHEN 'tina_pm' THEN 4.6
        WHEN 'zack_game' THEN 4.4
        WHEN 'chloe_legal' THEN 4.5
        -- Average rated (4.2-4.3)
        WHEN 'henry_graphic' THEN 4.3
        WHEN 'olivia_tester' THEN 4.2
        WHEN 'quinn_writer' THEN 4.3
        WHEN 'rachel_content' THEN 4.4
        WHEN 'samuel_social' THEN 4.2
        WHEN 'brian_video' THEN 4.3
        -- New/Entry (4.0-4.2)
        WHEN 'uma_junior' THEN 4.1
        WHEN 'victor_entry' THEN 4.0
        WHEN 'wendy_newbie' THEN 4.0
    END,
    CASE u.username
        -- Experienced (50-91 reviews)
        WHEN 'alice_dev' THEN 87
        WHEN 'bob_python' THEN 65
        WHEN 'carol_java' THEN 91
        WHEN 'amy_architect' THEN 78
        WHEN 'peter_security' THEN 52
        -- Mid experience (30-49 reviews)
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
        -- Lower experience (15-29 reviews)
        WHEN 'henry_graphic' THEN 28
        WHEN 'maria_analytics' THEN 25
        WHEN 'nathan_qa' THEN 27
        WHEN 'olivia_tester' THEN 22
        WHEN 'quinn_writer' THEN 24
        WHEN 'rachel_content' THEN 21
        WHEN 'samuel_social' THEN 19
        WHEN 'brian_video' THEN 23
        -- New (5-14 reviews)
        WHEN 'uma_junior' THEN 12
        WHEN 'victor_entry' THEN 8
        WHEN 'wendy_newbie' THEN 5
    END,
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
    CASE u.username
        -- Senior developers
        WHEN 'alice_dev' THEN '["JavaScript", "TypeScript", "React", "Node.js", "MongoDB", "AWS", "Docker", "GraphQL", "REST APIs", "Microservices"]'::jsonb
        WHEN 'bob_python' THEN '["Python", "Django", "PostgreSQL", "Redis", "Celery", "REST APIs", "Docker", "Git", "Linux", "Pytest"]'::jsonb
        WHEN 'carol_java' THEN '["Java", "Spring Boot", "Microservices", "PostgreSQL", "Kubernetes", "Docker", "AWS", "Maven", "JUnit", "REST APIs"]'::jsonb
        -- Mobile
        WHEN 'david_ios' THEN '["Swift", "SwiftUI", "UIKit", "Core Data", "Combine", "Firebase", "REST APIs", "Xcode", "Git", "TestFlight"]'::jsonb
        WHEN 'emma_android' THEN '["Kotlin", "Jetpack Compose", "Android SDK", "Room", "Retrofit", "Firebase", "MVVM", "Git", "JUnit", "Espresso"]'::jsonb
        WHEN 'frank_mobile' THEN '["React Native", "Flutter", "Dart", "JavaScript", "Firebase", "REST APIs", "Redux", "Git", "Expo", "Android Studio"]'::jsonb
        -- Designers
        WHEN 'grace_designer' THEN '["UI/UX Design", "Figma", "Adobe XD", "Sketch", "User Research", "Wireframing", "Prototyping", "Design Systems", "Usability Testing", "HTML/CSS"]'::jsonb
        WHEN 'henry_graphic' THEN '["Adobe Photoshop", "Adobe Illustrator", "InDesign", "Branding", "Logo Design", "Print Design", "Typography", "Color Theory", "Creative Direction", "Figma"]'::jsonb
        WHEN 'isabel_3d' THEN '["Blender", "Maya", "3ds Max", "Cinema 4D", "Unity", "Unreal Engine", "3D Modeling", "Texturing", "Animation", "Rendering"]'::jsonb
        -- DevOps
        WHEN 'jack_devops' THEN '["AWS", "Kubernetes", "Docker", "Jenkins", "Terraform", "Ansible", "CI/CD", "Linux", "Python", "Bash"]'::jsonb
        WHEN 'karen_cloud' THEN '["Azure", "GCP", "AWS", "Kubernetes", "Docker", "Terraform", "Cloud Architecture", "DevOps", "Networking", "Security"]'::jsonb
        -- Data
        WHEN 'luis_datascience' THEN '["Python", "TensorFlow", "PyTorch", "Scikit-learn", "Pandas", "NumPy", "Machine Learning", "Deep Learning", "NLP", "Data Visualization"]'::jsonb
        WHEN 'maria_analytics' THEN '["SQL", "Python", "Tableau", "Power BI", "Excel", "Data Visualization", "ETL", "Data Warehousing", "Business Intelligence", "Statistics"]'::jsonb
        -- QA
        WHEN 'nathan_qa' THEN '["Selenium", "Cypress", "Jest", "Python", "JavaScript", "API Testing", "Test Automation", "CI/CD", "Git", "Postman"]'::jsonb
        WHEN 'olivia_tester' THEN '["Manual Testing", "Test Cases", "Bug Tracking", "Jira", "Regression Testing", "UAT", "Test Plans", "Documentation", "Agile", "SQL"]'::jsonb
        -- Security
        WHEN 'peter_security' THEN '["Penetration Testing", "Vulnerability Assessment", "Network Security", "OWASP", "Security Auditing", "Ethical Hacking", "Burp Suite", "Metasploit", "Python", "Linux"]'::jsonb
        -- Content
        WHEN 'quinn_writer' THEN '["Technical Writing", "Documentation", "API Documentation", "User Guides", "Markdown", "Git", "Software Documentation", "Content Management", "Editing", "Research"]'::jsonb
        WHEN 'rachel_content' THEN '["Content Strategy", "Copywriting", "SEO", "Content Marketing", "Blogging", "Social Media", "Email Marketing", "Google Analytics", "WordPress", "Content Management"]'::jsonb
        WHEN 'samuel_social' THEN '["Social Media Marketing", "Content Creation", "Instagram", "Twitter", "LinkedIn", "Facebook", "Social Media Analytics", "Copywriting", "Graphic Design", "Campaign Management"]'::jsonb
        -- PM
        WHEN 'tina_pm' THEN '["Product Management", "Agile", "Scrum", "Jira", "Product Strategy", "User Stories", "Roadmapping", "Stakeholder Management", "Analytics", "A/B Testing"]'::jsonb
        -- Junior
        WHEN 'uma_junior' THEN '["HTML", "CSS", "JavaScript", "React", "TypeScript", "Git", "Responsive Design", "REST APIs", "npm", "VS Code"]'::jsonb
        WHEN 'victor_entry' THEN '["Python", "SQL", "Excel", "Data Analysis", "Pandas", "NumPy", "Data Visualization", "Jupyter", "Git", "Statistics"]'::jsonb
        WHEN 'wendy_newbie' THEN '["Figma", "Adobe XD", "UI Design", "HTML", "CSS", "Wireframing", "Prototyping", "User Research", "Design Systems", "Responsive Design"]'::jsonb
        -- Specialized
        WHEN 'xavier_blockchain' THEN '["Blockchain", "Ethereum", "Solidity", "Smart Contracts", "Web3.js", "Truffle", "DApp Development", "Cryptocurrency", "JavaScript", "Node.js"]'::jsonb
        WHEN 'yara_ai' THEN '["Machine Learning", "Deep Learning", "NLP", "Computer Vision", "TensorFlow", "PyTorch", "Python", "OpenCV", "Keras", "Data Science"]'::jsonb
        WHEN 'zack_game' THEN '["Unity", "Unreal Engine", "C#", "C++", "Game Design", "3D Modeling", "Animation", "Physics", "Shaders", "Multiplayer"]'::jsonb
        WHEN 'amy_architect' THEN '["System Architecture", "Microservices", "Cloud Architecture", "AWS", "Azure", "Enterprise Design", "API Design", "Scalability", "Security", "DevOps"]'::jsonb
        WHEN 'brian_video' THEN '["Adobe Premiere Pro", "After Effects", "Final Cut Pro", "Video Editing", "Motion Graphics", "Color Grading", "Sound Design", "Animation", "DaVinci Resolve", "Storytelling"]'::jsonb
        WHEN 'chloe_legal' THEN '["Legal Technology", "Contract Automation", "Document Management", "Compliance", "Legal Research", "LegalTech Tools", "Python", "Legal Writing", "Data Privacy", "RegTech"]'::jsonb
        WHEN 'daniel_dba' THEN '["PostgreSQL", "MongoDB", "MySQL", "Database Design", "Performance Tuning", "Backup & Recovery", "Replication", "SQL", "NoSQL", "Database Security"]'::jsonb
    END,
    '["English"]'::jsonb
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
