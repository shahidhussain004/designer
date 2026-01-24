-- =====================================================
-- SEED DATA: PROJECTS AND JOBS
-- Description: Realistic projects and job postings from companies
-- Date: 2026-01-18
-- =====================================================

-- Disable triggers temporarily for faster insertion
SET session_replication_role = 'replica';

BEGIN;

-- =====================================================
-- 1. PROJECTS (Posted by Companies)
-- =====================================================
-- Get company IDs for reference
DO $$
DECLARE
    v_techcorp_id BIGINT;
    v_innovatelab_id BIGINT;
    v_designstudio_id BIGINT;
    v_fintech_id BIGINT;
    v_healthtech_id BIGINT;
    v_ecommerce_id BIGINT;
    v_dataanalytics_id BIGINT;
    v_cloudservices_id BIGINT;
    v_mobilefirst_id BIGINT;
    v_gamestudio_id BIGINT;
    
    v_web_dev_cat_id BIGINT;
    v_mobile_cat_id BIGINT;
    v_design_cat_id BIGINT;
    v_data_cat_id BIGINT;
    v_devops_cat_id BIGINT;
BEGIN
    -- Get company user IDs
    SELECT id INTO v_techcorp_id FROM users WHERE username = 'techcorp';
    SELECT id INTO v_innovatelab_id FROM users WHERE username = 'innovatelab';
    SELECT id INTO v_designstudio_id FROM users WHERE username = 'designstudio';
    SELECT id INTO v_fintech_id FROM users WHERE username = 'fintechsolutions';
    SELECT id INTO v_healthtech_id FROM users WHERE username = 'healthtechinc';
    SELECT id INTO v_ecommerce_id FROM users WHERE username = 'ecommercehub';
    SELECT id INTO v_dataanalytics_id FROM users WHERE username = 'dataanalytics';
    SELECT id INTO v_cloudservices_id FROM users WHERE username = 'cloudservices';
    SELECT id INTO v_mobilefirst_id FROM users WHERE username = 'mobilefirstltd';
    SELECT id INTO v_gamestudio_id FROM users WHERE username = 'gamestudiopro';
    
    -- Get category IDs
    SELECT id INTO v_web_dev_cat_id FROM project_categories WHERE slug = 'web-development';
    SELECT id INTO v_mobile_cat_id FROM project_categories WHERE slug = 'mobile-apps';
    SELECT id INTO v_design_cat_id FROM project_categories WHERE slug = 'design-projects';
    SELECT id INTO v_data_cat_id FROM project_categories WHERE slug = 'data-analytics';
    SELECT id INTO v_devops_cat_id FROM project_categories WHERE slug = 'devops';
    
    -- Insert Projects
    INSERT INTO projects (
        company_id, category_id, title, description, scope_of_work, 
        budget_type, budget_min_cents, budget_max_cents, currency,
        estimated_duration_days, timeline, project_type, experience_level,
        priority_level, visibility, is_urgent, status, required_skills,
        preferred_skills, apply_instructions, views_count, created_at, published_at
    ) VALUES
    -- TechCorp Projects
    (
        v_techcorp_id, v_web_dev_cat_id,
        'E-Commerce Platform Redesign',
        'We need an experienced full-stack developer to redesign our existing e-commerce platform with modern technologies.',
        'Complete frontend redesign using React, backend API optimization, payment gateway integration, and mobile responsiveness.',
        'RANGE', 8000000, 12000000, 'USD',  -- $80k-$120k
        90, '3-6_MONTHS', 'SINGLE_PROJECT', 'SENIOR',
        'HIGH', 'PUBLIC', false, 'OPEN',
        '["React", "Node.js", "PostgreSQL", "AWS", "Payment Integration", "REST APIs"]'::jsonb,
        '["Redux", "TypeScript", "Docker", "CI/CD"]'::jsonb,
        'Please submit your portfolio with at least 2 similar e-commerce projects.',
        145, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'
    ),
    (
        v_techcorp_id, v_mobile_cat_id,
        'iOS Mobile App Development',
        'Building a native iOS app for our enterprise software suite with offline capabilities.',
        'Develop iOS app with SwiftUI, implement offline sync, integrate with REST APIs, App Store deployment.',
        'FIXED_PRICE', 6000000, 6000000, 'USD',  -- $60k
        60, '2 months', 'FIXED', 'INTERMEDIATE',
        'MEDIUM', 'PUBLIC', false, 'OPEN',
        '["Swift", "SwiftUI", "iOS Development", "Core Data", "REST APIs"]'::jsonb,
        '["Combine", "Unit Testing", "CI/CD"]'::jsonb,
        'Must have App Store published apps in portfolio.',
        89, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'
    ),
    
    -- InnovateLab Projects
    (
        v_innovatelab_id, v_data_cat_id,
        'Machine Learning Model Development',
        'Seeking ML engineer to develop and deploy predictive models for customer churn analysis.',
        'Build ML pipeline, train models using historical data, deploy to production, create monitoring dashboards.',
        'HOURLY', 10000, 15000, 'USD',  -- $100-$150/hr
        45, '6 weeks', 'ONGOING', 'SENIOR',
        'HIGH', 'PUBLIC', true, 'OPEN',
        '["Python", "TensorFlow", "PyTorch", "Machine Learning", "Data Science", "MLOps"]'::jsonb,
        '["Kubernetes", "AWS SageMaker", "Docker"]'::jsonb,
        'Please include examples of deployed ML models.',
        234, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'
    ),
    (
        v_innovatelab_id, v_web_dev_cat_id,
        'SaaS Dashboard Development',
        'Build a comprehensive analytics dashboard for our SaaS product with real-time data visualization.',
        'Create interactive dashboard with charts, real-time updates, user management, and export features.',
        'RANGE', 4000000, 6000000, 'USD',  -- $40k-$60k
        30, '1 month', 'FIXED', 'INTERMEDIATE',
        'MEDIUM', 'PUBLIC', false, 'OPEN',
        '["React", "TypeScript", "D3.js", "WebSocket", "REST APIs"]'::jsonb,
        '["Redux", "Chart.js", "Material-UI"]'::jsonb,
        'Share your dashboard UI/UX work.',
        178, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'
    ),
    
    -- DesignStudio Projects
    (
        v_designstudio_id, v_design_cat_id,
        'Brand Identity & Logo Design',
        'Complete brand identity package for a new fintech startup including logo, color palette, and style guide.',
        'Logo design (3 concepts), brand guidelines, color palette, typography selection, social media templates.',
        'FIXED_PRICE', 500000, 500000, 'USD',  -- $5k
        14, '2 weeks', 'FIXED', 'INTERMEDIATE',
        'MEDIUM', 'PUBLIC', false, 'OPEN',
        '["Graphic Design", "Logo Design", "Branding", "Adobe Illustrator", "Figma"]'::jsonb,
        '["Brand Strategy", "Typography", "Color Theory"]'::jsonb,
        'Portfolio must include at least 5 brand identity projects.',
        92, NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'
    ),
    (
        v_designstudio_id, v_web_dev_cat_id,
        'UI/UX Design for Mobile App',
        'Design complete user interface and experience for a health tracking mobile application.',
        'User research, wireframes, high-fidelity mockups, interactive prototypes, design system.',
        'RANGE', 300000, 500000, 'USD',  -- $3k-$5k
        21, '3 weeks', 'FIXED', 'INTERMEDIATE',
        'HIGH', 'PUBLIC', false, 'OPEN',
        '["UI/UX Design", "Figma", "User Research", "Prototyping", "Mobile Design"]'::jsonb,
        '["Design Systems", "Accessibility", "Usability Testing"]'::jsonb,
        'Must show mobile app design portfolio.',
        156, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'
    ),
    
    -- FinTech Projects
    (
        v_fintech_id, v_web_dev_cat_id,
        'Payment Gateway Integration',
        'Integrate multiple payment providers (Stripe, PayPal, Square) into our financial platform.',
        'API integration, webhook handling, transaction reconciliation, security compliance, testing.',
        'FIXED_PRICE', 3500000, 3500000, 'USD',  -- $35k
        30, '1 month', 'FIXED', 'SENIOR',
        'HIGH', 'PUBLIC', true, 'OPEN',
        '["Payment Integration", "REST APIs", "Node.js", "Security", "Stripe", "PayPal"]'::jsonb,
        '["PCI Compliance", "Webhook Processing", "Error Handling"]'::jsonb,
        'Experience with financial systems required. Background check needed.',
        267, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'
    ),
    (
        v_fintech_id, v_mobile_cat_id,
        'Cross-Platform Mobile Banking App',
        'Develop secure mobile banking application for iOS and Android using React Native.',
        'Account management, transactions, bill payments, biometric authentication, push notifications.',
        'RANGE', 10000000, 15000000, 'USD',  -- $100k-$150k
        120, '4 months', 'FIXED', 'LEAD',
        'HIGH', 'PUBLIC', false, 'OPEN',
        '["React Native", "Mobile Security", "Biometric Auth", "Push Notifications", "REST APIs"]'::jsonb,
        '["Banking Domain", "Compliance", "Testing"]'::jsonb,
        'Must have banking/fintech experience. NDA required.',
        312, NOW() - INTERVAL '25 days', NOW() - INTERVAL '25 days'
    ),
    
    -- HealthTech Projects
    (
        v_healthtech_id, v_web_dev_cat_id,
        'Telemedicine Platform Development',
        'Build HIPAA-compliant telemedicine platform with video calls, appointment scheduling, and EHR integration.',
        'Video consultation, patient portal, doctor dashboard, appointment system, secure messaging, payment processing.',
        'RANGE', 15000000, 20000000, 'USD',  -- $150k-$200k
        150, '5 months', 'FIXED', 'LEAD',
        'HIGH', 'PUBLIC', true, 'OPEN',
        '["Full-Stack Development", "WebRTC", "Video Streaming", "HIPAA Compliance", "Security", "React", "Node.js"]'::jsonb,
        '["Healthcare IT", "EHR Integration", "HL7/FHIR"]'::jsonb,
        'Healthcare IT experience mandatory. HIPAA certification preferred.',
        423, NOW() - INTERVAL '30 days', NOW() - INTERVAL '30 days'
    ),
    (
        v_healthtech_id, v_mobile_cat_id,
        'Health Tracking Mobile App',
        'iOS and Android app for tracking vitals, medications, and health metrics with wearable integration.',
        'Track vitals, medication reminders, data visualization, sync with Apple Health/Google Fit, cloud backup.',
        'FIXED_PRICE', 8000000, 8000000, 'USD',  -- $80k
        90, '3 months', 'FIXED', 'SENIOR',
        'MEDIUM', 'PUBLIC', false, 'OPEN',
        '["Mobile Development", "iOS", "Android", "HealthKit", "Google Fit", "Data Visualization"]'::jsonb,
        '["Wearables Integration", "Cloud Sync", "Security"]'::jsonb,
        'Health app experience required.',
        198, NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days'
    ),
    
    -- ECommerce Hub Projects
    (
        v_ecommerce_id, v_web_dev_cat_id,
        'Marketplace Platform with Multi-Vendor Support',
        'Develop comprehensive marketplace platform supporting multiple vendors with inventory management.',
        'Vendor portals, product management, order processing, payment splits, analytics dashboard, admin panel.',
        'RANGE', 12000000, 18000000, 'USD',  -- $120k-$180k
        120, '4 months', 'FIXED', 'LEAD',
        'HIGH', 'PUBLIC', false, 'IN_PROGRESS',
        '["Full-Stack Development", "Multi-Tenant Architecture", "Payment Processing", "React", "Node.js", "PostgreSQL"]'::jsonb,
        '["E-Commerce Domain", "Scalability", "AWS"]'::jsonb,
        'E-commerce platform experience required.',
        356, NOW() - INTERVAL '45 days', NOW() - INTERVAL '45 days'
    ),
    (
        v_ecommerce_id, v_devops_cat_id,
        'Cloud Infrastructure Setup & DevOps',
        'Set up scalable cloud infrastructure on AWS with CI/CD pipelines and monitoring.',
        'AWS architecture, Kubernetes cluster, CI/CD with Jenkins/GitHub Actions, monitoring with Prometheus/Grafana, security hardening.',
        'HOURLY', 12000, 18000, 'USD',  -- $120-$180/hr
        60, '2 months', 'ONGOING', 'SENIOR',
        'HIGH', 'PUBLIC', false, 'OPEN',
        '["AWS", "Kubernetes", "Docker", "Terraform", "CI/CD", "Monitoring"]'::jsonb,
        '["Security", "Cost Optimization", "Backup & DR"]'::jsonb,
        'AWS certification required.',
        287, NOW() - INTERVAL '22 days', NOW() - INTERVAL '22 days'
    ),
    
    -- Data Analytics Corp Projects
    (
        v_dataanalytics_id, v_data_cat_id,
        'Business Intelligence Dashboard',
        'Create executive BI dashboard with KPI tracking, predictive analytics, and automated reporting.',
        'Data pipeline, ETL processes, interactive dashboards, automated reports, predictive models.',
        'FIXED_PRICE', 7000000, 7000000, 'USD',  -- $70k
        60, '2 months', 'FIXED', 'SENIOR',
        'MEDIUM', 'PUBLIC', false, 'OPEN',
        '["Business Intelligence", "ETL", "Power BI", "SQL", "Data Warehousing", "Python"]'::jsonb,
        '["Tableau", "Data Modeling", "Predictive Analytics"]'::jsonb,
        'BI certification preferred.',
        167, NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days'
    ),
    
    -- Cloud Services Ltd Projects
    (
        v_cloudservices_id, v_devops_cat_id,
        'Multi-Cloud Migration Strategy',
        'Plan and execute migration from on-premise to multi-cloud (AWS + Azure) architecture.',
        'Assessment, migration plan, cloud setup, data migration, application deployment, optimization.',
        'RANGE', 15000000, 25000000, 'USD',  -- $150k-$250k
        180, '6 months', 'FIXED', 'LEAD',
        'HIGH', 'PUBLIC', true, 'OPEN',
        '["Cloud Architecture", "AWS", "Azure", "Migration", "DevOps", "Networking"]'::jsonb,
        '["Security", "Compliance", "Cost Optimization"]'::jsonb,
        'Multi-cloud certification required. Enterprise experience mandatory.',
        445, NOW() - INTERVAL '35 days', NOW() - INTERVAL '35 days'
    ),
    
    -- Mobile First Ltd Projects
    (
        v_mobilefirst_id, v_mobile_cat_id,
        'Social Networking Mobile App',
        'Build social networking app with real-time messaging, content feeds, and media sharing.',
        'User profiles, real-time chat, news feed, media upload, notifications, social features.',
        'RANGE', 10000000, 14000000, 'USD',  -- $100k-$140k
        120, '4 months', 'FIXED', 'SENIOR',
        'HIGH', 'PUBLIC', false, 'OPEN',
        '["Mobile Development", "React Native", "Real-Time Systems", "WebSocket", "Firebase", "Media Processing"]'::jsonb,
        '["Scalability", "Performance", "Push Notifications"]'::jsonb,
        'Social app experience preferred.',
        298, NOW() - INTERVAL '28 days', NOW() - INTERVAL '28 days'
    ),
    
    -- Game Studio Pro Projects
    (
        v_gamestudio_id, v_web_dev_cat_id,
        '3D Character Models for RPG Game',
        'Create high-quality 3D character models with animations for fantasy RPG game.',
        '10 unique characters, rigging, animations (walk, run, attack, idle), textures, optimization for Unity.',
        'FIXED_PRICE', 1500000, 1500000, 'USD',  -- $15k
        45, '6 weeks', 'FIXED', 'INTERMEDIATE',
        'MEDIUM', 'PUBLIC', false, 'OPEN',
        '["3D Modeling", "Blender", "Maya", "Character Design", "Rigging", "Animation", "Unity"]'::jsonb,
        '["Game Art", "Texturing", "UV Mapping"]'::jsonb,
        'Game art portfolio required.',
        134, NOW() - INTERVAL '16 days', NOW() - INTERVAL '16 days'
    ),
    (
        v_gamestudio_id, v_web_dev_cat_id,
        'Unity Game Developer for Mobile Puzzle Game',
        'Develop addictive puzzle game for iOS and Android with 100+ levels and monetization.',
        'Game mechanics, level design, UI/UX, ads integration, in-app purchases, analytics, testing.',
        'RANGE', 5000000, 8000000, 'USD',  -- $50k-$80k
        75, '2.5 months', 'FIXED', 'INTERMEDIATE',
        'MEDIUM', 'PUBLIC', false, 'OPEN',
        '["Unity", "C#", "Mobile Game Development", "Game Design", "Monetization"]'::jsonb,
        '["Ad Integration", "Analytics", "Level Design"]'::jsonb,
        'Published mobile games required in portfolio.',
        203, NOW() - INTERVAL '19 days', NOW() - INTERVAL '19 days'
    );
    
END $$;

COMMIT;

-- Re-enable triggers
SET session_replication_role = 'origin';

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
SELECT 'Projects seed data inserted successfully!' as status;
SELECT 'Total Projects: ' || COUNT(*) as summary FROM projects;
SELECT 'Open Projects: ' || COUNT(*) as summary FROM projects WHERE status = 'OPEN';
SELECT 'Projects by Company' as title;
SELECT c.company_name, COUNT(p.id) as project_count
FROM companies c
LEFT JOIN projects p ON p.company_id = c.user_id
GROUP BY c.company_name
ORDER BY project_count DESC;
