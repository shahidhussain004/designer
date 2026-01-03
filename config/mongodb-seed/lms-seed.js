// MongoDB LMS Database Seed Data
// This script seeds the lms_db with sample data for certificates, courses, enrollments, and quizzes

// Switch to lms_db database
db = db.getSiblingDB('lms_db');

// Clear existing data
print('Clearing existing data...');
db.certificates.deleteMany({});
db.courses.deleteMany({});
db.enrollments.deleteMany({});
db.quizzes.deleteMany({});
db.quiz_attempts.deleteMany({});

// Insert Courses
print('Inserting courses...');
const courses = [
  {
    _id: ObjectId(),
    title: 'Complete JavaScript Masterclass',
    description: 'Master JavaScript from basics to advanced concepts including ES6+, async programming, and modern frameworks',
    instructor_id: 1,
    instructor_name: 'John Smith',
    category: 'Programming',
    level: 'Intermediate',
    duration_hours: 40,
    price: 89.99,
    thumbnail_url: '/images/courses/javascript-masterclass.jpg',
    video_url: '/videos/courses/javascript-intro.mp4',
    syllabus: [
      'JavaScript Fundamentals',
      'DOM Manipulation',
      'ES6+ Features',
      'Asynchronous Programming',
      'Modern JavaScript Frameworks'
    ],
    learning_outcomes: [
      'Build dynamic web applications',
      'Master modern JavaScript features',
      'Understand async programming patterns',
      'Work with APIs and fetch data'
    ],
    is_published: true,
    enrollment_count: 1250,
    rating_avg: 4.7,
    rating_count: 320,
    created_at: new Date('2025-01-15T00:00:00Z'),
    updated_at: new Date('2025-12-20T00:00:00Z')
  },
  {
    _id: ObjectId(),
    title: 'React & Redux - Build Modern Web Apps',
    description: 'Learn to build scalable web applications using React, Redux, and modern development tools',
    instructor_id: 2,
    instructor_name: 'Sarah Johnson',
    category: 'Web Development',
    level: 'Advanced',
    duration_hours: 35,
    price: 99.99,
    thumbnail_url: '/images/courses/react-redux.jpg',
    video_url: '/videos/courses/react-intro.mp4',
    syllabus: [
      'React Fundamentals',
      'Component Architecture',
      'State Management with Redux',
      'React Hooks',
      'Performance Optimization'
    ],
    learning_outcomes: [
      'Build complex React applications',
      'Manage application state with Redux',
      'Implement routing and navigation',
      'Optimize React performance'
    ],
    is_published: true,
    enrollment_count: 890,
    rating_avg: 4.8,
    rating_count: 245,
    created_at: new Date('2025-02-10T00:00:00Z'),
    updated_at: new Date('2025-12-18T00:00:00Z')
  },
  {
    _id: ObjectId(),
    title: 'Node.js Backend Development',
    description: 'Build scalable backend applications with Node.js, Express, and MongoDB',
    instructor_id: 3,
    instructor_name: 'Michael Chen',
    category: 'Backend Development',
    level: 'Intermediate',
    duration_hours: 45,
    price: 94.99,
    thumbnail_url: '/images/courses/nodejs-backend.jpg',
    video_url: '/videos/courses/nodejs-intro.mp4',
    syllabus: [
      'Node.js Fundamentals',
      'Express Framework',
      'RESTful API Design',
      'Database Integration',
      'Authentication & Security'
    ],
    learning_outcomes: [
      'Build RESTful APIs',
      'Implement authentication systems',
      'Work with databases',
      'Deploy Node.js applications'
    ],
    is_published: true,
    enrollment_count: 670,
    rating_avg: 4.6,
    rating_count: 180,
    created_at: new Date('2025-03-05T00:00:00Z'),
    updated_at: new Date('2025-12-15T00:00:00Z')
  },
  {
    _id: ObjectId(),
    title: 'Full Stack Web Development Bootcamp',
    description: 'Comprehensive course covering front-end and back-end development with real-world projects',
    instructor_id: 1,
    instructor_name: 'John Smith',
    category: 'Full Stack',
    level: 'Beginner',
    duration_hours: 80,
    price: 149.99,
    thumbnail_url: '/images/courses/fullstack-bootcamp.jpg',
    video_url: '/videos/courses/fullstack-intro.mp4',
    syllabus: [
      'HTML, CSS & JavaScript',
      'React & Vue.js',
      'Node.js & Express',
      'Database Design',
      'Deployment & DevOps'
    ],
    learning_outcomes: [
      'Build complete web applications',
      'Master both frontend and backend',
      'Deploy applications to cloud',
      'Work with modern development tools'
    ],
    is_published: true,
    enrollment_count: 2100,
    rating_avg: 4.9,
    rating_count: 580,
    created_at: new Date('2025-01-01T00:00:00Z'),
    updated_at: new Date('2025-12-22T00:00:00Z')
  },
  {
    _id: ObjectId(),
    title: 'Python for Data Science',
    description: 'Learn Python programming focused on data analysis, visualization, and machine learning',
    instructor_id: 4,
    instructor_name: 'Emily Rodriguez',
    category: 'Data Science',
    level: 'Intermediate',
    duration_hours: 50,
    price: 119.99,
    thumbnail_url: '/images/courses/python-data-science.jpg',
    video_url: '/videos/courses/python-intro.mp4',
    syllabus: [
      'Python Basics',
      'NumPy & Pandas',
      'Data Visualization',
      'Machine Learning Fundamentals',
      'Real-world Projects'
    ],
    learning_outcomes: [
      'Analyze data with Python',
      'Create visualizations',
      'Build ML models',
      'Work with real datasets'
    ],
    is_published: true,
    enrollment_count: 1450,
    rating_avg: 4.7,
    rating_count: 390,
    created_at: new Date('2025-02-20T00:00:00Z'),
    updated_at: new Date('2025-12-19T00:00:00Z')
  }
];

