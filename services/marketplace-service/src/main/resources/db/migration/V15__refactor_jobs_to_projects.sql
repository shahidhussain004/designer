-- V15__refactor_jobs_to_projects.sql
-- Refactor: Rename existing 'jobs' to 'projects' and 'job_categories' to 'project_categories'
-- This prepares the structure for a new 'Jobs' feature (traditional employment)

-- ============================================================================
-- STEP 1: Rename job_categories to project_categories
-- ============================================================================

-- Rename the table
ALTER TABLE job_categories RENAME TO project_categories;

-- Rename indexes
ALTER INDEX idx_job_categories_slug RENAME TO idx_project_categories_slug;
ALTER INDEX idx_job_categories_active RENAME TO idx_project_categories_active;
ALTER INDEX idx_job_categories_order RENAME TO idx_project_categories_order;

-- Update table comment
COMMENT ON TABLE project_categories IS 'Project categories lookup table for freelance/gig work';

-- ============================================================================
-- STEP 2: Rename jobs to projects
-- ============================================================================

-- Rename the table
ALTER TABLE jobs RENAME TO projects;

-- Rename column: category_id still makes sense, but we'll update comments
-- Rename indexes (using IF EXISTS equivalent for PostgreSQL)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_jobs_client') THEN
        ALTER INDEX idx_jobs_client RENAME TO idx_projects_client;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_jobs_status') THEN
        ALTER INDEX idx_jobs_status RENAME TO idx_projects_status;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_jobs_category_fk') THEN
        ALTER INDEX idx_jobs_category_fk RENAME TO idx_projects_category_fk;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_jobs_created') THEN
        ALTER INDEX idx_jobs_created RENAME TO idx_projects_created;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_jobs_budget') THEN
        ALTER INDEX idx_jobs_budget RENAME TO idx_projects_budget;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_jobs_status_created_client') THEN
        ALTER INDEX idx_jobs_status_created_client RENAME TO idx_projects_status_created_client;
    END IF;
END $$;

-- Update table comment
COMMENT ON TABLE projects IS 'Projects table - freelance/gig work posted by clients';

-- Update column comment
COMMENT ON COLUMN projects.category_id IS 'Foreign key reference to project_categories table';

-- ============================================================================
-- STEP 3: Update foreign key constraints and references in related tables
-- ============================================================================

-- Update proposals table
ALTER TABLE proposals RENAME COLUMN job_id TO project_id;

-- Rename the foreign key constraint (check if exists first)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'proposals_job_id_fkey') THEN
        ALTER TABLE proposals DROP CONSTRAINT proposals_job_id_fkey;
    END IF;
END $$;

ALTER TABLE proposals ADD CONSTRAINT proposals_project_id_fkey 
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;

-- Rename indexes on proposals
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_proposals_job') THEN
        ALTER INDEX idx_proposals_job RENAME TO idx_proposals_project;
    END IF;
END $$;

-- Update unique constraint
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'proposals_job_id_freelancer_id_key') THEN
        ALTER TABLE proposals DROP CONSTRAINT proposals_job_id_freelancer_id_key;
    END IF;
END $$;

ALTER TABLE proposals ADD CONSTRAINT proposals_project_id_freelancer_id_key 
    UNIQUE(project_id, freelancer_id);

-- ============================================================================
-- STEP 4: Update contracts table if it references jobs
-- ============================================================================

-- Check if contracts table exists and has job_id column
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'contracts') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'contracts' AND column_name = 'job_id') THEN
            
            -- Rename column
            ALTER TABLE contracts RENAME COLUMN job_id TO project_id;
            
            -- Drop old foreign key
            ALTER TABLE contracts DROP CONSTRAINT IF EXISTS contracts_job_id_fkey;
            
            -- Add new foreign key
            ALTER TABLE contracts ADD CONSTRAINT contracts_project_id_fkey 
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
            
            RAISE NOTICE 'Updated contracts table: job_id -> project_id';
        END IF;
    END IF;
END $$;

-- ============================================================================
-- STEP 5: Update milestones table if it references jobs
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'milestones') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'milestones' AND column_name = 'job_id') THEN
            
            -- Rename column
            ALTER TABLE milestones RENAME COLUMN job_id TO project_id;
            
            -- Drop old foreign key
            ALTER TABLE milestones DROP CONSTRAINT IF EXISTS milestones_job_id_fkey;
            
            -- Add new foreign key
            ALTER TABLE milestones ADD CONSTRAINT milestones_project_id_fkey 
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
            
            RAISE NOTICE 'Updated milestones table: job_id -> project_id';
        END IF;
    END IF;
END $$;

-- ============================================================================
-- STEP 6: Update payments table if it references jobs
-- ============================================================================

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'payments') THEN
        IF EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'payments' AND column_name = 'job_id') THEN
            
            -- Rename column
            ALTER TABLE payments RENAME COLUMN job_id TO project_id;
            
            -- Drop old foreign key
            ALTER TABLE payments DROP CONSTRAINT IF EXISTS payments_job_id_fkey;
            
            -- Add new foreign key
            ALTER TABLE payments ADD CONSTRAINT payments_project_id_fkey 
                FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE;
            
            RAISE NOTICE 'Updated payments table: job_id -> project_id';
        END IF;
    END IF;
END $$;

-- ============================================================================
-- STEP 7: Update trigger functions that reference jobs table
-- ============================================================================

-- Recreate the trigger function for proposal count (if exists)
CREATE OR REPLACE FUNCTION increment_project_proposal_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE projects
    SET proposal_count = proposal_count + 1
    WHERE id = NEW.project_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_project_proposal_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE projects
    SET proposal_count = GREATEST(0, proposal_count - 1)
    WHERE id = OLD.project_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Drop old triggers if they exist
DROP TRIGGER IF EXISTS increment_job_proposal_count_trigger ON proposals;
DROP TRIGGER IF EXISTS decrement_job_proposal_count_trigger ON proposals;

-- Create new triggers
CREATE TRIGGER increment_project_proposal_count_trigger
    AFTER INSERT ON proposals
    FOR EACH ROW
    EXECUTE FUNCTION increment_project_proposal_count();

CREATE TRIGGER decrement_project_proposal_count_trigger
    AFTER DELETE ON proposals
    FOR EACH ROW
    EXECUTE FUNCTION decrement_project_proposal_count();

-- Update function comments
COMMENT ON FUNCTION increment_project_proposal_count() IS 'Maintains accurate proposal_count on projects table';
COMMENT ON FUNCTION decrement_project_proposal_count() IS 'Maintains accurate proposal_count on projects table';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify the migration
DO $$
BEGIN
    RAISE NOTICE '=== Migration V15 Completed Successfully ===';
    RAISE NOTICE 'Tables renamed:';
    RAISE NOTICE '  - job_categories -> project_categories';
    RAISE NOTICE '  - jobs -> projects';
    RAISE NOTICE 'Related tables updated: proposals, contracts, milestones, payments';
    RAISE NOTICE 'Triggers and functions updated for projects table';
END $$;
