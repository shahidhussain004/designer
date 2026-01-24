package com.designer.marketplace.dto;

import com.fasterxml.jackson.databind.JsonNode;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating a new job application
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateJobApplicationRequest {

    @NotNull(message = "Job ID is required")
    private Long jobId;

    @NotBlank(message = "Full name is required")
    @Size(min = 2, max = 255, message = "Full name must be between 2 and 255 characters")
    private String fullName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    @Size(max = 255, message = "Email must not exceed 255 characters")
    private String email;

    @Size(max = 20, message = "Phone must not exceed 20 characters")
    private String phone;

    private String coverLetter;

    private String resumeUrl;

    private String portfolioUrl;

    private String linkedinUrl;

    // Additional documents (array of URLs/paths)
    private String[] additionalDocuments;

    // Custom answers to job-specific screening questions (JSONB)
    private JsonNode answers;
}