const courseResult = db.courses.insertMany(courses);
const courseIds = Object.values(courseResult.insertedIds);
print(`Inserted ${courseIds.length} courses`);

// Insert Enrollments
print('Inserting enrollments...');
const enrollments = [
  {
    _id: ObjectId(),
    user_id: 1,
    course_id: courseIds[0],
    enrolled_at: new Date('2025-03-15T10:00:00Z'),
    progress_percentage: 75,
    completed_lessons: ['lesson1', 'lesson2', 'lesson3', 'lesson4', 'lesson5'],
    last_accessed: new Date('2026-01-02T14:30:00Z'),
    completion_date: null,
    certificate_id: null,
    is_completed: false
  },
  {
    _id: ObjectId(),
    user_id: 1,
    course_id: courseIds[3],
    enrolled_at: new Date('2025-01-20T09:00:00Z'),
    progress_percentage: 100,
    completed_lessons: ['lesson1', 'lesson2', 'lesson3', 'lesson4', 'lesson5', 'lesson6', 'lesson7', 'lesson8'],
    last_accessed: new Date('2025-11-30T16:45:00Z'),
    completion_date: new Date('2025-11-30T16:45:00Z'),
    certificate_id: ObjectId(),
    is_completed: true
  },
  {
    _id: ObjectId(),
    user_id: 2,
    course_id: courseIds[1],
    enrolled_at: new Date('2025-04-10T11:00:00Z'),
    progress_percentage: 60,
    completed_lessons: ['lesson1', 'lesson2', 'lesson3'],
    last_accessed: new Date('2025-12-28T10:15:00Z'),
    completion_date: null,
    certificate_id: null,
    is_completed: false
  },
  {
    _id: ObjectId(),
    user_id: 3,
    course_id: courseIds[2],
    enrolled_at: new Date('2025-05-05T13:00:00Z'),
    progress_percentage: 90,
    completed_lessons: ['lesson1', 'lesson2', 'lesson3', 'lesson4', 'lesson5', 'lesson6'],
    last_accessed: new Date('2026-01-01T09:20:00Z'),
    completion_date: null,
    certificate_id: null,
    is_completed: false
  },
  {
    _id: ObjectId(),
    user_id: 2,
    course_id: courseIds[4],
    enrolled_at: new Date('2025-03-01T08:00:00Z'),
    progress_percentage: 100,
    completed_lessons: ['lesson1', 'lesson2', 'lesson3', 'lesson4', 'lesson5', 'lesson6', 'lesson7'],
    last_accessed: new Date('2025-10-15T14:00:00Z'),
    completion_date: new Date('2025-10-15T14:00:00Z'),
    certificate_id: ObjectId(),
    is_completed: true
  },
  {
    _id: ObjectId(),
    user_id: 4,
    course_id: courseIds[0],
    enrolled_at: new Date('2025-06-12T10:30:00Z'),
    progress_percentage: 45,
    completed_lessons: ['lesson1', 'lesson2'],
    last_accessed: new Date('2025-12-20T11:00:00Z'),
    completion_date: null,
    certificate_id: null,
    is_completed: false
  }
];

