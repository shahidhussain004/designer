-- =====================================================
-- SEED 03: Jobs & Projects (FIXED NORMALIZED SCHEMA)
-- Description: Job postings and freelance projects
-- Dependencies: companies (FK), freelancers (FK), job_categories, project_categories, experience_levels
-- Author: Senior DBA Architect (NORMALIZED SCHEMA VERSION)
-- =====================================================
-- Load Order: 3rd (After users, companies, freelancers, reference data)
-- NOTE: Company details are retrieved from companies table via FK - NO DENORMALIZATION
-- =====================================================

-- =====================================================
-- TRADITIONAL JOB POSTINGS (15 records)
-- =====================================================
INSERT INTO jobs (
    company_id, category_id, title, description, responsibilities, requirements,
    job_type, experience_level, location, city, state, country, is_remote, remote_type,
    salary_min_cents, salary_max_cents, salary_currency, salary_period, show_salary,
    required_skills, preferred_skills, education_level, positions_available,
    status, views_count, applications_count, created_at, published_at
) VALUES
-- TechCorp Jobs
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'techcorp')),
    (SELECT id FROM job_categories WHERE name = 'Software Development'),
    'Senior Full Stack Engineer',
    'Join our engineering team to build scalable web applications using modern technologies.',
    'Design and develop RESTful APIs, Build responsive UIs with React, Implement CI/CD pipelines, Mentor junior developers',
    'Bachelor''s degree in Computer Science or equivalent, 5+ years full-stack experience, Strong React and Node.js skills, Experience with AWS and Docker',
    'FULL_TIME', 'SENIOR', 'New York', 'New York', 'NY', 'USA', true, 'HYBRID',
    12000000, 18000000, 'USD', 'ANNUAL', true,
    '["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker"]'::jsonb,
    '["Redux", "GraphQL", "Kubernetes", "Microservices"]'::jsonb,
    'BACHELOR', 2,
    'OPEN', 245, 0, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'
),
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'techcorp')),
    (SELECT id FROM job_categories WHERE name = 'DevOps & Infrastructure'),
    'DevOps Engineer',
    'Seeking experienced DevOps engineer to manage cloud infrastructure and deployment pipelines.',
    'Manage AWS infrastructure, Build and maintain CI/CD pipelines, Monitor system performance, Implement security best practices',
    '3+ years DevOps experience, Strong knowledge of AWS, Docker, and Kubernetes, Experience with Terraform and Jenkins',
    'FULL_TIME', 'INTERMEDIATE', 'New York', 'New York', 'NY', 'USA', true, 'HYBRID',
    10000000, 14000000, 'USD', 'ANNUAL', true,
    '["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform"]'::jsonb,
    '["Python", "Bash", "Monitoring Tools", "Security"]'::jsonb,
    'BACHELOR', 1,
    'OPEN', 189, 0, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'
),
-- InnovateLab Jobs
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'innovatelab')),
    (SELECT id FROM job_categories WHERE name = 'Data Science & Analytics'),
    'Machine Learning Engineer',
    'Build and deploy ML models for predictive analytics and recommendation systems.',
    'Develop ML algorithms, Train and optimize models, Deploy to production, Monitor model performance',
    '5+ years ML experience, PhD or Master''s in related field, Strong Python and TensorFlow skills, Experience with MLOps',
    'FULL_TIME', 'SENIOR', 'San Francisco', 'San Francisco', 'CA', 'USA', false, 'FULLY_REMOTE',
    15000000, 20000000, 'USD', 'ANNUAL', true,
    '["Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning"]'::jsonb,
    '["Kubernetes", "MLOps", "AWS SageMaker", "NLP"]'::jsonb,
    'MASTER', 1,
    'OPEN', 312, 0, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'
),
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'innovatelab')),
    (SELECT id FROM job_categories WHERE name = 'Software Development'),
    'Frontend Developer',
    'Create beautiful, responsive user interfaces for our SaaS product.',
    'Build React components, Implement designs from Figma, Optimize performance, Write unit tests',
    '3+ years frontend experience, Expert in React and TypeScript, Strong CSS and responsive design skills',
    'FULL_TIME', 'INTERMEDIATE', 'San Francisco', 'San Francisco', 'CA', 'USA', true, 'FULLY_REMOTE',
    9000000, 13000000, 'USD', 'ANNUAL', true,
    '["React", "TypeScript", "CSS", "HTML", "JavaScript"]'::jsonb,
    '["Redux", "Next.js", "Tailwind", "Jest"]'::jsonb,
    'BACHELOR', 2,
    'OPEN', 156, 0, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'
),
-- FinTech Solutions Jobs
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'fintechsolutions')),
    (SELECT id FROM job_categories WHERE name = 'Software Development'),
    'Backend Engineer - Payments',
    'Build secure, scalable payment processing systems for financial transactions.',
    'Design payment APIs, Integrate with payment gateways, Ensure PCI compliance, Handle high-volume transactions',
    '5+ years backend experience, Strong Java or Python skills, Experience with payment systems, Knowledge of financial regulations',
    'FULL_TIME', 'SENIOR', 'New York', 'New York', 'NY', 'USA', false, 'ON_SITE',
    13000000, 17000000, 'USD', 'ANNUAL', true,
    '["Java", "Spring Boot", "PostgreSQL", "Redis", "Payment APIs"]'::jsonb,
    '["Microservices", "Kafka", "Security", "PCI Compliance"]'::jsonb,
    'BACHELOR', 1,
    'OPEN', 198, 0, NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'
),
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'fintechsolutions')),
    (SELECT id FROM job_categories WHERE name = 'Quality Assurance'),
    'QA Automation Engineer',
    'Build automated test suites for our financial platform.',
    'Write automated tests, Perform manual testing, Create test plans, Report and track bugs',
    '3+ years QA experience, Strong Selenium or Cypress skills, Experience with financial applications',
    'FULL_TIME', 'INTERMEDIATE', 'New York', 'New York', 'NY', 'USA', true, 'HYBRID',
    8000000, 11000000, 'USD', 'ANNUAL', true,
    '["Selenium", "Cypress", "Java", "Python", "Test Automation"]'::jsonb,
    '["Jenkins", "Postman", "Performance Testing"]'::jsonb,
    'BACHELOR', 1,
    'OPEN', 102, 0, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'
),
-- HealthTech Jobs
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'healthtechinc')),
    (SELECT id FROM job_categories WHERE name = 'Software Development'),
    'Full Stack Developer - Healthcare',
    'Develop telemedicine platform features with focus on patient experience.',
    'Build patient portal features, Integrate with EHR systems, Ensure HIPAA compliance, Optimize for mobile',
    '4+ years full-stack experience, Knowledge of healthcare regulations, Experience with real-time communication',
    'FULL_TIME', 'SENIOR', 'Los Angeles', 'Los Angeles', 'CA', 'USA', true, 'FULLY_REMOTE',
    11000000, 15000000, 'USD', 'ANNUAL', true,
    '["React", "Node.js", "WebRTC", "PostgreSQL", "HIPAA"]'::jsonb,
    '["TypeScript", "Socket.io", "AWS", "Healthcare Standards"]'::jsonb,
    'BACHELOR', 2,
    'OPEN', 167, 0, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'
),
-- DesignStudio Jobs
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'designstudio')),
    (SELECT id FROM job_categories WHERE name = 'Design & Creative'),
    'Senior UI/UX Designer',
    'Lead design projects for diverse clients across industries.',
    'Create wireframes and prototypes, Conduct user research, Design responsive interfaces, Collaborate with developers',
    '5+ years UI/UX experience, Expert in Figma, Strong portfolio, User research skills',
    'FULL_TIME', 'SENIOR', 'Chicago', 'Chicago', 'IL', 'USA', true, 'HYBRID',
    9000000, 13000000, 'USD', 'ANNUAL', true,
    '["Figma", "UI/UX", "User Research", "Prototyping", "Design Systems"]'::jsonb,
    '["Sketch", "Adobe XD", "Accessibility", "Usability Testing"]'::jsonb,
    'BACHELOR', 1,
    'OPEN', 234, 0, NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days'
),
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'designstudio')),
    (SELECT id FROM job_categories WHERE name = 'Design & Creative'),
    'Motion Graphics Designer',
    'Create engaging animations and motion graphics for digital products.',
    'Design animations, Create video content, Collaborate with marketing, Deliver motion assets',
    '3+ years motion graphics experience, Expert in After Effects, Strong animation principles',
    'FULL_TIME', 'INTERMEDIATE', 'Chicago', 'Chicago', 'IL', 'USA', false, 'ON_SITE',
    7000000, 10000000, 'USD', 'ANNUAL', true,
    '["After Effects", "Motion Graphics", "Animation", "Video Editing"]'::jsonb,
    '["Cinema 4D", "Premiere Pro", "Illustration"]'::jsonb,
    'BACHELOR', 1,
    'OPEN', 145, 0, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'
),
-- ECommerce Hub Jobs
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'ecommercehub')),
    (SELECT id FROM job_categories WHERE name = 'Software Development'),
    'E-Commerce Platform Engineer',
    'Build and optimize our online marketplace platform.',
    'Develop marketplace features, Optimize checkout flow, Integrate payment systems, Improve performance',
    '4+ years e-commerce experience, Strong full-stack skills, Experience with high-traffic sites',
    'FULL_TIME', 'SENIOR', 'Chicago', 'Chicago', 'IL', 'USA', true, 'HYBRID',
    10000000, 14000000, 'USD', 'ANNUAL', true,
    '["React", "Node.js", "PostgreSQL", "Redis", "Payment Integration"]'::jsonb,
    '["Elasticsearch", "CDN", "Performance Optimization"]'::jsonb,
    'BACHELOR', 1,
    'OPEN', 178, 0, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'
),
-- DataAnalytics Jobs
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'dataanalytics')),
    (SELECT id FROM job_categories WHERE name = 'Data Science & Analytics'),
    'Business Intelligence Analyst',
    'Transform data into actionable insights for business decisions.',
    'Create dashboards and reports, Analyze business metrics, Present findings to stakeholders, Identify trends',
    '3+ years BI experience, Expert in SQL and Tableau, Strong analytical skills',
    'FULL_TIME', 'INTERMEDIATE', 'New York', 'New York', 'NY', 'USA', true, 'FULLY_REMOTE',
    8000000, 11000000, 'USD', 'ANNUAL', true,
    '["SQL", "Tableau", "Power BI", "Data Analysis", "Excel"]'::jsonb,
    '["Python", "R", "Statistics", "Data Warehousing"]'::jsonb,
    'BACHELOR', 2,
    'OPEN', 156, 0, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'
),
-- CloudServices Jobs
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'cloudservices')),
    (SELECT id FROM job_categories WHERE name = 'DevOps & Infrastructure'),
    'Cloud Architect',
    'Design and implement cloud infrastructure solutions for enterprise clients.',
    'Design cloud architectures, Migrate on-premise to cloud, Optimize costs, Ensure security and compliance',
    '7+ years cloud experience, AWS or Azure certification, Enterprise architecture experience',
    'FULL_TIME', 'LEAD', 'San Francisco', 'San Francisco', 'CA', 'USA', true, 'HYBRID',
    16000000, 22000000, 'USD', 'ANNUAL', true,
    '["AWS", "Azure", "Cloud Architecture", "Terraform", "Security"]'::jsonb,
    '["Kubernetes", "Serverless", "Multi-cloud", "Cost Optimization"]'::jsonb,
    'BACHELOR', 1,
    'OPEN', 198, 0, NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days'
),
-- MobileFirst Ltd Jobs
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'mobilefirstltd')),
    (SELECT id FROM job_categories WHERE name = 'Software Development'),
    'Senior iOS Developer',
    'Build native iOS apps with cutting-edge features.',
    'Develop iOS applications, Implement new features, Optimize performance, Mentor junior developers',
    '5+ years iOS development, Expert in Swift and SwiftUI, Published apps in App Store',
    'FULL_TIME', 'SENIOR', 'Chicago', 'Chicago', 'IL', 'USA', false, 'ON_SITE',
    11000000, 15000000, 'USD', 'ANNUAL', true,
    '["Swift", "SwiftUI", "iOS", "UIKit", "CoreData"]'::jsonb,
    '["Combine", "Unit Testing", "CI/CD", "App Store"]'::jsonb,
    'BACHELOR', 1,
    'OPEN', 167, 0, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'
),
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'mobilefirstltd')),
    (SELECT id FROM job_categories WHERE name = 'Software Development'),
    'Android Developer',
    'Create high-quality Android applications.',
    'Develop Android apps, Implement Material Design, Optimize for various devices, Write clean code',
    '4+ years Android development, Strong Kotlin skills, Experience with Jetpack',
    'FULL_TIME', 'SENIOR', 'Chicago', 'Chicago', 'IL', 'USA', false, 'ON_SITE',
    10000000, 14000000, 'USD', 'ANNUAL', true,
    '["Kotlin", "Android", "Jetpack Compose", "Room", "Firebase"]'::jsonb,
    '["Coroutines", "MVVM", "Material Design", "Play Store"]'::jsonb,
    'BACHELOR', 1,
    'OPEN', 145, 0, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'
),
-- GameStudio Pro Jobs
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'gamestudiopro')),
    (SELECT id FROM job_categories WHERE name = 'Software Development'),
    'Game Developer - Unity',
    'Develop engaging mobile and PC games using Unity.',
    'Implement game mechanics, Optimize performance, Create multiplayer features, Debug issues',
    '4+ years Unity experience, Strong C# skills, Published games portfolio',
    'FULL_TIME', 'SENIOR', 'Los Angeles', 'Los Angeles', 'CA', 'USA', true, 'HYBRID',
    10000000, 14000000, 'USD', 'ANNUAL', true,
    '["Unity", "C#", "Game Development", "3D Graphics"]'::jsonb,
    '["Multiplayer", "Physics", "Optimization", "Shaders"]'::jsonb,
    'BACHELOR', 2,
    'OPEN', 289, 0, NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- FREELANCE PROJECTS (20 records)
