package com.designer.marketplace.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

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
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Proposal entity - represents freelancer bids on projects
 * Maps to 'proposals' table in PostgreSQL
 */
@Entity
@Table(name = "proposals", indexes = {
        @Index(name = "idx_proposals_project", columnList = "project_id"),
        @Index(name = "idx_proposals_freelancer", columnList = "freelancer_id"),
        @Index(name = "idx_proposals_status", columnList = "status")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Proposal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "freelancer_id", nullable = false)
    private Freelancer freelancer;

    @Column(name = "cover_letter", nullable = false, columnDefinition = "TEXT")
    private String coverLetter;

    @Column(name = "suggested_budget", columnDefinition = "NUMERIC(12,2)")
    private Double suggestedBudget;

    @Column(name = "proposed_timeline")
    private String proposedTimeline;

    @Column(name = "estimated_hours", columnDefinition = "NUMERIC(10,2)")
    private Double estimatedHours;

    @Column(name = "attachments")
    private String[] attachments;

    @Column(name = "portfolio_links")
    private String[] portfolioLinks;

    @Column(name = "answers", columnDefinition = "jsonb")
    private String answers;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ProposalStatus status = ProposalStatus.SUBMITTED;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Column(name = "company_notes", columnDefinition = "TEXT")
    private String companyNotes;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "company_rating", columnDefinition = "NUMERIC(3,2)")
    private Double companyRating;

    @Column(name = "company_review", columnDefinition = "TEXT")
    private String companyReview;

    @Column(name = "freelancer_rating", columnDefinition = "NUMERIC(3,2)")
    private Double freelancerRating;

    @Column(name = "freelancer_review", columnDefinition = "TEXT")
    private String freelancerReview;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ProposalStatus {
        DRAFT,
        SUBMITTED,
        REVIEWING,
        SHORTLISTED,
        ACCEPTED,
        REJECTED,
        WITHDRAWN
    }
}
