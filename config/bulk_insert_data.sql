-- =====================================================
-- BULK INSERT: Additional Freelancers & Companies for Pagination Testing
-- =====================================================

-- Insert 100 additional freelancer users
INSERT INTO users (email, username, password_hash, role, full_name, phone, location, bio, email_verified, is_active, created_at)
SELECT 
    'freelancer' || i || '@example.com',
    'freelancer_' || i,
    '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i',
    'FREELANCER',
    (ARRAY['Alex', 'Beth', 'Chris', 'Dana', 'Eva', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'])[((i-1) % 10) + 1] || ' ' ||
    (ARRAY['Anderson', 'Brown', 'Chen', 'Davis', 'Evans', 'Foster', 'Garcia', 'Harris', 'Jackson', 'Kim'])[((i-1) % 10) + 1],
    '+1-555-' || LPAD(i::text, 4, '0'),
    (ARRAY['New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Seattle'])[((i-1) % 5) + 1],
    'Expert developer with specialized skills in tech',
    true,
    true,
    NOW() - ((i % 365)::INT || ' days')::INTERVAL
FROM generate_series(1, 100) i
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'freelancer' || i || '@example.com')
ON CONFLICT(email) DO NOTHING;

-- Insert 50 additional company users
INSERT INTO users (email, username, password_hash, role, full_name, phone, location, bio, email_verified, is_active, created_at)
SELECT 
    'company' || i || '@example.com',
    'company_' || i,
    '$2b$10$5AWfL5DDaqj4cKOizmnL8O4WSjOlVAWuUjkyvyUjJNhF9POur171i',
    'COMPANY',
    (ARRAY['Tech', 'Cloud', 'Data', 'Design', 'Mobile'])[((i-1) % 5) + 1] || ' Corp ' || i,
    '+1-600-' || LPAD(i::text, 4, '0'),
    (ARRAY['New York', 'San Francisco', 'Los Angeles', 'Chicago', 'Seattle'])[((i-1) % 5) + 1],
    'Leading company in industry innovation',
    true,
    true,
    NOW() - ((i % 365)::INT || ' days')::INTERVAL
FROM generate_series(1, 50) i
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'company' || i || '@example.com')
ON CONFLICT(email) DO NOTHING;

-- Insert freelancer profiles
INSERT INTO freelancers (user_id, hourly_rate_cents, experience_years, headline, skills, languages, completion_rate, total_earnings_cents, total_projects_completed, created_at)
SELECT 
    u.id,
    (ARRAY[7500, 8500, 9500, 10500, 11500, 12500, 13500, 14500, 15500, 16500])[((ROW_NUMBER() OVER (ORDER BY u.id) - 1) % 10) + 1],
    ((ROW_NUMBER() OVER (ORDER BY u.id) - 1) % 10) + 1,
    SUBSTRING(u.bio, 1, 80),
    '["React", "Node.js", "Python", "SQL", "AWS", "Docker"]'::jsonb,
    '[{"language": "English", "proficiency": "native"}]'::jsonb,
    95.0,
    0,
    0,
    u.created_at
FROM users u
WHERE u.role = 'FREELANCER' AND NOT EXISTS (SELECT 1 FROM freelancers WHERE user_id = u.id)
ON CONFLICT(user_id) DO NOTHING;

-- Insert company profiles
INSERT INTO companies (user_id, company_name, company_type, industry, website_url, company_size, phone, headquarters_location, total_projects_posted, total_spent_cents, created_at)
SELECT 
    u.id,
    u.full_name,
    (ARRAY['SMALL', 'MEDIUM', 'LARGE'])[((ROW_NUMBER() OVER (ORDER BY u.id) - 1) % 3) + 1],
    (ARRAY['Technology', 'Finance', 'Healthcare', 'Retail', 'Media'])[((ROW_NUMBER() OVER (ORDER BY u.id) - 1) % 5) + 1],
    'https://www.' || REPLACE(LOWER(u.full_name), ' ', '') || '.com',
    (ARRAY['SMALL', 'MEDIUM', 'LARGE'])[((ROW_NUMBER() OVER (ORDER BY u.id) - 1) % 3) + 1],
    u.phone,
    u.location,
    0,
    0,
    u.created_at
FROM users u
WHERE u.role = 'COMPANY' AND NOT EXISTS (SELECT 1 FROM companies WHERE user_id = u.id)
ON CONFLICT(user_id) DO NOTHING;

-- Final Count
DO $$
BEGIN
    RAISE NOTICE 'Bulk data loaded successfully:';
    RAISE NOTICE '  Users: %', (SELECT COUNT(*) FROM users);
    RAISE NOTICE '  Freelancers: %', (SELECT COUNT(*) FROM freelancers);
    RAISE NOTICE '  Companies: %', (SELECT COUNT(*) FROM companies);
END $$;
