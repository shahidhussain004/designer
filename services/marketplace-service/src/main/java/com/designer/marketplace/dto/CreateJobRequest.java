package com.designer.marketplace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating a new job
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateJobRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 10000, message = "Description must not exceed 10000 characters")
    private String description;

    @Size(max = 50, message = "Category must not exceed 50 characters")
    private String category;

    private String[] requiredSkills;

    private Double budget;

    private String budgetType; // FIXED or HOURLY

    private Integer duration;

    private String experienceLevel; // ENTRY, INTERMEDIATE, EXPERT

    private String status; // DRAFT or OPEN
}
