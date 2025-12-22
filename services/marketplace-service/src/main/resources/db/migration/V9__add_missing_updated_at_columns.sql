-- V9: Add triggers and indexes for invoices table
-- Description: Adds auto-update trigger for updated_at column and indexes

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

-- Create indexes for invoice lookup
CREATE INDEX IF NOT EXISTS idx_invoices_milestone ON invoices(milestone_id);
CREATE INDEX IF NOT EXISTS idx_invoices_job ON invoices(job_id);
CREATE INDEX IF NOT EXISTS idx_invoices_type ON invoices(invoice_type);
