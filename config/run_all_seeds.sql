-- =====================================================
-- MASTER SEED DATA SCRIPT - RUNS ALL SEEDS IN ORDER
-- =====================================================
-- This script loads all seed data in the correct sequence
-- to ensure proper foreign key relationships
-- =====================================================

\echo '=========================================='
\echo 'Starting Seed Data Load Sequence'
\echo '=========================================='

-- Stage 1: Reference Data
\echo ''
\echo '[1/8] Loading Reference Data...'
\i '/docker-entrypoint-initdb.d/01_reference_data.sql'

-- Stage 2: Users, Companies & Freelancers
\echo ''
\echo '[2/8] Loading Users, Companies & Freelancers...'
\i '/docker-entrypoint-initdb.d/02_users_companies_freelancers.sql'

-- Stage 3: Jobs & Projects
\echo ''
\echo '[3/8] Loading Jobs & Projects...'
\i '/docker-entrypoint-initdb.d/03_jobs_and_projects.sql'

-- Stage 4: Proposals & Contracts
\echo ''
\echo '[4/8] Loading Proposals & Contracts...'
\i '/docker-entrypoint-initdb.d/04_proposals_and_contracts.sql'

-- Stage 5: Milestones, Payments & Invoices
\echo ''
\echo '[5/8] Loading Milestones, Payments & Invoices...'
\i '/docker-entrypoint-initdb.d/05_milestones_payments_invoices.sql'

-- Stage 6: Reviews, Portfolio & Time Tracking
\echo ''
\echo '[6/8] Loading Reviews, Portfolio & Time Tracking...'
\i '/docker-entrypoint-initdb.d/06_reviews_portfolio_timetracking.sql'

-- Stage 7: Messaging & Notifications
\echo ''
\echo '[7/8] Loading Messaging & Notifications...'
\i '/docker-entrypoint-initdb.d/07_messaging_and_notifications.sql'

-- Stage 8: Administrative Data
\echo ''
\echo '[8/8] Loading Administrative Data...'
\i '/docker-entrypoint-initdb.d/08_administrative_data.sql'

-- Final Verification
\echo ''
\echo '=========================================='
\echo 'SEED DATA LOAD COMPLETE'
\echo '=========================================='
\echo ''
\echo 'Final Data Summary:'
SELECT 'Users: ' || COUNT(*) FROM users;
SELECT 'Companies: ' || COUNT(*) FROM companies;
SELECT 'Freelancers: ' || COUNT(*) FROM freelancers;
SELECT 'Jobs: ' || COUNT(*) FROM jobs;
SELECT 'Projects: ' || COUNT(*) FROM projects;
SELECT 'Portfolio Items: ' || COUNT(*) FROM portfolio_items;
