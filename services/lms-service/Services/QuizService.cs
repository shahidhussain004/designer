using LmsService.DTOs;
using LmsService.Models;
using LmsService.Repositories;

namespace LmsService.Services;

public interface IQuizService
{
    Task<QuizResponse> CreateQuizAsync(string courseId, long instructorId, CreateQuizRequest request);
    Task<QuizResponse?> GetQuizAsync(string quizId, bool includeAnswers = false);
    Task<QuizResponse?> GetQuizByLessonAsync(string lessonId, bool includeAnswers = false);
    Task<List<QuizResponse>> GetQuizzesByCourseAsync(string courseId);
    Task<QuizResultResponse> SubmitQuizAsync(string quizId, long studentId, string enrollmentId, SubmitQuizRequest request);
    Task<List<QuizResultResponse>> GetStudentAttemptsAsync(long studentId, string quizId);
    Task<bool> DeleteQuizAsync(string quizId, long instructorId);
}

public class QuizService : IQuizService
{
    private readonly IQuizRepository _quizRepository;
    private readonly ICourseRepository _courseRepository;
    private readonly IEnrollmentRepository _enrollmentRepository;
    private readonly ILogger<QuizService> _logger;

    public QuizService(
        IQuizRepository quizRepository,
        ICourseRepository courseRepository,
        IEnrollmentRepository enrollmentRepository,
        ILogger<QuizService> logger)
    {
        _quizRepository = quizRepository;
        _courseRepository = courseRepository;
        _enrollmentRepository = enrollmentRepository;
        _logger = logger;
    }

    public async Task<QuizResponse> CreateQuizAsync(string courseId, long instructorId, CreateQuizRequest request)
    {
        var course = await _courseRepository.GetByIdAsync(courseId)
            ?? throw new InvalidOperationException("Course not found");

        if (course.InstructorId != instructorId)
            throw new UnauthorizedAccessException("Not authorized to create quiz for this course");

        var quiz = new Quiz
        {
            CourseId = courseId,
            LessonId = request.LessonId,
            Title = request.Title,
            Description = request.Description,
            PassingScore = request.PassingScore ?? 70.0,
            TimeLimitMinutes = request.TimeLimitMinutes,
            MaxAttempts = request.MaxAttempts ?? 3,
            ShuffleQuestions = request.ShuffleQuestions ?? false,
            ShuffleOptions = request.ShuffleOptions ?? false,
            ShowCorrectAnswers = request.ShowCorrectAnswers ?? true,
            Questions = request.Questions.Select((q, index) => new QuizQuestion
            {
                Text = q.Text,
                Type = Enum.Parse<QuestionType>(q.Type, true),
                Options = q.Options.Select(o => new QuizOption
                {
                    Text = o.Text,
                    IsCorrect = o.IsCorrect
                }).ToList(),
                CorrectAnswer = q.CorrectAnswer,
                Explanation = q.Explanation,
                Points = q.Points ?? 1,
                OrderIndex = index
            }).ToList()
        };

        quiz = await _quizRepository.CreateAsync(quiz);
        _logger.LogInformation("Quiz created for lesson {LessonId} in course {CourseId}", request.LessonId, courseId);

        return MapToResponse(quiz, includeAnswers: true);
    }

    public async Task<QuizResponse?> GetQuizAsync(string quizId, bool includeAnswers = false)
    {
        var quiz = await _quizRepository.GetByIdAsync(quizId);
        return quiz != null ? MapToResponse(quiz, includeAnswers) : null;
    }

    public async Task<QuizResponse?> GetQuizByLessonAsync(string lessonId, bool includeAnswers = false)
    {
        var quiz = await _quizRepository.GetByLessonIdAsync(lessonId);
        return quiz != null ? MapToResponse(quiz, includeAnswers) : null;
    }

    public async Task<List<QuizResponse>> GetQuizzesByCourseAsync(string courseId)
    {
        var quizzes = await _quizRepository.GetByCourseIdAsync(courseId);
        return quizzes.Select(q => MapToResponse(q, false)).ToList();
    }

