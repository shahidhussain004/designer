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
INSERT INTO job_categories (name, description, icon, parent_id, is_active, display_order)
VALUES
('Software Development', 'Full-time software engineering positions', 'code', NULL, true, 1),
('Design & Creative', 'UI/UX, Graphic Design, Creative roles', 'palette', NULL, true, 2),
('Marketing & Sales', 'Marketing, Sales, Business Development', 'trending-up', NULL, true, 3),
('Data & Analytics', 'Data Science, Analytics, BI', 'database', NULL, true, 4),
('DevOps & Infrastructure', 'Cloud, DevOps, System Administration', 'server', NULL, true, 5),
('Product Management', 'Product Managers, Product Owners', 'package', NULL, true, 6),
('Quality Assurance', 'Testing, QA Engineering', 'check-circle', NULL, true, 7),
('Mobile Development', 'iOS, Android Development', 'smartphone', NULL, true, 8),
('Security', 'Cybersecurity, Infosec', 'shield', NULL, true, 9),
('AI & Machine Learning', 'ML Engineering, AI Research', 'cpu', NULL, true, 10)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 3. PROJECT CATEGORIES (Reference Data)
-- =====================================================
INSERT INTO project_categories (name, description, icon, parent_id, is_active, display_order)
VALUES
('Web Development', 'Website and web application development', 'globe', NULL, true, 1),
('Mobile Apps', 'iOS and Android mobile applications', 'smartphone', NULL, true, 2),
('Design Projects', 'UI/UX, Graphic Design, Branding', 'paintbrush', NULL, true, 3),
('Content Writing', 'Blog posts, technical writing, copywriting', 'edit', NULL, true, 4),
('Marketing Campaigns', 'Digital marketing, SEO, Social Media', 'megaphone', NULL, true, 5),
('Data Analysis', 'Data science, analytics, reporting', 'bar-chart', NULL, true, 6),
('Video & Animation', 'Video editing, motion graphics', 'video', NULL, true, 7),
('Consulting', 'Business consulting, strategy', 'briefcase', NULL, true, 8),
('DevOps Services', 'CI/CD, Infrastructure automation', 'settings', NULL, true, 9),
('API Development', 'REST APIs, GraphQL, integrations', 'zap', NULL, true, 10)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- 4. USERS (Companies + Freelancers)
-- =====================================================

