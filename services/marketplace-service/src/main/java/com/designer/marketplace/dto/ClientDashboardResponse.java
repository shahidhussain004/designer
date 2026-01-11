package com.designer.marketplace.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Client Dashboard response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientDashboardResponse {

    private DashboardStats stats;
    private List<ProjectResponse> activeProjects;
    private List<ProjectResponse> completedProjects;
    private List<ProposalResponse> recentProposals;
    private List<JobResponse> openJobs;
    private List<JobApplicationResponse> recentApplications;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DashboardStats {
        private Long totalProjectsPosted;
        private Long activeProjects;
        private Long completedProjects;
        private Long totalProposalsReceived;
        private Long pendingProposals;
        private Long totalJobsPosted;
        private Long openJobs;
        private Long totalApplicationsReceived;
        private Long filledJobs;
    }
}
