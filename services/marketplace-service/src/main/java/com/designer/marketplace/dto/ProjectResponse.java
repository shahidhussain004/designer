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
    private Long companyId;
    private CompanyInfo company;
    private String title;
    private String description;
    private String scopeOfWork;
    private ProjectCategoryResponse category;
    private List<String> requiredSkills;
    private List<String> preferredSkills;
    private Long budgetAmountCents;
    private Long budgetMinCents;
    private Long budgetMaxCents;
    private Double minBudget;
    private Double maxBudget;
    private String budgetType;
    private String currency;
    private String timeline;
    private Integer estimatedDurationDays;
    private String experienceLevel;
    private String experienceLevelCode;
    private String projectType;
    private String priorityLevel;
    private String status;
    private String visibility;
    private Boolean isFeatured;
    private Boolean isUrgent;
    private Integer viewsCount;
    private Integer proposalCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;
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

        // Parse required skills
        List<String> requiredSkillsList = new java.util.ArrayList<>();
        if (project.getRequiredSkills() != null && project.getRequiredSkills().isArray()) {
            project.getRequiredSkills().forEach(node -> requiredSkillsList.add(node.asText()));
        }

        // Parse preferred skills
        List<String> preferredSkillsList = new java.util.ArrayList<>();
        if (project.getPreferredSkills() != null && project.getPreferredSkills().isArray()) {
            project.getPreferredSkills().forEach(node -> preferredSkillsList.add(node.asText()));
        }

        return ProjectResponse.builder()
                .id(project.getId())
                .companyId(project.getCompany() != null ? project.getCompany().getId() : null)
                .company(companyInfo)
                .title(project.getTitle())
                .description(project.getDescription())
                .scopeOfWork(project.getScopeOfWork())
                .category(project.getProjectCategory() != null ? ProjectCategoryResponse.fromEntity(project.getProjectCategory()) : null)
                .requiredSkills(requiredSkillsList)
                .preferredSkills(preferredSkillsList)
                .budgetAmountCents(project.getBudgetMaxCents() != null ? project.getBudgetMaxCents() : project.getBudgetMinCents())
                .budgetMinCents(project.getBudgetMinCents())
                .budgetMaxCents(project.getBudgetMaxCents())
                .minBudget(project.getBudgetMinCents() != null ? project.getBudgetMinCents().doubleValue() / 100.0 : null)
                .maxBudget(project.getBudgetMaxCents() != null ? project.getBudgetMaxCents().doubleValue() / 100.0 : null)
                .budgetType(project.getBudgetType() != null ? project.getBudgetType().name() : null)
                .currency(project.getCurrency())
                .timeline(project.getTimeline())
                .estimatedDurationDays(project.getEstimatedDurationDays())
                .experienceLevel(project.getExperienceLevel())
                .experienceLevelCode(project.getExperienceLevel())
                .projectType(project.getProjectType())
                .priorityLevel(project.getPriorityLevel())
                .status(project.getStatus() != null ? project.getStatus().name() : null)
                .visibility(project.getVisibility())
                .isFeatured(project.getIsFeatured())
                .isUrgent(project.getIsUrgent())
                .viewsCount(project.getViewsCount())
                .proposalCount(project.getProposalCount())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .publishedAt(project.getPublishedAt())
                .closedAt(project.getClosedAt())
                .build();
    }
}
