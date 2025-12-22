using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace LmsService.Models;

public class Quiz
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    [BsonElement("courseId")]
    public string CourseId { get; set; } = null!;

    [BsonElement("lessonId")]
    public string LessonId { get; set; } = null!;

    [BsonElement("title")]
    public string Title { get; set; } = null!;

    [BsonElement("description")]
    public string? Description { get; set; }

    [BsonElement("questions")]
    public List<QuizQuestion> Questions { get; set; } = new();

    [BsonElement("passingScore")]
    public double PassingScore { get; set; } = 70.0;

    [BsonElement("timeLimitMinutes")]
    public int? TimeLimitMinutes { get; set; }

    [BsonElement("maxAttempts")]
    public int MaxAttempts { get; set; } = 3;

    [BsonElement("shuffleQuestions")]
    public bool ShuffleQuestions { get; set; }

    [BsonElement("shuffleOptions")]
    public bool ShuffleOptions { get; set; }

    [BsonElement("showCorrectAnswers")]
    public bool ShowCorrectAnswers { get; set; } = true;

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}

public class QuizQuestion
{
    [BsonElement("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [BsonElement("text")]
    public string Text { get; set; } = null!;

    [BsonElement("type")]
    public QuestionType Type { get; set; }

    [BsonElement("options")]
    public List<QuizOption> Options { get; set; } = new();

    [BsonElement("correctAnswer")]
    public string? CorrectAnswer { get; set; }

    [BsonElement("explanation")]
    public string? Explanation { get; set; }

    [BsonElement("points")]
    public int Points { get; set; } = 1;

    [BsonElement("orderIndex")]
    public int OrderIndex { get; set; }
}

public class QuizOption
{
    [BsonElement("id")]
    public string Id { get; set; } = Guid.NewGuid().ToString();

    [BsonElement("text")]
    public string Text { get; set; } = null!;

    [BsonElement("isCorrect")]
    public bool IsCorrect { get; set; }
}

public enum QuestionType
{
    MultipleChoice,
    TrueFalse,
    ShortAnswer,
    MultiSelect
}

public class QuizAttempt
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    [BsonElement("quizId")]
    public string QuizId { get; set; } = null!;

    [BsonElement("studentId")]
    public long StudentId { get; set; }

    [BsonElement("enrollmentId")]
    public string EnrollmentId { get; set; } = null!;

    [BsonElement("answers")]
    public List<QuizAnswer> Answers { get; set; } = new();

    [BsonElement("score")]
    public double Score { get; set; }

    [BsonElement("totalPoints")]
    public int TotalPoints { get; set; }

    [BsonElement("earnedPoints")]
    public int EarnedPoints { get; set; }

    [BsonElement("passed")]
    public bool Passed { get; set; }

    [BsonElement("startedAt")]
    public DateTime StartedAt { get; set; }

    [BsonElement("completedAt")]
    public DateTime? CompletedAt { get; set; }

    [BsonElement("timeTakenSeconds")]
    public int? TimeTakenSeconds { get; set; }
}

public class QuizAnswer
{
    [BsonElement("questionId")]
    public string QuestionId { get; set; } = null!;

    [BsonElement("selectedOptions")]
    public List<string> SelectedOptions { get; set; } = new();

    [BsonElement("textAnswer")]
    public string? TextAnswer { get; set; }

    [BsonElement("isCorrect")]
    public bool IsCorrect { get; set; }

    [BsonElement("pointsEarned")]
    public int PointsEarned { get; set; }
}
