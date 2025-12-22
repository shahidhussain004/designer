# 🧪 Test Data & Testing Guide

**Purpose:** Comprehensive test data for end-to-end testing of all platform features  
**Last Updated:** January 2025

---

## 📋 Test User Accounts

### Clients (Job Posters)
```json
{
  "email": "client1@example.com",
  "password": "password123",
  "role": "CLIENT",
  "name": "John Client",
  "credits": 5000.00
}

{
  "email": "client2@example.com",
  "password": "password123",
  "role": "CLIENT",
  "name": "Sarah Business",
  "credits": 10000.00
}
```

### Freelancers (Service Providers)
```json
{
  "email": "freelancer1@example.com",
  "password": "password123",
  "role": "FREELANCER",
  "name": "Mike Designer",
  "skills": ["UI/UX Design", "Figma", "Adobe XD"],
  "hourlyRate": 50.00
}

{
  "email": "freelancer2@example.com",
  "password": "password123",
  "role": "FREELANCER",
  "name": "Emma Developer",
  "skills": ["React", "Node.js", "TypeScript"],
  "hourlyRate": 75.00
}

{
  "email": "freelancer3@example.com",
  "password": "password123",
  "role": "FREELANCER",
  "name": "Alex VideoEditor",
  "skills": ["Video Editing", "After Effects", "Premiere Pro"],
  "hourlyRate": 60.00
}
```

### Instructors (Course Creators)
```json
{
  "email": "instructor1@example.com",
  "password": "password123",
  "role": "INSTRUCTOR",
  "name": "Dr. Jane Teacher",
  "specialization": "Web Development",
  "coursesCreated": 5
}

{
  "email": "instructor2@example.com",
  "password": "password123",
  "role": "INSTRUCTOR",
  "name": "Prof. David Expert",
  "specialization": "Data Science",
  "coursesCreated": 3
}
```

### Administrators
```json
{
  "email": "admin@example.com",
  "password": "admin123",
  "role": "ADMIN",
  "name": "System Administrator",
  "permissions": ["all"]
}

{
  "email": "moderator@example.com",
  "password": "mod123",
  "role": "MODERATOR",
  "name": "Content Moderator",
  "permissions": ["jobs.review", "users.suspend"]
}
```

---

## 💼 Test Job Postings

### Job 1: Website Redesign
```json
{
  "id": "job-001",
  "title": "E-commerce Website Redesign",
  "description": "Need a modern redesign for our online store with improved UX",
  "category": "Web Design",
  "budget": 3000.00,
  "budgetType": "FIXED",
  "status": "OPEN",
  "clientId": "client1@example.com",
  "skills": ["UI/UX", "Figma", "Responsive Design"],
  "deadline": "2025-03-01",
  "milestones": [
    {
      "title": "Initial Mockups",
      "description": "Homepage and product page designs",
      "amount": 1000.00,
      "dueDate": "2025-02-01"
    },
    {
      "title": "Complete Design System",
      "description": "All pages with interactive prototype",
      "amount": 2000.00,
      "dueDate": "2025-03-01"
    }
  ]
}
```

### Job 2: Mobile App Development
```json
{
  "id": "job-002",
  "title": "React Native Fitness App",
  "description": "Build a cross-platform fitness tracking mobile app",
  "category": "Mobile Development",
  "budget": 8000.00,
  "budgetType": "FIXED",
  "status": "IN_PROGRESS",
  "clientId": "client2@example.com",
  "freelancerId": "freelancer2@example.com",
  "skills": ["React Native", "Firebase", "API Integration"],
  "deadline": "2025-04-15",
  "milestones": [
    {
      "title": "Core Features",
      "description": "User auth, workout tracking, data sync",
      "amount": 4000.00,
      "dueDate": "2025-03-15",
      "status": "COMPLETED"
    },
    {
      "title": "Advanced Features",
      "description": "Social sharing, analytics, notifications",
      "amount": 4000.00,
      "dueDate": "2025-04-15",
      "status": "IN_PROGRESS"
    }
  ]
}
```

### Job 3: Video Editing
```json
{
  "id": "job-003",
  "title": "YouTube Channel Intro Video",
  "description": "30-second branded intro for tech YouTube channel",
  "category": "Video Editing",
  "budget": 500.00,
  "budgetType": "FIXED",
  "status": "COMPLETED",
  "clientId": "client1@example.com",
  "freelancerId": "freelancer3@example.com",
  "skills": ["After Effects", "Motion Graphics"],
  "completedDate": "2025-01-10"
}
```

---

## 📚 Test Course Data

