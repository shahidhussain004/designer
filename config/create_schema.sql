-- =====================================================
-- Marketplace Platform - Complete PostgreSQL Schema
-- Version: 2.0 - Updated for full seed compatibility
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- REFERENCE DATA TABLES
-- =====================================================

-- Experience Levels
CREATE TABLE IF NOT EXISTS experience_levels (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    years_min INT DEFAULT 0,
    years_max INT DEFAULT 99,
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Job Categories
CREATE TABLE IF NOT EXISTS job_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Project Categories
CREATE TABLE IF NOT EXISTS project_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) UNIQUE NOT NULL,
    slug VARCHAR(150) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Skills
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50),
    is_verified BOOLEAN DEFAULT false,
    endorsement_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- USER TABLES
-- =====================================================

-- Users (Admin, Company, Freelancer)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK(role IN ('ADMIN', 'COMPANY', 'FREELANCER')),
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    bio TEXT,
    profile_image_url TEXT,
    location VARCHAR(255),
    email_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Companies
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    company_name VARCHAR(255) NOT NULL,
    company_type VARCHAR(50),
    industry VARCHAR(100),
    website_url TEXT,
    company_size VARCHAR(50),
    phone VARCHAR(20),
    headquarters_location VARCHAR(255),
    total_projects_posted INT DEFAULT 0,
    total_spent_cents BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_created_at ON companies(created_at DESC);

-- Freelancers
CREATE TABLE IF NOT EXISTS freelancers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hourly_rate_cents INT,
    experience_years INT DEFAULT 0,
    headline TEXT,
    skills JSONB DEFAULT '[]'::jsonb,
    languages JSONB DEFAULT '[]'::jsonb,
    completion_rate DECIMAL(5,2) DEFAULT 95.0,
    total_earnings_cents BIGINT DEFAULT 0,
    total_projects_completed INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_freelancers_user_id ON freelancers(user_id);
CREATE INDEX IF NOT EXISTS idx_freelancers_created_at ON freelancers(created_at DESC);

-- =====================================================
-- JOB & PROJECT TABLES
-- =====================================================