const enrollmentResult = db.enrollments.insertMany(enrollments);
print(`Inserted ${Object.keys(enrollmentResult.insertedIds).length} enrollments`);

// Insert Certificates (for completed courses)
print('Inserting certificates...');
const certificates = [
  {
    _id: enrollments[1].certificate_id,
    user_id: 1,
    course_id: courseIds[3],
    course_title: 'Full Stack Web Development Bootcamp',
    issued_date: new Date('2025-11-30T16:45:00Z'),
    certificate_url: '/certificates/cert-user1-fullstack.pdf',
    verification_code: 'CERT-FS-2025-001234',
    instructor_name: 'John Smith',
    completion_date: new Date('2025-11-30T16:45:00Z')
  },
  {
    _id: enrollments[4].certificate_id,
    user_id: 2,
    course_id: courseIds[4],
    course_title: 'Python for Data Science',
    issued_date: new Date('2025-10-15T14:00:00Z'),
    certificate_url: '/certificates/cert-user2-python.pdf',
    verification_code: 'CERT-PY-2025-005678',
    instructor_name: 'Emily Rodriguez',
    completion_date: new Date('2025-10-15T14:00:00Z')
  }
];

const certResult = db.certificates.insertMany(certificates);
print(`Inserted ${Object.keys(certResult.insertedIds).length} certificates`);

// Insert Quizzes
print('Inserting quizzes...');
const quizzes = [
  {
    _id: ObjectId(),
    course_id: courseIds[0],
    title: 'JavaScript Fundamentals Quiz',
    description: 'Test your knowledge of JavaScript basics and core concepts',
    questions: [
      {
        question_text: 'What is a closure in JavaScript?',
        options: [
          'A function that has access to variables from an outer function',
          'A way to close a JavaScript file',
          'A method to stop code execution',
          'A type of loop'
        ],
        correct_answer: 0,
        points: 10
      },
      {
        question_text: 'Which method is used to add an element to the end of an array?',
        options: ['unshift()', 'push()', 'pop()', 'shift()'],
        correct_answer: 1,
        points: 5
      },
      {
        question_text: 'What does "===" operator do?',
        options: [
          'Assigns a value',
          'Compares value only',
          'Compares both value and type',
          'Creates a variable'
        ],
        correct_answer: 2,
        points: 5
      },
      {
        question_text: 'What is the output of: typeof null?',
        options: ['"null"', '"undefined"', '"object"', '"number"'],
        correct_answer: 2,
        points: 10
      }
    ],
    passing_score: 70,
    time_limit_minutes: 30,
    attempts_allowed: 3,
    is_published: true,
    created_at: new Date('2025-01-16T00:00:00Z'),
    updated_at: new Date('2025-01-16T00:00:00Z')
  },
  {
    _id: ObjectId(),
    course_id: courseIds[1],
    title: 'React Components & Hooks Quiz',
    description: 'Assess your understanding of React components and hooks',
    questions: [
      {
        question_text: 'What hook is used for side effects in functional components?',
        options: ['useState', 'useEffect', 'useContext', 'useReducer'],
        correct_answer: 1,
        points: 10
      },
      {
        question_text: 'How do you pass data from parent to child component?',
        options: ['Through state', 'Through props', 'Through context', 'Through refs'],
        correct_answer: 1,
        points: 5
      },
      {
        question_text: 'What is the virtual DOM?',
        options: [
          'A copy of the real DOM in memory',
          'A browser API',
          'A React component',
          'A state management tool'
        ],
        correct_answer: 0,
        points: 10
      }
    ],
    passing_score: 75,
    time_limit_minutes: 25,
    attempts_allowed: 2,
    is_published: true,
    created_at: new Date('2025-02-11T00:00:00Z'),
    updated_at: new Date('2025-02-11T00:00:00Z')
  },
  {
    _id: ObjectId(),
    course_id: courseIds[2],
    title: 'Node.js & Express Quiz',
    description: 'Test your knowledge of Node.js backend development',
    questions: [
      {
        question_text: 'What is middleware in Express?',
        options: [
          'Functions that execute during request-response cycle',
          'A database layer',
          'A frontend framework',
          'A testing tool'
        ],
        correct_answer: 0,
        points: 10
      },
      {
        question_text: 'Which module is used for file system operations in Node.js?',
        options: ['http', 'fs', 'path', 'os'],
        correct_answer: 1,
        points: 5
      },
      {
        question_text: 'What does app.use() do in Express?',
        options: [
          'Creates a route',
          'Mounts middleware',
          'Starts the server',
          'Connects to database'
        ],
        correct_answer: 1,
        points: 10
      },
      {
        question_text: 'What is the purpose of package.json?',
        options: [
          'To store application code',
          'To manage project dependencies',
          'To configure the database',
          'To define routes'
        ],
        correct_answer: 1,
        points: 5
      }
    ],
    passing_score: 70,
    time_limit_minutes: 35,
    attempts_allowed: 3,
    is_published: true,
    created_at: new Date('2025-03-06T00:00:00Z'),
    updated_at: new Date('2025-03-06T00:00:00Z')
  }
];

