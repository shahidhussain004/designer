-- =====================================================
-- Comprehensive Seed Data - Phase 2 (FINAL CORRECTED)
-- With proper column names and status values
-- =====================================================

-- Insert Proposals with CORRECT status values
INSERT INTO proposals (
    project_id, freelancer_id, cover_letter, suggested_budget_cents, proposed_timeline,
    status, created_at, updated_at
) VALUES
(1, 11, 'I have 7 years of experience with full-stack development. I can deliver this e-commerce platform redesign in 60 days.', 
 10000000, '3-6_MONTHS', 'SUBMITTED', NOW() - interval '10 days', NOW() - interval '10 days'),
(1, 12, 'As a full-stack developer with expertise in both frontend and backend, I can handle all aspects of your e-commerce project.',
 9500000, '3-6_MONTHS', 'SUBMITTED', NOW() - interval '8 days', NOW() - interval '8 days'),
(2, 13, 'I specialize in SaaS dashboards. I have built 5+ analytics dashboards using React and charting libraries.',
 5000000, '1-3_MONTHS', 'SHORTLISTED', NOW() - interval '15 days', NOW() - interval '15 days'),
(3, 14, 'iOS native development is my forte. I have shipped 8 apps on the App Store.',
 6000000, '1-3_MONTHS', 'SUBMITTED', NOW() - interval '5 days', NOW() - interval '5 days');

-- Insert Contracts
INSERT INTO contracts (
    project_id, company_id, freelancer_id, proposal_id, title, description,
    contract_type, total_amount_cents, currency, payment_schedule,
    start_date, end_date, status, created_at, updated_at
) VALUES
(2, 2, 13, (SELECT id FROM proposals WHERE project_id = 2 AND freelancer_id = 13 LIMIT 1),
 'SaaS Dashboard Development', 'Build comprehensive analytics dashboard',
 'FIXED_PRICE', 5000000, 'USD', 'MILESTONE_BASED',
 NOW()::date, (NOW() + interval '45 days')::date, 'ACTIVE', NOW() - interval '5 days', NOW() - interval '5 days');

-- Insert Milestones with CORRECT status values
INSERT INTO milestones (
    project_id, contract_id, title, description, deliverables,
    amount_cents, currency, due_date, status, order_number, created_at, updated_at
) VALUES
(2, (SELECT id FROM contracts WHERE project_id = 2 AND freelancer_id = 13 LIMIT 1),
 'Design Phase', 'Initial design and architecture of dashboard', '["Wireframes", "Component library"]'::jsonb,
 1666700, 'USD', (NOW() + interval '15 days')::date, 'SUBMITTED', 1, NOW(), NOW()),
(2, (SELECT id FROM contracts WHERE project_id = 2 AND freelancer_id = 13 LIMIT 1),
 'Development Phase', 'Full development of dashboard features', '["React components", "API integration"]'::jsonb,
 1666700, 'USD', (NOW() + interval '30 days')::date, 'IN_PROGRESS', 2, NOW(), NOW()),
(2, (SELECT id FROM contracts WHERE project_id = 2 AND freelancer_id = 13 LIMIT 1),
 'Testing and Deployment', 'QA, testing, and deployment to production', '["Test suite", "Deployment docs"]'::jsonb,
 1666700, 'USD', (NOW() + interval '45 days')::date, 'PENDING', 3, NOW(), NOW());

-- Insert Invoices with CORRECT types and status
INSERT INTO invoices (
    project_id, contract_id, milestone_id, company_id, freelancer_id,
    invoice_number, invoice_type, invoice_date, due_date,
    subtotal_cents, tax_amount_cents, platform_fee_cents, total_cents, currency,
    status, created_at, updated_at
) VALUES
(2,
 (SELECT id FROM contracts WHERE project_id = 2 AND freelancer_id = 13 LIMIT 1),
 (SELECT id FROM milestones WHERE contract_id = (SELECT id FROM contracts WHERE project_id = 2 LIMIT 1) AND order_number = 1 LIMIT 1),
 2, 13, 'INV-2026-001', 'MILESTONE', (NOW() - interval '5 days')::date, (NOW() + interval '25 days')::date,
 1666700, 0, 100000, 1766700, 'USD', 'SENT', NOW() - interval '5 days', NOW() - interval '5 days');

