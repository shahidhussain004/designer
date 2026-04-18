package com.designer.marketplace.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationPreferenceResponse {
    private Long id;
    private Boolean jobAlerts;
    private Boolean proposalUpdates;
    private Boolean messages;
    private Boolean newsletter;
}
