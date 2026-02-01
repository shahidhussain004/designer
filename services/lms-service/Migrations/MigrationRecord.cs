using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LmsService.Migrations;

/// <summary>
/// Tracks executed migrations in MongoDB
/// Similar to Flyway's schema_version table
/// </summary>
public class MigrationRecord
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    [BsonElement("version")]
    public string Version { get; set; } = null!;

    [BsonElement("description")]
    public string Description { get; set; } = null!;

    [BsonElement("executedAt")]
    public DateTime ExecutedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("success")]
    public bool Success { get; set; }

    [BsonElement("errorMessage")]
    public string? ErrorMessage { get; set; }

    [BsonElement("executionTimeMs")]
    public long ExecutionTimeMs { get; set; }
}
