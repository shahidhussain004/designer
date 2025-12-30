-- V13__fix_contract_constraints.sql
-- Fix contract constraints to match Java enums

-- Drop old constraints
ALTER TABLE contracts DROP CONSTRAINT IF EXISTS chk_contract_type;
ALTER TABLE contracts DROP CONSTRAINT IF EXISTS chk_contract_payment_schedule;
ALTER TABLE contracts DROP CONSTRAINT IF EXISTS chk_contract_status;

-- Add updated constraints matching Java enums
ALTER TABLE contracts ADD CONSTRAINT chk_contract_type 
    CHECK (contract_type IN ('FIXED_PRICE', 'HOURLY', 'MILESTONE_BASED'));

ALTER TABLE contracts ADD CONSTRAINT chk_contract_payment_schedule 
    CHECK (payment_schedule IN ('UPFRONT', 'ON_COMPLETION', 'MILESTONE_BASED', 'WEEKLY', 'MONTHLY'));

ALTER TABLE contracts ADD CONSTRAINT chk_contract_status 
    CHECK (status IN ('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'DISPUTED'));
