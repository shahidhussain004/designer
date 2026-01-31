using MongoDB.Bson;
using MongoDB.Driver;

namespace LmsService.Migrations;

/// <summary>
/// Initial schema migration - creates all collections with indexes
/// </summary>
public class V001_InitialSchema : IMigration
{
    private readonly IMongoDatabase _database;
    private readonly ILogger<V001_InitialSchema> _logger;

    public string Version => "V001";
    public string Description => "Create initial collections and indexes for LMS";

    public V001_InitialSchema(IMongoDatabase database, ILogger<V001_InitialSchema> logger)
    {
        _database = database;
        _logger = logger;
    }

    public async Task UpAsync(CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Creating LMS collections and indexes...");

        // Create courses collection
        await CreateCoursesCollectionAsync(cancellationToken);
        
        // Create enrollments collection
        await CreateEnrollmentsCollectionAsync(cancellationToken);
        
        // Create certificates collection
        await CreateCertificatesCollectionAsync(cancellationToken);
        
        // Create quizzes collection
        await CreateQuizzesCollectionAsync(cancellationToken);
        
        // Create quiz_attempts collection
        await CreateQuizAttemptsCollectionAsync(cancellationToken);

        _logger.LogInformation("All collections and indexes created successfully");
    }

    public async Task DownAsync(CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("Dropping LMS collections...");

        await _database.DropCollectionAsync("courses", cancellationToken);
        await _database.DropCollectionAsync("enrollments", cancellationToken);
        await _database.DropCollectionAsync("certificates", cancellationToken);
        await _database.DropCollectionAsync("quizzes", cancellationToken);
        await _database.DropCollectionAsync("quiz_attempts", cancellationToken);

        _logger.LogInformation("All collections dropped");
    }

    private async Task CreateCoursesCollectionAsync(CancellationToken cancellationToken)
    {
        // Create collection
        await _database.CreateCollectionAsync("courses", cancellationToken: cancellationToken);

        var collection = _database.GetCollection<BsonDocument>("courses");

        // Create indexes
        var indexModels = new List<CreateIndexModel<BsonDocument>>
        {
            // Unique index on slug
            new CreateIndexModel<BsonDocument>(
                Builders<BsonDocument>.IndexKeys.Ascending("slug"),
                new CreateIndexOptions { Unique = true, Sparse = true }
            ),
            // Index on instructorId for instructor queries
            new CreateIndexModel<BsonDocument>(
                Builders<BsonDocument>.IndexKeys.Ascending("instructorId")
            ),
            // Index on status for filtering published courses
            new CreateIndexModel<BsonDocument>(
                Builders<BsonDocument>.IndexKeys.Ascending("status")
            ),
            // Index on category for filtering
            new CreateIndexModel<BsonDocument>(
                Builders<BsonDocument>.IndexKeys.Ascending("category")
            ),
            // Compound index for search
            new CreateIndexModel<BsonDocument>(
                Builders<BsonDocument>.IndexKeys
                    .Ascending("status")
                    .Ascending("category")
                    .Descending("createdAt")
            ),
            // Text index for search
            new CreateIndexModel<BsonDocument>(
                Builders<BsonDocument>.IndexKeys.Text("title").Text("description"),
                new CreateIndexOptions { Weights = new BsonDocument { { "title", 10 }, { "description", 5 } } }
            )
        };

        await collection.Indexes.CreateManyAsync(indexModels, cancellationToken);
        _logger.LogInformation("✓ Created courses collection with {Count} indexes", indexModels.Count);
    }

