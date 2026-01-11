package com.designer.marketplace.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.designer.marketplace.entity.Review;
import com.designer.marketplace.repository.ReviewRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for Review operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ReviewService {

    private final ReviewRepository reviewRepository;

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public Review getReviewById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found: " + id));
    }

    public List<Review> getReviewsByUserId(Long userId) {
        return reviewRepository.findPublishedReviewsByUserId(userId);
    }

    public List<Review> getReviewsByReviewerId(Long reviewerId) {
        return reviewRepository.findByReviewerId(reviewerId);
    }

    public Review createReview(Review review) {
        log.info("Creating new review");
        
        // Check if review already exists for this contract
        if (reviewRepository.existsByContractId(review.getContract().getId())) {
            throw new RuntimeException("Review already exists for this contract");
        }
        
        return reviewRepository.save(review);
    }

    public Review updateReview(Long id, Review updates) {
        Review existing = getReviewById(id);
        if (updates.getRating() != null) existing.setRating(updates.getRating());
        if (updates.getComment() != null) existing.setComment(updates.getComment());
        if (updates.getStatus() != null) existing.setStatus(updates.getStatus());
        return reviewRepository.save(existing);
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }
}
