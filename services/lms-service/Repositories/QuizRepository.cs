using LmsService.Configuration;
using LmsService.Models;
using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace LmsService.Repositories;

public interface IQuizRepository
{
    Task<Quiz?> GetByIdAsync(string id);
    Task<Quiz?> GetByLessonIdAsync(string lessonId);
    Task<List<Quiz>> GetByCourseIdAsync(string courseId);
    Task<Quiz> CreateAsync(Quiz quiz);
    Task<Quiz> UpdateAsync(Quiz quiz);
    Task<bool> DeleteAsync(string id);
    
    // Quiz Attempts
    Task<QuizAttempt?> GetAttemptByIdAsync(string id);
    Task<List<QuizAttempt>> GetAttemptsByStudentAndQuizAsync(long studentId, string quizId);
    Task<int> GetAttemptCountAsync(long studentId, string quizId);
    Task<QuizAttempt> CreateAttemptAsync(QuizAttempt attempt);
    Task<QuizAttempt> UpdateAttemptAsync(QuizAttempt attempt);
}

public class QuizRepository : IQuizRepository
{
    private readonly IMongoCollection<Quiz> _quizzes;
    private readonly IMongoCollection<QuizAttempt> _attempts;

    public QuizRepository(IMongoDatabase database, IOptions<MongoDbSettings> settings)
    {
        _quizzes = database.GetCollection<Quiz>(settings.Value.QuizzesCollectionName);
        _attempts = database.GetCollection<QuizAttempt>(settings.Value.QuizAttemptsCollectionName);
        CreateIndexes();
    }

    private void CreateIndexes()
    {
        // Quiz indexes
        var quizIndexKeys = Builders<Quiz>.IndexKeys;
        var quizIndexes = new List<CreateIndexModel<Quiz>>
        {
            new(quizIndexKeys.Ascending(q => q.CourseId)),
            new(quizIndexKeys.Ascending(q => q.LessonId), new CreateIndexOptions { Unique = true })
        };
        _quizzes.Indexes.CreateMany(quizIndexes);

        // Attempt indexes
        var attemptIndexKeys = Builders<QuizAttempt>.IndexKeys;
        var attemptIndexes = new List<CreateIndexModel<QuizAttempt>>
        {
            new(attemptIndexKeys.Ascending(a => a.QuizId)),
            new(attemptIndexKeys.Ascending(a => a.StudentId)),
            new(attemptIndexKeys.Ascending(a => a.EnrollmentId)),
            new(attemptIndexKeys.Combine(
                attemptIndexKeys.Ascending(a => a.StudentId),
                attemptIndexKeys.Ascending(a => a.QuizId)
            ))
        };
        _attempts.Indexes.CreateMany(attemptIndexes);
    }

    public async Task<Quiz?> GetByIdAsync(string id)
    {
        return await _quizzes.Find(q => q.Id == id).FirstOrDefaultAsync();
    }

    public async Task<Quiz?> GetByLessonIdAsync(string lessonId)
    {
        return await _quizzes.Find(q => q.LessonId == lessonId).FirstOrDefaultAsync();
    }

    public async Task<List<Quiz>> GetByCourseIdAsync(string courseId)
    {
        return await _quizzes.Find(q => q.CourseId == courseId).ToListAsync();
    }

    public async Task<Quiz> CreateAsync(Quiz quiz)
    {
        await _quizzes.InsertOneAsync(quiz);
        return quiz;
    }

    public async Task<Quiz> UpdateAsync(Quiz quiz)
    {
        quiz.UpdatedAt = DateTime.UtcNow;
        await _quizzes.ReplaceOneAsync(q => q.Id == quiz.Id, quiz);
        return quiz;
    }

    public async Task<bool> DeleteAsync(string id)
    {
        var result = await _quizzes.DeleteOneAsync(q => q.Id == id);
        return result.DeletedCount > 0;
    }

    public async Task<QuizAttempt?> GetAttemptByIdAsync(string id)
    {
        return await _attempts.Find(a => a.Id == id).FirstOrDefaultAsync();
    }

    public async Task<List<QuizAttempt>> GetAttemptsByStudentAndQuizAsync(long studentId, string quizId)
    {
        return await _attempts
            .Find(a => a.StudentId == studentId && a.QuizId == quizId)
            .SortByDescending(a => a.StartedAt)
            .ToListAsync();
    }

    public async Task<int> GetAttemptCountAsync(long studentId, string quizId)
    {
        return (int)await _attempts.CountDocumentsAsync(a => a.StudentId == studentId && a.QuizId == quizId);
    }

    public async Task<QuizAttempt> CreateAttemptAsync(QuizAttempt attempt)
    {
        await _attempts.InsertOneAsync(attempt);
        return attempt;
    }

    public async Task<QuizAttempt> UpdateAttemptAsync(QuizAttempt attempt)
    {
        await _attempts.ReplaceOneAsync(a => a.Id == attempt.Id, attempt);
        return attempt;
    }
}
