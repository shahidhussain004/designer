db = db.getSiblingDB('lms_db');

// Delete existing courses
db.courses.deleteMany({});

// Insert properly formatted courses
db.courses.insertMany([
  {
    title: 'React Fundamentals',
    description: 'Master React.js from scratch. Learn components, hooks, state management, and build real-world applications.',
    shortDescription: 'Learn React.js with hands-on projects',
    category: 3, // WebDevelopment
    level: 0, // Beginner
    status: 2, // Published
    price: NumberDecimal("49.99"),
    currency: 'USD',
    instructorId: NumberLong(2),
    instructorName: 'John Client',
    thumbnailUrl: '/course-react.jpg',
    previewVideoUrl: '',
    tags: ['react', 'javascript', 'frontend', 'web-development'],
    objectives: ['Understand JSX', 'Master React hooks', 'Build real applications', 'State management'],
    requirements: ['Basic JavaScript knowledge', 'HTML/CSS basics'],
    modules: [],
    totalEnrollments: 0,
    averageRating: 0.0,
    reviewCount: 0,
    totalDurationMinutes: 0,
    totalLessons: 0,
    slug: 'react-fundamentals',
    metaDescription: 'Learn React.js fundamentals',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Data Science with Python',
    description: 'Learn data analysis, visualization, and machine learning using Python libraries like NumPy, Pandas, and Scikit-learn.',
    shortDescription: 'Master data science with Python',
    category: 3, // WebDevelopment (we'll use this for now)
    level: 1, // Intermediate
    status: 2, // Published
    price: NumberDecimal("79.99"),
    currency: 'USD',
    instructorId: NumberLong(2),
    instructorName: 'John Client',
    thumbnailUrl: '/course-python-ds.jpg',
    previewVideoUrl: '',
    tags: ['python', 'data-science', 'analytics', 'machine-learning'],
    objectives: ['Data manipulation with Pandas', 'Data visualization', 'Statistical analysis', 'ML models'],
    requirements: ['Python basics', 'Mathematics fundamentals'],
    modules: [],
    totalEnrollments: 0,
    averageRating: 0.0,
    reviewCount: 0,
    totalDurationMinutes: 0,
    totalLessons: 0,
    slug: 'data-science-python',
    metaDescription: 'Master data science with Python',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'UI/UX Design Principles',
    description: 'Learn design thinking, user research, wireframing, and prototyping. Create beautiful and functional user experiences.',
    shortDescription: 'Master UI/UX design principles',
    category: 1, // UxDesign
    level: 0, // Beginner
    status: 2, // Published
    price: NumberDecimal("0"),
    currency: 'USD',
    instructorId: NumberLong(2),
    instructorName: 'John Client',
    thumbnailUrl: '/course-uiux.jpg',
    previewVideoUrl: '',
    tags: ['design', 'ui', 'ux', 'user-experience'],
    objectives: ['Design thinking', 'User research', 'Wireframing', 'Prototyping'],
    requirements: ['No prerequisites'],
    modules: [],
    totalEnrollments: 0,
    averageRating: 0.0,
    reviewCount: 0,
    totalDurationMinutes: 0,
    totalLessons: 0,
    slug: 'ui-ux-design-principles',
    metaDescription: 'Learn UI/UX design principles',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Graphic Design Masterclass',
    description: 'Master Adobe Creative Suite including Photoshop, Illustrator, and InDesign. Create stunning visual designs.',
    shortDescription: 'Complete graphic design course',
    category: 2, // GraphicDesign
    level: 1, // Intermediate
    status: 2, // Published
    price: NumberDecimal("59.99"),
    currency: 'USD',
    instructorId: NumberLong(2),
    instructorName: 'John Client',
    thumbnailUrl: '/course-graphic-design.jpg',
    previewVideoUrl: '',
    tags: ['graphic-design', 'adobe', 'photoshop', 'illustrator'],
    objectives: ['Master Photoshop', 'Learn Illustrator', 'Create professional designs'],
    requirements: ['Basic computer skills'],
    modules: [],
    totalEnrollments: 5,
    averageRating: 4.8,
    reviewCount: 3,
    totalDurationMinutes: 0,
    totalLessons: 0,
    slug: 'graphic-design-masterclass',
    metaDescription: 'Master graphic design',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: 'Mobile App Development with React Native',
    description: 'Build cross-platform mobile applications for iOS and Android using React Native and JavaScript.',
    shortDescription: 'Build mobile apps with React Native',
    category: 4, // MobileDevelopment
    level: 2, // Advanced
    status: 2, // Published
    price: NumberDecimal("99.99"),
    currency: 'USD',
    instructorId: NumberLong(2),
    instructorName: 'John Client',
    thumbnailUrl: '/course-react-native.jpg',
    previewVideoUrl: '',
    tags: ['react-native', 'mobile', 'ios', 'android'],
    objectives: ['Build iOS apps', 'Build Android apps', 'Master React Native'],
    requirements: ['JavaScript proficiency', 'React basics'],
    modules: [],
    totalEnrollments: 12,
    averageRating: 4.5,
    reviewCount: 8,
    totalDurationMinutes: 0,
    totalLessons: 0,
    slug: 'mobile-app-development-react-native',
    metaDescription: 'Build mobile apps with React Native',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]);

print('5 courses inserted successfully with correct enum values');
