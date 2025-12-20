package com.designer.marketplace.lms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmitQuizRequest {

    @NotBlank(message = "Quiz ID is required")
    private String quizId;
    
    @NotNull(message = "Answers are required")
    private List<AnswerSubmission> answers;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AnswerSubmission {
        @NotBlank(message = "Question ID is required")
        private String questionId;
        
        private List<String> selectedOptions;  // Option IDs for multiple choice
        private String textAnswer;             // For fill-in-blank
    }
}
