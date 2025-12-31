package com.designer.marketplace.dto;

import java.time.LocalDateTime;

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
    private ClientInfo client;
    private String title;
    private String description;
    private ProjectCategoryResponse category;
    private String[] requiredSkills;
    private Double budget;
    private String budgetType;
    private Integer duration;
    private ExperienceLevelResponse experienceLevel;
    private String status;
    private Boolean isFeatured;
    private Integer viewCount;
    private Integer proposalCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime closedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ClientInfo {
        private Long id;
        private String username;
        private String fullName;
        private String profileImageUrl;
        private String location;
        private Double ratingAvg;
        private Integer ratingCount;
    }

    public static ProjectResponse fromEntity(Project project) {
        if (project == null) {
            return null;
        }

        ClientInfo clientInfo = null;
        if (project.getClient() != null) {
            clientInfo = ClientInfo.builder()
                    .id(project.getClient().getId())
                    .username(project.getClient().getUsername())
                    .fullName(project.getClient().getFullName())
                    .profileImageUrl(project.getClient().getProfileImageUrl())
                    .location(project.getClient().getLocation())
                    .ratingAvg(project.getClient().getRatingAvg())
                    .ratingCount(project.getClient().getRatingCount())
                    .build();
        }

        return ProjectResponse.builder()
                .id(project.getId())
                .client(clientInfo)
                .title(project.getTitle())
                .description(project.getDescription())
                .category(project.getProjectCategory() != null ? ProjectCategoryResponse.fromEntity(project.getProjectCategory()) : null)
                .requiredSkills(project.getRequiredSkills())
                .budget(project.getBudget())
                .budgetType(project.getBudgetType() != null ? project.getBudgetType().name() : null)
                .duration(project.getDuration())
                .experienceLevel(project.getExperienceLevelEntity() != null ? ExperienceLevelResponse.fromEntity(project.getExperienceLevelEntity()) : null)
                .status(project.getStatus() != null ? project.getStatus().name() : null)
                .isFeatured(project.getIsFeatured())
                .viewCount(project.getViewCount())
                .proposalCount(project.getProposalCount())
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .closedAt(project.getClosedAt())
                .build();
    }
}
