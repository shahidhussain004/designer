-- Add offer details columns to job_applications table
-- These fields store the formal job offer details when status is OFFERED

ALTER TABLE job_applications 
ADD COLUMN IF NOT EXISTS offered_salary_cents BIGINT,
ADD COLUMN IF NOT EXISTS offered_salary_currency VARCHAR(3),
ADD COLUMN IF NOT EXISTS offered_salary_period VARCHAR(20),
ADD COLUMN IF NOT EXISTS offered_start_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS offer_expiration_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS contract_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS contract_duration_months INTEGER,
ADD COLUMN IF NOT EXISTS offer_benefits TEXT,
ADD COLUMN IF NOT EXISTS offer_additional_terms TEXT,
ADD COLUMN IF NOT EXISTS offer_document_url TEXT,
ADD COLUMN IF NOT EXISTS offer_made_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS offer_responded_at TIMESTAMP;

-- Add comments for clarity
COMMENT ON COLUMN job_applications.offered_salary_cents IS 'Offered salary amount in cents (e.g., $50,000 = 5000000)';
COMMENT ON COLUMN job_applications.offered_salary_currency IS 'Currency code (USD, EUR, SEK, etc.)';
COMMENT ON COLUMN job_applications.offered_salary_period IS 'Salary period: HOURLY, MONTHLY, YEARLY';
COMMENT ON COLUMN job_applications.offered_start_date IS 'Proposed employment start date';
COMMENT ON COLUMN job_applications.offer_expiration_date IS 'When does this offer expire?';
COMMENT ON COLUMN job_applications.contract_type IS 'FULL_TIME, PART_TIME, CONTRACT, FREELANCE';
COMMENT ON COLUMN job_applications.contract_duration_months IS 'Duration for fixed-term contracts';
COMMENT ON COLUMN job_applications.offer_benefits IS 'Benefits description (health insurance, vacation, etc.)';
COMMENT ON COLUMN job_applications.offer_additional_terms IS 'Additional terms (remote policy, equipment, probation, etc.)';
COMMENT ON COLUMN job_applications.offer_document_url IS 'URL to formal offer letter PDF';
COMMENT ON COLUMN job_applications.offer_made_at IS 'Timestamp when offer was made';
COMMENT ON COLUMN job_applications.offer_responded_at IS 'Timestamp when freelancer responded to offer';

-- Create index for offer expiration queries (to find expired offers)
CREATE INDEX IF NOT EXISTS idx_job_applications_offer_expiration 
ON job_applications(offer_expiration_date) 
WHERE offer_expiration_date IS NOT NULL AND status = 'OFFERED';
