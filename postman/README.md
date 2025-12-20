# Postman Collection - Designer Marketplace API

**Last Updated:** December 20, 2025  
**Backend Status:** ✅ Production Ready (60+ Endpoints)  
**Collection Version:** 2.0

## Quick Start

### Import Collection

1. Open Postman
2. Click **Import** → **File**
3. Select `Designer_Marketplace_API.postman_collection.json`
4. Import environment: `Designer_Marketplace_Local.postman_environment.json`
5. Select environment in top-right dropdown

### Available Collections

**Files:**
- `Designer_Marketplace_API.postman_collection.json` - Complete API collection (60+ requests)
- `Designer_Marketplace_Local.postman_environment.json` - Development environment (baseUrl: http://localhost:8080)

## Quick Testing

1. **Health Check:** `GET /api/auth/test` → Should return 200 OK
2. **Login:** `POST /api/auth/login` → Returns JWT token
3. **List Jobs:** `GET /api/jobs` → Browse all job listings
4. **Admin Dashboard:** `GET /api/admin/dashboard` → View metrics (74 users, 18 jobs)

## Test Credentials (74 Users Available)

```
CLIENT:
  Email: client1@example.com
  Password: password123
  Username: client_john

FREELANCER:
  Email: freelancer1@example.com
  Password: password123
  Username: designer_lisa

ADMIN:
  Email: admin@example.com
  Password: admin123
  Role: ADMIN
```

## API Endpoints Summary

### Authentication (✅ Complete)
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh token

### Users (✅ Complete)
- `GET /api/users/me` - Profile
- `GET /api/users/{id}` - User by ID
- `GET /api/users` - List (admin)

### Jobs (✅ Complete)
- `GET /api/jobs` - List with filters
- `POST /api/jobs` - Create job
- `GET /api/jobs/{id}` - Details
- `PUT /api/jobs/{id}` - Update
- `DELETE /api/jobs/{id}` - Delete

### Admin (✅ Complete - Sprint 13)
- `GET /api/admin/dashboard` - Dashboard metrics
- `GET /api/admin/users` - User management
- `GET /api/admin/jobs/pending` - Job moderation
- `GET /api/admin/activity` - Activity log

### Payments (✅ Complete - Sprint 10)
- `POST /api/payments/intent` - Create payment
- `GET /api/payments/history` - History
- `POST /api/payments/webhook` - Stripe webhook

### LMS (✅ Complete - Sprints 11-12)
- `GET /api/lms/courses` - List courses
- `POST /api/lms/enrollments` - Enroll
- `POST /api/lms/quizzes/submit` - Submit quiz
- `GET /api/lms/certificates` - Certificates

## API Documentation

**Swagger UI:** http://localhost:8080/swagger-ui.html  
**OpenAPI JSON:** http://localhost:8080/api-docs

## Status

✅ **All 60+ Endpoints Tested** (Dec 20, 2025)  
✅ **Backend Production Ready**  
✅ **Ready for Frontend Integration**
