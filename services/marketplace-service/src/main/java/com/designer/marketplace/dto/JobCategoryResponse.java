package com.designer.marketplace.dto;

import com.designer.marketplace.entity.JobCategory;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for JobCategory responses
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobCategoryResponse {
    private Long id;
    private String name;
    private String slug;
    private String description;
    private String icon;
    private Integer displayOrder;
    private Boolean isActive;

    public static JobCategoryResponse fromEntity(JobCategory category) {
        return new JobCategoryResponse(
                category.getId(),
                category.getName(),
                category.getSlug(),
                category.getDescription(),
                category.getIcon(),
                category.getDisplayOrder(),
                category.getIsActive()
        );
    }
}
