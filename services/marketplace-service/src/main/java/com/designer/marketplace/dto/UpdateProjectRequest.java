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
    private Long categoryId;
    private List<String> requiredSkills;
    private Double budget;
    private String budgetType;
    private Integer duration;
    private Long experienceLevelId;
    private String status;
}
