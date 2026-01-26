-- =====================================================
-- SEED 03: Jobs & Projects
-- Description: Job postings and freelance projects
-- Dependencies: companies (FK), freelancers (FK), job_categories, project_categories, experience_levels
-- Author: Senior DBA & Principal DB Architect
-- =====================================================
-- Load Order: 3rd (After users, companies, freelancers, reference data)
-- =====================================================

-- =====================================================
-- TRADITIONAL JOB POSTINGS (15 records)
-- =====================================================
INSERT INTO jobs (
    company_id, category_id, title, description, responsibilities, requirements,
    job_type, experience_level, location, city, state, country, is_remote, remote_type,
    salary_min_cents, salary_max_cents, salary_currency, salary_period, show_salary,
    required_skills, preferred_skills, education_level, positions_available,
    company_name, company_size, industry, status, views_count, applications_count,
    created_at, published_at
)
SELECT
    c.id AS company_id,
    jc.id AS category_id,
    job_data.title,
    job_data.description,
    job_data.responsibilities,
    job_data.requirements,
    job_data.job_type,
    job_data.experience_level,
    u.location,
    job_data.city,
    job_data.state,
    'USA' AS country,
    job_data.is_remote,
    job_data.remote_type,
    job_data.salary_min_cents,
    job_data.salary_max_cents,
    'USD' AS salary_currency,
    job_data.salary_period,
    true AS show_salary,
    job_data.required_skills::jsonb,
    job_data.preferred_skills::jsonb,
    job_data.education_level,
    job_data.positions_available,
    co.company_name,
    co.company_size,
    co.industry,
    'OPEN' AS status,
    job_data.views_count,
    0 AS applications_count,
    NOW() - (job_data.days_ago || ' days')::INTERVAL AS created_at,
    NOW() - (job_data.days_ago || ' days')::INTERVAL AS published_at
