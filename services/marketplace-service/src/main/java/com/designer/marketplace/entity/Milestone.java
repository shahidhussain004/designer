package com.designer.marketplace.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Milestone entity for breaking down jobs into smaller deliverables with
 * separate payments.
 */
@Entity
@Table(name = "milestones")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Milestone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proposal_id")
    private Proposal proposal;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "sequence_order", nullable = false)
    private Integer sequenceOrder;

    /**
     * Amount for this milestone in cents
     */
    @Column(nullable = false)
    private Long amount;

    @Column(length = 3)
    @Builder.Default
    private String currency = "USD";

    /**
     * Expected completion date
     */
    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private MilestoneStatus status = MilestoneStatus.PENDING;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id")
    private Payment payment;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "escrow_id")
    private Escrow escrow;

    @Column(name = "deliverables", columnDefinition = "TEXT")
    private String deliverables;

    @Column(name = "revision_notes", columnDefinition = "TEXT")
    private String revisionNotes;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum MilestoneStatus {
        PENDING, // Not started, awaiting funding
        FUNDED, // Client has funded the milestone
        IN_PROGRESS, // Freelancer is working on it
        SUBMITTED, // Freelancer submitted deliverables for review
        REVISION_REQUESTED, // Client requested changes
        APPROVED, // Client approved, funds released
        CANCELLED, // Milestone cancelled
        DISPUTED // Under dispute resolution
    }
}
