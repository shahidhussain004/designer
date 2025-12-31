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
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

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
    private ReleaseCondition releaseCondition = ReleaseCondition.PROJECT_COMPLETED;

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
        PROJECT_COMPLETED,
        MILESTONE_COMPLETED,
        MANUAL_RELEASE,
        AUTO_RELEASE,
        DISPUTE_RESOLVED
    }
}