FROM users u
JOIN companies c ON c.user_id = u.id
JOIN companies co ON co.user_id = u.id
CROSS JOIN LATERAL (VALUES
    -- TechCorp Jobs
    ('techcorp', 'Software Development', 'Senior Full Stack Engineer', 
     'Join our engineering team to build scalable web applications using modern technologies.',
     'Design and develop RESTful APIs, Build responsive UIs with React, Implement CI/CD pipelines, Mentor junior developers',
     'Bachelor''s degree in Computer Science or equivalent, 5+ years full-stack experience, Strong React and Node.js skills, Experience with AWS and Docker',
     'FULL_TIME', 'SENIOR', 'New York', 'NY', true, 'HYBRID',
     12000000, 18000000, 'ANNUAL', 'BACHELOR', 2, 245, 15,
     '["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker"]',
     '["Redux", "GraphQL", "Kubernetes", "Microservices"]'),
    
    ('techcorp', 'DevOps & Infrastructure', 'DevOps Engineer',
     'Seeking experienced DevOps engineer to manage cloud infrastructure and deployment pipelines.',
     'Manage AWS infrastructure, Build and maintain CI/CD pipelines, Monitor system performance, Implement security best practices',
     '3+ years DevOps experience, Strong knowledge of AWS, Docker, and Kubernetes, Experience with Terraform and Jenkins',
     'FULL_TIME', 'INTERMEDIATE', 'New York', 'NY', true, 'HYBRID',
     10000000, 14000000, 'ANNUAL', 'BACHELOR', 1, 189, 10,
     '["AWS", "Docker", "Kubernetes", "Jenkins", "Terraform"]',
     '["Python", "Bash", "Monitoring Tools", "Security"]'),
    
    -- InnovateLab Jobs
    ('innovatelab', 'Data Science & Analytics', 'Machine Learning Engineer',
     'Build and deploy ML models for predictive analytics and recommendation systems.',
     'Develop ML algorithms, Train and optimize models, Deploy to production, Monitor model performance',
     '5+ years ML experience, PhD or Master''s in related field, Strong Python and TensorFlow skills, Experience with MLOps',
     'FULL_TIME', 'SENIOR', 'San Francisco', 'CA', false, 'FULLY_REMOTE',
     15000000, 20000000, 'ANNUAL', 'MASTER', 1, 312, 20,
     '["Python", "TensorFlow", "PyTorch", "Machine Learning", "Deep Learning"]',
     '["Kubernetes", "MLOps", "AWS SageMaker", "NLP"]'),
    
    ('innovatelab', 'Software Development', 'Frontend Developer',
     'Create beautiful, responsive user interfaces for our SaaS product.',
     'Build React components, Implement designs from Figma, Optimize performance, Write unit tests',
     '3+ years frontend experience, Expert in React and TypeScript, Strong CSS and responsive design skills',
     'FULL_TIME', 'INTERMEDIATE', 'San Francisco', 'CA', true, 'FULLY_REMOTE',
     9000000, 13000000, 'ANNUAL', 'BACHELOR', 2, 156, 8,
     '["React", "TypeScript", "CSS", "HTML", "JavaScript"]',
     '["Redux", "Next.js", "Tailwind", "Jest"]'),
    
    -- FinTech Jobs
    ('fintechsolutions', 'Software Development', 'Backend Engineer - Payments',
     'Build secure, scalable payment processing systems for financial transactions.',
     'Design payment APIs, Integrate with payment gateways, Ensure PCI compliance, Handle high-volume transactions',
     '5+ years backend experience, Strong Java or Python skills, Experience with payment systems, Knowledge of financial regulations',
     'FULL_TIME', 'SENIOR', 'New York', 'NY', false, 'ON_SITE',
     13000000, 17000000, 'ANNUAL', 'BACHELOR', 1, 198, 12,
     '["Java", "Spring Boot", "PostgreSQL", "Redis", "Payment APIs"]',
     '["Microservices", "Kafka", "Security", "PCI Compliance"]'),
    
    ('fintechsolutions', 'Quality Assurance', 'QA Automation Engineer',
     'Build automated test suites for our financial platform.',
     'Write automated tests, Perform manual testing, Create test plans, Report and track bugs',
     '3+ years QA experience, Strong Selenium or Cypress skills, Experience with financial applications',
     'FULL_TIME', 'INTERMEDIATE', 'New York', 'NY', true, 'HYBRID',
     8000000, 11000000, 'ANNUAL', 'BACHELOR', 1, 102, 7,
     '["Selenium", "Cypress", "Java", "Python", "Test Automation"]',
     '["Jenkins", "Postman", "Performance Testing"]'),
    
    -- HealthTech Jobs
    ('healthtechinc', 'Software Development', 'Full Stack Developer - Healthcare',
     'Develop telemedicine platform features with focus on patient experience.',
     'Build patient portal features, Integrate with EHR systems, Ensure HIPAA compliance, Optimize for mobile',
     '4+ years full-stack experience, Knowledge of healthcare regulations, Experience with real-time communication',
     'FULL_TIME', 'SENIOR', 'Los Angeles', 'CA', true, 'FULLY_REMOTE',
     11000000, 15000000, 'ANNUAL', 'BACHELOR', 2, 167, 9,
     '["React", "Node.js", "WebRTC", "PostgreSQL", "HIPAA"]',
     '["TypeScript", "Socket.io", "AWS", "Healthcare Standards"]'),
    
    -- DesignStudio Jobs
    ('designstudio', 'Design & Creative', 'Senior UI/UX Designer',
     'Lead design projects for diverse clients across industries.',
     'Create wireframes and prototypes, Conduct user research, Design responsive interfaces, Collaborate with developers',
     '5+ years UI/UX experience, Expert in Figma, Strong portfolio, User research skills',
     'FULL_TIME', 'SENIOR', 'Chicago', 'IL', true, 'HYBRID',
     9000000, 13000000, 'ANNUAL', 'BACHELOR', 1, 234, 11,
     '["Figma", "UI/UX", "User Research", "Prototyping", "Design Systems"]',
     '["Sketch", "Adobe XD", "Accessibility", "Usability Testing"]'),
    
    ('designstudio', 'Design & Creative', 'Motion Graphics Designer',
     'Create engaging animations and motion graphics for digital products.',
     'Design animations, Create video content, Collaborate with marketing, Deliver motion assets',
     '3+ years motion graphics experience, Expert in After Effects, Strong animation principles',
     'FULL_TIME', 'INTERMEDIATE', 'Chicago', 'IL', false, 'ON_SITE',
     7000000, 10000000, 'ANNUAL', 'BACHELOR', 1, 145, 6,
     '["After Effects", "Motion Graphics", "Animation", "Video Editing"]',
     '["Cinema 4D", "Premiere Pro", "Illustration"]'),
    
    -- ECommerce Jobs
    ('ecommercehub', 'Software Development', 'E-Commerce Platform Engineer',
     'Build and optimize our online marketplace platform.',
     'Develop marketplace features, Optimize checkout flow, Integrate payment systems, Improve performance',
     '4+ years e-commerce experience, Strong full-stack skills, Experience with high-traffic sites',
     'FULL_TIME', 'SENIOR', 'Chicago', 'IL', true, 'HYBRID',
     10000000, 14000000, 'ANNUAL', 'BACHELOR', 1, 178, 8,
     '["React", "Node.js", "PostgreSQL", "Redis", "Payment Integration"]',
     '["Elasticsearch", "CDN", "Performance Optimization"]'),
    
    -- DataAnalytics Jobs
    ('dataanalytics', 'Data Science & Analytics', 'Business Intelligence Analyst',
     'Transform data into actionable insights for business decisions.',
     'Create dashboards and reports, Analyze business metrics, Present findings to stakeholders, Identify trends',
     '3+ years BI experience, Expert in SQL and Tableau, Strong analytical skills',
     'FULL_TIME', 'INTERMEDIATE', 'New York', 'NY', true, 'FULLY_REMOTE',
     8000000, 11000000, 'ANNUAL', 'BACHELOR', 2, 156, 7,
     '["SQL", "Tableau", "Power BI", "Data Analysis", "Excel"]',
     '["Python", "R", "Statistics", "Data Warehousing"]'),
    
    -- CloudServices Jobs
    ('cloudservices', 'DevOps & Infrastructure', 'Cloud Architect',
     'Design and implement cloud infrastructure solutions for enterprise clients.',
     'Design cloud architectures, Migrate on-premise to cloud, Optimize costs, Ensure security and compliance',
     '7+ years cloud experience, AWS or Azure certification, Enterprise architecture experience',
     'FULL_TIME', 'LEAD', 'San Francisco', 'CA', true, 'HYBRID',
     16000000, 22000000, 'ANNUAL', 'BACHELOR', 1, 198, 18,
     '["AWS", "Azure", "Cloud Architecture", "Terraform", "Security"]',
     '["Kubernetes", "Serverless", "Multi-cloud", "Cost Optimization"]'),
    
    -- MobileFirst Jobs
    ('mobilefirstltd', 'Software Development', 'Senior iOS Developer',
     'Build native iOS apps with cutting-edge features.',
     'Develop iOS applications, Implement new features, Optimize performance, Mentor junior developers',
     '5+ years iOS development, Expert in Swift and SwiftUI, Published apps in App Store',
     'FULL_TIME', 'SENIOR', 'Chicago', 'IL', false, 'ON_SITE',
     11000000, 15000000, 'ANNUAL', 'BACHELOR', 1, 167, 10,
     '["Swift", "SwiftUI", "iOS", "UIKit", "CoreData"]',
     '["Combine", "Unit Testing", "CI/CD", "App Store"]'),
    
    ('mobilefirstltd', 'Software Development', 'Android Developer',
     'Create high-quality Android applications.',
     'Develop Android apps, Implement Material Design, Optimize for various devices, Write clean code',
     '4+ years Android development, Strong Kotlin skills, Experience with Jetpack',
     'FULL_TIME', 'SENIOR', 'Chicago', 'IL', false, 'ON_SITE',
     10000000, 14000000, 'ANNUAL', 'BACHELOR', 1, 145, 9,
     '["Kotlin", "Android", "Jetpack Compose", "Room", "Firebase"]',
     '["Coroutines", "MVVM", "Material Design", "Play Store"]'),
    
    -- GameStudio Jobs
    ('gamestudiopro', 'Software Development', 'Game Developer - Unity',
     'Develop engaging mobile and PC games using Unity.',
     'Implement game mechanics, Optimize performance, Create multiplayer features, Debug issues',
     '4+ years Unity experience, Strong C# skills, Published games portfolio',
     'FULL_TIME', 'SENIOR', 'Los Angeles', 'CA', true, 'HYBRID',
     10000000, 14000000, 'ANNUAL', 'BACHELOR', 2, 289, 12,
     '["Unity", "C#", "Game Development", "3D Graphics"]',
     '["Multiplayer", "Physics", "Optimization", "Shaders"]')
) AS job_data (company_username, category_name, title, description, responsibilities, requirements,
               job_type, experience_level, city, state, is_remote, remote_type,
               salary_min_cents, salary_max_cents, salary_period, education_level, 
               positions_available, views_count, days_ago, required_skills, preferred_skills)