### Course 1: Complete Web Development Bootcamp
```json
{
  "id": "course-001",
  "title": "Complete Web Development Bootcamp 2025",
  "description": "Learn HTML, CSS, JavaScript, React, Node.js from scratch",
  "instructorId": "instructor1@example.com",
  "instructorName": "Dr. Jane Teacher",
  "price": 149.99,
  "category": "Web Development",
  "level": "BEGINNER",
  "duration": "40 hours",
  "rating": 4.8,
  "totalEnrollments": 1247,
  "sections": [
    {
      "title": "Introduction to HTML & CSS",
      "lessons": [
        {
          "title": "HTML Basics",
          "videoUrl": "https://cdn.example.com/videos/html-basics.mp4",
          "duration": "15:30",
          "type": "VIDEO"
        },
        {
          "title": "CSS Styling",
          "videoUrl": "https://cdn.example.com/videos/css-styling.mp4",
          "duration": "20:45",
          "type": "VIDEO"
        },
        {
          "title": "HTML/CSS Quiz",
          "type": "QUIZ",
          "questions": 10,
          "passingScore": 70
        }
      ]
    },
    {
      "title": "JavaScript Fundamentals",
      "lessons": [
        {
          "title": "Variables and Data Types",
          "videoUrl": "https://cdn.example.com/videos/js-variables.mp4",
          "duration": "18:20",
          "type": "VIDEO"
        },
        {
          "title": "Functions and Scope",
          "videoUrl": "https://cdn.example.com/videos/js-functions.mp4",
          "duration": "25:15",
          "type": "VIDEO"
        }
      ]
    }
  ],
  "certificate": {
    "available": true,
    "requiresCompletion": 100,
    "requiresQuizPass": true
  }
}
```

### Course 2: Data Science with Python
```json
{
  "id": "course-002",
  "title": "Data Science with Python - Complete Guide",
  "description": "Master pandas, numpy, scikit-learn, and machine learning",
  "instructorId": "instructor2@example.com",
  "instructorName": "Prof. David Expert",
  "price": 199.99,
  "category": "Data Science",
  "level": "INTERMEDIATE",
  "duration": "50 hours",
  "rating": 4.9,
  "totalEnrollments": 892,
  "sections": [
    {
      "title": "Python for Data Science",
      "lessons": [
        {
          "title": "NumPy Arrays",
          "videoUrl": "https://cdn.example.com/videos/numpy-basics.mp4",
          "duration": "22:10",
          "type": "VIDEO"
        },
        {
          "title": "Pandas DataFrames",
          "videoUrl": "https://cdn.example.com/videos/pandas-intro.mp4",
          "duration": "28:45",
          "type": "VIDEO"
        }
      ]
    }
  ]
}
```

---

## 💳 Test Payment Scenarios

### Scenario 1: Successful Fixed-Price Payment
```json
{
  "contractId": "contract-001",
  "jobId": "job-001",
  "clientId": "client1@example.com",
  "freelancerId": "freelancer1@example.com",
  "totalAmount": 3000.00,
  "milestones": [
    {
      "id": "milestone-001",
      "title": "Initial Mockups",
      "amount": 1000.00,
      "status": "PAID",
      "paidDate": "2025-01-15",
      "transactionId": "txn-12345"
    },
    {
      "id": "milestone-002",
      "title": "Complete Design System",
      "amount": 2000.00,
      "status": "PENDING",
      "dueDate": "2025-03-01"
    }
  ],
  "paymentMethod": "stripe",
  "cardLast4": "4242"
}
```

### Scenario 2: Course Enrollment Payment
```json
{
  "enrollmentId": "enroll-001",
  "courseId": "course-001",
  "studentId": "freelancer1@example.com",
  "instructorId": "instructor1@example.com",
  "amount": 149.99,
  "status": "COMPLETED",
  "transactionId": "txn-67890",
  "paymentDate": "2025-01-20",
  "paymentMethod": "stripe",
  "cardLast4": "5555",
  "platformFee": 14.99,
  "instructorPayout": 134.99
}
```

### Scenario 3: Failed Payment (Retry)
```json
{
  "paymentId": "payment-failed-001",
  "amount": 500.00,
  "status": "FAILED",
  "errorCode": "card_declined",
  "errorMessage": "Insufficient funds",
  "attemptCount": 1,
  "maxAttempts": 3,
  "nextRetryAt": "2025-01-22T10:00:00Z"
}
```

---

## 💬 Test Chat Messages

