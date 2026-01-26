-- =====================================================
-- SEED 06: Reviews, Portfolio & Time Tracking
-- Description: User reviews, freelancer portfolios, and time tracking entries
-- Dependencies: contracts, freelancers, users
-- Author: Senior DBA & Principal DB Architect
-- =====================================================
-- Load Order: 6th (After contracts, payments, milestones)
-- =====================================================

-- =====================================================
-- REVIEWS (20 records - for completed contracts)
-- =====================================================
INSERT INTO reviews (
    reviewer_id, reviewed_user_id, contract_id, project_id,
    rating, title, comment, categories, status, is_verified_purchase,
    helpful_count, created_at, updated_at
)
SELECT 
    comp.user_id AS reviewer_id,
    f.user_id AS reviewed_user_id,
    c.id AS contract_id,
    c.project_id,
    CASE (RANDOM() * 10)::INT
        WHEN 0 THEN 4.5
        WHEN 1 THEN 4.0
        WHEN 2 THEN 4.8
        ELSE 5.0
    END AS rating,
    review_data.title AS title,
    review_data.comment AS comment,
    review_data.categories::jsonb AS categories,
    'PUBLISHED' AS status,
    true AS is_verified_purchase,
    (RANDOM() * 20)::INT AS helpful_count,
    COALESCE(c.completed_at, c.created_at) + INTERVAL '2 days' AS created_at,
    COALESCE(c.completed_at, c.created_at) + INTERVAL '3 days' AS updated_at
FROM contracts c
JOIN companies comp ON c.company_id = comp.id
JOIN freelancers f ON c.freelancer_id = f.id
CROSS JOIN LATERAL (VALUES
    ('Excellent Work Quality', 
     'The freelancer delivered exceptional work that exceeded our expectations. Communication was clear and timely throughout the project. Highly professional and would definitely hire again.',
     '{"communication": 5.0, "quality": 5.0, "timeliness": 5.0, "professionalism": 5.0}'),
    ('Great Developer', 
     'Very skilled developer with deep technical expertise. Completed all milestones on time and was proactive in suggesting improvements. Code quality was excellent.',
     '{"communication": 4.5, "quality": 5.0, "timeliness": 5.0, "professionalism": 4.5}'),
    ('Highly Recommended', 
     'Professional, responsive, and delivered high-quality work. Met all requirements and was flexible with changes. Will work with again.',
     '{"communication": 5.0, "quality": 4.5, "timeliness": 4.5, "professionalism": 5.0}'),
    ('Outstanding Results', 
     'The project was completed ahead of schedule with exceptional attention to detail. The freelancer demonstrated strong problem-solving skills.',
     '{"communication": 5.0, "quality": 5.0, "timeliness": 5.0, "professionalism": 5.0}'),
    ('Solid Performance', 
     'Good work overall. There were minor delays but the final deliverable met all requirements. Communication could have been better.',
     '{"communication": 3.5, "quality": 4.5, "timeliness": 4.0, "professionalism": 4.0}')
) AS review_data (title, comment, categories)
WHERE c.status IN ('COMPLETED', 'ACTIVE')
LIMIT 20
ON CONFLICT (contract_id, reviewer_id) DO NOTHING;

-- Add freelancer response to some reviews
UPDATE reviews
SET response_comment = 'Thank you for the positive feedback! It was a pleasure working on this project and I look forward to potential future collaborations.',
    response_at = created_at + INTERVAL '1 day'
WHERE id IN (
    SELECT id FROM reviews 
    WHERE rating >= 4.5 AND RANDOM() < 0.6
    LIMIT 10
);