-- Jobs (Traditional Job Postings)
CREATE TABLE IF NOT EXISTS jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    category_id INT REFERENCES job_categories(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    responsibilities TEXT,
    requirements TEXT,
    job_type VARCHAR(50) NOT NULL,
    experience_level VARCHAR(50),
    location VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    is_remote BOOLEAN DEFAULT false,
    remote_type VARCHAR(50),
    salary_min_cents INT,
    salary_max_cents INT,
    salary_currency VARCHAR(10),
    salary_period VARCHAR(50),
    show_salary BOOLEAN DEFAULT false,
    required_skills JSONB DEFAULT '[]'::jsonb,
    preferred_skills JSONB DEFAULT '[]'::jsonb,
    education_level VARCHAR(50),
    positions_available INT DEFAULT 1,
    company_name VARCHAR(255),
    company_size VARCHAR(50),
    industry VARCHAR(100),
    status VARCHAR(50) DEFAULT 'OPEN',
    views_count INT DEFAULT 0,
    applications_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    published_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_category ON jobs(category_id);

-- Projects (Freelance Projects)
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    category_id INT REFERENCES project_categories(id),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    scope_of_work TEXT,
    budget_type VARCHAR(50),
    budget_min_cents INT,
    budget_max_cents INT,
    currency VARCHAR(10) DEFAULT 'USD',
    estimated_duration_days INT,
    timeline VARCHAR(50),
    project_type VARCHAR(50),
    experience_level VARCHAR(50),
    priority_level VARCHAR(50),
    visibility VARCHAR(50) DEFAULT 'PUBLIC',
    is_urgent BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'OPEN',
    required_skills JSONB DEFAULT '[]'::jsonb,
    preferred_skills JSONB DEFAULT '[]'::jsonb,
    apply_instructions TEXT,
    views_count INT DEFAULT 0,
    proposal_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    published_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_company_id ON projects(company_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category_id);

-- =====================================================
-- PORTFOLIO & REVIEWS
-- =====================================================

-- Portfolio Items
CREATE TABLE IF NOT EXISTS portfolio_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES freelancers(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    thumbnail_url TEXT,
    project_url TEXT,
    github_url TEXT,
    live_url TEXT,
    skills_demonstrated JSONB DEFAULT '[]'::jsonb,
    tools_used JSONB DEFAULT '[]'::jsonb,
    technologies JSONB DEFAULT '[]'::jsonb,
    project_category VARCHAR(100),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    display_order INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_portfolio_user_id ON portfolio_items(user_id);
CREATE INDEX IF NOT EXISTS idx_portfolio_created_at ON portfolio_items(created_at DESC);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewed_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    rating DECIMAL(3,1) NOT NULL,
    title VARCHAR(255),
    comment TEXT,
    is_for_freelancer BOOLEAN DEFAULT true,
    status VARCHAR(50) DEFAULT 'PUBLISHED',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_reviewed_user_id ON reviews(reviewed_user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_reviewer_id ON reviews(reviewer_id);

-- =====================================================
-- PROPOSALS & CONTRACTS
-- =====================================================

-- Proposals
CREATE TABLE IF NOT EXISTS proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    freelancer_id UUID NOT NULL REFERENCES freelancers(user_id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(user_id) ON DELETE CASCADE,
    cover_letter TEXT,
    proposed_rate_cents INT,
    proposed_duration_days INT,
    status VARCHAR(50) DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_proposals_freelancer_id ON proposals(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_proposals_job_id ON proposals(job_id);
CREATE INDEX IF NOT EXISTS idx_proposals_project_id ON proposals(project_id);

-- Contracts
CREATE TABLE IF NOT EXISTS contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
    job_id UUID REFERENCES jobs(id) ON DELETE SET NULL,
    freelancer_id UUID NOT NULL REFERENCES freelancers(user_id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(user_id) ON DELETE CASCADE,
    proposal_id UUID REFERENCES proposals(id) ON DELETE SET NULL,
    agreed_rate_cents INT,
    agreed_duration_days INT,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    description TEXT,
    terms TEXT,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contracts_freelancer_id ON contracts(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_contracts_company_id ON contracts(company_id);

-- =====================================================
-- MILESTONES & PAYMENTS
-- =====================================================

-- Milestones
CREATE TABLE IF NOT EXISTS milestones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    amount_cents INT NOT NULL,
    due_date TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_milestones_contract_id ON milestones(contract_id);

-- Payments
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
    milestone_id UUID REFERENCES milestones(id) ON DELETE SET NULL,
    payer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    payee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    amount_cents INT NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    status VARCHAR(50) DEFAULT 'PENDING',
    method VARCHAR(50),
    transaction_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_payer_id ON payments(payer_id);
CREATE INDEX IF NOT EXISTS idx_payments_payee_id ON payments(payee_id);

-- =====================================================
-- MESSAGING & NOTIFICATIONS
-- =====================================================

-- Message Threads
CREATE TABLE IF NOT EXISTS message_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject VARCHAR(255),
    created_by_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID NOT NULL REFERENCES message_threads(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_thread_id ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);

-- =====================================================
-- TIME TRACKING
-- =====================================================

-- Time Entries
CREATE TABLE IF NOT EXISTS time_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
    freelancer_id UUID NOT NULL REFERENCES freelancers(user_id) ON DELETE CASCADE,
    date_worked DATE NOT NULL,
    hours_worked DECIMAL(5,2) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'PENDING',
    approved_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_time_entries_contract_id ON time_entries(contract_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_freelancer_id ON time_entries(freelancer_id);

-- =====================================================
-- JOB APPLICATIONS & FAVORITES
-- =====================================================

-- Job Applications
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    freelancer_id UUID NOT NULL REFERENCES freelancers(user_id) ON DELETE CASCADE,
    cover_letter TEXT,
    status VARCHAR(50) DEFAULT 'SUBMITTED',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_freelancer_id ON job_applications(freelancer_id);

-- Favorites
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    favorite_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);

-- =====================================================
-- USER PREFERENCES & SETTINGS
-- =====================================================

-- User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT true,
    push_notifications BOOLEAN DEFAULT true,
    language VARCHAR(10) DEFAULT 'en',
    theme VARCHAR(50) DEFAULT 'light',
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- AUDIT & LOGGING
-- =====================================================

-- Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100),
    entity_id VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
