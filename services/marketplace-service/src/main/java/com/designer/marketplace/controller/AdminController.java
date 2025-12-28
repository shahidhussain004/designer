package com.designer.marketplace.controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.designer.marketplace.dto.AdminDashboardResponse;
import com.designer.marketplace.dto.AdminUpdateUserRequest;
import com.designer.marketplace.dto.AdminUserResponse;
import com.designer.marketplace.dto.JobResponse;
import com.designer.marketplace.entity.User.UserRole;
import com.designer.marketplace.security.UserPrincipal;
import com.designer.marketplace.service.AdminService;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private static final Logger log = LoggerFactory.getLogger(AdminController.class);
    
    private final AdminService adminService;
    
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // ==================== Dashboard ====================

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard(
            @AuthenticationPrincipal UserPrincipal principal) {
        log.info("Admin {} accessing dashboard", principal.getId());
        return ResponseEntity.ok(adminService.getDashboard());
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getSystemStats() {
        return ResponseEntity.ok(adminService.getSystemStats());
    }

    @GetMapping("/activity")
    public ResponseEntity<List<Map<String, Object>>> getRecentActivity(
            @RequestParam(defaultValue = "20") int limit) {
        return ResponseEntity.ok(adminService.getRecentActivity(limit));
    }

    // ==================== User Management ====================

    @GetMapping("/users")
    public ResponseEntity<Page<AdminUserResponse>> getUsers(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) UserRole role,
            @RequestParam(required = false) Boolean enabled,
            Pageable pageable) {
        return ResponseEntity.ok(adminService.getUsers(search, role, enabled, pageable));
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<AdminUserResponse> getUser(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.getUser(userId));
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<AdminUserResponse> updateUser(
            @PathVariable Long userId,
            @RequestBody AdminUpdateUserRequest request) {
        return ResponseEntity.ok(adminService.updateUser(userId, request));
    }

    @PostMapping("/users/{userId}/disable")
    public ResponseEntity<Void> disableUser(@PathVariable Long userId) {
        adminService.disableUser(userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/users/{userId}/enable")
    public ResponseEntity<Void> enableUser(@PathVariable Long userId) {
        adminService.enableUser(userId);
        return ResponseEntity.ok().build();
    }

    // ==================== Content Moderation ====================

    @GetMapping("/jobs/pending")
    public ResponseEntity<Page<JobResponse>> getPendingJobs(Pageable pageable,
            @AuthenticationPrincipal UserPrincipal principal) {
        log.info("Admin {} accessing pending jobs", principal != null ? principal.getId() : "null");
        return ResponseEntity.ok(adminService.getPendingReviewJobs(pageable));
    }

    @PostMapping("/jobs/{jobId}/approve")
    public ResponseEntity<Void> approveJob(@PathVariable Long jobId) {
        adminService.approveJob(jobId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/jobs/{jobId}/remove")
    public ResponseEntity<Void> removeJob(
            @PathVariable Long jobId,
            @RequestParam String reason) {
        adminService.removeJob(jobId, reason);
        return ResponseEntity.ok().build();
    }
}
