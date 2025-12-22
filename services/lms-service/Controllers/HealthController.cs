using Microsoft.AspNetCore.Mvc;

namespace LmsService.Controllers;

[ApiController]
[Route("api/[controller]")]
public class HealthController : ControllerBase
{
    private readonly ILogger<HealthController> _logger;

    public HealthController(ILogger<HealthController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Health check endpoint
    /// </summary>
    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            status = "healthy",
            service = "lms-service",
            timestamp = DateTime.UtcNow
        });
    }

    /// <summary>
    /// Readiness check endpoint
    /// </summary>
    [HttpGet("ready")]
    public IActionResult Ready()
    {
        // Could add dependency checks here (MongoDB, Redis, etc.)
        return Ok(new
        {
            status = "ready",
            service = "lms-service",
            timestamp = DateTime.UtcNow
        });
    }

    /// <summary>
    /// Liveness check endpoint
    /// </summary>
    [HttpGet("live")]
    public IActionResult Live()
    {
        return Ok(new
        {
            status = "alive",
            service = "lms-service",
            timestamp = DateTime.UtcNow
        });
    }
}
