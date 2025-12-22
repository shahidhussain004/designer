package com.designer.marketplace.dto;

import com.designer.marketplace.entity.Payout;
import com.designer.marketplace.entity.Payout.PayoutMethod;
import com.designer.marketplace.entity.Payout.PayoutStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.time.LocalDateTime;
import java.util.List;

public class PayoutDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreatePayoutRequest {
        @NotNull(message = "Freelancer ID is required")
        private Long freelancerId;

        @NotNull(message = "Amount is required")
        @Positive(message = "Amount must be positive")
        private Long amount;

        private String currency = "USD";

        private PayoutMethod payoutMethod = PayoutMethod.BANK_TRANSFER;

        private List<Long> paymentIds;

        private LocalDateTime periodStart;

        private LocalDateTime periodEnd;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PayoutResponse {
        private Long id;
        private String payoutReference;
        private Long freelancerId;
        private String freelancerName;
        private String freelancerEmail;
        private String stripeTransferId;
        private String stripePayoutId;
        private Long amount;
        private String currency;
        private PayoutStatus status;
        private PayoutMethod payoutMethod;
        private String destinationLast4;
        private String destinationName;
        private LocalDateTime periodStart;
        private LocalDateTime periodEnd;
        private Integer paymentCount;
        private String failureReason;
        private LocalDateTime createdAt;
        private LocalDateTime initiatedAt;
        private LocalDateTime completedAt;

        public static PayoutResponse fromEntity(Payout payout) {
            return PayoutResponse.builder()
                    .id(payout.getId())
                    .payoutReference(payout.getPayoutReference())
                    .freelancerId(payout.getFreelancer().getId())
                    .freelancerName(payout.getFreelancer().getFullName())
                    .freelancerEmail(payout.getFreelancer().getEmail())
                    .stripeTransferId(payout.getStripeTransferId())
                    .stripePayoutId(payout.getStripePayoutId())
                    .amount(payout.getAmount())
                    .currency(payout.getCurrency())
                    .status(payout.getStatus())
                    .payoutMethod(payout.getPayoutMethod())
                    .destinationLast4(payout.getDestinationLast4())
                    .destinationName(payout.getDestinationName())
                    .periodStart(payout.getPeriodStart())
                    .periodEnd(payout.getPeriodEnd())
                    .paymentCount(payout.getPaymentCount())
                    .failureReason(payout.getFailureReason())
                    .createdAt(payout.getCreatedAt())
                    .initiatedAt(payout.getInitiatedAt())
                    .completedAt(payout.getCompletedAt())
                    .build();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PayoutSummary {
        private Long freelancerId;
        private Long totalEarnings;
        private Long totalPaidOut;
        private Long pendingPayout;
        private Long availableForPayout;
        private int totalPayouts;
        private int successfulPayouts;
        private LocalDateTime lastPayoutDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BatchPayoutRequest {
        private List<CreatePayoutRequest> payouts;
        private LocalDateTime scheduledAt;
        private String batchDescription;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BatchPayoutResponse {
        private String batchId;
        private int totalPayouts;
        private int successfulPayouts;
        private int failedPayouts;
        private Long totalAmount;
        private List<PayoutResponse> payouts;
        private LocalDateTime createdAt;
    }
}
