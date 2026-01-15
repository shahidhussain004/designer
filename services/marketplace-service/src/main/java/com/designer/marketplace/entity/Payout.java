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
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Payout entity for tracking payments made to freelancers.
 */
@Entity
@Table(name = "payouts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "payout_reference", unique = true, nullable = false, length = 50)
    private String payoutReference;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_id", nullable = false)
    private Freelancer freelancer;

    /**
     * The Stripe transfer ID (if using Stripe Connect)
     */
    @Column(name = "stripe_transfer_id")
    private String stripeTransferId;

    /**
     * The Stripe payout ID
     */
    @Column(name = "stripe_payout_id")
    private String stripePayoutId;

    /**
     * Amount in cents
     */
    @Column(nullable = false)
    private Long amount;

    @Column(length = 3)
    @Builder.Default
    private String currency = "USD";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private PayoutStatus status = PayoutStatus.PENDING;

    @Enumerated(EnumType.STRING)
    @Column(name = "payout_method", length = 30)
    @Builder.Default
    private PayoutMethod payoutMethod = PayoutMethod.BANK_TRANSFER;

    /**
     * The bank account or payment method details (last 4 digits only for security)
     */
    @Column(name = "destination_last4", length = 4)
    private String destinationLast4;

    /**
     * Bank name or payment method name
     */
    @Column(name = "destination_name", length = 100)
    private String destinationName;

    /**
     * Payout period start date
     */
    @Column(name = "period_start")
    private LocalDateTime periodStart;

    /**
     * Payout period end date
     */
    @Column(name = "period_end")
    private LocalDateTime periodEnd;

    /**
     * Associated payments included in this payout (stored as JSON array of payment
     * IDs)
     */
    @Column(name = "included_payments", columnDefinition = "TEXT")
    private String includedPayments;

    /**
     * Number of jobs/payments included
     */
    @Column(name = "payment_count")
    @Builder.Default
    private Integer paymentCount = 0;

    /**
     * Failure reason if payout failed
     */
    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @Column(name = "initiated_at")
    private LocalDateTime initiatedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum PayoutStatus {
        PENDING, // Payout created but not yet initiated
        PROCESSING, // Payout is being processed
        IN_TRANSIT, // Funds are in transit to bank
        PAID, // Successfully paid out
        FAILED, // Payout failed
        CANCELLED // Payout cancelled
    }

    public enum PayoutMethod {
        BANK_TRANSFER, // Direct bank transfer
        PAYPAL, // PayPal payout
        STRIPE_CONNECT, // Stripe Connect transfer
        CHECK, // Physical check
        WIRE // Wire transfer
    }
}
