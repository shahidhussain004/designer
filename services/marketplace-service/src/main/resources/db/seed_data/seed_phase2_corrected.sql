-- =====================================================
-- Comprehensive Seed Data - Phase 2 (CORRECTED)
-- Proposals, Contracts, Invoices, Payments, Milestones, Payouts, Reviews
-- =====================================================

-- Insert Proposals (freelancers proposing on projects)
INSERT INTO proposals (
    project_id, freelancer_id, cover_letter, suggested_budget_cents, proposed_timeline,
    status, is_featured, created_at, updated_at
) VALUES
(1, 11, 'I have 7 years of experience with full-stack development. I can deliver this e-commerce platform redesign in 60 days.', 
 10000000, '3-6_MONTHS', 'PENDING', false, NOW() - interval '10 days', NOW() - interval '10 days'),
(1, 12, 'As a full-stack developer with expertise in both frontend and backend, I can handle all aspects of your e-commerce project. My estimate is 55 days.',
 9500000, '3-6_MONTHS', 'PENDING', false, NOW() - interval '8 days', NOW() - interval '8 days'),
(2, 13, 'I specialize in SaaS dashboards. I have built 5+ analytics dashboards using React and charting libraries. ETA: 45 days.',
 5000000, '1-3_MONTHS', 'PENDING', true, NOW() - interval '15 days', NOW() - interval '15 days'),
(3, 14, 'iOS native development is my forte. I have shipped 8 apps on the App Store. Timeline: 50 days.',
 6000000, '1-3_MONTHS', 'PENDING', false, NOW() - interval '5 days', NOW() - interval '5 days'),
(4, 15, 'Professional brand identity designer with 10+ years experience. Turnaround: 20 days.',
 5500000, 'ASAP', 'PENDING', false, NOW() - interval '3 days', NOW() - interval '3 days'),
(5, 16, 'Senior data engineer with expertise in payment systems. 30-day completion.',
 6500000, '1-3_MONTHS', 'PENDING', true, NOW() - interval '7 days', NOW() - interval '7 days');

-- Insert Contracts (agreements between companies and freelancers)
INSERT INTO contracts (
    project_id, company_id, freelancer_id, proposal_id, title, description,
    contract_type, total_amount_cents, currency, payment_schedule,
    start_date, end_date, status, created_at, updated_at
) VALUES
(2, 2, 13, (SELECT id FROM proposals WHERE project_id = 2 AND freelancer_id = 13 LIMIT 1),
 'SaaS Dashboard Development', 'Build comprehensive analytics dashboard',
 'FIXED_PRICE', 5000000, 'USD', 'MILESTONE_BASED',
 NOW()::date, (NOW() + interval '45 days')::date, 'ACTIVE', NOW() - interval '5 days', NOW() - interval '5 days'),
(1, 1, 11, (SELECT id FROM proposals WHERE project_id = 1 AND freelancer_id = 11 LIMIT 1),
 'E-Commerce Platform Redesign', 'Complete redesign and modernization',
 'FIXED_PRICE', 10000000, 'USD', 'MILESTONE_BASED',
 NOW()::date, (NOW() + interval '60 days')::date, 'ACTIVE', NOW() - interval '3 days', NOW() - interval '3 days');

-- Insert Milestones for contracts
INSERT INTO milestones (
    project_id, contract_id, title, description, deliverables,
    amount_cents, currency, due_date, status, order_number, created_at, updated_at
) VALUES
(2, (SELECT id FROM contracts WHERE project_id = 2 AND freelancer_id = 13 LIMIT 1),
 'Design Phase', 'Initial design and architecture of dashboard', '["Wireframes", "Component library", "Design system"]'::jsonb,
 1666700, 'USD', (NOW() + interval '15 days')::date, 'SUBMITTED', 1, NOW(), NOW()),
