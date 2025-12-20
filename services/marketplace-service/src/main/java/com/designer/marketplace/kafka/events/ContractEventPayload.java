package com.designer.marketplace.kafka.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * Event payload for contract-related events.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContractEventPayload {
    private Long contractId;
    private Long jobId;
    private String jobTitle;
    private Long clientId;
    private String clientName;
    private Long freelancerId;
    private String freelancerName;
    private BigDecimal amount;
    private String status;
}
