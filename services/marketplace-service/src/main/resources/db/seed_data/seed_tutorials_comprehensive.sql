-- =====================================================
-- Comprehensive Tutorial Seed Data
-- Tutorials for content-service database
-- =====================================================

-- Insert Tutorials
INSERT INTO tutorials (
    title, slug, description, difficulty_level, estimated_duration_minutes,
    is_published, is_featured, display_order, thumbnail_url, video_url,
    author_name, author_bio, tags, prerequisites, learning_outcomes,
    created_at, updated_at, published_at
) VALUES
-- Web Development Tutorials
('Complete React Beginner Course', 'complete-react-beginner-course',
 'Learn React from scratch with hands-on projects. Perfect for beginners who want to build modern web applications.',
 'beginner', 480, true, true, 1,
 'https://images.unsplash.com/photo-1633356122544-f134324a6cee',
 'https://example.com/videos/react-beginner.mp4',
 'Sarah Johnson', 'Full-stack developer with 10+ years experience',
 '["react", "javascript", "web development", "frontend"]'::jsonb,
 '["Basic HTML", "Basic CSS", "JavaScript fundamentals"]'::jsonb,
 '["Build React components", "Manage state with hooks", "Create single-page applications"]'::jsonb,
 NOW() - interval '60 days', NOW() - interval '60 days', NOW() - interval '58 days'),

('Node.js Backend Development', 'nodejs-backend-development',
 'Master Node.js and Express to build scalable backend APIs. Includes authentication, databases, and deployment.',
 'intermediate', 600, true, true, 2,
 'https://images.unsplash.com/photo-1627398242454-45a1465c2479',
 'https://example.com/videos/nodejs-backend.mp4',
 'Michael Chen', 'Backend architect specializing in Node.js and microservices',
 '["nodejs", "express", "backend", "api", "rest"]'::jsonb,
 '["JavaScript fundamentals", "Async programming basics", "Command line basics"]'::jsonb,
 '["Build REST APIs", "Implement authentication", "Work with databases", "Deploy applications"]'::jsonb,
 NOW() - interval '55 days', NOW() - interval '55 days', NOW() - interval '53 days'),

('Full Stack JavaScript with MERN', 'full-stack-javascript-mern',
 'Complete full-stack development course using MongoDB, Express, React, and Node.js. Build production-ready applications.',
 'advanced', 900, true, false, 3,
 'https://images.unsplash.com/photo-1593720213428-28a5b9e94613',
 'https://example.com/videos/mern-stack.mp4',
 'David Martinez', 'Full-stack developer and tech educator',
 '["mern", "mongodb", "express", "react", "nodejs", "fullstack"]'::jsonb,
 '["React basics", "Node.js basics", "REST API concepts", "Database basics"]'::jsonb,
 '["Build full-stack applications", "Implement real-time features", "Deploy to production"]'::jsonb,
 NOW() - interval '50 days', NOW() - interval '50 days', NOW() - interval '48 days'),

-- Design Tutorials
('UI/UX Design Fundamentals', 'ui-ux-design-fundamentals',
 'Learn the principles of user interface and user experience design. Create beautiful and functional designs.',
 'beginner', 360, true, true, 4,
 'https://images.unsplash.com/photo-1561070791-2526d30994b5',
 'https://example.com/videos/ui-ux-fundamentals.mp4',
 'Emma Williams', 'Senior UX designer at tech startups',
 '["ui", "ux", "design", "figma", "user experience"]'::jsonb,
 '["Basic design principles", "Familiarity with design tools"]'::jsonb,
 '["Create user-centered designs", "Build wireframes and prototypes", "Conduct user research"]'::jsonb,
 NOW() - interval '45 days', NOW() - interval '45 days', NOW() - interval '43 days'),

('Figma Mastery for Designers', 'figma-mastery-for-designers',
 'Comprehensive Figma course covering everything from basics to advanced prototyping and design systems.',
 'intermediate', 420, true, false, 5,
 'https://images.unsplash.com/photo-1609921212029-bb5a28e60960',
 'https://example.com/videos/figma-mastery.mp4',
 'Alex Thompson', 'Product designer with focus on design systems',
 '["figma", "design tools", "prototyping", "design systems"]'::jsonb,
 '["Basic UI design knowledge", "Figma account setup"]'::jsonb,
 '["Master Figma tools", "Create design systems", "Build interactive prototypes"]'::jsonb,
 NOW() - interval '40 days', NOW() - interval '40 days', NOW() - interval '38 days'),

-- Data Science & AI
('Python for Data Science', 'python-for-data-science',
 'Learn Python programming for data analysis, visualization, and machine learning. Hands-on with real datasets.',
 'beginner', 540, true, true, 6,
 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
 'https://example.com/videos/python-data-science.mp4',
 'Dr. Lisa Anderson', 'Data scientist and AI researcher',
 '["python", "data science", "pandas", "numpy", "visualization"]'::jsonb,
 '["Basic programming concepts", "Mathematics basics"]'::jsonb,
 '["Analyze data with Python", "Create visualizations", "Build ML models"]'::jsonb,
 NOW() - interval '35 days', NOW() - interval '35 days', NOW() - interval '33 days'),

