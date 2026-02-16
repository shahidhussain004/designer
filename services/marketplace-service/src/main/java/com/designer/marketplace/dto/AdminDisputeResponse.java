package com.designer.marketplace.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for admin dispute response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDisputeResponse {
    private Long id;
    private Long paymentId;
    private Long supportTicketId;
    private String reason;
    private String description;
    private String status;
    private Double amount;
    private Long clientId;
    private String clientName;
    private Long freelancerId;
    private String freelancerName;
    private Long jobId;
    private String jobTitle;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
    private String resolution;
}
