using LmsService.DTOs;
using LmsService.Models;
using LmsService.Repositories;

namespace LmsService.Services;

public interface IEnrollmentService
{
    Task<EnrollmentResponse> EnrollAsync(long studentId, string studentName, string studentEmail, EnrollRequest request);
    Task<EnrollmentResponse?> GetEnrollmentAsync(string enrollmentId);
    Task<EnrollmentResponse?> GetEnrollmentByStudentAndCourseAsync(long studentId, string courseId);
    Task<PagedResult<EnrollmentResponse>> GetStudentEnrollmentsAsync(long studentId, int page, int pageSize);
    Task<ProgressResponse> UpdateProgressAsync(string enrollmentId, long studentId, UpdateProgressRequest request);
    Task<ProgressResponse> GetProgressAsync(string enrollmentId, long studentId);
    Task<EnrollmentResponse> CompleteEnrollmentAsync(string enrollmentId, long studentId);
    Task<ReviewResponse> SubmitReviewAsync(string enrollmentId, long studentId, SubmitReviewRequest request);
    Task<PagedResult<ReviewResponse>> GetCourseReviewsAsync(string courseId, int page, int pageSize);
}

public class EnrollmentService : IEnrollmentService
{
    private readonly IEnrollmentRepository _enrollmentRepository;
    private readonly ICourseRepository _courseRepository;
    private readonly ICertificateService _certificateService;
    private readonly ILogger<EnrollmentService> _logger;

    public EnrollmentService(
        IEnrollmentRepository enrollmentRepository,
        ICourseRepository courseRepository,
        ICertificateService certificateService,
        ILogger<EnrollmentService> logger)
    {
        _enrollmentRepository = enrollmentRepository;
        _courseRepository = courseRepository;
        _certificateService = certificateService;
        _logger = logger;
    }

    public async Task<EnrollmentResponse> EnrollAsync(long studentId, string studentName, string studentEmail, EnrollRequest request)
    {
        var course = await _courseRepository.GetByIdAsync(request.CourseId)
            ?? throw new InvalidOperationException("Course not found");

        if (course.Status != CourseStatus.Published)
            throw new InvalidOperationException("Course is not available for enrollment");

        var existing = await _enrollmentRepository.GetByStudentAndCourseAsync(studentId, request.CourseId);
        if (existing != null)
            throw new InvalidOperationException("Already enrolled in this course");

        var enrollment = new Enrollment
        {
            CourseId = request.CourseId,
            StudentId = studentId,
            StudentName = studentName,
            StudentEmail = studentEmail,
            Status = EnrollmentStatus.Active,
            PaymentId = request.PaymentId
        };

        enrollment = await _enrollmentRepository.CreateAsync(enrollment);
        await _courseRepository.IncrementEnrollmentCountAsync(request.CourseId);

        _logger.LogInformation("Student {StudentId} enrolled in course {CourseId}", studentId, request.CourseId);

        return await MapToResponse(enrollment, course.Title);
    }

    public async Task<EnrollmentResponse?> GetEnrollmentAsync(string enrollmentId)
    {
        var enrollment = await _enrollmentRepository.GetByIdAsync(enrollmentId);
        if (enrollment == null) return null;

        var course = await _courseRepository.GetByIdAsync(enrollment.CourseId);
        return await MapToResponse(enrollment, course?.Title ?? "Unknown");
    }

    public async Task<EnrollmentResponse?> GetEnrollmentByStudentAndCourseAsync(long studentId, string courseId)
    {
        var enrollment = await _enrollmentRepository.GetByStudentAndCourseAsync(studentId, courseId);
        if (enrollment == null) return null;

        var course = await _courseRepository.GetByIdAsync(enrollment.CourseId);
        return await MapToResponse(enrollment, course?.Title ?? "Unknown");
    }

    public async Task<PagedResult<EnrollmentResponse>> GetStudentEnrollmentsAsync(long studentId, int page, int pageSize)
    {
        var enrollments = await _enrollmentRepository.GetByStudentIdAsync(studentId, (page - 1) * pageSize, pageSize);
        var responses = new List<EnrollmentResponse>();

        foreach (var enrollment in enrollments)
        {
            var course = await _courseRepository.GetByIdAsync(enrollment.CourseId);
            responses.Add(await MapToResponse(enrollment, course?.Title ?? "Unknown"));
        }

        return new PagedResult<EnrollmentResponse>(responses, responses.Count, page, pageSize);
    }

    public async Task<ProgressResponse> UpdateProgressAsync(string enrollmentId, long studentId, UpdateProgressRequest request)
    {
        var enrollment = await GetEnrollmentForStudent(enrollmentId, studentId);
        var course = await _courseRepository.GetByIdAsync(enrollment.CourseId)
            ?? throw new InvalidOperationException("Course not found");

        var lessonProgress = enrollment.LessonProgress.FirstOrDefault(lp => lp.LessonId == request.LessonId);
        if (lessonProgress == null)
        {
            lessonProgress = new LessonProgress { LessonId = request.LessonId };
            enrollment.LessonProgress.Add(lessonProgress);
        }

        if (request.WatchedSeconds.HasValue)
            lessonProgress.WatchedSeconds = request.WatchedSeconds.Value;

        if (request.Completed == true)
        {
            lessonProgress.Completed = true;
            if (!enrollment.CompletedLessons.Contains(request.LessonId))
                enrollment.CompletedLessons.Add(request.LessonId);
        }

        lessonProgress.LastWatchedAt = DateTime.UtcNow;
        enrollment.LastAccessedAt = DateTime.UtcNow;

        // Calculate progress percentage
        enrollment.ProgressPercentage = (double)enrollment.CompletedLessons.Count / course.TotalLessons * 100;

        await _enrollmentRepository.UpdateAsync(enrollment);

        return new ProgressResponse(
            enrollment.Id,
            enrollment.CourseId,
            enrollment.ProgressPercentage,
            enrollment.CompletedLessons.Count,
            course.TotalLessons,
            enrollment.LessonProgress.Select(lp => new LessonProgressResponse(
                lp.LessonId,
                lp.WatchedSeconds,
                lp.Completed,
                lp.LastWatchedAt
            )).ToList(),
            enrollment.LastAccessedAt
        );
    }

