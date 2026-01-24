-- =====================================================
-- Portfolio Items Seed Data (CORRECTED)
-- For actual freelancer users (freelancer IDs 1-5)
-- Date: 2026-01-24
-- =====================================================

-- Database relationships:
--   users table: IDs 11-15 (alice_dev, bob_python, carol_java, david_ios, emma_android)
--   freelancers table: IDs 1-5 with user_id FK pointing to users 11-15
--   portfolio_items.user_id MUST reference freelancers.id (NOT users.id)
--
-- Portfolio item inserts use freelancer IDs 1-5:
--   Freelancer ID 1 → User 11 (alice_dev)
--   Freelancer ID 2 → User 12 (bob_python)
--   Freelancer ID 3 → User 13 (carol_java)
--   Freelancer ID 4 → User 14 (david_ios)
--   Freelancer ID 5 → User 15 (emma_android)

INSERT INTO portfolio_items (
    user_id, title, description, image_url, project_url,
    technologies, tools_used, skills_demonstrated, 
    start_date, end_date, is_visible, display_order,
    created_at, updated_at
) VALUES
-- Freelancer 1 (alice_dev) Portfolio
(1, 'E-Commerce Platform Redesign', 
 'Complete UX/UI redesign of large-scale e-commerce platform with 2M+ monthly users. Implemented responsive design, improved checkout flow, resulting in 25% increase in conversion rate.',
 'https://images.example.com/portfolio/ecommerce-redesign.jpg', 
 'https://projects.example.com/ecommerce-redesign',
 '["React", "TypeScript", "Tailwind CSS", "Next.js", "PostgreSQL"]'::jsonb,
 '["Figma", "GitHub", "Jira", "VS Code"]'::jsonb,
 '["UI/UX Design", "Frontend Development", "Responsive Design", "Performance Optimization"]'::jsonb,
 '2024-01-15'::date, '2024-06-30'::date, true, 1,
 NOW() - interval '180 days', NOW() - interval '180 days'),

(1, 'Mobile App Dashboard', 
 'Cross-platform dashboard application for real-time analytics and reporting. Built with React Native for iOS and Android with 50K+ monthly active users.',
 'https://images.example.com/portfolio/mobile-dashboard.jpg',
 'https://github.com/freelancer1/mobile-analytics-dashboard',
 '["React Native", "Redux", "Firebase", "Chart.js"]'::jsonb,
 '["React Native CLI", "Xcode", "Android Studio", "Firebase Console"]'::jsonb,
 '["Mobile Development", "State Management", "Real-time Data", "API Integration"]'::jsonb,
 '2024-03-01'::date, '2024-08-15'::date, true, 2,
 NOW() - interval '160 days', NOW() - interval '160 days'),

(1, 'Enterprise Admin System',
 'Built comprehensive admin dashboard for enterprise client managing 500+ users. Features include role-based access control, audit logs, and real-time monitoring.',
 'https://images.example.com/portfolio/admin-system.jpg',
 'https://projects.example.com/admin-portal',
 '["Vue.js", "Node.js", "MongoDB", "WebSocket"]'::jsonb,
 '["Webpack", "ESLint", "Jest", "Docker"]'::jsonb,
 '["Backend Development", "Authentication", "Authorization", "Real-time Updates"]'::jsonb,
 '2023-09-01'::date, '2024-02-28'::date, true, 3,
 NOW() - interval '240 days', NOW() - interval '240 days'),

-- Freelancer 2 (bob_python) Portfolio
(2, 'SaaS Analytics Platform',
 'Full-stack analytics platform for tracking user behavior, funnel analysis, and cohort retention. Handles 1B+ events per day with real-time processing.',
 'https://images.example.com/portfolio/saas-analytics.jpg',
 'https://analytics.example.com',
 '["Python", "Apache Spark", "PostgreSQL", "Grafana", "Kafka"]'::jsonb,
 '["Jupyter", "Git", "Kubernetes", "Terraform"]'::jsonb,
 '["Backend Development", "Big Data", "System Design", "API Development"]'::jsonb,
 '2024-02-01'::date, '2024-09-30'::date, true, 1,
 NOW() - interval '150 days', NOW() - interval '150 days'),

(2, 'Microservices Architecture Migration',
 'Led migration of monolithic application to microservices architecture. Designed and implemented 12 independent services with API gateway, reducing deployment time by 70%.',
 'https://images.example.com/portfolio/microservices.jpg',
 'https://github.com/freelancer2/microservices-example',
 '["Java", "Spring Boot", "Docker", "Kubernetes", "gRPC"]'::jsonb,
 '["Maven", "GitLab CI/CD", "Prometheus", "ELK Stack"]'::jsonb,
 '["System Architecture", "DevOps", "Performance Optimization", "Team Leadership"]'::jsonb,
 '2023-06-15'::date, '2024-01-31'::date, true, 2,
 NOW() - interval '300 days', NOW() - interval '300 days'),

