namespace LmsService.DTOs;

public record CreateQuizRequest(
    string CourseId,
    string LessonId,
    string Title,
    string? Description,
    List<CreateQuestionRequest> Questions,
    double? PassingScore,
    int? TimeLimitMinutes,
    int? MaxAttempts,
    bool? ShuffleQuestions,
    bool? ShuffleOptions,
    bool? ShowCorrectAnswers
);

public record CreateQuestionRequest(
    string Text,
    string Type,
    List<CreateOptionRequest> Options,
    string? CorrectAnswer,
    string? Explanation,
    int? Points
);

public record CreateOptionRequest(
    string Text,
    bool IsCorrect
);

public record QuizResponse(
    string Id,
    string CourseId,
    string LessonId,
    string Title,
    string? Description,
    List<QuestionResponse> Questions,
    double PassingScore,
    int? TimeLimitMinutes,
    int MaxAttempts,
    bool ShuffleQuestions,
    bool ShuffleOptions,
    bool ShowCorrectAnswers,
    DateTime CreatedAt
);

public record QuestionResponse(
    string Id,
    string Text,
    string Type,
    List<OptionResponse> Options,
    string? Explanation,
    int Points,
    int OrderIndex
);

public record OptionResponse(
    string Id,
    string Text,
    bool? IsCorrect
);

public record SubmitQuizRequest(
    List<AnswerSubmission> Answers
);

public record AnswerSubmission(
    string QuestionId,
    List<string>? SelectedOptions,
    string? TextAnswer
);

public record QuizResultResponse(
    string AttemptId,
    string QuizId,
    double Score,
    int TotalPoints,
    int EarnedPoints,
    bool Passed,
    DateTime StartedAt,
    DateTime CompletedAt,
    int TimeTakenSeconds,
    List<AnswerResultResponse>? AnswerResults
);

public record AnswerResultResponse(
    string QuestionId,
    string QuestionText,
    List<string> SelectedOptions,
    string? TextAnswer,
    bool IsCorrect,
    int PointsEarned,
    string? Explanation,
    List<string>? CorrectOptions
);

public record UpdateQuizRequest(
    string? Title,
    string? Description,
    double? PassingScore,
    int? TimeLimitMinutes,
    int? MaxAttempts,
    bool? ShuffleQuestions,
    bool? ShuffleOptions,
    bool? ShowCorrectAnswers,
    bool? IsPublished
);

public record AddQuestionRequest(
    string Text,
    string Type,
    List<CreateOptionRequest> Options,
    string? CorrectAnswer,
    string? Explanation,
    int? Points,
    int? OrderIndex
);

public record UpdateQuestionRequest(
    string? Text,
    string? Type,
    List<CreateOptionRequest>? Options,
    string? CorrectAnswer,
    string? Explanation,
    int? Points,
    int? OrderIndex
);

public record QuizAttemptResponse(
    string Id,
    string QuizId,
    long StudentId,
    string StudentName,
    double Score,
    int TotalPoints,
    int EarnedPoints,
    bool IsPassed,
    DateTime StartedAt,
    DateTime CompletedAt,
    int TimeTakenSeconds,
    List<QuizAnswerResponse>? Answers
);

public record QuizAnswerResponse(
    string QuestionId,
    List<string> SelectedOptions,
    string? TextAnswer,
    bool IsCorrect,
    int PointsEarned
);
