-- Insert Reviews and Portfolio Items with CORRECT columns

-- Insert Reviews
INSERT INTO reviews (
    reviewer_id, reviewed_user_id, contract_id, project_id, rating, comment,
    status, is_verified_purchase, created_at, updated_at
) VALUES
((SELECT id FROM users WHERE role = 'COMPANY' LIMIT 1),
 13, (SELECT id FROM contracts WHERE project_id = 2 LIMIT 1), 2,
 5, 'Excellent work! Delivered high-quality code and very responsive to feedback.',
 'PUBLISHED', true, NOW() - interval '2 days', NOW() - interval '2 days');

-- Insert Portfolio Items
INSERT INTO portfolio_items (
    user_id, title, description, image_url, project_url,
    is_visible, display_order, created_at, updated_at
) VALUES
(11, 'E-Commerce Platform Redesign', 'Complete redesign of large-scale e-commerce platform',
 'https://images.example.com/portfolio/ecommerce.jpg', 'https://projects.example.com/techcorp-shop',
 true, 1, NOW(), NOW()),
(13, 'Mobile App Dashboard', 'Cross-platform dashboard using React Native',
 'https://images.example.com/portfolio/mobile-dashboard.jpg', 'https://github.com/freelancer13/mobile-dash',
 true, 1, NOW(), NOW());

-- Comprehensive Verification
SELECT 'Reviews' as entity, COUNT(*) as count FROM reviews
UNION ALL SELECT 'Portfolio Items', COUNT(*) FROM portfolio_items
UNION ALL SELECT '=== ALL SEED DATA SUMMARY ===' as entity, COUNT(*) FROM users WHERE role IN ('COMPANY', 'FREELANCER')
UNION ALL SELECT 'Companies', COUNT(*) FROM companies
UNION ALL SELECT 'Freelancers', COUNT(*) FROM freelancers
UNION ALL SELECT 'Projects', COUNT(*) FROM projects
UNION ALL SELECT 'Jobs', COUNT(*) FROM jobs
UNION ALL SELECT 'Proposals', COUNT(*) FROM proposals
UNION ALL SELECT 'Contracts', COUNT(*) FROM contracts
UNION ALL SELECT 'Milestones', COUNT(*) FROM milestones
UNION ALL SELECT 'Invoices', COUNT(*) FROM invoices
UNION ALL SELECT 'Payments', COUNT(*) FROM payments
UNION ALL SELECT 'Payouts', COUNT(*) FROM payouts
UNION ALL SELECT 'Job Applications', COUNT(*) FROM job_applications;
