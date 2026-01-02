-- =====================================================
-- V19: Seed Test Data for Development & Testing
-- Description: Complete seed data with proper relationships
-- WARNING: For development/testing only
-- =====================================================

-- Disable triggers temporarily for faster bulk insert
SET session_replication_role = 'replica';

-- =====================================================
-- STEP 1: Seed Users (Clients and Freelancers)
-- =====================================================

INSERT INTO users (
    email, username, password_hash, full_name, user_type, role,
    bio, location, hourly_rate, skills, experience_years,
    rating_avg, rating_count, email_verified, is_active,
    completion_rate, response_rate,
    created_at, updated_at
)
VALUES 
-- Clients/Employers
('client1@example.com', 'client_john', '$2a$10$randomhashedpassword1', 'John Client', 'EMPLOYER', 'EMPLOYER',
 'Product Manager at Tech Corp', 'San Francisco, CA', NULL, '', 5,
 4.8, 12, true, true, 100.0, 95.0, NOW(), NOW()),
 
('client2@example.com', 'client_sarah', '$2a$10$randomhashedpassword2', 'Sarah Martinez', 'EMPLOYER', 'EMPLOYER',
 'Startup Founder', 'New York, NY', NULL, '', 3,
 4.5, 8, true, true, 98.0, 92.0, NOW(), NOW()),
 
('client3@example.com', 'client_mike', '$2a$10$randomhashedpassword3', 'Mike Johnson', 'EMPLOYER', 'EMPLOYER',
 'Marketing Director', 'Los Angeles, CA', NULL, '', 7,
 4.9, 25, true, true, 99.0, 96.0, NOW(), NOW()),

-- Freelancers
('freelancer1@example.com', 'dev_alice', '$2a$10$randomhashedpassword4', 'Alice Chen', 'FREELANCER', 'FREELANCER',
 'Full-stack developer with 8+ years experience', 'Remote - Seattle', 85.0,
 'JavaScript, React, Node.js, PostgreSQL, Docker', 8,
 4.9, 45, true, true, 99.0, 98.0, NOW(), NOW()),
 
('freelancer2@example.com', 'designer_bob', '$2a$10$randomhashedpassword5', 'Bob Smith', 'FREELANCER', 'FREELANCER',
 'UI/UX Designer - Brand specialist', 'Remote - London', 75.0,
 'Figma, Adobe XD, UI Design, Branding', 6,
 4.7, 32, true, true, 97.0, 95.0, NOW(), NOW()),
 
('freelancer3@example.com', 'dev_carol', '$2a$10$randomhashedpassword6', 'Carol Davis', 'FREELANCER', 'FREELANCER',
 'Python developer & Data analyst', 'Remote - Toronto', 70.0,
 'Python, Django, SQL, Data Analysis, Machine Learning', 5,
 4.6, 28, true, true, 96.0, 94.0, NOW(), NOW()),
 
('freelancer4@example.com', 'writer_diana', '$2a$10$randomhashedpassword7', 'Diana Wilson', 'FREELANCER', 'FREELANCER',
 'Technical writer & Content creator', 'Remote - Dublin', 55.0,
 'Content Writing, SEO, Technical Documentation, Copywriting', 4,
 4.8, 18, true, true, 98.0, 97.0, NOW(), NOW()),
 
('freelancer5@example.com', 'dev_evan', '$2a$10$randomhashedpassword8', 'Evan Moore', 'FREELANCER', 'FREELANCER',
 'Mobile app developer', 'Remote - Sydney', 80.0,
 'Swift, Kotlin, React Native, Mobile Development', 7,
 4.5, 22, true, true, 95.0, 93.0, NOW(), NOW()),
 
