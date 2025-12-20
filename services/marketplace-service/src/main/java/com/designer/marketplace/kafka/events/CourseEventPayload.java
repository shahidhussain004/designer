package com.designer.marketplace.kafka.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

/**
 * Event payload for course completion events.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseEventPayload {
    private String courseId;
    private String courseTitle;
    private Long userId;
    private String userName;
    private Instant completedAt;
    private Integer progressPercent;
    private Integer totalLessons;
    private Integer completedLessons;
}
