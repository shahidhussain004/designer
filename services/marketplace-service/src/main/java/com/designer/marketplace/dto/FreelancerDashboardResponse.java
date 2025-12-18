package com.designer.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

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
    private List<JobResponse> availableJobs;

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
