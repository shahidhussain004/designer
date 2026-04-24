package com.designer.marketplace.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.designer.marketplace.dto.CompanyDashboardResponse;
import com.designer.marketplace.dto.FreelancerDashboardResponse;
import com.designer.marketplace.dto.NotificationResponse;
import com.designer.marketplace.service.DashboardService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Controller for dashboard endpoints
 * 
 * Endpoints:
 * - GET /api/dashboards/company - Company dashboard
 * - GET /api/dashboards/freelancer - Freelancer dashboard
 * - GET /api/notifications - User notifications
 */
@RestController
@RequestMapping("")
@RequiredArgsConstructor
@Slf4j
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * Task 3.17: Get company dashboard
     * GET /api/dashboards/company
     * 
     * Requires COMPANY role. Will return 401 if token is expired, allowing frontend to refresh.
     */
    @GetMapping("/dashboards/company")
    @PreAuthorize("hasRole('COMPANY')")
    public ResponseEntity<CompanyDashboardResponse> getCompanyDashboard() {
        log.info("Getting company dashboard");

        try {
            CompanyDashboardResponse dashboard = dashboardService.getCompanyDashboard();
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            log.error("Error getting company dashboard", e);
            log.error("Stack trace: ", e);
            // Return more detailed error for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    /**
     * Task 3.18: Get freelancer dashboard
     * GET /api/dashboards/freelancer
     * 
     * Requires FREELANCER role. Will return 401 if token is expired, allowing frontend to refresh.
     */
    @GetMapping("/dashboards/freelancer")
    @PreAuthorize("hasRole('FREELANCER')")
    public ResponseEntity<FreelancerDashboardResponse> getFreelancerDashboard() {
        log.info("Getting freelancer dashboard");

        try {
            FreelancerDashboardResponse dashboard = dashboardService.getFreelancerDashboard();
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            log.error("Error getting freelancer dashboard", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
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
