package com.designer.marketplace.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;

/**
 * Security Audit Logging Service
 * Logs all security-relevant events for compliance and monitoring
 */
@Service
public class SecurityAuditService {

    private static final Logger auditLog = LoggerFactory.getLogger("SECURITY_AUDIT");

    /**
     * Security event types for categorization
     */
    public enum SecurityEventType {
        LOGIN_SUCCESS,
        LOGIN_FAILURE,
        LOGOUT,
        TOKEN_REFRESH,
        TOKEN_INVALID,
        REGISTRATION,
        PASSWORD_CHANGE,
        PASSWORD_RESET_REQUEST,
        PASSWORD_RESET_COMPLETE,
        ACCOUNT_LOCKED,
        ACCOUNT_UNLOCKED,
        ADMIN_ACTION,
        RATE_LIMIT_EXCEEDED,
        SUSPICIOUS_ACTIVITY,
        UNAUTHORIZED_ACCESS,
        DATA_EXPORT,
        USER_DISABLED,
        USER_ENABLED,
        ROLE_CHANGE
    }

    /**
     * Log a security event
     */
    public void logEvent(SecurityEventType eventType, String userId, String description) {
        logEvent(eventType, userId, description, null, null);
    }

    /**
     * Log a security event with IP address
     */
    public void logEvent(SecurityEventType eventType, String userId, String description, String ipAddress) {
        logEvent(eventType, userId, description, ipAddress, null);
    }

    /**
     * Log a security event with full details
     */
    public void logEvent(SecurityEventType eventType, String userId, String description, 
                        String ipAddress, Map<String, Object> additionalData) {
        try {
            MDC.put("eventType", eventType.name());
            MDC.put("userId", userId != null ? userId : "anonymous");
            MDC.put("timestamp", Instant.now().toString());
            
            if (ipAddress != null) {
                MDC.put("ipAddress", ipAddress);
            }
            
            StringBuilder message = new StringBuilder();
            message.append("[SECURITY] ");
            message.append(eventType.name());
            message.append(" | User: ").append(userId != null ? userId : "anonymous");
            message.append(" | ").append(description);
            
            if (ipAddress != null) {
                message.append(" | IP: ").append(ipAddress);
            }
            
            if (additionalData != null && !additionalData.isEmpty()) {
                message.append(" | Data: ").append(additionalData);
            }
            
            // Log based on event severity
            switch (eventType) {
                case LOGIN_FAILURE:
                case TOKEN_INVALID:
                case RATE_LIMIT_EXCEEDED:
                case UNAUTHORIZED_ACCESS:
                case SUSPICIOUS_ACTIVITY:
                    auditLog.warn(message.toString());
                    break;
                case ACCOUNT_LOCKED:
                case USER_DISABLED:
                    auditLog.error(message.toString());
                    break;
                default:
                    auditLog.info(message.toString());
            }
        } finally {
            MDC.remove("eventType");
            MDC.remove("userId");
            MDC.remove("timestamp");
            MDC.remove("ipAddress");
        }
    }

    /**
     * Log login success
     */
    public void logLoginSuccess(Long userId, String email, String ipAddress) {
        logEvent(SecurityEventType.LOGIN_SUCCESS, userId.toString(), 
                "User logged in successfully: " + email, ipAddress);
    }

    /**
     * Log login failure
     */
    public void logLoginFailure(String email, String reason, String ipAddress) {
        logEvent(SecurityEventType.LOGIN_FAILURE, null, 
                "Login failed for " + email + ": " + reason, ipAddress);
    }

    /**
     * Log registration
     */
    public void logRegistration(Long userId, String email, String ipAddress) {
        logEvent(SecurityEventType.REGISTRATION, userId.toString(),
                "New user registered: " + email, ipAddress);
    }

    /**
     * Log admin action
     */
    public void logAdminAction(Long adminId, String action, String targetEntity, String targetId) {
        logEvent(SecurityEventType.ADMIN_ACTION, adminId.toString(),
                String.format("Admin action: %s on %s/%s", action, targetEntity, targetId));
    }

    /**
     * Log unauthorized access attempt
     */
    public void logUnauthorizedAccess(String userId, String requestUri, String ipAddress) {
        logEvent(SecurityEventType.UNAUTHORIZED_ACCESS, userId,
                "Unauthorized access attempt to: " + requestUri, ipAddress);
    }

    /**
     * Log role change
     */
    public void logRoleChange(Long adminId, Long userId, String oldRole, String newRole) {
        logEvent(SecurityEventType.ROLE_CHANGE, adminId.toString(),
                String.format("Role changed for user %d: %s -> %s", userId, oldRole, newRole));
    }

    /**
     * Log user disabled
     */
    public void logUserDisabled(Long adminId, Long userId, String reason) {
        logEvent(SecurityEventType.USER_DISABLED, adminId.toString(),
                String.format("User %d disabled: %s", userId, reason));
    }

    /**
     * Log user enabled
     */
    public void logUserEnabled(Long adminId, Long userId) {
        logEvent(SecurityEventType.USER_ENABLED, adminId.toString(),
                String.format("User %d enabled", userId));
    }
}
