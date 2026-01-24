package com.designer.marketplace.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.designer.marketplace.entity.Project;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProjectResponse {

    private Long id;
    private CompanyInfo company;
    private String title;
    private String description;
    private ProjectCategoryResponse category;
    private List<String> requiredSkills;
    private Double minBudget;
    private Double maxBudget;
    private String budgetType;
    private Integer estimatedDurationDays;
    private String experienceLevelCode;
    private String status;
    private Boolean isFeatured;
    private Integer viewsCount;
    private Integer proposalCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime closedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompanyInfo {
        private Long id;
        private String username;
        private String fullName;
        private String profileImageUrl;
        private String location;
        private BigDecimal ratingAvg;
        private Integer ratingCount;
    }

    public static ProjectResponse fromEntity(Project project) {
        if (project == null) {
            return null;
        }

        CompanyInfo companyInfo = null;
        if (project.getCompany() != null) {
            companyInfo = CompanyInfo.builder()
                    .id(project.getCompany().getId())
                    .username(project.getCompany().getUsername())
                    .fullName(project.getCompany().getFullName())
                    .profileImageUrl(project.getCompany().getProfileImageUrl())
                    .location(project.getCompany().getLocation())
                    // .ratingAvg(project.getCompany().getRatingAvg())
                    // .ratingCount(project.getCompany().getRatingCount())
                    .build();
        }

        return ProjectResponse.builder()
                .id(project.getId())
                .company(companyInfo)
                .title(project.getTitle())
                .description(project.getDescription())
                .category(project.getProjectCategory() != null ? ProjectCategoryResponse.fromEntity(project.getProjectCategory()) : null)
                .requiredSkills(project.getRequiredSkills() != null ? java.util.Arrays.asList(project.getRequiredSkills().asText().split(",")) : new java.util.ArrayList<>())
                .minBudget(project.getBudgetMinCents() != null ? project.getBudgetMinCents().doubleValue() / 100.0 : null)
                .maxBudget(project.getBudgetMaxCents() != null ? project.getBudgetMaxCents().doubleValue() / 100.0 : null)
                .budgetType(project.getBudgetType() != null ? project.getBudgetType().name() : null)
                .estimatedDurationDays(project.getEstimatedDurationDays())
                .experienceLevelCode(project.getExperienceLevel())
                .status(project.getStatus() != null ? project.getStatus().name() : null)
                .isFeatured(project.getIsFeatured())
                .viewsCount(project.getViewsCount())
                .proposalCount(project.getProposalCount())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .closedAt(project.getClosedAt())
                .build();
    }
}
