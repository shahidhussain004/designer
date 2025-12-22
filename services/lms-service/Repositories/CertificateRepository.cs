using LmsService.Configuration;
using LmsService.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace LmsService.Repositories;

public interface ICertificateRepository
{
    Task<Certificate?> GetByIdAsync(string id);
    Task<Certificate?> GetByCertificateNumberAsync(string certificateNumber);
    Task<Certificate?> GetByEnrollmentIdAsync(string enrollmentId);
    Task<List<Certificate>> GetByStudentIdAsync(long studentId, int skip, int take);
    Task<List<Certificate>> GetByCourseIdAsync(string courseId, int skip, int take);
    Task<Certificate> CreateAsync(Certificate certificate);
    Task<Certificate> UpdateAsync(Certificate certificate);
    Task<bool> RevokeAsync(string id, string reason);
}

public class CertificateRepository : ICertificateRepository
{
    private readonly IMongoCollection<Certificate> _certificates;

    public CertificateRepository(IMongoDatabase database, IOptions<MongoDbSettings> settings)
    {
        _certificates = database.GetCollection<Certificate>(settings.Value.CertificatesCollectionName);
        CreateIndexes();
    }

    private void CreateIndexes()
    {
        var indexKeys = Builders<Certificate>.IndexKeys;
        var indexes = new List<CreateIndexModel<Certificate>>
        {
            new(indexKeys.Ascending(c => c.CertificateNumber), new CreateIndexOptions { Unique = true }),
            new(indexKeys.Ascending(c => c.EnrollmentId), new CreateIndexOptions { Unique = true }),
            new(indexKeys.Ascending(c => c.StudentId)),
            new(indexKeys.Ascending(c => c.CourseId))
        };
        _certificates.Indexes.CreateMany(indexes);
    }

    public async Task<Certificate?> GetByIdAsync(string id)
    {
        return await _certificates.Find(c => c.Id == id).FirstOrDefaultAsync();
    }

    public async Task<Certificate?> GetByCertificateNumberAsync(string certificateNumber)
    {
        return await _certificates.Find(c => c.CertificateNumber == certificateNumber).FirstOrDefaultAsync();
    }

    public async Task<Certificate?> GetByEnrollmentIdAsync(string enrollmentId)
    {
        return await _certificates.Find(c => c.EnrollmentId == enrollmentId).FirstOrDefaultAsync();
    }

    public async Task<List<Certificate>> GetByStudentIdAsync(long studentId, int skip, int take)
    {
        return await _certificates
            .Find(c => c.StudentId == studentId && !c.IsRevoked)
            .SortByDescending(c => c.IssuedAt)
            .Skip(skip)
            .Limit(take)
            .ToListAsync();
    }

    public async Task<List<Certificate>> GetByCourseIdAsync(string courseId, int skip, int take)
    {
        return await _certificates
            .Find(c => c.CourseId == courseId && !c.IsRevoked)
            .SortByDescending(c => c.IssuedAt)
            .Skip(skip)
            .Limit(take)
            .ToListAsync();
    }

    public async Task<Certificate> CreateAsync(Certificate certificate)
    {
        await _certificates.InsertOneAsync(certificate);
        return certificate;
    }

    public async Task<Certificate> UpdateAsync(Certificate certificate)
    {
        await _certificates.ReplaceOneAsync(c => c.Id == certificate.Id, certificate);
        return certificate;
    }

    public async Task<bool> RevokeAsync(string id, string reason)
    {
        var update = Builders<Certificate>.Update
            .Set(c => c.IsRevoked, true)
            .Set(c => c.RevokedAt, DateTime.UtcNow)
            .Set(c => c.RevokedReason, reason);

        var result = await _certificates.UpdateOneAsync(c => c.Id == id, update);
        return result.ModifiedCount > 0;
    }
}
