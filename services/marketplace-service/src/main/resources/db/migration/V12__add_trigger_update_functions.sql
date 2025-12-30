-- V12__add_trigger_update_functions.sql
-- Create or update trigger functions used by multiple tables
-- Note: update_updated_at_column() already exists from V1, but we ensure consistency

-- Function to automatically set completion_rate based on contract outcomes
CREATE OR REPLACE FUNCTION calculate_user_completion_rate(user_id_param BIGINT)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    completed_count INTEGER;
    total_count INTEGER;
    rate DECIMAL(5,2);
BEGIN
    -- Count completed contracts
    SELECT COUNT(*) INTO completed_count
    FROM contracts
    WHERE (freelancer_id = user_id_param OR client_id = user_id_param)
    AND status = 'COMPLETED';
    
    -- Count total contracts (excluding cancelled/disputed)
    SELECT COUNT(*) INTO total_count
    FROM contracts
    WHERE (freelancer_id = user_id_param OR client_id = user_id_param)
    AND status IN ('ACTIVE', 'COMPLETED');
    
    -- Calculate rate
    IF total_count = 0 THEN
        rate := 100.00;
    ELSE
        rate := ROUND((completed_count::DECIMAL / total_count::DECIMAL) * 100, 2);
    END IF;
    
    RETURN rate;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION calculate_user_completion_rate(BIGINT) IS 'Calculates user completion rate based on completed vs total contracts';

-- Function to update completion rate when contract status changes
CREATE OR REPLACE FUNCTION update_user_completion_rate()
RETURNS TRIGGER AS $$
BEGIN
    -- Update freelancer's completion rate
    IF NEW.status IN ('COMPLETED', 'CANCELLED') AND 
       (OLD.status IS NULL OR OLD.status != NEW.status) THEN
        
        UPDATE users
        SET completion_rate = calculate_user_completion_rate(NEW.freelancer_id)
        WHERE id = NEW.freelancer_id;
        
        -- Also update client's completion rate
        UPDATE users
        SET completion_rate = calculate_user_completion_rate(NEW.client_id)
        WHERE id = NEW.client_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update completion rate when contract status changes
CREATE TRIGGER update_completion_rate_on_contract_change
    AFTER INSERT OR UPDATE OF status ON contracts
    FOR EACH ROW
    EXECUTE FUNCTION update_user_completion_rate();

COMMENT ON FUNCTION update_user_completion_rate() IS 'Automatically updates user completion_rate when contract status changes';

-- Function to increment proposal count when new proposal is submitted
CREATE OR REPLACE FUNCTION increment_job_proposal_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE jobs
        SET proposal_count = proposal_count + 1
        WHERE id = NEW.job_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE jobs
        SET proposal_count = GREATEST(proposal_count - 1, 0)
        WHERE id = OLD.job_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists (from earlier migrations)
DROP TRIGGER IF EXISTS update_job_proposal_count ON proposals;

-- Create trigger to maintain accurate proposal counts
CREATE TRIGGER update_job_proposal_count
    AFTER INSERT OR DELETE ON proposals
    FOR EACH ROW
    EXECUTE FUNCTION increment_job_proposal_count();

COMMENT ON FUNCTION increment_job_proposal_count() IS 'Maintains accurate proposal_count on jobs table';

-- Add a helper function to get user's active contracts count
CREATE OR REPLACE FUNCTION get_user_active_contracts_count(user_id_param BIGINT)
RETURNS INTEGER AS $$
DECLARE
    count INTEGER;
BEGIN
    SELECT COUNT(*) INTO count
    FROM contracts
    WHERE (freelancer_id = user_id_param OR client_id = user_id_param)
    AND status = 'ACTIVE';
    
    RETURN count;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_user_active_contracts_count(BIGINT) IS 'Returns number of active contracts for a user';

-- Add a helper function to check if user can create more contracts
CREATE OR REPLACE FUNCTION can_user_create_contract(user_id_param BIGINT, max_contracts INTEGER DEFAULT 10)
RETURNS BOOLEAN AS $$
DECLARE
    current_count INTEGER;
BEGIN
    current_count := get_user_active_contracts_count(user_id_param);
    RETURN current_count < max_contracts;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION can_user_create_contract(BIGINT, INTEGER) IS 'Checks if user is under active contract limit';
