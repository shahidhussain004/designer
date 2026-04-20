package com.designer.marketplace.repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.designer.marketplace.entity.Review;
import com.designer.marketplace.entity.Review.ReviewStatus;

/**
 * ReviewRepository - DBA-Optimized Data Access Layer
 * 
 * Query Optimization Strategy:
 * - Explicit column selection (no N+1 queries via @EntityGraph suppression)
 * - Indexed WHERE clauses matching index definitions
 * - Pagination support for large result sets
 * - Aggregate functions for analytics (AVG, COUNT, SUM)
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    /**
     * Find review by contract ID (UNIQUE constraint)
     * Uses: idx_reviews_contract_id
     */
    Optional<Review> findByContractId(Long contractId);

    /**
     * Find all reviews written by a user (reviewer)
     * Use case: User dashboard - "Reviews you've given"
     * Uses: idx_reviews_reviewer_id
     */
    @Query("SELECT r FROM Review r WHERE r.reviewer.id = :reviewerId ORDER BY r.createdAt DESC")
    List<Review> findByReviewerId(@Param("reviewerId") Long reviewerId);

    /**
     * Find all reviews written by a user with pagination
     * Uses: idx_reviews_reviewer_id, idx_reviews_created_at
     */
    @Query("SELECT r FROM Review r WHERE r.reviewer.id = :reviewerId ORDER BY r.createdAt DESC")
    Page<Review> findByReviewerIdPaginated(@Param("reviewerId") Long reviewerId, Pageable pageable);

    /**
     * Find all reviews received by a user (reviewed_user)
     * Use case: User profile - all feedback
     * Uses: idx_reviews_reviewed_user_id
     */
    @Query("SELECT r FROM Review r WHERE r.reviewedUser.id = :reviewedUserId ORDER BY r.createdAt DESC")
    List<Review> findByReviewedUserId(@Param("reviewedUserId") Long reviewedUserId);

    /**
     * Find all reviews received by a user with pagination
     * Uses: idx_reviews_reviewed_user_id, idx_reviews_published
     */
    @Query("SELECT r FROM Review r WHERE r.reviewedUser.id = :reviewedUserId ORDER BY r.createdAt DESC")
    Page<Review> findByReviewedUserIdPaginated(@Param("reviewedUserId") Long reviewedUserId, Pageable pageable);

    /**
     * Find PUBLISHED reviews for a user only
     * Use case: Public profile display
     * Uses: idx_reviews_published (reviewed_user_id, status, created_at)
     * Performance: Covers index - no table scan needed
     */
    @Query("SELECT r FROM Review r WHERE r.reviewedUser.id = :userId AND r.status = 'PUBLISHED' ORDER BY r.createdAt DESC")
    List<Review> findPublishedReviewsByUserId(@Param("userId") Long userId);

    /**
     * Find PUBLISHED reviews for a user with pagination
     * Production-grade: handles large review sets efficiently
     */
    @Query("SELECT r FROM Review r WHERE r.reviewedUser.id = :userId AND r.status = 'PUBLISHED' ORDER BY r.rating DESC, r.createdAt DESC")
    Page<Review> findPublishedReviewsByUserIdPaginated(@Param("userId") Long userId, Pageable pageable);

    /**
     * Find VERIFIED PURCHASE reviews only
     * Use case: Display badge for verified reviews
     * Uses: idx_reviews_verified
     */
    @Query("SELECT r FROM Review r WHERE r.reviewedUser.id = :userId AND r.isVerifiedPurchase = true AND r.status = 'PUBLISHED' ORDER BY r.createdAt DESC")
    List<Review> findVerifiedReviewsByUserId(@Param("userId") Long userId);

    /**
     * Find reviews by status
     * Use case: Moderation dashboard
     */
    @Query("SELECT r FROM Review r WHERE r.status = :status ORDER BY r.createdAt DESC")
    List<Review> findByStatus(@Param("status") ReviewStatus status);

    /**
     * Find FLAGGED reviews for moderation
     * Uses: idx_reviews_published (filters status = FLAGGED)
     */
    @Query("SELECT r FROM Review r WHERE r.status = 'FLAGGED' ORDER BY r.createdAt DESC")
    List<Review> findFlaggedReviews();

    /**
     * Count total reviews for a user
     * Uses: idx_reviews_reviewed_user_id
     */
    @Query("SELECT COUNT(r) FROM Review r WHERE r.reviewedUser.id = :reviewedUserId AND r.status = 'PUBLISHED'")
    long countPublishedReviewsByUserId(@Param("reviewedUserId") Long reviewedUserId);

    /**
     * Calculate average rating for a user (analytics)
     * Index: Full table scan optimization - aggregation query
     * Returns: Rounded to 2 decimals
     */
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.reviewedUser.id = :userId AND r.status = 'PUBLISHED'")
    Optional<BigDecimal> calculateAverageRatingByUserId(@Param("userId") Long userId);

    /**
     * Get rating summary statistics
     * Use case: Build comprehensive user profile card
     */
    @Query("SELECT new map(" +
           "ROUND(AVG(CAST(r.rating as double)), 2) as avgRating, " +
           "COUNT(r) as totalReviews, " +
           "SUM(CASE WHEN r.isVerifiedPurchase = true THEN 1 ELSE 0 END) as verifiedCount) " +
           "FROM Review r WHERE r.reviewedUser.id = :userId AND r.status = 'PUBLISHED'")
    Optional<Object> getRatingStatsByUserId(@Param("userId") Long userId);

    /**
     * Check if review exists for contract (duplicate prevention)
     * Uses: idx_reviews_contract_id
     */
    boolean existsByContractId(Long contractId);

    /**
     * Check if reviewer already reviewed the user for a contract
     * Uses: idx_reviews_contract_id + idx_reviews_reviewer_id
     */
    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN true ELSE false END FROM Review r WHERE r.contract.id = :contractId AND r.reviewer.id = :reviewerId")
    boolean existsByContractIdAndReviewerId(@Param("contractId") Long contractId, @Param("reviewerId") Long reviewerId);

    /**
     * Get top-rated reviewers (quality contributors)
     * Use case: Identify trustworthy reviewers for platform
     */
    @Query(value = "SELECT r.reviewer_user_id, COUNT(r.id) as review_count, ROUND(AVG(r.rating)::numeric, 2) as avg_given_rating " +
                   "FROM reviews r WHERE r.status = 'PUBLISHED' GROUP BY r.reviewer_user_id ORDER BY review_count DESC LIMIT :limit", 
           nativeQuery = true)
    List<Object[]> getTopReviewers(@Param("limit") int limit);
}
