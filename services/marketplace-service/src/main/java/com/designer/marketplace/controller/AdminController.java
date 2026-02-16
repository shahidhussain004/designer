package com.designer.marketplace.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.designer.marketplace.dto.AdminAnalyticsCategoriesResponse;
import com.designer.marketplace.dto.AdminAnalyticsJobsResponse;
import com.designer.marketplace.dto.AdminAnalyticsRevenueResponse;
import com.designer.marketplace.dto.AdminAnalyticsUserGrowthResponse;
import com.designer.marketplace.dto.AdminDashboardStatsResponse;
import com.designer.marketplace.dto.AdminDisputeResolveRequest;
import com.designer.marketplace.dto.AdminDisputeResponse;
import com.designer.marketplace.dto.AdminJobRejectRequest;
import com.designer.marketplace.dto.AdminJobResponse;
import com.designer.marketplace.dto.AdminUpdateUserStatusRequest;
import com.designer.marketplace.dto.AdminUserResponse;
import com.designer.marketplace.service.AdminService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Admin Controller - Handles all admin dashboard endpoints
 * 
 * Endpoints:
 * - GET /api/admin/dashboard/stats - Dashboard statistics
 * - GET /api/admin/dashboard/recent-activity - Recent activity
 * - GET /api/admin/users - List users
 * - GET /api/admin/users/{id} - Get user by ID
 * - PUT /api/admin/users/{id}/status - Update user status
 * - DELETE /api/admin/users/{id} - Delete user
 * - GET /api/admin/jobs - List jobs
 * - GET /api/admin/jobs/pending - Pending jobs
 * - PUT /api/admin/jobs/{id}/approve - Approve job
 * - PUT /api/admin/jobs/{id}/reject - Reject job
 * - DELETE /api/admin/jobs/{id} - Delete job
 * - GET /api/admin/disputes - List disputes
 * - GET /api/admin/disputes/{id} - Get dispute by ID
 * - PUT /api/admin/disputes/{id}/resolve - Resolve dispute
 * - PUT /api/admin/disputes/{id}/escalate - Escalate dispute
 * - GET /api/admin/analytics/user-growth - User growth analytics
 * - GET /api/admin/analytics/revenue - Revenue analytics
 * - GET /api/admin/analytics/jobs - Jobs analytics
 * - GET /api/admin/analytics/categories - Categories analytics
 */
@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@Slf4j
// @PreAuthorize("hasAuthority('ADMIN')") - Temporarily disabled for testing
public class AdminController {

    private final AdminService adminService;

    // ===== DASHBOARD ENDPOINTS =====

    /**
     * Get dashboard statistics
     * GET /api/admin/dashboard/stats
     */
    @GetMapping("/dashboard/stats")
    public ResponseEntity<AdminDashboardStatsResponse> getDashboardStats() {
        log.info("Getting admin dashboard stats");
        AdminDashboardStatsResponse stats = adminService.getDashboardStats();
        return ResponseEntity.ok(stats);
    }

    /**
     * Get recent activity
     * GET /api/admin/dashboard/recent-activity
     */
    @GetMapping("/dashboard/recent-activity")
    public ResponseEntity<?> getRecentActivity() {
        log.info("Getting recent activity");
        return ResponseEntity.ok(adminService.getRecentActivity());
    }

    // ===== USER MANAGEMENT ENDPOINTS =====

