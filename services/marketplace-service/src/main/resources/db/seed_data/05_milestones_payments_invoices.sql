-- =====================================================
-- SEED 05: Milestones, Payments & Financial Data
-- Description: Contract milestones, payments, invoices, and financial transactions
-- Dependencies: contracts, companies, freelancers
-- Author: Senior DBA & Principal DB Architect
-- =====================================================
-- Load Order: 5th (After contracts created)
-- =====================================================

-- =====================================================
-- MILESTONES (25 records - 2-3 per contract)
-- =====================================================
INSERT INTO milestones (
    project_id, contract_id, title, description, deliverables,
    amount_cents, currency, due_date, start_date, status, order_number,
    approval_date, completed_at, created_at, updated_at
)
SELECT 
    c.project_id,
    c.id AS contract_id,
    'Milestone ' || milestone_data.order_number || ': ' || milestone_data.title AS title,
    milestone_data.description AS description,
    milestone_data.deliverables::jsonb AS deliverables,
    (c.amount_cents / c.milestone_count)::BIGINT AS amount_cents,
    'USD' AS currency,
    (c.start_date + ((milestone_data.order_number * 30) || ' days')::INTERVAL)::DATE AS due_date,
    (c.start_date + (((milestone_data.order_number - 1) * 30) || ' days')::INTERVAL)::DATE AS start_date,
    CASE 
        WHEN milestone_data.order_number = 1 AND c.status = 'COMPLETED' THEN 'APPROVED'
        WHEN milestone_data.order_number = 1 AND c.completion_percentage >= 50 THEN 'APPROVED'
        WHEN milestone_data.order_number = 2 AND c.completion_percentage >= 75 THEN 'IN_PROGRESS'
        WHEN milestone_data.order_number = 2 AND c.completion_percentage >= 50 THEN 'SUBMITTED'
        ELSE 'PENDING'
    END AS status,
    milestone_data.order_number AS order_number,
    CASE 
        WHEN milestone_data.order_number = 1 AND c.status = 'COMPLETED' THEN c.created_at + INTERVAL '30 days'
        WHEN milestone_data.order_number = 1 AND c.completion_percentage >= 50 THEN c.created_at + INTERVAL '30 days'
        ELSE NULL
    END AS approval_date,
    CASE 
        WHEN milestone_data.order_number = 1 AND c.status = 'COMPLETED' THEN c.created_at + INTERVAL '29 days'
        WHEN milestone_data.order_number = 1 AND c.completion_percentage >= 50 THEN c.created_at + INTERVAL '29 days'
        ELSE NULL
    END AS completed_at,
    c.created_at + INTERVAL '1 day' AS created_at,
    c.created_at + INTERVAL '2 days' AS updated_at
FROM contracts c
CROSS JOIN LATERAL (VALUES
    (1, 'Initial Setup & Planning', 'Project setup, requirements gathering, and initial architecture design',
     '[{"description": "Project repository setup", "completed": true, "approved": true}, 
       {"description": "Requirements documentation", "completed": true, "approved": true}, 
       {"description": "Architecture design document", "completed": true, "approved": true}]'),
    (2, 'Core Development', 'Implementation of core features and functionality',
     '[{"description": "Database schema implementation", "completed": false, "approved": false}, 
       {"description": "API endpoints development", "completed": false, "approved": false}, 
       {"description": "Frontend components", "completed": false, "approved": false}]'),
    (3, 'Testing & Deployment', 'Comprehensive testing, bug fixes, and production deployment',
     '[{"description": "Unit and integration tests", "completed": false, "approved": false}, 
       {"description": "Bug fixes and refinements", "completed": false, "approved": false}, 
       {"description": "Production deployment", "completed": false, "approved": false}]')
) AS milestone_data (order_number, title, description, deliverables)
WHERE c.milestone_count >= milestone_data.order_number
  AND c.status IN ('ACTIVE', 'COMPLETED')
ON CONFLICT DO NOTHING;

-- =====================================================
-- PAYMENTS (15 records - for milestones)
-- =====================================================
INSERT INTO payments (
    contract_id, payer_id, payee_id, amount_cents, currency,
    payment_method, description, status, transaction_id,
    reference_number, created_at, updated_at, processed_at
)
SELECT 
    m.contract_id,
    c.company_id AS payer_id,
    c.freelancer_id AS payee_id,
    m.amount_cents,
    'USD' AS currency,
    CASE (ROW_NUMBER() OVER (ORDER BY m.id) % 3)
        WHEN 1 THEN 'CREDIT_CARD'
        WHEN 2 THEN 'BANK_TRANSFER'
        ELSE 'WALLET'
    END AS payment_method,
    'Payment for ' || m.title AS description,
    CASE 
        WHEN ROW_NUMBER() OVER (ORDER BY m.id) <= 5 THEN 'COMPLETED'
        WHEN ROW_NUMBER() OVER (ORDER BY m.id) <= 10 THEN 'PROCESSING'
        ELSE 'PENDING'
    END AS status,
    'TXN-' || TO_CHAR(m.created_at, 'YYYYMMDD') || '-' || LPAD(m.id::TEXT, 8, '0') AS transaction_id,
    'REF-' || LPAD(m.id::TEXT, 10, '0') AS reference_number,
    m.created_at + INTERVAL '1 hour' AS created_at,
    m.created_at + INTERVAL '2 hours' AS updated_at,
    CASE 
        WHEN ROW_NUMBER() OVER (ORDER BY m.id) <= 5 THEN m.created_at + INTERVAL '3 hours'
        ELSE NULL
    END AS processed_at
FROM milestones m
JOIN contracts c ON m.contract_id = c.id
LIMIT 15
ON CONFLICT DO NOTHING;