JOIN job_categories jc ON jc.name = job_data.category_name
WHERE u.username = job_data.company_username
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
)
SELECT
    c.id AS company_id,
    pc.id AS category_id,
    proj_data.title,
    proj_data.description,
    proj_data.scope_of_work,
    proj_data.budget_type,
    proj_data.budget_min_cents,
    proj_data.budget_max_cents,
    'USD' AS currency,
    proj_data.estimated_duration_days,
    proj_data.timeline,
    proj_data.project_type,
    proj_data.experience_level,
    proj_data.priority_level,
    'PUBLIC' AS visibility,
    proj_data.is_urgent,
    proj_data.is_featured,
    'OPEN' AS status,
    proj_data.required_skills::jsonb,
    proj_data.preferred_skills::jsonb,
    proj_data.apply_instructions,
    proj_data.views_count,
    0 AS proposal_count,
    NOW() - (proj_data.days_ago || ' days')::INTERVAL AS created_at,
    NOW() - (proj_data.days_ago || ' days')::INTERVAL AS published_at
FROM users u
JOIN companies c ON c.user_id = u.id
CROSS JOIN LATERAL (VALUES
    -- TechCorp Projects
    ('techcorp', 'Web Development', 'E-Commerce Platform Redesign',
     'Complete redesign of our existing e-commerce platform with modern technologies and improved UX.',
     'Frontend redesign using React, Backend API optimization, Payment gateway integration, Mobile responsiveness, SEO optimization',
     'FIXED_PRICE', 8000000, 12000000, 90, '3-6_MONTHS', 'SINGLE_PROJECT', 'SENIOR', 'HIGH', false, false,
     '["React", "Node.js", "PostgreSQL", "AWS", "Payment Integration", "REST APIs"]',
     '["Redux", "TypeScript", "Docker", "CI/CD"]',
     'Please submit portfolio with at least 2 similar e-commerce projects', 245, 15),
    
    ('techcorp', 'Mobile Apps', 'iOS Enterprise App Development',
     'Build native iOS app for our enterprise software suite with offline sync capabilities.',
     'Develop iOS app with SwiftUI, Implement offline data sync, Integrate REST APIs, App Store deployment, Push notifications',
     'FIXED_PRICE', 6000000, 6000000, 60, '1-3_MONTHS', 'SINGLE_PROJECT', 'INTERMEDIATE', 'MEDIUM', false, false,
     '["Swift", "SwiftUI", "iOS Development", "CoreData", "REST APIs"]',
     '["Combine", "Unit Testing", "CI/CD"]',
     'Must have published apps in App Store', 189, 10),
    
    -- InnovateLab Projects
    ('innovatelab', 'Data & Analytics', 'Machine Learning Model Development',
     'Develop and deploy predictive models for customer churn analysis using historical data.',
     'Build ML pipeline, Feature engineering, Train models, Deploy to production, Create monitoring dashboards, Documentation',
     'HOURLY', 10000, 15000, 45, '1-3_MONTHS', 'ONGOING', 'SENIOR', 'HIGH', true, true,
     '["Python", "TensorFlow", "PyTorch", "Machine Learning", "Data Science", "MLOps"]',
     '["Kubernetes", "AWS SageMaker", "Docker"]',
     'Include examples of deployed ML models in your proposal', 334, 20),
    
    ('innovatelab', 'Web Development', 'SaaS Analytics Dashboard',
     'Build comprehensive analytics dashboard with real-time data visualization and export features.',
     'Interactive dashboard with D3.js/Chart.js, Real-time WebSocket updates, User role management, CSV/PDF export, API integration',
     'FIXED_PRICE', 4000000, 6000000, 30, '1-3_MONTHS', 'SINGLE_PROJECT', 'INTERMEDIATE', 'MEDIUM', false, false,
     '["React", "TypeScript", "D3.js", "WebSocket", "REST APIs"]',
     '["Redux", "Chart.js", "Material-UI"]',
     'Share your dashboard UI/UX work samples', 278, 12),
    
    -- DesignStudio Projects
    ('designstudio', 'Design Projects', 'Brand Identity & Logo Design',
     'Complete brand identity package for a new fintech startup.',
     'Logo design (3 concepts), Brand guidelines document, Color palette, Typography selection, Business card design, Social media templates',
     'FIXED_PRICE', 500000, 500000, 14, 'ASAP', 'SINGLE_PROJECT', 'INTERMEDIATE', 'MEDIUM', false, false,
     '["Graphic Design", "Logo Design", "Branding", "Adobe Illustrator", "Figma"]',
     '["Brand Strategy", "Typography", "Color Theory"]',
     'Portfolio must include at least 5 brand identity projects', 192, 8),
    
    ('designstudio', 'Design Projects', 'Mobile App UI/UX Design',
     'Design complete user interface and experience for a health tracking mobile application.',
     'User research and personas, Wireframes, High-fidelity mockups, Interactive prototypes, Design system creation, Usability testing',
     'FIXED_PRICE', 300000, 500000, 21, 'ASAP', 'SINGLE_PROJECT', 'INTERMEDIATE', 'HIGH', false, false,
     '["UI/UX Design", "Figma", "User Research", "Prototyping", "Mobile Design"]',
     '["Design Systems", "Accessibility", "Usability Testing"]',
     'Show mobile app design portfolio', 256, 14),
    
    -- FinTech Projects
    ('fintechsolutions', 'Web Development', 'Payment Gateway Integration',
     'Integrate multiple payment providers (Stripe, PayPal, Square) into financial platform.',
     'Stripe API integration, PayPal integration, Square integration, Webhook handling, Error handling, PCI compliance',
     'FIXED_PRICE', 3500000, 5000000, 30, '1-3_MONTHS', 'SINGLE_PROJECT', 'SENIOR', 'HIGH', false, true,
     '["Payment APIs", "Node.js", "PostgreSQL", "Security", "PCI Compliance"]',
     '["Stripe", "PayPal", "WebHooks", "Fraud Detection"]',
     'Experience with payment systems required', 198, 9),
    
    ('fintechsolutions', 'Web Development', 'Financial Dashboard API',
     'Build RESTful API for financial dashboard with real-time market data.',
     'REST API design, Real-time data streaming, Authentication/Authorization, Rate limiting, API documentation, Unit testing',
     'HOURLY', 12000, 18000, 45, '1-3_MONTHS', 'ONGOING', 'SENIOR', 'HIGH', false, false,
     '["Node.js", "PostgreSQL", "Redis", "REST APIs", "WebSocket"]',
     '["TypeScript", "Microservices", "API Gateway"]',
     'Submit API design experience', 167, 7),
    
    -- HealthTech Projects
    ('healthtechinc', 'Web Development', 'Telemedicine Video Platform',
     'Build HIPAA-compliant video consultation platform for healthcare providers.',
     'WebRTC video integration, Secure patient authentication, Appointment scheduling, Medical records integration, HIPAA compliance',
     'FIXED_PRICE', 8000000, 10000000, 60, '3-6_MONTHS', 'SINGLE_PROJECT', 'SENIOR', 'URGENT', true, true,
     '["WebRTC", "React", "Node.js", "HIPAA", "Security"]',
     '["Socket.io", "Medical Standards", "Healthcare APIs"]',
     'Healthcare project experience preferred', 389, 18),
    
    ('healthtechinc', 'Mobile Apps', 'Health Tracking Mobile App',
     'Native mobile app for tracking health metrics with wearable device integration.',
     'iOS and Android apps, Wearable integration (Apple Watch, Fitbit), Data synchronization, Health charts, Push notifications',
     'FIXED_PRICE', 7000000, 9000000, 75, '3-6_MONTHS', 'SINGLE_PROJECT', 'SENIOR', 'HIGH', false, false,
     '["iOS", "Android", "HealthKit", "Google Fit", "Mobile Development"]',
     '["Swift", "Kotlin", "Wearables", "Charts"]',
     'Show health app portfolio', 234, 11),
    
    -- ECommerce Projects
    ('ecommercehub', 'Web Development', 'Marketplace Search Optimization',
     'Implement advanced search with filters, facets, and AI-powered recommendations.',
     'Elasticsearch integration, Search UI with filters, Autocomplete, Product recommendations, Performance optimization',
     'FIXED_PRICE', 4000000, 6000000, 45, '1-3_MONTHS', 'SINGLE_PROJECT', 'INTERMEDIATE', 'HIGH', false, false,
     '["Elasticsearch", "React", "Node.js", "Search Optimization"]',
     '["AI/ML Recommendations", "Redis", "Performance"]',
     'E-commerce search experience required', 198, 9),
    
    ('ecommercehub', 'Web Development', 'Product Review System',
     'Build comprehensive product review and rating system with moderation.',
     'Review submission UI, Rating system, Photo upload, Moderation dashboard, Spam detection, Email notifications',
     'FIXED_PRICE', 2500000, 3500000, 30, '1-3_MONTHS', 'SINGLE_PROJECT', 'INTERMEDIATE', 'MEDIUM', false, false,
     '["React", "Node.js", "PostgreSQL", "Image Upload"]',
     '["Email Services", "Moderation Tools", "Sentiment Analysis"]',
     'Share review system examples', 145, 6),
    
    -- DataAnalytics Projects
    ('dataanalytics', 'Data & Analytics', 'Business Intelligence Dashboard',
     'Create comprehensive BI dashboard for enterprise clients with custom reports.',
     'Dashboard design and development, Custom report builder, Data export (PDF/Excel), Role-based access, API integration',
     'FIXED_PRICE', 5000000, 7000000, 60, '3-6_MONTHS', 'SINGLE_PROJECT', 'SENIOR', 'HIGH', false, false,
     '["Tableau", "Power BI", "SQL", "Data Visualization", "Python"]',
     '["ETL", "Data Warehousing", "Report Generation"]',
     'BI dashboard portfolio required', 223, 10),
    
    ('dataanalytics', 'Data & Analytics', 'Data Pipeline Development',
     'Build ETL pipelines to process large datasets from multiple sources.',
     'ETL pipeline design, Data transformation, Airflow orchestration, Data quality checks, Monitoring and alerts',
     'HOURLY', 13000, 16000, 45, '1-3_MONTHS', 'ONGOING', 'SENIOR', 'HIGH', false, false,
     '["Python", "Apache Airflow", "SQL", "ETL", "Data Engineering"]',
     '["Spark", "Kafka", "AWS", "Data Quality"]',
     'Data engineering experience required', 189, 8),
    
    -- CloudServices Projects
    ('cloudservices', 'DevOps', 'Cloud Migration to AWS',
     'Migrate on-premise infrastructure to AWS with minimal downtime.',
     'Assessment of current infrastructure, AWS architecture design, Migration execution, Cost optimization, Documentation',
     'FIXED_PRICE', 10000000, 15000000, 90, '3-6_MONTHS', 'SINGLE_PROJECT', 'LEAD', 'URGENT', true, true,
     '["AWS", "Cloud Migration", "Terraform", "Infrastructure as Code", "Security"]',
     '["Kubernetes", "Cost Optimization", "Disaster Recovery"]',
     'AWS certification and migration experience required', 412, 22),
    
    ('cloudservices', 'DevOps', 'CI/CD Pipeline Setup',
     'Implement comprehensive CI/CD pipelines for microservices architecture.',
     'Jenkins/GitLab CI setup, Docker containerization, Kubernetes deployment, Automated testing integration, Monitoring setup',
     'FIXED_PRICE', 3000000, 4500000, 30, '1-3_MONTHS', 'SINGLE_PROJECT', 'INTERMEDIATE', 'HIGH', false, false,
     '["Jenkins", "Docker", "Kubernetes", "CI/CD", "GitLab"]',
     '["Helm", "Monitoring", "Security Scanning"]',
     'CI/CD implementation examples required', 167, 7),
    
    -- MobileFirst Projects
    ('mobilefirstltd', 'Mobile Apps', 'Cross-Platform Social App',
     'Build social networking app for iOS and Android using React Native.',
     'React Native app development, Social features (posts, likes, comments), Push notifications, Image sharing, In-app chat',
     'FIXED_PRICE', 8000000, 11000000, 90, '3-6_MONTHS', 'SINGLE_PROJECT', 'SENIOR', 'HIGH', false, true,
     '["React Native", "JavaScript", "Firebase", "Push Notifications"]',
     '["Redux", "Socket.io", "Social APIs"]',
     'Social app portfolio required', 298, 15),
    
    ('mobilefirstltd', 'Mobile Apps', 'E-Commerce Mobile App',
     'Native mobile apps for e-commerce platform with offline support.',
     'iOS and Android apps, Product catalog, Shopping cart, Payment integration, Order tracking, Offline mode',
     'FIXED_PRICE', 9000000, 12000000, 75, '3-6_MONTHS', 'SINGLE_PROJECT', 'SENIOR', 'HIGH', false, false,
     '["iOS", "Android", "E-Commerce", "Payment Integration", "Offline Sync"]',
     '["Swift", "Kotlin", "CoreData", "Room"]',
     'E-commerce app experience required', 267, 13),
    
    -- GameStudio Projects
    ('gamestudiopro', 'Design Projects', '3D Game Assets Creation',
     '3D modeling and animation for mobile game characters and environments.',
     '10 character models, 5 environment scenes, Animations for characters, Texturing and materials, Optimization for mobile',
     'FIXED_PRICE', 4000000, 6000000, 60, '3-6_MONTHS', 'SINGLE_PROJECT', 'INTERMEDIATE', 'MEDIUM', false, false,
     '["3D Modeling", "Blender", "Animation", "Texturing", "Game Assets"]',
     '["Unity", "Substance Painter", "Rigging"]',
     'Game asset portfolio required', 178, 8),
    
    ('gamestudiopro', 'Web Development', 'Multiplayer Game Backend',
     'Build scalable backend for real-time multiplayer mobile game.',
     'Real-time game server, Matchmaking system, Player data storage, Leaderboards, In-app purchases, Admin dashboard',
     'FIXED_PRICE', 7000000, 9000000, 75, '3-6_MONTHS', 'SINGLE_PROJECT', 'SENIOR', 'HIGH', false, false,
     '["Node.js", "WebSocket", "Redis", "PostgreSQL", "Game Development"]',
     '["Microservices", "Load Balancing", "Monitoring"]',
     'Multiplayer game backend experience required', 234, 11)
) AS proj_data (company_username, category_name, title, description, scope_of_work,
                budget_type, budget_min_cents, budget_max_cents, estimated_duration_days,
                timeline, project_type, experience_level, priority_level, is_urgent, is_featured,
                required_skills, preferred_skills, apply_instructions, views_count, days_ago)
