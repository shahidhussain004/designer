package com.designer.marketplace.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProjectRequest {

    private String title;
    private String description;
    private String scopeOfWork;
    private Long categoryId;
    private List<String> requiredSkills;
    private List<String> preferredSkills;
    private Long budgetAmountCents;
    private Long budgetMinCents;
    private Long budgetMaxCents;
    private String budgetType;
    private String currency;
    private String timeline;
    private Integer estimatedHours;
    private Integer estimatedDurationDays;
    private String experienceLevel;
    private Long experienceLevelId;
    private String projectType;
    private String priorityLevel;
    private String status;
    private String visibility;
    private Boolean isFeatured;
    private Boolean isUrgent;
}
