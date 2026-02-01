namespace LmsService.Migrations;

/// <summary>
/// Interface for database migrations
/// Similar to Flyway - provides Up and Down methods for migration and rollback
/// </summary>
public interface IMigration
{
    /// <summary>
    /// Version of the migration (e.g., "V001", "V002")
    /// </summary>
    string Version { get; }

    /// <summary>
    /// Description of what this migration does
    /// </summary>
    string Description { get; }

    /// <summary>
    /// Execute the migration
    /// </summary>
    Task UpAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Rollback the migration
    /// </summary>
    Task DownAsync(CancellationToken cancellationToken = default);
}
