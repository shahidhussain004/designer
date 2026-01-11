-- =====================================================
-- V1: Create Core Users Table
-- Description: Core user management with support for multiple user types
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) NOT NULL,
    role VARCHAR(20) DEFAULT 'FREELANCER',
    
    -- Profile
    full_name VARCHAR(100),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    phone_number VARCHAR(20),
    bio TEXT,
    profile_image_url VARCHAR(500),
    location VARCHAR(100),
    
    -- Professional Info
    hourly_rate DECIMAL(10,2),
    experience_years INTEGER,
    headline VARCHAR(255),
    portfolio_url VARCHAR(500),
    github_url VARCHAR(500),
    linkedin_url VARCHAR(500),
    
    -- Skills (stored as JSON for Hibernate compatibility)
    skills JSON DEFAULT '[]'::json,
    certifications JSON DEFAULT '[]'::json,
    languages JSON DEFAULT '[]'::json,
    
    -- Status
    email_verified BOOLEAN DEFAULT FALSE NOT NULL,
    identity_verified BOOLEAN DEFAULT FALSE NOT NULL,
    identity_verified_at TIMESTAMP,
    verification_status VARCHAR(20) DEFAULT 'UNVERIFIED',
    is_active BOOLEAN DEFAULT TRUE NOT NULL,
    
    -- Ratings
    rating_avg DECIMAL(3,2) DEFAULT 0.0,
    rating_count INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.0,
    response_rate DECIMAL(5,2),
    response_time_hours INTEGER,
    
    -- Stripe
    stripe_customer_id VARCHAR(100),
    stripe_account_id VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    
    -- Constraints
    CONSTRAINT chk_user_type CHECK (user_type IN ('COMPANY', 'FREELANCER', 'ADMIN')),
    CONSTRAINT chk_role CHECK (role IN ('FREELANCER', 'COMPANY', 'ADMIN')),
    CONSTRAINT chk_verification_status CHECK (verification_status IN ('UNVERIFIED', 'VERIFIED', 'REJECTED'))
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_user_type ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);

-- Create trigger for updated_at
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

COMMENT ON TABLE users IS 'Core users table for all user types';
COMMENT ON COLUMN users.user_type IS 'User type: COMPANY, FREELANCER, or ADMIN';
COMMENT ON COLUMN users.role IS 'JPA mapped role field';
COMMENT ON COLUMN users.verification_status IS 'Identity verification status: UNVERIFIED, VERIFIED, REJECTED';
