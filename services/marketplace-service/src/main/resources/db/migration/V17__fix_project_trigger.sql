-- =====================================================
-- V17: Fix project trigger for counter validation
-- Description: Create separate trigger function for projects since it has different columns
-- =====================================================

-- Drop the problematic trigger on projects
DROP TRIGGER IF EXISTS projects_counter_check ON projects;

-- Create a projects-specific counter check function
CREATE OR REPLACE FUNCTION prevent_negative_counters_projects()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.views_count < 0 THEN NEW.views_count = 0; END IF;
    IF NEW.proposal_count < 0 THEN NEW.proposal_count = 0; END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger with projects-specific function
CREATE TRIGGER projects_counter_check
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION prevent_negative_counters_projects();

COMMIT;
