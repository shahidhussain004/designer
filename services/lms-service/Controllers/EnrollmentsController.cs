using LmsService.DTOs;
using LmsService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LmsService.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize]
public class EnrollmentsController : ControllerBase
{
    private readonly IEnrollmentService _enrollmentService;
    private readonly ILogger<EnrollmentsController> _logger;

    public EnrollmentsController(IEnrollmentService enrollmentService, ILogger<EnrollmentsController> logger)
    {
        _enrollmentService = enrollmentService;
        _logger = logger;
    }

    /// <summary>
    /// Enroll current user in a course
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<EnrollmentResponse>> Enroll([FromBody] EnrollRequest request)
    {
        var studentId = GetCurrentUserId();
        var studentName = GetCurrentUserName();
        var studentEmail = GetCurrentUserEmail();

        try
        {
            var enrollment = await _enrollmentService.EnrollAsync(studentId, studentName, studentEmail, request);
            return CreatedAtAction(nameof(GetEnrollment), new { id = enrollment.Id }, enrollment);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Get enrollment by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<EnrollmentResponse>> GetEnrollment(string id)
    {
        var enrollment = await _enrollmentService.GetEnrollmentAsync(id);
        if (enrollment == null)
            return NotFound();

        // Verify the current user owns this enrollment
        var currentUserId = GetCurrentUserId();
        if (enrollment.StudentId != currentUserId && !User.IsInRole("Admin"))
            return Forbid();

        return Ok(enrollment);
    }

    /// <summary>
    /// Get current user's enrollment for a course
    /// </summary>
    [HttpGet("course/{courseId}")]
    public async Task<ActionResult<EnrollmentResponse>> GetMyEnrollment(string courseId)
    {
        var studentId = GetCurrentUserId();
        var enrollment = await _enrollmentService.GetEnrollmentByStudentAndCourseAsync(studentId, courseId);

        if (enrollment == null)
            return NotFound();

        return Ok(enrollment);
    }

    /// <summary>
    /// Get all enrollments for current user
    /// </summary>
    [HttpGet("my")]
    public async Task<ActionResult<PagedResult<EnrollmentResponse>>> GetMyEnrollments(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var studentId = GetCurrentUserId();
        var result = await _enrollmentService.GetStudentEnrollmentsAsync(studentId, page, pageSize);
        return Ok(result);
    }

    /// <summary>
    /// Update lesson progress
    /// </summary>
    [HttpPost("{enrollmentId}/progress")]
    public async Task<ActionResult<ProgressResponse>> UpdateProgress(
        string enrollmentId, [FromBody] UpdateProgressRequest request)
    {
        var studentId = GetCurrentUserId();
        var enrollment = await _enrollmentService.GetEnrollmentAsync(enrollmentId);
        if (enrollment == null)
            return NotFound();

        if (enrollment.StudentId != studentId)
            return Forbid();

        try
        {
            var progress = await _enrollmentService.UpdateProgressAsync(enrollmentId, studentId, request);
            return Ok(progress);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Get progress for an enrollment
    /// </summary>
    [HttpGet("{enrollmentId}/progress")]
    public async Task<ActionResult<ProgressResponse>> GetProgress(string enrollmentId)
    {
        var studentId = GetCurrentUserId();
        var enrollment = await _enrollmentService.GetEnrollmentAsync(enrollmentId);
        if (enrollment == null)
            return NotFound();

        if (enrollment.StudentId != studentId && !User.IsInRole("Admin"))
            return Forbid();

        var progress = await _enrollmentService.GetProgressAsync(enrollmentId, studentId);
        return Ok(progress);
    }

    /// <summary>
    /// Mark enrollment as completed
    /// </summary>
    [HttpPost("{enrollmentId}/complete")]
    public async Task<ActionResult<EnrollmentResponse>> CompleteEnrollment(string enrollmentId)
    {
        var studentId = GetCurrentUserId();
        var enrollment = await _enrollmentService.GetEnrollmentAsync(enrollmentId);
        if (enrollment == null)
            return NotFound();

        if (enrollment.StudentId != studentId)
            return Forbid();

        try
        {
            var updated = await _enrollmentService.CompleteEnrollmentAsync(enrollmentId, studentId);
            return Ok(updated);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Submit a review for the course
    /// </summary>
    [HttpPost("{enrollmentId}/review")]
    public async Task<ActionResult<ReviewResponse>> SubmitReview(string enrollmentId, [FromBody] SubmitReviewRequest request)
    {
        var studentId = GetCurrentUserId();
        var enrollment = await _enrollmentService.GetEnrollmentAsync(enrollmentId);
        if (enrollment == null)
            return NotFound();

        if (enrollment.StudentId != studentId)
            return Forbid();

        try
        {
            var review = await _enrollmentService.SubmitReviewAsync(enrollmentId, studentId, request);
            return Ok(review);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Get reviews for a course
    /// </summary>
    [HttpGet("course/{courseId}/reviews")]
    [AllowAnonymous]
    public async Task<ActionResult<PagedResult<ReviewResponse>>> GetCourseReviews(
        string courseId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = await _enrollmentService.GetCourseReviewsAsync(courseId, page, pageSize);
        return Ok(result);
    }

    private long GetCurrentUserId()
    {
        var claim = User.FindFirst("sub") ?? User.FindFirst("userId");
        return claim != null ? long.Parse(claim.Value) : 0;
    }

    private string GetCurrentUserName()
    {
        return User.FindFirst("name")?.Value ?? "Unknown";
    }

    private string GetCurrentUserEmail()
    {
        return User.FindFirst("email")?.Value ?? "";
    }
}
