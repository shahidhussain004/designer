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
 * Invoice entity for generating payment invoices.
 */
@Entity
@Table(name = "invoices")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Invoice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_number", unique = true, nullable = false, length = 50)
    private String invoiceNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "payment_id", nullable = false)
    private Payment payment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "milestone_id")
    private Milestone milestone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_id", nullable = false)
    private User freelancer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private InvoiceType invoiceType = InvoiceType.PAYMENT;

    /**
     * Subtotal amount in cents (before fees)
     */
    @Column(nullable = false)
    private Long subtotal;

    /**
     * Platform fee amount in cents
     */
    @Column(name = "platform_fee")
    @Builder.Default
    private Long platformFee = 0L;

    /**
     * Tax amount in cents (if applicable)
     */
    @Column(name = "tax_amount")
    @Builder.Default
    private Long taxAmount = 0L;

    /**
     * Total amount in cents
     */
    @Column(nullable = false)
    private Long total;

    @Column(length = 3)
    @Builder.Default
    private String currency = "USD";

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private InvoiceStatus status = InvoiceStatus.DRAFT;

    /**
     * Client's billing information (stored as JSON)
     */
    @Column(name = "client_billing_info", columnDefinition = "TEXT")
    private String clientBillingInfo;

    /**
     * Freelancer's billing information (stored as JSON)
     */
    @Column(name = "freelancer_billing_info", columnDefinition = "TEXT")
    private String freelancerBillingInfo;

    /**
     * Line items for the invoice (stored as JSON array)
     */
    @Column(name = "line_items", columnDefinition = "TEXT")
    private String lineItems;

    /**
     * Additional notes on the invoice
     */
    @Column(columnDefinition = "TEXT")
    private String notes;

    /**
     * URL to the generated PDF invoice
     */
    @Column(name = "pdf_url", columnDefinition = "TEXT")
    private String pdfUrl;

    @Column(name = "invoice_date", nullable = false)
    @Builder.Default
    private LocalDateTime invoiceDate = LocalDateTime.now();

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "created_at")
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    @Builder.Default
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public enum InvoiceType {
        PAYMENT, // Standard payment invoice
        MILESTONE, // Milestone payment invoice
        REFUND, // Refund credit note
        PAYOUT // Payout statement to freelancer
    }

    public enum InvoiceStatus {
        DRAFT, // Invoice created but not finalized
        SENT, // Invoice sent to client
        PAID, // Invoice has been paid
        OVERDUE, // Payment is overdue
        CANCELLED, // Invoice cancelled
        REFUNDED // Invoice refunded
    }
}
