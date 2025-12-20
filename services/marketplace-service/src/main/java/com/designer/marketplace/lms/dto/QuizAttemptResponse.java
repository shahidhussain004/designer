package com.designer.marketplace.lms.dto;

import com.designer.marketplace.lms.entity.QuizAttempt;
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
public class QuizAttemptResponse {

    private String id;
    private String quizId;
    private String quizTitle;
    private Integer attemptNumber;
    private List<AnswerResponse> answers;
    private Integer score;
    private Integer maxScore;
    private Double percentage;
    private Boolean passed;
    private QuizAttempt.AttemptStatus status;
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
    private Integer timeSpentSeconds;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AnswerResponse {
        private String questionId;
        private List<String> selectedOptions;
        private String textAnswer;
        private Boolean isCorrect;
        private LocalDateTime answeredAt;
    }
    
    public static QuizAttemptResponse fromEntity(QuizAttempt attempt, String quizTitle) {
        List<AnswerResponse> answers = attempt.getAnswers().stream()
                .map(a -> AnswerResponse.builder()
                        .questionId(a.getQuestionId())
                        .selectedOptions(a.getSelectedOptions())
                        .textAnswer(a.getTextAnswer())
                        .isCorrect(a.getIsCorrect())
                        .answeredAt(a.getAnsweredAt())
                        .build())
                .collect(Collectors.toList());
        
        return QuizAttemptResponse.builder()
                .id(attempt.getId())
                .quizId(attempt.getQuizId())
                .quizTitle(quizTitle)
                .attemptNumber(attempt.getAttemptNumber())
                .answers(answers)
                .score(attempt.getScore())
                .maxScore(attempt.getMaxScore())
                .percentage(attempt.getPercentage())
                .passed(attempt.getPassed())
                .status(attempt.getStatus())
                .startedAt(attempt.getStartedAt())
                .submittedAt(attempt.getSubmittedAt())
                .timeSpentSeconds(attempt.getTimeSpentSeconds())
                .build();
    }
}
