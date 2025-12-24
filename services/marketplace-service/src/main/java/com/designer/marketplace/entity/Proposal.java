package com.designer.marketplace.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Proposal entity - represents freelancer bids on jobs
 * Maps to 'proposals' table in PostgreSQL
 */
@Entity
@Table(name = "proposals", indexes = {
        @Index(name = "idx_proposals_job", columnList = "job_id"),
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
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "freelancer_id", nullable = false)
    private User freelancer;

    @Column(name = "cover_letter", nullable = false, columnDefinition = "TEXT")
    private String coverLetter;

    @Column(name = "proposed_rate", nullable = false, columnDefinition = "NUMERIC(10,2)")
    private Double proposedRate;

    @Column(name = "estimated_duration")
    private Integer estimatedDuration;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProposalStatus status = ProposalStatus.SUBMITTED;

    @Column(name = "client_message", columnDefinition = "TEXT")
    private String clientMessage;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ProposalStatus {
        DRAFT,
        SUBMITTED,
        SHORTLISTED,
        ACCEPTED,
        REJECTED,
        WITHDRAWN
    }
}
