package com.designer.marketplace.controller;

import com.designer.marketplace.dto.ClientDashboardResponse;
import com.designer.marketplace.dto.FreelancerDashboardResponse;
import com.designer.marketplace.dto.NotificationResponse;
import com.designer.marketplace.service.DashboardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Controller for dashboard endpoints
 * 
 * Endpoints:
 * - GET /api/dashboard/client - Client dashboard
 * - GET /api/dashboard/freelancer - Freelancer dashboard
 * - GET /api/notifications - User notifications
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * Task 3.17: Get client dashboard
     * GET /api/dashboard/client
     */
    @GetMapping("/dashboard/client")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<ClientDashboardResponse> getClientDashboard() {
        log.info("Getting client dashboard");
        ClientDashboardResponse dashboard = dashboardService.getClientDashboard();
        return ResponseEntity.ok(dashboard);
    }

    /**
     * Task 3.18: Get freelancer dashboard
     * GET /api/dashboard/freelancer
     */
    @GetMapping("/dashboard/freelancer")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<FreelancerDashboardResponse> getFreelancerDashboard() {
        log.info("Getting freelancer dashboard");
        FreelancerDashboardResponse dashboard = dashboardService.getFreelancerDashboard();
        return ResponseEntity.ok(dashboard);
    }

    /**
     * Task 3.19: Get user notifications
     * GET /api/notifications
     */
    @GetMapping("/notifications")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<NotificationResponse>> getNotifications() {
        log.info("Getting notifications");
        List<NotificationResponse> notifications = dashboardService.getNotifications();
        return ResponseEntity.ok(notifications);
    }
}
