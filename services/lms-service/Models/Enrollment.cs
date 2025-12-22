using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LmsService.Models;

public class Enrollment
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    [BsonElement("courseId")]
    public string CourseId { get; set; } = null!;

    [BsonElement("studentId")]
    public long StudentId { get; set; }

    [BsonElement("studentName")]
    public string StudentName { get; set; } = string.Empty;

    [BsonElement("studentEmail")]
    public string StudentEmail { get; set; } = string.Empty;

    [BsonElement("status")]
    public EnrollmentStatus Status { get; set; }

    [BsonElement("progressPercentage")]
    public double ProgressPercentage { get; set; }

    [BsonElement("completedLessons")]
    public List<string> CompletedLessons { get; set; } = new();

    [BsonElement("lessonProgress")]
    public List<LessonProgress> LessonProgress { get; set; } = new();

    [BsonElement("quizAttempts")]
    public List<QuizAttemptRecord> QuizAttempts { get; set; } = new();

    [BsonElement("enrolledAt")]
    public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;

    [BsonElement("lastAccessedAt")]
    public DateTime? LastAccessedAt { get; set; }

    [BsonElement("completedAt")]
    public DateTime? CompletedAt { get; set; }

    [BsonElement("certificateId")]
    public string? CertificateId { get; set; }

    [BsonElement("paymentId")]
    public string? PaymentId { get; set; }

    [BsonElement("rating")]
    public int? Rating { get; set; }

    [BsonElement("review")]
    public string? Review { get; set; }

    [BsonElement("reviewedAt")]
    public DateTime? ReviewedAt { get; set; }
}

public class LessonProgress
{
    [BsonElement("lessonId")]
    public string LessonId { get; set; } = null!;

    [BsonElement("watchedSeconds")]
    public int WatchedSeconds { get; set; }

    [BsonElement("completed")]
    public bool Completed { get; set; }

    [BsonElement("lastWatchedAt")]
    public DateTime? LastWatchedAt { get; set; }
}

public class QuizAttemptRecord
{
    [BsonElement("quizId")]
    public string QuizId { get; set; } = null!;

    [BsonElement("score")]
    public double Score { get; set; }

    [BsonElement("passed")]
    public bool Passed { get; set; }

    [BsonElement("attemptedAt")]
    public DateTime AttemptedAt { get; set; }
}

public enum EnrollmentStatus
{
    Active,
    Completed,
    Expired,
    Refunded,
    Suspended
}
