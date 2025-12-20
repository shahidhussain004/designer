package com.designer.marketplace.kafka.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Event payload for user-related events.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserEventPayload {
    private Long userId;
    private String username;
    private String fullName;
    private String email;
    private String role;
    private String profileImageUrl;
}
