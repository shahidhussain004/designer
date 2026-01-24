package com.designer.marketplace.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

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
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Review entity - Represents ratings and feedback for completed contracts
 * Maps to 'reviews' table in PostgreSQL
 */
@Entity
@Table(name = "reviews", indexes = {
        @Index(name = "idx_reviews_contract_id", columnList = "contract_id"),
        @Index(name = "idx_reviews_reviewer_id", columnList = "reviewer_user_id"),
        @Index(name = "idx_reviews_reviewed_id", columnList = "reviewed_user_id"),
        @Index(name = "idx_reviews_status", columnList = "status")
}, uniqueConstraints = {
        @UniqueConstraint(name = "uq_reviews_contract_id", columnNames = {"contract_id"})
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false, unique = true)
    private Contract contract;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewer_user_id", nullable = false)
    private User reviewer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reviewed_user_id", nullable = false)
    private User reviewedUser;

    @Column(nullable = false)
    private Integer rating; // 1-5

    @Column(columnDefinition = "TEXT")
    private String comment;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "categories", columnDefinition = "jsonb")
    private JsonNode categories;

    @Column(name = "is_anonymous")
    private Boolean isAnonymous = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    private ReviewStatus status;

    @Column(name = "flagged_reason", columnDefinition = "TEXT")
    private String flaggedReason;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ReviewStatus {
        PUBLISHED,
        FLAGGED,
        HIDDEN
    }
}