-- =====================================================
-- PORTFOLIO ITEMS (60+ records - showcase work)
-- =====================================================
INSERT INTO portfolio_items (
    user_id, title, description, image_url, thumbnail_url,
    project_url, github_url, live_url, skills_demonstrated,
    tools_used, technologies, project_category, start_date, end_date,
    display_order, is_visible, created_at, updated_at
)
SELECT 
    f.id AS user_id,
    portfolio_data.title AS title,
    portfolio_data.description AS description,
    'https://images.example.com/portfolio/' || u.username || '/' || portfolio_data.slug || '.jpg' AS image_url,
    'https://images.example.com/portfolio/' || u.username || '/' || portfolio_data.slug || '-thumb.jpg' AS thumbnail_url,
    'https://example.com/projects/' || portfolio_data.slug AS project_url,
    CASE WHEN RANDOM() < 0.5 THEN 'https://github.com/' || u.username || '/' || portfolio_data.slug ELSE NULL END AS github_url,
    CASE WHEN RANDOM() < 0.7 THEN 'https://' || portfolio_data.slug || '.demo.com' ELSE NULL END AS live_url,
    portfolio_data.skills::jsonb AS skills_demonstrated,
    portfolio_data.tools::jsonb AS tools_used,
    portfolio_data.technologies::jsonb AS technologies,
    portfolio_data.category AS project_category,
    NOW() - ((RANDOM() * 365 + 30)::INT || ' days')::INTERVAL AS start_date,
    NOW() - ((RANDOM() * 180)::INT || ' days')::INTERVAL AS end_date,
    ROW_NUMBER() OVER (PARTITION BY f.id ORDER BY RANDOM()) AS display_order,
    true AS is_visible,
    NOW() - ((RANDOM() * 200)::INT || ' days')::INTERVAL AS created_at,
    NOW() - ((RANDOM() * 100)::INT || ' days')::INTERVAL AS updated_at
