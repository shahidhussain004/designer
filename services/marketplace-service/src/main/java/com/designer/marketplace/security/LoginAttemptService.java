package com.designer.marketplace.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Login Attempt Tracker for brute force protection
 * Tracks failed login attempts and locks accounts temporarily
 */
@Service
public class LoginAttemptService {

    private static final Logger log = LoggerFactory.getLogger(LoginAttemptService.class);
    
    // Maximum failed attempts before lockout
    private static final int MAX_ATTEMPTS = 5;
    
    // Lockout duration in minutes
    private static final int LOCKOUT_MINUTES = 15;
    
    // Track failed attempts by email/username
    private final Map<String, LoginAttempt> attempts = new ConcurrentHashMap<>();
    
    // Track lockouts by IP address
    private final Map<String, LocalDateTime> ipLockouts = new ConcurrentHashMap<>();
    
    private final SecurityAuditService auditService;

    public LoginAttemptService(SecurityAuditService auditService) {
        this.auditService = auditService;
    }

    /**
     * Record a failed login attempt
     */
    public void loginFailed(String key, String ipAddress) {
        LoginAttempt attempt = attempts.computeIfAbsent(key, k -> new LoginAttempt());
        attempt.increment();
        
        log.warn("Failed login attempt for {} from IP {}. Attempt count: {}", 
                key, ipAddress, attempt.getCount());
        
        if (attempt.getCount() >= MAX_ATTEMPTS) {
            log.warn("Account {} locked due to {} failed attempts", key, MAX_ATTEMPTS);
            auditService.logEvent(SecurityAuditService.SecurityEventType.ACCOUNT_LOCKED, 
                    null, "Account locked after " + MAX_ATTEMPTS + " failed attempts: " + key, ipAddress);
        }
    }

    /**
     * Record a successful login (reset attempts)
     */
    public void loginSucceeded(String key) {
        attempts.remove(key);
    }

    /**
     * Check if account is blocked
     */
    public boolean isBlocked(String key) {
        LoginAttempt attempt = attempts.get(key);
        if (attempt == null) {
            return false;
        }
        
        // Check if lockout has expired
        if (attempt.getCount() >= MAX_ATTEMPTS) {
            if (attempt.getLastAttempt().plusMinutes(LOCKOUT_MINUTES).isBefore(LocalDateTime.now())) {
                // Lockout expired, reset
                attempts.remove(key);
                return false;
            }
            return true;
        }
        
        return false;
    }

    /**
     * Check if IP is blocked (for distributed brute force protection)
     */
    public boolean isIpBlocked(String ipAddress) {
        LocalDateTime lockoutTime = ipLockouts.get(ipAddress);
        if (lockoutTime == null) {
            return false;
        }
        
        if (lockoutTime.plusMinutes(LOCKOUT_MINUTES).isBefore(LocalDateTime.now())) {
            ipLockouts.remove(ipAddress);
            return false;
        }
        
        return true;
    }

    /**
     * Block an IP address
     */
    public void blockIp(String ipAddress, String reason) {
        ipLockouts.put(ipAddress, LocalDateTime.now());
        log.warn("IP {} blocked: {}", ipAddress, reason);
        auditService.logEvent(SecurityAuditService.SecurityEventType.SUSPICIOUS_ACTIVITY,
                null, "IP blocked: " + reason, ipAddress);
    }

    /**
     * Get remaining attempts for a key
     */
    public int getRemainingAttempts(String key) {
        LoginAttempt attempt = attempts.get(key);
        if (attempt == null) {
            return MAX_ATTEMPTS;
        }
        return Math.max(0, MAX_ATTEMPTS - attempt.getCount());
    }

    /**
     * Inner class to track login attempts
     */
    private static class LoginAttempt {
        private int count;
        private LocalDateTime lastAttempt;

        public LoginAttempt() {
            this.count = 0;
            this.lastAttempt = LocalDateTime.now();
        }

        public void increment() {
            this.count++;
            this.lastAttempt = LocalDateTime.now();
        }

        public int getCount() {
            return count;
        }

        public LocalDateTime getLastAttempt() {
            return lastAttempt;
        }
    }
}
