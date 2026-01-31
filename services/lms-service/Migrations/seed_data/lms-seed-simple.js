// LMS Seed Data Script
// Run this script manually to populate test/development data
// Execute: docker exec config-mongodb-1 mongosh -u mongo_user -p mongo_pass_dev --authenticationDatabase admin lms_db /data/lms-seed-simple.js

// Check if data already exists
const existingCount = db.courses.countDocuments();
if (existingCount > 0) {
    print(`⏭️  Courses collection already has ${existingCount} documents, skipping seed`);
    quit();
}

print('🌱 Starting LMS seed data...');

// Insert courses
const courses = [
    {
        title: 'Complete JavaScript Masterclass',
        description: 'Master JavaScript from basics to advanced concepts including ES6+, async programming, and modern frameworks',
        instructorId: NumberLong(1),
        instructorName: 'John Smith',
        category: 3, // WebDevelopment
        level: 1, // Intermediate
        status: 2, // Published
        price: 89.99,
        currency: 'USD',
        thumbnailUrl: '/images/courses/javascript-masterclass.jpg',
        tags: ['javascript', 'es6', 'async', 'web-development', 'programming'],
        objectives: [
            'Understand JavaScript fundamentals and syntax',
            'Master ES6+ features and modern JavaScript',
            'Build interactive web applications',
            'Work with APIs and asynchronous programming'
        ],
        requirements: [
            'Basic HTML and CSS knowledge',
            'Computer with internet connection',
            'Text editor or IDE'
        ],
        totalEnrollments: 1250,
        averageRating: 4.7,
        reviewCount: 320,
        totalDurationMinutes: 1200,
        totalLessons: 85,
        slug: 'complete-javascript-masterclass',
        createdAt: new Date(Date.now() - 11 * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        publishedAt: new Date(Date.now() - 11 * 30 * 24 * 60 * 60 * 1000)
    },
    {
        title: 'React & Redux - Build Modern Web Apps',
        description: 'Learn to build scalable web applications using React, Redux, and modern development tools',
        instructorId: NumberLong(2),
        instructorName: 'Sarah Johnson',
        category: 3, // WebDevelopment
        level: 2, // Advanced
        status: 2, // Published
        price: 99.99,
        currency: 'USD',
        thumbnailUrl: '/images/courses/react-redux.jpg',
        tags: ['react', 'redux', 'javascript', 'web-development', 'frontend'],
        objectives: [
            'Build complex React applications',
            'Master Redux for state management',
            'Implement React Router for navigation',
            'Optimize React app performance'
        ],
        requirements: [
            'Good JavaScript knowledge',
            'Understanding of HTML/CSS',
            'Familiarity with npm and Node.js'
        ],
        totalEnrollments: 890,
        averageRating: 4.8,
        reviewCount: 245,
        totalDurationMinutes: 1500,
        totalLessons: 120,
        slug: 'react-redux-build-modern-web-apps',
        createdAt: new Date(Date.now() - 10 * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
        publishedAt: new Date(Date.now() - 10 * 30 * 24 * 60 * 60 * 1000)
    },
    {
        title: 'Full Stack Web Development Bootcamp',
        description: 'Comprehensive course covering front-end and back-end development with real-world projects',
        instructorId: NumberLong(1),
        instructorName: 'John Smith',
        category: 12, // Other
        level: 0, // Beginner
        status: 2, // Published
        price: 149.99,
        currency: 'USD',
        thumbnailUrl: '/images/courses/fullstack-bootcamp.jpg',
        tags: ['fullstack', 'web-development', 'react', 'nodejs', 'mongodb'],
        objectives: [
            'Build complete full-stack applications',
            'Master front-end with React',
            'Create REST APIs with Node.js',
            'Deploy applications to cloud platforms'
        ],
        requirements: [
            'Basic computer skills',
            'Willingness to learn',
            'No prior programming experience needed'
        ],
        totalEnrollments: 2100,
        averageRating: 4.9,
        reviewCount: 580,
        totalDurationMinutes: 3600,
        totalLessons: 250,
        slug: 'full-stack-web-development-bootcamp',
        createdAt: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        publishedAt: new Date(Date.now() - 12 * 30 * 24 * 60 * 60 * 1000)
    },
    {
        title: 'UI/UX Design Principles',
        description: 'Learn design thinking, user research, wireframing, and prototyping. Create beautiful and functional user experiences.',
        instructorId: NumberLong(3),
        instructorName: 'Michael Rodriguez',
        category: 1, // UxDesign
        level: 0, // Beginner
        status: 2, // Published
        price: 0, // Free course
        currency: 'USD',
        thumbnailUrl: '/images/courses/uiux-design.jpg',
        tags: ['design', 'ui', 'ux', 'figma', 'user-experience'],
        objectives: [
            'Understand design thinking principles',
            'Conduct user research and testing',
            'Create wireframes and prototypes',
            'Use Figma for UI design'
        ],
        requirements: [
            'No prior design experience needed',
            'Computer with internet',
            'Free Figma account'
        ],
        totalEnrollments: 3200,
        averageRating: 4.8,
        reviewCount: 890,
        totalDurationMinutes: 800,
        totalLessons: 60,
        slug: 'ui-ux-design-principles',
        createdAt: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        publishedAt: new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000)
    },
    {
        title: 'Data Science with Python',
        description: 'Master data analysis, visualization, and machine learning using Python libraries like NumPy, Pandas, and Scikit-learn.',
        instructorId: NumberLong(4),
        instructorName: 'Dr. Emily Chen',
        category: 12, // Other
        level: 1, // Intermediate
        status: 2, // Published
        price: 79.99,
        currency: 'USD',
        thumbnailUrl: '/images/courses/python-data-science.jpg',
        tags: ['python', 'data-science', 'machine-learning', 'pandas', 'numpy'],
        objectives: [
            'Master data manipulation with Pandas',
            'Create visualizations with Matplotlib and Seaborn',
            'Build machine learning models',
            'Perform statistical analysis'
        ],
        requirements: [
            'Basic Python programming',
            'High school mathematics',
            'Curiosity about data'
        ],
        totalEnrollments: 650,
        averageRating: 4.6,
        reviewCount: 180,
        totalDurationMinutes: 1800,
        totalLessons: 140,
        slug: 'data-science-with-python',
        createdAt: new Date(Date.now() - 8 * 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        publishedAt: new Date(Date.now() - 8 * 30 * 24 * 60 * 60 * 1000)
    }
];

const result = db.courses.insertMany(courses);
print(`✅ Inserted ${result.insertedIds.length} courses`);

// Verify
print(`\n📊 Collection stats:`);
print(`   Courses: ${db.courses.countDocuments()}`);
print(`   Enrollments: ${db.enrollments.countDocuments()}`);
print(`   Certificates: ${db.certificates.countDocuments()}`);
print(`   Quizzes: ${db.quizzes.countDocuments()}`);

print('\n✅ LMS seed data complete!');
