package com.designer.marketplace.kafka.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Event payload for proposal-related events.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProposalEventPayload {
    private Long proposalId;
    private Long jobId;
    private String jobTitle;
    private Long freelancerId;
    private String freelancerName;
    private Long clientId;
    private Double proposedRate;
    private Integer estimatedDuration;
    private String status;
    private String coverLetterPreview;
}
