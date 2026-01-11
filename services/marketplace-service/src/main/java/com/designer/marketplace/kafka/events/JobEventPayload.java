package com.designer.marketplace.kafka.events;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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
    private Long companyId;
    private String companyName;
    private Long categoryId;
    private String categoryName;
    private Double budget;
    private String budgetType;
    private String status;
    private List<String> requiredSkills;
    private Integer duration;
    private Long experienceLevelId;
    private String experienceLevelName;
}
