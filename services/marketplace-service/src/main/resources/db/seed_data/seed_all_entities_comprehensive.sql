-- =====================================================
-- Comprehensive Seed Data - Phase 2
-- Proposals, Contracts, Invoices, Payments, Payouts, Milestones, Time Entries, Reviews
-- =====================================================

-- Insert Proposals (freelancers proposing on projects)
-- Freelancer 11 proposes on Project 1
INSERT INTO proposals (
    project_id, freelancer_id, cover_letter, proposal_amount_cents, payment_type, timeline_days,
    status, views_count, created_at, updated_at
) VALUES
(1, 11, 'I have 7 years of experience with React and Node.js. I am confident I can deliver this e-commerce platform redesign in the specified timeline.', 
 10000000, 'FIXED_PRICE', 60, 'PENDING', 5, NOW() - interval '10 days', NOW() - interval '10 days'),
(1, 12, 'As a full-stack developer with expertise in both frontend and backend, I can handle all aspects of your e-commerce project.',
 9500000, 'FIXED_PRICE', 55, 'PENDING', 3, NOW() - interval '8 days', NOW() - interval '8 days'),
(2, 13, 'I specialize in SaaS dashboards. I have built 5+ analytics dashboards using React and charting libraries.',
 5000000, 'FIXED_PRICE', 45, 'ACCEPTED', 8, NOW() - interval '15 days', NOW() - interval '15 days'),
(3, 14, 'iOS native development is my forte. I have shipped 8 apps on the App Store.',
 6000000, 'FIXED_PRICE', 50, 'PENDING', 2, NOW() - interval '5 days', NOW() - interval '5 days');

-- Insert Contracts (agreements between companies and freelancers)
-- Based on accepted proposal for Project 2
INSERT INTO contracts (
    project_id, company_id, freelancer_id, proposal_id, contract_amount_cents,
    start_date, end_date, payment_terms, status, created_at, updated_at
) VALUES
(2, 2, 13, (SELECT id FROM proposals WHERE project_id = 2 AND freelancer_id = 13 LIMIT 1), 5000000,
 NOW()::date, NOW()::date + interval '45 days', 'FIXED_PRICE_UPON_COMPLETION', 'ACTIVE', NOW() - interval '5 days', NOW() - interval '5 days');

-- Insert Milestones for the contract
INSERT INTO milestones (
    contract_id, job_id, title, description, amount_cents, status, order_index,
    created_at, updated_at
) VALUES
((SELECT id FROM contracts WHERE project_id = 2 AND freelancer_id = 13 LIMIT 1), 
 (SELECT id FROM jobs WHERE company_id = 2 LIMIT 1),
 'Design Phase', 'Initial design and architecture of dashboard', 1666700,
 'SUBMITTED', 1, NOW(), NOW()),
((SELECT id FROM contracts WHERE project_id = 2 AND freelancer_id = 13 LIMIT 1),
 (SELECT id FROM jobs WHERE company_id = 2 LIMIT 1),
 'Development Phase', 'Full development of dashboard features', 1666700,
 'IN_PROGRESS', 2, NOW(), NOW()),
((SELECT id FROM contracts WHERE project_id = 2 AND freelancer_id = 13 LIMIT 1),
 (SELECT id FROM jobs WHERE company_id = 2 LIMIT 1),
 'Testing and Deployment', 'QA, testing, and deployment to production', 1666700,
 'NOT_STARTED', 3, NOW(), NOW());

-- Insert Time Entries for the contract
INSERT INTO time_entries (
    contract_id, freelancer_id, date, hours_worked, description, status, created_at, updated_at
) VALUES
((SELECT id FROM contracts WHERE project_id = 2 LIMIT 1), 13, (NOW() - interval '3 days')::date, 8.5,
 'Dashboard UI component development', 'APPROVED', NOW() - interval '3 days', NOW() - interval '3 days'),
((SELECT id FROM contracts WHERE project_id = 2 LIMIT 1), 13, (NOW() - interval '2 days')::date, 7.0,
 'API integration and data fetching', 'APPROVED', NOW() - interval '2 days', NOW() - interval '2 days'),
((SELECT id FROM contracts WHERE project_id = 2 LIMIT 1), 13, (NOW() - interval '1 day')::date, 6.5,
 'Testing and bug fixes', 'PENDING', NOW() - interval '1 day', NOW() - interval '1 day');

-- Insert Invoices (for both time-based and fixed-price work)
INSERT INTO invoices (
    invoice_number, contract_id, company_id, freelancer_id, invoice_date, due_date,
    amount_cents, tax_cents, status, created_at, updated_at
) VALUES
('INV-2026-001', (SELECT id FROM contracts WHERE project_id = 2 LIMIT 1), 2, 13,
 (NOW() - interval '5 days')::date, (NOW() + interval '25 days')::date,
 5000000, 0, 'PENDING', NOW() - interval '5 days', NOW() - interval '5 days');

