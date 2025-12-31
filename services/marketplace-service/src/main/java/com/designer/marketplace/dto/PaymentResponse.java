package com.designer.marketplace.dto;

import java.time.LocalDateTime;

import com.designer.marketplace.entity.Payment;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for payment information.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {

    private Long id;
    private String paymentIntentId;
    private String clientSecret; // For frontend to complete payment
    
    // User info
    private Long clientId;
    private String clientName;
    private Long freelancerId;
    private String freelancerName;
    
    // Job info
    private Long jobId;
    private String jobTitle;
    private Long proposalId;
    
    // Amount details (in cents)
    private Long amount;
    private Long platformFee;
    private Long freelancerAmount;
    private String currency;
    
    // Formatted amounts for display
    private String formattedAmount;
    private String formattedPlatformFee;
    private String formattedFreelancerAmount;
    
    // Status
    private String status;
    private String escrowStatus;
    
    // Stripe metadata
    private String receiptUrl;
    private String failureCode;
    private String failureMessage;
    
    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
    private LocalDateTime releasedAt;

    public static PaymentResponse fromEntity(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .paymentIntentId(payment.getPaymentIntentId())
                .clientId(payment.getClient().getId())
                .clientName(payment.getClient().getFullName())
                .freelancerId(payment.getFreelancer().getId())
                .freelancerName(payment.getFreelancer().getFullName())
                .jobId(payment.getProject().getId())
                .jobTitle(payment.getProject().getTitle())
                .proposalId(payment.getProposal() != null ? payment.getProposal().getId() : null)
                .amount(payment.getAmount())
                .platformFee(payment.getPlatformFee())
                .freelancerAmount(payment.getFreelancerAmount())
                .currency(payment.getCurrency())
                .formattedAmount(formatCurrency(payment.getAmount(), payment.getCurrency()))
                .formattedPlatformFee(formatCurrency(payment.getPlatformFee(), payment.getCurrency()))
                .formattedFreelancerAmount(formatCurrency(payment.getFreelancerAmount(), payment.getCurrency()))
                .status(payment.getStatus().name())
                .escrowStatus(payment.getEscrowStatus().name())
                .receiptUrl(payment.getStripeReceiptUrl())
                .failureCode(payment.getFailureCode())
                .failureMessage(payment.getFailureMessage())
                .createdAt(payment.getCreatedAt())
                .paidAt(payment.getPaidAt())
                .releasedAt(payment.getReleasedAt())
                .build();
    }

    private static String formatCurrency(Long cents, String currency) {
        if (cents == null) return "$0.00";
        double dollars = cents / 100.0;
        return String.format("$%.2f %s", dollars, currency);
    }
}
