-- Extra seed: create additional completed contracts, reviews, and time entries
-- 1) Create up to 20 completed contracts (one per project)
-- Idempotency: record runs in `seed_runs` and make inserts safe to re-run
CREATE TABLE IF NOT EXISTS seed_runs (
  key TEXT PRIMARY KEY,
  run_at TIMESTAMPTZ NOT NULL,
  notes TEXT
);

-- Adjust these values to change seeding density
-- Contracts to create (max per run): change LIMIT below
-- Time entries to create (max per run): change LIMIT below

INSERT INTO seed_runs (key, run_at, notes)
VALUES ('extra_reviews_time_entries', NOW(), 'contracts=20,time_entries=40')
ON CONFLICT (key) DO UPDATE SET run_at = EXCLUDED.run_at, notes = EXCLUDED.notes;
INSERT INTO contracts (project_id, freelancer_id, company_id, start_date, end_date, status, title, description, contract_type, amount_cents, created_at, updated_at)
SELECT p.id,
       f.id,
       p.company_id,
       NOW() - INTERVAL '30 days',
       NOW() - INTERVAL '1 day',
       'COMPLETED',
       ('Auto Contract for project ' || p.id)::varchar,
       'Automatically generated contract for seeding purposes.',
       'FIXED_PRICE',
       100000,
       NOW() - INTERVAL '40 days',
       NOW() - INTERVAL '1 day'
FROM projects p
JOIN LATERAL (SELECT id FROM freelancers ORDER BY RANDOM() LIMIT 1) f ON true
WHERE p.id IS NOT NULL
  -- Avoid creating duplicate contract for same project+freelancer
  AND NOT EXISTS (
    SELECT 1 FROM contracts c2 WHERE c2.project_id = p.id AND c2.freelancer_id = f.id
  )
LIMIT 20
ON CONFLICT DO NOTHING;

-- 2) Insert reviews for contracts that don't have reviews yet (up to 20)
INSERT INTO reviews (reviewer_id, reviewed_user_id, contract_id, project_id, rating, title, comment, categories, status, is_verified_purchase, helpful_count, created_at, updated_at)
SELECT comp.user_id,
       fr.user_id,
       c.id,
       c.project_id,
       (4 + (RANDOM()*1)::INT)::numeric,
       'Auto-generated review',
       'Automated seeded review for testing.',
       ('{"communication":' || (4 + (RANDOM()*1)::INT) || ',"quality":' || (4 + (RANDOM()*1)::INT) || '}')::jsonb,
       'PUBLISHED',
       true,
       (RANDOM()*10)::INT,
       NOW() - INTERVAL '10 days',
       NOW() - INTERVAL '9 days'
FROM contracts c
JOIN companies comp ON c.company_id = comp.id
JOIN freelancers fr ON c.freelancer_id = fr.id
LEFT JOIN reviews r ON r.contract_id = c.id
WHERE r.id IS NULL
LIMIT 20
ON CONFLICT (contract_id, reviewer_id) DO NOTHING;

-- Remove previously auto-seeded time entries to avoid duplicates
-- Remove prior auto-seeded time entries (idempotent cleanup)
DELETE FROM time_entries
WHERE description = 'Auto time entry' AND task_description = 'Automated seeding of hours';

-- Re-seed a controlled set of time entries (one per contract, up to 40)
WITH cet AS (
  SELECT c.id AS contract_id,
         c.freelancer_id,
         COALESCE(c.start_date, NOW() - INTERVAL '20 days') AS start_date,
         ROW_NUMBER() OVER (ORDER BY c.id) AS rn
  FROM contracts c
  WHERE c.status IN ('COMPLETED', 'ACTIVE')
  LIMIT 40
)
INSERT INTO time_entries (contract_id, freelancer_id, date, start_time, end_time, hours_logged, description, task_description, work_diary, status, approved_by, created_at, updated_at, approved_at)
SELECT contract_id,
       freelancer_id,
       start_date + ((rn % 7)::INT || ' days')::INTERVAL AS date,
       '09:00:00'::TIME,
       '17:00:00'::TIME,
       8.0,
       'Auto time entry',
       'Automated seeding of hours',
       ('{"tasks":[{"task":"Work","hours":8}]}')::jsonb,
       'SUBMITTED',
       NULL,
       NOW(),
       NOW(),
       NULL
FROM cet
ON CONFLICT DO NOTHING;

-- 4) Integrity checks: report orphaned FK counts and totals
DO $$
DECLARE
  orphan_reviews int;
  orphan_time int;
  orphan_portfolio int;
BEGIN
  SELECT COUNT(*) INTO orphan_reviews FROM reviews r LEFT JOIN contracts c ON r.contract_id = c.id WHERE r.contract_id IS NOT NULL AND c.id IS NULL;
  SELECT COUNT(*) INTO orphan_time FROM time_entries t LEFT JOIN contracts c2 ON t.contract_id = c2.id WHERE t.contract_id IS NOT NULL AND c2.id IS NULL;
  SELECT COUNT(*) INTO orphan_portfolio FROM portfolio_items p LEFT JOIN users u ON p.user_id = u.id WHERE p.user_id IS NOT NULL AND u.id IS NULL;

  RAISE NOTICE 'Integrity: orphan_reviews=% orphan_time=% orphan_portfolio=%', orphan_reviews, orphan_time, orphan_portfolio;
END $$;

-- 5) Summary counts for key tables
SELECT 'reviews' AS table_name, COUNT(*) FROM reviews;
SELECT 'time_entries' AS table_name, COUNT(*) FROM time_entries;
SELECT 'contracts' AS table_name, COUNT(*) FROM contracts;
SELECT 'portfolio_items' AS table_name, COUNT(*) FROM portfolio_items;
