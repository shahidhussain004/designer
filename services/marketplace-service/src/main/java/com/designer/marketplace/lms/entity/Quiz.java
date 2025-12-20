package com.designer.marketplace.lms.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "quizzes")
public class Quiz {

    @Id
    private String id;
    
    @Indexed
    private String courseId;
    
    @Indexed
    private String lessonId;
    
    private String title;
    private String description;
    
    @Builder.Default
    private List<Question> questions = new ArrayList<>();
    
    private Integer passingScore;  // Percentage required to pass (0-100)
    private Integer timeLimit;     // Time limit in minutes (null = no limit)
    private Integer maxAttempts;   // Max attempts allowed (null = unlimited)
    
    @Builder.Default
    private Boolean shuffleQuestions = false;
    
    @Builder.Default
    private Boolean shuffleOptions = false;
    
    @Builder.Default
    private Boolean showCorrectAnswers = true;  // After submission
    
    @Builder.Default
    private Boolean isActive = true;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public void addQuestion(Question question) {
        if (question.getId() == null) {
            question.setId(UUID.randomUUID().toString());
        }
        questions.add(question);
    }
    
    public int getTotalPoints() {
        return questions.stream()
                .mapToInt(q -> q.getPoints() != null ? q.getPoints() : 1)
                .sum();
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Question {
        private String id;
        private QuestionType type;
        private String questionText;
        private String explanation;  // Shown after answering
        
        @Builder.Default
        private List<Option> options = new ArrayList<>();
        
        @Builder.Default
        private List<String> correctAnswers = new ArrayList<>();  // For multiple choice/multi-select
        
        private String correctTextAnswer;  // For fill-in-blank
        
        @Builder.Default
        private Integer points = 1;
        
        private Integer orderIndex;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Option {
        private String id;
        private String text;
        private Boolean isCorrect;
        private Integer orderIndex;
    }
    
    public enum QuestionType {
        MULTIPLE_CHOICE,      // Single correct answer
        MULTI_SELECT,         // Multiple correct answers
        TRUE_FALSE,           // True/False
        FILL_IN_BLANK,        // Text answer
        MATCHING,             // Match pairs
        ORDERING              // Put in correct order
    }
}
