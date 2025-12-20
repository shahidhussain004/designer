package com.designer.marketplace.security;

import com.designer.marketplace.config.RateLimitConfig.RateLimiterService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Rate limiting filter to prevent abuse of API endpoints
 * Applies stricter limits to authentication endpoints
 */
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RateLimitFilter.class);
    
    private final RateLimiterService rateLimiterService;

    public RateLimitFilter(RateLimiterService rateLimiterService) {
        this.rateLimiterService = rateLimiterService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        
        String clientIp = getClientIp(request);
        String requestPath = request.getRequestURI();
        
        boolean allowed;
        
        // Apply stricter rate limiting to auth endpoints
        if (requestPath.startsWith("/api/auth/")) {
            allowed = rateLimiterService.tryConsumeAuth(clientIp);
            if (!allowed) {
                log.warn("Rate limit exceeded for auth endpoint from IP: {}", clientIp);
            }
        } else {
            allowed = rateLimiterService.tryConsumeGeneral(clientIp);
            if (!allowed) {
                log.warn("Rate limit exceeded for general endpoint from IP: {}", clientIp);
            }
        }
        
        if (!allowed) {
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");
            response.getWriter().write("{\"error\":\"Too many requests. Please try again later.\",\"status\":429}");
            return;
        }
        
        filterChain.doFilter(request, response);
    }

    /**
     * Extract client IP address, handling proxies
     */
    private String getClientIp(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            // Take the first IP in case of multiple proxies
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }
    
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Don't rate limit health checks and metrics
        String path = request.getRequestURI();
        return path.startsWith("/actuator/") || 
               path.equals("/health") ||
               path.startsWith("/swagger-ui/") ||
               path.startsWith("/api-docs/");
    }
}
