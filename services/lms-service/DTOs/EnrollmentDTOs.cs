namespace LmsService.DTOs;

public record EnrollRequest(
    string CourseId,
    string? PaymentId
);

public record EnrollmentResponse(
    string Id,
    string CourseId,
    string CourseTitle,
    long StudentId,
    string StudentName,
    string Status,
    double ProgressPercentage,
    List<string> CompletedLessons,
    DateTime EnrolledAt,
    DateTime? LastAccessedAt,
    DateTime? CompletedAt,
    string? CertificateId,
    int? Rating,
    string? Review
);

public record UpdateProgressRequest(
    string LessonId,
    int? WatchedSeconds,
    bool? Completed
);

public record ProgressResponse(
    string EnrollmentId,
    string CourseId,
    double OverallProgress,
    int CompletedLessons,
    int TotalLessons,
    List<LessonProgressResponse> LessonProgress,
    DateTime? LastAccessedAt
);

public record LessonProgressResponse(
    string LessonId,
    int WatchedSeconds,
    bool Completed,
    DateTime? LastWatchedAt
);

public record SubmitReviewRequest(
    int Rating,
    string? Review
);

public record ReviewResponse(
    string EnrollmentId,
    string CourseId,
    long StudentId,
    string StudentName,
    int Rating,
    string? Review,
    DateTime ReviewedAt
);
