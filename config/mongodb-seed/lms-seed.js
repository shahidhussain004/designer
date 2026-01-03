// Comprehensive idempotent LMS seed script
// Drops target collections, inserts courses, enrollments, certificates, quizzes, quiz_attempts
// Creates essential indexes (slug unique, user_course unique) for test environment

print('Starting comprehensive LMS seed');
db = db.getSiblingDB('lms_db');

const collections = ['courses','enrollments','certificates','quizzes','quiz_attempts'];
for (const c of collections) {
  try { db[c].drop(); print(`Dropped ${c}`); } catch (e) { print(`Drop ${c} failed: ${e}`); }
}

function oid(){ return ObjectId(); }
function slugify(title){ return (title||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,''); }

// Courses (expanded dataset)
const courses = [
  {
    _id: oid(),
    title: 'Complete JavaScript Masterclass',
    shortDescription: 'Master JavaScript from basics to advanced concepts',
    description: 'Master JavaScript from basics to advanced concepts including ES6+, async programming, and modern frameworks',
    instructorId: 1,
    instructorName: 'John Smith',
    category: 3, // WebDevelopment
    level: 1, // Intermediate
    price: 89.99,
    currency: 'USD',
    thumbnailUrl: '/images/courses/javascript-masterclass.jpg',
    videoUrl: '/videos/courses/javascript-intro.mp4',
    syllabus: ['JavaScript Fundamentals','DOM Manipulation','ES6+ Features','Asynchronous Programming','Modern Frameworks'],
    learningOutcomes: ['Build dynamic web applications','Master modern JS','Understand async patterns','Work with APIs'],
    isPublished: true,
    enrollmentsCount: 1250,
    ratingAvg: 4.7,
    ratingCount: 320,
    createdAt: new Date('2025-01-15T00:00:00Z'),
    updatedAt: new Date('2025-12-20T00:00:00Z'),
    slug: slugify('Complete JavaScript Masterclass')
  },
  {
    _id: oid(),
    title: 'React & Redux - Build Modern Web Apps',
    shortDescription: 'Learn to build scalable web applications using React and Redux',
    description: 'Learn to build scalable web applications using React, Redux, and modern development tools',
    instructorId: 2,
    instructorName: 'Sarah Johnson',
    category: 3,
    level: 2,
    price: 99.99,
    currency: 'USD',
    thumbnailUrl: '/images/courses/react-redux.jpg',
    videoUrl: '/videos/courses/react-intro.mp4',
    syllabus: ['React Fundamentals','Component Architecture','Redux','Hooks','Optimization'],
    learningOutcomes: ['Build complex React apps','State management with Redux','Implement routing','Optimize performance'],
    isPublished: true,
    enrollmentsCount: 890,
    ratingAvg: 4.8,
    ratingCount: 245,
    createdAt: new Date('2025-02-10T00:00:00Z'),
    updatedAt: new Date('2025-12-18T00:00:00Z'),
    slug: slugify('React & Redux - Build Modern Web Apps')
  },
  {
    _id: oid(),
    title: 'Full Stack Web Development Bootcamp',
    shortDescription: 'Comprehensive course covering front-end and back-end',
    description: 'Comprehensive course covering front-end and back-end development with real-world projects',
    instructorId: 1,
    instructorName: 'John Smith',
    category: 12, // Other/FullStack mapped to Other
    level: 0,
    price: 149.99,
    currency: 'USD',
    thumbnailUrl: '/images/courses/fullstack-bootcamp.jpg',
    videoUrl: '/videos/courses/fullstack-intro.mp4',
    syllabus: ['HTML,CSS,JS','React','Node.js','DB Design','Deployment'],
    learningOutcomes: ['Build full apps','Deploy to cloud','Use modern tools'],
    isPublished: true,
    enrollmentsCount: 2100,
    ratingAvg: 4.9,
    ratingCount: 580,
    createdAt: new Date('2025-01-01T00:00:00Z'),
    updatedAt: new Date('2025-12-22T00:00:00Z'),
    slug: slugify('Full Stack Web Development Bootcamp')
  }
];

