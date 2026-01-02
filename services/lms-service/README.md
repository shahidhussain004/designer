# LMS Service

.NET 8 Learning Management System API for the Designer Marketplace platform.

## Features

- **Course Management**: Create, update, publish courses with modules and lessons
- **Video Streaming**: AWS S3 upload with CloudFront CDN streaming
- **Quiz Engine**: Multiple question types (Multiple Choice, True/False, Short Answer, Multi-Select)
- **Certificate Generation**: PDF certificates with QuestPDF, verification system
- **Student Enrollment**: Progress tracking, completion status, reviews
- **Kafka Integration**: Event-driven enrollment on payment success

## API Endpoints

### Courses
- `GET /api/courses` - List courses with filters
- `GET /api/courses/{id}` - Get course details
- `POST /api/courses` - Create course (Instructor)
- `PUT /api/courses/{id}` - Update course
- `DELETE /api/courses/{id}` - Delete course
- `POST /api/courses/{id}/publish` - Publish course
- `GET /api/courses/search?query=` - Search courses
- `GET /api/courses/popular` - Get popular courses

### Modules & Lessons
- `POST /api/courses/{id}/modules` - Add module
- `PUT /api/courses/{id}/modules/{moduleId}` - Update module
- `POST /api/courses/{id}/modules/{moduleId}/lessons` - Add lesson

### Enrollments
- `POST /api/enrollments` - Enroll in course
- `GET /api/enrollments/my` - Get my enrollments
- `POST /api/enrollments/{id}/lessons/{lessonId}/complete` - Complete lesson
- `POST /api/enrollments/{id}/review` - Add review

### Quizzes
- `GET /api/quizzes/{id}/take` - Get quiz for taking
- `POST /api/quizzes` - Create quiz (Instructor)
- `POST /api/quizzes/{id}/submit` - Submit quiz answers
- `GET /api/quizzes/{id}/attempts` - Get my attempts

### Certificates
- `POST /api/certificates/generate` - Generate certificate
- `GET /api/certificates/verify/{number}` - Verify certificate (Public)
- `GET /api/certificates/my` - Get my certificates

### Videos
- `POST /api/videos/upload-url` - Get S3 upload URL (Instructor)
- `GET /api/videos/stream/{courseId}/{lessonId}` - Get streaming URL

### Health
- `GET /api/health` - Health check
- `GET /api/health/ready` - Readiness check
- `GET /api/health/live` - Liveness check

## Prerequisites

- .NET 8 SDK
- MongoDB 6.0+
- Redis
- Kafka
- AWS Account (S3, CloudFront)

## Configuration

Update `appsettings.json` or use environment variables:

```json
{
  "MongoDbSettings": {
    "ConnectionString": "mongodb://localhost:27017",
    "DatabaseName": "lms_db"
  },
  "AwsSettings": {
    "AccessKeyId": "your-access-key",
    "SecretAccessKey": "your-secret-key",
    "Region": "us-east-1",
    "VideoBucketName": "your-video-bucket",
    "CertificateBucketName": "your-cert-bucket",
    "CloudFrontDomain": "your-cdn.cloudfront.net"
  },
  "JwtSettings": {
    "SecretKey": "your-32-char-secret-key",
    "Issuer": "designer-marketplace",
    "Audience": "designer-marketplace-clients"
  }
}
```

## Running Locally

```bash
# Restore dependencies
dotnet restore

# Run in development mode
dotnet run

# Or with watch
dotnet watch run
```

The service will be available at `http://localhost:8082`

Swagger UI: `http://localhost:8082/swagger`

## Docker

```bash
# Build image
docker build -t lms-service .

# Run container
docker run -p 8082:8082 \
  -e MongoDbSettings__ConnectionString="mongodb://host.docker.internal:27017" \
  lms-service
```

## Architecture

```
lms-service/
├── Controllers/          # API endpoints
│   ├── CoursesController.cs
│   ├── EnrollmentsController.cs
│   ├── QuizzesController.cs
│   ├── CertificatesController.cs
│   ├── VideosController.cs
│   └── HealthController.cs
├── Models/               # MongoDB documents
│   ├── Course.cs
│   ├── Enrollment.cs
│   ├── Quiz.cs
│   └── Certificate.cs
├── DTOs/                 # Request/Response objects
├── Repositories/         # Data access layer
├── Services/             # Business logic
│   ├── CourseService.cs
│   ├── EnrollmentService.cs
│   ├── QuizService.cs
│   ├── CertificateService.cs
│   ├── VideoStreamingService.cs
│   └── KafkaConsumerService.cs
├── Configuration/        # Settings and DI
├── Middleware/           # Custom middleware
└── Events/               # Kafka event handlers
```

## Testing

```bash
# Run tests
dotnet test

# With coverage
dotnet test --collect:"XPlat Code Coverage"
```

## Integration with Other Services

- **marketplace-service** (Java): User authentication, payments
- **messaging-service** (Go): Real-time notifications
- **Kafka Topics**: 
  - Consumes: `payments.succeeded`, `users.created`
  - Produces: `enrollments.created`, `courses.published`

  ### Kafka Topic Creation Settings

  The service can optionally create missing Kafka topics at startup using the Admin client. Configure defaults in `appsettings.json` under `KafkaSettings`:

  - `DefaultNumPartitions`: default number of partitions for created topics (default: 3)
  - `DefaultReplicationFactor`: default replication factor for created topics (default: 1)
  - `TopicPartitions`: optional per-topic partition overrides (map of topic -> partitions)

  Example:

  ```json
  "KafkaSettings": {
    "BootstrapServers": "localhost:9092",
    "GroupId": "lms-service-group",
    "DefaultNumPartitions": 3,
    "DefaultReplicationFactor": 1,
    "TopicPartitions": { "payments.succeeded": 6 }
  }
  ```
