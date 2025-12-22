namespace LmsService.DTOs;

public record CreateCourseRequest(
    string Title,
    string Description,
    string? ShortDescription,
    string? ThumbnailUrl,
    string? PreviewVideoUrl,
    string Category,
    string Level,
    decimal Price,
    string? Currency,
    List<string>? Tags,
    List<string>? Objectives,
    List<string>? Requirements
);

public record UpdateCourseRequest(
    string? Title,
    string? Description,
    string? ShortDescription,
    string? ThumbnailUrl,
    string? PreviewVideoUrl,
    string? Category,
    string? Level,
    decimal? Price,
    string? Currency,
    List<string>? Tags,
    List<string>? Objectives,
    List<string>? Requirements,
    string? Status
);

public record CourseResponse(
    string Id,
    string Title,
    string Description,
    string? ShortDescription,
    long InstructorId,
    string InstructorName,
    string? ThumbnailUrl,
    string? PreviewVideoUrl,
    string Category,
    string Level,
    string Status,
    decimal Price,
    string Currency,
    List<string> Tags,
    List<string> Objectives,
    List<string> Requirements,
    List<ModuleResponse> Modules,
    int TotalEnrollments,
    double AverageRating,
    int ReviewCount,
    int TotalDurationMinutes,
    int TotalLessons,
    string Slug,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    DateTime? PublishedAt
);

public record CourseSummaryResponse(
    string Id,
    string Title,
    string? ShortDescription,
    string InstructorName,
    string? ThumbnailUrl,
    string Category,
    string Level,
    decimal Price,
    string Currency,
    int TotalEnrollments,
    double AverageRating,
    int ReviewCount,
    int TotalDurationMinutes,
    int TotalLessons,
    string Slug
);

public record ModuleResponse(
    string Id,
    string Title,
    string? Description,
    int OrderIndex,
    List<LessonResponse> Lessons
);

public record LessonResponse(
    string Id,
    string Title,
    string? Description,
    string Type,
    string? VideoUrl,
    string? Content,
    int DurationMinutes,
    int OrderIndex,
    bool IsFree,
    List<LessonResourceResponse> Resources
);

public record LessonResourceResponse(
    string Name,
    string Url,
    string Type
);

public record AddModuleRequest(
    string Title,
    string? Description,
    int? OrderIndex
);

public record UpdateModuleRequest(
    string? Title,
    string? Description,
    int? OrderIndex
);

public record AddLessonRequest(
    string ModuleId,
    string Title,
    string? Description,
    string Type,
    string? Content,
    int? DurationMinutes,
    int? OrderIndex,
    bool? IsFree
);

public record UpdateLessonRequest(
    string? Title,
    string? Description,
    string? Type,
    string? Content,
    int? DurationMinutes,
    int? OrderIndex,
    bool? IsFree
);

public record LessonDto(
    string Id,
    string Title,
    string? Description,
    string Type,
    string? VideoKey,
    string? VideoUrl,
    int DurationMinutes,
    int OrderIndex
);

public record VideoUploadRequest(
    string CourseId,
    string ModuleId,
    string LessonId,
    string FileName,
    string ContentType,
    long FileSize
);

public record VideoUploadResponse(
    string UploadUrl,
    string VideoKey,
    string StreamUrl,
    DateTime ExpiresAt
);
