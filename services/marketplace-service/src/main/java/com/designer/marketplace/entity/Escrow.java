package com.designer.marketplace.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Escrow entity for holding funds until job completion.
 */
@Entity
@Table(name = "escrow")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Escrow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @Column(nullable = false)
    private Long amount;

    @Column(length = 3)
    @Builder.Default
    private String currency = "USD";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    @Builder.Default
    private EscrowHoldStatus status = EscrowHoldStatus.HELD;

    @Enumerated(EnumType.STRING)
    @Column(name = "release_condition", length = 100)
    @Builder.Default
    private ReleaseCondition releaseCondition = ReleaseCondition.JOB_COMPLETED;

    @Column(name = "auto_release_date")
    private LocalDateTime autoReleaseDate;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "released_at")
    private LocalDateTime releasedAt;

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum EscrowHoldStatus {
        HELD,
        RELEASED,
        REFUNDED,
        DISPUTED
    }

    public enum ReleaseCondition {
        JOB_COMPLETED,
        MILESTONE_COMPLETED,
        MANUAL_RELEASE,
        AUTO_RELEASE,
        DISPUTE_RESOLVED
    }
}
