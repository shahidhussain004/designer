using LmsService.DTOs;
using LmsService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LmsService.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class CoursesController : ControllerBase
{
    private readonly ICourseService _courseService;
    private readonly ILogger<CoursesController> _logger;

    public CoursesController(ICourseService courseService, ILogger<CoursesController> logger)
    {
        _courseService = courseService;
        _logger = logger;
    }

    /// <summary>
    /// Search courses with filters
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<PagedResult<CourseSummaryResponse>>> GetCourses(
        [FromQuery] string? search,
        [FromQuery] string? category,
        [FromQuery] string? level,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        _logger.LogInformation("GetCourses called with: search={Search}, category={Category}, level={Level}, page={Page}, pageSize={PageSize}", 
            search, category, level, page, pageSize);
        var result = await _courseService.SearchCoursesAsync(search, category, level, page, pageSize);
        _logger.LogInformation("GetCourses result: totalCount={TotalCount}, items={ItemCount}", result.TotalCount, result.Items.Count);
        return Ok(result);
    }

    /// <summary>
    /// Debug endpoint to get all courses without filters
    /// </summary>
    [HttpGet("debug/all")]
    public async Task<ActionResult> GetAllCoursesDebug()
    {
        try
        {
            _logger.LogInformation("Debug: Getting all courses without filter");
            var result = await _courseService.GetAllCoursesDebugAsync();
            _logger.LogInformation("Debug: Found {Count} courses", result.Count);
            return Ok(new { totalCount = result.Count, courses = result });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Debug endpoint error");
            return StatusCode(500, new { error = ex.Message });
        }
    }

    /// <summary>
    /// Get course by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<CourseResponse>> GetCourse(string id)
    {
        var course = await _courseService.GetCourseAsync(id);
        if (course == null)
            return NotFound();

        return Ok(course);
    }

    /// <summary>
    /// Get course by slug
    /// </summary>
    [HttpGet("slug/{slug}")]
    public async Task<ActionResult<CourseResponse>> GetCourseBySlug(string slug)
    {
        var course = await _courseService.GetCourseBySlugAsync(slug);
        if (course == null)
            return NotFound();

        return Ok(course);
    }

    /// <summary>
    /// Create a new course (Instructor only)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Instructor,Admin")]
    public async Task<ActionResult<CourseResponse>> CreateCourse([FromBody] CreateCourseRequest request)
    {
        var instructorId = GetCurrentUserId();
        var instructorName = GetCurrentUserName();

        var course = await _courseService.CreateCourseAsync(instructorId, instructorName, request);
        return CreatedAtAction(nameof(GetCourse), new { id = course.Id }, course);
    }

    /// <summary>
    /// Update course details
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "Instructor,Admin")]
    public async Task<ActionResult<CourseResponse>> UpdateCourse(string id, [FromBody] UpdateCourseRequest request)
    {
        var instructorId = GetCurrentUserId();
        var course = await _courseService.UpdateCourseAsync(id, instructorId, request);
        return Ok(course);
    }

    /// <summary>
    /// Delete a course
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Instructor,Admin")]
    public async Task<IActionResult> DeleteCourse(string id)
    {
        var instructorId = GetCurrentUserId();
        var result = await _courseService.DeleteCourseAsync(id, instructorId);
        if (!result)
            return NotFound();

        return NoContent();
    }

    /// <summary>
    /// Add a module to a course
    /// </summary>
    [HttpPost("{courseId}/modules")]
    [Authorize(Roles = "Instructor,Admin")]
    public async Task<ActionResult<CourseResponse>> AddModule(string courseId, [FromBody] AddModuleRequest request)
    {
        var instructorId = GetCurrentUserId();
        var course = await _courseService.AddModuleAsync(courseId, instructorId, request);
        return Ok(course);
    }

    /// <summary>
    /// Add a lesson to a module
    /// </summary>
    [HttpPost("{courseId}/lessons")]
    [Authorize(Roles = "Instructor,Admin")]
    public async Task<ActionResult<CourseResponse>> AddLesson(string courseId, [FromBody] AddLessonRequest request)
    {
        var instructorId = GetCurrentUserId();
        var course = await _courseService.AddLessonAsync(courseId, instructorId, request);
        return Ok(course);
    }

    /// <summary>
    /// Publish a course (make it available for enrollment)
    /// </summary>
    [HttpPost("{id}/publish")]
    [Authorize(Roles = "Instructor,Admin")]
    public async Task<ActionResult<CourseResponse>> PublishCourse(string id)
    {
        var instructorId = GetCurrentUserId();
        var course = await _courseService.PublishCourseAsync(id, instructorId);
        return Ok(course);
    }

    /// <summary>
    /// Get courses by instructor
    /// </summary>
    [HttpGet("instructor/{instructorId}")]
    public async Task<ActionResult<PagedResult<CourseSummaryResponse>>> GetInstructorCourses(
        long instructorId,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var result = await _courseService.GetCoursesByInstructorAsync(instructorId, page, pageSize);
        return Ok(result);
    }

    /// <summary>
    /// Get popular courses
    /// </summary>
    [HttpGet("popular")]
    public async Task<ActionResult<List<CourseSummaryResponse>>> GetPopularCourses([FromQuery] int count = 10)
    {
        var courses = await _courseService.GetPopularCoursesAsync(count);
        return Ok(courses);
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
}
