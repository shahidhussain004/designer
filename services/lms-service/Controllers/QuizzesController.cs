using LmsService.DTOs;
using LmsService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LmsService.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class QuizzesController : ControllerBase
{
    private readonly IQuizService _quizService;
    private readonly IEnrollmentService _enrollmentService;
    private readonly ILogger<QuizzesController> _logger;

    public QuizzesController(
        IQuizService quizService,
        IEnrollmentService enrollmentService,
        ILogger<QuizzesController> logger)
    {
        _quizService = quizService;
        _enrollmentService = enrollmentService;
        _logger = logger;
    }

    /// <summary>
    /// Get quiz by ID (with answers - for instructors)
    /// </summary>
    [HttpGet("{id}")]
    [Authorize(Roles = "Instructor,Admin")]
    public async Task<ActionResult<QuizResponse>> GetQuiz(string id)
    {
        var quiz = await _quizService.GetQuizAsync(id, includeAnswers: true);
        if (quiz == null)
            return NotFound();

        return Ok(quiz);
    }

    /// <summary>
    /// Get quiz for taking (without correct answers)
    /// </summary>
    [HttpGet("{id}/take")]
    [Authorize]
    public async Task<ActionResult<QuizResponse>> GetQuizForTaking(string id)
    {
        var quiz = await _quizService.GetQuizAsync(id, includeAnswers: false);
        if (quiz == null)
            return NotFound();

        return Ok(quiz);
    }

    /// <summary>
    /// Get quiz for a lesson
    /// </summary>
    [HttpGet("lesson/{lessonId}")]
    [Authorize]
    public async Task<ActionResult<QuizResponse>> GetLessonQuiz(string lessonId)
    {
        var quiz = await _quizService.GetQuizByLessonAsync(lessonId, includeAnswers: false);
        if (quiz == null)
            return NotFound();

        return Ok(quiz);
    }

    /// <summary>
    /// Get all quizzes for a course
    /// </summary>
    [HttpGet("course/{courseId}")]
    [Authorize]
    public async Task<ActionResult<List<QuizResponse>>> GetCourseQuizzes(string courseId)
    {
        var quizzes = await _quizService.GetQuizzesByCourseAsync(courseId);
        return Ok(quizzes);
    }

    /// <summary>
    /// Create a new quiz (Instructor only)
    /// </summary>
    [HttpPost("course/{courseId}")]
    [Authorize(Roles = "Instructor,Admin")]
    public async Task<ActionResult<QuizResponse>> CreateQuiz(string courseId, [FromBody] CreateQuizRequest request)
    {
        var instructorId = GetCurrentUserId();

        try
        {
            var quiz = await _quizService.CreateQuizAsync(courseId, instructorId, request);
            return CreatedAtAction(nameof(GetQuiz), new { id = quiz.Id }, quiz);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Delete a quiz
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "Instructor,Admin")]
    public async Task<IActionResult> DeleteQuiz(string id)
    {
        var instructorId = GetCurrentUserId();
        var result = await _quizService.DeleteQuizAsync(id, instructorId);
        if (!result)
            return NotFound();

        return NoContent();
    }

    /// <summary>
    /// Start a quiz attempt
    /// </summary>
    [HttpPost("{quizId}/start")]
    [Authorize]
    public async Task<ActionResult<QuizResultResponse>> StartQuizAttempt(string quizId, [FromQuery] string? enrollmentId)
    {
        var studentId = GetCurrentUserId();
        var quiz = await _quizService.GetQuizAsync(quizId, includeAnswers: false);
        if (quiz == null)
            return NotFound("Quiz not found");

        // Return the quiz in a format suitable for starting an attempt
        return Ok(new { quizId = quizId, studentId = studentId, message = "Quiz ready to take" });
    }

    /// <summary>
    /// Submit quiz answers
    /// </summary>
    [HttpPost("{quizId}/submit")]
    [Authorize]
    public async Task<ActionResult<QuizResultResponse>> SubmitQuiz(string quizId, [FromBody] SubmitQuizRequest request)
    {
        var studentId = GetCurrentUserId();

        // Get the quiz to find the course
        var quiz = await _quizService.GetQuizAsync(quizId, includeAnswers: false);
        if (quiz == null)
            return NotFound("Quiz not found");

        // Find the enrollment
        var enrollment = await _enrollmentService.GetEnrollmentByStudentAndCourseAsync(studentId, quiz.CourseId);
        if (enrollment == null)
            return BadRequest("Not enrolled in this course");

        try
        {
            var result = await _quizService.SubmitQuizAsync(quizId, studentId, enrollment.Id, request);
            return Ok(result);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Get student's quiz attempts
    /// </summary>
    [HttpGet("{quizId}/attempts")]
    [Authorize]
    public async Task<ActionResult<List<QuizResultResponse>>> GetMyAttempts(string quizId)
    {
        var studentId = GetCurrentUserId();
        var attempts = await _quizService.GetStudentAttemptsAsync(studentId, quizId);
        return Ok(attempts);
    }

    private long GetCurrentUserId()
    {
        var claim = User.FindFirst("sub") ?? User.FindFirst("userId");
        return claim != null ? long.Parse(claim.Value) : 0;
    }
}