-- Companies (10 companies)
INSERT INTO users (email, username, password_hash, full_name, role, bio, location, phone, profile_image_url, email_verified, identity_verified, is_active, rating_avg, rating_count, created_at, updated_at)
VALUES
('techcorp@example.com', 'techcorp', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'TechCorp Solutions', 'COMPANY', 'Leading enterprise software solutions', 'San Francisco, CA', '+1-415-555-1001', 'https://i.pravatar.cc/150?img=51', true, true, true, 4.8, 52, NOW() - INTERVAL '730 days', NOW()),
('innovatelab@example.com', 'innovatelab', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'InnovateLab Inc', 'COMPANY', 'AI and ML research company', 'Boston, MA', '+1-617-555-1002', 'https://i.pravatar.cc/150?img=52', true, true, true, 4.9, 67, NOW() - INTERVAL '650 days', NOW()),
('designstudio@example.com', 'designstudio', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Creative Design Studio', 'COMPANY', 'Premium design agency', 'New York, NY', '+1-212-555-1003', 'https://i.pravatar.cc/150?img=53', true, true, true, 4.7, 45, NOW() - INTERVAL '580 days', NOW()),
('fintech@example.com', 'fintech', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'FinTech Dynamics', 'COMPANY', 'Financial technology solutions', 'Seattle, WA', '+1-206-555-1004', 'https://i.pravatar.cc/150?img=54', true, true, true, 4.6, 38, NOW() - INTERVAL '500 days', NOW()),
('healthtech@example.com', 'healthtech', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'HealthTech Partners', 'COMPANY', 'Healthcare software and services', 'Austin, TX', '+1-512-555-1005', 'https://i.pravatar.cc/150?img=55', true, false, true, 4.5, 29, NOW() - INTERVAL '450 days', NOW()),
('ecommerce@example.com', 'ecommerce', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'E-Commerce Pro', 'COMPANY', 'Online retail platform', 'Los Angeles, CA', '+1-323-555-1006', 'https://i.pravatar.cc/150?img=56', true, true, true, 4.4, 31, NOW() - INTERVAL '420 days', NOW()),
('startupventure@example.com', 'startupventure', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Startup Ventures', 'COMPANY', 'Early-stage startup accelerator', 'Denver, CO', '+1-303-555-1007', 'https://i.pravatar.cc/150?img=57', true, true, true, 4.7, 42, NOW() - INTERVAL '380 days', NOW()),
('cloudservices@example.com', 'cloudservices', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'CloudServices Global', 'COMPANY', 'Cloud infrastructure provider', 'Portland, OR', '+1-503-555-1008', 'https://i.pravatar.cc/150?img=58', true, true, true, 4.8, 55, NOW() - INTERVAL '600 days', NOW()),
('dataanalytics@example.com', 'dataanalytics', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Data Analytics Corp', 'COMPANY', 'Big data and analytics', 'Chicago, IL', '+1-312-555-1009', 'https://i.pravatar.cc/150?img=59', true, true, true, 4.6, 48, NOW() - INTERVAL '550 days', NOW()),
('cybersec@example.com', 'cybersec', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'CyberSec Solutions', 'COMPANY', 'Cybersecurity consulting', 'Washington, DC', '+1-202-555-1010', 'https://i.pravatar.cc/150?img=60', true, true, true, 4.9, 61, NOW() - INTERVAL '700 days', NOW());

-- Freelancers (30 freelancers for diverse scenarios)
INSERT INTO users (email, username, password_hash, full_name, role, bio, location, phone, profile_image_url, email_verified, identity_verified, is_active, rating_avg, rating_count, created_at, updated_at)
VALUES
-- Senior Full-Stack Developers
('alice.johnson@example.com', 'alice_johnson', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Alice Johnson', 'FREELANCER', 'Senior Full-Stack Developer specializing in React and Node.js', 'Remote - US', '+1-555-2001', 'https://i.pravatar.cc/150?img=1', true, true, true, 4.9, 87, NOW() - INTERVAL '900 days', NOW()),
('bob.smith@example.com', 'bob_smith', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Bob Smith', 'FREELANCER', 'Expert Python Backend Developer with Django/FastAPI', 'Remote - Canada', '+1-555-2002', 'https://i.pravatar.cc/150?img=2', true, true, true, 4.8, 72, NOW() - INTERVAL '800 days', NOW()),
('carol.martinez@example.com', 'carol_martinez', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Carol Martinez', 'FREELANCER', 'Java Spring Boot Architect', 'Remote - Mexico', '+52-555-2003', 'https://i.pravatar.cc/150?img=3', true, true, true, 4.7, 65, NOW() - INTERVAL '750 days', NOW()),

-- Mobile Developers
('david.lee@example.com', 'david_lee', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'David Lee', 'FREELANCER', 'iOS Developer (Swift, SwiftUI)', 'Remote - South Korea', '+82-555-2004', 'https://i.pravatar.cc/150?img=4', true, true, true, 4.8, 54, NOW() - INTERVAL '700 days', NOW()),
('emma.wilson@example.com', 'emma_wilson', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Emma Wilson', 'FREELANCER', 'Android Developer (Kotlin, Jetpack Compose)', 'Remote - UK', '+44-555-2005', 'https://i.pravatar.cc/150?img=5', true, true, true, 4.9, 68, NOW() - INTERVAL '680 days', NOW()),
('frank.garcia@example.com', 'frank_garcia', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Frank Garcia', 'FREELANCER', 'React Native Cross-Platform Developer', 'Remote - Spain', '+34-555-2006', 'https://i.pravatar.cc/150?img=6', true, false, true, 4.6, 45, NOW() - INTERVAL '600 days', NOW()),

-- Design & Creative
('grace.chen@example.com', 'grace_chen', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Grace Chen', 'FREELANCER', 'Senior UI/UX Designer with 8 years experience', 'Remote - Singapore', '+65-555-2007', 'https://i.pravatar.cc/150?img=7', true, true, true, 4.9, 91, NOW() - INTERVAL '850 days', NOW()),
('henry.brown@example.com', 'henry_brown', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Henry Brown', 'FREELANCER', 'Graphic Designer & Brand Strategist', 'Remote - Australia', '+61-555-2008', 'https://i.pravatar.cc/150?img=8', true, true, true, 4.7, 58, NOW() - INTERVAL '720 days', NOW()),
('isabel.rodriguez@example.com', 'isabel_rodriguez', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Isabel Rodriguez', 'FREELANCER', '3D Artist & Motion Graphics Designer', 'Remote - Argentina', '+54-555-2009', 'https://i.pravatar.cc/150?img=9', true, true, true, 4.8, 47, NOW() - INTERVAL '650 days', NOW()),

-- DevOps & Infrastructure
('jack.taylor@example.com', 'jack_taylor', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Jack Taylor', 'FREELANCER', 'DevOps Engineer (AWS, Kubernetes, Terraform)', 'Remote - Germany', '+49-555-2010', 'https://i.pravatar.cc/150?img=10', true, true, true, 4.9, 73, NOW() - INTERVAL '780 days', NOW()),
('karen.anderson@example.com', 'karen_anderson', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Karen Anderson', 'FREELANCER', 'Cloud Architect (Azure, GCP)', 'Remote - Netherlands', '+31-555-2011', 'https://i.pravatar.cc/150?img=11', true, true, true, 4.8, 62, NOW() - INTERVAL '700 days', NOW()),

-- Data Science & Analytics
('luis.hernandez@example.com', 'luis_hernandez', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Luis Hernandez', 'FREELANCER', 'Data Scientist (Python, ML, Deep Learning)', 'Remote - Chile', '+56-555-2012', 'https://i.pravatar.cc/150?img=12', true, true, true, 4.7, 56, NOW() - INTERVAL '670 days', NOW()),
('maria.kim@example.com', 'maria_kim', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Maria Kim', 'FREELANCER', 'Business Intelligence Analyst', 'Remote - Japan', '+81-555-2013', 'https://i.pravatar.cc/150?img=13', true, false, true, 4.6, 41, NOW() - INTERVAL '620 days', NOW()),

-- QA & Testing
('nathan.white@example.com', 'nathan_white', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Nathan White', 'FREELANCER', 'QA Automation Engineer (Selenium, Cypress)', 'Remote - Ireland', '+353-555-2014', 'https://i.pravatar.cc/150?img=14', true, true, true, 4.8, 64, NOW() - INTERVAL '690 days', NOW()),
('olivia.jones@example.com', 'olivia_jones', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Olivia Jones', 'FREELANCER', 'Manual QA Specialist', 'Remote - New Zealand', '+64-555-2015', 'https://i.pravatar.cc/150?img=15', true, true, true, 4.5, 38, NOW() - INTERVAL '580 days', NOW()),

-- Security
('peter.davis@example.com', 'peter_davis', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Peter Davis', 'FREELANCER', 'Cybersecurity Consultant & Penetration Tester', 'Remote - Switzerland', '+41-555-2016', 'https://i.pravatar.cc/150?img=16', true, true, true, 4.9, 82, NOW() - INTERVAL '820 days', NOW()),

-- Content & Marketing
('quinn.miller@example.com', 'quinn_miller', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Quinn Miller', 'FREELANCER', 'Technical Writer & Documentation Specialist', 'Remote - Belgium', '+32-555-2017', 'https://i.pravatar.cc/150?img=17', true, true, true, 4.7, 52, NOW() - INTERVAL '640 days', NOW()),
('rachel.moore@example.com', 'rachel_moore', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Rachel Moore', 'FREELANCER', 'Digital Marketing Specialist (SEO, SEM)', 'Remote - France', '+33-555-2018', 'https://i.pravatar.cc/150?img=18', true, true, true, 4.6, 46, NOW() - INTERVAL '610 days', NOW()),
('samuel.taylor@example.com', 'samuel_taylor', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Samuel Taylor', 'FREELANCER', 'Content Creator & Social Media Manager', 'Remote - Portugal', '+351-555-2019', 'https://i.pravatar.cc/150?img=19', true, false, true, 4.5, 35, NOW() - INTERVAL '560 days', NOW()),

-- Product Management
('tina.harris@example.com', 'tina_harris', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Tina Harris', 'FREELANCER', 'Senior Product Manager (Agile, Scrum)', 'Remote - Sweden', '+46-555-2020', 'https://i.pravatar.cc/150?img=20', true, true, true, 4.8, 67, NOW() - INTERVAL '720 days', NOW()),

-- Junior/Entry Level (for diverse scenarios)
('uma.patel@example.com', 'uma_patel', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Uma Patel', 'FREELANCER', 'Junior Frontend Developer learning React', 'Remote - India', '+91-555-2021', 'https://i.pravatar.cc/150?img=21', true, true, true, 4.3, 15, NOW() - INTERVAL '180 days', NOW()),
('victor.santos@example.com', 'victor_santos', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Victor Santos', 'FREELANCER', 'Entry-Level Data Analyst', 'Remote - Brazil', '+55-555-2022', 'https://i.pravatar.cc/150?img=22', true, false, true, 4.2, 12, NOW() - INTERVAL '150 days', NOW()),
('wendy.clark@example.com', 'wendy_clark', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Wendy Clark', 'FREELANCER', 'Junior Graphic Designer', 'Remote - Philippines', '+63-555-2023', 'https://i.pravatar.cc/150?img=23', true, true, true, 4.4, 18, NOW() - INTERVAL '200 days', NOW()),

-- Specialized Skills
('xavier.nguyen@example.com', 'xavier_nguyen', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Xavier Nguyen', 'FREELANCER', 'Blockchain Developer (Ethereum, Solidity)', 'Remote - Vietnam', '+84-555-2024', 'https://i.pravatar.cc/150?img=24', true, true, true, 4.7, 39, NOW() - INTERVAL '520 days', NOW()),
('yara.ahmed@example.com', 'yara_ahmed', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Yara Ahmed', 'FREELANCER', 'AI/ML Engineer (TensorFlow, PyTorch)', 'Remote - Egypt', '+20-555-2025', 'https://i.pravatar.cc/150?img=25', true, true, true, 4.8, 51, NOW() - INTERVAL '630 days', NOW()),
('zack.thompson@example.com', 'zack_thompson', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Zack Thompson', 'FREELANCER', 'Game Developer (Unity, Unreal Engine)', 'Remote - Poland', '+48-555-2026', 'https://i.pravatar.cc/150?img=26', true, true, true, 4.6, 44, NOW() - INTERVAL '590 days', NOW()),

-- Additional Senior Specialists
('amy.wong@example.com', 'amy_wong', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Amy Wong', 'FREELANCER', 'Solutions Architect (Enterprise Systems)', 'Remote - Malaysia', '+60-555-2027', 'https://i.pravatar.cc/150?img=27', true, true, true, 4.9, 76, NOW() - INTERVAL '760 days', NOW()),
('brian.otoole@example.com', 'brian_otoole', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', "Brian O'Toole", 'FREELANCER', 'Video Editor & Post-Production Specialist', 'Remote - Austria', '+43-555-2028', 'https://i.pravatar.cc/150?img=28', true, true, true, 4.7, 55, NOW() - INTERVAL '660 days', NOW()),
('chloe.martin@example.com', 'chloe_martin', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Chloe Martin', 'FREELANCER', 'Legal Tech Consultant', 'Remote - Denmark', '+45-555-2029', 'https://i.pravatar.cc/150?img=29', true, false, true, 4.5, 33, NOW() - INTERVAL '540 days', NOW()),
('daniel.fischer@example.com', 'daniel_fischer', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5e/1yDhWC76K6', 'Daniel Fischer', 'FREELANCER', 'Database Administrator (PostgreSQL, MySQL)', 'Remote - Czech Republic', '+420-555-2030', 'https://i.pravatar.cc/150?img=30', true, true, true, 4.8, 69, NOW() - INTERVAL '710 days', NOW());

-- =====================================================
-- 5. COMPANIES TABLE
-- =====================================================
INSERT INTO companies (user_id, company_name, company_type, industry, website_url, company_size, registration_number, tax_id, phone, headquarters_location, total_projects_posted, total_spent_cents, created_at, updated_at)
SELECT 
    u.id,
    u.full_name,
    CASE 
        WHEN u.id % 3 = 0 THEN 'STARTUP'
        WHEN u.id % 3 = 1 THEN 'CORPORATION'
        ELSE 'LLC'
    END,
    CASE 
        WHEN u.username = 'techcorp' THEN 'Technology'
        WHEN u.username = 'innovatelab' THEN 'Research'
        WHEN u.username = 'designstudio' THEN 'Creative Services'
        WHEN u.username = 'fintech' THEN 'Financial Services'
        WHEN u.username = 'healthtech' THEN 'Healthcare'
        WHEN u.username = 'ecommerce' THEN 'E-Commerce'
        WHEN u.username = 'startupventure' THEN 'Venture Capital'
        WHEN u.username = 'cloudservices' THEN 'Cloud Computing'
        WHEN u.username = 'dataanalytics' THEN 'Analytics'
        ELSE 'Cybersecurity'
    END,
    'https://' || u.username || '.example.com',
    CASE 
        WHEN u.id % 4 = 0 THEN 'LARGE'
        WHEN u.id % 4 = 1 THEN 'MEDIUM'
        WHEN u.id % 4 = 2 THEN 'SMALL'
        ELSE 'STARTUP'
    END,
    'REG-' || LPAD(u.id::TEXT, 8, '0'),
    'TAX-' || LPAD((u.id * 1000)::TEXT, 10, '0'),
    u.phone,
    u.location,
    FLOOR(RANDOM() * 30 + 5)::INTEGER,
    FLOOR(RANDOM() * 50000000 + 5000000)::BIGINT,
    u.created_at,
    u.updated_at
FROM users u
WHERE u.role = 'COMPANY';

-- =====================================================
-- 6. FREELANCERS TABLE
-- =====================================================
INSERT INTO freelancers (user_id, hourly_rate_cents, experience_years, headline, portfolio_url, github_url, linkedin_url, skills, certifications, languages, completion_rate, response_rate, response_time_hours, total_earnings_cents, total_projects_completed, created_at, updated_at)
SELECT 
    u.id,
    CASE 
        WHEN u.rating_avg >= 4.8 THEN (12000 + FLOOR(RANDOM() * 8000))::INTEGER
        WHEN u.rating_avg >= 4.5 THEN (8000 + FLOOR(RANDOM() * 4000))::INTEGER
        ELSE (5000 + FLOOR(RANDOM() * 3000))::INTEGER
    END,
    CASE 
        WHEN u.rating_count > 70 THEN 8 + FLOOR(RANDOM() * 7)
        WHEN u.rating_count > 40 THEN 4 + FLOOR(RANDOM() * 4)
        ELSE 1 + FLOOR(RANDOM() * 2)
    END,
    SUBSTRING(u.bio FROM 1 FOR 80),
    'https://portfolio-' || u.username || '.com',
    'https://github.com/' || u.username,
    'https://linkedin.com/in/' || u.username,
    CASE 
        WHEN u.username LIKE '%johnson%' THEN '["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"]'::jsonb
        WHEN u.username LIKE '%smith%' THEN '["Python", "Django", "FastAPI", "PostgreSQL", "Docker"]'::jsonb
        WHEN u.username LIKE '%martinez%' THEN '["Java", "Spring Boot", "Microservices", "Kubernetes"]'::jsonb
        WHEN u.username LIKE '%lee%' THEN '["Swift", "SwiftUI", "iOS", "Xcode", "Firebase"]'::jsonb
        WHEN u.username LIKE '%wilson%' THEN '["Kotlin", "Android", "Jetpack Compose", "Firebase"]'::jsonb
        WHEN u.username LIKE '%garcia%' THEN '["React Native", "JavaScript", "Mobile", "Redux"]'::jsonb
        WHEN u.username LIKE '%chen%' THEN '["UI/UX", "Figma", "Adobe XD", "Prototyping", "User Research"]'::jsonb
        WHEN u.username LIKE '%brown%' THEN '["Graphic Design", "Adobe Suite", "Branding", "Illustration"]'::jsonb
        WHEN u.username LIKE '%rodriguez%' THEN '["3D Modeling", "Blender", "After Effects", "Animation"]'::jsonb
        WHEN u.username LIKE '%taylor%' THEN '["AWS", "Kubernetes", "Terraform", "CI/CD", "Docker"]'::jsonb
        WHEN u.username LIKE '%anderson%' THEN '["Azure", "GCP", "Cloud Architecture", "DevOps"]'::jsonb
        WHEN u.username LIKE '%hernandez%' THEN '["Python", "Machine Learning", "TensorFlow", "Data Science"]'::jsonb
        WHEN u.username LIKE '%kim%' THEN '["SQL", "Power BI", "Tableau", "Data Analysis"]'::jsonb
        WHEN u.username LIKE '%white%' THEN '["Selenium", "Cypress", "Jest", "Test Automation"]'::jsonb
        WHEN u.username LIKE '%jones%' THEN '["Manual Testing", "QA", "Test Plans", "Bug Tracking"]'::jsonb
        WHEN u.username LIKE '%davis%' THEN '["Cybersecurity", "Penetration Testing", "Security Audits"]'::jsonb
        WHEN u.username LIKE '%miller%' THEN '["Technical Writing", "Documentation", "API Docs"]'::jsonb
        WHEN u.username LIKE '%moore%' THEN '["SEO", "SEM", "Google Analytics", "Digital Marketing"]'::jsonb
        WHEN u.username LIKE '%harris%' THEN '["Product Management", "Agile", "Scrum", "Roadmapping"]'::jsonb
        WHEN u.username LIKE '%nguyen%' THEN '["Blockchain", "Ethereum", "Solidity", "Web3"]'::jsonb
        WHEN u.username LIKE '%ahmed%' THEN '["AI/ML", "TensorFlow", "PyTorch", "Deep Learning"]'::jsonb
        WHEN u.username LIKE '%thompson%' THEN '["Unity", "Unreal Engine", "C#", "Game Development"]'::jsonb
        WHEN u.username LIKE '%wong%' THEN '["Solution Architecture", "Enterprise Systems", "Microservices"]'::jsonb
        WHEN u.username LIKE '%otoole%' THEN '["Video Editing", "Premiere Pro", "After Effects"]'::jsonb
        WHEN u.username LIKE '%fischer%' THEN '["PostgreSQL", "MySQL", "Database Design", "Performance Tuning"]'::jsonb
        ELSE '["JavaScript", "HTML", "CSS", "Git"]'::jsonb
    END,
    CASE 
        WHEN u.rating_avg >= 4.7 THEN '["AWS Certified", "Scrum Master"]'::jsonb
        ELSE '[]'::jsonb
    END,
    '[{"language":"English","proficiency":"native"}]'::jsonb,
    (88 + RANDOM() * 12)::NUMERIC,
    (85 + RANDOM() * 15)::NUMERIC,
    (1 + FLOOR(RANDOM() * 12))::INTEGER,
    CASE 
        WHEN u.rating_count > 70 THEN FLOOR(RANDOM() * 10000000 + 5000000)::BIGINT
        WHEN u.rating_count > 40 THEN FLOOR(RANDOM() * 5000000 + 1000000)::BIGINT
        ELSE FLOOR(RANDOM() * 1000000 + 100000)::BIGINT
    END,
    u.rating_count,
    u.created_at,
    u.updated_at
FROM users u
WHERE u.role = 'FREELANCER';

COMMIT;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- Display summary
SELECT 'Seed data inserted successfully!' as status;
SELECT 'Users: ' || COUNT(*) as summary FROM users;
SELECT 'Companies: ' || COUNT(*) as summary FROM companies;
SELECT 'Freelancers: ' || COUNT(*) as summary FROM freelancers;
SELECT 'Experience Levels: ' || COUNT(*) as summary FROM experience_levels;
SELECT 'Job Categories: ' || COUNT(*) as summary FROM job_categories;
SELECT 'Project Categories: ' || COUNT(*) as summary FROM project_categories;
