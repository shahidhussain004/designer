package com.designer.marketplace.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.designer.marketplace.service.ReviewService.ReviewNotFoundException;
import com.designer.marketplace.service.ReviewService.ReviewServiceException;
import com.designer.marketplace.service.ReviewService.ReviewValidationException;

import lombok.extern.slf4j.Slf4j;

/**
 * Global Exception Handler - Enterprise Error Handling
 * 
 * Responsibilities:
 * 1. Convert domain exceptions to standardized HTTP responses
 * 2. Log errors with appropriate severity levels
 * 3. Provide consistent error response format across all endpoints
 * 4. Hide internal implementation details from clients
 * 
 * API Error Response Format (RFC 9457 - Problem Details):
 * {
 *   "status": 404,
 *   "error": "NOT_FOUND",
 *   "message": "Review not found with ID: 123",
 *   "timestamp": 1713619200000,
 *   "path": "/api/reviews/123"
 * }
 */
@RestControllerAdvice
@RequestMapping
@Slf4j
public class GlobalExceptionHandler {

    /**
     * Handle: ReviewNotFoundException
     * HTTP Status: 404 Not Found
     */
    @ExceptionHandler(ReviewNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleReviewNotFound(ReviewNotFoundException ex) {
        log.warn("Review not found: {}", ex.getMessage());
        
        ApiErrorResponse error = ApiErrorResponse.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .error("NOT_FOUND")
                .message(ex.getMessage())
                .timestamp(System.currentTimeMillis())
                .build();
        
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    /**
     * Handle: ReviewValidationException
     * HTTP Status: 400 Bad Request / 409 Conflict
     * Use 409 for business rule violations (e.g., duplicate review)
     */
    @ExceptionHandler(ReviewValidationException.class)
    public ResponseEntity<ApiErrorResponse> handleReviewValidation(ReviewValidationException ex) {
        log.warn("Review validation failed: {}", ex.getMessage());
        
        // Determine appropriate status based on error type
        HttpStatus status = determineBestStatusForValidation(ex.getMessage());
        
        ApiErrorResponse error = ApiErrorResponse.builder()
                .status(status.value())
                .error(status == HttpStatus.CONFLICT ? "CONFLICT" : "VALIDATION_ERROR")
                .message(ex.getMessage())
                .timestamp(System.currentTimeMillis())
                .build();
        
        return new ResponseEntity<>(error, status);
    }

    /**
     * Handle: ReviewServiceException
     * HTTP Status: 500 Internal Server Error
     * Log for monitoring and alerting
     */
    @ExceptionHandler(ReviewServiceException.class)
    public ResponseEntity<ApiErrorResponse> handleReviewService(ReviewServiceException ex) {
        log.error("Review service error", ex.getCause());
        
        ApiErrorResponse error = ApiErrorResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error("INTERNAL_ERROR")
                .message("An error occurred while processing your request")
                .timestamp(System.currentTimeMillis())
                .build();
        
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Handle: Validation errors from @Valid
     * HTTP Status: 400 Bad Request
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationError(MethodArgumentNotValidException ex) {
        log.warn("Request validation failed: {}", ex.getBindingResult().getErrorCount());
        
        String message = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .reduce((a, b) -> a + ", " + b)
                .orElse("Validation failed");
        
        ApiErrorResponse error = ApiErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .error("VALIDATION_ERROR")
                .message(message)
                .timestamp(System.currentTimeMillis())
                .build();
        
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle: Generic IllegalArgumentException
     * HTTP Status: 400 Bad Request
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalArgument(IllegalArgumentException ex) {
        log.warn("Illegal argument: {}", ex.getMessage());
        
        ApiErrorResponse error = ApiErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .error("INVALID_ARGUMENT")
                .message(ex.getMessage())
                .timestamp(System.currentTimeMillis())
                .build();
        
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle: SecurityException (Access Denied)
     * HTTP Status: 403 Forbidden
     * User is authenticated but doesn't have permission
     */
    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<ApiErrorResponse> handleSecurityException(SecurityException ex) {
        log.warn("Access denied: {}", ex.getMessage());
        
        ApiErrorResponse error = ApiErrorResponse.builder()
                .status(HttpStatus.FORBIDDEN.value())
                .error("FORBIDDEN")
                .message(ex.getMessage())
                .timestamp(System.currentTimeMillis())
                .build();
        
        return new ResponseEntity<>(error, HttpStatus.FORBIDDEN);
    }

    /**
     * Handle: InvalidTokenException (Invalid password reset token)
     * HTTP Status: 400 Bad Request
     */
    @ExceptionHandler(com.designer.marketplace.exception.InvalidTokenException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidToken(com.designer.marketplace.exception.InvalidTokenException ex) {
        log.warn("Invalid token: {}", ex.getMessage());
        
        ApiErrorResponse error = ApiErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .error("Invalid Token")
                .message(ex.getMessage())
                .timestamp(System.currentTimeMillis())
                .build();
        
        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

    /**
     * Handle: ResourceNotFoundException
     * HTTP Status: 404 Not Found
     */
    @ExceptionHandler(com.designer.marketplace.exception.ResourceNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleResourceNotFound(com.designer.marketplace.exception.ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        
        ApiErrorResponse error = ApiErrorResponse.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .error("NOT_FOUND")
                .message(ex.getMessage())
                .timestamp(System.currentTimeMillis())
                .build();
        
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }

    /**
     * Handle: Uncaught exceptions
     * HTTP Status: 500 Internal Server Error
     * Include exception message for debugging
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGlobalException(Exception ex) {
        log.error("Uncaught exception occurred", ex);
        
        // For debugging, include the actual error message (not in production ideally, but helpful for development)
        String message = "An unexpected error occurred";
        if (ex.getMessage() != null && !ex.getMessage().isBlank()) {
            message = ex.getMessage();
        } else if (ex.getCause() != null && ex.getCause().getMessage() != null) {
            message = "Caused by: " + ex.getCause().getMessage();
        }
        
        ApiErrorResponse error = ApiErrorResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .error("INTERNAL_ERROR")
                .message(message)
                .timestamp(System.currentTimeMillis())
                .build();
        
        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    /**
     * Determine best HTTP status for validation errors
     * Follows REST conventions for error types
     */
    private HttpStatus determineBestStatusForValidation(String message) {
        // 409 Conflict: Duplicate resource, business rule violation
        if (message.toLowerCase().contains("already exists") || 
            message.toLowerCase().contains("duplicate") ||
            message.toLowerCase().contains("constraint") ||
            message.toLowerCase().contains("transition")) {
            return HttpStatus.CONFLICT;
        }
        
        // Default to 400 Bad Request for other validation errors
        return HttpStatus.BAD_REQUEST;
    }

    // ========== DTOs ==========

    /**
     * Standardized API Error Response (Problem Details - RFC 9457)
     */
    @lombok.Data
    @lombok.Builder
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ApiErrorResponse {
        /** HTTP status code */
        private int status;
        
        /** Error code for programmatic handling */
        private String error;
        
        /** Human-readable error message */
        private String message;
        
        /** Timestamp when error occurred (milliseconds) */
        private long timestamp;
        
        /** Optional: Request path that caused error */
        private String path;
        
        /** Optional: Additional error details */
        private String details;
    }
}
