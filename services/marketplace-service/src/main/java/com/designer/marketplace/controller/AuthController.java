package com.designer.marketplace.controller;

import com.designer.marketplace.dto.*;
import com.designer.marketplace.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication REST Controller
 * Endpoints: /api/auth/*
 */
@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    /**
     * TEMP TEST - Simple health check
     */
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        log.info("==== GET /api/auth/test called ====");
        return ResponseEntity.ok("Backend is reachable! Security filters are working.");
    }

    /**
     * POST /api/auth/register
     * Register a new user
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        log.info("==== POST /api/auth/register called - Email: {}, Username: {}, Role: {} ====",
                request.getEmail(), request.getUsername(), request.getRole());
        AuthResponse response = authService.register(request);
        log.info("==== Registration successful for user: {} ====", response.getUser().getUsername());
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/login
     * Login user and return JWT tokens
     */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        log.info("==== POST /api/auth/login called - EmailOrUsername: {} ====", request.getEmailOrUsername());
        AuthResponse response = authService.login(request);
        log.info("==== Login successful for user: {} ====", response.getUser().getUsername());
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/refresh
     * Refresh access token using refresh token
     */
    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@RequestBody RefreshTokenRequest request) {
        log.info("==== POST /api/auth/refresh called ====");
        AuthResponse response = authService.refreshToken(request.getRefreshToken());
        log.info("==== Token refresh successful ====");
        return ResponseEntity.ok(response);
    }
}