-- =====================================================
INSERT INTO projects (
    company_id, category_id, title, description, scope_of_work,
    budget_type, budget_min_cents, budget_max_cents, currency,
    estimated_duration_days, timeline, project_type, experience_level,
    priority_level, visibility, is_urgent, is_featured, status,
    required_skills, preferred_skills, apply_instructions,
    views_count, proposal_count, created_at, published_at
) VALUES
-- TechCorp Projects
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'techcorp')),
    (SELECT id FROM project_categories WHERE name = 'Web Development'),
    'E-Commerce Platform Redesign',
    'Complete redesign of our existing e-commerce platform with modern technologies and improved UX.',
    'Frontend redesign using React, Backend API optimization, Payment gateway integration, Mobile responsiveness, SEO optimization',
    'FIXED_PRICE', 8000000, 12000000, 'USD',
    90, '3-6_MONTHS', 'SINGLE_PROJECT', 'SENIOR',
    'HIGH', 'PUBLIC', false, false,
    'OPEN',
    '["React", "Node.js", "PostgreSQL", "AWS", "Payment Integration", "REST APIs"]'::jsonb,
    '["Redux", "TypeScript", "Docker", "CI/CD"]'::jsonb,
    'Please submit portfolio with at least 2 similar e-commerce projects',
    245, 0, NOW() - INTERVAL '15 days', NOW() - INTERVAL '15 days'
),
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'techcorp')),
    (SELECT id FROM project_categories WHERE name = 'Mobile Apps'),
    'iOS Enterprise App Development',
    'Build native iOS app for our enterprise software suite with offline sync capabilities.',
    'Develop iOS app with SwiftUI, Implement offline data sync, Integrate REST APIs, App Store deployment, Push notifications',
    'FIXED_PRICE', 6000000, 6000000, 'USD',
    60, '1-3_MONTHS', 'SINGLE_PROJECT', 'INTERMEDIATE',
    'MEDIUM', 'PUBLIC', false, false,
    'OPEN',
    '["Swift", "SwiftUI", "iOS Development", "CoreData", "REST APIs"]'::jsonb,
    '["Combine", "Unit Testing", "CI/CD"]'::jsonb,
    'Must have published apps in App Store',
    189, 0, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'
),
-- InnovateLab Projects
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'innovatelab')),
    (SELECT id FROM project_categories WHERE name = 'Data & Analytics'),
    'Machine Learning Model Development',
    'Develop and deploy predictive models for customer churn analysis using historical data.',
    'Build ML pipeline, Feature engineering, Train models, Deploy to production, Create monitoring dashboards, Documentation',
    'HOURLY', 10000, 15000, 'USD',
    45, '1-3_MONTHS', 'ONGOING', 'SENIOR',
    'HIGH', 'PUBLIC', true, true,
    'OPEN',
    '["Python", "TensorFlow", "PyTorch", "Machine Learning", "Data Science", "MLOps"]'::jsonb,
    '["Kubernetes", "AWS SageMaker", "Docker"]'::jsonb,
    'Include examples of deployed ML models in your proposal',
    334, 0, NOW() - INTERVAL '20 days', NOW() - INTERVAL '20 days'
),
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'innovatelab')),
    (SELECT id FROM project_categories WHERE name = 'Web Development'),
    'SaaS Analytics Dashboard',
    'Build comprehensive analytics dashboard with real-time data visualization and export features.',
    'Interactive dashboard with D3.js/Chart.js, Real-time WebSocket updates, User role management, CSV/PDF export, API integration',
    'FIXED_PRICE', 4000000, 6000000, 'USD',
    30, '1-3_MONTHS', 'SINGLE_PROJECT', 'INTERMEDIATE',
    'MEDIUM', 'PUBLIC', false, false,
    'OPEN',
    '["React", "TypeScript", "D3.js", "WebSocket", "REST APIs"]'::jsonb,
    '["Redux", "Chart.js", "Material-UI"]'::jsonb,
    'Share your dashboard UI/UX work samples',
    278, 0, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'
),
-- FinTech Solutions Projects
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'fintechsolutions')),
    (SELECT id FROM project_categories WHERE name = 'Web Development'),
    'Blockchain Payment Integration',
    'Integrate blockchain-based payment gateway for cryptocurrency transactions.',
    'Implement Web3.js integration, Smart contract interaction, Transaction monitoring, Security audits, Documentation',
    'FIXED_PRICE', 15000000, 20000000, 'USD',
    120, '3-6_MONTHS', 'SINGLE_PROJECT', 'SENIOR',
    'HIGH', 'PUBLIC', true, true,
    'OPEN',
    '["Blockchain", "Web3.js", "Ethereum", "Smart Contracts", "Security"]'::jsonb,
    '["DeFi", "Token Standards", "Auditing"]'::jsonb,
    'Must have blockchain project experience with 5+ years expertise',
    456, 0, NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'
),
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'fintechsolutions')),
    (SELECT id FROM project_categories WHERE name = 'Mobile Apps'),
    'Mobile Banking App - Android',
    'Develop secure mobile banking application for Android platform.',
    'Implement biometric authentication, Banking integrations, Transaction handling, Encryption, Offline capabilities',
    'FIXED_PRICE', 7000000, 9000000, 'USD',
    75, '1-3_MONTHS', 'SINGLE_PROJECT', 'SENIOR',
    'HIGH', 'PUBLIC', false, false,
    'OPEN',
    '["Android", "Kotlin", "Security", "Banking APIs", "Biometric Auth"]'::jsonb,
    '["Jetpack", "Room Database", "Encryption"]'::jsonb,
    'Portfolio with banking app experience required',
    267, 0, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'
),
-- HealthTech Projects
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'healthtechinc')),
    (SELECT id FROM project_categories WHERE name = 'Web Development'),
    'Patient Portal Redesign',
    'Redesign patient portal with improved UX and mobile-first approach.',
    'HIPAA compliance implementation, Mobile responsive design, Real-time appointment system, Medical records display, Video consultation',
    'FIXED_PRICE', 5000000, 7000000, 'USD',
    60, '3-6_MONTHS', 'SINGLE_PROJECT', 'SENIOR',
    'HIGH', 'PUBLIC', false, false,
    'OPEN',
    '["React", "Node.js", "WebRTC", "HIPAA", "Healthcare APIs"]'::jsonb,
    '["PostgreSQL", "Telemedicine", "Accessibility"]'::jsonb,
    'Healthcare software development experience mandatory',
    389, 0, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'
),
-- DesignStudio Projects
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'designstudio')),
    (SELECT id FROM project_categories WHERE name = 'Design & Creative'),
    'Brand Identity Overhaul',
    'Complete brand redesign including logo, style guide, and marketing collateral.',
    'Logo design, Color palette development, Typography system, Brand guidelines, Marketing materials, Social media templates',
    'FIXED_PRICE', 3000000, 5000000, 'USD',
    45, '1-3_MONTHS', 'SINGLE_PROJECT', 'SENIOR',
    'HIGH', 'PUBLIC', false, true,
    'OPEN',
    '["Figma", "Branding", "Design Systems", "Logo Design", "Adobe Creative Suite"]'::jsonb,
    '["Illustration", "Art Direction", "UX Design"]'::jsonb,
    'Submit 3+ previous brand redesign projects',
    412, 0, NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days'
),
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'designstudio')),
    (SELECT id FROM project_categories WHERE name = 'Design & Creative'),
    'Animated Explainer Videos',
    'Create 5 animated explainer videos for product features.',
    'Storyboarding, Animation production, Voice-over integration, Music licensing, Video editing, Delivery in multiple formats',
    'FIXED_PRICE', 2500000, 4000000, 'USD',
    30, '1-3_MONTHS', 'SINGLE_PROJECT', 'INTERMEDIATE',
    'MEDIUM', 'PUBLIC', false, false,
    'OPEN',
    '["Animation", "After Effects", "Motion Graphics", "Video Production"]'::jsonb,
    '["Character Animation", "Sound Design", "Editing"]'::jsonb,
    'Portfolio of previous explainer videos required',
    267, 0, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'
),
-- ECommerce Hub Projects
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'ecommercehub')),
    (SELECT id FROM project_categories WHERE name = 'Web Development'),
    'Marketplace Search Engine Optimization',
    'Implement advanced search and filtering system for marketplace.',
    'Elasticsearch integration, Advanced filtering UI, Search analytics, Autocomplete, Performance optimization',
    'FIXED_PRICE', 4500000, 6500000, 'USD',
    45, '1-3_MONTHS', 'SINGLE_PROJECT', 'INTERMEDIATE',
    'MEDIUM', 'PUBLIC', false, false,
    'OPEN',
    '["Elasticsearch", "React", "Node.js", "Search Optimization"]'::jsonb,
    '["Machine Learning", "Analytics", "Performance"]'::jsonb,
    'E-commerce search implementation experience required',
    334, 0, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'
),
-- DataAnalytics Projects
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'dataanalytics')),
    (SELECT id FROM project_categories WHERE name = 'Data & Analytics'),
    'Business Intelligence Dashboard Suite',
    'Build comprehensive BI dashboards for sales, marketing, and operations teams.',
    'Tableau dashboard development, Data warehouse design, ETL pipeline creation, Real-time analytics, Mobile dashboards',
    'FIXED_PRICE', 6000000, 8000000, 'USD',
    75, '3-6_MONTHS', 'SINGLE_PROJECT', 'SENIOR',
    'HIGH', 'PUBLIC', false, true,
    'OPEN',
    '["Tableau", "SQL", "Data Warehouse", "ETL", "Business Intelligence"]'::jsonb,
    '["Python", "R", "Apache Airflow", "Data Modeling"]'::jsonb,
    'Portfolio with enterprise BI projects mandatory',
    467, 0, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'
),
-- CloudServices Projects
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'cloudservices')),
    (SELECT id FROM project_categories WHERE name = 'DevOps & Infrastructure'),
    'AWS to Azure Migration',
    'Migrate existing AWS infrastructure to Azure cloud platform.',
    'Infrastructure assessment, Migration planning, Application migration, Testing and validation, Staff training',
    'FIXED_PRICE', 25000000, 35000000, 'USD',
    180, '6_PLUS_MONTHS', 'SINGLE_PROJECT', 'LEAD',
    'HIGH', 'PUBLIC', true, false,
    'OPEN',
    '["AWS", "Azure", "Cloud Migration", "Infrastructure", "Terraform"]'::jsonb,
    '["DevOps", "CI/CD", "Database Migration", "Cost Optimization"]'::jsonb,
    '10+ years cloud experience, previous enterprise migrations required',
    578, 0, NOW() - INTERVAL '18 days', NOW() - INTERVAL '18 days'
),
-- MobileFirst Ltd Projects
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'mobilefirstltd')),
    (SELECT id FROM project_categories WHERE name = 'Mobile Apps'),
    'Cross-Platform Mobile Framework Development',
    'Build custom mobile app framework for rapid app development.',
    'Framework architecture design, Component library creation, Performance optimization, Documentation, Example apps',
    'FIXED_PRICE', 8000000, 12000000, 'USD',
    120, '3-6_MONTHS', 'SINGLE_PROJECT', 'LEAD',
    'HIGH', 'PUBLIC', false, true,
    'OPEN',
    '["React Native", "Flutter", "Mobile Architecture", "Performance"]'::jsonb,
    '["TypeScript", "Testing", "CI/CD", "Documentation"]'::jsonb,
    'Must have framework development experience',
    423, 0, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'
),
-- GameStudio Pro Projects
(
    (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = 'gamestudiopro')),
    (SELECT id FROM project_categories WHERE name = 'Software Development'),
    'Multiplayer Game Server Development',
    'Build backend server infrastructure for multiplayer game.',
    'Game server architecture, Player session management, Real-time communication, Database design, Load balancing, Security',
    'FIXED_PRICE', 12000000, 16000000, 'USD',
    150, '3-6_MONTHS', 'SINGLE_PROJECT', 'SENIOR',
    'HIGH', 'PUBLIC', false, false,
    'OPEN',
    '["Node.js", "WebSocket", "Redis", "PostgreSQL", "Game Servers"]'::jsonb,
    '["Kubernetes", "Load Balancing", "Performance Optimization", "Security"]'::jsonb,
    'Game server development experience required',
    512, 0, NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'
)
ON CONFLICT DO NOTHING;

-- =====================================================
-- VERIFY DATA INTEGRITY
-- =====================================================
-- Verify all jobs have valid company references
SELECT COUNT(*) as total_jobs FROM jobs WHERE status = 'OPEN';

-- Verify all projects have valid company references
SELECT COUNT(*) as total_projects FROM projects WHERE status = 'OPEN';

-- Display sample of inserted data
SELECT j.id, j.title, c.company_name, j.created_at 
FROM jobs j 
JOIN companies c ON j.company_id = c.id 
ORDER BY j.created_at DESC 
LIMIT 5;

-- Check company job counts are properly updated
SELECT c.company_name, c.total_jobs_posted, COUNT(j.id) as actual_job_count
FROM companies c
LEFT JOIN jobs j ON c.id = j.company_id AND j.deleted_at IS NULL
GROUP BY c.id, c.company_name, c.total_jobs_posted
ORDER BY c.company_name;
