package com.designer.marketplace.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.designer.marketplace.dto.AuthResponse;
import com.designer.marketplace.dto.LoginRequest;
import com.designer.marketplace.dto.RefreshTokenRequest;
import com.designer.marketplace.dto.RegisterRequest;
import com.designer.marketplace.security.LoginAttemptService;
import com.designer.marketplace.security.SecurityAuditService;
import com.designer.marketplace.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

/**
 * Authentication REST Controller
 * Endpoints: /api/auth/*
 * Enhanced with security features: brute force protection, audit logging
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    
    private final AuthService authService;
    private final LoginAttemptService loginAttemptService;
    private final SecurityAuditService securityAuditService;
    
    public AuthController(AuthService authService, 
                         LoginAttemptService loginAttemptService,
                         SecurityAuditService securityAuditService) {
        this.authService = authService;
        this.loginAttemptService = loginAttemptService;
        this.securityAuditService = securityAuditService;
    }

    /**
     * TEMP TEST - Simple health check
     */
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        log.info("==== GET /api/auth/test called ====");
        return ResponseEntity.ok("Backend is reachable! Security filters are working.");
    }

    /**
     * DEBUG - Check current user authorities
     */
    @GetMapping("/debug/authorities")
    public ResponseEntity<?> debugAuthorities() {
        org.springframework.security.core.Authentication auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        log.info("==== DEBUG: Current Authentication: {} ====", auth);
        if (auth != null && auth.isAuthenticated()) {
            return ResponseEntity.ok(new java.util.HashMap<String, Object>() {{
                put("principal", auth.getPrincipal());
                put("authorities", auth.getAuthorities());
                put("name", auth.getName());
            }});
        }
        return ResponseEntity.status(401).body("Not authenticated");
    }

    /**
     * POST /api/auth/register
     * Register a new user
     */
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request,
                                                 HttpServletRequest httpRequest) {
        String companyIp = getCompanyIp(httpRequest);
        log.info("==== POST /api/auth/register called - Email: {}, Username: {}, Role: {} ====",
                request.getEmail(), request.getUsername(), request.getRole());
        
        AuthResponse response = authService.register(request);
        
        securityAuditService.logRegistration(
                response.getUser().getId(), 
                response.getUser().getEmail(), 
                companyIp);
        
        log.info("==== Registration successful for user: {} ====", response.getUser().getUsername());
        return ResponseEntity.ok(response);
    }

    /**
     * POST /api/auth/login
     * Login user and return JWT tokens
     * Includes brute force protection
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request,
                                   HttpServletRequest httpRequest) {
        String companyIp = getCompanyIp(httpRequest);
        String loginKey = request.getEmailOrUsername().toLowerCase();
        
        log.info("==== POST /api/auth/login called - EmailOrUsername: {} from IP: {} ====", 
                request.getEmailOrUsername(), companyIp);
        
        // Check if account is locked due to failed attempts
        if (loginAttemptService.isBlocked(loginKey)) {
            log.warn("Login attempt for locked account: {}", loginKey);
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(new ErrorResponse("Account temporarily locked due to too many failed attempts. Please try again later."));
        }
        
        // Check if IP is blocked
        if (loginAttemptService.isIpBlocked(companyIp)) {
            log.warn("Login attempt from blocked IP: {}", companyIp);
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(new ErrorResponse("Too many failed attempts from this location. Please try again later."));
        }
        
        try {
            AuthResponse response = authService.login(request);
            
            // Successful login - reset failed attempts
            loginAttemptService.loginSucceeded(loginKey);
            securityAuditService.logLoginSuccess(
                    response.getUser().getId(), 
                    response.getUser().getEmail(), 
                    companyIp);
            
            log.info("==== Login successful for user: {} ====", response.getUser().getUsername());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            // Failed login - record attempt
            loginAttemptService.loginFailed(loginKey, companyIp);
            securityAuditService.logLoginFailure(loginKey, e.getMessage(), companyIp);
            
            int remaining = loginAttemptService.getRemainingAttempts(loginKey);
            String message = remaining > 0 
                    ? "Invalid credentials. " + remaining + " attempts remaining."
                    : "Account locked due to too many failed attempts.";
            
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ErrorResponse(message));
        }
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
    
    /**
     * Extract company IP address, handling proxies
     */
    private String getCompanyIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        return request.getRemoteAddr();
    }
    
    /**
     * Simple error response DTO
     */
    public static class ErrorResponse {
        private String error;
        
        public ErrorResponse(String error) {
            this.error = error;
        }
        
        public String getError() {
            return error;
        }
    }
}
