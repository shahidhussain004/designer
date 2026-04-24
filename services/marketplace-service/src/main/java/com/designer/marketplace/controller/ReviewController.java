package com.designer.marketplace.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.designer.marketplace.entity.Review;
import com.designer.marketplace.service.ReviewService;
import com.designer.marketplace.service.ReviewService.ReviewStats;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * ReviewController - Enterprise REST API for Reviews
 * 
 * API Endpoints:
 * GET    /api/reviews                        - List all reviews (admin)
 * GET    /api/reviews/{id}                   - Get review detail
 * POST   /api/reviews                        - Create review
 * PUT    /api/reviews/{id}                   - Update review
 * DELETE /api/reviews/{id}                   - Delete review (soft delete)
 * 
 * Get Reviews BY a user (reviewer):
 * GET    /api/users/{reviewerId}/reviews-given              - List reviews they wrote
 * GET    /api/users/{reviewerId}/reviews-given?page=0&size=20 - Paginated
 * 
 * Get Reviews FOR a user (reviewed):
 * GET    /api/users/{userId}/reviews                        - List reviews they received
 * GET    /api/users/{userId}/reviews?page=0&size=20        - Paginated
 * GET    /api/users/{userId}/reviews/verified               - Verified only
 * GET    /api/users/{userId}/reviews/stats                  - Statistics
 * 
 * HTP Status Codes (RFC 7231 Compliant):
 * 200 - OK (successful retrieval/update)
 * 201 - Created (successful resource creation)
 * 204 - No Content (successful delete)
 * 400 - Bad Request (validation error)
 * 404 - Not Found (resource doesn't exist)
 * 409 - Conflict (business rule violation)
 * 500 - Internal Server Error
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Slf4j
public class ReviewController {

    private final ReviewService reviewService;

    /**
     * GET /api/reviews - List all reviews
     * Authorization: ADMIN only
     * Note: Implement @PreAuthorize("hasRole('ADMIN')" at method level
     */
    @GetMapping("/reviews")
    public ResponseEntity<List<Review>> getAllReviews() {
        log.info("GET /api/reviews - List all reviews");
        List<Review> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }

    /**
     * GET /api/reviews/{id} - Get review by ID
     */
    @GetMapping("/reviews/{id}")
    public ResponseEntity<Review> getReviewById(@PathVariable Long id) {
        log.info("GET /api/reviews/{} - Get review detail", id);
        try {
            Review review = reviewService.getReviewById(id);
            return ResponseEntity.ok(review);
        } catch (ReviewService.ReviewNotFoundException e) {
            log.warn("Review not found: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * POST /api/reviews - Create new review
     * Authorization: Authenticated user
     * 
     * Request Body:
     * {
     *   "reviewer": { "id": 100 },
     *   "reviewedUser": { "id": 200 },
     *   "contract": { "id": 50 },
     *   "rating": 4.5,
     *   "title": "Excellent work",
     *   "comment": "Very professional and delivered on time",
     *   "categories": { "communication": 5.0, "quality": 4.5 },
     *   "isVerifiedPurchase": true
     * }
     */
    @PostMapping("/reviews")
    public ResponseEntity<?> createReview(@RequestBody Review review) {
        log.info("POST /api/reviews - Create review for user: {}", 
                review.getReviewedUser() != null ? review.getReviewedUser().getId() : "unknown");
        
        try {
            Review created = reviewService.createReview(review);
            log.info("Review created successfully: id={}", created.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
            
        } catch (ReviewService.ReviewValidationException e) {
            log.warn("Review validation failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body(new ErrorResponse(400, e.getMessage()));
            
        } catch (ReviewService.ReviewServiceException e) {
            log.error("Service error creating review", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(500, "Failed to create review"));
        }
    }

    /**
     * PUT /api/reviews/{id} - Update existing review
     */
    @PutMapping("/reviews/{id}")
    public ResponseEntity<?> updateReview(
            @PathVariable Long id,
            @RequestBody Review updates) {
        log.info("PUT /api/reviews/{} - Update review", id);
        
        try {
            Review updated = reviewService.updateReview(id, updates);
            return ResponseEntity.ok(updated);
            
        } catch (ReviewService.ReviewNotFoundException e) {
            log.warn("Review not found for update: {}", id);
            return ResponseEntity.notFound().build();
            
        } catch (ReviewService.ReviewValidationException e) {
            log.warn("Update validation failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ErrorResponse(409, e.getMessage()));
        }
    }

    /**
     * DELETE /api/reviews/{id} - Delete review (soft delete)
     */
    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Long id) {
        log.info("DELETE /api/reviews/{} - Delete review", id);
        
        try {
            reviewService.deleteReview(id);
            return ResponseEntity.noContent().build();
            
        } catch (ReviewService.ReviewNotFoundException e) {
            log.warn("Review not found for deletion: {}", id);
            return ResponseEntity.notFound().build();
        }
    }

    // ========== NESTED ENDPOINTS: Reviews FOR a User ==========

    /**
     * GET /api/users/{userId}/reviews - Get reviews received by user
     * Public endpoint - shows only PUBLISHED reviews
     */
    @GetMapping("/users/{userId}/reviews")
    public ResponseEntity<?> getReviewsByUser(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("GET /api/users/{}/reviews - Get reviews for user (page: {}, size: {})", userId, page, size);
        
        try {
            Page<Review> reviews = reviewService.getReviewsByUserIdPaginated(userId, page, size);
            return ResponseEntity.ok(reviews);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(400, e.getMessage()));
        }
    }

    /**
     * GET /api/users/{userId}/reviews/verified - Get verified/badge reviews only
     */
    @GetMapping("/users/{userId}/reviews/verified")
    public ResponseEntity<?> getVerifiedReviewsByUser(@PathVariable Long userId) {
        log.info("GET /api/users/{}/reviews/verified - Get verified reviews", userId);
        
        try {
            List<Review> reviews = reviewService.getVerifiedReviewsByUserId(userId);
            return ResponseEntity.ok(reviews);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(400, e.getMessage()));
        }
    }

    /**
     * GET /api/users/{userId}/reviews/stats - Get review statistics
     * Returns: avg rating, total count, verified count, verification %
     */
    @GetMapping("/users/{userId}/reviews-stats")
    public ResponseEntity<?> getReviewStats(@PathVariable Long userId) {
        log.info("GET /api/users/{}/reviews-stats - Get review statistics", userId);
        
        try {
            ReviewStats stats = reviewService.getReviewStatsByUserId(userId);
            return ResponseEntity.ok(stats);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(400, e.getMessage()));
        }
    }

    // ========== NESTED ENDPOINTS: Reviews GIVEN BY a User (Reviewer) ==========

    /**
     * GET /api/users/{reviewerId}/reviews-given - Get reviews written by user
     * Shows reviews written BY this user about others
     */
    @GetMapping("/users/{reviewerId}/reviews-given")
    public ResponseEntity<?> getReviewsByReviewer(
            @PathVariable Long reviewerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        log.info("GET /api/users/{}/reviews-given - Get reviews from reviewer (page: {}, size: {})", 
                reviewerId, page, size);
        
        try {
            Page<Review> reviews = reviewService.getReviewsByReviewerIdPaginated(reviewerId, page, size);
            return ResponseEntity.ok(reviews);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(400, e.getMessage()));
        }
    }

    /**
     * GET /api/reviews/flagged - Get flagged reviews for moderation
     * Authorization: MODERATOR role required
     */
    @GetMapping("/reviews/flagged")
    public ResponseEntity<?> getFlaggedReviews() {
        log.info("GET /api/reviews/flagged - Get flagged reviews");
        
        try {
            List<Review> flaggedReviews = reviewService.getFlaggedReviews();
            return ResponseEntity.ok(flaggedReviews);
        } catch (Exception e) {
            log.error("Error fetching flagged reviews", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse(500, "Failed to fetch flagged reviews"));
        }
    }

    /**
     * Error Response DTO
     */
    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class ErrorResponse {
        private int status;
        private String message;
        private long timestamp;
        
        public ErrorResponse(int status, String message) {
            this.status = status;
            this.message = message;
            this.timestamp = System.currentTimeMillis();
        }
    }
}
