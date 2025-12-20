package com.designer.marketplace.kafka.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Event payload for job-related events.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobEventPayload {
    private Long jobId;
    private String title;
    private String description;
    private Long clientId;
    private String clientName;
    private String category;
    private Double budget;
    private String budgetType;
    private String status;
    private List<String> requiredSkills;
    private Integer duration;
    private String experienceLevel;
}