    private async Task CreateEnrollmentsCollectionAsync(CancellationToken cancellationToken)
    {
        await _database.CreateCollectionAsync("enrollments", cancellationToken: cancellationToken);

        var collection = _database.GetCollection<BsonDocument>("enrollments");

        var indexModels = new List<CreateIndexModel<BsonDocument>>
        {
            // Unique compound index - one enrollment per student per course
            new CreateIndexModel<BsonDocument>(
                Builders<BsonDocument>.IndexKeys
                    .Ascending("courseId")
                    .Ascending("studentId"),
                new CreateIndexOptions { Unique = true }
            ),
            // Index on studentId for student queries
            new CreateIndexModel<BsonDocument>(
                Builders<BsonDocument>.IndexKeys.Ascending("studentId")
            ),
            // Index on courseId for course queries
            new CreateIndexModel<BsonDocument>(
                Builders<BsonDocument>.IndexKeys.Ascending("courseId")
            ),
            // Index on status
            new CreateIndexModel<BsonDocument>(
                Builders<BsonDocument>.IndexKeys.Ascending("status")
            )
        };

        await collection.Indexes.CreateManyAsync(indexModels, cancellationToken);
        _logger.LogInformation("✓ Created enrollments collection with {Count} indexes", indexModels.Count);
    }

    private async Task CreateCertificatesCollectionAsync(CancellationToken cancellationToken)
    {
        await _database.CreateCollectionAsync("certificates", cancellationToken: cancellationToken);

        var collection = _database.GetCollection<BsonDocument>("certificates");

        var indexModels = new List<CreateIndexModel<BsonDocument>>
        {
            // Unique index on certificate number
            new CreateIndexModel<BsonDocument>(
                Builders<BsonDocument>.IndexKeys.Ascending("certificateNumber"),
                new CreateIndexOptions { Unique = true }
            ),
            // Index on studentId
            new CreateIndexModel<BsonDocument>(
                Builders<BsonDocument>.IndexKeys.Ascending("studentId")
            ),
            // Index on courseId
            new CreateIndexModel<BsonDocument>(
                Builders<BsonDocument>.IndexKeys.Ascending("courseId")
            ),
            // Index on enrollmentId if present
            new CreateIndexModel<BsonDocument>(
                Builders<BsonDocument>.IndexKeys.Ascending("enrollmentId"),
                new CreateIndexOptions { Sparse = true }
            )
        };

        await collection.Indexes.CreateManyAsync(indexModels, cancellationToken);
        _logger.LogInformation("✓ Created certificates collection with {Count} indexes", indexModels.Count);
    }

    private async Task CreateQuizzesCollectionAsync(CancellationToken cancellationToken)
    {
        await _database.CreateCollectionAsync("quizzes", cancellationToken: cancellationToken);

        var collection = _database.GetCollection<BsonDocument>("quizzes");

        var indexModels = new List<CreateIndexModel<BsonDocument>>
        {
            // Index on courseId
            new CreateIndexModel<BsonDocument>(
                Builders<BsonDocument>.IndexKeys.Ascending("courseId")
            ),
            // Index on lessonId
            new CreateIndexModel<BsonDocument>(
                Builders<BsonDocument>.IndexKeys.Ascending("lessonId"),
                new CreateIndexOptions { Sparse = true }
            )
        };

        await collection.Indexes.CreateManyAsync(indexModels, cancellationToken);
        _logger.LogInformation("✓ Created quizzes collection with {Count} indexes", indexModels.Count);
    }

    private async Task CreateQuizAttemptsCollectionAsync(CancellationToken cancellationToken)
    {
        await _database.CreateCollectionAsync("quiz_attempts", cancellationToken: cancellationToken);

        var collection = _database.GetCollection<BsonDocument>("quiz_attempts");

        var indexModels = new List<CreateIndexModel<BsonDocument>>
        {
            // Compound index for student's quiz attempts
            new CreateIndexModel<BsonDocument>(
                Builders<BsonDocument>.IndexKeys
                    .Ascending("studentId")
                    .Ascending("quizId")
            ),
            // Index on quizId
            new CreateIndexModel<BsonDocument>(
                Builders<BsonDocument>.IndexKeys.Ascending("quizId")
            )
        };

        await collection.Indexes.CreateManyAsync(indexModels, cancellationToken);
        _logger.LogInformation("✓ Created quiz_attempts collection with {Count} indexes", indexModels.Count);
    }
}
