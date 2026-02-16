package com.designer.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for resolving a dispute
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDisputeResolveRequest {
    private String resolution;
    private Double refundAmount;
    private Boolean favorClient;
}
