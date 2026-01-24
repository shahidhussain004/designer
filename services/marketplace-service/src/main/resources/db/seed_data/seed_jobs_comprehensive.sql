-- =====================================================
-- Comprehensive Seed Data for Marketplace Database
-- Tables: jobs, proposals, contracts, invoices, payments, payouts, milestones, time_entries, reviews, etc.
-- =====================================================

-- First, let me insert jobs for the companies we have
INSERT INTO jobs (
    company_id, category_id, title, description, responsibilities, requirements,
    job_type, experience_level, location, city, state, country, is_remote, remote_type,
    salary_min_cents, salary_max_cents, salary_currency, salary_period, show_salary,
    benefits, perks, required_skills, preferred_skills, education_level, certifications,
    positions_available, application_email, apply_instructions, status, views_count, 
    applications_count, is_featured, is_urgent, created_at, updated_at, published_at
) VALUES
-- TechCorp Jobs
(1, 1, 'Senior Full Stack Developer', 
 'We are looking for a senior full stack developer with 5+ years of experience in Node.js and React.',
 'Lead development of new features, mentor junior developers, participate in code reviews',
 'BS in Computer Science or equivalent, 5+ years experience with Node.js and React, experience with PostgreSQL',
 'FULL_TIME', 'SENIOR', 'New York, NY', 'New York', 'NY', 'USA', false, 'ON_SITE',
 7000000, 10000000, 'USD', 'ANNUAL', true,
 '[{"name": "Health Insurance", "description": "Full coverage"}, {"name": "401k", "description": "5% match"}, {"name": "PTO", "description": "20 days/year"}]'::jsonb,
 '[{"name": "Remote work flexibility", "description": "2 days/week hybrid"}, {"name": "Professional development", "description": "$2k/year"}]'::jsonb,
 '[{"skill": "Node.js", "level": "expert", "required": true, "years": 5}, {"skill": "React", "level": "expert", "required": true, "years": 4}, {"skill": "PostgreSQL", "level": "advanced", "required": true, "years": 3}]'::jsonb,
 '[{"skill": "Docker", "level": "intermediate"}, {"skill": "AWS", "level": "intermediate"}, {"skill": "GraphQL", "level": "beginner"}]'::jsonb,
 'BACHELOR', '[]'::jsonb,
 1, 'jobs@techcorp.example.com', 'Apply through our careers portal',
 'OPEN', 0, 0, true, false, NOW() - interval '30 days', NOW() - interval '30 days', NOW() - interval '28 days'),

(1, 1, 'React Developer', 
 'Join our frontend team to build beautiful and performant user interfaces for our e-commerce platform.',
 'Develop React components, optimize performance, collaborate with designers and backend developers',
 'Experience with React, JavaScript ES6+, CSS/SCSS, responsive design, git',
 'FULL_TIME', 'INTERMEDIATE', 'New York, NY', 'New York', 'NY', 'USA', true, 'HYBRID',
 5000000, 7500000, 'USD', 'ANNUAL', true,
 '[{"name": "Health Insurance"}, {"name": "Flexible hours"}]'::jsonb,
 '[{"name": "Home office stipend", "description": "$500"}]'::jsonb,
 '[{"skill": "React", "level": "intermediate", "required": true, "years": 2}, {"skill": "JavaScript", "level": "intermediate", "required": true, "years": 2}]'::jsonb,
 '[{"skill": "TypeScript"}, {"skill": "Next.js"}]'::jsonb,
 'BACHELOR', '[]'::jsonb,
 2, 'jobs@techcorp.example.com', 'Send resume to jobs@techcorp.example.com',
 'OPEN', 45, 3, false, false, NOW() - interval '20 days', NOW() - interval '20 days', NOW() - interval '18 days'),

-- InnovateLab Jobs
(2, 1, 'Backend Engineer', 
 'Build scalable backend systems for our SaaS platform used by thousands of customers.',
 'Design and implement APIs, optimize database queries, handle system scaling',
 'Experience with Java or Go, REST APIs, SQL databases, microservices',
 'FULL_TIME', 'INTERMEDIATE', 'San Francisco, CA', 'San Francisco', 'CA', 'USA', true, 'FULLY_REMOTE',
 6000000, 9000000, 'USD', 'ANNUAL', true,
 '[{"name": "Health/Dental/Vision"}, {"name": "Equity"}, {"name": "401k"}]'::jsonb,
 '[{"name": "Unlimited PTO"}, {"name": "Learning budget"}]'::jsonb,
 '[{"skill": "Java", "level": "advanced", "required": true, "years": 3}, {"skill": "SQL", "level": "advanced", "required": true, "years": 3}]'::jsonb,
 '[{"skill": "Kubernetes"}, {"skill": "Docker"}, {"skill": "Redis"}]'::jsonb,
 'BACHELOR', '[]'::jsonb,
 1, 'careers@innovatelab.example.com', '',
 'OPEN', 87, 12, true, false, NOW() - interval '45 days', NOW() - interval '45 days', NOW() - interval '43 days'),

