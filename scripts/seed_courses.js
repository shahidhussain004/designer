/**
 * MongoDB Courses Seed Script
 * Inserts 5 sample courses into the lms_db.courses collection
 * 
 * Usage:
 *   mongosh --file seed_courses.js
 * 
 * Or with connection string:
 *   mongosh "mongodb://mongo_user:mongo_pass_dev@localhost:27017/lms_db?authSource=admin" --file seed_courses.js
 */

const db = db.getSiblingDB('lms_db');

// Clear existing courses
db.courses.deleteMany({});

const courses = [
  {
    _id: ObjectId(),
    title: "React Fundamentals",
    description: "Master React.js from scratch. Learn components, hooks, state management, and build real-world applications. This comprehensive course covers everything you need to become a React developer.",
    shortDescription: "Learn React.js with hands-on projects",
    category: 0, // WebDevelopment (enum value)
    level: 0, // Beginner (enum value)
    price: 49.99,
    currency: "USD",
    thumbnailUrl: "/course-react.jpg",
    previewVideoUrl: null,
    tags: ["react", "javascript", "frontend", "web-development"],
    objectives: ["Understand JSX", "Master React hooks", "Build real applications", "State management"],
    requirements: ["Basic JavaScript knowledge", "HTML/CSS basics"],
    instructorId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 2, // Published
    isPublished: true,
    enrollmentCount: 0,
    rating: 0,
    reviewCount: 0,
    totalLessonCount: 12,
    totalModuleCount: 4
  },
  {
    _id: ObjectId(),
    title: "Data Science with Python",
    description: "Learn data analysis, visualization, and machine learning using Python libraries like NumPy, Pandas, and Scikit-learn. Master statistical concepts and build predictive models from real datasets.",
    shortDescription: "Master data science with Python",
    category: 1, // DataScience (enum value)
    level: 1, // Intermediate (enum value)
    price: 79.99,
    currency: "USD",
    thumbnailUrl: "/course-python-ds.jpg",
    previewVideoUrl: null,
    tags: ["python", "data-science", "analytics", "machine-learning"],
    objectives: ["Data manipulation with Pandas", "Data visualization", "Statistical analysis", "ML models"],
    requirements: ["Python basics", "Mathematics fundamentals"],
    instructorId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 2, // Published
    isPublished: true,
    enrollmentCount: 0,
    rating: 0,
    reviewCount: 0,
    totalLessonCount: 15,
    totalModuleCount: 5
  },
  {
    _id: ObjectId(),
    title: "UI/UX Design Principles",
    description: "Learn design thinking, user research, wireframing, and prototyping. Create beautiful and functional user experiences. This course covers both theory and practical application with real design tools.",
    shortDescription: "Master UI/UX design principles",
    category: 2, // UxDesign (enum value)
    level: 0, // Beginner (enum value)
    price: 0,
    currency: "USD",
    thumbnailUrl: "/course-uiux.jpg",
    previewVideoUrl: null,
    tags: ["design", "uiux", "figma", "user-experience"],
    objectives: ["User research methods", "Wireframing", "Prototyping", "Design systems"],
    requirements: ["No prerequisites"],
    instructorId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 2, // Published
    isPublished: true,
    enrollmentCount: 0,
    rating: 0,
    reviewCount: 0,
    totalLessonCount: 10,
    totalModuleCount: 3
  },
  {
    _id: ObjectId(),
    title: "Graphic Design Masterclass",
    description: "Professional graphic design techniques for print and digital media. Learn color theory, typography, layout principles, and design software. Create stunning visuals from concept to delivery.",
    shortDescription: "Professional graphic design techniques",
    category: 3, // GraphicDesign (enum value)
    level: 1, // Intermediate (enum value)
    price: 59.99,
    currency: "USD",
    thumbnailUrl: "/course-graphic.jpg",
    previewVideoUrl: null,
    tags: ["graphic-design", "design", "photoshop", "illustration"],
    objectives: ["Color and typography", "Layout design", "Branding", "Digital art"],
    requirements: ["Basic design knowledge", "Design software familiarity"],
    instructorId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 2, // Published
    isPublished: true,
    enrollmentCount: 5,
    rating: 4.8,
    reviewCount: 12,
    totalLessonCount: 18,
    totalModuleCount: 6
  },
  {
    _id: ObjectId(),
    title: "Mobile App Development with React Native",
    description: "Build cross-platform mobile applications using React Native. Deploy to iOS and Android with a single codebase. Learn navigation, state management, and native module integration.",
    shortDescription: "Cross-platform mobile development",
    category: 4, // MobileDevelopment (enum value)
    level: 2, // Advanced (enum value)
    price: 99.99,
    currency: "USD",
    thumbnailUrl: "/course-mobile.jpg",
    previewVideoUrl: null,
    tags: ["react-native", "mobile", "ios", "android"],
    objectives: ["React Native basics", "Navigation", "State management", "Native modules"],
    requirements: ["React knowledge required", "JavaScript proficiency"],
    instructorId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
    status: 2, // Published
    isPublished: true,
    enrollmentCount: 12,
    rating: 4.5,
    reviewCount: 28,
    totalLessonCount: 20,
    totalModuleCount: 5
  }
];

db.courses.insertMany(courses);

// Create indexes for better query performance
db.courses.createIndex({ "instructorId": 1 });
db.courses.createIndex({ "status": 1 });
db.courses.createIndex({ "isPublished": 1 });
db.courses.createIndex({ "title": "text", "description": "text" }); // Text search index

print("✅ Successfully seeded 5 courses into lms_db.courses");
print("✅ Indexes created for instructorId, status, isPublished, and text search");
print(`Total courses: ${db.courses.countDocuments()}`);
