using LmsService.Configuration;
using LmsService.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;

namespace LmsService.Repositories;

public interface ICourseRepository
{
    Task<Course?> GetByIdAsync(string id);
    Task<Course?> GetBySlugAsync(string slug);
    Task<List<Course>> GetByInstructorIdAsync(long instructorId, int skip, int take);
    Task<List<Course>> SearchAsync(string? searchTerm, CourseCategory? category, CourseLevel? level, CourseStatus? status, int skip, int take);
    Task<long> CountAsync(string? searchTerm, CourseCategory? category, CourseLevel? level, CourseStatus? status);
    Task<Course> CreateAsync(Course course);
    Task<Course> UpdateAsync(Course course);
    Task<bool> DeleteAsync(string id);
    Task<List<Course>> GetPopularCoursesAsync(int take);
    Task IncrementEnrollmentCountAsync(string courseId);
    Task UpdateRatingAsync(string courseId, double averageRating, int reviewCount);
}

public class CourseRepository : ICourseRepository
{
    private readonly IMongoCollection<Course> _courses;

    public CourseRepository(IMongoDatabase database, IOptions<MongoDbSettings> settings)
    {
        _courses = database.GetCollection<Course>(settings.Value.CoursesCollectionName);
        CreateIndexes();
    }

    private void CreateIndexes()
    {
        try
        {
            var indexKeys = Builders<Course>.IndexKeys;
            var indexes = new List<CreateIndexModel<Course>>
            {
                new(indexKeys.Ascending(c => c.Slug), new CreateIndexOptions { Unique = true }),
                new(indexKeys.Ascending(c => c.InstructorId)),
                new(indexKeys.Ascending(c => c.Category)),
                new(indexKeys.Ascending(c => c.Level)),
                new(indexKeys.Ascending(c => c.Status)),
                new(indexKeys.Text(c => c.Title).Text(c => c.Description))
            };
            _courses.Indexes.CreateMany(indexes);
        }
        catch (MongoDB.Driver.MongoCommandException ex) when (ex.Message.Contains("Index already exists"))
        {
            // Index already exists, this is fine
        }
    }

    public async Task<Course?> GetByIdAsync(string id)
    {
        return await _courses.Find(c => c.Id == id).FirstOrDefaultAsync();
    }

    public async Task<Course?> GetBySlugAsync(string slug)
    {
        return await _courses.Find(c => c.Slug == slug).FirstOrDefaultAsync();
    }

    public async Task<List<Course>> GetByInstructorIdAsync(long instructorId, int skip, int take)
    {
        return await _courses
            .Find(Builders<Course>.Filter.Eq("instructorId", instructorId))
            .SortByDescending(c => c.CreatedAt)
            .Skip(skip)
            .Limit(take)
            .ToListAsync();
    }

    public async Task<List<Course>> SearchAsync(string? searchTerm, CourseCategory? category, CourseLevel? level, CourseStatus? status, int skip, int take)
    {
        // Build filters manually using BsonDocument for more control
        var statusToFilter = status.HasValue ? status.Value : CourseStatus.Published;
        var filter = new BsonDocument("status", (int)statusToFilter);
        
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            filter.Add("$text", new BsonDocument("$search", searchTerm));
        }
        
        if (category.HasValue)
        {
            filter.Add("category", (int)category.Value);
        }
        
        if (level.HasValue)
        {
            filter.Add("level", (int)level.Value);
        }

        return await _courses
            .Find(filter)
            .SortByDescending(c => c.TotalEnrollments)
            .Skip(skip)
            .Limit(take)
            .ToListAsync();
    }

    public async Task<long> CountAsync(string? searchTerm, CourseCategory? category, CourseLevel? level, CourseStatus? status)
    {
        // Build filters manually using BsonDocument for more control
        var statusToFilter = status.HasValue ? status.Value : CourseStatus.Published;
        var filter = new BsonDocument("status", (int)statusToFilter);
        
        if (!string.IsNullOrWhiteSpace(searchTerm))
        {
            filter.Add("$text", new BsonDocument("$search", searchTerm));
        }
        
        if (category.HasValue)
        {
            filter.Add("category", (int)category.Value);
        }
        
        if (level.HasValue)
        {
            filter.Add("level", (int)level.Value);
        }

        return await _courses.CountDocumentsAsync(filter);
    }

    public async Task<Course> CreateAsync(Course course)
    {
        course.Slug = GenerateSlug(course.Title);
        await _courses.InsertOneAsync(course);
        return course;
    }

    public async Task<Course> UpdateAsync(Course course)
    {
        course.UpdatedAt = DateTime.UtcNow;
        await _courses.ReplaceOneAsync(c => c.Id == course.Id, course);
        return course;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _courses.DeleteOneAsync(c => c.Id == id);
        return result.DeletedCount > 0;
    }

    public async Task<List<Course>> GetPopularCoursesAsync(int take)
    {
        try
        {
            // Test: just try to count all documents first
            var allCount = await _courses.CountDocumentsAsync(new BsonDocument());
            Console.WriteLine($"[CourseRepository] Total documents in collection: {allCount}");
            
            // Now try the actual filter
            var filter = new BsonDocument("status", (int)CourseStatus.Published);
            var courses = await _courses
                .Find(filter)
                .SortByDescending(c => c.TotalEnrollments)
                .Limit(take)
                .ToListAsync();
            
            Console.WriteLine($"[CourseRepository] Found {courses.Count} published courses");
            return courses;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[CourseRepository] Error in GetPopularCoursesAsync: {ex}");
            throw;
        }
    }

    public async Task IncrementEnrollmentCountAsync(string courseId)
    {
        var update = Builders<Course>.Update.Inc(c => c.TotalEnrollments, 1);
        await _courses.UpdateOneAsync(c => c.Id == courseId, update);
    }

    public async Task UpdateRatingAsync(string courseId, double averageRating, int reviewCount)
    {
        var update = Builders<Course>.Update
            .Set(c => c.AverageRating, averageRating)
            .Set(c => c.ReviewCount, reviewCount);
        await _courses.UpdateOneAsync(c => c.Id == courseId, update);
    }

    private static string GenerateSlug(string title)
    {
        var slug = title.ToLowerInvariant()
            .Replace(" ", "-")
            .Replace("'", "")
            .Replace("\"", "");
        
        // Remove special characters
        slug = System.Text.RegularExpressions.Regex.Replace(slug, @"[^a-z0-9\-]", "");
        
        // Add random suffix to ensure uniqueness
        var suffix = Guid.NewGuid().ToString("N")[..6];
        return $"{slug}-{suffix}";
    }
}