// Historic dataset (additional courses from legacy seeds)
const legacyCourses = [
  {
    _id: oid(),
    title: 'React Fundamentals',
    shortDescription: 'Learn React.js with hands-on projects',
    description: 'Master React.js from scratch. Learn components, hooks, state management, and build real-world applications.',
    instructorId: 2,
    instructorName: 'John Client',
    category: 3, // WebDevelopment
    level: 0, // Beginner
    status: 2,
    price: 49.99,
    currency: 'USD',
    thumbnailUrl: '/course-react.jpg',
    tags: ['react', 'javascript', 'frontend', 'web-development'],
    learningOutcomes: ['Understand JSX','Master React hooks','Build real applications','State management'],
    isPublished: true,
    totalEnrollments: 0,
    averageRating: 0.0,
    reviewCount: 0,
    totalDurationMinutes: 0,
    totalLessons: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    slug: slugify('React Fundamentals')
  },
  {
    _id: oid(),
    title: 'Data Science with Python',
    shortDescription: 'Master data science with Python',
    description: 'Learn data analysis, visualization, and machine learning using Python libraries like NumPy, Pandas, and Scikit-learn.',
    instructorId: 2,
    instructorName: 'John Client',
    category: 12, // Other (DataScience mapped to Other)
    level: 1, // Intermediate
    status: 2,
    price: 79.99,
    currency: 'USD',
    thumbnailUrl: '/course-python-ds.jpg',
    tags: ['python', 'data-science', 'analytics', 'machine-learning'],
    learningOutcomes: ['Data manipulation with Pandas','Data visualization','Statistical analysis','ML models'],
    isPublished: true,
    totalEnrollments: 0,
    averageRating: 0.0,
    reviewCount: 0,
    totalDurationMinutes: 0,
    totalLessons: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    slug: slugify('Data Science with Python')
  },
  {
    _id: oid(),
    title: 'UI/UX Design Principles',
    shortDescription: 'Master UI/UX design principles',
    description: 'Learn design thinking, user research, wireframing, and prototyping. Create beautiful and functional user experiences.',
    instructorId: 2,
    instructorName: 'John Client',
    category: 1, // UxDesign
    level: 0,
    status: 2,
    price: 0,
    currency: 'USD',
    thumbnailUrl: '/course-uiux.jpg',
    tags: ['design', 'ui', 'ux', 'user-experience'],
    learningOutcomes: ['Design thinking','User research','Wireframing','Prototyping'],
    isPublished: true,
    totalEnrollments: 0,
    averageRating: 0.0,
    reviewCount: 0,
    totalDurationMinutes: 0,
    totalLessons: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    slug: slugify('UI/UX Design Principles')
  },
  {
    _id: oid(),
    title: 'AWS Cloud Essentials',
    shortDescription: 'Learn AWS cloud computing',
    description: 'Master AWS cloud services including EC2, S3, Lambda, and more. Build scalable cloud applications.',
    instructorId: 2,
    instructorName: 'John Client',
    category: 12, // Other (CloudComputing mapped to Other)
    level: 1,
    status: 2,
    price: 59.99,
    currency: 'USD',
    thumbnailUrl: '/course-aws.jpg',
    tags: ['aws', 'cloud', 'devops', 'infrastructure'],
    learningOutcomes: ['Understand AWS services','Deploy applications','Manage cloud infrastructure'],
    isPublished: true,
    totalEnrollments: 0,
    averageRating: 0.0,
    reviewCount: 0,
    totalDurationMinutes: 0,
    totalLessons: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    slug: slugify('AWS Cloud Essentials')
  },
  {
    _id: oid(),
    title: 'Machine Learning Fundamentals',
    shortDescription: 'Start your ML journey',
    description: 'Introduction to machine learning algorithms, neural networks, and deep learning. Hands-on projects with TensorFlow.',
    instructorId: 2,
    instructorName: 'John Client',
    category: 12, // Other (MachineLearning mapped to Other)
    level: 2, // Advanced
    status: 2,
    price: 99.99,
    currency: 'USD',
    thumbnailUrl: '/course-ml.jpg',
    tags: ['machine-learning', 'ai', 'tensorflow', 'neural-networks'],
    learningOutcomes: ['Understand ML algorithms','Build neural networks','Deploy ML models'],
    isPublished: true,
    totalEnrollments: 0,
    averageRating: 4.5,
    reviewCount: 10,
    totalDurationMinutes: 0,
    totalLessons: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    slug: slugify('Machine Learning Fundamentals')
  },
  {
    _id: oid(),
    title: 'Graphic Design Masterclass',
    shortDescription: 'Complete graphic design course',
    description: 'Master Adobe Creative Suite including Photoshop, Illustrator, and InDesign. Create stunning visual designs.',
    instructorId: 2,
    instructorName: 'John Client',
    category: 2, // GraphicDesign
    level: 1,
    status: 2,
    price: 59.99,
    currency: 'USD',
    thumbnailUrl: '/course-graphic-design.jpg',
    tags: ['graphic-design', 'adobe', 'photoshop', 'illustrator'],
    learningOutcomes: ['Master Photoshop','Learn Illustrator','Create professional designs'],
    isPublished: true,
    totalEnrollments: 5,
    averageRating: 4.8,
    reviewCount: 3,
    totalDurationMinutes: 0,
    totalLessons: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    slug: slugify('Graphic Design Masterclass')
  },
  {
    _id: oid(),
    title: 'Mobile App Development with React Native',
    shortDescription: 'Build mobile apps with React Native',
    description: 'Build cross-platform mobile applications for iOS and Android using React Native and JavaScript.',
    instructorId: 2,
    instructorName: 'John Client',
    category: 4, // MobileDevelopment
    level: 2,
    status: 2,
    price: 99.99,
    currency: 'USD',
    thumbnailUrl: '/course-react-native.jpg',
    tags: ['react-native', 'mobile', 'ios', 'android'],
    learningOutcomes: ['Build iOS apps','Build Android apps','Master React Native'],
    isPublished: true,
    totalEnrollments: 12,
    averageRating: 4.5,
    reviewCount: 8,
    totalDurationMinutes: 0,
    totalLessons: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    slug: slugify('Mobile App Development with React Native')
  }
];

