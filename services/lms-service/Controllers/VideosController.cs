using LmsService.DTOs;
using LmsService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LmsService.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Authorize]
public class VideosController : ControllerBase
{
    private readonly IVideoStreamingService _videoStreamingService;
    private readonly ICourseService _courseService;
    private readonly IEnrollmentService _enrollmentService;
    private readonly ILogger<VideosController> _logger;

    public VideosController(
        IVideoStreamingService videoStreamingService,
        ICourseService courseService,
        IEnrollmentService enrollmentService,
        ILogger<VideosController> logger)
    {
        _videoStreamingService = videoStreamingService;
        _courseService = courseService;
        _enrollmentService = enrollmentService;
        _logger = logger;
    }

    /// <summary>
    /// Get pre-signed upload URL for video upload (Instructor only)
    /// </summary>
    [HttpPost("upload-url")]
    [Authorize(Roles = "Instructor,Admin")]
    public async Task<ActionResult<VideoUploadResponse>> GetUploadUrl([FromBody] VideoUploadRequest request)
    {
        // Verify the instructor owns this course
        var course = await _courseService.GetCourseAsync(request.CourseId);
        if (course == null)
            return NotFound("Course not found");

        var currentUserId = GetCurrentUserId();
        if (course.InstructorId != currentUserId && !User.IsInRole("Admin"))
            return Forbid();

        try
        {
            var result = await _videoStreamingService.GetUploadUrlAsync(request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Get streaming URL for a video (Enrolled students only)
    /// </summary>
    [HttpGet("stream/{courseId}/{lessonId}")]
    public async Task<ActionResult<VideoStreamResponse>> GetStreamingUrl(string courseId, string lessonId)
    {
        var currentUserId = GetCurrentUserId();
        var course = await _courseService.GetCourseAsync(courseId);
        if (course == null)
            return NotFound("Course not found");

        // Check if user is enrolled or is the instructor
        if (course.InstructorId != currentUserId)
        {
            var enrollment = await _enrollmentService.GetEnrollmentByStudentAndCourseAsync(currentUserId, courseId);
            if (enrollment == null)
                return Forbid("Not enrolled in this course");
        }

        // Find the lesson in modules
        LessonResponse? lesson = null;
        if (course.Modules != null)
        {
            foreach (var module in course.Modules)
            {
                if (module.Lessons != null)
                {
                    lesson = module.Lessons.FirstOrDefault(l => l.Id == lessonId);
                    if (lesson != null) break;
                }
            }
        }

        if (lesson == null)
            return NotFound("Lesson not found");

        if (string.IsNullOrEmpty(lesson.VideoUrl))
            return NotFound("No video available for this lesson");

        var streamUrl = await _videoStreamingService.GetStreamingUrlAsync(lesson.VideoUrl);

        return Ok(new VideoStreamResponse(
            streamUrl,
            lesson.DurationMinutes,
            lesson.Title
        ));
    }

    /// <summary>
    /// Delete a video (Instructor only)
    /// </summary>
    [HttpDelete("{videoKey}")]
    [Authorize(Roles = "Instructor,Admin")]
    public async Task<IActionResult> DeleteVideo(string videoKey)
    {
        var result = await _videoStreamingService.DeleteVideoAsync(videoKey);
        if (!result)
            return NotFound();

        return NoContent();
    }

    private long GetCurrentUserId()
    {
        var claim = User.FindFirst("sub") ?? User.FindFirst("userId");
        return claim != null ? long.Parse(claim.Value) : 0;
    }
}

public record VideoStreamResponse(string StreamUrl, int DurationMinutes, string Title);
