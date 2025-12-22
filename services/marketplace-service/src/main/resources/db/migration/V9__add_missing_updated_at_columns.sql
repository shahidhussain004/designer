-- V8: Add missing updated_at columns to tables
-- Description: Adds updated_at column to invoices, milestone, and payout tables for Hibernate schema validation

-- Add updated_at to invoices table
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN IF NOT EXISTS invoice_type VARCHAR(50) DEFAULT 'PAYMENT',
ADD COLUMN IF NOT EXISTS milestone_id BIGINT REFERENCES milestones(id),
ADD COLUMN IF NOT EXISTS job_id BIGINT NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS freelancer_id BIGINT NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS client_billing_info TEXT,
ADD COLUMN IF NOT EXISTS freelancer_billing_info TEXT,
ADD COLUMN IF NOT EXISTS line_items TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT;

-- Update existing rows to have current timestamp
UPDATE invoices SET updated_at = CURRENT_TIMESTAMP WHERE updated_at IS NULL;

-- Create trigger to automatically update updated_at on changes
CREATE OR REPLACE FUNCTION update_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_invoices_updated_at_trigger ON invoices;

-- Create trigger
CREATE TRIGGER update_invoices_updated_at_trigger
BEFORE UPDATE ON invoices
FOR EACH ROW
EXECUTE FUNCTION update_invoices_updated_at();

-- Create indexes for updated columns if they don't exist
CREATE INDEX IF NOT EXISTS idx_invoices_milestone ON invoices(milestone_id);
CREATE INDEX IF NOT EXISTS idx_invoices_job ON invoices(job_id);
CREATE INDEX IF NOT EXISTS idx_invoices_freelancer ON invoices(freelancer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_type ON invoices(invoice_type);
