package com.designer.marketplace.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating a payment intent.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePaymentRequest {

    @NotNull(message = "Job ID is required")
    private Long jobId;

    @NotNull(message = "Proposal ID is required")
    private Long proposalId;

    @NotNull(message = "Amount is required")
    @Min(value = 100, message = "Minimum payment is $1.00 (100 cents)")
    private Long amount;

    @Builder.Default
    private String currency = "USD";

    private String paymentMethodId;
    
    private String description;
}
