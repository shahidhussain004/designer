-- V11__enhance_users_table_profile_fields.sql
-- Add additional profile fields to users table for richer freelancer profiles
-- These fields provide more context about freelancers' experience and credentials

-- Add social profile URLs
ALTER TABLE users 
ADD COLUMN github_url VARCHAR(500),
ADD COLUMN linkedin_url VARCHAR(500);

-- Add certifications and languages as arrays
ALTER TABLE users 
ADD COLUMN certifications TEXT[],
ADD COLUMN languages TEXT[];

-- Add experience tracking
ALTER TABLE users 
ADD COLUMN experience_years INTEGER;

-- Add verification fields
ALTER TABLE users 
ADD COLUMN verification_status VARCHAR(20) DEFAULT 'UNVERIFIED',
ADD COLUMN identity_verified BOOLEAN DEFAULT false,
ADD COLUMN identity_verified_at TIMESTAMP;

-- Add performance metrics
ALTER TABLE users 
ADD COLUMN completion_rate DECIMAL(5, 2) DEFAULT 100.00,
ADD COLUMN response_time_hours DECIMAL(5, 1),
ADD COLUMN response_rate DECIMAL(5, 2);

-- Add check constraint for verification_status
ALTER TABLE users 
ADD CONSTRAINT chk_verification_status CHECK (
    verification_status IN ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED')
);

-- Add check constraints for rates (must be between 0 and 100)
ALTER TABLE users 
ADD CONSTRAINT chk_completion_rate_range CHECK (
    completion_rate IS NULL OR (completion_rate >= 0 AND completion_rate <= 100)
);

ALTER TABLE users 
ADD CONSTRAINT chk_response_rate_range CHECK (
    response_rate IS NULL OR (response_rate >= 0 AND response_rate <= 100)
);

-- Add check constraint for experience years (reasonable range)
ALTER TABLE users 
ADD CONSTRAINT chk_experience_years_range CHECK (
    experience_years IS NULL OR (experience_years >= 0 AND experience_years <= 70)
);

-- Create indexes for new fields that will be queried frequently
CREATE INDEX idx_users_verification_status ON users(verification_status);
CREATE INDEX idx_users_completion_rate ON users(completion_rate DESC) WHERE completion_rate IS NOT NULL;
CREATE INDEX idx_users_identity_verified ON users(identity_verified);
CREATE INDEX idx_users_experience_years ON users(experience_years DESC) WHERE experience_years IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN users.github_url IS 'GitHub profile URL for developers';
COMMENT ON COLUMN users.linkedin_url IS 'LinkedIn profile URL';
COMMENT ON COLUMN users.certifications IS 'Array of professional certifications (e.g., AWS Certified, PMP)';
COMMENT ON COLUMN users.languages IS 'Array of spoken languages (e.g., English, Spanish, French)';
COMMENT ON COLUMN users.experience_years IS 'Years of professional experience in their field';
COMMENT ON COLUMN users.verification_status IS 'Identity verification status: UNVERIFIED, PENDING, VERIFIED, or REJECTED';
COMMENT ON COLUMN users.identity_verified IS 'Whether user has completed identity verification';
COMMENT ON COLUMN users.identity_verified_at IS 'Timestamp when identity was verified';
COMMENT ON COLUMN users.completion_rate IS 'Percentage of contracts completed successfully (0-100)';
COMMENT ON COLUMN users.response_time_hours IS 'Average response time in hours for messages and proposals';
COMMENT ON COLUMN users.response_rate IS 'Percentage of messages/proposals responded to (0-100)';
