-- V16__create_jobs_for_employment.sql
-- Create new 'jobs' and 'job_categories' tables for traditional employment feature
-- This is separate from 'projects' which handles freelance/gig work

-- ============================================================================
-- STEP 1: Create job_categories table for employment
-- ============================================================================

CREATE TABLE job_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes
CREATE INDEX idx_job_categories_slug ON job_categories(slug);
CREATE INDEX idx_job_categories_active ON job_categories(is_active);
CREATE INDEX idx_job_categories_order ON job_categories(display_order);

-- Add comment
COMMENT ON TABLE job_categories IS 'Job categories for traditional employment postings';

-- ============================================================================
-- STEP 2: Create jobs table for traditional employment
-- ============================================================================

CREATE TABLE jobs (
    id BIGSERIAL PRIMARY KEY,
    employer_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id BIGINT REFERENCES job_categories(id) ON DELETE SET NULL,
    
    -- Basic job information
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    responsibilities TEXT,
    requirements TEXT,
    
    -- Job details
    job_type VARCHAR(50) NOT NULL DEFAULT 'FULL_TIME', -- FULL_TIME, PART_TIME, CONTRACT, TEMPORARY, INTERNSHIP
    employment_type VARCHAR(50) DEFAULT 'PERMANENT', -- PERMANENT, CONTRACT, TEMPORARY
    experience_level VARCHAR(50) DEFAULT 'INTERMEDIATE', -- ENTRY, INTERMEDIATE, SENIOR, LEAD, EXECUTIVE
    
    -- Location
    location VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    is_remote BOOLEAN DEFAULT FALSE,
    remote_type VARCHAR(50), -- FULLY_REMOTE, HYBRID, ON_SITE
    
    -- Compensation
    salary_min DECIMAL(12, 2),
    salary_max DECIMAL(12, 2),
    salary_currency VARCHAR(3) DEFAULT 'USD',
    salary_period VARCHAR(20) DEFAULT 'ANNUAL', -- HOURLY, DAILY, WEEKLY, MONTHLY, ANNUAL
    show_salary BOOLEAN DEFAULT TRUE,
    
    -- Benefits and perks
    benefits text[], -- array of benefits
    perks text[], -- array of perks
    
    -- Skills and qualifications
    required_skills text[], -- array of required skills
    preferred_skills text[], -- array of preferred skills
    education_level VARCHAR(50), -- HIGH_SCHOOL, ASSOCIATE, BACHELOR, MASTER, PHD
    certifications text[], -- array of required certifications
    
    -- Application details
    application_deadline TIMESTAMP,
    application_email VARCHAR(255),
    application_url TEXT,
    apply_instructions TEXT,
    
    -- Company information
    company_name VARCHAR(255),
    company_description TEXT,
    company_logo_url TEXT,
    company_website TEXT,
    company_size VARCHAR(50), -- STARTUP, SMALL, MEDIUM, LARGE, ENTERPRISE
    industry VARCHAR(100),
    
    -- Employment details
    start_date DATE,
    positions_available INTEGER DEFAULT 1,
    travel_requirement VARCHAR(50), -- NONE, OCCASIONAL, FREQUENT
    security_clearance_required BOOLEAN DEFAULT FALSE,
    visa_sponsorship BOOLEAN DEFAULT FALSE,
    
    -- Status and tracking
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- DRAFT, ACTIVE, PAUSED, CLOSED, FILLED
    views_count INTEGER DEFAULT 0,
    applications_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_urgent BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    closed_at TIMESTAMP,
    deleted_at TIMESTAMP,
    
    CONSTRAINT check_job_type CHECK (job_type IN ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY', 'INTERNSHIP')),
    CONSTRAINT check_employment_type CHECK (employment_type IN ('PERMANENT', 'CONTRACT', 'TEMPORARY')),
    CONSTRAINT check_experience_level CHECK (experience_level IN ('ENTRY', 'INTERMEDIATE', 'SENIOR', 'LEAD', 'EXECUTIVE')),
    CONSTRAINT check_remote_type CHECK (remote_type IN ('FULLY_REMOTE', 'HYBRID', 'ON_SITE', NULL)),
    CONSTRAINT check_status CHECK (status IN ('DRAFT', 'ACTIVE', 'PAUSED', 'CLOSED', 'FILLED')),
    CONSTRAINT check_salary_range CHECK (salary_max IS NULL OR salary_min IS NULL OR salary_max >= salary_min)
);

-- Add indexes for better query performance
CREATE INDEX idx_jobs_employer ON jobs(employer_id);
CREATE INDEX idx_jobs_category ON jobs(category_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_job_type ON jobs(job_type);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_is_remote ON jobs(is_remote);
CREATE INDEX idx_jobs_created ON jobs(created_at DESC);
CREATE INDEX idx_jobs_published ON jobs(published_at DESC);
CREATE INDEX idx_jobs_required_skills ON jobs USING gin(required_skills);
CREATE INDEX idx_jobs_title_search ON jobs USING gin(to_tsvector('english', title || ' ' || description));
CREATE INDEX idx_jobs_status_published ON jobs(status, published_at DESC);
CREATE INDEX idx_jobs_featured ON jobs(is_featured) WHERE is_featured = TRUE;

-- Add comments
COMMENT ON TABLE jobs IS 'Traditional employment job postings';
COMMENT ON COLUMN jobs.employer_id IS 'User who posted the job (employer/recruiter)';
COMMENT ON COLUMN jobs.job_type IS 'Type of employment: full-time, part-time, contract, etc.';
COMMENT ON COLUMN jobs.remote_type IS 'Remote work arrangement';
COMMENT ON COLUMN jobs.salary_period IS 'Pay period for salary (hourly, monthly, annual, etc.)';

-- ============================================================================
-- STEP 3: Create job_applications table
-- ============================================================================

CREATE TABLE job_applications (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    applicant_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Application details
    cover_letter TEXT,
    resume_url TEXT,
    portfolio_url TEXT,
    linkedin_url TEXT,
    additional_documents text[], -- array of document URLs
    
    -- Answers to screening questions
    answers JSONB, -- flexible structure for custom questions
    
    -- Status tracking
    status VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED', -- SUBMITTED, REVIEWING, SHORTLISTED, INTERVIEWING, OFFERED, REJECTED, WITHDRAWN, ACCEPTED
    recruiter_notes TEXT,
    rejection_reason TEXT,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    
    UNIQUE(job_id, applicant_id), -- one application per user per job
    CONSTRAINT check_application_status CHECK (status IN ('SUBMITTED', 'REVIEWING', 'SHORTLISTED', 'INTERVIEWING', 'OFFERED', 'REJECTED', 'WITHDRAWN', 'ACCEPTED'))
);

-- Add indexes
CREATE INDEX idx_job_applications_job ON job_applications(job_id);
CREATE INDEX idx_job_applications_applicant ON job_applications(applicant_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_job_applications_created ON job_applications(created_at DESC);

COMMENT ON TABLE job_applications IS 'Applications submitted by candidates for job postings';

-- ============================================================================
-- STEP 4: Create triggers for maintaining counts
-- ============================================================================

-- Function to increment applications count
CREATE OR REPLACE FUNCTION increment_job_applications_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE jobs
    SET applications_count = applications_count + 1
    WHERE id = NEW.job_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to decrement applications count
CREATE OR REPLACE FUNCTION decrement_job_applications_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE jobs
    SET applications_count = GREATEST(0, applications_count - 1)
    WHERE id = OLD.job_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER increment_job_applications_count_trigger
    AFTER INSERT ON job_applications
    FOR EACH ROW
    EXECUTE FUNCTION increment_job_applications_count();

CREATE TRIGGER decrement_job_applications_count_trigger
    AFTER DELETE ON job_applications
    FOR EACH ROW
    EXECUTE FUNCTION decrement_job_applications_count();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_jobs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_jobs_updated_at_trigger
    BEFORE UPDATE ON jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_jobs_updated_at();

CREATE TRIGGER update_job_categories_updated_at_trigger
    BEFORE UPDATE ON job_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_jobs_updated_at();

-- ============================================================================
-- STEP 5: Insert seed data for job categories
-- ============================================================================

INSERT INTO job_categories (name, slug, description, icon, display_order, is_active) VALUES
    ('Software Engineering', 'software-engineering', 'Software development, programming, and engineering roles', 'Code', 1, true),
    ('Data Science & Analytics', 'data-science-analytics', 'Data science, analytics, and machine learning positions', 'BarChart', 2, true),
    ('Product & Design', 'product-design', 'Product management, UX/UI design roles', 'Palette', 3, true),
    ('Marketing & Sales', 'marketing-sales', 'Marketing, sales, and business development positions', 'TrendingUp', 4, true),
    ('Customer Success', 'customer-success', 'Customer support and success roles', 'Users', 5, true),
    ('DevOps & Infrastructure', 'devops-infrastructure', 'DevOps, cloud, and infrastructure engineering', 'Server', 6, true),
    ('HR & Operations', 'hr-operations', 'Human resources and operations roles', 'Briefcase', 7, true),
    ('Finance & Accounting', 'finance-accounting', 'Finance, accounting, and controller positions', 'DollarSign', 8, true),
    ('Legal & Compliance', 'legal-compliance', 'Legal counsel and compliance roles', 'Scale', 9, true),
    ('Executive & Management', 'executive-management', 'C-level and senior management positions', 'Award', 10, true);

-- ============================================================================
-- STEP 6: Insert seed job postings
-- ============================================================================

-- Insert sample jobs (assuming user with id=1 exists as employer)
INSERT INTO jobs (
    employer_id, category_id, title, description, responsibilities, requirements,
    job_type, employment_type, experience_level,
    location, city, state, country, is_remote, remote_type,
    salary_min, salary_max, salary_currency, salary_period, show_salary,
    benefits, required_skills, preferred_skills, education_level,
    company_name, company_description, company_size, industry,
    positions_available, status, is_featured, published_at
) VALUES
(
    1,
    (SELECT id FROM job_categories WHERE slug = 'software-engineering'),
    'Senior Full Stack Developer',
    'We are looking for an experienced Full Stack Developer to join our growing team. You will work on building scalable web applications using modern technologies.',
    E'• Design and develop full-stack web applications\n• Collaborate with cross-functional teams\n• Write clean, maintainable code\n• Participate in code reviews\n• Mentor junior developers',
    E'• 5+ years of experience in full-stack development\n• Proficiency in React, Node.js, and TypeScript\n• Experience with PostgreSQL or similar databases\n• Strong understanding of REST APIs and microservices\n• Excellent problem-solving skills',
    'FULL_TIME',
    'PERMANENT',
    'SENIOR',
    'Remote - US',
    'San Francisco',
    'California',
    'USA',
    true,
    'FULLY_REMOTE',
    120000.00,
    180000.00,
    'USD',
    'ANNUAL',
    true,
    ARRAY['Health Insurance', 'Dental Insurance', '401(k) Matching', 'Unlimited PTO', 'Remote Work', 'Professional Development Budget'],
    ARRAY['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Docker', 'AWS'],
    ARRAY['GraphQL', 'Kubernetes', 'Redis', 'Next.js'],
    'BACHELOR',
    'TechCorp Inc.',
    'TechCorp is a leading software company building innovative solutions for enterprises.',
    'MEDIUM',
    'Technology',
    2,
    'ACTIVE',
    true,
    CURRENT_TIMESTAMP
),
(
    1,
    (SELECT id FROM job_categories WHERE slug = 'data-science-analytics'),
    'Data Scientist',
    'Join our data team to analyze complex datasets and build machine learning models that drive business decisions.',
    E'• Develop and deploy machine learning models\n• Analyze large datasets to extract insights\n• Collaborate with stakeholders to define requirements\n• Create data visualizations and reports\n• Optimize model performance',
    E'• 3+ years of experience in data science\n• Strong proficiency in Python and SQL\n• Experience with machine learning libraries (scikit-learn, TensorFlow, PyTorch)\n• Knowledge of statistical analysis and modeling\n• Excellent communication skills',
    'FULL_TIME',
    'PERMANENT',
    'INTERMEDIATE',
    'New York, NY (Hybrid)',
    'New York',
    'New York',
    'USA',
    false,
    'HYBRID',
    100000.00,
    150000.00,
    'USD',
    'ANNUAL',
    true,
    ARRAY['Health Insurance', 'Stock Options', 'Flexible Hours', 'Learning Budget', 'Gym Membership'],
    ARRAY['Python', 'SQL', 'Machine Learning', 'Statistics', 'Pandas', 'NumPy'],
    ARRAY['Deep Learning', 'Big Data', 'Spark', 'Cloud Platforms'],
    'MASTER',
    'DataCorp Analytics',
    'DataCorp helps companies leverage their data for better decision-making.',
    'LARGE',
    'Analytics',
    1,
    'ACTIVE',
    true,
    CURRENT_TIMESTAMP
),
(
    1,
    (SELECT id FROM job_categories WHERE slug = 'product-design'),
    'Senior UX Designer',
    'We are seeking a talented UX Designer to create intuitive and beautiful user experiences for our products.',
    E'• Design user interfaces for web and mobile applications\n• Conduct user research and usability testing\n• Create wireframes, prototypes, and high-fidelity mockups\n• Collaborate with product managers and developers\n• Maintain design systems and style guides',
    E'• 4+ years of experience in UX/UI design\n• Proficiency in Figma or similar design tools\n• Strong portfolio demonstrating design process\n• Understanding of user-centered design principles\n• Excellent visual design skills',
    'FULL_TIME',
    'PERMANENT',
    'SENIOR',
    'Remote - Global',
    NULL,
    NULL,
    'Global',
    true,
    'FULLY_REMOTE',
    90000.00,
    130000.00,
    'USD',
    'ANNUAL',
    true,
    ARRAY['Health Insurance', 'Remote Work', 'Flexible Hours', 'Equipment Budget', 'Conference Budget'],
    ARRAY['Figma', 'User Research', 'Prototyping', 'UI Design', 'Design Systems'],
    ARRAY['After Effects', 'Principle', 'HTML/CSS', 'Accessibility'],
    'BACHELOR',
    'DesignHub',
    'DesignHub creates award-winning digital experiences for global brands.',
    'SMALL',
    'Design',
    1,
    'ACTIVE',
    false,
    CURRENT_TIMESTAMP
),
(
    1,
    (SELECT id FROM job_categories WHERE slug = 'devops-infrastructure'),
    'DevOps Engineer',
    'Looking for a DevOps engineer to help build and maintain our cloud infrastructure and CI/CD pipelines.',
    E'• Design and implement CI/CD pipelines\n• Manage cloud infrastructure (AWS/Azure/GCP)\n• Automate deployment processes\n• Monitor system performance and reliability\n• Implement security best practices',
    E'• 3+ years of experience in DevOps or similar role\n• Strong knowledge of Docker and Kubernetes\n• Experience with cloud platforms (AWS, Azure, or GCP)\n• Proficiency in scripting (Python, Bash, or PowerShell)\n• Understanding of infrastructure as code (Terraform, CloudFormation)',
    'FULL_TIME',
    'PERMANENT',
    'INTERMEDIATE',
    'Austin, TX (Hybrid)',
    'Austin',
    'Texas',
    'USA',
    false,
    'HYBRID',
    110000.00,
    160000.00,
    'USD',
    'ANNUAL',
    true,
    ARRAY['Health Insurance', '401(k)', 'Flexible Schedule', 'Certification Support', 'Home Office Stipend'],
    ARRAY['Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Terraform', 'Linux'],
    ARRAY['Ansible', 'Jenkins', 'Prometheus', 'Grafana'],
    'BACHELOR',
    'CloudScale Solutions',
    'CloudScale provides scalable cloud solutions for enterprise clients.',
    'MEDIUM',
    'Cloud Computing',
    1,
    'ACTIVE',
    false,
    CURRENT_TIMESTAMP
),
(
    1,
    (SELECT id FROM job_categories WHERE slug = 'marketing-sales'),
    'Marketing Manager',
    'Lead our marketing efforts to drive brand awareness and customer acquisition.',
    E'• Develop and execute marketing strategies\n• Manage marketing campaigns across channels\n• Analyze campaign performance and ROI\n• Oversee content creation and social media\n• Collaborate with sales team',
    E'• 5+ years of experience in marketing\n• Proven track record of successful campaigns\n• Strong analytical and data-driven mindset\n• Excellent written and verbal communication\n• Experience with marketing automation tools',
    'FULL_TIME',
    'PERMANENT',
    'SENIOR',
    'Boston, MA',
    'Boston',
    'Massachusetts',
    'USA',
    false,
    'ON_SITE',
    85000.00,
    120000.00,
    'USD',
    'ANNUAL',
    true,
    ARRAY['Health Insurance', 'Dental', 'Vision', '401(k)', 'Commuter Benefits', 'PTO'],
    ARRAY['Digital Marketing', 'SEO', 'Content Marketing', 'Analytics', 'Marketing Automation'],
    ARRAY['Google Ads', 'HubSpot', 'Salesforce', 'Social Media Marketing'],
    'BACHELOR',
    'MarketPro',
    'MarketPro is a fast-growing marketing agency serving B2B clients.',
    'SMALL',
    'Marketing',
    1,
    'ACTIVE',
    false,
    CURRENT_TIMESTAMP
);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
DECLARE
    job_count INTEGER;
    category_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO job_count FROM jobs;
    SELECT COUNT(*) INTO category_count FROM job_categories;
    
    RAISE NOTICE '=== Migration V16 Completed Successfully ===';
    RAISE NOTICE 'Created new tables for traditional employment:';
    RAISE NOTICE '  - job_categories (% categories)', category_count;
    RAISE NOTICE '  - jobs (% sample jobs)', job_count;
    RAISE NOTICE '  - job_applications';
    RAISE NOTICE 'Triggers created for application count tracking';
END $$;
