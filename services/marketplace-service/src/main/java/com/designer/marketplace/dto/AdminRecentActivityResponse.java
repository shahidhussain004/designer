package com.designer.marketplace.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for admin recent activity response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminRecentActivityResponse {
    private List<ActivityItem> recentUsers;
    private List<ActivityItem> recentJobs;
    private List<ActivityItem> recentContracts;
    private List<ActivityItem> recentDisputes;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ActivityItem {
        private Long id;
        private String type;
        private String description;
        private String userName;
        private LocalDateTime createdAt;
        private String status;
    }
}
