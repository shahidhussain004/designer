package com.designer.marketplace.dto;

import java.time.LocalDateTime;

import com.designer.marketplace.entity.ProjectCategory;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectCategoryResponse {

    private Long id;
    private String name;
    private String slug;
    private String description;
    private String icon;
    private Integer displayOrder;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static ProjectCategoryResponse fromEntity(ProjectCategory category) {
        if (category == null) {
            return null;
        }

        return ProjectCategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .description(category.getDescription())
                .icon(category.getIcon())
                .displayOrder(category.getDisplayOrder())
                .isActive(category.getIsActive())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}
