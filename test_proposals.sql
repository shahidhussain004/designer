INSERT INTO proposals (
    project_id, freelancer_id, 
    suggested_budget_cents, proposed_timeline, estimated_hours,
    portfolio_links, cover_letter, status, is_featured,
    created_at, updated_at
)
SELECT 
    p.id AS project_id,
    f.user_id AS freelancer_id,
    COALESCE(p.budget_min_cents, p.budget_max_cents) + (RANDOM() * COALESCE(p.budget_max_cents - p.budget_min_cents, 10000))::BIGINT AS suggested_budget_cents,
    'ASAP'::TEXT AS proposed_timeline,
    100::NUMERIC(10,2) AS estimated_hours,
    ARRAY['Portfolio link']::TEXT[] AS portfolio_links,
    'I am interested in this project' AS cover_letter,
    'SUBMITTED'::TEXT AS status,
    false AS is_featured,
    NOW() AS created_at,
    NOW() AS updated_at
FROM projects p
CROSS JOIN freelancers f
WHERE p.status = 'OPEN'
  AND p.deleted_at IS NULL
LIMIT 10
ON CONFLICT (project_id, freelancer_id) DO NOTHING;

SELECT COUNT(*) FROM proposals;