// Merge datasets, avoiding duplicate titles
const allTitles = new Set(courses.map(c=>c.title));
for (const lc of legacyCourses) {
  if (!allTitles.has(lc.title)) { courses.push(lc); allTitles.add(lc.title); }
}

const cr = db.courses.insertMany(courses);
const ids = Object.values(cr.insertedIds);
print('Inserted courses:', ids.length);

// Enrollments
const enrollments = [
  { _id: oid(), userId: 1, courseId: ids[0], enrolledAt: new Date('2025-03-15T10:00:00Z'), progressPercentage: 75, completedLessons: ['l1','l2'], lastAccessed: new Date('2026-01-02T14:30:00Z'), completionDate: null, certificateId: null, isCompleted: false },
  { _id: oid(), userId: 2, courseId: ids[1], enrolledAt: new Date('2025-04-10T11:00:00Z'), progressPercentage: 60, completedLessons: ['l1'], lastAccessed: new Date('2025-12-28T10:15:00Z'), completionDate: null, certificateId: null, isCompleted: false }
];
db.enrollments.insertMany(enrollments);
print('Inserted enrollments');

// Certificates
const certs = [ { _id: enrollments[0].certificateId || oid(), userId: 2, courseId: ids[1], courseTitle: 'React & Redux - Build Modern Web Apps', issuedDate: new Date('2025-10-15T14:00:00Z'), certificateUrl: '/certs/cert1.pdf', verificationCode: 'CERT-001', instructorName: 'Sarah Johnson', completionDate: new Date('2025-10-15T14:00:00Z') } ];
db.certificates.insertMany(certs);
print('Inserted certificates');

// Quizzes
const quizzes = [ { _id: oid(), courseId: ids[0], title: 'JavaScript Fundamentals Quiz', description: 'Test JS basics', questions: [ { questionText: 'What is closure?', options: ['A','B','C','D'], correctAnswer: 0, points: 10 } ], passingScore: 70, timeLimitMinutes: 30, attemptsAllowed: 3, isPublished: true, createdAt: new Date(), updatedAt: new Date() } ];
db.quizzes.insertMany(quizzes);
print('Inserted quizzes');

// Quiz attempts
const qa = [ { _id: oid(), userId: 1, quizId: quizzes[0]._id, courseId: ids[0], answers: [ { q:0, answer:1 } ], score: 90, passed: true, attemptedAt: new Date() } ];
db.quiz_attempts.insertMany(qa);
print('Inserted quiz attempts');

// Create indexes
print('Creating indexes');
// Helper: ensure an index exists with desired spec. If a conflicting index with same name/key exists, drop it first.
function ensureIndex(collection, keySpec, options) {
  try {
    const existing = collection.getIndexes();
    // find any index with same key pattern
    const match = existing.find(ix => {
      const k = ix.key || {};
      // compare keys by JSON stringification (simple but effective for single-field indexes)
      return JSON.stringify(k) === JSON.stringify(keySpec);
    });
    if (match) {
      // If existing index options differ from requested options, drop and recreate
      const requestedName = options && options.name ? options.name : Object.keys(keySpec).map(k=>k+"_1").join('_');
      const existingName = match.name;
      const optsDiffer = (match.sparse !== !!options.sparse) || (match.unique !== !!options.unique) || (existingName !== requestedName && options && options.name);
      if (optsDiffer) {
        print(`Dropping conflicting index ${existingName} on ${collection.getName()} (options differ)`);
        try { collection.dropIndex(existingName); } catch (e) { print('Failed to drop index', existingName, e); }
      } else {
        print(`Index already exists on ${collection.getName()} with matching options: ${existingName}`);
        return;
      }
    }
    // Create index (safe to call after dropping conflict)
    collection.createIndex(keySpec, options || {});
    print(`Created index on ${collection.getName()}: ${JSON.stringify(keySpec)}`);
  } catch (e) {
    print('Index creation/check failed for', collection.getName(), e);
  }
}

ensureIndex(db.courses, { slug: 1 }, { unique: true });
ensureIndex(db.enrollments, { userId: 1, courseId: 1 }, { unique: true, name: 'user_course_idx' });

print('Comprehensive seed complete');
