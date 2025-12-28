package com.designer.marketplace.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for updating a job
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateJobRequest {

    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @Size(max = 10000, message = "Description must not exceed 10000 characters")
    private String description;

    private Long categoryId;

    private String[] requiredSkills;

    private Double budget;

    private String budgetType; // FIXED or HOURLY

    private Integer duration;

    private Long experienceLevelId;

    private String status; // DRAFT, OPEN, CLOSED, FILLED
}
