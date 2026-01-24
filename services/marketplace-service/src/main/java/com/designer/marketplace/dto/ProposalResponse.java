package com.designer.marketplace.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.designer.marketplace.entity.Proposal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Proposal responses
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProposalResponse {

    private Long id;
    private Long projectId;
    private String projectTitle;
    private FreelancerInfo freelancer;
    private String coverLetter;
    private Double proposedRate;
    private Integer estimatedDuration;
    private String status;
    private String companyMessage;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Nested DTO for freelancer information
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FreelancerInfo {
        private Long id;
        private String username;
        private String fullName;
        private String profileImageUrl;
        private String location;
        private String bio;
        private Double hourlyRate;
        private List<String> skills;
        private String portfolioUrl;
        private BigDecimal ratingAvg;
        private Integer ratingCount;
    }

    /**
     * Convert Proposal entity to ProposalResponse DTO
     */
    public static ProposalResponse fromEntity(Proposal proposal) {
        if (proposal == null) {
            return null;
        }

        FreelancerInfo freelancerInfo = null;
        if (proposal.getFreelancer() != null && proposal.getFreelancer().getUser() != null) {
            freelancerInfo = FreelancerInfo.builder()
                    .id(proposal.getFreelancer().getId())
                    .username(proposal.getFreelancer().getUser().getUsername())
                    .fullName(proposal.getFreelancer().getUser().getFullName())
                    .profileImageUrl(proposal.getFreelancer().getUser().getProfileImageUrl())
                    .location(proposal.getFreelancer().getUser().getLocation())
                    .bio(proposal.getFreelancer().getUser().getBio())
                    .hourlyRate(proposal.getFreelancer().getHourlyRateCents() != null ? proposal.getFreelancer().getHourlyRateCents().doubleValue() / 100.0 : null)
                    .skills(proposal.getFreelancer().getSkills() != null ? java.util.Arrays.asList(proposal.getFreelancer().getSkills().asText().split(",")) : new java.util.ArrayList<>())
                    .portfolioUrl(proposal.getFreelancer().getPortfolioUrl())
                    .ratingAvg(proposal.getFreelancer().getUser().getRatingAvg() != null ? proposal.getFreelancer().getUser().getRatingAvg() : BigDecimal.ZERO)
                    .ratingCount(proposal.getFreelancer().getUser().getRatingCount() != null ? proposal.getFreelancer().getUser().getRatingCount() : 0)
                    .build();
        }

        return ProposalResponse.builder()
                .id(proposal.getId())
                .projectId(proposal.getProject() != null ? proposal.getProject().getId() : null)
                .projectTitle(proposal.getProject() != null ? proposal.getProject().getTitle() : null)
                .freelancer(freelancerInfo)
                .coverLetter(proposal.getCoverLetter())
                .proposedRate(proposal.getSuggestedBudgetCents() != null ? proposal.getSuggestedBudgetCents().doubleValue() / 100.0 : null)
                .estimatedDuration(proposal.getEstimatedHours() != null ? proposal.getEstimatedHours().intValue() : null)
                .status(proposal.getStatus() != null ? proposal.getStatus().name() : null)
                .companyMessage(proposal.getCompanyNotes())
                .createdAt(proposal.getCreatedAt())
                .updatedAt(proposal.getUpdatedAt())
                .build();
    }
}
