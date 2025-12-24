using LmsService.DTOs;
using LmsService.Models;
using LmsService.Repositories;

namespace LmsService.Services;

public interface ICourseService
{
    Task<CourseResponse> CreateCourseAsync(long instructorId, string instructorName, CreateCourseRequest request);
    Task<CourseResponse> UpdateCourseAsync(string courseId, long instructorId, UpdateCourseRequest request);
    Task<CourseResponse?> GetCourseAsync(string courseId);
    Task<CourseResponse?> GetCourseBySlugAsync(string slug);
    Task<PagedResult<CourseSummaryResponse>> SearchCoursesAsync(string? searchTerm, string? category, string? level, int page, int pageSize);
    Task<PagedResult<CourseSummaryResponse>> GetCoursesByInstructorAsync(long instructorId, int page, int pageSize);
    Task<List<CourseSummaryResponse>> GetPopularCoursesAsync(int count);
    Task<bool> DeleteCourseAsync(string courseId, long instructorId);
    Task<CourseResponse> AddModuleAsync(string courseId, long instructorId, AddModuleRequest request);
    Task<CourseResponse> AddLessonAsync(string courseId, long instructorId, AddLessonRequest request);
    Task<CourseResponse> PublishCourseAsync(string courseId, long instructorId);
}

public class CourseService : ICourseService
{
    private readonly ICourseRepository _courseRepository;
    private readonly ILogger<CourseService> _logger;

    public CourseService(ICourseRepository courseRepository, ILogger<CourseService> logger)
    {
        _courseRepository = courseRepository;
        _logger = logger;
    }

    public async Task<CourseResponse> CreateCourseAsync(long instructorId, string instructorName, CreateCourseRequest request)
    {
        _logger.LogInformation("Creating course '{Title}' for instructor {InstructorId}", request.Title, instructorId);

        var course = new Course
        {
            Title = request.Title,
            Description = request.Description,
            ShortDescription = request.ShortDescription ?? string.Empty,
            InstructorId = instructorId,
            InstructorName = instructorName,
            ThumbnailUrl = request.ThumbnailUrl,
            PreviewVideoUrl = request.PreviewVideoUrl,
            Category = Enum.Parse<CourseCategory>(request.Category, true),
            Level = Enum.Parse<CourseLevel>(request.Level, true),
            Status = CourseStatus.Draft,
            Price = request.Price,
            Currency = request.Currency ?? "USD",
            Tags = request.Tags ?? new List<string>(),
            Objectives = request.Objectives ?? new List<string>(),
            Requirements = request.Requirements ?? new List<string>()
        };

        course = await _courseRepository.CreateAsync(course);
        _logger.LogInformation("Course created with ID: {CourseId}", course.Id);

        return MapToResponse(course);
    }

    public async Task<CourseResponse> UpdateCourseAsync(string courseId, long instructorId, UpdateCourseRequest request)
    {
        var course = await GetCourseForInstructor(courseId, instructorId);

        if (request.Title != null) course.Title = request.Title;
        if (request.Description != null) course.Description = request.Description;
        if (request.ShortDescription != null) course.ShortDescription = request.ShortDescription;
        if (request.ThumbnailUrl != null) course.ThumbnailUrl = request.ThumbnailUrl;
        if (request.PreviewVideoUrl != null) course.PreviewVideoUrl = request.PreviewVideoUrl;
        if (request.Category != null) course.Category = Enum.Parse<CourseCategory>(request.Category, true);
        if (request.Level != null) course.Level = Enum.Parse<CourseLevel>(request.Level, true);
        if (request.Price.HasValue) course.Price = request.Price.Value;
        if (request.Currency != null) course.Currency = request.Currency;
        if (request.Tags != null) course.Tags = request.Tags;
        if (request.Objectives != null) course.Objectives = request.Objectives;
        if (request.Requirements != null) course.Requirements = request.Requirements;
        if (request.Status != null) course.Status = Enum.Parse<CourseStatus>(request.Status, true);

        course = await _courseRepository.UpdateAsync(course);
        return MapToResponse(course);
    }

    public async Task<CourseResponse?> GetCourseAsync(string courseId)
    {
        var course = await _courseRepository.GetByIdAsync(courseId);
        return course != null ? MapToResponse(course) : null;
    }

    public async Task<CourseResponse?> GetCourseBySlugAsync(string slug)
    {
        var course = await _courseRepository.GetBySlugAsync(slug);
        return course != null ? MapToResponse(course) : null;
    }

    public async Task<PagedResult<CourseSummaryResponse>> SearchCoursesAsync(string? searchTerm, string? category, string? level, int page, int pageSize)
    {
        CourseCategory? categoryEnum = null;
        CourseLevel? levelEnum = null;

        try
        {
            if (category != null)
            {
                categoryEnum = Enum.Parse<CourseCategory>(category, true);
            }
        }
        catch
        {
            // If category parsing fails, just ignore it
            categoryEnum = null;
        }

        try
        {
            if (level != null)
            {
                levelEnum = Enum.Parse<CourseLevel>(level, true);
            }
        }
        catch
        {
            // If level parsing fails, just ignore it
            levelEnum = null;
        }

        // Ensure page is at least 0, then convert to 0-based skip
        int skip = Math.Max(0, page) * pageSize;
        var courses = await _courseRepository.SearchAsync(searchTerm, categoryEnum, levelEnum, CourseStatus.Published, skip, pageSize);
        var total = await _courseRepository.CountAsync(searchTerm, categoryEnum, levelEnum, CourseStatus.Published);

        // Return 1-based page number in response for compatibility
        return new PagedResult<CourseSummaryResponse>(
            courses.Select(MapToSummary).ToList(),
            total,
            page + 1,
            pageSize
        );
    }

