using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LmsService.Models;

public class Course
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    [BsonElement("title")]
    public string Title { get; set; } = null!;

    [BsonElement("description")]
    public string Description { get; set; } = string.Empty;

    [BsonElement("shortDescription")]
    public string ShortDescription { get; set; } = string.Empty;

    [BsonElement("instructorId")]
    public long InstructorId { get; set; }

    [BsonElement("instructorName")]
    public string InstructorName { get; set; } = string.Empty;

    [BsonElement("thumbnailUrl")]
    public string? ThumbnailUrl { get; set; }

    [BsonElement("previewVideoUrl")]
    public string? PreviewVideoUrl { get; set; }

    [BsonElement("category")]
    public CourseCategory Category { get; set; }

    [BsonElement("level")]
    public CourseLevel Level { get; set; }

    [BsonElement("status")]
    public CourseStatus Status { get; set; }

    [BsonElement("price")]
    public decimal Price { get; set; }

    [BsonElement("currency")]
    public string Currency { get; set; } = "USD";

    [BsonElement("tags")]
    public List<string> Tags { get; set; } = new();

    [BsonElement("objectives")]
    public List<string> Objectives { get; set; } = new();

    [BsonElement("requirements")]
    public List<string> Requirements { get; set; } = new();

    [BsonElement("modules")]
    public List<Module> Modules { get; set; } = new();

    [BsonElement("totalEnrollments")]
    public int TotalEnrollments { get; set; }

    [BsonElement("averageRating")]
    public double AverageRating { get; set; }

    [BsonElement("reviewCount")]
    public int ReviewCount { get; set; }

    [BsonElement("totalDurationMinutes")]
    public int TotalDurationMinutes { get; set; }

    [BsonElement("totalLessons")]
    public int TotalLessons { get; set; }

    [BsonElement("slug")]
    public string Slug { get; set; } = string.Empty;

    [BsonElement("metaDescription")]
    public string? MetaDescription { get; set; }

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("publishedAt")]
    public DateTime? PublishedAt { get; set; }

    public void RecalculateStats()
    {
        int totalMins = 0;
        int lessonsCount = 0;

        foreach (var module in Modules)
        {
            foreach (var lesson in module.Lessons)
            {
                totalMins += lesson.DurationMinutes;
                lessonsCount++;
            }
        }

        TotalDurationMinutes = totalMins;
        TotalLessons = lessonsCount;
    }
}

public class Module
{
    [BsonElement("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [BsonElement("title")]
    public string Title { get; set; } = null!;

    [BsonElement("description")]
    public string? Description { get; set; }

    [BsonElement("orderIndex")]
    public int OrderIndex { get; set; }

    [BsonElement("lessons")]
    public List<Lesson> Lessons { get; set; } = new();
}

public class Lesson
{
    [BsonElement("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [BsonElement("title")]
    public string Title { get; set; } = null!;

    [BsonElement("description")]
    public string? Description { get; set; }

    [BsonElement("type")]
    public LessonType Type { get; set; }

    [BsonElement("videoUrl")]
    public string? VideoUrl { get; set; }

    [BsonElement("videoKey")]
    public string? VideoKey { get; set; }

    [BsonElement("content")]
    public string? Content { get; set; }

    [BsonElement("durationMinutes")]
    public int DurationMinutes { get; set; }

    [BsonElement("orderIndex")]
    public int OrderIndex { get; set; }

    [BsonElement("isFree")]
    public bool IsFree { get; set; }

    [BsonElement("resources")]
    public List<LessonResource> Resources { get; set; } = new();
}

public class LessonResource
{
    [BsonElement("name")]
    public string Name { get; set; } = null!;

    [BsonElement("url")]
    public string Url { get; set; } = null!;

    [BsonElement("type")]
    public string Type { get; set; } = null!;
}

public enum CourseCategory
{
    UiDesign,
    UxDesign,
    GraphicDesign,
    WebDevelopment,
    MobileDevelopment,
    Branding,
    Illustration,
    MotionGraphics,
    Photography,
    VideoEditing,
    Marketing,
    Business,
    Other
}

public enum CourseLevel
{
    Beginner,
    Intermediate,
    Advanced,
    AllLevels
}

public enum CourseStatus
{
    Draft,
    PendingReview,
    Published,
    Archived
}

public enum LessonType
{
    Video,
    Text,
    Quiz,
    Assignment
}
