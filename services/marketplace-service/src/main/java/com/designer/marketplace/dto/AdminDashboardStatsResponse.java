package com.designer.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for admin dashboard statistics response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDashboardStatsResponse {
    private long totalUsers;
    private long activeUsers;
    private long totalJobs;
    private long openJobs;
    private long totalContracts;
    private long activeContracts;
    private long completedContracts;
    private long openDisputes;
    private double totalRevenue;
    private double platformFees;
    private double totalPayments;
}
