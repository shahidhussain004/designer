package com.designer.marketplace.lms.dto;

import com.designer.marketplace.lms.entity.Quiz;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateQuizRequest {

    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    
    @NotNull(message = "Passing score is required")
    @Min(value = 0, message = "Passing score must be at least 0")
    @Max(value = 100, message = "Passing score cannot exceed 100")
    private Integer passingScore;
    
    @Min(value = 1, message = "Time limit must be at least 1 minute")
    private Integer timeLimit;
    
    @Min(value = 1, message = "Max attempts must be at least 1")
    private Integer maxAttempts;
    
    private Boolean shuffleQuestions;
    private Boolean shuffleOptions;
    private Boolean showCorrectAnswers;
    
    private List<QuestionRequest> questions;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuestionRequest {
        @NotNull(message = "Question type is required")
        private Quiz.QuestionType type;
        
        @NotBlank(message = "Question text is required")
        private String questionText;
        
        private String explanation;
        
        private List<OptionRequest> options;
        
        private List<String> correctAnswers;
        
        private String correctTextAnswer;
        
        @Min(value = 1, message = "Points must be at least 1")
        private Integer points;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OptionRequest {
        @NotBlank(message = "Option text is required")
        private String text;
        
        private Boolean isCorrect;
    }
}
