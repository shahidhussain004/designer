package com.designer.marketplace.lms.dto;

import com.designer.marketplace.lms.entity.Quiz;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizResponse {

    private String id;
    private String courseId;
    private String lessonId;
    private String title;
    private String description;
    private List<QuestionResponse> questions;
    private Integer passingScore;
    private Integer timeLimit;
    private Integer maxAttempts;
    private Boolean shuffleQuestions;
    private Boolean shuffleOptions;
    private Boolean showCorrectAnswers;
    private Boolean isActive;
    private Integer totalQuestions;
    private Integer totalPoints;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuestionResponse {
        private String id;
        private Quiz.QuestionType type;
        private String questionText;
        private String explanation;  // Only included after submission if showCorrectAnswers
        private List<OptionResponse> options;
        private List<String> correctAnswers;  // Only included after submission if showCorrectAnswers
        private Integer points;
        private Integer orderIndex;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OptionResponse {
        private String id;
        private String text;
        private Boolean isCorrect;  // Only included after submission if showCorrectAnswers
        private Integer orderIndex;
    }
    
    public static QuizResponse fromEntity(Quiz quiz, boolean includeAnswers) {
        List<QuestionResponse> questions = quiz.getQuestions().stream()
                .map(q -> QuestionResponse.builder()
                        .id(q.getId())
                        .type(q.getType())
                        .questionText(q.getQuestionText())
                        .explanation(includeAnswers ? q.getExplanation() : null)
                        .options(q.getOptions().stream()
                                .map(o -> OptionResponse.builder()
                                        .id(o.getId())
                                        .text(o.getText())
                                        .isCorrect(includeAnswers ? o.getIsCorrect() : null)
                                        .orderIndex(o.getOrderIndex())
                                        .build())
                                .collect(Collectors.toList()))
                        .correctAnswers(includeAnswers ? q.getCorrectAnswers() : null)
                        .points(q.getPoints())
                        .orderIndex(q.getOrderIndex())
                        .build())
                .collect(Collectors.toList());
        
        return QuizResponse.builder()
                .id(quiz.getId())
                .courseId(quiz.getCourseId())
                .lessonId(quiz.getLessonId())
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .questions(questions)
                .passingScore(quiz.getPassingScore())
                .timeLimit(quiz.getTimeLimit())
                .maxAttempts(quiz.getMaxAttempts())
                .shuffleQuestions(quiz.getShuffleQuestions())
                .shuffleOptions(quiz.getShuffleOptions())
                .showCorrectAnswers(quiz.getShowCorrectAnswers())
                .isActive(quiz.getIsActive())
                .totalQuestions(quiz.getQuestions().size())
                .totalPoints(quiz.getTotalPoints())
                .createdAt(quiz.getCreatedAt())
                .updatedAt(quiz.getUpdatedAt())
                .build();
    }
}
