// Unified idempotent MongoDB LMS seed script
// Clears collections and inserts courses, enrollments, certificates, quizzes, quiz_attempts

// Use lms_db
db = db.getSiblingDB('lms_db');

print('Dropping target collections (safe for test DB)...');
const toDrop = ['courses','enrollments','certificates','quizzes','quiz_attempts'];
for (const c of toDrop) {
  try { db[c].drop(); print(`Dropped ${c}`); } catch(e) { print(`Drop ${c} failed: ${e}`); }
}

// Helper to create ObjectId with deterministic prefix for idempotence (not strictly required)
function oid(){ return ObjectId(); }

// Insert courses
print('Inserting courses...');
const courses = [
  {
    _id: oid(),
    title: 'React Fundamentals',
    description: 'Master React.js from scratch. Learn components, hooks, state management, and build real-world applications.',
    shortDescription: 'Learn React.js with hands-on projects',
    category: 'WebDevelopment',
    level: 'Beginner',
    price: 49.99,
    currency: 'USD',
    isPublished: true,
    instructorId: 2,
    instructorName: 'John Client',
    thumbnailUrl: '/course-react.jpg',
    tags: ['react','javascript','frontend','web-development'],
    objectives: ['Understand JSX','Master React hooks','Build real applications','State management'],
    requirements: ['Basic JavaScript knowledge','HTML/CSS basics'],
    modules: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    enrollmentsCount: 0,
    ratingAvg: 0,
    ratingCount: 0
  },
  {
    _id: oid(),
    title: 'Data Science with Python',
    description: 'Learn data analysis, visualization, and machine learning using Python libraries like NumPy, Pandas, and Scikit-learn.',
    shortDescription: 'Master data science with Python',
    category: 'DataScience',
    level: 'Intermediate',
    price: 79.99,
    currency: 'USD',
    isPublished: true,
    instructorId: 2,
    instructorName: 'John Client',
    thumbnailUrl: '/course-python-ds.jpg',
    tags: ['python','data-science','analytics','machine-learning'],
    objectives: ['Data manipulation with Pandas','Data visualization','Statistical analysis','ML models'],
    requirements: ['Python basics','Mathematics fundamentals'],
    modules: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    enrollmentsCount: 0,
    ratingAvg: 0,
    ratingCount: 0
  },
  {
    _id: oid(),
    title: 'UI/UX Design Principles',
    description: 'Learn design thinking, user research, wireframing, and prototyping. Create beautiful and functional user experiences.',
    shortDescription: 'Master UI/UX design principles',
    category: 'Design',
    level: 'Beginner',
    price: 0,
    currency: 'USD',
    isPublished: true,
    instructorId: 2,
    instructorName: 'John Client',
    thumbnailUrl: '/course-uiux.jpg',
    tags: ['design','ui','ux','user-experience'],
    objectives: ['Design thinking','User research','Wireframing','Prototyping'],
    requirements: ['No prerequisites'],
    modules: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    enrollmentsCount: 0,
    ratingAvg: 0,
    ratingCount: 0
  }
];

const courseResult = db.courses.insertMany(courses);
const courseIds = Object.values(courseResult.insertedIds);
print(`Inserted ${courseIds.length} courses`);

// Insert enrollments (use userId, courseId camelCase fields)
print('Inserting enrollments...');
const enrollments = [
  {
    _id: oid(),
    userId: 1,
    courseId: courseIds[0],
    enrolledAt: new Date('2025-03-15T10:00:00Z'),
    progressPercentage: 75,
    completedLessons: ['lesson1','lesson2','lesson3'],
    lastAccessed: new Date('2026-01-02T14:30:00Z'),
    completionDate: null,
    certificateId: null,
    isCompleted: false
  },
  {
    _id: oid(),
    userId: 1,
    courseId: courseIds[1],
    enrolledAt: new Date('2025-01-20T09:00:00Z'),
    progressPercentage: 100,
    completedLessons: ['lesson1','lesson2','lesson3','lesson4','lesson5'],
    lastAccessed: new Date('2025-11-30T16:45:00Z'),
    completionDate: new Date('2025-11-30T16:45:00Z'),
    certificateId: oid(),
    isCompleted: true
  }
];

const enrollmentResult = db.enrollments.insertMany(enrollments);
print(`Inserted ${Object.keys(enrollmentResult.insertedIds).length} enrollments`);

// Insert certificates
print('Inserting certificates...');
const certificates = [
  {
    _id: enrollments[1].certificateId,
    userId: 1,
    courseId: courseIds[1],
    courseTitle: 'Data Science with Python',
    issuedDate: new Date('2025-11-30T16:45:00Z'),
    certificateUrl: '/certificates/cert-user1-ds.pdf',
    verificationCode: 'CERT-DS-2025-0001',
    instructorName: 'John Client',
    completionDate: new Date('2025-11-30T16:45:00Z')
  }
];

const certResult = db.certificates.insertMany(certificates);
print(`Inserted ${Object.keys(certResult.insertedIds).length} certificates`);

// Insert quizzes
print('Inserting quizzes...');
const quizzes = [
  {
    _id: oid(),
    courseId: courseIds[0],
    title: 'React Basics Quiz',
    description: 'Short quiz for React basics',
    questions: [
      { questionText: 'What is JSX?', options: ['A templating language','A way to write HTML in JS','A CSS preprocessor','A build tool'], correctAnswer: 1, points: 10 },
      { questionText: 'Hook for side effects?', options: ['useState','useEffect','useContext','useRef'], correctAnswer: 1, points: 10 }
    ],
    passingScore: 70,
    timeLimitMinutes: 15,
    attemptsAllowed: 3,
    isPublished: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const quizResult = db.quizzes.insertMany(quizzes);
print(`Inserted ${Object.keys(quizResult.insertedIds).length} quizzes`);

// Insert quiz attempts
print('Inserting quiz attempts...');
const attempts = [
  {
    _id: oid(),
    userId: 1,
    quizId: quizResult.insertedIds[0],
    courseId: courseIds[0],
    answers: [ { q: 0, answer: 1 }, { q: 1, answer: 1 } ],
    score: 90,
    passed: true,
    attemptedAt: new Date()
  }
];

const attemptResult = db.quiz_attempts.insertMany(attempts);
print(`Inserted ${Object.keys(attemptResult.insertedIds).length} quiz attempts`);

print('Unified seed completed');
