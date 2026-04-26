-- =====================================================
-- V27: Convert Proposals Array Columns to JSONB
-- Description: Fix ClassCastException by converting text[] to jsonb
-- Issue: Hibernate @JdbcTypeCode(SqlTypes.JSON) with List<String> 
--        requires JSONB columns, not PostgreSQL text[] arrays
-- Date: 2026-04-26
-- =====================================================

-- Check if columns are already JSONB, if so skip
DO $$ 
DECLARE
  col_type TEXT;
BEGIN
  -- Check attachments column type
  SELECT data_type INTO col_type FROM information_schema.columns 
  WHERE table_name = 'proposals' AND column_name = 'attachments';
  
  IF col_type = 'jsonb' THEN
    RAISE NOTICE 'Columns already migrated to JSONB, skipping migration';
    RETURN;
  END IF;
  
  -- Drop and recreate attachments column with JSONB type
  ALTER TABLE proposals DROP COLUMN IF EXISTS attachments CASCADE;
  ALTER TABLE proposals ADD COLUMN attachments jsonb NOT NULL DEFAULT '[]'::jsonb;
  
  -- Drop and recreate portfolio_links column with JSONB type
  ALTER TABLE proposals DROP COLUMN IF EXISTS portfolio_links CASCADE;
  ALTER TABLE proposals ADD COLUMN portfolio_links jsonb NOT NULL DEFAULT '[]'::jsonb;
  
  RAISE NOTICE 'Migration V27 completed: columns converted to JSONB';
END $$;

-- Add comments to document the change
COMMENT ON COLUMN proposals.attachments IS 'JSONB array of attachment URLs (converted from text[] for Hibernate compatibility)';
COMMENT ON COLUMN proposals.portfolio_links IS 'JSONB array of portfolio URLs (converted from text[] for Hibernate compatibility)';

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================
-- To verify the migration succeeded, run:
--
-- SELECT 
--     column_name, 
--     data_type, 
--     column_default
-- FROM information_schema.columns 
-- WHERE table_name = 'proposals' 
-- AND column_name IN ('attachments', 'portfolio_links');
--
-- Expected result:
-- attachments      | jsonb | '[]'::jsonb
-- portfolio_links  | jsonb | '[]'::jsonb

-- =====================================================
-- ROLLBACK INSTRUCTIONS
-- =====================================================
-- To rollback this migration (if needed):
--
-- ALTER TABLE proposals 
--     ALTER COLUMN attachments TYPE text[] 
--     USING CASE 
--         WHEN attachments IS NULL THEN '{}'::text[]
--         ELSE ARRAY(SELECT jsonb_array_elements_text(attachments))
--     END;
-- ALTER TABLE proposals ALTER COLUMN attachments SET DEFAULT '{}'::text[];
--
-- ALTER TABLE proposals 
--     ALTER COLUMN portfolio_links TYPE text[] 
--     USING CASE 
--         WHEN portfolio_links IS NULL THEN '{}'::text[]
--         ELSE ARRAY(SELECT jsonb_array_elements_text(portfolio_links))
--     END;
-- ALTER TABLE proposals ALTER COLUMN portfolio_links SET DEFAULT '{}'::text[];
