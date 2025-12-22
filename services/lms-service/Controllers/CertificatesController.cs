using LmsService.DTOs;
using LmsService.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LmsService.Controllers;

[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
public class CertificatesController : ControllerBase
{
    private readonly ICertificateService _certificateService;
    private readonly IEnrollmentService _enrollmentService;
    private readonly ILogger<CertificatesController> _logger;

    public CertificatesController(
        ICertificateService certificateService,
        IEnrollmentService enrollmentService,
        ILogger<CertificatesController> logger)
    {
        _certificateService = certificateService;
        _enrollmentService = enrollmentService;
        _logger = logger;
    }

    /// <summary>
    /// Generate a certificate for a completed course enrollment
    /// </summary>
    [HttpPost("generate")]
    [Authorize]
    public async Task<ActionResult<CertificateResponse>> GenerateCertificate([FromBody] GenerateCertificateRequest request)
    {
        // Verify the enrollment belongs to the current user
        var enrollment = await _enrollmentService.GetEnrollmentAsync(request.EnrollmentId);
        if (enrollment == null)
            return NotFound("Enrollment not found");

        var currentUserId = GetCurrentUserId();
        if (enrollment.StudentId != currentUserId && !User.IsInRole("Admin"))
            return Forbid();

        try
        {
            var certificate = await _certificateService.GenerateCertificateAsync(request);
            return CreatedAtAction(nameof(GetCertificate), new { id = certificate.Id }, certificate);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Get certificate by ID
    /// </summary>
    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<CertificateResponse>> GetCertificate(string id)
    {
        var certificate = await _certificateService.GetCertificateAsync(id);
        if (certificate == null)
            return NotFound();

        // Verify ownership
        var currentUserId = GetCurrentUserId();
        if (certificate.StudentId != currentUserId && !User.IsInRole("Admin"))
            return Forbid();

        return Ok(certificate);
    }

    /// <summary>
    /// Verify a certificate by its number (public endpoint)
    /// </summary>
    [HttpGet("verify/{certificateNumber}")]
    [AllowAnonymous]
    public async Task<ActionResult<VerifyCertificateResponse>> VerifyCertificate(string certificateNumber)
    {
        var result = await _certificateService.VerifyCertificateAsync(certificateNumber);
        return Ok(result);
    }

    /// <summary>
    /// Get all certificates for current user
    /// </summary>
    [HttpGet("my")]
    [Authorize]
    public async Task<ActionResult<PagedResult<CertificateResponse>>> GetMyCertificates(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var studentId = GetCurrentUserId();
        var result = await _certificateService.GetStudentCertificatesAsync(studentId, page, pageSize);
        return Ok(result);
    }

    /// <summary>
    /// Revoke a certificate (Admin only)
    /// </summary>
    [HttpPost("{id}/revoke")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> RevokeCertificate(string id, [FromBody] RevokeCertificateRequest request)
    {
        var result = await _certificateService.RevokeCertificateAsync(id, request.Reason);
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

public record RevokeCertificateRequest(string Reason);
