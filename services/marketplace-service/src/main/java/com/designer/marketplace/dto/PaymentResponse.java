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
    private Long companyId;
    private String companyName;
    private Long freelancerId;
    private String freelancerName;
    private Long amount;
    private String currency;
    private String paymentMethod;
    private String description;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime processedAt;

    public static PaymentResponse fromEntity(Payment payment) {
        return PaymentResponse.builder()
                .id(payment.getId())
                .companyId(payment.getCompany() != null ? payment.getCompany().getId() : null)
                .companyName(payment.getCompany() != null ? payment.getCompany().getFullName() : null)
                .freelancerId(payment.getFreelancer() != null ? payment.getFreelancer().getId() : null)
                .freelancerName(payment.getFreelancer() != null ? payment.getFreelancer().getFullName() : null)
                .amount(payment.getAmountCents())
                .currency(payment.getCurrency())
                .paymentMethod(payment.getPaymentMethod())
                .description(payment.getDescription())
                .status(payment.getStatus() != null ? payment.getStatus().name() : null)
                .createdAt(payment.getCreatedAt())
                .processedAt(payment.getProcessedAt())
                .build();
    }
}