    public async Task<ProgressResponse> GetProgressAsync(string enrollmentId, long studentId)
    {
        var enrollment = await GetEnrollmentForStudent(enrollmentId, studentId);
        var course = await _courseRepository.GetByIdAsync(enrollment.CourseId)
            ?? throw new InvalidOperationException("Course not found");

        return new ProgressResponse(
            enrollment.Id,
            enrollment.CourseId,
            enrollment.ProgressPercentage,
            enrollment.CompletedLessons.Count,
            course.TotalLessons,
            enrollment.LessonProgress.Select(lp => new LessonProgressResponse(
                lp.LessonId,
                lp.WatchedSeconds,
                lp.Completed,
                lp.LastWatchedAt
            )).ToList(),
            enrollment.LastAccessedAt
        );
    }

    public async Task<EnrollmentResponse> CompleteEnrollmentAsync(string enrollmentId, long studentId)
    {
        var enrollment = await GetEnrollmentForStudent(enrollmentId, studentId);
        var course = await _courseRepository.GetByIdAsync(enrollment.CourseId)
            ?? throw new InvalidOperationException("Course not found");

        if (enrollment.ProgressPercentage < 100)
            throw new InvalidOperationException("Course not fully completed");

        enrollment.Status = EnrollmentStatus.Completed;
        enrollment.CompletedAt = DateTime.UtcNow;

        await _enrollmentRepository.UpdateAsync(enrollment);

        // Generate certificate
        await _certificateService.GenerateCertificateAsync(new GenerateCertificateRequest(enrollmentId));

        _logger.LogInformation("Enrollment {EnrollmentId} completed for student {StudentId}", enrollmentId, studentId);

        return await MapToResponse(enrollment, course.Title);
    }

    public async Task<ReviewResponse> SubmitReviewAsync(string enrollmentId, long studentId, SubmitReviewRequest request)
    {
        var enrollment = await GetEnrollmentForStudent(enrollmentId, studentId);

        if (request.Rating < 1 || request.Rating > 5)
            throw new InvalidOperationException("Rating must be between 1 and 5");

        enrollment.Rating = request.Rating;
        enrollment.Review = request.Review;
        enrollment.ReviewedAt = DateTime.UtcNow;

        await _enrollmentRepository.UpdateAsync(enrollment);

        // Update course rating
        var avgRating = await _enrollmentRepository.GetAverageRatingAsync(enrollment.CourseId);
        var reviewCount = await _enrollmentRepository.GetReviewCountAsync(enrollment.CourseId);
        await _courseRepository.UpdateRatingAsync(enrollment.CourseId, avgRating, reviewCount);

        return new ReviewResponse(
            enrollment.Id,
            enrollment.CourseId,
            enrollment.StudentId,
            enrollment.StudentName,
            enrollment.Rating.Value,
            enrollment.Review,
            enrollment.ReviewedAt.Value
        );
    }

    public async Task<PagedResult<ReviewResponse>> GetCourseReviewsAsync(string courseId, int page, int pageSize)
    {
        var reviews = await _enrollmentRepository.GetReviewsAsync(courseId, (page - 1) * pageSize, pageSize);
        var reviewCount = await _enrollmentRepository.GetReviewCountAsync(courseId);

        return new PagedResult<ReviewResponse>(
            reviews.Select(e => new ReviewResponse(
                e.Id,
                e.CourseId,
                e.StudentId,
                e.StudentName,
                e.Rating!.Value,
                e.Review,
                e.ReviewedAt!.Value
            )).ToList(),
            reviewCount,
            page,
            pageSize
        );
    }

    private async Task<Enrollment> GetEnrollmentForStudent(string enrollmentId, long studentId)
    {
        var enrollment = await _enrollmentRepository.GetByIdAsync(enrollmentId)
            ?? throw new InvalidOperationException("Enrollment not found");

        if (enrollment.StudentId != studentId)
            throw new UnauthorizedAccessException("Not authorized to access this enrollment");

        return enrollment;
    }

    private Task<EnrollmentResponse> MapToResponse(Enrollment enrollment, string courseTitle)
    {
        return Task.FromResult(new EnrollmentResponse(
            enrollment.Id,
            enrollment.CourseId,
            courseTitle,
            enrollment.StudentId,
            enrollment.StudentName,
            enrollment.Status.ToString(),
            enrollment.ProgressPercentage,
            enrollment.CompletedLessons,
            enrollment.EnrolledAt,
            enrollment.LastAccessedAt,
            enrollment.CompletedAt,
            enrollment.CertificateId,
            enrollment.Rating,
            enrollment.Review
        ));
    }
}
