package com.designer.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for rejecting a job
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminJobRejectRequest {
    private String reason;
}