(2, (SELECT id FROM contracts WHERE project_id = 2 AND freelancer_id = 13 LIMIT 1),
 'Development Phase', 'Full development of dashboard features', '["React components", "API integration", "State management"]'::jsonb,
 1666700, 'USD', (NOW() + interval '30 days')::date, 'IN_PROGRESS', 2, NOW(), NOW()),
(2, (SELECT id FROM contracts WHERE project_id = 2 AND freelancer_id = 13 LIMIT 1),
 'Testing and Deployment', 'QA, testing, and deployment to production', '["Test suite", "Deployment docs", "Production deployment"]'::jsonb,
 1666700, 'USD', (NOW() + interval '45 days')::date, 'NOT_STARTED', 3, NOW(), NOW()),
(1, (SELECT id FROM contracts WHERE project_id = 1 AND freelancer_id = 11 LIMIT 1),
 'Backend Setup', 'Set up API and database', '["Node.js API", "PostgreSQL schema", "Documentation"]'::jsonb,
 3333300, 'USD', (NOW() + interval '20 days')::date, 'IN_PROGRESS', 1, NOW(), NOW()),
(1, (SELECT id FROM contracts WHERE project_id = 1 AND freelancer_id = 11 LIMIT 1),
 'Frontend Implementation', 'Build React frontend', '["React components", "State management", "Styling"]'::jsonb,
 3333300, 'USD', (NOW() + interval '40 days')::date, 'NOT_STARTED', 2, NOW(), NOW()),
(1, (SELECT id FROM contracts WHERE project_id = 1 AND freelancer_id = 11 LIMIT 1),
 'Testing & Launch', 'QA and deployment', '["Test coverage", "Performance optimization", "Launch"]'::jsonb,
 3333400, 'USD', (NOW() + interval '60 days')::date, 'NOT_STARTED', 3, NOW(), NOW());

-- Insert Invoices
INSERT INTO invoices (
    project_id, contract_id, milestone_id, company_id, freelancer_id,
    invoice_number, invoice_type, invoice_date, due_date,
    subtotal_cents, tax_amount_cents, platform_fee_cents, total_cents, currency,
    status, created_at, updated_at
) VALUES
((SELECT project_id FROM contracts WHERE id IN (SELECT contract_id FROM milestones WHERE order_number = 1 LIMIT 1) LIMIT 1),
 (SELECT id FROM contracts WHERE project_id = 2 AND freelancer_id = 13 LIMIT 1),
 (SELECT id FROM milestones WHERE contract_id = (SELECT id FROM contracts WHERE project_id = 2 LIMIT 1) AND order_number = 1 LIMIT 1),
 2, 13, 'INV-2026-001', 'MILESTONE', (NOW() - interval '5 days')::date, (NOW() + interval '25 days')::date,
 1666700, 0, 100000, 1766700, 'USD', 'PENDING', NOW() - interval '5 days', NOW() - interval '5 days'),
((SELECT project_id FROM contracts WHERE id IN (SELECT contract_id FROM milestones WHERE order_number = 1 LIMIT 1) OFFSET 1 LIMIT 1),
 (SELECT id FROM contracts WHERE project_id = 1 AND freelancer_id = 11 LIMIT 1),
 (SELECT id FROM milestones WHERE contract_id = (SELECT id FROM contracts WHERE project_id = 1 LIMIT 1) AND order_number = 1 LIMIT 1),
 1, 11, 'INV-2026-002', 'MILESTONE', (NOW() - interval '2 days')::date, (NOW() + interval '28 days')::date,
 3333300, 0, 200000, 3533300, 'USD', 'PENDING', NOW() - interval '2 days', NOW() - interval '2 days');

-- Insert Payments
INSERT INTO payments (
    contract_id, payer_id, payee_id, amount_cents, currency, payment_method,
    status, transaction_id, reference_number, created_at, updated_at
) VALUES
((SELECT id FROM contracts WHERE project_id = 2 AND freelancer_id = 13 LIMIT 1),
 2, 13, 1766700, 'USD', 'ESCROW', 'PENDING', 'TXN-2026-001', 'REF-001',
 NOW() - interval '5 days', NOW() - interval '5 days'),
