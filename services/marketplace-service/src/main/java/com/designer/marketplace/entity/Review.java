package com.designer.marketplace.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.JsonNode;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Review Entity - Production-Grade DBA Design
 * 
 * Represents ratings and detailed feedback for completed contracts/projects
 * with comprehensive audit trail, moderation capabilities, and analytics support.
 * 
 * Schema Alignment: Maps 1:1 to 'reviews' table in PostgreSQL v15+
 * Indexing Strategy: Composite indexes for published reviews, verified reviewers
 * Performance Notes: JSONB categories indexed via GIN for fast queries
 */
@Entity
@Table(name = "reviews", 
    indexes = {
        @Index(name = "idx_reviews_reviewer_id", columnList = "reviewer_user_id"),
        @Index(name = "idx_reviews_reviewed_user_id", columnList = "reviewed_user_id"),
        @Index(name = "idx_reviews_contract_id", columnList = "contract_id", unique = true),
        @Index(name = "idx_reviews_project_id", columnList = "project_id"),
        @Index(name = "idx_reviews_published", columnList = "reviewed_user_id,status,created_at"),
        @Index(name = "idx_reviews_verified", columnList = "reviewed_user_id,is_verified_purchase,status"),
        @Index(name = "idx_reviews_rating", columnList = "rating"),
        @Index(name = "idx_reviews_created_at", columnList = "created_at")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "reviews_unique_contract_reviewer", 
            columnNames = {"contract_id", "reviewer_user_id"})
    }
)
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    /**
     * Primary key - auto-generated BIGSERIAL
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Reviewer relationship - user who submitted the review
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reviewer_id", nullable = false)
    @JsonIgnore
    private User reviewer;

    /**
     * Reviewed user relationship - user being reviewed
     */
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "reviewed_user_id", nullable = false)
    @JsonIgnore
    private User reviewedUser;

    /**
     * Related contract - bilateral relationship, nullable for project-only reviews
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", unique = true)
    @JsonIgnore
    private Contract contract;

    /**
     * Related project - for project-specific reviews (future expansion)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    @JsonIgnore
    private Project project;

    /**
     * Numeric rating: 0.00 to 5.00 (NUMERIC(3,2) in DB)
     * Constraint: rating >= 0 AND rating <= 5
     */
    @Column(nullable = false, precision = 3, scale = 2)
    private BigDecimal rating;

    /**
     * Review title/headline (VARCHAR 255)
     */
    @Column(length = 255)
    private String title;

    /**
     * Detailed review comment/feedback (TEXT)
     */
    @Column(columnDefinition = "TEXT")
    private String comment;

    /**
     * Category-based ratings as JSONB
     * Format: {"communication": 5.0, "quality": 4.5, "timeliness": 4.0, "professionalism": 5.0}
     * Indexed via GIN for efficient queries on nested fields
     */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "categories", columnDefinition = "jsonb default '{}'::jsonb")
    @Builder.Default
    private JsonNode categories = null;

    /**
     * Review moderation status
     * Constraint: status IN ('DRAFT', 'PUBLISHED', 'FLAGGED', 'REMOVED')
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    @Builder.Default
    private ReviewStatus status = ReviewStatus.PUBLISHED;

    /**
     * Verified purchase indicator - true if reviewer completed contract with reviewed user
     */
    @Column(name = "is_verified_purchase")
    @Builder.Default
    private Boolean isVerifiedPurchase = false;

    /**
     * Moderation flag reason (TEXT) - populated when status = FLAGGED
     */
    @Column(name = "flagged_reason", columnDefinition = "TEXT")
    private String flaggedReason;

    /**
     * Engagement metrics - helpful count (DEFAULT 0)
     * Constraint: helpful_count >= 0
     */
    @Column(name = "helpful_count")
    @Builder.Default
    private Integer helpfulCount = 0;

    /**
     * Engagement metrics - unhelpful count (DEFAULT 0)
     * Constraint: unhelpful_count >= 0
     */
    @Column(name = "unhelpful_count")
    @Builder.Default
    private Integer unhelpfulCount = 0;

    /**
     * Response from reviewed user (TEXT)
     */
    @Column(name = "response_comment", columnDefinition = "TEXT")
    private String responseComment;

    /**
     * Response timestamp - when reviewed user replied
     */
    @Column(name = "response_at")
    private LocalDateTime responseAt;

    /**
     * Creation timestamp - auto-set on INSERT
     */
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Update timestamp - auto-set on INSERT/UPDATE
     */
    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * Review Status Enum
     * DRAFT: Not yet published, only visible to reviewer
     * PUBLISHED: Public, visible in user profiles and reviews
     * FLAGGED: Flagged for review by moderators
     * REMOVED: Removed by moderation (soft delete)
     */
    public enum ReviewStatus {
        DRAFT,
        PUBLISHED,
        FLAGGED,
        REMOVED
    }

    /**
     * Constraint validation - reviewer cannot review themselves
     */
    public boolean isValid() {
        return reviewer != null && reviewedUser != null && 
               !reviewer.getId().equals(reviewedUser.getId());
    }
}
