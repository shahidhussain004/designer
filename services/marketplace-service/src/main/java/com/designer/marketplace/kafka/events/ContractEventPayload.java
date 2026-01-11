package com.designer.marketplace.kafka.events;

import java.math.BigDecimal;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private Long companyId;
    private String companyName;
    private Long freelancerId;
    private String freelancerName;
    private BigDecimal amount;
    private String status;
}
