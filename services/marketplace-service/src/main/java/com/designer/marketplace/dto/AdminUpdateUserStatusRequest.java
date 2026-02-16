package com.designer.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for updating user status
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUpdateUserStatusRequest {
    private boolean isActive;
}