-- =====================================================
-- INVOICES (15 records - for each payment)
-- =====================================================
INSERT INTO invoices (
    project_id, contract_id, milestone_id, company_id, freelancer_id, payment_id,
    invoice_type, invoice_date, due_date, paid_at,
    subtotal_cents, tax_amount_cents, platform_fee_cents, total_cents, currency,
    line_items, status, created_at, updated_at
)
SELECT 
    c.project_id,
    m.contract_id,
    m.id AS milestone_id,
    c.company_id,
    c.freelancer_id,
    p.id AS payment_id,
    'MILESTONE' AS invoice_type,
    p.created_at AS invoice_date,
    p.created_at + INTERVAL '14 days' AS due_date,
    p.processed_at AS paid_at,
    p.amount_cents AS subtotal_cents,
    (p.amount_cents * 0.08)::BIGINT AS tax_amount_cents,  -- 8% tax
    (p.amount_cents * 0.10)::BIGINT AS platform_fee_cents,  -- 10% platform fee
    (p.amount_cents + (p.amount_cents * 0.08)::BIGINT + (p.amount_cents * 0.10)::BIGINT)::BIGINT AS total_cents,
    'USD' AS currency,
    jsonb_build_array(
        jsonb_build_object(
            'description', m.title,
            'quantity', 1,
            'unit_price_cents', p.amount_cents,
            'total_cents', p.amount_cents
        )
    ) AS line_items,
    CASE 
        WHEN p.status = 'COMPLETED' THEN 'PAID'
        WHEN p.status = 'PROCESSING' THEN 'SENT'
        ELSE 'DRAFT'
    END AS status,
    p.created_at AS created_at,
    p.updated_at AS updated_at
FROM payments p
JOIN contracts c ON p.contract_id = c.id
JOIN milestones m ON m.contract_id = c.id 
    AND p.description LIKE '%' || m.title || '%'
WHERE p.status IN ('COMPLETED', 'PROCESSING')
ORDER BY p.id
LIMIT 15
ON CONFLICT DO NOTHING;

-- =====================================================
-- ESCROW (10 records - for active contracts)
-- =====================================================
INSERT INTO escrow (
    project_id, payment_id, amount_cents, currency,
    status, release_condition, auto_release_date,
    created_at, updated_at
)
SELECT 
    c.project_id,
    p.id AS payment_id,
    p.amount_cents,
    'USD' AS currency,
    CASE 
        WHEN p.status = 'COMPLETED' THEN 'RELEASED'
        WHEN p.status = 'PROCESSING' THEN 'HELD'
        ELSE 'HELD'
    END AS status,
    CASE 
        WHEN p.status = 'COMPLETED' THEN 'MILESTONE_COMPLETED'
        ELSE 'MANUAL_RELEASE'
    END AS release_condition,
    p.created_at + INTERVAL '30 days' AS auto_release_date,
    p.created_at AS created_at,
    p.updated_at AS updated_at
FROM payments p
JOIN contracts c ON p.contract_id = c.id
WHERE p.status IN ('COMPLETED', 'PROCESSING')
LIMIT 10
ON CONFLICT DO NOTHING;

-- =====================================================
-- PAYMENT HISTORY (30 records - audit trail)
-- =====================================================
INSERT INTO payment_history (
    user_id, payment_id, transaction_type, amount_cents, currency,
    balance_before_cents, balance_after_cents, status,
    description, reference_id, created_at
)
SELECT 
    f.user_id AS user_id,
    p.id AS payment_id,
    'PAYMENT_RECEIVED' AS transaction_type,
    p.amount_cents,
    'USD' AS currency,
    (ROW_NUMBER() OVER (PARTITION BY p.payee_id ORDER BY p.created_at) - 1) * p.amount_cents AS balance_before_cents,
    (ROW_NUMBER() OVER (PARTITION BY p.payee_id ORDER BY p.created_at)) * p.amount_cents AS balance_after_cents,
    p.status,
    'Payment received for ' || p.description AS description,
    p.transaction_id AS reference_id,
    p.processed_at AS created_at
FROM payments p
JOIN freelancers f ON p.payee_id = f.id
WHERE p.status = 'COMPLETED'
ON CONFLICT DO NOTHING;

-- Update company total_spent_cents
UPDATE companies co
SET total_spent_cents = (
    SELECT COALESCE(SUM(p.amount_cents), 0)
    FROM payments p
    WHERE p.payer_id = co.id AND p.status = 'COMPLETED'
);

-- Update freelancer total_earnings_cents and total_projects_completed
UPDATE freelancers f
SET total_earnings_cents = (
    SELECT COALESCE(SUM(p.amount_cents), 0)
    FROM payments p
    WHERE p.payee_id = f.id AND p.status = 'COMPLETED'
),
total_projects_completed = (
    SELECT COUNT(DISTINCT c.project_id)
    FROM contracts c
    WHERE c.freelancer_id = f.id AND c.status = 'COMPLETED'
);

-- Verify insertions
DO $$
BEGIN
    RAISE NOTICE 'Financial data loaded: % milestones, % payments, % invoices, % escrow records',
        (SELECT COUNT(*) FROM milestones),
        (SELECT COUNT(*) FROM payments),
        (SELECT COUNT(*) FROM invoices),
        (SELECT COUNT(*) FROM escrow);
    RAISE NOTICE 'Payment status: % completed, % processing, % pending',
        (SELECT COUNT(*) FROM payments WHERE status = 'COMPLETED'),
        (SELECT COUNT(*) FROM payments WHERE status = 'PROCESSING'),
        (SELECT COUNT(*) FROM payments WHERE status = 'PENDING');
END $$;
