package com.designer.marketplace.kafka.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Event payload for certificate-related events.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CertificateEventPayload {
    private String certificateId;
    private String courseId;
    private String courseTitle;
    private Long userId;
    private String userName;
    private Instant issuedAt;
    private String certificateUrl;
}
