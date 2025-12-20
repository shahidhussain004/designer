package com.designer.marketplace.kafka;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Base event class for all Kafka messages.
 * Contains common fields for event tracking and processing.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class KafkaEvent<T> {

    /**
     * Type of the event (e.g., "JOB_POSTED", "PAYMENT_RECEIVED")
     */
    private String eventType;

    /**
     * Timestamp when the event occurred
     */
    private Instant timestamp;

    /**
     * User ID associated with the event (if applicable)
     */
    private Long userId;

    /**
     * Correlation ID for tracing events across services
     */
    private String correlationId;

    /**
     * The actual event data/payload
     */
    private T data;

    /**
     * Creates a new KafkaEvent with the current timestamp
     */
    public static <T> KafkaEvent<T> of(String eventType, T data) {
        return KafkaEvent.<T>builder()
                .eventType(eventType)
                .timestamp(Instant.now())
                .data(data)
                .build();
    }

    /**
     * Creates a new KafkaEvent with user ID
     */
    public static <T> KafkaEvent<T> of(String eventType, Long userId, T data) {
        return KafkaEvent.<T>builder()
                .eventType(eventType)
                .timestamp(Instant.now())
                .userId(userId)
                .data(data)
                .build();
    }
}