FROM freelancers f
JOIN users u ON f.user_id = u.id
CROSS JOIN LATERAL (
    SELECT * FROM (VALUES
        ('ecommerce-platform', 'E-Commerce Platform', 
         'Full-stack e-commerce platform with payment integration, inventory management, and admin dashboard. Handled 10k+ daily transactions.',
         '["React", "Node.js", "PostgreSQL", "Payment APIs"]', '["VS Code", "Figma", "Postman"]', 
         '["React", "Node.js", "Express", "PostgreSQL", "Stripe", "AWS"]', 'E-Commerce'),
        ('mobile-fitness-app', 'Fitness Tracking Mobile App',
         'Cross-platform mobile app for fitness tracking with workout plans, progress charts, and social features. 50k+ downloads.',
         '["React Native", "Firebase", "Charts", "Notifications"]', '["VS Code", "Android Studio", "Xcode"]',
         '["React Native", "Firebase", "Redux", "Push Notifications"]', 'Mobile Apps'),
        ('company-dashboard', 'Analytics Dashboard',
         'Real-time analytics dashboard with interactive charts, data export, and custom report builder for enterprise clients.',
         '["React", "D3.js", "WebSocket", "Data Visualization"]', '["VS Code", "Figma"]',
         '["React", "TypeScript", "D3.js", "Chart.js", "WebSocket"]', 'Web Applications'),
        ('healthcare-portal', 'Patient Portal',
         'HIPAA-compliant patient portal with appointment scheduling, medical records access, and telemedicine capabilities.',
         '["React", "Security", "Healthcare", "Real-time"]', '["VS Code", "Postman"]',
         '["React", "Node.js", "WebRTC", "HIPAA Compliance", "PostgreSQL"]', 'Healthcare'),
        ('game-backend', 'Multiplayer Game Backend',
         'Scalable backend for real-time multiplayer mobile game with matchmaking, leaderboards, and in-app purchases.',
         '["Node.js", "WebSocket", "Redis", "Game Development"]', '["VS Code", "Redis Commander"]',
         '["Node.js", "Socket.io", "Redis", "PostgreSQL", "Docker"]', 'Gaming'),
        ('saas-automation', 'Business Automation SaaS',
         'Cloud-based SaaS platform for workflow automation with 500+ integrations and custom workflow builder.',
         '["React", "Node.js", "Automation", "Cloud"]', '["VS Code", "AWS Console"]',
         '["React", "TypeScript", "Node.js", "AWS Lambda", "PostgreSQL", "Kubernetes"]', 'SaaS'),
        ('mobile-banking', 'Mobile Banking Application',
         'Secure mobile banking app with biometric authentication, transaction management, and investment portfolio tracking.',
         '["Swift", "Security", "Finance", "iOS"]', '["Xcode", "Figma"]',
         '["Swift", "SwiftUI", "Alamofire", "CoreData", "Security Framework"]', 'Mobile Apps'),
        ('cms-platform', 'Headless CMS Platform',
         'Flexible headless CMS with GraphQL API, multi-language support, and SEO optimization features.',
         '["GraphQL", "API", "CMS", "Backend"]', '["VS Code", "Postman"]',
         '["Node.js", "GraphQL", "MongoDB", "Elasticsearch", "Docker"]', 'Web Applications'),
        ('design-system', 'Enterprise Design System',
         'Comprehensive design system with 200+ components, documentation, and design tokens for large teams.',
         '["Figma", "Design", "Components", "Systems"]', '["Figma", "Adobe Illustrator"]',
         '["Figma", "Design Tokens", "Component Library", "CSS", "Storybook"]', 'Design'),
        ('ml-recommendation', 'ML Recommendation Engine',
         'Machine learning recommendation engine using collaborative filtering achieving 92% accuracy.',
         '["Python", "Machine Learning", "AI", "Analytics"]', '["Python IDE", "Jupyter"]',
         '["Python", "TensorFlow", "Scikit-learn", "NumPy", "PostgreSQL"]', 'Data Science'),
        ('video-platform', 'Video Streaming Platform',
         'HLS-based video streaming platform with adaptive bitrate, live streaming, and analytics dashboard.',
         '["Video", "Streaming", "Backend", "Real-time"]', '["VS Code", "FFmpeg"]',
         '["Node.js", "HLS.js", "FFmpeg", "Redis", "AWS S3", "Kubernetes"]', 'Web Applications'),
        ('chatbot-ai', 'AI-Powered Chatbot',
         'Natural language processing chatbot handling customer support with 95% satisfaction rate.',
         '["AI", "NLP", "Chatbot", "Customer Support"]', '["Python IDE", "Jupyter"]',
         '["Python", "NLTK", "TensorFlow", "FastAPI", "PostgreSQL"]', 'Data Science'),
        ('crm-system', 'Enterprise CRM System',
         'Full-featured CRM with sales pipeline management, customer analytics, and email integration.',
         '["React", "Node.js", "CRM", "Enterprise"]', '["VS Code", "Figma"]',
         '["React", "TypeScript", "Node.js", "PostgreSQL", "Redis", "Docker"]', 'Web Applications'),
        ('iot-dashboard', 'IoT Monitoring Dashboard',
         'Real-time IoT device monitoring with alerts, historical data analysis, and predictive maintenance.',
         '["IoT", "Real-time", "Monitoring", "Dashboard"]', '["VS Code", "MQTT"]',
         '["React", "Node.js", "MQTT", "MongoDB", "Grafana", "Docker"]', 'IoT'),
        ('document-processor', 'Document Processing Engine',
         'AI-powered document processor extracting data from PDFs with 98% accuracy using OCR and ML.',
         '["AI", "OCR", "Document", "Processing"]', '["Python IDE", "Tesseract"]',
         '["Python", "Tesseract", "PyTorch", "FastAPI", "PostgreSQL"]', 'Data Science'),
        ('collaboration-tool', 'Real-time Collaboration Tool',
         'Browser-based collaboration platform with real-time editing, video conferencing, and file sharing.',
         '["React", "WebRTC", "Real-time", "Collaboration"]', '["VS Code", "Figma"]',
         '["React", "WebRTC", "Socket.io", "Node.js", "MongoDB", "AWS"]', 'Web Applications'),
        ('mobile-ecommerce', 'Mobile E-commerce App',
         'Native iOS and Android e-commerce app with AR product preview and one-click checkout.',
         '["Swift", "Kotlin", "Mobile", "E-commerce"]', '["Xcode", "Android Studio"]',
         '["Swift", "Kotlin", "SwiftUI", "Jetpack Compose", "Firebase", "Stripe"]', 'Mobile Apps'),
        ('devops-platform', 'DevOps Automation Platform',
         'CI/CD and infrastructure automation platform managing 100+ microservices.',
         '["Kubernetes", "DevOps", "CI/CD", "Infrastructure"]', '["Terraform", "Jenkins"]',
         '["Kubernetes", "Docker", "Terraform", "Jenkins", "Ansible", "Prometheus"]', 'DevOps'),
        ('api-gateway', 'Microservices API Gateway',
         'Rate-limited API gateway with authentication, request validation, and load balancing.',
         '["API", "Gateway", "Microservices", "Backend"]', '["VS Code", "Postman"]',
         '["Node.js", "Kong", "PostgreSQL", "Redis", "Docker", "Kubernetes"]', 'Web Applications'),
        ('marketplace-api', 'Marketplace API & Backend',
         'Scalable marketplace backend handling 100k+ daily users with product catalog and order management.',
         '["Node.js", "Backend", "API", "Marketplace"]', '["VS Code", "Postman"]',
         '["Node.js", "Express", "PostgreSQL", "Redis", "Elasticsearch", "AWS"]', 'Web Applications'),
        ('blockchain-wallet', 'Cryptocurrency Wallet',
         'Secure cryptocurrency wallet supporting Bitcoin, Ethereum with hardware wallet integration.',
         '["Blockchain", "Security", "Finance", "Mobile"]', '["Xcode", "Hardhat"]',
         '["Swift", "Web3.js", "Ethers.js", "Security Framework", "SmartContracts"]', 'Blockchain'),
        ('analytics-platform', 'Data Analytics Platform',
         'Self-service analytics platform with 500+ pre-built charts and real-time data processing.',
         '["Data", "Analytics", "BI", "Real-time"]', '["Python IDE", "Tableau"]',
         '["Python", "Spark", "PostgreSQL", "Elasticsearch", "Grafana", "Docker"]', 'Data Science'),
        ('notification-service', 'Push Notification Service',
         'Multi-channel notification service (email, SMS, push) with 99.99% delivery guarantee.',
         '["Backend", "Notifications", "Service", "Infrastructure"]', '["VS Code", "Postman"]',
         '["Node.js", "RabbitMQ", "Redis", "PostgreSQL", "Kafka", "Docker"]', 'Web Applications'),
        ('payment-gateway', 'Payment Gateway Integration',
         'Unified payment gateway supporting 50+ payment methods with fraud detection.',
         '["Payment", "Finance", "Security", "API"]', '["VS Code", "Postman"]',
         '["Node.js", "Express", "PostgreSQL", "Stripe", "PayPal", "Security"]', 'Web Applications'),
        ('project-management', 'Project Management Tool',
         'Agile project management platform with Kanban boards, time tracking, and team collaboration.',
         '["React", "Node.js", "Project Management", "Collaboration"]', '["VS Code", "Figma"]',
         '["React", "TypeScript", "Node.js", "PostgreSQL", "WebSocket", "Docker"]', 'Web Applications')
    ) AS t(slug, title, description, skills, tools, technologies, category)
    ORDER BY RANDOM()
)
WHERE (
    -- Ensure all freelancers get portfolio items with matching skills
    (f.skills::text ILIKE '%React%' OR f.skills::text ILIKE '%Angular%' OR f.skills::text ILIKE '%Vue%')
    OR
    (f.skills::text ILIKE '%Node%' OR f.skills::text ILIKE '%Python%' OR f.skills::text ILIKE '%Java%')
    OR
    (f.skills::text ILIKE '%Mobile%' OR f.skills::text ILIKE '%Swift%' OR f.skills::text ILIKE '%Kotlin%')
    OR
    (f.skills::text ILIKE '%Design%' OR f.skills::text ILIKE '%Figma%' OR f.skills::text ILIKE '%UI%')
    OR
    (f.skills::text ILIKE '%DevOps%' OR f.skills::text ILIKE '%AWS%' OR f.skills::text ILIKE '%Kubernetes%')
    OR
    (f.skills::text ILIKE '%Data%' OR f.skills::text ILIKE '%ML%' OR f.skills::text ILIKE '%Analytics%')
)
LIMIT 100
ON CONFLICT DO NOTHING;