('freelancer6@example.com', 'marketing_fiona', '$2a$10$randomhashedpassword9', 'Fiona Lee', 'FREELANCER', 'FREELANCER',
 'Digital marketing specialist', 'Remote - Singapore', 60.0,
 'SEO, Google Ads, Social Media, Analytics', 4,
 4.7, 15, true, true, 97.0, 96.0, NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- STEP 2: Seed Projects
-- =====================================================

DO $$
DECLARE
    v_cat_web_dev_id BIGINT;
    v_cat_mobile_dev_id BIGINT;
    v_cat_data_science_id BIGINT;
    v_cat_design_id BIGINT;
    v_cat_marketing_id BIGINT;
    
    v_client1_id BIGINT;
    v_client2_id BIGINT;
    v_client3_id BIGINT;
BEGIN
    -- Get category IDs
    SELECT id INTO v_cat_web_dev_id FROM project_categories WHERE slug = 'web-development' LIMIT 1;
    SELECT id INTO v_cat_mobile_dev_id FROM project_categories WHERE slug = 'mobile-development' LIMIT 1;
    SELECT id INTO v_cat_data_science_id FROM project_categories WHERE slug = 'data-science' LIMIT 1;
    SELECT id INTO v_cat_design_id FROM project_categories WHERE slug = 'design' LIMIT 1;
    SELECT id INTO v_cat_marketing_id FROM project_categories WHERE slug = 'marketing' LIMIT 1;
    
    -- Get client IDs
    SELECT id INTO v_client1_id FROM users WHERE email = 'client1@example.com';
    SELECT id INTO v_client2_id FROM users WHERE email = 'client2@example.com';
    SELECT id INTO v_client3_id FROM users WHERE email = 'client3@example.com';
    
    -- Insert projects
    INSERT INTO projects (
        client_id, category_id, title, description,
        budget_min, budget_max, budget, budget_type, currency,
        duration, status, required_skills, experience_level,
        project_type, priority_level, visibility,
        created_at, updated_at, published_at
    )
    VALUES 
    -- Project 1: E-commerce Platform
    (v_client1_id, v_cat_web_dev_id,
     'E-commerce Platform Redesign',
     'Complete redesign of existing e-commerce platform with focus on mobile UX and performance optimization',
     12000.00, 18000.00, 15000.00, 'FIXED_PRICE', 'USD',
     12, 'OPEN', ARRAY['UI Design', 'React', 'Web Development', 'UX Research']::text[], 'SENIOR',
     'SINGLE_PROJECT', 'HIGH', 'PUBLIC',
     NOW(), NOW(), NOW()),
    
    -- Project 2: Mobile App
    (v_client2_id, v_cat_mobile_dev_id,
     'Fitness Tracking Mobile App',
     'Native iOS and Android app for fitness tracking with real-time sync and social features',
     20000.00, 30000.00, 25000.00, 'FIXED_PRICE', 'USD',
     16, 'OPEN', ARRAY['Swift', 'Kotlin', 'Mobile Development', 'API Integration']::text[], 'SENIOR',
     'SINGLE_PROJECT', 'HIGH', 'PUBLIC',
     NOW(), NOW(), NOW()),
    
    -- Project 3: AI Chatbot
    (v_client3_id, v_cat_data_science_id,
     'AI Chatbot Integration',
     'Integrate OpenAI ChatGPT into existing customer support system with custom training',
     6000.00, 10000.00, 8000.00, 'FIXED_PRICE', 'USD',
     6, 'IN_PROGRESS', ARRAY['Python', 'API Integration', 'AI/ML', 'NLP']::text[], 'INTERMEDIATE',
     'SINGLE_PROJECT', 'URGENT', 'PUBLIC',
     NOW(), NOW(), NOW()),
    
    -- Project 4: Brand Identity
    (v_client1_id, v_cat_design_id,
     'Complete Brand Identity Design',
     'Create comprehensive brand identity package including logo, color palette, typography, and brand guidelines',
     3000.00, 7000.00, 5000.00, 'FIXED_PRICE', 'USD',
     4, 'OPEN', ARRAY['Graphic Design', 'Branding', 'Illustrator', 'Figma']::text[], 'INTERMEDIATE',
     'SINGLE_PROJECT', 'MEDIUM', 'PUBLIC',
     NOW(), NOW(), NOW()),
    
    -- Project 5: SEO & Content
    (v_client2_id, v_cat_marketing_id,
     'SEO & Content Marketing Strategy',
     'Implement comprehensive SEO strategy and create 50 high-quality blog posts',
     4000.00, 8000.00, 6000.00, 'FIXED_PRICE', 'USD',
     8, 'OPEN', ARRAY['SEO', 'Content Writing', 'Google Analytics', 'Marketing']::text[], 'INTERMEDIATE',
     'ONGOING', 'MEDIUM', 'PUBLIC',
     NOW(), NOW(), NOW())
    ON CONFLICT DO NOTHING;
END $$;

-- =====================================================
-- STEP 3: Seed Job Postings
-- =====================================================

DO $$
DECLARE
    v_cat_software_id BIGINT;
    v_cat_data_science_id BIGINT;
    v_cat_design_id BIGINT;
    v_cat_product_mgmt_id BIGINT;
    v_cat_marketing_id BIGINT;
    
    v_client1_id BIGINT;
    v_client2_id BIGINT;
    v_client3_id BIGINT;
BEGIN
    -- Get job category IDs
    SELECT id INTO v_cat_software_id FROM job_categories WHERE slug = 'software-development' LIMIT 1;
    SELECT id INTO v_cat_data_science_id FROM job_categories WHERE slug = 'data-science' LIMIT 1;
    SELECT id INTO v_cat_design_id FROM job_categories WHERE slug = 'design-ux' LIMIT 1;
    SELECT id INTO v_cat_product_mgmt_id FROM job_categories WHERE slug = 'product-management' LIMIT 1;
    SELECT id INTO v_cat_marketing_id FROM job_categories WHERE slug = 'marketing' LIMIT 1;
    
    -- Get employer IDs
    SELECT id INTO v_client1_id FROM users WHERE email = 'client1@example.com';
    SELECT id INTO v_client2_id FROM users WHERE email = 'client2@example.com';
    SELECT id INTO v_client3_id FROM users WHERE email = 'client3@example.com';
    
    -- Insert job postings
    INSERT INTO jobs (
        employer_id, category_id, title, description,
        job_type, employment_type, experience_level,
        location, city, country, is_remote, remote_type,
        salary_min, salary_max, salary_currency, salary_period, show_salary,
        required_skills, status, positions_available,
        created_at, updated_at, published_at
    )
    VALUES 
    -- Job 1: Senior Backend Engineer
    (v_client1_id, v_cat_software_id,
     'Senior Backend Engineer',
     'We are looking for an experienced backend engineer to build scalable microservices and APIs. You will work on high-traffic systems serving millions of users.',
     'FULL_TIME', 'PERMANENT', 'SENIOR',
     'San Francisco, CA', 'San Francisco', 'United States', false, 'HYBRID',
     120000.00, 160000.00, 'USD', 'ANNUAL', true,
     '["Node.js", "PostgreSQL", "Microservices", "Docker", "Kubernetes"]'::json,
     'OPEN', 2,
     NOW(), NOW(), NOW()),
    
    -- Job 2: Product Designer
    (v_client1_id, v_cat_design_id,
     'Senior Product Designer',
     'Join our design team to create beautiful and intuitive user experiences for our mobile and web applications.',
     'FULL_TIME', 'PERMANENT', 'SENIOR',
     'New York, NY', 'New York', 'United States', false, 'HYBRID',
     100000.00, 140000.00, 'USD', 'ANNUAL', true,
     '["Figma", "UI/UX Design", "Prototyping", "Design Systems"]'::json,
     'OPEN', 1,
     NOW(), NOW(), NOW()),
    
    -- Job 3: Data Scientist
    (v_client2_id, v_cat_data_science_id,
     'Lead Data Scientist',
     'Looking for a data scientist to drive insights and build ML models for our recommendation engine.',
     'FULL_TIME', 'PERMANENT', 'LEAD',
     'Remote', 'Remote', 'United States', true, 'FULLY_REMOTE',
     140000.00, 180000.00, 'USD', 'ANNUAL', true,
     '["Python", "Machine Learning", "TensorFlow", "SQL", "Statistics"]'::json,
     'OPEN', 1,
     NOW(), NOW(), NOW()),
    
    -- Job 4: Frontend Developer (Draft)
    (v_client2_id, v_cat_software_id,
     'Frontend React Developer',
     'Draft position for frontend developer with React expertise.',
     'FULL_TIME', 'PERMANENT', 'INTERMEDIATE',
     'Austin, TX', 'Austin', 'United States', false, 'ON_SITE',
     90000.00, 120000.00, 'USD', 'ANNUAL', true,
     '["React", "TypeScript", "CSS", "Jest"]'::json,
     'DRAFT', 1,
     NOW(), NOW(), NULL),
    
    -- Job 5: Marketing Manager
    (v_client3_id, v_cat_marketing_id,
     'Digital Marketing Manager',
     'Lead our digital marketing efforts including SEO, content, and paid advertising.',
     'FULL_TIME', 'PERMANENT', 'SENIOR',
     'Los Angeles, CA', 'Los Angeles', 'United States', false, 'HYBRID',
     80000.00, 110000.00, 'USD', 'ANNUAL', true,
     '["SEO", "Google Ads", "Content Marketing", "Analytics"]'::json,
     'OPEN', 1,
     NOW(), NOW(), NOW())
    ON CONFLICT DO NOTHING;
END $$;

-- =====================================================
-- STEP 4: Seed Job Applications
-- =====================================================

DO $$
DECLARE
    v_job1_id BIGINT;
    v_job2_id BIGINT;
    v_freelancer1_id BIGINT;
    v_freelancer2_id BIGINT;
BEGIN
    -- Get job IDs
    SELECT id INTO v_job1_id FROM jobs WHERE title = 'Senior Backend Engineer' LIMIT 1;
    SELECT id INTO v_job2_id FROM jobs WHERE title = 'Senior Product Designer' LIMIT 1;
    
    -- Get freelancer IDs
    SELECT id INTO v_freelancer1_id FROM users WHERE email = 'freelancer1@example.com';
    SELECT id INTO v_freelancer2_id FROM users WHERE email = 'freelancer2@example.com';
    
    -- Insert job applications
    IF v_job1_id IS NOT NULL AND v_freelancer1_id IS NOT NULL THEN
        INSERT INTO job_applications (
            job_id, applicant_id, cover_letter, resume_url,
            status, created_at, updated_at
        )
        VALUES (
            v_job1_id, v_freelancer1_id,
            'I am excited to apply for the Senior Backend Engineer position. With 8+ years of experience building scalable systems, I am confident I can contribute immediately to your team.',
            'https://example.com/resume/alice-chen.pdf',
            'SUBMITTED', NOW(), NOW()
        )
        ON CONFLICT (job_id, applicant_id) DO NOTHING;
    END IF;
    
    IF v_job2_id IS NOT NULL AND v_freelancer2_id IS NOT NULL THEN
        INSERT INTO job_applications (
            job_id, applicant_id, cover_letter, portfolio_url,
            status, created_at, updated_at
        )
        VALUES (
            v_job2_id, v_freelancer2_id,
            'I have 6+ years of experience designing user interfaces for web and mobile applications. I would love to bring my expertise to your design team.',
            'https://example.com/portfolio/bob-smith',
            'REVIEWING', NOW(), NOW()
        )
        ON CONFLICT (job_id, applicant_id) DO NOTHING;
    END IF;
END $$;

-- =====================================================
-- STEP 5: Seed Proposals
-- =====================================================

DO $$
DECLARE
    v_project1_id BIGINT;
    v_project2_id BIGINT;
    v_project3_id BIGINT;
    v_freelancer1_id BIGINT;
    v_freelancer2_id BIGINT;
    v_freelancer3_id BIGINT;
BEGIN
    -- Get project IDs
    SELECT id INTO v_project1_id FROM projects WHERE title = 'E-commerce Platform Redesign' LIMIT 1;
    SELECT id INTO v_project2_id FROM projects WHERE title = 'Fitness Tracking Mobile App' LIMIT 1;
    SELECT id INTO v_project3_id FROM projects WHERE title = 'AI Chatbot Integration' LIMIT 1;
    
    -- Get freelancer IDs
    SELECT id INTO v_freelancer1_id FROM users WHERE email = 'freelancer1@example.com';
    SELECT id INTO v_freelancer2_id FROM users WHERE email = 'freelancer2@example.com';
    SELECT id INTO v_freelancer3_id FROM users WHERE email = 'freelancer3@example.com';
    
    -- Insert proposals
    IF v_project1_id IS NOT NULL AND v_freelancer1_id IS NOT NULL THEN
        INSERT INTO proposals (
            project_id, freelancer_id, cover_letter,
            suggested_budget, proposed_timeline, estimated_hours,
            status, created_at, updated_at
        )
        VALUES (
            v_project1_id, v_freelancer1_id,
            'I have extensive experience with e-commerce platforms and can deliver a modern, performant solution.',
            14000.00, '10-12 weeks', 160.00,
            'SUBMITTED', NOW(), NOW()
        )
        ON CONFLICT (project_id, freelancer_id) DO NOTHING;
    END IF;
    
    IF v_project2_id IS NOT NULL AND v_freelancer1_id IS NOT NULL THEN
        INSERT INTO proposals (
            project_id, freelancer_id, cover_letter,
            suggested_budget, proposed_timeline, estimated_hours,
            status, created_at, updated_at
        )
        VALUES (
            v_project2_id, v_freelancer1_id,
            'I specialize in React Native and can build cross-platform mobile apps efficiently.',
            23000.00, '14-16 weeks', 280.00,
            'SHORTLISTED', NOW(), NOW()
        )
        ON CONFLICT (project_id, freelancer_id) DO NOTHING;
    END IF;
    
    IF v_project3_id IS NOT NULL AND v_freelancer3_id IS NOT NULL THEN
        INSERT INTO proposals (
            project_id, freelancer_id, cover_letter,
            suggested_budget, proposed_timeline, estimated_hours,
            status, created_at, updated_at
        )
        VALUES (
            v_project3_id, v_freelancer3_id,
            'I have worked with OpenAI APIs and can integrate ChatGPT into your support system.',
            7500.00, '5-6 weeks', 100.00,
            'ACCEPTED', NOW(), NOW()
        )
        ON CONFLICT (project_id, freelancer_id) DO NOTHING;
    END IF;
END $$;

-- =====================================================
-- STEP 6: Seed Portfolio Items
-- =====================================================

DO $$
DECLARE
    v_freelancer1_id BIGINT;
    v_freelancer2_id BIGINT;
    v_freelancer3_id BIGINT;
    v_freelancer4_id BIGINT;
BEGIN
    -- Get freelancer IDs
    SELECT id INTO v_freelancer1_id FROM users WHERE email = 'freelancer1@example.com';
    SELECT id INTO v_freelancer2_id FROM users WHERE email = 'freelancer2@example.com';
    SELECT id INTO v_freelancer3_id FROM users WHERE email = 'freelancer3@example.com';
    SELECT id INTO v_freelancer4_id FROM users WHERE email = 'freelancer4@example.com';
    
    -- Insert portfolio items
    IF v_freelancer1_id IS NOT NULL THEN
        INSERT INTO portfolio_items (
            user_id, title, description, project_url,
            technologies, display_order, is_visible,
            created_at, updated_at
        )
        VALUES 
        (v_freelancer1_id, 'E-commerce SPA',
         'Single page application for online fashion retailer with 100k+ monthly users',
         'https://example.com/portfolio/ecommerce-spa',
         ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker']::text[],
         1, true, NOW(), NOW()),
        (v_freelancer1_id, 'Real-time Chat Application',
         'WebSocket-based chat with file sharing and video calls',
         'https://example.com/portfolio/chat-app',
         ARRAY['React', 'Socket.io', 'WebRTC', 'MongoDB']::text[],
         2, true, NOW(), NOW())
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF v_freelancer2_id IS NOT NULL THEN
        INSERT INTO portfolio_items (
            user_id, title, description, project_url,
            technologies, display_order, is_visible,
            created_at, updated_at
        )
        VALUES 
        (v_freelancer2_id, 'Brand Identity Package',
         'Complete brand identity for tech startup including logo and guidelines',
         'https://example.com/portfolio/brand-identity',
         ARRAY['Figma', 'Illustrator', 'Branding']::text[],
         1, true, NOW(), NOW())
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF v_freelancer3_id IS NOT NULL THEN
        INSERT INTO portfolio_items (
            user_id, title, description, project_url,
            technologies, display_order, is_visible,
            created_at, updated_at
        )
        VALUES 
        (v_freelancer3_id, 'Data ETL Pipeline',
         'Airflow-based ETL pipeline processing 1M+ records daily',
         'https://example.com/portfolio/etl-pipeline',
         ARRAY['Python', 'Airflow', 'PostgreSQL', 'AWS']::text[],
         1, true, NOW(), NOW())
        ON CONFLICT DO NOTHING;
    END IF;
    
    IF v_freelancer4_id IS NOT NULL THEN
        INSERT INTO portfolio_items (
            user_id, title, description, project_url,
            technologies, display_order, is_visible,
            created_at, updated_at
        )
        VALUES 
        (v_freelancer4_id, 'Technical Documentation Suite',
         'Comprehensive API documentation for SaaS platform',
         'https://example.com/portfolio/tech-docs',
         ARRAY['Markdown', 'Technical Writing', 'API Documentation']::text[],
         1, true, NOW(), NOW())
        ON CONFLICT DO NOTHING;
    END IF;
END $$;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- =====================================================
-- Summary Report
-- =====================================================

SELECT 
    'V19 Seed Data Summary' as info,
    (SELECT COUNT(*) FROM users) as users_count,
    (SELECT COUNT(*) FROM projects) as projects_count,
    (SELECT COUNT(*) FROM jobs) as jobs_count,
    (SELECT COUNT(*) FROM job_applications) as applications_count,
    (SELECT COUNT(*) FROM proposals) as proposals_count,
    (SELECT COUNT(*) FROM portfolio_items) as portfolio_count;
