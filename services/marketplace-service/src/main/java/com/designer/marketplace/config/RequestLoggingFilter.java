package com.designer.marketplace.config;

import java.io.IOException;
import java.util.Enumeration;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * Filter to log all HTTP requests and responses with full details
 * Useful for debugging 403, 401, and other HTTP errors
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestLoggingFilter implements Filter {

    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        long startTime = System.currentTimeMillis();

        // Log incoming request
        logRequest(request);

        try {
            chain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            logResponse(request, response, duration);
        }
    }

    private void logRequest(HttpServletRequest request) {
        StringBuilder sb = new StringBuilder();
        sb.append("\n========================================\n");
        sb.append("HTTP REQUEST:\n");
        sb.append("Method: ").append(request.getMethod()).append("\n");
        sb.append("URI: ").append(request.getRequestURI()).append("\n");
        sb.append("Query: ").append(request.getQueryString()).append("\n");
        sb.append("Remote: ").append(request.getRemoteAddr()).append("\n");

        // Log all headers
        sb.append("Headers:\n");
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            // Don't log sensitive headers
            if (!headerName.equalsIgnoreCase("Authorization") &&
                    !headerName.equalsIgnoreCase("Cookie")) {
                sb.append("  ").append(headerName).append(": ")
                        .append(request.getHeader(headerName)).append("\n");
            } else {
                sb.append("  ").append(headerName).append(": [REDACTED]\n");
            }
        }

        sb.append("========================================");
        log.info(sb.toString());
    }

    private void logResponse(HttpServletRequest request, HttpServletResponse response, long duration) {
        StringBuilder sb = new StringBuilder();
        sb.append("\n========================================\n");
        sb.append("HTTP RESPONSE:\n");
        sb.append("Method: ").append(request.getMethod()).append("\n");
        sb.append("URI: ").append(request.getRequestURI()).append("\n");
        sb.append("Status: ").append(response.getStatus()).append("\n");
        sb.append("Duration: ").append(duration).append("ms\n");

        // Log response headers
        sb.append("Headers:\n");
        response.getHeaderNames().forEach(headerName -> {
            sb.append("  ").append(headerName).append(": ")
                    .append(response.getHeader(headerName)).append("\n");
        });

        // Highlight errors
        if (response.getStatus() >= 400) {
            sb.append("⚠️  ERROR RESPONSE - Status ").append(response.getStatus()).append("\n");
        }

        sb.append("========================================");

        if (response.getStatus() >= 400) {
            log.error(sb.toString());
        } else {
            log.info(sb.toString());
        }
    }
}