const quizResult = db.quizzes.insertMany(quizzes);
const quizIds = Object.values(quizResult.insertedIds);
print(`Inserted ${quizIds.length} quizzes`);

// Insert Quiz Attempts
print('Inserting quiz attempts...');
const quizAttempts = [
  {
    _id: ObjectId(),
    quiz_id: quizIds[0],
    user_id: 1,
    course_id: courseIds[0],
    answers: [0, 1, 2, 2],
    score: 30,
    total_points: 30,
    percentage: 100,
    passed: true,
    time_taken_minutes: 18,
    started_at: new Date('2025-05-20T14:00:00Z'),
    completed_at: new Date('2025-05-20T14:18:00Z')
  },
  {
    _id: ObjectId(),
    quiz_id: quizIds[1],
    user_id: 2,
    course_id: courseIds[1],
    answers: [1, 1, 0],
    score: 25,
    total_points: 25,
    percentage: 100,
    passed: true,
    time_taken_minutes: 15,
    started_at: new Date('2025-07-10T10:00:00Z'),
    completed_at: new Date('2025-07-10T10:15:00Z')
  },
  {
    _id: ObjectId(),
    quiz_id: quizIds[2],
    user_id: 3,
    course_id: courseIds[2],
    answers: [0, 1, 1, 1],
    score: 30,
    total_points: 30,
    percentage: 100,
    passed: true,
    time_taken_minutes: 22,
    started_at: new Date('2025-08-15T16:00:00Z'),
    completed_at: new Date('2025-08-15T16:22:00Z')
  },
  {
    _id: ObjectId(),
    quiz_id: quizIds[0],
    user_id: 4,
    course_id: courseIds[0],
    answers: [0, 2, 2, 1],
    score: 20,
    total_points: 30,
    percentage: 67,
    passed: false,
    time_taken_minutes: 25,
    started_at: new Date('2025-09-01T11:00:00Z'),
    completed_at: new Date('2025-09-01T11:25:00Z')
  }
];

const attemptResult = db.quiz_attempts.insertMany(quizAttempts);
print(`Inserted ${Object.keys(attemptResult.insertedIds).length} quiz attempts`);

// Summary
print('\n=== LMS Database Seeding Complete ===');
print(`Courses: ${db.courses.countDocuments()}`);
print(`Enrollments: ${db.enrollments.countDocuments()}`);
print(`Certificates: ${db.certificates.countDocuments()}`);
print(`Quizzes: ${db.quizzes.countDocuments()}`);
print(`Quiz Attempts: ${db.quiz_attempts.countDocuments()}`);
print('=====================================\n');
