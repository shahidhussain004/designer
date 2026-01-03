package com.designer.marketplace.dto;

import java.util.List;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateProjectRequest {

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 10000, message = "Description must not exceed 10000 characters")
    private String description;

    private Long categoryId;
    private List<String> requiredSkills;
    private Double budget;
    private String budgetType; // FIXED or HOURLY
    private Integer duration;
    private Long experienceLevelId;
    private String status; // DRAFT or OPEN
}