-- Insert Payments (payment records)
INSERT INTO payments (
    invoice_id, amount_cents, payment_method, transaction_id, status, created_at, updated_at
) VALUES
((SELECT id FROM invoices WHERE invoice_number = 'INV-2026-001' LIMIT 1), 5000000, 'ESCROW', 'TXN-2026-001',
 'PENDING', NOW() - interval '5 days', NOW() - interval '5 days');

-- Insert Payouts (when freelancers get paid)
INSERT INTO payouts (
    freelancer_id, amount_cents, status, payout_date, created_at, updated_at
) VALUES
(13, 4500000, 'PENDING', NOW() + interval '7 days', NOW() - interval '2 days', NOW() - interval '2 days');

-- Insert Reviews (after project completion)
INSERT INTO reviews (
    reviewer_id, reviewee_id, project_id, contract_id, rating, comment, 
    communication_rating, quality_rating, professionalism_rating,
    status, created_at, updated_at
) VALUES
((SELECT id FROM users WHERE role = 'COMPANY' LIMIT 1),
 (SELECT id FROM users WHERE id = 13 LIMIT 1),
 (SELECT id FROM projects WHERE id = 2 LIMIT 1),
 (SELECT id FROM contracts WHERE project_id = 2 LIMIT 1),
 5, 'Excellent work! The freelancer delivered high-quality code and was very responsive to feedback. Highly recommended!',
 5, 5, 5, 'PUBLISHED', NOW() - interval '2 days', NOW() - interval '2 days');

-- Insert Portfolio Items for freelancers
INSERT INTO portfolio_items (
    freelancer_id, title, description, image_url, project_url, skills,
    featured, display_order, created_at, updated_at
) VALUES
(11, 'E-Commerce Platform Redesign', 'Complete redesign of a large-scale e-commerce platform for TechCorp',
 'https://images.example.com/portfolio/ecommerce.jpg', 'https://projects.example.com/techcorp-shop',
 '["React", "Node.js", "PostgreSQL", "AWS"]'::jsonb, true, 1, NOW(), NOW()),
(11, 'SaaS Analytics Dashboard', 'Real-time analytics dashboard for a B2B SaaS product with 50+ charts and metrics',
 'https://images.example.com/portfolio/analytics.jpg', 'https://projects.example.com/analytics-dashboard',
 '["React", "TypeScript", "D3.js", "Redux"]'::jsonb, true, 2, NOW(), NOW()),
(13, 'Mobile App Dashboard', 'Cross-platform dashboard for mobile app analytics using React Native',
 'https://images.example.com/portfolio/mobile-dashboard.jpg', 'https://github.com/freelancer13/mobile-dash',
 '["React", "Node.js", "GraphQL", "MongoDB"]'::jsonb, true, 1, NOW(), NOW());

-- Job Applications
INSERT INTO job_applications (
    job_id, freelancer_id, cover_letter, status, created_at, updated_at
) VALUES
((SELECT id FROM jobs WHERE company_id = 1 LIMIT 1), 11,
 'I am very interested in this React Developer position. With my 4 years of React experience and track record of delivering high-quality projects, I am confident I can contribute significantly to your team.',
 'APPLIED', NOW() - interval '3 days', NOW() - interval '3 days'),
((SELECT id FROM jobs WHERE company_id = 1 LIMIT 1), 12,
 'As a full-stack developer, I can also contribute to backend improvements. Looking forward to discussing the opportunity.',
 'APPLIED', NOW() - interval '2 days', NOW() - interval '2 days'),
((SELECT id FROM jobs WHERE company_id = 2 LIMIT 1), 15,
 'My experience with Java and microservices aligns perfectly with your Backend Engineer role.',
 'REVIEWED', NOW() - interval '5 days', NOW() - interval '5 days');

-- Verify data
SELECT 'Proposals' as entity, COUNT(*) as count FROM proposals
UNION ALL
SELECT 'Contracts', COUNT(*) FROM contracts
UNION ALL
SELECT 'Milestones', COUNT(*) FROM milestones
UNION ALL
SELECT 'Time Entries', COUNT(*) FROM time_entries
UNION ALL
SELECT 'Invoices', COUNT(*) FROM invoices
UNION ALL
SELECT 'Payments', COUNT(*) FROM payments
UNION ALL
SELECT 'Payouts', COUNT(*) FROM payouts
UNION ALL
SELECT 'Reviews', COUNT(*) FROM reviews
UNION ALL
SELECT 'Portfolio Items', COUNT(*) FROM portfolio_items
UNION ALL
SELECT 'Job Applications', COUNT(*) FROM job_applications;
