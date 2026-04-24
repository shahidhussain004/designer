package com.designer.marketplace.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.designer.marketplace.entity.Review;
import com.designer.marketplace.entity.Review.ReviewStatus;
import com.designer.marketplace.repository.ReviewRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * ReviewService - Enterprise-Grade Business Logic Layer
 * 
 * Responsibilities:
 * 1. Data integrity validation (reviewer != reviewed, contract exists, etc.)
 * 2. Transaction management with proper rollback semantics
 * 3. Business rule enforcement (one review per contract, status transitions)
 * 4. Event-driven operations (would integrate with Kafka for async updates)
 * 5. Audit logging and performance monitoring
 * 
 * DBA Best Practices Applied:
 * - @Transactional(readOnly=true) for queries (connection pool optimization)
 * - Explicit transaction boundaries for mutations
 * - Optimistic locking consideration (future: add @Version)
 * - Comprehensive error handling with meaningful messages
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;

    // Constants for pagination and limits
    private static final int DEFAULT_PAGE_SIZE = 20;
    private static final int MAX_PAGE_SIZE = 100;
    private static final int TOP_REVIEWERS_LIMIT = 10;

    /**
     * Retrieve all reviews (admin/analytics only)
     * WARNING: Implement access control at controller level
     */
    @Transactional(readOnly = true)
    public List<Review> getAllReviews() {
        log.info("Fetching all reviews");
        return reviewRepository.findAll();
    }

    /**
     * Get single review by ID with defensive programming
     */
    @Transactional(readOnly = true)
    public Review getReviewById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("Invalid review ID: " + id);
        }
        
        log.debug("Fetching review ID: {}", id);
        return reviewRepository.findById(id)
                .orElseThrow(() -> {
                    log.warn("Review not found with ID: {}", id);
                    return new ReviewNotFoundException("Review not found with ID: " + id);
                });
    }

    /**
     * Get all PUBLISHED reviews for a user (public-facing)
     * Use case: User profile ratings display
     * SQL Execution: Uses covering index idx_reviews_published
     */
    @Transactional(readOnly = true)
    public List<Review> getReviewsByUserId(Long userId) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("Invalid user ID: " + userId);
        }
        
        log.info("Fetching published reviews for user: {}", userId);
        return reviewRepository.findPublishedReviewsByUserId(userId);
    }

    /**
     * Get PUBLISHED reviews for user with pagination
     * Production-grade: Handles large result sets efficiently
     */
    @Transactional(readOnly = true)
    public Page<Review> getReviewsByUserIdPaginated(Long userId, int page, int size) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("Invalid user ID: " + userId);
        }
        if (page < 0) page = 0;
        if (size <= 0 || size > MAX_PAGE_SIZE) size = DEFAULT_PAGE_SIZE;
        
        log.info("Fetching paginated reviews for user: {} (page: {}, size: {})", userId, page, size);
        Pageable pageable = PageRequest.of(page, size);
        return reviewRepository.findPublishedReviewsByUserIdPaginated(userId, pageable);
    }

    /**
     * Get all reviews WRITTEN BY a user (reviewer perspective)
     * Use case: Reviewer profile - "Reviews you've given"
     */
    @Transactional(readOnly = true)
    public List<Review> getReviewsByReviewerId(Long reviewerId) {
        if (reviewerId == null || reviewerId <= 0) {
            throw new IllegalArgumentException("Invalid reviewer ID: " + reviewerId);
        }
        
        log.info("Fetching reviews given by reviewer: {}", reviewerId);
        return reviewRepository.findByReviewerId(reviewerId);
    }

    /**
     * Get reviews written by user with pagination
     */
    @Transactional(readOnly = true)
    public Page<Review> getReviewsByReviewerIdPaginated(Long reviewerId, int page, int size) {
        if (reviewerId == null || reviewerId <= 0) {
            throw new IllegalArgumentException("Invalid reviewer ID: " + reviewerId);
        }
        if (page < 0) page = 0;
        if (size <= 0 || size > MAX_PAGE_SIZE) size = DEFAULT_PAGE_SIZE;
        
        log.info("Fetching paginated reviews from reviewer: {} (page: {}, size: {})", reviewerId, page, size);
        Pageable pageable = PageRequest.of(page, size);
        return reviewRepository.findByReviewerIdPaginated(reviewerId, pageable);
    }

    /**
     * Get verified/badge reviews only
     */
    @Transactional(readOnly = true)
    public List<Review> getVerifiedReviewsByUserId(Long userId) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("Invalid user ID: " + userId);
        }
        
        log.info("Fetching verified reviews for user: {}", userId);
        return reviewRepository.findVerifiedReviewsByUserId(userId);
    }

    /**
     * Calculate average rating and review statistics for user
     * Used for: User profile card, search result snippets, leaderboards
     */
    @Transactional(readOnly = true)
    public ReviewStats getReviewStatsByUserId(Long userId) {
        if (userId == null || userId <= 0) {
            throw new IllegalArgumentException("Invalid user ID: " + userId);
        }
        
        log.info("Computing review statistics for user: {}", userId);
        
        BigDecimal avgRating = reviewRepository.calculateAverageRatingByUserId(userId)
                .orElse(BigDecimal.ZERO);
        
        long totalReviews = reviewRepository.countPublishedReviewsByUserId(userId);
        List<Review> verifiedReviews = reviewRepository.findVerifiedReviewsByUserId(userId);
        
        return ReviewStats.builder()
                .userId(userId)
                .averageRating(avgRating)
                .totalReviews(totalReviews)
                .verifiedReviews((long) verifiedReviews.size())
                .build();
    }

    /**
     * Create a new review with comprehensive validation
     * 
     * Validation Rules (DBA integrity):
     * 1. Reviewer cannot review themselves
     * 2. One review per contract (UNIQUE constraint)
     * 3. Rating must be 0-5
     * 4. Reviewer and reviewed user must exist (FK constraint)
     * 
     * Transaction: SERIALIZABLE isolation to prevent race conditions
     */
    @Transactional(isolation = org.springframework.transaction.annotation.Isolation.SERIALIZABLE)
    public Review createReview(Review review) {
        // Null checks
        Objects.requireNonNull(review, "Review cannot be null");
        Objects.requireNonNull(review.getReviewer(), "Reviewer cannot be null");
        Objects.requireNonNull(review.getReviewedUser(), "Reviewed user cannot be null");
        
        // Business rule: reviewer != reviewed user
        if (review.getReviewer().getId().equals(review.getReviewedUser().getId())) {
            throw new ReviewValidationException("Reviewer cannot review themselves");
        }
        
        // Business rule: rating bounds
        if (review.getRating() == null || 
            review.getRating().compareTo(BigDecimal.ZERO) < 0 || 
            review.getRating().compareTo(new BigDecimal("5")) > 0) {
            throw new ReviewValidationException("Rating must be between 0.00 and 5.00");
        }
        
        // Business rule: one review per contract
        if (review.getContract() != null && 
            reviewRepository.existsByContractId(review.getContract().getId())) {
            throw new ReviewValidationException("Review already exists for this contract");
        }
        
        try {
            log.info("Creating new review: reviewer={}, reviewed={}, contract={}", 
                    review.getReviewer().getId(), 
                    review.getReviewedUser().getId(),
                    review.getContract() != null ? review.getContract().getId() : "N/A");
            
            review.setCreatedAt(LocalDateTime.now());
            review.setUpdatedAt(LocalDateTime.now());
            if (review.getStatus() == null) {
                review.setStatus(ReviewStatus.PUBLISHED);
            }
            
            Review saved = reviewRepository.save(review);
            log.info("Review created successfully: id={}", saved.getId());
            return saved;
            
        } catch (Exception e) {
            log.error("Error creating review", e);
            throw new ReviewServiceException("Failed to create review: " + e.getMessage(), e);
        }
    }

    /**
     * Update existing review with state transition validation
     * 
     * Allowed transitions:
     * DRAFT → PUBLISHED (author publish)
     * PUBLISHED → FLAGGED (moderation flag)
     * FLAGGED → PUBLISHED (moderation resolve)
     */
    @Transactional
    public Review updateReview(Long id, Review updates) {
        Review existing = getReviewById(id);
        
        // Validate status transition if changing status
        if (updates.getStatus() != null && !updates.getStatus().equals(existing.getStatus())) {
            validateStatusTransition(existing.getStatus(), updates.getStatus());
        }
        
        try {
            // Selective updates (prevent accidental overwrites)
            if (updates.getRating() != null) {
                if (updates.getRating().compareTo(BigDecimal.ZERO) < 0 || 
                    updates.getRating().compareTo(new BigDecimal("5")) > 0) {
                    throw new ReviewValidationException("Rating must be between 0.00 and 5.00");
                }
                existing.setRating(updates.getRating());
            }
            if (updates.getTitle() != null) existing.setTitle(updates.getTitle());
            if (updates.getComment() != null) existing.setComment(updates.getComment());
            if (updates.getStatus() != null) existing.setStatus(updates.getStatus());
            if (updates.getFlaggedReason() != null) existing.setFlaggedReason(updates.getFlaggedReason());
            if (updates.getResponseComment() != null) {
                existing.setResponseComment(updates.getResponseComment());
                existing.setResponseAt(LocalDateTime.now());
            }
            
            existing.setUpdatedAt(LocalDateTime.now());
            
            log.info("Updating review: id={}, status={}", id, existing.getStatus());
            return reviewRepository.save(existing);
            
        } catch (Exception e) {
            log.error("Error updating review: id={}", id, e);
            throw new ReviewServiceException("Failed to update review: " + e.getMessage(), e);
        }
    }

    /**
     * Delete review (soft delete via status change, or hard delete for admins)
     */
    @Transactional
    public void deleteReview(Long id) {
        Review review = getReviewById(id);
        
        try {
            log.info("Deleting review: id={}", id);
            review.setStatus(ReviewStatus.REMOVED);
            review.setUpdatedAt(LocalDateTime.now());
            reviewRepository.save(review);
            log.info("Review deleted (marked as REMOVED): id={}", id);
        } catch (Exception e) {
            log.error("Error deleting review: id={}", id, e);
            throw new ReviewServiceException("Failed to delete review: " + e.getMessage(), e);
        }
    }

    /**
     * Get flagged reviews for moderation dashboard
     */
    @Transactional(readOnly = true)
    public List<Review> getFlaggedReviews() {
        log.info("Fetching flagged reviews for moderation");
        return reviewRepository.findFlaggedReviews();
    }

    /**
     * Validate review status transitions
     */
    private void validateStatusTransition(ReviewStatus from, ReviewStatus to) {
        // Define allowed transitions
        boolean allowed = switch (from) {
            case DRAFT -> to == ReviewStatus.PUBLISHED;
            case PUBLISHED -> to == ReviewStatus.FLAGGED || to == ReviewStatus.REMOVED;
            case FLAGGED -> to == ReviewStatus.PUBLISHED || to == ReviewStatus.REMOVED;
            case REMOVED -> false; // Terminal state
            default -> false;
        };
        
        if (!allowed) {
            throw new ReviewValidationException("Invalid status transition: " + from + " → " + to);
        }
    }

    // Custom Exceptions (DDD - Domain Driven Design)
    
    public static class ReviewNotFoundException extends RuntimeException {
        public ReviewNotFoundException(String message) {
            super(message);
        }
    }
    
    public static class ReviewValidationException extends RuntimeException {
        public ReviewValidationException(String message) {
            super(message);
        }
    }
    
    public static class ReviewServiceException extends RuntimeException {
        public ReviewServiceException(String message, Throwable cause) {
            super(message, cause);
        }
    }

    // DTO for statistics (builder pattern)
    @lombok.Data
    @lombok.Builder
    public static class ReviewStats {
        private Long userId;
        private BigDecimal averageRating;
        private Long totalReviews;
        private Long verifiedReviews;
        
        /**
         * Calculate verification percentage
         */
        public double getVerificationPercentage() {
            return totalReviews > 0 ? (verifiedReviews.doubleValue() / totalReviews.doubleValue()) * 100 : 0;
        }
    }
}
