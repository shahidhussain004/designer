using LmsService.Configuration;
using LmsService.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace LmsService.Repositories;

public interface IEnrollmentRepository
{
    Task<Enrollment?> GetByIdAsync(string id);
    Task<Enrollment?> GetByStudentAndCourseAsync(long studentId, string courseId);
    Task<List<Enrollment>> GetByStudentIdAsync(long studentId, int skip, int take);
    Task<List<Enrollment>> GetByCourseIdAsync(string courseId, int skip, int take);
    Task<long> CountByCourseIdAsync(string courseId);
    Task<Enrollment> CreateAsync(Enrollment enrollment);
    Task<Enrollment> UpdateAsync(Enrollment enrollment);
    Task<bool> DeleteAsync(string id);
    Task<List<Enrollment>> GetCompletedEnrollmentsAsync(string courseId);
    Task<double> GetAverageRatingAsync(string courseId);
    Task<int> GetReviewCountAsync(string courseId);
    Task<List<Enrollment>> GetReviewsAsync(string courseId, int skip, int take);
}

public class EnrollmentRepository : IEnrollmentRepository
{
    private readonly IMongoCollection<Enrollment> _enrollments;

    public EnrollmentRepository(IMongoDatabase database, IOptions<MongoDbSettings> settings)
    {
        _enrollments = database.GetCollection<Enrollment>(settings.Value.EnrollmentsCollectionName);
        CreateIndexes();
    }

    private void CreateIndexes()
    {
        var indexKeys = Builders<Enrollment>.IndexKeys;
        var indexes = new List<CreateIndexModel<Enrollment>>
        {
            new(indexKeys.Ascending(e => e.StudentId)),
            new(indexKeys.Ascending(e => e.CourseId)),
            new(indexKeys.Ascending(e => e.Status)),
            new(indexKeys.Combine(
                indexKeys.Ascending(e => e.StudentId),
                indexKeys.Ascending(e => e.CourseId)
            ), new CreateIndexOptions { Unique = true })
        };
        _enrollments.Indexes.CreateMany(indexes);
    }

    public async Task<Enrollment?> GetByIdAsync(string id)
    {
        return await _enrollments.Find(e => e.Id == id).FirstOrDefaultAsync();
    }

    public async Task<Enrollment?> GetByStudentAndCourseAsync(long studentId, string courseId)
    {
        return await _enrollments
            .Find(e => e.StudentId == studentId && e.CourseId == courseId)
            .FirstOrDefaultAsync();
    }

    public async Task<List<Enrollment>> GetByStudentIdAsync(long studentId, int skip, int take)
    {
        return await _enrollments
            .Find(e => e.StudentId == studentId)
            .SortByDescending(e => e.EnrolledAt)
            .Skip(skip)
            .Limit(take)
            .ToListAsync();
    }

    public async Task<List<Enrollment>> GetByCourseIdAsync(string courseId, int skip, int take)
    {
        return await _enrollments
            .Find(e => e.CourseId == courseId)
            .SortByDescending(e => e.EnrolledAt)
            .Skip(skip)
            .Limit(take)
            .ToListAsync();
    }

    public async Task<long> CountByCourseIdAsync(string courseId)
    {
        return await _enrollments.CountDocumentsAsync(e => e.CourseId == courseId);
    }

    public async Task<Enrollment> CreateAsync(Enrollment enrollment)
    {
        await _enrollments.InsertOneAsync(enrollment);
        return enrollment;
    }

    public async Task<Enrollment> UpdateAsync(Enrollment enrollment)
    {
        await _enrollments.ReplaceOneAsync(e => e.Id == enrollment.Id, enrollment);
        return enrollment;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _enrollments.DeleteOneAsync(e => e.Id == id);
        return result.DeletedCount > 0;
    }

    public async Task<List<Enrollment>> GetCompletedEnrollmentsAsync(string courseId)
    {
        return await _enrollments
            .Find(e => e.CourseId == courseId && e.Status == EnrollmentStatus.Completed)
            .ToListAsync();
    }

    public async Task<double> GetAverageRatingAsync(string courseId)
    {
        var pipeline = new[]
        {
            new BsonDocumentPipelineStageDefinition<Enrollment, dynamic>(
                MongoDB.Bson.BsonDocument.Parse($@"{{ $match: {{ courseId: '{courseId}', rating: {{ $ne: null }} }} }}")),
            new BsonDocumentPipelineStageDefinition<Enrollment, dynamic>(
                MongoDB.Bson.BsonDocument.Parse("{ $group: { _id: null, avgRating: { $avg: '$rating' } } }"))
        };

        var result = await _enrollments.Aggregate<dynamic>(pipeline).FirstOrDefaultAsync();
        return result?.avgRating ?? 0.0;
    }

    public async Task<int> GetReviewCountAsync(string courseId)
    {
        return (int)await _enrollments.CountDocumentsAsync(e => e.CourseId == courseId && e.Rating != null);
    }

    public async Task<List<Enrollment>> GetReviewsAsync(string courseId, int skip, int take)
    {
        return await _enrollments
            .Find(e => e.CourseId == courseId && e.Rating != null)
            .SortByDescending(e => e.ReviewedAt)
            .Skip(skip)
            .Limit(take)
            .ToListAsync();
    }
}
