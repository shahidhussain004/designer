package com.designer.marketplace.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Freelancer Dashboard response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FreelancerDashboardResponse {

    private DashboardStats stats;
    private List<ProposalResponse> myProposals;
    private List<ProjectResponse> availableProjects;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DashboardStats {
        private Long totalProposalsSubmitted;
        private Long activeProposals;
        private Long acceptedProposals;
        private Long completedProjects;
    }
}