-- Set featured items for highlighted portfolio
UPDATE portfolio_items pi
SET highlight_order = (
    SELECT ROW_NUMBER() OVER (ORDER BY p.id)
    FROM (
        SELECT id FROM portfolio_items WHERE user_id = pi.user_id AND RANDOM() < 0.3
    ) p
    LIMIT 1
)
WHERE id IN (
    SELECT id FROM portfolio_items WHERE RANDOM() < 0.2
);

-- =====================================================
-- TIME ENTRIES (40 records - hourly tracking)
-- =====================================================
WITH time_entry_data AS (
    SELECT 
        c.id AS contract_id,
        c.freelancer_id,
        c.company_id,
        c.start_date,
        comp.user_id AS company_user_id,
        ROW_NUMBER() OVER (PARTITION BY c.id ORDER BY RANDOM()) AS day_offset,
        time_data.description,
        time_data.task_description,
        time_data.work_diary,
        CASE WHEN RANDOM() < 0.7 THEN 'APPROVED' WHEN RANDOM() < 0.85 THEN 'SUBMITTED' ELSE 'DRAFT' END AS status,
        CASE WHEN RANDOM() < 0.7 THEN comp.user_id ELSE NULL END AS approved_by
    FROM contracts c
    JOIN companies comp ON c.company_id = comp.id
    CROSS JOIN LATERAL (VALUES
        ('Backend API Development', 
         'Implemented REST API endpoints for user management and authentication',
         '{"tasks": [{"task": "User registration endpoint", "hours": 2.5, "completed": true}, {"task": "Login authentication", "hours": 3.0, "completed": true}, {"task": "JWT token generation", "hours": 2.5, "completed": true}], "notes": "All endpoints tested and working correctly"}'),
        ('Frontend UI Implementation',
         'Built responsive components for dashboard and user profile pages',
         '{"tasks": [{"task": "Dashboard layout", "hours": 3.0, "completed": true}, {"task": "Profile form components", "hours": 2.5, "completed": true}, {"task": "Responsive design", "hours": 2.5, "completed": true}], "notes": "Components follow design system guidelines"}'),
        ('Database Schema Implementation',
         'Designed and implemented database tables with proper relationships',
         '{"tasks": [{"task": "Entity relationship design", "hours": 2.0, "completed": true}, {"task": "Migration scripts", "hours": 3.0, "completed": true}, {"task": "Seed data creation", "hours": 3.0, "completed": true}], "notes": "Schema optimized for performance"}'),
        ('Testing & Bug Fixes',
         'Wrote unit tests and fixed reported issues',
         '{"tasks": [{"task": "Unit test coverage", "hours": 3.5, "completed": true}, {"task": "Bug fix - login issue", "hours": 2.0, "completed": true}, {"task": "Integration tests", "hours": 2.5, "completed": true}], "notes": "Test coverage at 85%"}'),
        ('Documentation',
         'Created technical documentation and API references',
         '{"tasks": [{"task": "API documentation", "hours": 3.0, "completed": true}, {"task": "Setup guide", "hours": 2.5, "completed": true}, {"task": "Architecture diagrams", "hours": 2.5, "completed": true}], "notes": "Documentation published to wiki"}')
    ) AS time_data (description, task_description, work_diary)
    WHERE c.contract_type = 'FIXED_PRICE' OR c.id <= 5
)
INSERT INTO time_entries (
    contract_id, freelancer_id, date, start_time, end_time,
    hours_logged, description, task_description, work_diary,
    status, approved_by, created_at, updated_at, approved_at
)
SELECT 
    contract_id,
    freelancer_id,
    start_date + (day_offset || ' days')::INTERVAL,
    '09:00:00'::TIME,
    CASE (day_offset % 3) WHEN 0 THEN '17:00:00'::TIME WHEN 1 THEN '18:00:00'::TIME ELSE '16:30:00'::TIME END,
    CASE (day_offset % 3) WHEN 0 THEN 8.0 WHEN 1 THEN 7.5 ELSE 6.5 END,
    description,
    task_description,
    work_diary::jsonb,
    status,
    approved_by,
    start_date + (day_offset || ' days')::INTERVAL,
    start_date + (day_offset || ' days')::INTERVAL + INTERVAL '1 hour',
    CASE WHEN status = 'APPROVED' THEN start_date + (day_offset || ' days')::INTERVAL + INTERVAL '2 days' ELSE NULL END