JOIN project_categories pc ON pc.name = proj_data.category_name
WHERE u.username = proj_data.company_username
ON CONFLICT DO NOTHING;

-- =====================================================
-- BULK INSERT: 100+ ADDITIONAL JOBS (for pagination testing)
-- =====================================================
INSERT INTO jobs (
    company_id, category_id, title, description, responsibilities, requirements,
    job_type, experience_level, location, city, state, country, is_remote, remote_type,
    salary_min_cents, salary_max_cents, salary_currency, salary_period, show_salary,
    required_skills, preferred_skills, education_level, positions_available,
    company_name, company_size, industry, status, views_count, applications_count,
    created_at, published_at
)
WITH bulk_jobs AS (
    SELECT 
        'company_' || c.id AS company_username,
        (ARRAY['Software Development', 'DevOps & Infrastructure', 'Data Science & Analytics', 
               'Design & Creative', 'Quality Assurance'])[((ROW_NUMBER() OVER (ORDER BY c.id) - 1) % 5) + 1] AS category_name,
        (ARRAY['Senior Full Stack Engineer', 'React Developer', 'Python Backend Developer', 'Mobile App Developer',
               'DevOps Engineer', 'Data Scientist', 'QA Automation Engineer', 'UI/UX Designer',
               'Cloud Architect', 'Database Administrator', 'Security Engineer', 'System Administrator',
               'Frontend Developer', 'Backend Engineer', 'Machine Learning Engineer', 'Java Developer',
               'Go Developer', 'Rust Developer', 'GraphQL Developer', 'Microservices Architect'])[((ROW_NUMBER() OVER (ORDER BY c.id) - 1) % 20) + 1] AS title,
        'Seeking talented professional to join our growing team and make impact on our products.' AS description,
        'Build features, Collaborate with team, Code review, Performance optimization' AS responsibilities,
        'Required skills in tech stack, Team collaboration ability, Problem solving skills' AS requirements,
        'FULL_TIME' AS job_type,
        (ARRAY['JUNIOR', 'INTERMEDIATE', 'SENIOR', 'LEAD'])[((ROW_NUMBER() OVER (ORDER BY c.id) - 1) % 4) + 1] AS experience_level,
        (ARRAY['New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Seattle'])[((ROW_NUMBER() OVER (ORDER BY c.id) - 1) % 5) + 1] AS city,
        (ARRAY['NY', 'CA', 'CA', 'IL', 'WA'])[((ROW_NUMBER() OVER (ORDER BY c.id) - 1) % 5) + 1] AS state,
        true AS is_remote,
        (ARRAY['HYBRID', 'FULLY_REMOTE', 'ON_SITE'])[((ROW_NUMBER() OVER (ORDER BY c.id) - 1) % 3) + 1] AS remote_type,
        7000000 + ((ROW_NUMBER() OVER (ORDER BY c.id) % 20) * 500000) AS salary_min_cents,
        12000000 + ((ROW_NUMBER() OVER (ORDER BY c.id) % 20) * 500000) AS salary_max_cents,
        (ARRAY['React', 'Angular', 'Vue', 'Python', 'Java', 'Node.js', 'Go', 'Rust', 'AWS', 'Azure', 'GCP'])[((ROW_NUMBER() OVER (ORDER BY c.id) - 1) % 11) + 1] ||
        ', ' ||
        (ARRAY['Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch'])[(ROW_NUMBER() OVER (ORDER BY c.id) % 6) + 1] ||
        ', ' ||
        (ARRAY['REST API', 'GraphQL', 'Microservices', 'CI/CD', 'TDD', 'Agile'])[(ROW_NUMBER() OVER (ORDER BY c.id) % 6) + 1]
        AS required_skills,
        (ARRAY['TypeScript', 'Testing', 'Performance', 'Security'])[(ROW_NUMBER() OVER (ORDER BY c.id) % 4) + 1] 
        AS preferred_skills,
        (ROW_NUMBER() OVER (ORDER BY c.id) - 1) % 100 AS views_count,
        ((ROW_NUMBER() OVER (ORDER BY c.id) - 1) / 10 + 1) AS positions_available,
        NOW() - ((ROW_NUMBER() OVER (ORDER BY c.id) % 50)::INT || ' days')::INTERVAL AS created_at
    FROM companies c
    WHERE c.id NOT IN (SELECT company_id FROM jobs LIMIT 10)  -- Exclude first 10 companies already in jobs
    LIMIT 100
)
SELECT 
    c.id AS company_id,
    jc.id AS category_id,
    bj.title,
    bj.description,
    bj.responsibilities,
    bj.requirements,
    bj.job_type,
    bj.experience_level,
    (SELECT location FROM users WHERE id = c.user_id),
    bj.city,
    bj.state,
    'USA' AS country,
    bj.is_remote,
    bj.remote_type,
    bj.salary_min_cents,
    bj.salary_max_cents,
    'USD' AS salary_currency,
    'ANNUAL' AS salary_period,
    true AS show_salary,
    bj.required_skills::jsonb,
    bj.preferred_skills::jsonb,
    'BACHELOR' AS education_level,
    bj.positions_available,
    co.company_name,
    co.company_size,
    co.industry,
    'OPEN' AS status,
    bj.views_count,
    0 AS applications_count,
    bj.created_at,
    bj.created_at AS published_at
