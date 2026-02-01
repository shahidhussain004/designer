using MongoDB.Driver;
using System.Diagnostics;
using System.Reflection;

namespace LmsService.Migrations;

/// <summary>
/// Manages database migrations similar to Flyway
/// - Tracks executed migrations in a "migrations" collection
/// - Runs pending migrations in order (by version)
/// - Supports rollback
/// - Provides error handling and logging
/// </summary>
public class MigrationRunner
{
    private readonly IMongoDatabase _database;
    private readonly ILogger<MigrationRunner> _logger;
    private readonly IServiceProvider _serviceProvider;
    private IMongoCollection<MigrationRecord> MigrationsCollection => 
        _database.GetCollection<MigrationRecord>("migrations");

    public MigrationRunner(
        IMongoDatabase database, 
        ILogger<MigrationRunner> logger,
        IServiceProvider serviceProvider)
    {
        _database = database;
        _logger = logger;
        _serviceProvider = serviceProvider;
    }

    /// <summary>
    /// Run all pending migrations
    /// </summary>
    public async Task MigrateAsync(CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("🚀 Starting MongoDB migrations...");

        try
        {
            // Ensure migrations collection exists
            await EnsureMigrationsCollectionAsync(cancellationToken);

            // Get all migration types
            var migrations = GetAllMigrations();
            _logger.LogInformation("Found {Count} migration(s)", migrations.Count);

            // Get executed migrations
            var executedVersions = await GetExecutedMigrationsAsync(cancellationToken);
            _logger.LogInformation("Already executed {Count} migration(s)", executedVersions.Count);

            // Find pending migrations
            var pendingMigrations = migrations
                .Where(m => !executedVersions.Contains(m.Version))
                .OrderBy(m => m.Version)
                .ToList();

            if (pendingMigrations.Count == 0)
            {
                _logger.LogInformation("✅ No pending migrations");
                return;
            }

            _logger.LogInformation("Found {Count} pending migration(s)", pendingMigrations.Count);

            // Execute each pending migration
            foreach (var migration in pendingMigrations)
            {
                await ExecuteMigrationAsync(migration, cancellationToken);
            }

            _logger.LogInformation("✅ All migrations completed successfully");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Migration failed");
            throw;
        }
    }

    /// <summary>
    /// Rollback the last executed migration
    /// </summary>
    public async Task RollbackAsync(CancellationToken cancellationToken = default)
    {
        _logger.LogInformation("🔄 Starting migration rollback...");

        try
        {
            // Get the last executed migration
            var lastMigration = await MigrationsCollection
                .Find(m => m.Success)
                .SortByDescending(m => m.ExecutedAt)
                .FirstOrDefaultAsync(cancellationToken);

            if (lastMigration == null)
            {
                _logger.LogWarning("No migrations to rollback");
                return;
            }

            _logger.LogInformation("Rolling back migration {Version}: {Description}", 
                lastMigration.Version, lastMigration.Description);

            // Find the migration class
            var migration = GetAllMigrations()
                .FirstOrDefault(m => m.Version == lastMigration.Version);

            if (migration == null)
            {
                throw new InvalidOperationException(
                    $"Migration class for version {lastMigration.Version} not found");
            }

            // Execute rollback
            var stopwatch = Stopwatch.StartNew();
            await migration.DownAsync(cancellationToken);
            stopwatch.Stop();

            // Remove migration record
            await MigrationsCollection.DeleteOneAsync(
                m => m.Version == lastMigration.Version,
                cancellationToken);

            _logger.LogInformation("✅ Rollback completed in {ElapsedMs}ms", 
                stopwatch.ElapsedMilliseconds);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "❌ Rollback failed");
            throw;
        }
    }

    private async Task ExecuteMigrationAsync(IMigration migration, CancellationToken cancellationToken)
    {
        _logger.LogInformation("▶️  Executing migration {Version}: {Description}", 
            migration.Version, migration.Description);

        var stopwatch = Stopwatch.StartNew();
        var record = new MigrationRecord
        {
            Version = migration.Version,
            Description = migration.Description
        };

        try
        {
            await migration.UpAsync(cancellationToken);
            stopwatch.Stop();

            record.Success = true;
            record.ExecutionTimeMs = stopwatch.ElapsedMilliseconds;

            await MigrationsCollection.InsertOneAsync(record, cancellationToken: cancellationToken);

            _logger.LogInformation("✅ Migration {Version} completed in {ElapsedMs}ms", 
                migration.Version, stopwatch.ElapsedMilliseconds);
        }
        catch (Exception ex)
        {
            stopwatch.Stop();

            record.Success = false;
            record.ErrorMessage = ex.Message;
            record.ExecutionTimeMs = stopwatch.ElapsedMilliseconds;

            await MigrationsCollection.InsertOneAsync(record, cancellationToken: cancellationToken);

            _logger.LogError(ex, "❌ Migration {Version} failed", migration.Version);
            throw;
        }
    }

    private List<IMigration> GetAllMigrations()
    {
        var migrations = new List<IMigration>();
        var assembly = Assembly.GetExecutingAssembly();

        // Find all types that implement IMigration
        var migrationTypes = assembly.GetTypes()
            .Where(t => typeof(IMigration).IsAssignableFrom(t) && !t.IsInterface && !t.IsAbstract)
            .OrderBy(t => t.Name);

        foreach (var type in migrationTypes)
        {
            try
            {
                // Try to create instance using DI
                var migration = ActivatorUtilities.CreateInstance(_serviceProvider, type) as IMigration;
                if (migration != null)
                {
                    migrations.Add(migration);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to instantiate migration {Type}", type.Name);
            }
        }

        return migrations.OrderBy(m => m.Version).ToList();
    }

    private async Task<HashSet<string>> GetExecutedMigrationsAsync(CancellationToken cancellationToken)
    {
        var executed = await MigrationsCollection
            .Find(m => m.Success)
            .Project(m => m.Version)
            .ToListAsync(cancellationToken);

        return executed.ToHashSet();
    }

    private async Task EnsureMigrationsCollectionAsync(CancellationToken cancellationToken)
    {
        var collections = await _database.ListCollectionNamesAsync(cancellationToken: cancellationToken);
        var collectionNames = await collections.ToListAsync(cancellationToken);

        if (!collectionNames.Contains("migrations"))
        {
            await _database.CreateCollectionAsync("migrations", cancellationToken: cancellationToken);
            
            // Create index on version for faster lookups
            var indexKeys = Builders<MigrationRecord>.IndexKeys.Ascending(m => m.Version);
            var indexOptions = new CreateIndexOptions { Unique = true };
            await MigrationsCollection.Indexes.CreateOneAsync(
                new CreateIndexModel<MigrationRecord>(indexKeys, indexOptions),
                cancellationToken: cancellationToken);

            _logger.LogInformation("Created migrations collection with unique index on version");
        }
    }
}
