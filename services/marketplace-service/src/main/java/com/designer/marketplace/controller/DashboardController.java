package com.designer.marketplace.controller;

import java.util.List;

import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.designer.marketplace.dto.ClientDashboardResponse;
import com.designer.marketplace.dto.FreelancerDashboardResponse;
import com.designer.marketplace.dto.NotificationResponse;
import com.designer.marketplace.service.DashboardService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

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
    private final Environment env;

    /**
     * Task 3.17: Get client dashboard
     * GET /api/dashboard/client
     */
    @GetMapping("/dashboard/client")
    public ResponseEntity<ClientDashboardResponse> getClientDashboard() {
        log.info("Getting client dashboard");

        // If running with 'local' profile, skip strict role check to aid local testing
        boolean isLocal = env != null && env.acceptsProfiles(Profiles.of("local"));
        if (!isLocal) {
            // Check if user has CLIENT role
            boolean hasClientRole = SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                    .stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_CLIENT"));
            if (!hasClientRole) {
                log.warn("Unauthorized access to client dashboard");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        } else {
            log.debug("Local profile active - bypassing client role check for dashboard");
        }

        try {
            ClientDashboardResponse dashboard = dashboardService.getClientDashboard();
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            log.error("Error getting client dashboard", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Task 3.18: Get freelancer dashboard
     * GET /api/dashboard/freelancer
     */
    @GetMapping("/dashboard/freelancer")
    public ResponseEntity<FreelancerDashboardResponse> getFreelancerDashboard() {
        log.info("Getting freelancer dashboard");

        boolean isLocalFreelancer = env != null && env.acceptsProfiles(Profiles.of("local"));
        if (!isLocalFreelancer) {
            boolean hasFreelancerRole = SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                    .stream().anyMatch(auth -> auth.getAuthority().equals("ROLE_FREELANCER"));
            if (!hasFreelancerRole) {
                log.warn("Unauthorized access to freelancer dashboard");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        } else {
            log.debug("Local profile active - bypassing freelancer role check for dashboard");
        }

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
