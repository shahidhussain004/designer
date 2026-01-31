using MongoDB.Driver;
using LmsService.Models;

namespace LmsService.Migrations.seed_data;

/// <summary>
/// Manual seed data runner for populating test data
/// Run this separately from migrations for development/testing
/// </summary>
public class SeedDataRunner
{
    private readonly IMongoDatabase _database;
    private readonly ILogger<SeedDataRunner> _logger;

    public SeedDataRunner(IMongoDatabase database, ILogger<SeedDataRunner> logger)
    {
        _database = database;
        _logger = logger;
    }

    public async Task RunAllSeedsAsync(CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("🌱 Starting seed data population...");

        try
        {
            await SeedCoursesAsync(cancellationToken);
            _logger.LogInformation("✅ All seed data populated successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Seed data population failed");
            throw;
        }
    }

    private async Task SeedCoursesAsync(CancellationToken cancellationToken)
    {
        var collection = _database.GetCollection<Course>("courses");
        var count = await collection.CountDocumentsAsync(FilterDefinition<Course>.Empty, cancellationToken: cancellationToken);

        if (count > 0)
        {
            _logger.LogInformation("⏭️  Courses collection already has data, skipping seed");
            return;
        }

        _logger.LogInformation("📚 Seeding courses...");

        var courses = new List<Course>
        {
            new Course
            {
                Title = "Complete JavaScript Masterclass",
                Description = "Master JavaScript from basics to advanced concepts",
                InstructorId = 1,
                InstructorName = "John Smith",
                Category = CourseCategory.WebDevelopment,
                Level = CourseLevel.Intermediate,
                Status = CourseStatus.Published,
                Price = 89.99m,
                Currency = "USD",
                Tags = new List<string> { "javascript", "es6", "web-development" },
                TotalEnrollments = 1250,
                AverageRating = 4.7,
                ReviewCount = 320,
                TotalDurationMinutes = 1200,
                TotalLessons = 85,
                Slug = "complete-javascript-masterclass",
                CreatedAt = DateTime.UtcNow.AddMonths(-11),
                UpdatedAt = DateTime.UtcNow.AddDays(-10),
                PublishedAt = DateTime.UtcNow.AddMonths(-11)
            },
            new Course
            {
                Title = "React & Redux - Build Modern Web Apps",
                Description = "Learn to build scalable web applications using React and Redux",
                InstructorId = 2,
                InstructorName = "Sarah Johnson",
                Category = CourseCategory.WebDevelopment,
                Level = CourseLevel.Advanced,
                Status = CourseStatus.Published,
                Price = 99.99m,
                Currency = "USD",
                Tags = new List<string> { "react", "redux", "javascript" },
                TotalEnrollments = 890,
                AverageRating = 4.8,
                ReviewCount = 245,
                TotalDurationMinutes = 1500,
                TotalLessons = 120,
                Slug = "react-redux-build-modern-web-apps",
                CreatedAt = DateTime.UtcNow.AddMonths(-10),
                UpdatedAt = DateTime.UtcNow.AddDays(-12),
                PublishedAt = DateTime.UtcNow.AddMonths(-10)
            },
            new Course
            {
                Title = "Full Stack Web Development Bootcamp",
                Description = "Comprehensive course covering front-end and back-end development",
                InstructorId = 1,
                InstructorName = "John Smith",
                Category = CourseCategory.Other,
                Level = CourseLevel.Beginner,
                Status = CourseStatus.Published,
                Price = 149.99m,
                Currency = "USD",
                Tags = new List<string> { "fullstack", "web-development", "react", "nodejs" },
                TotalEnrollments = 2100,
                AverageRating = 4.9,
                ReviewCount = 580,
                TotalDurationMinutes = 3600,
                TotalLessons = 250,
                Slug = "full-stack-web-development-bootcamp",
                CreatedAt = DateTime.UtcNow.AddMonths(-12),
                UpdatedAt = DateTime.UtcNow.AddDays(-2),
                PublishedAt = DateTime.UtcNow.AddMonths(-12)
            }
        };

        await collection.InsertManyAsync(courses, cancellationToken: cancellationToken);
        _logger.LogInformation($"✅ Inserted {courses.Count} courses");
    }
}
