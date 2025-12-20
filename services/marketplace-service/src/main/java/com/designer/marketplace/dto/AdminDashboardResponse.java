package com.designer.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardResponse {

    // User statistics
    private Long totalUsers;
    private Long totalClients;
    private Long totalFreelancers;
    private Long newUsersToday;
    private Long newUsersThisWeek;
    private Long newUsersThisMonth;
    
    // Job statistics
    private Long totalJobs;
    private Long openJobs;
    private Long completedJobs;
    private Long activeJobs;
    
    // Proposal statistics
    private Long totalProposals;
    private Long pendingProposals;
    private Long acceptedProposals;
    
    // Payment statistics
    private Long totalPayments;
    private BigDecimal totalRevenue;
    private BigDecimal revenueThisMonth;
    private BigDecimal platformFees;
    
    // LMS statistics
    private Long totalCourses;
    private Long publishedCourses;
    private Long totalEnrollments;
    private Long certificatesIssued;
    
    // Activity timeline
    private List<ActivityEntry> recentActivity;
    
    // Charts data
    private Map<String, Long> userGrowthByMonth;
    private Map<String, BigDecimal> revenueByMonth;
    private Map<String, Long> jobsByCategory;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ActivityEntry {
        private LocalDateTime timestamp;
        private String type;  // USER_REGISTERED, JOB_POSTED, PAYMENT_COMPLETED, etc.
        private String description;
        private Long userId;
        private String userName;
    }
}