((SELECT id FROM contracts WHERE project_id = 1 AND freelancer_id = 11 LIMIT 1),
 1, 11, 3533300, 'USD', 'ESCROW', 'PENDING', 'TXN-2026-002', 'REF-002',
 NOW() - interval '2 days', NOW() - interval '2 days');

-- Insert Payouts (when freelancers get paid)
INSERT INTO payouts (
    user_id, amount_cents, currency, status, payout_date, created_at, updated_at
) VALUES
(13, 1590000, 'USD', 'PENDING', (NOW() + interval '7 days')::date, NOW() - interval '2 days', NOW() - interval '2 days'),
(11, 3180000, 'USD', 'PENDING', (NOW() + interval '10 days')::date, NOW(), NOW());

-- Insert Reviews
INSERT INTO reviews (
    reviewer_id, reviewee_id, project_id, contract_id, rating, comment,
    status, created_at, updated_at
) VALUES
((SELECT id FROM users WHERE role = 'COMPANY' LIMIT 1),
 13, 2, (SELECT id FROM contracts WHERE project_id = 2 LIMIT 1),
 5, 'Excellent work! Delivered high-quality code and very responsive to feedback.',
 'PUBLISHED', NOW() - interval '2 days', NOW() - interval '2 days');

-- Insert Portfolio Items
INSERT INTO portfolio_items (
    user_id, title, description, image_url, project_url, skills,
    featured, display_order, created_at, updated_at
) VALUES
(11, 'E-Commerce Platform Redesign', 'Complete redesign of large-scale e-commerce platform',
 'https://images.example.com/portfolio/ecommerce.jpg', 'https://projects.example.com/techcorp-shop',
 '["React", "Node.js", "PostgreSQL", "AWS"]'::jsonb, true, 1, NOW(), NOW()),
(11, 'SaaS Analytics Dashboard', 'Real-time analytics dashboard for B2B SaaS with 50+ charts',
 'https://images.example.com/portfolio/analytics.jpg', 'https://projects.example.com/analytics-dashboard',
 '["React", "TypeScript", "D3.js", "Redux"]'::jsonb, true, 2, NOW(), NOW()),
(13, 'Mobile App Dashboard', 'Cross-platform dashboard using React Native',
 'https://images.example.com/portfolio/mobile-dashboard.jpg', 'https://github.com/freelancer13/mobile-dash',
 '["React", "Node.js", "GraphQL", "MongoDB"]'::jsonb, true, 1, NOW(), NOW());

-- Insert Job Applications
INSERT INTO job_applications (
    job_id, applicant_id, full_name, email, phone, cover_letter,
    status, applied_at, created_at, updated_at
) VALUES
((SELECT id FROM jobs WHERE company_id = 1 ORDER BY id LIMIT 1), 11, 'Freelancer Eleven', 'user11@example.com', '+1-555-0011',
 'I am very interested in the React Developer position. My 4 years of React experience makes me a perfect fit.',
 'APPLIED', NOW() - interval '3 days', NOW() - interval '3 days', NOW() - interval '3 days'),
((SELECT id FROM jobs WHERE company_id = 1 ORDER BY id LIMIT 1), 12, 'Freelancer Twelve', 'user12@example.com', '+1-555-0012',
 'As a full-stack developer, I can also contribute to backend improvements.',
 'APPLIED', NOW() - interval '2 days', NOW() - interval '2 days', NOW() - interval '2 days'),
((SELECT id FROM jobs WHERE company_id = 2 ORDER BY id LIMIT 1), 15, 'Freelancer Fifteen', 'user15@example.com', '+1-555-0015',
 'My 5 years of Java experience and microservices expertise aligns perfectly with your Backend Engineer role.',
 'REVIEWED', NOW() - interval '5 days', NOW() - interval '5 days', NOW() - interval '5 days');

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
