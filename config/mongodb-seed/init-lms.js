// =====================================================
// LMS MongoDB Initialization Script
// Creates collections and indexes for LMS service
// Runs once on MongoDB container startup
// =====================================================

print('===== LMS MongoDB Initialization =====');

// Switch to lms_db
db = db.getSiblingDB('lms_db');

// Create collections with validation schemas
// Courses collection
db.createCollection("courses", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "instructorId", "status"],
      properties: {
        _id: { bsonType: "objectId" },
        title: { bsonType: "string" },
        shortDescription: { bsonType: "string" },
        description: { bsonType: "string" },
        instructorId: { bsonType: "long" },
        instructorName: { bsonType: "string" },
        category: { bsonType: "int" },
        level: { bsonType: "int" },
        price: { bsonType: "double" },
        currency: { bsonType: "string" },
        thumbnailUrl: { bsonType: "string" },
        videoUrl: { bsonType: "string" },
        syllabus: { bsonType: "array" },
        learningOutcomes: { bsonType: "array" },
        status: { bsonType: "int" },
        isPublished: { bsonType: "bool" },
        enrollmentsCount: { bsonType: "int" },
        ratingAvg: { bsonType: "double" },
        ratingCount: { bsonType: "int" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
        slug: { bsonType: "string" }
      }
    }
  }
});

// Enrollments collection
db.createCollection("enrollments", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["courseId", "userId", "status"],
      properties: {
        _id: { bsonType: "objectId" },
        courseId: { bsonType: "objectId" },
        userId: { bsonType: "long" },
        status: { bsonType: "int" },
        enrollmentDate: { bsonType: "date" },
        completionDate: { bsonType: "date" },
        progressPercentage: { bsonType: "double" },
        lastAccessedAt: { bsonType: "date" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

// Quizzes collection
db.createCollection("quizzes", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["courseId", "title"],
      properties: {
        _id: { bsonType: "objectId" },
        courseId: { bsonType: "objectId" },
        title: { bsonType: "string" },
        description: { bsonType: "string" },
        questions: { bsonType: "array" },
        passingScore: { bsonType: "double" },
        timeLimit: { bsonType: "int" },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

// Quiz Attempts collection
db.createCollection("quiz_attempts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["quizId", "userId", "score"],
      properties: {
        _id: { bsonType: "objectId" },
        quizId: { bsonType: "objectId" },
        userId: { bsonType: "long" },
        score: { bsonType: "double" },
        answers: { bsonType: "array" },
        status: { bsonType: "int" },
        attemptDate: { bsonType: "date" },
        createdAt: { bsonType: "date" }
      }
    }
  }
});

// Certificates collection
db.createCollection("certificates", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "courseId"],
      properties: {
        _id: { bsonType: "objectId" },
        userId: { bsonType: "long" },
        courseId: { bsonType: "objectId" },
        certificateNumber: { bsonType: "string" },
        issueDate: { bsonType: "date" },
        expiryDate: { bsonType: "date" },
        certificateUrl: { bsonType: "string" },
        status: { bsonType: "int" },
        createdAt: { bsonType: "date" }
      }
    }
  }
});

// Create indexes
print('Creating indexes...');

// Courses indexes
db.courses.createIndex({ "slug": 1 }, { unique: true });
db.courses.createIndex({ "instructorId": 1 });
db.courses.createIndex({ "isPublished": 1 });
db.courses.createIndex({ "category": 1 });
db.courses.createIndex({ "level": 1 });
db.courses.createIndex({ "createdAt": -1 });

// Enrollments indexes
db.enrollments.createIndex({ "courseId": 1, "userId": 1 }, { unique: true });
db.enrollments.createIndex({ "userId": 1 });
db.enrollments.createIndex({ "status": 1 });
db.enrollments.createIndex({ "enrollmentDate": -1 });

// Quizzes indexes
db.quizzes.createIndex({ "courseId": 1 });
db.quizzes.createIndex({ "createdAt": -1 });

// Quiz Attempts indexes
db.quiz_attempts.createIndex({ "quizId": 1, "userId": 1 });
db.quiz_attempts.createIndex({ "userId": 1 });
db.quiz_attempts.createIndex({ "attemptDate": -1 });

// Certificates indexes
db.certificates.createIndex({ "userId": 1, "courseId": 1 }, { unique: true });
db.certificates.createIndex({ "certificateNumber": 1 }, { unique: true });
db.certificates.createIndex({ "issueDate": -1 });

print('===== LMS MongoDB Initialization Complete =====');
print('Collections created:');
print('  - courses');
print('  - enrollments');
print('  - quizzes');
print('  - quiz_attempts');
print('  - certificates');
print('All indexes created successfully');
