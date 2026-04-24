package com.designer.marketplace.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.designer.marketplace.dto.MessageResponse;
import com.designer.marketplace.dto.NotificationPreferenceRequest;
import com.designer.marketplace.dto.NotificationPreferenceResponse;
import com.designer.marketplace.dto.UserResponse;
import com.designer.marketplace.dto.UserUpdateRequest;
import com.designer.marketplace.dto.request.ChangePasswordRequest;
import com.designer.marketplace.dto.request.ForgotPasswordRequest;
import com.designer.marketplace.dto.request.ResetPasswordRequest;
import com.designer.marketplace.entity.User.UserRole;
import com.designer.marketplace.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Controller for user management endpoints
 * 
 * Endpoints:
 * - GET /api/users/me - Get current user profile
 * - GET /api/users/{id} - Get user by ID
 * - PUT /api/users/{id} - Update user profile
 * - GET /api/users - List all users (admin only)
 */
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    /**
     * Task 3.1: Get current user profile
     * GET /api/users/me
     */
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> getCurrentUser() {
        log.info("Getting current user profile");
        UserResponse user = userService.getCurrentUserProfile();
        return ResponseEntity.ok(user);
    }

    /**
     * Task 3.2: Get user by ID
     * GET /api/users/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long id) {
        log.info("Getting user by id: {}", id);
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    /**
     * Task 3.3: Update user profile
     * PUT /api/users/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated() and (@userService.isOwner(#id) or hasAuthority('ADMIN'))")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequest request) {
        log.info("Updating user profile: {}", id);
        UserResponse updatedUser = userService.updateUser(id, request);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Task 3.4: List all users (admin only)
     * GET /api/users?page=0&size=20
     */
    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Getting all users - page: {}, size: {}", page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<UserResponse> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }

    /**
     * Get user profile (public endpoint)
     * GET /api/users/{id}/profile
     */
    @GetMapping("/{id}/profile")
    public ResponseEntity<UserResponse> getUserProfile(@PathVariable Long id) {
        log.info("Getting user profile: {}", id);
        UserResponse user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    // GET /api/users/freelancers?page=0&size=20
    @GetMapping("/freelancers")
    public ResponseEntity<Page<UserResponse>> getFreelancers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserResponse> users = userService.findUsersByRole(UserRole.FREELANCER, pageable);
        return ResponseEntity.ok(users);
    }

    /**
     * Request password reset (public endpoint)
     * POST /api/users/forgot-password
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<MessageResponse> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {
        log.info("Processing forgot password request for email: {}", request.getEmail());
        userService.processForgotPasswordRequest(request.getEmail());
        return ResponseEntity.ok(new MessageResponse("Password reset instructions sent to your email"));
    }

    /**
     * Reset password with token (public endpoint)
     * POST /api/users/reset-password
     */
    @PostMapping("/reset-password")
    public ResponseEntity<MessageResponse> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {
        log.info("Processing password reset with token");
        userService.resetPassword(request.getToken(), request.getNewPassword());
        return ResponseEntity.ok(new MessageResponse("Password reset successfully"));
    }

    /**
     * Change password for authenticated user.
     * POST /api/users/change-password
     */
    @PostMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<MessageResponse> changePassword(
            @Valid @RequestBody ChangePasswordRequest request) {
        log.info("Changing password for current user");
        userService.changePassword(request.getCurrentPassword(), request.getNewPassword());
        return ResponseEntity.ok(new MessageResponse("Password changed successfully"));
    }

    /**
     * Get notification preferences (authenticated endpoint)
     * GET /api/users/me/notifications/preferences
     */
    @GetMapping("/me/notifications/preferences")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<NotificationPreferenceResponse> getNotificationPreferences() {
        log.info("Getting notification preferences for current user");
        NotificationPreferenceResponse preferences = userService.getNotificationPreferences();
        return ResponseEntity.ok(preferences);
    }

    /**
     * Update notification preferences (authenticated endpoint)
     * PUT /api/users/me/notifications/preferences
     */
    @PutMapping("/me/notifications/preferences")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<NotificationPreferenceResponse> updateNotificationPreferences(
            @Valid @RequestBody NotificationPreferenceRequest request) {
        log.info("Updating notification preferences for current user");
        NotificationPreferenceResponse preferences = userService.updateNotificationPreferences(request);
        return ResponseEntity.ok(preferences);
    }
}
