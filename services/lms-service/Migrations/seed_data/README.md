# LMS Seed Data

This directory contains seed data scripts for populating the LMS database with test/development data.

## Overview

- **Seed data is separate from migrations** - Migrations handle schema changes, seed data populates test content
- Seed data should be run manually or on-demand
- Safe for development/testing environments
- **DO NOT** run in production

## Running Seed Data

### Option 1: Using the Seed Data Runner (Recommended)

The `SeedDataRunner.cs` provides a C# implementation that:
- Checks if collections already have data (idempotent)
- Seeds courses, enrollments, certificates, and quizzes
- Uses proper C# models and MongoDB driver
- Provides detailed logging

To run from code:

```csharp
// In Program.cs or a controller endpoint
using (var scope = app.Services.CreateScope())
{
    var database = scope.ServiceProvider.GetRequiredService<IMongoDatabase>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<SeedDataRunner>>();
    var seeder = new SeedDataRunner(database, logger);
    
    await seeder.RunAllSeedsAsync();
}
```

### Option 2: Using mongosh (Legacy JavaScript seed)

If you prefer the legacy JavaScript approach:

```bash
# From the project root
docker exec -it config-mongodb-1 mongosh -u mongo_user -p mongo_pass_dev --authenticationDatabase admin lms_db /data/lms-seed.js
```

Or copy the seed script into the container:

```bash
docker cp config/mongodb-seed/lms-seed.js config-mongodb-1:/tmp/lms-seed.js
docker exec -it config-mongodb-1 mongosh -u mongo_user -p mongo_pass_dev --authenticationDatabase admin lms_db /tmp/lms-seed.js
```

## Seed Data Contents

### Courses (10 sample courses)
- Complete JavaScript Masterclass
- React & Redux - Build Modern Web Apps
- Full Stack Web Development Bootcamp
- Data Science with Python
- UI/UX Design Principles (Free course)
- AWS Cloud Essentials
- Machine Learning Fundamentals
- Mobile App Development with React Native
- DevOps with Docker and Kubernetes
- Cybersecurity Fundamentals

**Categories covered:**
- Web Development
- Mobile Development
- UX Design
- Data Science
- Cloud/DevOps
- Cybersecurity
- Machine Learning

**Difficulty levels:**
- Beginner (4 courses)
- Intermediate (4 courses)
- Advanced (2 courses)

### Enrollments
- Sample enrollments for first 3 courses
- Different progress percentages
- Active status

### Certificates
- Generated for completed enrollments
- Unique certificate numbers
- Verification URLs

### Quizzes
- Sample quiz for JavaScript course
- Multiple choice and true/false questions
- Passing score and time limits

## Data Characteristics

- **Realistic data**: Courses have proper titles, descriptions, objectives, requirements
- **Consistent field names**: Uses `totalEnrollments`, `averageRating` (not legacy names)
- **Enum serialization**: Category, Level, Status are integers (matching C# enums)
- **Unique constraints**: Slugs are unique, enrollment per student per course is unique
- **Timestamps**: CreatedAt, UpdatedAt, PublishedAt properly set
- **Relationships**: Enrollments reference courses, certificates reference enrollments and courses

## Resetting Data

To clear all LMS data and reseed:

```bash
# Option 1: Drop collections via mongosh
docker exec -it config-mongodb-1 mongosh -u mongo_user -p mongo_pass_dev --authenticationDatabase admin lms_db --eval "db.courses.drop(); db.enrollments.drop(); db.certificates.drop(); db.quizzes.drop(); db.quiz_attempts.drop();"

# Option 2: Drop entire database (requires re-running migrations)
docker exec -it config-mongodb-1 mongosh -u mongo_user -p mongo_pass_dev --authenticationDatabase admin --eval "db.getSiblingDB('lms_db').dropDatabase();"

# Then restart LMS service to run migrations
docker-compose restart lms-service

# Then run seed data again
```

## Best Practices

1. **Development**: Run seed data after initial migration to populate test content
2. **Testing**: Reset database and reseed before running integration tests
3. **Staging**: Use realistic but anonymized data
4. **Production**: NEVER run seed data in production

## Customizing Seed Data

To add more seed data:

1. Edit `SeedDataRunner.cs` and add more items to the `courses`, `enrollments`, etc. lists
2. Ensure data follows the model schemas
3. Maintain referential integrity (e.g., enrollments reference valid course IDs)
4. Keep slugs unique for courses
5. Use proper enum values for Category, Level, Status

## Troubleshooting

**Issue**: "Seed data already exists"
- Solution: This is expected behavior. Seed runner is idempotent and won't duplicate data

**Issue**: "No courses found for enrollment seed"
- Solution: Ensure courses are seeded first. SeedDataRunner runs in order: courses → enrollments → certificates → quizzes

**Issue**: "Unique constraint violation"
- Solution: Collections already have data. Drop collections first or use a fresh database

**Issue**: "Connection refused"
- Solution: Ensure MongoDB container is running and accessible

## Migration vs Seed Data

| Migrations | Seed Data |
|------------|-----------|
| Schema changes (collections, indexes) | Test/development content |
| Versioned (V001, V002, etc.) | Not versioned |
| Run automatically on startup | Run manually |
| Tracked in `migrations` collection | Not tracked |
| Required for app to function | Optional, for testing |
| Production-safe | Development only |

