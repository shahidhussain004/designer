package com.designer.marketplace.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.designer.marketplace.entity.Review;
import com.designer.marketplace.entity.Review.ReviewStatus;

/**
 * Repository interface for Review operations
 */
@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    /**
     * Find review by contract ID
     */
    Optional<Review> findByContractId(Long contractId);

    /**
     * Find all reviews written by a user
     */
    List<Review> findByReviewerId(Long reviewerId);

    /**
     * Find all reviews received by a user
     */
    List<Review> findByReviewedUserId(Long reviewedUserId);

    /**
     * Find published reviews for a user
     */
    @Query("SELECT r FROM Review r WHERE r.reviewedUser.id = :userId AND r.status = 'PUBLISHED'")
    List<Review> findPublishedReviewsByUserId(@Param("userId") Long userId);

    /**
     * Find reviews by status
     */
    List<Review> findByStatus(ReviewStatus status);

    /**
     * Count reviews for a user
     */
    Long countByReviewedUserIdAndStatus(Long reviewedUserId, ReviewStatus status);

    /**
     * Calculate average rating for a user
     */
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.reviewedUser.id = :userId AND r.status = 'PUBLISHED'")
    Double calculateAverageRatingByUserId(@Param("userId") Long userId);

    /**
     * Check if review exists for a contract
     */
    boolean existsByContractId(Long contractId);
}