### Conversation 1: Job Discussion
```json
{
  "conversationId": "conv-001",
  "participants": ["client1@example.com", "freelancer1@example.com"],
  "jobId": "job-001",
  "messages": [
    {
      "id": "msg-001",
      "senderId": "client1@example.com",
      "text": "Hi Mike, I reviewed your proposal. Can you share some examples of your previous e-commerce designs?",
      "timestamp": "2025-01-20T10:00:00Z",
      "status": "READ"
    },
    {
      "id": "msg-002",
      "senderId": "freelancer1@example.com",
      "text": "Absolutely! I'll send you my portfolio link. I've worked on 5+ e-commerce sites with similar requirements.",
      "timestamp": "2025-01-20T10:05:00Z",
      "status": "READ"
    },
    {
      "id": "msg-003",
      "senderId": "freelancer1@example.com",
      "text": "https://portfolio.mikedesigner.com/ecommerce",
      "timestamp": "2025-01-20T10:06:00Z",
      "status": "READ",
      "attachmentUrl": "https://portfolio.mikedesigner.com/ecommerce"
    }
  ]
}
```

---

## 🧪 End-to-End Test Flows

### Test Flow 1: Complete Freelance Job Cycle
```bash
# Step 1: Client registers and logs in
POST /api/auth/register
POST /api/auth/login
# Save JWT token

# Step 2: Client posts a job
POST /api/jobs
{
  "title": "Logo Design",
  "description": "Need a modern logo for tech startup",
  "budget": 500,
  "category": "Graphic Design"
}
# Expected: 201 Created, job ID returned

# Step 3: Freelancer logs in
POST /api/auth/login
# Different user credentials

# Step 4: Freelancer browses jobs
GET /api/jobs?category=Graphic%20Design
# Expected: 200 OK, array of jobs including new one

# Step 5: Freelancer submits proposal
POST /api/proposals
{
  "jobId": "job-004",
  "coverLetter": "I have 5 years experience...",
  "proposedAmount": 450,
  "deliveryTime": 7
}
# Expected: 201 Created, proposal ID returned

# Step 6: Client reviews proposals
GET /api/proposals/job/job-004
# Expected: 200 OK, array of proposals

# Step 7: Client accepts proposal
PUT /api/proposals/{proposalId}/accept
# Expected: 200 OK, contract created

# Step 8: Check WebSocket notification
# Expected: Freelancer receives real-time notification

# Step 9: Freelancer marks milestone complete
PUT /api/milestones/{milestoneId}/complete
# Expected: 200 OK, status updated

# Step 10: Client approves and pays
POST /api/payments/process
{
  "milestoneId": "milestone-003",
  "paymentMethodId": "pm_card_visa"
}
# Expected: 200 OK, Stripe payment processed

# Step 11: Check invoice
GET /api/invoices/{invoiceId}
# Expected: 200 OK, invoice PDF available

# Step 12: Freelancer checks payout
GET /api/payouts/user
# Expected: 200 OK, payout scheduled
```

### Test Flow 2: Complete Course Learning Cycle
```bash
# Step 1: Student registers
POST /api/auth/register
POST /api/auth/login

# Step 2: Browse courses
GET /api/lms/courses
# Expected: 200 OK, array of courses

# Step 3: Get course details
GET /api/lms/courses/course-001
# Expected: 200 OK, full course data with sections

# Step 4: Enroll in course
POST /api/lms/enrollments
{
  "courseId": "course-001",
  "paymentMethodId": "pm_card_visa"
}
# Expected: 201 Created, enrollment ID + payment processed

# Step 5: Check enrollment
GET /api/lms/enrollments/user
# Expected: 200 OK, user's enrollments

# Step 6: Watch first video
GET /api/lms/videos/{videoId}/stream
# Expected: 200 OK, video stream URL

# Step 7: Update progress
PUT /api/lms/progress
{
  "enrollmentId": "enroll-002",
  "lessonId": "lesson-001",
  "completed": true,
  "timeSpent": 930
}
# Expected: 200 OK, progress updated

# Step 8: Take quiz
POST /api/lms/quizzes/{quizId}/submit
{
  "answers": [
    {"questionId": "q1", "answerId": "a2"},
    {"questionId": "q2", "answerId": "a1"}
  ]
}
# Expected: 200 OK, score returned

# Step 9: Complete all lessons
# Repeat steps 6-8 for all lessons

# Step 10: Check certificate eligibility
GET /api/lms/certificates/eligibility/{enrollmentId}
# Expected: 200 OK, eligible: true

# Step 11: Generate certificate
POST /api/lms/certificates/generate/{enrollmentId}
# Expected: 201 Created, certificate PDF generated

# Step 12: Download certificate
GET /api/lms/certificates/{certificateId}/download
# Expected: 200 OK, PDF file
```

