package com.designer.marketplace.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for jobs analytics response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminAnalyticsJobsResponse {
    private List<String> labels;
    private List<Integer> postedData;
    private List<Integer> completedData;
    private Integer totalCompleted;
}
