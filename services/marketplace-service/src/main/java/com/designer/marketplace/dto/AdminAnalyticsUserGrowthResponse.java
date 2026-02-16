package com.designer.marketplace.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for user growth analytics response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminAnalyticsUserGrowthResponse {
    private List<String> labels;
    private List<Integer> data;
    private List<Integer> activeData;
    private Integer totalActive;
}