-- Insert Payments with CORRECT methods and status
INSERT INTO payments (
    contract_id, payer_id, payee_id, amount_cents, currency, payment_method,
    status, transaction_id, reference_number, created_at, updated_at
) VALUES
((SELECT id FROM contracts WHERE project_id = 2 AND freelancer_id = 13 LIMIT 1),
 2, 13, 1766700, 'USD', 'BANK_TRANSFER', 'PENDING', 'TXN-2026-001', 'REF-001',
 NOW() - interval '5 days', NOW() - interval '5 days');

-- Insert Payouts
INSERT INTO payouts (
    user_id, amount_cents, currency, status, created_at, updated_at
) VALUES
(13, 1590000, 'USD', 'PENDING', NOW() - interval '2 days', NOW() - interval '2 days');

-- Insert Reviews with CORRECT status
INSERT INTO reviews (
    reviewer_id, user_id, project_id, contract_id, rating, comment,
    status, created_at, updated_at
) VALUES
((SELECT id FROM users WHERE role = 'COMPANY' LIMIT 1),
 13, 2, (SELECT id FROM contracts WHERE project_id = 2 LIMIT 1),
 5, 'Excellent work! Delivered high-quality code and very responsive to feedback.',
 'PUBLISHED', NOW() - interval '2 days', NOW() - interval '2 days');

-- Insert Portfolio Items (no skills column - check for correct columns)
INSERT INTO portfolio_items (
    user_id, title, description, image_url, project_url,
    featured, display_order, created_at, updated_at
) VALUES
(11, 'E-Commerce Platform Redesign', 'Complete redesign of large-scale e-commerce platform',
 'https://images.example.com/portfolio/ecommerce.jpg', 'https://projects.example.com/techcorp-shop',
 true, 1, NOW(), NOW()),
(13, 'Mobile App Dashboard', 'Cross-platform dashboard using React Native',
 'https://images.example.com/portfolio/mobile-dashboard.jpg', 'https://github.com/freelancer13/mobile-dash',
 true, 1, NOW(), NOW());

-- Insert Job Applications with CORRECT status
INSERT INTO job_applications (
    job_id, applicant_id, full_name, email, phone, cover_letter,
    status, applied_at, created_at, updated_at
) VALUES
((SELECT id FROM jobs WHERE company_id = 1 ORDER BY id LIMIT 1), 11, 'Freelancer Eleven', 'user11@example.com', '+1-555-0011',
 'I am very interested in the React Developer position.',
 'SUBMITTED', NOW() - interval '3 days', NOW() - interval '3 days', NOW() - interval '3 days'),
((SELECT id FROM jobs WHERE company_id = 1 ORDER BY id LIMIT 1), 12, 'Freelancer Twelve', 'user12@example.com', '+1-555-0012',
 'As a full-stack developer, I can contribute significantly.',
 'SUBMITTED', NOW() - interval '2 days', NOW() - interval '2 days', NOW() - interval '2 days'),
((SELECT id FROM jobs WHERE company_id = 2 ORDER BY id LIMIT 1), 15, 'Freelancer Fifteen', 'user15@example.com', '+1-555-0015',
 'My Java experience and microservices expertise aligns with Backend Engineer role.',
 'SUBMITTED', NOW() - interval '5 days', NOW() - interval '5 days', NOW() - interval '5 days');

-- Verify data
SELECT 'Proposals' as entity, COUNT(*) as count FROM proposals
UNION ALL SELECT 'Contracts', COUNT(*) FROM contracts
UNION ALL SELECT 'Milestones', COUNT(*) FROM milestones
UNION ALL SELECT 'Invoices', COUNT(*) FROM invoices
UNION ALL SELECT 'Payments', COUNT(*) FROM payments
UNION ALL SELECT 'Payouts', COUNT(*) FROM payouts
UNION ALL SELECT 'Reviews', COUNT(*) FROM reviews
UNION ALL SELECT 'Portfolio Items', COUNT(*) FROM portfolio_items
UNION ALL SELECT 'Job Applications', COUNT(*) FROM job_applications;
