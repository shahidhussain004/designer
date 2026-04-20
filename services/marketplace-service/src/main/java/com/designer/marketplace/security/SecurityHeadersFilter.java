package com.designer.marketplace.security;

import java.io.IOException;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Security headers filter to add recommended HTTP security headers
 * Helps prevent common web vulnerabilities
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class SecurityHeadersFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        
        // Allow Google GSI popup to communicate with parent window via postMessage
        response.setHeader("Cross-Origin-Opener-Policy", "allow-popups");
        
        // Prevent clickjacking attacks
        response.setHeader("X-Frame-Options", "SAMEORIGIN");
        
        // Prevent XSS attacks - browser will block content if XSS is detected
        response.setHeader("X-XSS-Protection", "1; mode=block");
        
        // Prevent MIME type sniffing
        response.setHeader("X-Content-Type-Options", "nosniff");
        
        // Control referrer information sent with requests
        response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
        
        // Content Security Policy - restrict resource loading
        response.setHeader("Content-Security-Policy", 
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://alcdn.msauth.net; " +
            "style-src 'self' 'unsafe-inline'; " +
            "img-src 'self' data: https:; " +
            "font-src 'self' data:; " +
            "connect-src 'self' https://api.stripe.com https://oauth2.googleapis.com https://graph.microsoft.com https://accounts.google.com https://alcdn.msauth.net; " +
            "frame-src https://accounts.google.com; " +
            "frame-ancestors 'none'");
        
        // Permissions Policy - control browser features
        response.setHeader("Permissions-Policy", 
            "geolocation=(), " +
            "microphone=(), " +
            "camera=(), " +
            "payment=(self 'https://js.stripe.com')");
        
        // Cache control for API responses
        if (request.getRequestURI().startsWith("/api/")) {
            response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate");
            response.setHeader("Pragma", "no-cache");
            response.setHeader("Expires", "0");
        }
        
        filterChain.doFilter(request, response);
    }
    
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        // Apply to all requests
        return false;
    }
}