FROM time_entry_data
LIMIT 40
ON CONFLICT DO NOTHING;

-- =====================================================
-- JOB APPLICATIONS (25 records - applications to jobs)
-- =====================================================
WITH job_application_data AS (
    SELECT 
        j.id AS job_id,
        f.id AS applicant_id,
        u.full_name,
        u.email,
        u.phone,
        u.username,
        j.title AS job_title,
        j.company_name,
        f.experience_years,
        f.skills,
        j.created_at,
        j.category_id,
        ROW_NUMBER() OVER (PARTITION BY j.id ORDER BY f.id) AS app_rank
    FROM jobs j
    CROSS JOIN freelancers f
    JOIN users u ON f.user_id = u.id
    WHERE (
        -- Match software developers to software jobs
        (j.category_id IN (SELECT id FROM job_categories WHERE slug = 'software-development') 
         AND (f.skills::text ILIKE '%React%' OR f.skills::text ILIKE '%Java%' OR f.skills::text ILIKE '%Python%'))
        OR
        -- Match designers to design jobs
        (j.category_id IN (SELECT id FROM job_categories WHERE slug = 'design-creative') 
         AND f.skills::text ILIKE '%design%')
        OR
        -- Match DevOps to infrastructure jobs
        (j.category_id IN (SELECT id FROM job_categories WHERE slug = 'devops-infrastructure') 
         AND (f.skills::text ILIKE '%AWS%' OR f.skills::text ILIKE '%DevOps%'))
        OR
        -- Match data specialists to data jobs
        (j.category_id IN (SELECT id FROM job_categories WHERE slug = 'data-science-analytics') 
         AND (f.skills::text ILIKE '%data%' OR f.skills::text ILIKE '%Machine Learning%'))
        OR
        -- Match QA to QA jobs
        (j.category_id IN (SELECT id FROM job_categories WHERE slug = 'quality-assurance') 
         AND f.skills::text ILIKE '%test%')
    )
)
INSERT INTO job_applications (
    job_id, applicant_id, full_name, email, phone,
    cover_letter, resume_url, portfolio_url, linkedin_url,
    status, applied_at, created_at, updated_at
)
SELECT 
    job_id,
    applicant_id,
    full_name,
    email,
    phone,
    'Dear Hiring Manager, I am writing to express my interest in the ' || job_title || ' position at ' || company_name || 
    '. With ' || COALESCE(experience_years::TEXT, '5') || ' years of experience, I am confident in my ability to contribute to your team. ' ||
    'I have successfully delivered similar projects and am excited about the opportunity to bring my expertise to your organization.' AS cover_letter,
    'https://resumes.example.com/' || username || '-resume.pdf' AS resume_url,
    'https://portfolio.example.com/' || username AS portfolio_url,
    'https://linkedin.com/in/' || username AS linkedin_url,
    CASE 
        WHEN app_rank = 1 THEN 'SHORTLISTED'
        WHEN app_rank = 2 THEN 'REVIEWING'
        ELSE 'SUBMITTED'
    END AS status,
    created_at + ((app_rank::INT || ' days')::INTERVAL) AS applied_at,
    created_at + ((app_rank::INT || ' days')::INTERVAL) AS created_at,
    created_at + (((app_rank + 1)::INT || ' days')::INTERVAL) AS updated_at
FROM job_application_data
WHERE app_rank <= 2
LIMIT 25
ON CONFLICT DO NOTHING;

-- Update applications_count on jobs
UPDATE jobs j
SET applications_count = (
    SELECT COUNT(*) FROM job_applications WHERE job_id = j.id
)
WHERE id IN (SELECT DISTINCT job_id FROM job_applications);

-- Verify insertions
DO $$
BEGIN
    RAISE NOTICE 'Activity data loaded: % reviews, % portfolio items, % time entries, % job applications',
        (SELECT COUNT(*) FROM reviews),
        (SELECT COUNT(*) FROM portfolio_items),
        (SELECT COUNT(*) FROM time_entries),
        (SELECT COUNT(*) FROM job_applications);
END $$;
