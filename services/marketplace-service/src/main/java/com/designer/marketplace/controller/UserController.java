package com.designer.marketplace.controller;

import com.designer.marketplace.dto.UserResponse;
import com.designer.marketplace.dto.UserUpdateRequest;
import com.designer.marketplace.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

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
@RequestMapping("/api/users")
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
    @PreAuthorize("isAuthenticated() and (@userService.isOwner(#id) or hasRole('ADMIN'))")
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
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("Getting all users - page: {}, size: {}", page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<UserResponse> users = userService.getAllUsers(pageable);
        return ResponseEntity.ok(users);
    }
}
