package com.designer.marketplace.kafka.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Event payload for payment-related events.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentEventPayload {
    private String paymentId;
    private Long amount; // in cents
    private String currency;
    private String status;
    private Long fromUserId;
    private Long toUserId;
    private Long jobId;
    private String stripePaymentIntentId;
    private String failureReason;
}
