package com.designer.marketplace.kafka.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Event payload for message-related events.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageEventPayload {
    private String messageId;
    private String threadId;
    private Long senderId;
    private String senderName;
    private Long receiverId;
    private String receiverName;
    private String bodyPreview;
    private Long jobId;
}