-- DesignStudio Jobs
(3, 3, 'UX/UI Designer', 
 'Design beautiful and intuitive interfaces for our mobile applications. Work with a talented design and engineering team.',
 'Create wireframes and mockups, conduct user research, collaborate with developers to implement designs',
 'Portfolio with 3+ years of design experience, proficiency in Figma/Adobe XD, understanding of mobile design',
 'FULL_TIME', 'INTERMEDIATE', 'Chicago, IL', 'Chicago', 'IL', 'USA', true, 'HYBRID',
 5500000, 7000000, 'USD', 'ANNUAL', true,
 '[{"name": "Health Insurance"}, {"name": "Design tools budget"}]'::jsonb,
 '[{"name": "Work from anywhere", "description": "2 weeks/year remote"}, {"name": "Conference budget"}]'::jsonb,
 '[{"skill": "Figma", "level": "expert", "required": true, "years": 3}, {"skill": "UI Design", "level": "advanced", "required": true, "years": 3}, {"skill": "Prototyping", "level": "advanced", "required": true, "years": 2}]'::jsonb,
 '[{"skill": "User Research"}, {"skill": "Adobe Creative Suite"}, {"skill": "Sketch"}]'::jsonb,
 'BACHELOR', '[{"name": "HCI Certification"}]'::jsonb,
 1, 'jobs@designstudio.example.com', 'Portfolio link required',
 'OPEN', 56, 8, false, true, NOW() - interval '15 days', NOW() - interval '15 days', NOW() - interval '13 days'),

-- FinTechSolutions Jobs
(4, 1, 'DevOps Engineer', 
 'Build and maintain infrastructure for our financial platform handling millions in transactions daily.',
 'Manage CI/CD pipelines, optimize infrastructure, ensure system reliability and security',
 'Experience with Kubernetes, Docker, AWS or GCP, infrastructure as code (Terraform)',
 'FULL_TIME', 'SENIOR', 'New York, NY', 'New York', 'NY', 'USA', true, 'FULLY_REMOTE',
 8000000, 12000000, 'USD', 'ANNUAL', true,
 '[{"name": "Comprehensive health"}, {"name": "Stock options"}, {"name": "Signing bonus"}]'::jsonb,
 '[{"name": "Flexible hours"}, {"name": "Tech budget", "description": "$2000/year"}]'::jsonb,
 '[{"skill": "Kubernetes", "level": "expert", "required": true, "years": 4}, {"skill": "AWS", "level": "expert", "required": true, "years": 4}, {"skill": "Terraform", "level": "advanced", "required": true, "years": 2}]'::jsonb,
 '[{"skill": "GCP"}, {"skill": "Prometheus/Grafana"}, {"skill": "Linux kernel"}]'::jsonb,
 'BACHELOR', '[{"name": "CKA Certification"}]'::jsonb,
 1, 'careers@fintech.example.com', 'Phone screen with technical lead',
 'OPEN', 23, 2, true, false, NOW() - interval '60 days', NOW() - interval '60 days', NOW() - interval '58 days'),

-- HealthTech Jobs
(5, 1, 'Data Engineer', 
 'Build data pipelines and analytics infrastructure for healthcare application.',
 'Design ETL pipelines, optimize data warehouses, create dashboards and reporting tools',
 'Experience with Python, SQL, Apache Spark or Airflow, data modeling',
 'FULL_TIME', 'INTERMEDIATE', 'Los Angeles, CA', 'Los Angeles', 'CA', 'USA', false, 'ON_SITE',
 6500000, 8500000, 'USD', 'ANNUAL', true,
 '[{"name": "Health+Dental+Vision"}, {"name": "401k"}]'::jsonb,
 '[{"name": "Healthcare discount"}, {"name": "Gym membership"}]'::jsonb,
 '[{"skill": "Python", "level": "advanced", "required": true, "years": 3}, {"skill": "SQL", "level": "expert", "required": true, "years": 3}, {"skill": "Apache Spark", "level": "intermediate", "required": false, "years": 1}]'::jsonb,
 '[{"skill": "Tableau"}, {"skill": "Airflow"}, {"skill": "AWS EMR"}]'::jsonb,
 'BACHELOR', '[]'::jsonb,
 1, 'jobs@healthtech.example.com', '',
 'OPEN', 34, 5, false, false, NOW() - interval '25 days', NOW() - interval '25 days', NOW() - interval '23 days');

-- Verify inserts
SELECT COUNT(*) as job_count FROM jobs;