    public async Task<PagedResult<CourseSummaryResponse>> GetCoursesByInstructorAsync(long instructorId, int page, int pageSize)
    {
        var courses = await _courseRepository.GetByInstructorIdAsync(instructorId, (page - 1) * pageSize, pageSize);
        return new PagedResult<CourseSummaryResponse>(
            courses.Select(MapToSummary).ToList(),
            courses.Count,
            page,
            pageSize
        );
    }

    public async Task<List<CourseSummaryResponse>> GetPopularCoursesAsync(int count)
    {
        var courses = await _courseRepository.GetPopularCoursesAsync(count);
        return courses.Select(MapToSummary).ToList();
    }

    public async Task<bool> DeleteCourseAsync(string courseId, long instructorId)
    {
        var course = await GetCourseForInstructor(courseId, instructorId);
        return await _courseRepository.DeleteAsync(course.Id);
    }

    public async Task<CourseResponse> AddModuleAsync(string courseId, long instructorId, AddModuleRequest request)
    {
        var course = await GetCourseForInstructor(courseId, instructorId);

        var module = new Module
        {
            Title = request.Title,
            Description = request.Description,
            OrderIndex = request.OrderIndex ?? course.Modules.Count
        };

        course.Modules.Add(module);
        course = await _courseRepository.UpdateAsync(course);
        return MapToResponse(course);
    }

    public async Task<CourseResponse> AddLessonAsync(string courseId, long instructorId, AddLessonRequest request)
    {
        var course = await GetCourseForInstructor(courseId, instructorId);
        var module = course.Modules.FirstOrDefault(m => m.Id == request.ModuleId)
            ?? throw new InvalidOperationException("Module not found");

        var lesson = new Lesson
        {
            Title = request.Title,
            Description = request.Description,
            Type = Enum.Parse<LessonType>(request.Type, true),
            Content = request.Content,
            DurationMinutes = request.DurationMinutes ?? 0,
            OrderIndex = request.OrderIndex ?? module.Lessons.Count,
            IsFree = request.IsFree ?? false
        };

        module.Lessons.Add(lesson);
        course.RecalculateStats();
        course = await _courseRepository.UpdateAsync(course);
        return MapToResponse(course);
    }

    public async Task<CourseResponse> PublishCourseAsync(string courseId, long instructorId)
    {
        var course = await GetCourseForInstructor(courseId, instructorId);

        if (course.Modules.Count == 0)
            throw new InvalidOperationException("Course must have at least one module");

        if (course.Modules.All(m => m.Lessons.Count == 0))
            throw new InvalidOperationException("Course must have at least one lesson");

        course.Status = CourseStatus.Published;
        course.PublishedAt = DateTime.UtcNow;
        course = await _courseRepository.UpdateAsync(course);

        _logger.LogInformation("Course {CourseId} published", courseId);
        return MapToResponse(course);
    }

    private async Task<Course> GetCourseForInstructor(string courseId, long instructorId)
    {
        var course = await _courseRepository.GetByIdAsync(courseId)
            ?? throw new InvalidOperationException("Course not found");

        if (course.InstructorId != instructorId)
            throw new UnauthorizedAccessException("Not authorized to modify this course");

        return course;
    }

    private static CourseResponse MapToResponse(Course course) => new(
        course.Id,
        course.Title,
        course.Description,
        course.ShortDescription,
        course.InstructorId,
        course.InstructorName,
        course.ThumbnailUrl,
        course.PreviewVideoUrl,
        course.Category.ToString(),
        course.Level.ToString(),
        course.Status.ToString(),
        course.Price,
        course.Currency,
        course.Tags,
        course.Objectives,
        course.Requirements,
        course.Modules.Select(m => new ModuleResponse(
            m.Id,
            m.Title,
            m.Description,
            m.OrderIndex,
            m.Lessons.Select(l => new LessonResponse(
                l.Id,
                l.Title,
                l.Description,
                l.Type.ToString(),
                l.VideoUrl,
                l.Content,
                l.DurationMinutes,
                l.OrderIndex,
                l.IsFree,
                l.Resources.Select(r => new LessonResourceResponse(r.Name, r.Url, r.Type)).ToList()
            )).ToList()
        )).ToList(),
        course.TotalEnrollments,
        course.AverageRating,
        course.ReviewCount,
        course.TotalDurationMinutes,
        course.TotalLessons,
        course.Slug,
        course.CreatedAt,
        course.UpdatedAt,
        course.PublishedAt
    );

    private static CourseSummaryResponse MapToSummary(Course course) => new(
        course.Id,
        course.Title,
        course.ShortDescription,
        course.InstructorName,
        course.ThumbnailUrl,
        course.Category.ToString(),
        course.Level.ToString(),
        course.Price,
        course.Currency,
        course.TotalEnrollments,
        course.AverageRating,
        course.ReviewCount,
        course.TotalDurationMinutes,
        course.TotalLessons,
        course.Slug
    );
}

public record PagedResult<T>(List<T> Items, long TotalCount, int Page, int PageSize)
{
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasNextPage => Page < TotalPages;
    public bool HasPreviousPage => Page > 1;
}
