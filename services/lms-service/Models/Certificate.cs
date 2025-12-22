using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LmsService.Models;

public class Certificate
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    [BsonElement("certificateNumber")]
    public string CertificateNumber { get; set; } = null!;

    [BsonElement("enrollmentId")]
    public string EnrollmentId { get; set; } = null!;

    [BsonElement("courseId")]
    public string CourseId { get; set; } = null!;

    [BsonElement("courseTitle")]
    public string CourseTitle { get; set; } = null!;

    [BsonElement("studentId")]
    public long StudentId { get; set; }

    [BsonElement("studentName")]
    public string StudentName { get; set; } = null!;

    [BsonElement("instructorName")]
    public string InstructorName { get; set; } = null!;

    [BsonElement("completedAt")]
    public DateTime CompletedAt { get; set; }

    [BsonElement("issuedAt")]
    public DateTime IssuedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("expiresAt")]
    public DateTime? ExpiresAt { get; set; }

    [BsonElement("pdfUrl")]
    public string? PdfUrl { get; set; }

    [BsonElement("pdfKey")]
    public string? PdfKey { get; set; }

    [BsonElement("verificationUrl")]
    public string VerificationUrl { get; set; } = null!;

    [BsonElement("skills")]
    public List<string> Skills { get; set; } = new();

    [BsonElement("totalHours")]
    public double TotalHours { get; set; }

    [BsonElement("finalScore")]
    public double? FinalScore { get; set; }

    [BsonElement("isRevoked")]
    public bool IsRevoked { get; set; }

    [BsonElement("revokedAt")]
    public DateTime? RevokedAt { get; set; }

    [BsonElement("revokedReason")]
    public string? RevokedReason { get; set; }

    public static string GenerateCertificateNumber()
    {
        var timestamp = DateTime.UtcNow.ToString("yyyyMMdd");
        var random = Guid.NewGuid().ToString("N")[..8].ToUpper();
        return $"CERT-{timestamp}-{random}";
    }
}
