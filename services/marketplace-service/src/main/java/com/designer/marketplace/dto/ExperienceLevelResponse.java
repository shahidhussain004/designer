package com.designer.marketplace.dto;

import com.designer.marketplace.entity.ExperienceLevel;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for ExperienceLevel responses
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExperienceLevelResponse {
    private Long id;
    private String name;
    private String code;
    private String description;
    private Integer yearsMin;
    private Integer yearsMax;
    private Integer displayOrder;
    private Boolean isActive;

    public static ExperienceLevelResponse fromEntity(ExperienceLevel level) {
        return new ExperienceLevelResponse(
                level.getId(),
                level.getName(),
                level.getCode(),
                level.getDescription(),
                level.getYearsMin(),
                level.getYearsMax(),
                level.getDisplayOrder(),
                level.getIsActive()
        );
    }
}
