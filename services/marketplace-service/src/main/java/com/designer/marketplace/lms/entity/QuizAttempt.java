package com.designer.marketplace.lms.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "quiz_attempts")
@CompoundIndex(name = "user_quiz_idx", def = "{'userId': 1, 'quizId': 1}")
public class QuizAttempt {

    @Id
    private String id;
    
    @Indexed
    private Long userId;
    
    @Indexed
    private String quizId;
    
    @Indexed
    private String courseId;
    
    @Indexed
    private String enrollmentId;
    
    private Integer attemptNumber;
    
    @Builder.Default
    private List<Answer> answers = new ArrayList<>();
    
    private Integer score;           // Points earned
    private Integer maxScore;        // Total possible points
    private Double percentage;       // Score percentage
    private Boolean passed;
    
    @Builder.Default
    private AttemptStatus status = AttemptStatus.IN_PROGRESS;
    
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
    private Integer timeSpentSeconds;
    
    public void addAnswer(Answer answer) {
        answers.add(answer);
    }
    
    public void calculateScore(Quiz quiz) {
        int earnedPoints = 0;
        int totalPoints = 0;
        
        for (Quiz.Question question : quiz.getQuestions()) {
            int questionPoints = question.getPoints() != null ? question.getPoints() : 1;
            totalPoints += questionPoints;
            
            Answer answer = answers.stream()
                    .filter(a -> a.getQuestionId().equals(question.getId()))
                    .findFirst()
                    .orElse(null);
            
            if (answer != null && isCorrect(question, answer)) {
                earnedPoints += questionPoints;
                answer.setIsCorrect(true);
            } else if (answer != null) {
                answer.setIsCorrect(false);
            }
        }
        
        this.score = earnedPoints;
        this.maxScore = totalPoints;
        this.percentage = totalPoints > 0 ? (double) earnedPoints / totalPoints * 100 : 0;
        this.passed = quiz.getPassingScore() != null && this.percentage >= quiz.getPassingScore();
    }
    
    private boolean isCorrect(Quiz.Question question, Answer answer) {
        switch (question.getType()) {
            case MULTIPLE_CHOICE:
            case TRUE_FALSE:
                return !question.getCorrectAnswers().isEmpty() && 
                       !answer.getSelectedOptions().isEmpty() &&
                       question.getCorrectAnswers().get(0).equals(answer.getSelectedOptions().get(0));
            
            case MULTI_SELECT:
                if (answer.getSelectedOptions() == null || question.getCorrectAnswers() == null) {
                    return false;
                }
                return answer.getSelectedOptions().size() == question.getCorrectAnswers().size() &&
                       answer.getSelectedOptions().containsAll(question.getCorrectAnswers());
            
            case FILL_IN_BLANK:
                return question.getCorrectTextAnswer() != null && 
                       answer.getTextAnswer() != null &&
                       question.getCorrectTextAnswer().trim().equalsIgnoreCase(answer.getTextAnswer().trim());
            
            default:
                return false;
        }
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Answer {
        private String questionId;
        
        @Builder.Default
        private List<String> selectedOptions = new ArrayList<>();  // Option IDs selected
        
        private String textAnswer;     // For fill-in-blank
        private Boolean isCorrect;
        private LocalDateTime answeredAt;
    }
    
    public enum AttemptStatus {
        IN_PROGRESS,
        SUBMITTED,
        TIMED_OUT,
        ABANDONED
    }
}