    /**
     * List all users
     * GET /api/admin/users?page=0&size=10&role=&status=
     */
    @GetMapping("/users")
    public ResponseEntity<Page<AdminUserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status) {
        log.info("Getting all users - page: {}, size: {}, role: {}, status: {}", page, size, role, status);
        Pageable pageable = PageRequest.of(page, size);
        Page<AdminUserResponse> users = adminService.getAllUsers(pageable, role, status);
        return ResponseEntity.ok(users);
    }

    /**
     * Get user by ID
     * GET /api/admin/users/{id}
     */
    @GetMapping("/users/{id}")
    public ResponseEntity<AdminUserResponse> getUserById(@PathVariable Long id) {
        log.info("Getting user by id: {}", id);
        AdminUserResponse user = adminService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    /**
     * Update user status
     * PUT /api/admin/users/{id}/status
     */
    @PutMapping("/users/{id}/status")
    public ResponseEntity<AdminUserResponse> updateUserStatus(
            @PathVariable Long id,
            @RequestBody AdminUpdateUserStatusRequest request) {
        log.info("Updating user status - id: {}, isActive: {}", id, request.isActive());
        AdminUserResponse user = adminService.updateUserStatus(id, request.isActive());
        return ResponseEntity.ok(user);
    }

    /**
     * Delete user
     * DELETE /api/admin/users/{id}
     */
    @DeleteMapping("/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        log.info("Deleting user: {}", id);
        adminService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    // ===== JOB MANAGEMENT ENDPOINTS =====

    /**
     * List all jobs
     * GET /api/admin/jobs?page=0&size=10&status=OPEN
     */
    @GetMapping("/jobs")
    public ResponseEntity<Page<AdminJobResponse>> getAllJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {
        log.info("Getting all jobs - page: {}, size: {}, status: {}", page, size, status);
        Pageable pageable = PageRequest.of(page, size);
        Page<AdminJobResponse> jobs = adminService.getAllJobs(pageable, status);
        return ResponseEntity.ok(jobs);
    }

    /**
     * Get pending jobs
     * GET /api/admin/jobs/pending
     */
    @GetMapping("/jobs/pending")
    public ResponseEntity<Page<AdminJobResponse>> getPendingJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Getting pending jobs - page: {}, size: {}", page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<AdminJobResponse> jobs = adminService.getPendingJobs(pageable);
        return ResponseEntity.ok(jobs);
    }

    /**
     * Approve job
     * PUT /api/admin/jobs/{id}/approve
     */
    @PutMapping("/jobs/{id}/approve")
    public ResponseEntity<AdminJobResponse> approveJob(@PathVariable Long id) {
        log.info("Approving job: {}", id);
        AdminJobResponse job = adminService.approveJob(id);
        return ResponseEntity.ok(job);
    }

    /**
     * Reject job
     * PUT /api/admin/jobs/{id}/reject
     */
    @PutMapping("/jobs/{id}/reject")
    public ResponseEntity<AdminJobResponse> rejectJob(
            @PathVariable Long id,
            @RequestBody AdminJobRejectRequest request) {
        log.info("Rejecting job: {} - reason: {}", id, request.getReason());
        AdminJobResponse job = adminService.rejectJob(id, request.getReason());
        return ResponseEntity.ok(job);
    }

    /**
     * Delete job
     * DELETE /api/admin/jobs/{id}
     */
    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        log.info("Deleting job: {}", id);
        adminService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    // ===== DISPUTE MANAGEMENT ENDPOINTS =====

    /**
     * List all disputes
     * GET /api/admin/disputes?page=0&size=10&status=PENDING
     */
    @GetMapping("/disputes")
    public ResponseEntity<Page<AdminDisputeResponse>> getAllDisputes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {
        log.info("Getting all disputes - page: {}, size: {}, status: {}", page, size, status);
        Pageable pageable = PageRequest.of(page, size);
        Page<AdminDisputeResponse> disputes = adminService.getAllDisputes(pageable, status);
        return ResponseEntity.ok(disputes);
    }

    /**
     * Get dispute by ID
     * GET /api/admin/disputes/{id}
     */
    @GetMapping("/disputes/{id}")
    public ResponseEntity<AdminDisputeResponse> getDisputeById(@PathVariable Long id) {
        log.info("Getting dispute by id: {}", id);
        AdminDisputeResponse dispute = adminService.getDisputeById(id);
        return ResponseEntity.ok(dispute);
    }

    /**
     * Resolve dispute
     * PUT /api/admin/disputes/{id}/resolve
     */
    @PutMapping("/disputes/{id}/resolve")
    public ResponseEntity<AdminDisputeResponse> resolveDispute(
            @PathVariable Long id,
            @RequestBody AdminDisputeResolveRequest request) {
        log.info("Resolving dispute: {} - resolution: {}", id, request.getResolution());
        AdminDisputeResponse dispute = adminService.resolveDispute(id, request);
        return ResponseEntity.ok(dispute);
    }

    /**
     * Escalate dispute
     * PUT /api/admin/disputes/{id}/escalate
     */
    @PutMapping("/disputes/{id}/escalate")
    public ResponseEntity<AdminDisputeResponse> escalateDispute(@PathVariable Long id) {
        log.info("Escalating dispute: {}", id);
        AdminDisputeResponse dispute = adminService.escalateDispute(id);
        return ResponseEntity.ok(dispute);
    }

    // ===== ANALYTICS ENDPOINTS =====

    /**
     * Get user growth analytics
     * GET /api/admin/analytics/user-growth
     */
    @GetMapping("/analytics/user-growth")
    public ResponseEntity<AdminAnalyticsUserGrowthResponse> getUserGrowthAnalytics() {
        log.info("Getting user growth analytics");
        AdminAnalyticsUserGrowthResponse data = adminService.getUserGrowthAnalytics();
        return ResponseEntity.ok(data);
    }

    /**
     * Get revenue analytics
     * GET /api/admin/analytics/revenue
     */
    @GetMapping("/analytics/revenue")
    public ResponseEntity<AdminAnalyticsRevenueResponse> getRevenueAnalytics() {
        log.info("Getting revenue analytics");
        AdminAnalyticsRevenueResponse data = adminService.getRevenueAnalytics();
        return ResponseEntity.ok(data);
    }

    /**
     * Get jobs analytics
     * GET /api/admin/analytics/jobs
     */
    @GetMapping("/analytics/jobs")
    public ResponseEntity<AdminAnalyticsJobsResponse> getJobsAnalytics() {
        log.info("Getting jobs analytics");
        AdminAnalyticsJobsResponse data = adminService.getJobsAnalytics();
        return ResponseEntity.ok(data);
    }

    /**
     * Get category distribution analytics
     * GET /api/admin/analytics/categories
     */
    @GetMapping("/analytics/categories")
    public ResponseEntity<AdminAnalyticsCategoriesResponse> getCategoryDistributionAnalytics() {
        log.info("Getting category distribution analytics");
        AdminAnalyticsCategoriesResponse data = adminService.getCategoryDistributionAnalytics();
        return ResponseEntity.ok(data);
    }
}
