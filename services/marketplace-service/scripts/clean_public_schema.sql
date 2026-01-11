-- WARNING: This script will DROP ALL OBJECTS in the public schema of the connected database.
-- Use only on dev/test databases and ensure you have backups before running.
--
-- This script is idempotent and attempts to drop tables, views, sequences, functions, types,
-- and other objects created by the application's migrations. It will drop objects using
-- CASCADE to ensure dependent objects are removed.
--
-- Usage (psql):
--   psql -h <host> -p <port> -U <user> -d marketplace_db -f services/marketplace-service/scripts/clean_public_schema.sql

BEGIN;

-- Drop all views
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT table_schema, table_name FROM information_schema.views WHERE table_schema = 'public') LOOP
        EXECUTE format('DROP VIEW IF EXISTS %I.%I CASCADE', r.table_schema, r.table_name);
    END LOOP;
END$$;

-- Drop all materialized views
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, matviewname FROM pg_matviews WHERE schemaname = 'public') LOOP
        EXECUTE format('DROP MATERIALIZED VIEW IF EXISTS %I.%I CASCADE', r.schemaname, r.matviewname);
    END LOOP;
END$$;

-- Drop all functions
-- Drop all functions (drop by signature to handle overloaded functions)
DO $$
DECLARE
    r RECORD;
    sig TEXT;
BEGIN
    FOR r IN (
        SELECT p.oid, n.nspname as schema, p.proname as name
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
          AND NOT EXISTS (
              SELECT 1 FROM pg_depend d WHERE d.classid = 'pg_proc'::regclass AND d.objid = p.oid AND d.deptype = 'e'
          )
    ) LOOP
        sig := pg_get_function_identity_arguments(r.oid);
        EXECUTE format('DROP FUNCTION IF EXISTS %I.%I(%s) CASCADE', r.schema, r.name, sig);
    END LOOP;
END$$;

-- Drop all sequences
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT sequence_schema, sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public') LOOP
        EXECUTE format('DROP SEQUENCE IF EXISTS %I.%I CASCADE', r.sequence_schema, r.sequence_name);
    END LOOP;
END$$;

-- Drop all constraints (foreign key constraints are usually dropped with tables, but attempt to remove orphaned ones)
-- No-op: dropping tables with CASCADE below will remove constraints.

-- Drop all tables
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE format('DROP TABLE IF EXISTS public.%I CASCADE', r.tablename);
    END LOOP;
END$$;

-- Drop all types
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT n.nspname as schema, t.typname as name
              FROM pg_type t
              JOIN pg_namespace n ON n.oid = t.typnamespace
              WHERE n.nspname = 'public' AND t.typtype IN ('e', 'c')) LOOP
        EXECUTE format('DROP TYPE IF EXISTS %I.%I CASCADE', r.schema, r.name);
    END LOOP;
END$$;

-- Drop all indexes not automatically removed (leftovers)
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, indexname FROM pg_indexes WHERE schemaname = 'public') LOOP
        EXECUTE format('DROP INDEX IF EXISTS %I.%I CASCADE', r.schemaname, r.indexname);
    END LOOP;
END$$;

-- Finally, reset search_path to default just in case
SET search_path = public;

COMMIT;

-- End of script