### Test Flow 3: Real-Time Messaging
```bash
# Step 1: User 1 connects to WebSocket
ws://localhost:8081/ws?token=<jwt_token>
# Expected: Connection established

# Step 2: User 2 connects to WebSocket
ws://localhost:8081/ws?token=<jwt_token_2>
# Expected: Connection established

# Step 3: User 1 sends message
WebSocket.send({
  "type": "message",
  "conversationId": "conv-002",
  "text": "Hello, are you available for a call?"
})
# Expected: User 2 receives message immediately

# Step 4: User 2 sends typing indicator
WebSocket.send({
  "type": "typing",
  "conversationId": "conv-002"
})
# Expected: User 1 sees "User 2 is typing..."

# Step 5: User 2 sends reply
WebSocket.send({
  "type": "message",
  "conversationId": "conv-002",
  "text": "Yes, I'm available now!"
})
# Expected: User 1 receives message immediately

# Step 6: Check presence
GET /api/messaging/presence/{userId}
# Expected: 200 OK, status: "online"

# Step 7: User 2 disconnects
WebSocket.close()
# Expected: User 1 receives presence update

# Step 8: Check offline presence
GET /api/messaging/presence/{userId2}
# Expected: 200 OK, status: "offline"
```

---

## 🔍 Stripe Test Cards

### Successful Payments
```
Card Number: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/25)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

### Failed Payments (Testing Error Handling)
```
Declined Card: 4000 0000 0000 0002
Insufficient Funds: 4000 0000 0000 9995
Expired Card: 4000 0000 0000 0069
Processing Error: 4000 0000 0000 0119
```

---

## 📊 Expected Test Results

### API Response Times (95th Percentile)
- Authentication: < 200ms
- Job listing: < 300ms
- Course enrollment: < 500ms
- Payment processing: < 2000ms (Stripe API call)
- WebSocket message: < 50ms

### Database Query Performance
- User lookup: < 10ms
- Job search: < 100ms (indexed)
- Course search: < 150ms (MongoDB indexed)

### Load Test Targets (100 Concurrent Users)
- Success Rate: > 99%
- Average Response Time: < 500ms
- Error Rate: < 1%
- Throughput: > 1000 req/sec

---

## 🛠️ Running Tests

### Integration Tests (Jest)
```bash
cd frontend/marketplace-web
npm test -- tests/integration.test.ts --runInBand
# Expected: All 38 tests pass
```

### Load Tests (JMeter)
```bash
jmeter -n -t tests/Designer_Marketplace_LoadTest.jmx -l results.jtl
# Expected: 99%+ success rate, avg response < 500ms
```

### Manual Testing (Postman)
```bash
# Import collection
postman/Designer_Marketplace_API.postman_collection.json

# Set environment
postman/Designer_Marketplace_Local.postman_environment.json

# Run all requests
# Expected: All 26 endpoints return successful responses
```

---

## 📝 Test Data Generation Scripts

### PostgreSQL Seed Data
```sql
-- Run this after migrations
INSERT INTO users (email, password_hash, full_name, user_type, created_at)
VALUES 
  ('client1@example.com', '$2a$10$...', 'John Client', 'CLIENT', NOW()),
  ('freelancer1@example.com', '$2a$10$...', 'Mike Designer', 'FREELANCER', NOW()),
  ('instructor1@example.com', '$2a$10$...', 'Dr. Jane Teacher', 'INSTRUCTOR', NOW());

-- See: scripts/seed-test-data.sql (to be created)
```

### MongoDB Seed Data
```javascript
// Run in MongoDB shell
use lms_db;

db.courses.insertMany([
  {
    title: "Complete Web Development Bootcamp 2025",
    instructorId: "instructor1@example.com",
    price: 149.99,
    sections: [...]
  }
]);

// See: scripts/seed-mongo-data.js (to be created)
```

---

## ✅ Verification Checklist

After running tests, verify:

- [ ] All users can register and login
- [ ] JWT tokens work correctly
- [ ] Jobs can be created and browsed
- [ ] Proposals can be submitted and accepted
- [ ] Contracts are created automatically
- [ ] Payments process through Stripe
- [ ] Invoices are generated correctly
- [ ] Courses can be enrolled
- [ ] Video streaming works
- [ ] Quiz scoring is accurate
- [ ] Certificates are generated
- [ ] WebSocket connections establish
- [ ] Messages are delivered in real-time
- [ ] Presence status updates correctly
- [ ] Notifications are sent via Kafka
- [ ] Admin dashboard shows correct metrics
- [ ] Monitoring (Prometheus/Grafana) captures metrics

---

**Next Steps:**
1. Run integration tests: `npm test`
2. Test key user flows manually
3. Check Stripe test payments
4. Verify WebSocket connections
5. Review monitoring dashboards
