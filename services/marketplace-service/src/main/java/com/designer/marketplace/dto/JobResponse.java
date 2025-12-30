package com.designer.marketplace.dto;

import java.time.LocalDateTime;

import com.designer.marketplace.entity.Job;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Job responses
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobResponse {

    private Long id;
    private ClientInfo client;
    private String title;
    private String description;
    
    // Structured category object
    private JobCategoryResponse category;
    
    private String[] requiredSkills;
    private Double budget;
    private String budgetType;
    private Integer duration;
    
    // Structured experience level object
    private ExperienceLevelResponse experienceLevel;
    
    private String status;
    private Boolean isFeatured;
    private Integer viewCount;
    private Integer proposalCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime closedAt;

    /**
     * Nested DTO for client information
     */
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

    /**
     * Convert Job entity to JobResponse DTO
     */
    public static JobResponse fromEntity(Job job) {
        if (job == null) {
            return null;
        }

        ClientInfo clientInfo = null;
        if (job.getClient() != null) {
            clientInfo = ClientInfo.builder()
                    .id(job.getClient().getId())
                    .username(job.getClient().getUsername())
                    .fullName(job.getClient().getFullName())
                    .profileImageUrl(job.getClient().getProfileImageUrl())
                    .location(job.getClient().getLocation())
                    .ratingAvg(job.getClient().getRatingAvg())
                    .ratingCount(job.getClient().getRatingCount())
                    .build();
        }

        return JobResponse.builder()
                .id(job.getId())
                .client(clientInfo)
                .title(job.getTitle())
                .description(job.getDescription())
                .category(job.getJobCategory() != null ? JobCategoryResponse.fromEntity(job.getJobCategory()) : null)
                .requiredSkills(job.getRequiredSkills())
                .budget(job.getBudget())
                .budgetType(job.getBudgetType() != null ? job.getBudgetType().name() : null)
                .duration(job.getDuration())
                .experienceLevel(job.getExperienceLevelEntity() != null ? ExperienceLevelResponse.fromEntity(job.getExperienceLevelEntity()) : null)
                .status(job.getStatus() != null ? job.getStatus().name() : null)
                .isFeatured(job.getIsFeatured())
                .viewCount(job.getViewCount())
                .proposalCount(job.getProposalCount())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .closedAt(job.getClosedAt())
                .build();
    }
}
