namespace LmsService.Configuration;

public class MongoDbSettings
{
    public string ConnectionString { get; set; } = null!;
    public string DatabaseName { get; set; } = null!;
    public bool EnableMigrations { get; set; } = false;
    public string CoursesCollectionName { get; set; } = "courses";
    public string EnrollmentsCollectionName { get; set; } = "enrollments";
    public string QuizzesCollectionName { get; set; } = "quizzes";
    public string QuizAttemptsCollectionName { get; set; } = "quiz_attempts";
    public string CertificatesCollectionName { get; set; } = "certificates";
}

public class AwsSettings
{
    public string AccessKeyId { get; set; } = null!;
    public string SecretAccessKey { get; set; } = null!;
    public string Region { get; set; } = "us-east-1";
    public string VideoBucketName { get; set; } = null!;
    public string CertificateBucketName { get; set; } = null!;
    public string CloudFrontDomain { get; set; } = null!;
    public string CloudFrontKeyPairId { get; set; } = null!;
    public string CloudFrontPrivateKeyPath { get; set; } = null!;
    public int PresignedUrlExpirationMinutes { get; set; } = 60;
}

public class JwtSettings
{
    public string SecretKey { get; set; } = null!;
    public string Issuer { get; set; } = "lms-service";
    public string Audience { get; set; } = "designer-marketplace";
    public int ExpirationMinutes { get; set; } = 60;
}

public class KafkaSettings
{
    public string BootstrapServers { get; set; } = null!;
    public string GroupId { get; set; } = "lms-service-group";
    public string CoursesCompletedTopic { get; set; } = "courses.completed";
    public string CertificatesIssuedTopic { get; set; } = "certificates.issued";
    public string EnrollmentsCreatedTopic { get; set; } = "enrollments.created";
    // Topic creation defaults for admin-created topics
    public int DefaultNumPartitions { get; set; } = 3;
    public short DefaultReplicationFactor { get; set; } = 1;
    // Optional per-topic overrides: topic name -> num partitions
    public Dictionary<string, int> TopicPartitions { get; set; } = new Dictionary<string, int>();
}

public class RedisSettings
{
    public string ConnectionString { get; set; } = null!;
    public int CacheExpirationMinutes { get; set; } = 30;
}

public class CertificateSettings
{
    public string BaseVerificationUrl { get; set; } = "https://marketplace.designerplatform.com/verify";
    public string CompanyName { get; set; } = "Designer Marketplace";
    public string CompanyLogo { get; set; } = null!;
    public int ExpirationYears { get; set; } = 0; // 0 = no expiration
}
