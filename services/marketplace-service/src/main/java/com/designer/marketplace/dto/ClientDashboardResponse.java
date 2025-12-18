package com.designer.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for Client Dashboard response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientDashboardResponse {

    private DashboardStats stats;
    private List<JobResponse> activeJobs;
    private List<ProposalResponse> recentProposals;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DashboardStats {
        private Long totalJobsPosted;
        private Long activeJobs;
        private Long completedJobs;
        private Long totalProposalsReceived;
        private Long pendingProposals;
    }
}
