-- =====================================================
-- SEED 04: Proposals & Contracts
-- Description: Project proposals from freelancers and resulting contracts
-- Dependencies: 02 (users/freelancers), 03 (projects)
-- Author: Senior DBA & Principal DB Architect
-- =====================================================
-- Load Order: 4th (After projects and freelancers)
-- =====================================================

-- =====================================================
-- PROPOSALS (20 records - proposals on open projects)
-- =====================================================
WITH ranked_proposals AS (
SELECT 
    p.id AS project_id,
    f.id AS freelancer_id,
    COALESCE(p.budget_min_cents, p.budget_max_cents) + (RANDOM() * COALESCE(p.budget_max_cents - p.budget_min_cents, 10000))::BIGINT AS suggested_budget_cents,
    CASE 
        WHEN p.estimated_duration_days <= 7 THEN 'ASAP'
        WHEN p.estimated_duration_days <= 30 THEN '1-3_MONTHS'
        ELSE '3-6_MONTHS'
    END::TEXT AS proposed_timeline,
    (p.estimated_duration_days * 8)::NUMERIC(10,2) AS estimated_hours,
    ARRAY['Fully experienced in this area', 'Can deliver high quality', 'Available to start immediately']::TEXT[] AS portfolio_links,
    'I have reviewed your project carefully and believe I can deliver excellent results. I have extensive experience in similar projects.' AS cover_letter,
    'SUBMITTED'::TEXT AS status,
    false AS is_featured,
    p.created_at + (RANDOM() * 2 || ' days')::INTERVAL AS created_at,
    p.created_at + (RANDOM() * 3 || ' days')::INTERVAL AS updated_at,
    ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY f.id) AS rn
FROM projects p
CROSS JOIN freelancers f
WHERE p.status = 'OPEN'
    AND p.deleted_at IS NULL
LIMIT 100
)
INSERT INTO proposals (
    project_id, freelancer_id, 
    suggested_budget_cents, proposed_timeline, estimated_hours,
    portfolio_links, cover_letter, status, is_featured,
    created_at, updated_at
)
SELECT 
    project_id, freelancer_id,
    suggested_budget_cents, proposed_timeline, estimated_hours,
    portfolio_links, cover_letter, status, is_featured,
    created_at, updated_at
FROM ranked_proposals
WHERE rn <= 2
ON CONFLICT (project_id, freelancer_id) DO NOTHING;

-- =====================================================
-- CONTRACTS (10 records - from accepted proposals)
-- =====================================================
INSERT INTO contracts (
    project_id, company_id, freelancer_id, proposal_id,
    title, description, contract_type,
    amount_cents, currency,
    payment_schedule, milestone_count,
    start_date, end_date, status,
    created_at, updated_at
)
SELECT 
    p.project_id,
    (SELECT company_id FROM projects WHERE id = p.project_id LIMIT 1),
    p.freelancer_id,
    p.id,
    pr.title,
    pr.description,
    pr.budget_type,
    COALESCE(p.suggested_budget_cents, COALESCE(pr.budget_min_cents, pr.budget_max_cents, 50000))::BIGINT,
    'USD'::TEXT,
    'MILESTONE_BASED'::TEXT,
    GREATEST(1, (COALESCE(pr.estimated_duration_days, 30) / 7)::INT),
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + (COALESCE(pr.estimated_duration_days, 30) || ' days')::INTERVAL,
    CASE WHEN RANDOM() < 0.5 THEN 'ACTIVE'::TEXT ELSE 'PENDING'::TEXT END,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
FROM proposals p
JOIN projects pr ON p.project_id = pr.id
WHERE p.status = 'SUBMITTED'
LIMIT 10;

-- Update proposal statuses to ACCEPTED for those with contracts
UPDATE proposals p
SET status = 'ACCEPTED'
WHERE id IN (SELECT proposal_id FROM contracts WHERE proposal_id IS NOT NULL);

-- Verify insertions
DO $$
DECLARE
    v_proposal_count INT;
    v_contract_count INT;
    v_active_contracts INT;
BEGIN
    SELECT COUNT(*) INTO v_proposal_count FROM proposals;
    SELECT COUNT(*) INTO v_contract_count FROM contracts;
    SELECT COUNT(*) INTO v_active_contracts FROM contracts WHERE status = 'ACTIVE';
    
    RAISE NOTICE 'Seed 04 Complete: % proposals, % contracts, % active',
        v_proposal_count, v_contract_count, v_active_contracts;
END $$;
