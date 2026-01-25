/**
 * Courses Seed Data
 * Creates comprehensive courses for various technologies and programming languages
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding courses...');

  // =====================================================
  // 1. JAVA ADVANCED COURSE
  // =====================================================
  console.log('Creating Java Advanced course...');
  const javaAdvancedCourse = await prisma.course.create({
    data: {
      slug: 'java-advanced-programming',
      title: 'Java Advanced Programming - Mastery Course',
      shortDescription:
        'Master advanced Java concepts including concurrency, streams, and enterprise patterns.',
      description: `
# Java Advanced Programming - Complete Mastery Course

Learn advanced Java programming concepts including:
- Multithreading and concurrency
- Java Streams and functional programming
- Enterprise design patterns
- Performance optimization
- Advanced data structures

## What You'll Learn
- Deep understanding of JVM internals
- Concurrent programming with threads, locks, and executors
- Functional programming with streams and lambdas
- Enterprise patterns and best practices
- Performance tuning and optimization
- Memory management and garbage collection

## Prerequisites
- Solid understanding of Java basics
- Knowledge of OOP concepts
- Familiarity with collections framework

## Course Includes
- 45+ video lectures
- 20+ coding exercises
- Real-world project examples
- Downloadable resources
- Certificate of completion
`,
      instructorId: 'instructor-java-001',
      instructorName: 'David Chen',
      price: 4999,
      currency: 'USD',
      category: 'Programming',
      level: 'Advanced',
      totalDurationMinutes: 720,
      totalLessons: 48,
      thumbnailUrl: 'https://api.example.com/images/courses/java-advanced.jpg',
      isPublished: true,
      displayOrder: 1,
      averageRating: 4.8,
      reviewCount: 342,
      totalEnrollments: 5200,
      metaTags: {
        keywords: ['java', 'advanced', 'multithreading', 'streams', 'patterns'],
        description: 'Master advanced Java programming concepts and enterprise development',
        ogImage: 'https://api.example.com/images/courses/java-advanced.jpg',
      },
    },
  });

  // Add lessons to Java Advanced course
  await prisma.lesson.createMany({
    data: [
      {
        courseId: javaAdvancedCourse.id,
        title: 'Concurrency Fundamentals',
        description: 'Introduction to multithreading and concurrency in Java',
        videoDuration: 45,
        videoUrl: 'https://videos.example.com/java-advanced/concurrency-intro.mp4',
        order: 1,
        isPublished: true,
      },
      {
        courseId: javaAdvancedCourse.id,
        title: 'Thread Synchronization',
        description: 'Learn about synchronized blocks, locks, and thread safety',
        videoDuration: 52,
        videoUrl: 'https://videos.example.com/java-advanced/thread-sync.mp4',
        order: 2,
        isPublished: true,
      },
      {
        courseId: javaAdvancedCourse.id,
        title: 'Executor Framework',
        description: 'Master thread pools and executor services for efficient concurrency',
        videoDuration: 58,
        videoUrl: 'https://videos.example.com/java-advanced/executor-framework.mp4',
        order: 3,
        isPublished: true,
      },
      {
        courseId: javaAdvancedCourse.id,
        title: 'Streams API & Functional Programming',
        description: 'Write elegant and efficient code using Java Streams',
        videoDuration: 65,
        videoUrl: 'https://videos.example.com/java-advanced/streams-api.mp4',
        order: 4,
        isPublished: true,
      },
      {
        courseId: javaAdvancedCourse.id,
        title: 'Design Patterns for Enterprise',
        description: 'Learn MVC, Singleton, Factory, Observer, and more patterns',
        videoDuration: 72,
        videoUrl: 'https://videos.example.com/java-advanced/design-patterns.mp4',
        order: 5,
        isPublished: true,
      },
      {
        courseId: javaAdvancedCourse.id,
        title: 'Performance Optimization',
        description: 'Optimize your Java applications for speed and memory efficiency',
        videoDuration: 68,
        videoUrl: 'https://videos.example.com/java-advanced/performance.mp4',
        order: 6,
        isPublished: true,
      },
    ],
  });

  // =====================================================
  // 2. SPRING BOOT MICROSERVICES COURSE
  // =====================================================
  console.log('Creating Spring Boot Microservices course...');
  const springBootMicroservicesCourse = await prisma.course.create({
    data: {
      slug: 'spring-boot-microservices',
      title: 'Spring Boot & Microservices Architecture',
      shortDescription: 'Build scalable microservices using Spring Boot, Docker, and Kubernetes.',
      description: `
# Spring Boot & Microservices Architecture

Master modern microservices development with Spring Boot and cloud-native technologies.

## Course Content
- Spring Boot 3.x fundamentals
- Building RESTful APIs
- Microservices architecture patterns
- Service discovery and load balancing
- Circuit breakers and resilience
- API Gateway patterns
- Docker containerization
- Kubernetes orchestration
- Message-driven systems with Kafka
- Distributed tracing with Spring Cloud Sleuth

## What You'll Build
- Multi-service e-commerce application
- Service mesh with Istio
- Complete CI/CD pipeline
- Monitoring and observability stack

## Requirements
- Understanding of Spring Framework
- Basic Docker knowledge
- Familiarity with REST APIs
`,
      instructorId: 'instructor-spring-001',
      instructorName: 'Rachel Thompson',
      price: 5999,
      currency: 'USD',
      category: 'Backend Development',
      level: 'Advanced',
      totalDurationMinutes: 900,
      totalLessons: 62,
      thumbnailUrl: 'https://api.example.com/images/courses/spring-microservices.jpg',
      isPublished: true,
      displayOrder: 2,
      averageRating: 4.9,
      reviewCount: 521,
      totalEnrollments: 8100,
      metaTags: {
        keywords: ['spring boot', 'microservices', 'docker', 'kubernetes', 'cloud'],
        description: 'Master microservices architecture with Spring Boot and cloud technologies',
        ogImage: 'https://api.example.com/images/courses/spring-microservices.jpg',
      },
    },
  });

  // Add lessons to Spring Boot course
  await prisma.lesson.createMany({
    data: [
      {
        courseId: springBootMicroservicesCourse.id,
        title: 'Spring Boot 3 Essentials',
        description: 'Get up to speed with Spring Boot 3.x and modern Spring development',
        videoDuration: 55,
        videoUrl: 'https://videos.example.com/spring/boot3-essentials.mp4',
        order: 1,
        isPublished: true,
      },
      {
        courseId: springBootMicroservicesCourse.id,
        title: 'Building Production-Ready APIs',
        description: 'Design and implement robust REST APIs with proper error handling',
        videoDuration: 62,
        videoUrl: 'https://videos.example.com/spring/production-apis.mp4',
        order: 2,
        isPublished: true,
      },
      {
        courseId: springBootMicroservicesCourse.id,
        title: 'Microservices Architecture Patterns',
        description: 'Learn architectural patterns for distributed systems',
        videoDuration: 68,
        videoUrl: 'https://videos.example.com/spring/microservices-patterns.mp4',
        order: 3,
        isPublished: true,
      },
      {
        courseId: springBootMicroservicesCourse.id,
        title: 'Docker & Container Basics',
        description: 'Containerize your Spring Boot applications with Docker',
        videoDuration: 48,
        videoUrl: 'https://videos.example.com/spring/docker-basics.mp4',
        order: 4,
        isPublished: true,
      },
      {
        courseId: springBootMicroservicesCourse.id,
        title: 'Kubernetes for Orchestration',
        description: 'Deploy and manage microservices with Kubernetes',
        videoDuration: 75,
        videoUrl: 'https://videos.example.com/spring/kubernetes.mp4',
        order: 5,
        isPublished: true,
      },
    ],
  });

  // =====================================================
  // 3. REACT MODERN DEVELOPMENT COURSE
  // =====================================================
  console.log('Creating React Modern Development course...');
  const reactCourse = await prisma.course.create({
    data: {
      slug: 'react-modern-development',
      title: 'React: Modern Development Practices 2025',
      shortDescription: 'Learn React 19 with hooks, server components, and modern patterns.',
      description: `
# React: Modern Development Practices 2025

Become a React expert with the latest features and best practices.

## Course Includes
- React 19 fundamentals
- Functional components and hooks
- Server components and streaming
- State management (Redux, Zustand, Jotai)
- Performance optimization
- Routing and navigation
- Form handling and validation
- API integration
- Testing with Jest and React Testing Library
- Building real-world applications

## Project-Based Learning
- Build 5 complete applications
- Real API integrations
- Performance optimization case studies
- Deployment to production

## Prerequisites
- JavaScript fundamentals
- Understanding of HTML and CSS
- Basic knowledge of ES6+ syntax
`,
      instructorId: 'instructor-react-001',
      instructorName: 'Alex Kumar',
      price: 4499,
      currency: 'USD',
      category: 'Frontend Development',
      level: 'Intermediate',
      totalDurationMinutes: 650,
      totalLessons: 55,
      thumbnailUrl: 'https://api.example.com/images/courses/react-modern.jpg',
      isPublished: true,
      displayOrder: 3,
      averageRating: 4.7,
      reviewCount: 623,
      totalEnrollments: 9800,
      metaTags: {
        keywords: ['react', 'javascript', 'frontend', 'hooks', 'components'],
        description: 'Master React development with modern patterns and best practices',
        ogImage: 'https://api.example.com/images/courses/react-modern.jpg',
      },
    },
  });

  // Add lessons to React course
  await prisma.lesson.createMany({
    data: [
      {
        courseId: reactCourse.id,
        title: 'React Fundamentals',
        description: 'Understanding React components, JSX, and the virtual DOM',
        videoDuration: 52,
        videoUrl: 'https://videos.example.com/react/fundamentals.mp4',
        order: 1,
        isPublished: true,
      },
      {
        courseId: reactCourse.id,
        title: 'Hooks Deep Dive',
        description: 'Master all React hooks: useState, useEffect, useContext, and custom hooks',
        videoDuration: 65,
        videoUrl: 'https://videos.example.com/react/hooks-deep-dive.mp4',
        order: 2,
        isPublished: true,
      },
      {
        courseId: reactCourse.id,
        title: 'State Management',
        description: 'Explore Redux, Context API, and modern alternatives',
        videoDuration: 72,
        videoUrl: 'https://videos.example.com/react/state-management.mp4',
        order: 3,
        isPublished: true,
      },
      {
        courseId: reactCourse.id,
        title: 'Performance Optimization',
        description: 'Optimize React applications for speed and user experience',
        videoDuration: 58,
        videoUrl: 'https://videos.example.com/react/performance.mp4',
        order: 4,
        isPublished: true,
      },
      {
        courseId: reactCourse.id,
        title: 'Testing React Applications',
        description: 'Write tests with Jest and React Testing Library',
        videoDuration: 61,
        videoUrl: 'https://videos.example.com/react/testing.mp4',
        order: 5,
        isPublished: true,
      },
    ],
  });

  // =====================================================
  // 4. NODE.JS BACKEND DEVELOPMENT COURSE
  // =====================================================
  console.log('Creating Node.js Backend Development course...');
  const nodeJsCourse = await prisma.course.create({
    data: {
      slug: 'nodejs-backend-development',
      title: 'Node.js Backend Development: Complete Guide',
      shortDescription: 'Master Node.js and build production-grade backend applications.',
      description: `
# Node.js Backend Development: Complete Guide

Build scalable and maintainable backend applications with Node.js and Express.

## What You'll Master
- Node.js runtime and event loop
- Express.js framework
- RESTful API design
- Authentication and authorization
- Database integration (SQL and NoSQL)
- Error handling and logging
- Testing and TDD
- Deployment and DevOps
- Performance monitoring
- Security best practices

## Real-World Projects
- User management system
- E-commerce API
- Social media backend
- Real-time chat application
- Data analytics dashboard

## Course Features
- 50+ video lectures
- 15+ hands-on exercises
- Complete source code
- Best practices guide
- Career advice section
`,
      instructorId: 'instructor-nodejs-001',
      instructorName: 'Emma Davis',
      price: 4799,
      currency: 'USD',
      category: 'Backend Development',
      level: 'Intermediate',
      totalDurationMinutes: 780,
      totalLessons: 58,
      thumbnailUrl: 'https://api.example.com/images/courses/nodejs-backend.jpg',
      isPublished: true,
      displayOrder: 4,
      averageRating: 4.8,
      reviewCount: 445,
      totalEnrollments: 7300,
      metaTags: {
        keywords: ['node.js', 'backend', 'express', 'api', 'javascript'],
        description: 'Complete Node.js backend development course with real-world projects',
        ogImage: 'https://api.example.com/images/courses/nodejs-backend.jpg',
      },
    },
  });

  // Add lessons to Node.js course
  await prisma.lesson.createMany({
    data: [
      {
        courseId: nodeJsCourse.id,
        title: 'Node.js Fundamentals',
        description: 'Understanding Node.js architecture, event loop, and non-blocking I/O',
        videoDuration: 48,
        videoUrl: 'https://videos.example.com/nodejs/fundamentals.mp4',
        order: 1,
        isPublished: true,
      },
      {
        courseId: nodeJsCourse.id,
        title: 'Express.js Framework',
        description: 'Build web applications with Express.js routing and middleware',
        videoDuration: 55,
        videoUrl: 'https://videos.example.com/nodejs/express.mp4',
        order: 2,
        isPublished: true,
      },
      {
        courseId: nodeJsCourse.id,
        title: 'Database Integration',
        description: 'Connect to PostgreSQL, MongoDB, and other databases',
        videoDuration: 68,
        videoUrl: 'https://videos.example.com/nodejs/databases.mp4',
        order: 3,
        isPublished: true,
      },
      {
        courseId: nodeJsCourse.id,
        title: 'Authentication & Security',
        description: 'Implement JWT, OAuth, and security best practices',
        videoDuration: 62,
        videoUrl: 'https://videos.example.com/nodejs/auth-security.mp4',
        order: 4,
        isPublished: true,
      },
      {
        courseId: nodeJsCourse.id,
        title: 'Deployment & Production',
        description: 'Deploy Node.js applications to production environments',
        videoDuration: 52,
        videoUrl: 'https://videos.example.com/nodejs/deployment.mp4',
        order: 5,
        isPublished: true,
      },
    ],
  });

  // =====================================================
  // 5. PYTHON FULL-STACK COURSE
  // =====================================================
  console.log('Creating Python Full-Stack Development course...');
  const pythonCourse = await prisma.course.create({
    data: {
      slug: 'python-full-stack-development',
      title: 'Python Full-Stack Development',
      shortDescription: 'Build full-stack applications with Django, React, and PostgreSQL.',
      description: `
# Python Full-Stack Development

Create complete web applications using Python and modern frontend technologies.

## Curriculum Highlights
- Python 3.11+ programming
- Django web framework
- Django REST Framework
- PostgreSQL database design
- React frontend integration
- Authentication systems
- Deployment with Docker
- Testing best practices
- API development
- Real-time features with WebSockets

## Project Outcomes
- Blog platform with comments and likes
- Project management application
- E-learning platform
- Social networking features
- Payment integration

## Prerequisites
- Basic Python knowledge
- Understanding of web concepts
- Familiarity with databases
`,
      instructorId: 'instructor-python-001',
      instructorName: 'Michael Wong',
      price: 5299,
      currency: 'USD',
      category: 'Full-Stack Development',
      level: 'Advanced',
      totalDurationMinutes: 850,
      totalLessons: 64,
      thumbnailUrl: 'https://api.example.com/images/courses/python-fullstack.jpg',
      isPublished: true,
      displayOrder: 5,
      averageRating: 4.9,
      reviewCount: 287,
      totalEnrollments: 4200,
      metaTags: {
        keywords: ['python', 'django', 'fullstack', 'web development', 'react'],
        description: 'Master full-stack development with Python and Django',
        ogImage: 'https://api.example.com/images/courses/python-fullstack.jpg',
      },
    },
  });

  // Add lessons to Python course
  await prisma.lesson.createMany({
    data: [
      {
        courseId: pythonCourse.id,
        title: 'Python Advanced Concepts',
        description: 'Deep dive into Python decorators, generators, and metaclasses',
        videoDuration: 58,
        videoUrl: 'https://videos.example.com/python/advanced-concepts.mp4',
        order: 1,
        isPublished: true,
      },
      {
        courseId: pythonCourse.id,
        title: 'Django Fundamentals',
        description: 'Build web applications with Django models, views, and templates',
        videoDuration: 65,
        videoUrl: 'https://videos.example.com/python/django-fundamentals.mp4',
        order: 2,
        isPublished: true,
      },
      {
        courseId: pythonCourse.id,
        title: 'Django REST Framework',
        description: 'Create powerful APIs with Django REST Framework',
        videoDuration: 72,
        videoUrl: 'https://videos.example.com/python/drf.mp4',
        order: 3,
        isPublished: true,
      },
      {
        courseId: pythonCourse.id,
        title: 'Frontend Integration',
        description: 'Connect React frontend with Django backend',
        videoDuration: 68,
        videoUrl: 'https://videos.example.com/python/frontend-integration.mp4',
        order: 4,
        isPublished: true,
      },
    ],
  });

  // =====================================================
  // 6. AWS CLOUD DEVELOPMENT COURSE
  // =====================================================
  console.log('Creating AWS Cloud Development course...');
  const awsCourse = await prisma.course.create({
    data: {
      slug: 'aws-cloud-development',
      title: 'AWS Cloud Development: From Beginner to Expert',
      shortDescription: 'Master AWS services and build cloud-native applications.',
      description: `
# AWS Cloud Development: From Beginner to Expert

Become proficient with AWS and prepare for certification exams.

## AWS Services Covered
- EC2 and VPC networking
- S3 and storage solutions
- RDS and database services
- Lambda and serverless computing
- API Gateway
- CloudFront CDN
- CloudWatch monitoring
- IAM security
- SNS and SQS messaging
- DynamoDB NoSQL database

## Course Benefits
- Real-world architecture patterns
- Cost optimization strategies
- Security best practices
- High availability design
- Auto-scaling and load balancing
- CI/CD pipelines with AWS

## Projects
- Scalable web application
- Serverless data pipeline
- Real-time analytics dashboard
- Multi-tier enterprise application
`,
      instructorId: 'instructor-aws-001',
      instructorName: 'James Rodriguez',
      price: 5499,
      currency: 'USD',
      category: 'Cloud Computing',
      level: 'Intermediate',
      totalDurationMinutes: 920,
      totalLessons: 71,
      thumbnailUrl: 'https://api.example.com/images/courses/aws-development.jpg',
      isPublished: true,
      displayOrder: 6,
      averageRating: 4.8,
      reviewCount: 389,
      totalEnrollments: 6100,
      metaTags: {
        keywords: ['aws', 'cloud', 'devops', 'serverless', 'certification'],
        description: 'Complete AWS cloud development course with hands-on projects',
        ogImage: 'https://api.example.com/images/courses/aws-development.jpg',
      },
    },
  });

  // Add lessons to AWS course
  await prisma.lesson.createMany({
    data: [
      {
        courseId: awsCourse.id,
        title: 'AWS Fundamentals',
        description: 'Understanding AWS services and cloud computing concepts',
        videoDuration: 52,
        videoUrl: 'https://videos.example.com/aws/fundamentals.mp4',
        order: 1,
        isPublished: true,
      },
      {
        courseId: awsCourse.id,
        title: 'EC2 and Networking',
        description: 'Launch and manage EC2 instances with VPC networking',
        videoDuration: 68,
        videoUrl: 'https://videos.example.com/aws/ec2-networking.mp4',
        order: 2,
        isPublished: true,
      },
      {
        courseId: awsCourse.id,
        title: 'Serverless with Lambda',
        description: 'Build serverless applications with AWS Lambda and API Gateway',
        videoDuration: 72,
        videoUrl: 'https://videos.example.com/aws/lambda.mp4',
        order: 3,
        isPublished: true,
      },
      {
        courseId: awsCourse.id,
        title: 'Database Services',
        description: 'Work with RDS, DynamoDB, and ElastiCache',
        videoDuration: 65,
        videoUrl: 'https://videos.example.com/aws/databases.mp4',
        order: 4,
        isPublished: true,
      },
    ],
  });

  // Print summary
  const courseCount = await prisma.course.count();
  const lessonCount = await prisma.lesson.count();

  console.log('✅ Courses seeded successfully!');
  console.log(`
  Created:
  - ${courseCount} Courses
  - ${lessonCount} Lessons
  
  Courses added:
  1. Java Advanced Programming
  2. Spring Boot & Microservices
  3. React Modern Development
  4. Node.js Backend Development
  5. Python Full-Stack Development
  6. AWS Cloud Development
  `);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding courses:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
