using LmsService.Configuration;
using LmsService.DTOs;
using LmsService.Models;
using LmsService.Repositories;
using Microsoft.Extensions.Options;
using QuestPDF.Fluent;
using QuestPDF.Helpers;
using QuestPDF.Infrastructure;

namespace LmsService.Services;

public interface ICertificateService
{
    Task<CertificateResponse> GenerateCertificateAsync(GenerateCertificateRequest request);
    Task<CertificateResponse?> GetCertificateAsync(string certificateId);
    Task<VerifyCertificateResponse> VerifyCertificateAsync(string certificateNumber);
    Task<PagedResult<CertificateResponse>> GetStudentCertificatesAsync(long studentId, int page, int pageSize);
    Task<bool> RevokeCertificateAsync(string certificateId, string reason);
}

public class CertificateService : ICertificateService
{
    private readonly ICertificateRepository _certificateRepository;
    private readonly IEnrollmentRepository _enrollmentRepository;
    private readonly ICourseRepository _courseRepository;
    private readonly IVideoStreamingService _videoStreamingService;
    private readonly CertificateSettings _settings;
    private readonly ILogger<CertificateService> _logger;

    public CertificateService(
        ICertificateRepository certificateRepository,
        IEnrollmentRepository enrollmentRepository,
        ICourseRepository courseRepository,
        IVideoStreamingService videoStreamingService,
        IOptions<CertificateSettings> settings,
        ILogger<CertificateService> logger)
    {
        _certificateRepository = certificateRepository;
        _enrollmentRepository = enrollmentRepository;
        _courseRepository = courseRepository;
        _videoStreamingService = videoStreamingService;
        _settings = settings.Value;
        _logger = logger;

        // Configure QuestPDF license (Community license for open source)
        QuestPDF.Settings.License = LicenseType.Community;
    }

    public async Task<CertificateResponse> GenerateCertificateAsync(GenerateCertificateRequest request)
    {
        var enrollment = await _enrollmentRepository.GetByIdAsync(request.EnrollmentId)
            ?? throw new InvalidOperationException("Enrollment not found");

        if (enrollment.Status != EnrollmentStatus.Completed)
            throw new InvalidOperationException("Course not completed");

        // Check if certificate already exists
        var existing = await _certificateRepository.GetByEnrollmentIdAsync(request.EnrollmentId);
        if (existing != null)
            return MapToResponse(existing);

        var course = await _courseRepository.GetByIdAsync(enrollment.CourseId)
            ?? throw new InvalidOperationException("Course not found");

        var certificateNumber = Certificate.GenerateCertificateNumber();
        var verificationUrl = $"{_settings.BaseVerificationUrl}/{certificateNumber}";

        var certificate = new Certificate
        {
            CertificateNumber = certificateNumber,
            EnrollmentId = enrollment.Id,
            CourseId = course.Id,
            CourseTitle = course.Title,
            StudentId = enrollment.StudentId,
            StudentName = enrollment.StudentName,
            InstructorName = course.InstructorName,
            CompletedAt = enrollment.CompletedAt ?? DateTime.UtcNow,
            VerificationUrl = verificationUrl,
            Skills = course.Tags,
            TotalHours = course.TotalDurationMinutes / 60.0,
            FinalScore = CalculateFinalScore(enrollment)
        };

        if (_settings.ExpirationYears > 0)
            certificate.ExpiresAt = DateTime.UtcNow.AddYears(_settings.ExpirationYears);

        // Generate PDF
        var pdfBytes = GenerateCertificatePdf(certificate);
        var pdfKey = $"certificates/{certificate.CertificateNumber}.pdf";

        // Upload to S3
        var uploadResult = await _videoStreamingService.UploadCertificatePdfAsync(pdfBytes, pdfKey);
        certificate.PdfUrl = uploadResult.StreamUrl;
        certificate.PdfKey = pdfKey;

        certificate = await _certificateRepository.CreateAsync(certificate);

        // Update enrollment with certificate ID
        enrollment.CertificateId = certificate.Id;
        await _enrollmentRepository.UpdateAsync(enrollment);

        _logger.LogInformation("Certificate {CertificateNumber} generated for student {StudentId}",
            certificateNumber, enrollment.StudentId);

        return MapToResponse(certificate);
    }

    public async Task<CertificateResponse?> GetCertificateAsync(string certificateId)
    {
        var certificate = await _certificateRepository.GetByIdAsync(certificateId);
        return certificate != null ? MapToResponse(certificate) : null;
    }

    public async Task<VerifyCertificateResponse> VerifyCertificateAsync(string certificateNumber)
    {
        var certificate = await _certificateRepository.GetByCertificateNumberAsync(certificateNumber);

        if (certificate == null)
        {
            return new VerifyCertificateResponse(
                false, null, null, null, null, null, null, null, null,
                "Certificate not found"
            );
        }

        if (certificate.IsRevoked)
        {
            return new VerifyCertificateResponse(
                false, certificate.CertificateNumber, certificate.StudentName,
                certificate.CourseTitle, certificate.InstructorName,
                certificate.IssuedAt, certificate.CompletedAt,
                certificate.TotalHours, certificate.Skills,
                $"Certificate has been revoked: {certificate.RevokedReason}"
            );
        }

        if (certificate.ExpiresAt.HasValue && certificate.ExpiresAt.Value < DateTime.UtcNow)
        {
            return new VerifyCertificateResponse(
                false, certificate.CertificateNumber, certificate.StudentName,
                certificate.CourseTitle, certificate.InstructorName,
                certificate.IssuedAt, certificate.CompletedAt,
                certificate.TotalHours, certificate.Skills,
                "Certificate has expired"
            );
        }

        return new VerifyCertificateResponse(
            true, certificate.CertificateNumber, certificate.StudentName,
            certificate.CourseTitle, certificate.InstructorName,
            certificate.IssuedAt, certificate.CompletedAt,
            certificate.TotalHours, certificate.Skills,
            "Certificate is valid"
        );
    }