('Machine Learning with TensorFlow', 'machine-learning-tensorflow',
 'Deep dive into machine learning using TensorFlow. Build neural networks, work with image and text data.',
 'advanced', 720, true, false, 7,
 'https://images.unsplash.com/photo-1677442136019-21780ecad995',
 'https://example.com/videos/ml-tensorflow.mp4',
 'Prof. James Wilson', 'ML engineer and university professor',
 '["machine learning", "tensorflow", "deep learning", "neural networks", "ai"]'::jsonb,
 '["Python programming", "Linear algebra", "Calculus basics", "Statistics"]'::jsonb,
 '["Build neural networks", "Train ML models", "Deploy AI applications"]'::jsonb,
 NOW() - interval '30 days', NOW() - interval '30 days', NOW() - interval '28 days'),

-- Mobile Development
('iOS App Development with Swift', 'ios-app-development-swift',
 'Create beautiful iOS apps using Swift and SwiftUI. From basics to App Store deployment.',
 'beginner', 600, true, true, 8,
 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c',
 'https://example.com/videos/ios-swift.mp4',
 'Jennifer Lee', 'iOS developer and app entrepreneur',
 '["ios", "swift", "swiftui", "mobile", "apple"]'::jsonb,
 '["Basic programming concepts", "Mac computer with Xcode"]'::jsonb,
 '["Build iOS apps", "Use SwiftUI", "Publish to App Store"]'::jsonb,
 NOW() - interval '25 days', NOW() - interval '25 days', NOW() - interval '23 days'),

('React Native Cross-Platform Apps', 'react-native-cross-platform',
 'Build mobile apps for both iOS and Android with React Native. One codebase, multiple platforms.',
 'intermediate', 540, true, false, 9,
 'https://images.unsplash.com/photo-1551650975-87deedd944c3',
 'https://example.com/videos/react-native.mp4',
 'Tom Rodriguez', 'Mobile developer specializing in cross-platform solutions',
 '["react native", "mobile", "ios", "android", "javascript"]'::jsonb,
 '["React basics", "JavaScript ES6", "Mobile app concepts"]'::jsonb,
 '["Build cross-platform apps", "Use native features", "Deploy to app stores"]'::jsonb,
 NOW() - interval '20 days', NOW() - interval '20 days', NOW() - interval '18 days'),

-- DevOps & Cloud
('Docker and Kubernetes Essentials', 'docker-kubernetes-essentials',
 'Master containerization with Docker and orchestration with Kubernetes. Deploy scalable applications.',
 'intermediate', 480, true, true, 10,
 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9',
 'https://example.com/videos/docker-kubernetes.mp4',
 'Chris Anderson', 'DevOps engineer with cloud expertise',
 '["docker", "kubernetes", "devops", "containers", "cloud"]'::jsonb,
 '["Linux basics", "Command line proficiency", "Basic networking"]'::jsonb,
 '["Containerize applications", "Deploy with Kubernetes", "Manage clusters"]'::jsonb,
 NOW() - interval '15 days', NOW() - interval '15 days', NOW() - interval '13 days'),

('AWS Cloud Practitioner', 'aws-cloud-practitioner',
 'Complete guide to Amazon Web Services. Learn core AWS services and prepare for certification.',
 'beginner', 420, true, false, 11,
 'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
 'https://example.com/videos/aws-cloud.mp4',
 'Rachel Green', 'AWS certified solutions architect',
 '["aws", "cloud", "amazon", "devops", "infrastructure"]'::jsonb,
 '["Basic IT knowledge", "Understanding of web concepts"]'::jsonb,
 '["Use core AWS services", "Design cloud solutions", "Pass certification exam"]'::jsonb,
 NOW() - interval '10 days', NOW() - interval '10 days', NOW() - interval '8 days'),

-- Cybersecurity
('Ethical Hacking Fundamentals', 'ethical-hacking-fundamentals',
 'Learn ethical hacking and penetration testing. Understand security vulnerabilities and how to protect systems.',
 'intermediate', 600, true, true, 12,
 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
 'https://example.com/videos/ethical-hacking.mp4',
 'Kevin Martinez', 'Certified ethical hacker and security consultant',
 '["cybersecurity", "hacking", "security", "penetration testing"]'::jsonb,
 '["Networking fundamentals", "Linux basics", "Programming basics"]'::jsonb,
 '["Identify vulnerabilities", "Perform penetration tests", "Secure systems"]'::jsonb,
 NOW() - interval '5 days', NOW() - interval '5 days', NOW() - interval '3 days');

-- Note: Sections and topics should be added through the application's CMS or API
-- This seed file focuses on the main tutorial records
