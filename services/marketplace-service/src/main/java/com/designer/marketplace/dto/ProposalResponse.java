package com.designer.marketplace.dto;

import java.time.LocalDateTime;

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
    private String clientMessage;
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
        private String[] skills;
        private String portfolioUrl;
        private Double ratingAvg;
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
        if (proposal.getFreelancer() != null) {
            freelancerInfo = FreelancerInfo.builder()
                    .id(proposal.getFreelancer().getId())
                    .username(proposal.getFreelancer().getUsername())
                    .fullName(proposal.getFreelancer().getFullName())
                    .profileImageUrl(proposal.getFreelancer().getProfileImageUrl())
                    .location(proposal.getFreelancer().getLocation())
                    .bio(proposal.getFreelancer().getBio())
                    .hourlyRate(proposal.getFreelancer().getHourlyRate())
                    .skills(proposal.getFreelancer().getSkills())
                    .portfolioUrl(proposal.getFreelancer().getPortfolioUrl())
                    .ratingAvg(proposal.getFreelancer().getRatingAvg())
                    .ratingCount(proposal.getFreelancer().getRatingCount())
                    .build();
        }

        return ProposalResponse.builder()
                .id(proposal.getId())
                .projectId(proposal.getProject() != null ? proposal.getProject().getId() : null)
                .projectTitle(proposal.getProject() != null ? proposal.getProject().getTitle() : null)
                .freelancer(freelancerInfo)
                .coverLetter(proposal.getCoverLetter())
                .proposedRate(proposal.getProposedRate())
                .estimatedDuration(proposal.getEstimatedDuration())
                .status(proposal.getStatus() != null ? proposal.getStatus().name() : null)
                .clientMessage(proposal.getClientMessage())
                .createdAt(proposal.getCreatedAt())
                .updatedAt(proposal.getUpdatedAt())
                .build();
    }
}