    public async Task<PagedResult<CertificateResponse>> GetStudentCertificatesAsync(long studentId, int page, int pageSize)
    {
        var certificates = await _certificateRepository.GetByStudentIdAsync(studentId, (page - 1) * pageSize, pageSize);
        return new PagedResult<CertificateResponse>(
            certificates.Select(MapToResponse).ToList(),
            certificates.Count,
            page,
            pageSize
        );
    }

    public async Task<bool> RevokeCertificateAsync(string certificateId, string reason)
    {
        return await _certificateRepository.RevokeAsync(certificateId, reason);
    }

    private static double? CalculateFinalScore(Enrollment enrollment)
    {
        if (enrollment.QuizAttempts.Count == 0) return null;

        // Get best score for each quiz
        var bestScores = enrollment.QuizAttempts
            .GroupBy(a => a.QuizId)
            .Select(g => g.Max(a => a.Score))
            .ToList();

        return bestScores.Average();
    }

    private byte[] GenerateCertificatePdf(Certificate certificate)
    {
        var document = Document.Create(container =>
        {
            container.Page(page =>
            {
                page.Size(PageSizes.A4.Landscape());
                page.Margin(50);
                page.DefaultTextStyle(x => x.FontFamily("Arial"));

                page.Content().Column(column =>
                {
                    column.Spacing(20);

                    // Header
                    column.Item().AlignCenter().Text(_settings.CompanyName)
                        .FontSize(16).SemiBold().FontColor(Colors.Grey.Darken2);

                    // Title
                    column.Item().AlignCenter().PaddingTop(30).Text("Certificate of Completion")
                        .FontSize(36).Bold().FontColor(Colors.Blue.Darken2);

                    // Subtitle
                    column.Item().AlignCenter().PaddingTop(10).Text("This is to certify that")
                        .FontSize(14).FontColor(Colors.Grey.Darken1);

                    // Student Name
                    column.Item().AlignCenter().PaddingTop(20).Text(certificate.StudentName)
                        .FontSize(28).Bold().FontColor(Colors.Black);

                    // Course completion text
                    column.Item().AlignCenter().PaddingTop(20).Text("has successfully completed the course")
                        .FontSize(14).FontColor(Colors.Grey.Darken1);

                    // Course Title
                    column.Item().AlignCenter().PaddingTop(10).Text(certificate.CourseTitle)
                        .FontSize(22).Bold().FontColor(Colors.Blue.Darken2);

                    // Details
                    column.Item().AlignCenter().PaddingTop(20).Text(text =>
                    {
                        text.Span($"Total Duration: {certificate.TotalHours:F1} hours").FontSize(12);
                        if (certificate.FinalScore.HasValue)
                        {
                            text.Span($"  |  Final Score: {certificate.FinalScore:F1}%").FontSize(12);
                        }
                    });

                    // Date and Instructor
                    column.Item().PaddingTop(40).Row(row =>
                    {
                        row.RelativeItem().Column(col =>
                        {
                            col.Item().Text($"Completion Date: {certificate.CompletedAt:MMMM dd, yyyy}")
                                .FontSize(12);
                            col.Item().Text($"Certificate #: {certificate.CertificateNumber}")
                                .FontSize(10).FontColor(Colors.Grey.Medium);
                        });

                        row.RelativeItem().AlignRight().Column(col =>
                        {
                            col.Item().AlignRight().Text("Instructor")
                                .FontSize(10).FontColor(Colors.Grey.Medium);
                            col.Item().AlignRight().Text(certificate.InstructorName)
                                .FontSize(14).SemiBold();
                        });
                    });

                    // Skills
                    if (certificate.Skills.Count > 0)
                    {
                        column.Item().PaddingTop(20).Text($"Skills: {string.Join(", ", certificate.Skills)}")
                            .FontSize(10).FontColor(Colors.Grey.Darken1);
                    }

                    // Verification URL
                    column.Item().AlignCenter().PaddingTop(20).Text($"Verify at: {certificate.VerificationUrl}")
                        .FontSize(10).FontColor(Colors.Blue.Medium);
                });
            });
        });

        return document.GeneratePdf();
    }

    private static CertificateResponse MapToResponse(Certificate certificate) => new(
        certificate.Id,
        certificate.CertificateNumber,
        certificate.CourseId,
        certificate.CourseTitle,
        certificate.StudentId,
        certificate.StudentName,
        certificate.InstructorName,
        certificate.CompletedAt,
        certificate.IssuedAt,
        certificate.ExpiresAt,
        certificate.PdfUrl,
        certificate.VerificationUrl,
        certificate.Skills,
        certificate.TotalHours,
        certificate.FinalScore,
        certificate.IsRevoked
    );
}