-- Freelancer 3 (carol_java) Portfolio
(3, 'Mobile App Dashboard',
 'Cross-platform dashboard using React Native for performance analytics and user insights. Supports 25K+ active installs with 4.8-star rating.',
 'https://images.example.com/portfolio/react-native-dashboard.jpg',
 'https://github.com/freelancer3/mobile-dash',
 '["React Native", "Firebase", "Redux Toolkit", "Native Modules"]'::jsonb,
 '["Expo", "React Native Debugger", "Xcode", "Android Studio"]'::jsonb,
 '["Mobile Development", "Performance Tuning", "User Experience", "Analytics Integration"]'::jsonb,
 '2024-01-20'::date, '2024-07-15'::date, true, 1,
 NOW() - interval '170 days', NOW() - interval '170 days'),

(3, 'Real-time Chat Application',
 'Built real-time chat application with end-to-end encryption, supporting 100K+ concurrent users. Implemented WebSocket architecture for low-latency messaging.',
 'https://images.example.com/portfolio/chat-app.jpg',
 'https://chat.example.com',
 '["React", "Node.js", "Socket.io", "MongoDB", "Redis"]'::jsonb,
 '["WebStorm", "Postman", "Redis CLI", "Nginx"]'::jsonb,
 '["Real-time Communication", "Encryption", "Scalability", "WebSocket Implementation"]'::jsonb,
 '2023-11-01'::date, '2024-05-30'::date, true, 2,
 NOW() - interval '210 days', NOW() - interval '210 days'),

-- Freelancer 4 (david_ios) Portfolio
(4, 'iOS Shopping Application',
 'Full-featured e-commerce app for iPhone and iPad. Integrated Stripe payment processing, AR product visualization, and push notifications. 50K+ downloads.',
 'https://images.example.com/portfolio/ios-shopping.jpg',
 'https://apps.apple.com/app/example-shopping',
 '["Swift", "SwiftUI", "CoreData", "Combine", "ARKit"]'::jsonb,
 '["Xcode", "TestFlight", "App Store Connect", "Instruments"]'::jsonb,
 '["iOS Development", "Payment Integration", "AR Technology", "User Interface Design"]'::jsonb,
 '2024-02-01'::date, '2024-08-31'::date, true, 1,
 NOW() - interval '145 days', NOW() - interval '145 days'),

(4, 'Android Video Streaming App',
 'Native Android app for streaming HD video content with adaptive bitrate streaming. Supports offline viewing and background downloads. 100K+ users.',
 'https://images.example.com/portfolio/android-streaming.jpg',
 'https://github.com/freelancer4/android-video-stream',
 '["Kotlin", "Android Jetpack", "ExoPlayer", "Room Database"]'::jsonb,
 '["Android Studio", "Firebase", "Gradle", "Jenkins"]'::jsonb,
 '["Android Development", "Video Streaming", "Performance Optimization", "Database Design"]'::jsonb,
 '2023-08-15'::date, '2024-04-30'::date, true, 2,
 NOW() - interval '270 days', NOW() - interval '270 days'),

-- Freelancer 5 (emma_android) Portfolio
(5, 'Machine Learning Pipeline',
 'Designed and built end-to-end ML pipeline for predictive analytics. Achieved 94% accuracy on test set. Deployed to production serving 10M+ predictions monthly.',
 'https://images.example.com/portfolio/ml-pipeline.jpg',
 'https://github.com/freelancer5/ml-pipeline',
 '["Python", "TensorFlow", "Scikit-learn", "Apache Airflow", "PostgreSQL"]'::jsonb,
 '["Jupyter", "Git", "Docker", "MLflow"]'::jsonb,
 '["Machine Learning", "Data Science", "Model Deployment", "ETL Pipeline"]'::jsonb,
 '2024-01-01'::date, '2024-06-30'::date, true, 1,
 NOW() - interval '175 days', NOW() - interval '175 days'),

(5, 'Data Warehouse Implementation',
 'Implemented enterprise data warehouse using Snowflake and dbt. Reduced report generation time from 4 hours to 15 minutes. 500+ concurrent users.',
 'https://images.example.com/portfolio/data-warehouse.jpg',
 'https://projects.example.com/data-warehouse',
 '["Snowflake", "dbt", "Python", "SQL", "Apache Airflow"]'::jsonb,
 '["dbt Cloud", "Looker", "GitHub Actions", "Snowsql"]'::jsonb,
 '["Data Architecture", "ETL", "SQL Optimization", "Business Intelligence"]'::jsonb,
 '2023-10-15'::date, '2024-04-15'::date, true, 2,
 NOW() - interval '260 days', NOW() - interval '260 days');

-- =====================================================
-- Verification Query
-- =====================================================
SELECT 
    COUNT(*) as total_portfolio_items,
    COUNT(DISTINCT user_id) as freelancers_with_portfolio
FROM portfolio_items
WHERE user_id IN (1, 2, 3, 4, 5)
AND deleted_at IS NULL;

-- Show portfolio visibility distribution
SELECT 
    user_id,
    COUNT(*) as portfolio_count,
    COUNT(CASE WHEN is_visible = true THEN 1 END) as visible_count
FROM portfolio_items
WHERE user_id IN (1, 2, 3, 4, 5)
AND deleted_at IS NULL
GROUP BY user_id
ORDER BY user_id;