    public async Task<QuizResultResponse> SubmitQuizAsync(string quizId, long studentId, string enrollmentId, SubmitQuizRequest request)
    {
        var quiz = await _quizRepository.GetByIdAsync(quizId)
            ?? throw new InvalidOperationException("Quiz not found");

        var enrollment = await _enrollmentRepository.GetByIdAsync(enrollmentId)
            ?? throw new InvalidOperationException("Enrollment not found");

        if (enrollment.StudentId != studentId)
            throw new UnauthorizedAccessException("Not authorized");

        // Check attempt limit
        var attemptCount = await _quizRepository.GetAttemptCountAsync(studentId, quizId);
        if (attemptCount >= quiz.MaxAttempts)
            throw new InvalidOperationException($"Maximum attempts ({quiz.MaxAttempts}) reached");

        var startedAt = DateTime.UtcNow;
        var answers = new List<QuizAnswer>();
        var totalPoints = 0;
        var earnedPoints = 0;

        foreach (var question in quiz.Questions)
        {
            totalPoints += question.Points;
            var submission = request.Answers.FirstOrDefault(a => a.QuestionId == question.Id);
            var answer = new QuizAnswer { QuestionId = question.Id };

            if (submission != null)
            {
                answer.SelectedOptions = submission.SelectedOptions ?? new List<string>();
                answer.TextAnswer = submission.TextAnswer;

                // Grade the answer
                var isCorrect = GradeAnswer(question, submission);
                answer.IsCorrect = isCorrect;
                answer.PointsEarned = isCorrect ? question.Points : 0;
                earnedPoints += answer.PointsEarned;
            }

            answers.Add(answer);
        }

        var score = totalPoints > 0 ? (double)earnedPoints / totalPoints * 100 : 0;
        var passed = score >= quiz.PassingScore;
        var completedAt = DateTime.UtcNow;

        var attempt = new QuizAttempt
        {
            QuizId = quizId,
            StudentId = studentId,
            EnrollmentId = enrollmentId,
            Answers = answers,
            Score = score,
            TotalPoints = totalPoints,
            EarnedPoints = earnedPoints,
            Passed = passed,
            StartedAt = startedAt,
            CompletedAt = completedAt,
            TimeTakenSeconds = (int)(completedAt - startedAt).TotalSeconds
        };

        attempt = await _quizRepository.CreateAttemptAsync(attempt);

        // Update enrollment quiz attempts
        enrollment.QuizAttempts.Add(new QuizAttemptRecord
        {
            QuizId = quizId,
            Score = score,
            Passed = passed,
            AttemptedAt = completedAt
        });
        await _enrollmentRepository.UpdateAsync(enrollment);

        _logger.LogInformation("Quiz {QuizId} submitted by student {StudentId}. Score: {Score}%, Passed: {Passed}",
            quizId, studentId, score, passed);

        return MapToResult(attempt, quiz, quiz.ShowCorrectAnswers);
    }

    public async Task<List<QuizResultResponse>> GetStudentAttemptsAsync(long studentId, string quizId)
    {
        var quiz = await _quizRepository.GetByIdAsync(quizId)
            ?? throw new InvalidOperationException("Quiz not found");

        var attempts = await _quizRepository.GetAttemptsByStudentAndQuizAsync(studentId, quizId);
        return attempts.Select(a => MapToResult(a, quiz, quiz.ShowCorrectAnswers)).ToList();
    }

    public async Task<bool> DeleteQuizAsync(string quizId, long instructorId)
    {
        var quiz = await _quizRepository.GetByIdAsync(quizId)
            ?? throw new InvalidOperationException("Quiz not found");

        var course = await _courseRepository.GetByIdAsync(quiz.CourseId)
            ?? throw new InvalidOperationException("Course not found");

        if (course.InstructorId != instructorId)
            throw new UnauthorizedAccessException("Not authorized to delete this quiz");

        return await _quizRepository.DeleteAsync(quizId);
    }

    private static bool GradeAnswer(QuizQuestion question, AnswerSubmission submission)
    {
        return question.Type switch
        {
            QuestionType.MultipleChoice => submission.SelectedOptions?.Count == 1 &&
                question.Options.Any(o => o.Id == submission.SelectedOptions[0] && o.IsCorrect),

            QuestionType.TrueFalse => submission.SelectedOptions?.Count == 1 &&
                question.Options.Any(o => o.Id == submission.SelectedOptions[0] && o.IsCorrect),

            QuestionType.MultiSelect => submission.SelectedOptions != null &&
                new HashSet<string>(submission.SelectedOptions).SetEquals(
                    question.Options.Where(o => o.IsCorrect).Select(o => o.Id)),

            QuestionType.ShortAnswer => !string.IsNullOrWhiteSpace(submission.TextAnswer) &&
                submission.TextAnswer.Trim().Equals(question.CorrectAnswer?.Trim(), StringComparison.OrdinalIgnoreCase),

            _ => false
        };
    }

    private static QuizResponse MapToResponse(Quiz quiz, bool includeAnswers)
    {
        return new QuizResponse(
            quiz.Id,
            quiz.CourseId,
            quiz.LessonId,
            quiz.Title,
            quiz.Description,
            quiz.Questions.Select(q => new QuestionResponse(
                q.Id,
                q.Text,
                q.Type.ToString(),
                q.Options.Select(o => new OptionResponse(o.Id, o.Text, includeAnswers ? o.IsCorrect : null)).ToList(),
                includeAnswers ? q.Explanation : null,
                q.Points,
                q.OrderIndex
            )).ToList(),
            quiz.PassingScore,
            quiz.TimeLimitMinutes,
            quiz.MaxAttempts,
            quiz.ShuffleQuestions,
            quiz.ShuffleOptions,
            quiz.ShowCorrectAnswers,
            quiz.CreatedAt
        );
    }

    private static QuizResultResponse MapToResult(QuizAttempt attempt, Quiz quiz, bool showAnswers)
    {
        List<AnswerResultResponse>? answerResults = null;

        if (showAnswers)
        {
            answerResults = attempt.Answers.Select(a =>
            {
                var question = quiz.Questions.First(q => q.Id == a.QuestionId);
                return new AnswerResultResponse(
                    a.QuestionId,
                    question.Text,
                    a.SelectedOptions,
                    a.TextAnswer,
                    a.IsCorrect,
                    a.PointsEarned,
                    question.Explanation,
                    question.Options.Where(o => o.IsCorrect).Select(o => o.Id).ToList()
                );
            }).ToList();
        }

        return new QuizResultResponse(
            attempt.Id,
            attempt.QuizId,
            attempt.Score,
            attempt.TotalPoints,
            attempt.EarnedPoints,
            attempt.Passed,
            attempt.StartedAt,
            attempt.CompletedAt ?? DateTime.UtcNow,
            attempt.TimeTakenSeconds ?? 0,
            answerResults
        );
    }
}