FROM bulk_jobs bj
JOIN companies c ON c.id = (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = bj.company_username) LIMIT 1)
JOIN companies co ON co.id = c.id
JOIN job_categories jc ON jc.name = bj.category_name
ON CONFLICT DO NOTHING;

-- =====================================================
-- BULK INSERT: 100+ ADDITIONAL PROJECTS (for pagination testing)
-- =====================================================
INSERT INTO projects (
    company_id, category_id, title, description, scope_of_work,
    budget_type, budget_min_cents, budget_max_cents, currency,
    estimated_duration_days, timeline, project_type, experience_level,
    priority_level, visibility, is_urgent, is_featured, status,
    required_skills, preferred_skills, apply_instructions,
    views_count, proposal_count, created_at, published_at
)
WITH bulk_projects AS (
    SELECT 
        'company_' || c.id AS company_username,
        (ARRAY['Web Development', 'Mobile Apps', 'Design Projects', 'Data & Analytics', 'DevOps'])[((ROW_NUMBER() OVER (ORDER BY c.id) - 1) % 5) + 1] AS category_name,
        (ARRAY['Build REST API', 'Redesign Website', 'Mobile App Development', 'Dashboard Creation',
               'Data Pipeline Setup', 'UI/UX Design', 'Performance Optimization', 'Security Audit',
               'Infrastructure Setup', 'Automation Implementation'])[((ROW_NUMBER() OVER (ORDER BY c.id) - 1) % 10) + 1] ||
        ' - ' || (ARRAY['MVP', 'Prototype', 'Scale', 'Refactor', 'Migrate'])[((ROW_NUMBER() OVER (ORDER BY c.id) - 1) % 5) + 1]
        AS title,
        'We need expert help with a critical project. Join our team and deliver excellence.' AS description,
        'Complete project delivery including code, documentation, and testing' AS scope_of_work,
        (ARRAY['FIXED_PRICE', 'HOURLY'])[((ROW_NUMBER() OVER (ORDER BY c.id) - 1) % 2) + 1] AS budget_type,
        2500000 + ((ROW_NUMBER() OVER (ORDER BY c.id) % 30) * 300000) AS budget_min_cents,
        5000000 + ((ROW_NUMBER() OVER (ORDER BY c.id) % 30) * 400000) AS budget_max_cents,
        (ARRAY[30, 45, 60, 90])[((ROW_NUMBER() OVER (ORDER BY c.id) - 1) % 4) + 1] AS estimated_duration_days,
        (ARRAY['1-3_MONTHS', '3-6_MONTHS', 'ASAP', 'FLEXIBLE'])[((ROW_NUMBER() OVER (ORDER BY c.id) - 1) % 4) + 1] AS timeline,
        (ARRAY['SINGLE_PROJECT', 'ONGOING'])[((ROW_NUMBER() OVER (ORDER BY c.id) - 1) % 2) + 1] AS project_type,
        (ARRAY['JUNIOR', 'INTERMEDIATE', 'SENIOR'])[((ROW_NUMBER() OVER (ORDER BY c.id) - 1) % 3) + 1] AS experience_level,
        (ARRAY['LOW', 'MEDIUM', 'HIGH', 'URGENT'])[((ROW_NUMBER() OVER (ORDER BY c.id) - 1) % 4) + 1] AS priority_level,
        ((ROW_NUMBER() OVER (ORDER BY c.id) - 1) % 2) = 0 AS is_urgent,
        ((ROW_NUMBER() OVER (ORDER BY c.id) - 1) % 3) = 0 AS is_featured,
        (ARRAY['React', 'Angular', 'Vue', 'Python', 'Java', 'Node.js', 'Go'])[((ROW_NUMBER() OVER (ORDER BY c.id) - 1) % 7) + 1] ||
        ', ' ||
        (ARRAY['Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB'])[(ROW_NUMBER() OVER (ORDER BY c.id) % 4) + 1]
        AS required_skills,
        (ARRAY['TypeScript', 'Testing', 'Performance'])[(ROW_NUMBER() OVER (ORDER BY c.id) % 3) + 1] 
        AS preferred_skills,
        'Submit your portfolio and relevant experience' AS apply_instructions,
        (ROW_NUMBER() OVER (ORDER BY c.id) - 1) % 200 AS views_count,
        ((ROW_NUMBER() OVER (ORDER BY c.id) - 1) / 10 + 1) AS proposal_count,
        NOW() - ((ROW_NUMBER() OVER (ORDER BY c.id) % 60)::INT || ' days')::INTERVAL AS created_at
    FROM companies c
    WHERE c.id NOT IN (SELECT company_id FROM projects LIMIT 10)  -- Exclude first 10 companies already in projects
    LIMIT 100
)
SELECT 
    c.id AS company_id,
    pc.id AS category_id,
    bp.title,
    bp.description,
    bp.scope_of_work,
    bp.budget_type,
    bp.budget_min_cents,
    bp.budget_max_cents,
    'USD' AS currency,
    bp.estimated_duration_days,
    bp.timeline,
    bp.project_type,
    bp.experience_level,
    bp.priority_level,
    'PUBLIC' AS visibility,
    bp.is_urgent,
    bp.is_featured,
    'OPEN' AS status,
    bp.required_skills::jsonb,
    bp.preferred_skills::jsonb,
    bp.apply_instructions,
    bp.views_count,
    bp.proposal_count,
    bp.created_at,
    bp.created_at AS published_at
FROM bulk_projects bp
JOIN companies c ON c.id = (SELECT id FROM companies WHERE user_id = (SELECT id FROM users WHERE username = bp.company_username) LIMIT 1)
JOIN project_categories pc ON pc.name = bp.category_name
ON CONFLICT DO NOTHING;

-- Verify insertions
DO $$
BEGIN
    RAISE NOTICE 'Extended work postings: % jobs, % projects',
        (SELECT COUNT(*) FROM jobs),
        (SELECT COUNT(*) FROM projects);
END $$;
