-- =====================================================
-- SEED 01: Reference Data (Independent Tables)
-- Description: Experience levels, job categories, project categories
-- Dependencies: NONE
-- Author: Senior DBA & Principal DB Architect
-- =====================================================
-- Load Order: 1st (No dependencies)
-- =====================================================

-- EXPERIENCE LEVELS (5 records)
INSERT INTO experience_levels (name, code, description, years_min, years_max, display_order, is_active)
VALUES
('Entry Level', 'ENTRY', 'Less than 2 years of professional experience', 0, 2, 1, true),
('Intermediate', 'INTERMEDIATE', '2-5 years of professional experience', 2, 5, 2, true),
('Senior', 'SENIOR', '5-10 years of professional experience', 5, 10, 3, true),
('Lead', 'LEAD', '10+ years and leadership experience', 10, 99, 4, true),
('Executive', 'EXECUTIVE', 'C-suite or executive management level', 15, 99, 5, true)
ON CONFLICT (code) DO NOTHING;

-- JOB CATEGORIES (10 records)
INSERT INTO job_categories (name, slug, description, icon, display_order, is_active)
VALUES
('Software Development', 'software-development', 'Full-stack, backend, frontend, mobile development', 'code', 1, true),
('Design & Creative', 'design-creative', 'UI/UX, graphic design, video editing, animation', 'palette', 2, true),
('Marketing & Sales', 'marketing-sales', 'Digital marketing, SEO, content marketing, sales', 'trending-up', 3, true),
('Data Science & Analytics', 'data-science-analytics', 'Data analysis, machine learning, BI', 'bar-chart', 4, true),
('DevOps & Infrastructure', 'devops-infrastructure', 'Cloud architecture, CI/CD, system administration', 'server', 5, true),
('Quality Assurance', 'quality-assurance', 'Manual testing, automation, performance testing', 'check-circle', 6, true),
('Content Writing', 'content-writing', 'Technical writing, copywriting, blogging', 'file-text', 7, true),
('Project Management', 'project-management', 'Agile, Scrum, product management', 'clipboard', 8, true),
('Consulting', 'consulting', 'Business consulting, technical consulting', 'users', 9, true),
('Other', 'other', 'Miscellaneous freelance services', 'grid', 10, true)
ON CONFLICT (slug) DO NOTHING;

-- PROJECT CATEGORIES (10 records)
INSERT INTO project_categories (name, slug, description, icon, display_order, is_active)
VALUES
('Web Development', 'web-development', 'Website and web application development', 'globe', 1, true),
('Mobile Apps', 'mobile-apps', 'iOS and Android mobile applications', 'smartphone', 2, true),
('Design Projects', 'design-projects', 'UI/UX, Graphic Design, Branding', 'paintbrush', 3, true),
('Content Writing', 'content-writing', 'Blog posts, technical writing, copywriting', 'edit', 4, true),
('Marketing', 'marketing', 'Digital marketing, SEO, social media', 'megaphone', 5, true),
('Data & Analytics', 'data-analytics', 'Data analysis, visualization, reporting', 'bar-chart', 6, true),
('DevOps', 'devops', 'CI/CD, infrastructure, cloud deployment', 'server', 7, true),
('QA & Testing', 'qa-testing', 'Software testing and quality assurance', 'check-square', 8, true),
('Consulting', 'consulting', 'Technical and business consulting', 'users', 9, true),
('Other', 'other', 'Miscellaneous projects', 'grid', 10, true)
ON CONFLICT (slug) DO NOTHING;

-- Verify insertions
DO $$
BEGIN
    RAISE NOTICE 'Reference data loaded: % experience levels, % job categories, % project categories',
        (SELECT COUNT(*) FROM experience_levels),
        (SELECT COUNT(*) FROM job_categories),
        (SELECT COUNT(*) FROM project_categories);
END $$;
