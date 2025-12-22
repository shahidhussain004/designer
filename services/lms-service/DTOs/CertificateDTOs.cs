namespace LmsService.DTOs;

public record CertificateResponse(
    string Id,
    string CertificateNumber,
    string CourseId,
    string CourseTitle,
    long StudentId,
    string StudentName,
    string InstructorName,
    DateTime CompletedAt,
    DateTime IssuedAt,
    DateTime? ExpiresAt,
    string? PdfUrl,
    string VerificationUrl,
    List<string> Skills,
    double TotalHours,
    double? FinalScore,
    bool IsRevoked
);

public record VerifyCertificateResponse(
    bool IsValid,
    string? CertificateNumber,
    string? StudentName,
    string? CourseTitle,
    string? InstructorName,
    DateTime? IssuedAt,
    DateTime? CompletedAt,
    double? TotalHours,
    List<string>? Skills,
    string? Message
);

public record GenerateCertificateRequest(
    string EnrollmentId
);
