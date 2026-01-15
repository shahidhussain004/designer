-- =====================================================
-- V1: Create Core Users Table & Role-Specific Entity Tables
-- Description: Core user management with proper relational design
--              - Users table for authentication/credentials
--              - Companies and Freelancers tables for role-specific data
-- =====================================================

-- Base Users Table (Authentication & Common Profile Data)
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'FREELANCER',
    
    -- Profile
    full_name VARCHAR(100),
    phone VARCHAR(20),
    bio TEXT,
    profile_image_url VARCHAR(500),
    location VARCHAR(100),
    
    -- Status
    email_verified BOOLEAN DEFAULT FALSE NOT NULL,
    identity_verified BOOLEAN DEFAULT FALSE NOT NULL,
    identity_verified_at TIMESTAMP,
    verification_status VARCHAR(20) DEFAULT 'UNVERIFIED',
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    
    -- Stripe (common to both types)
    stripe_customer_id VARCHAR(100),
    stripe_account_id VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_role CHECK (role IN ('FREELANCER', 'COMPANY', 'ADMIN')),
    CONSTRAINT chk_verification_status CHECK (verification_status IN ('UNVERIFIED', 'VERIFIED', 'REJECTED'))
);

-- Companies Table (Role-Specific Entity Table for COMPANY users)
CREATE TABLE IF NOT EXISTS companies (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Company Details
    company_name VARCHAR(255) NOT NULL,
    company_type VARCHAR(100),
    industry VARCHAR(100),
    website_url VARCHAR(500),
    company_size VARCHAR(50), -- STARTUP, SMALL, MEDIUM, LARGE, ENTERPRISE
    registration_number VARCHAR(100),
    tax_id VARCHAR(100),
    
    -- Company Contact
    phone VARCHAR(20),
    headquarters_location VARCHAR(255),
    
    -- Company Metrics
    rating_avg NUMERIC(3,1) DEFAULT 0.0,
    rating_count INTEGER DEFAULT 0,
    total_projects_posted INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_company_size CHECK (company_size IN ('STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE'))
);

-- Freelancers Table (Role-Specific Entity Table for FREELANCER users)
CREATE TABLE IF NOT EXISTS freelancers (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Professional Info
    hourly_rate DECIMAL(10,2),
    experience_years INTEGER,
    headline VARCHAR(255),
    portfolio_url VARCHAR(500),
    github_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    
    -- Skills (stored as JSON)
    skills JSON DEFAULT '[]'::json,
    certifications JSON DEFAULT '[]'::json,
    languages JSON DEFAULT '[]'::json,
    
    -- Freelancer Metrics
    rating_avg NUMERIC(3,1) DEFAULT 0.0,
    rating_count INTEGER DEFAULT 0,
    completion_rate NUMERIC(5,2) DEFAULT 0.0,
    response_rate NUMERIC(5,2),
    response_time_hours INTEGER,
    total_earnings NUMERIC(15,2) DEFAULT 0.0,
    total_projects_completed INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance on Users table
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);

-- Create indexes for Companies table
CREATE INDEX IF NOT EXISTS idx_companies_user_id ON companies(user_id);
CREATE INDEX IF NOT EXISTS idx_companies_company_name ON companies(company_name);
CREATE INDEX IF NOT EXISTS idx_companies_created_at ON companies(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_companies_industry ON companies(industry);

-- Create indexes for Freelancers table
CREATE INDEX IF NOT EXISTS idx_freelancers_user_id ON freelancers(user_id);
CREATE INDEX IF NOT EXISTS idx_freelancers_hourly_rate ON freelancers(hourly_rate);
CREATE INDEX IF NOT EXISTS idx_freelancers_created_at ON freelancers(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_freelancers_completion_rate ON freelancers(completion_rate DESC);

-- Create trigger for users.updated_at
CREATE OR REPLACE FUNCTION update_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_users_updated_at();

-- Create trigger for companies.updated_at
CREATE OR REPLACE FUNCTION update_companies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_companies_updated_at
BEFORE UPDATE ON companies
FOR EACH ROW
EXECUTE FUNCTION update_companies_updated_at();

-- Create trigger for freelancers.updated_at
CREATE OR REPLACE FUNCTION update_freelancers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_freelancers_updated_at
BEFORE UPDATE ON freelancers
FOR EACH ROW
EXECUTE FUNCTION update_freelancers_updated_at();

COMMENT ON TABLE users IS 'Base users table for authentication and common profile data';
COMMENT ON TABLE companies IS 'Company-specific profile data (role-specific entity table)';
COMMENT ON TABLE freelancers IS 'Freelancer-specific profile data (role-specific entity table)';
COMMENT ON COLUMN users.role IS 'User role: FREELANCER, COMPANY, or ADMIN';
COMMENT ON COLUMN users.verification_status IS 'Identity verification status: UNVERIFIED, VERIFIED, REJECTED';
