package com.designer.marketplace.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for revenue analytics response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminAnalyticsRevenueResponse {
    private List<String> labels;
    private List<Double> data;
    private List<Double> feesData;
    private Double totalMTD;
    private Double avgJobValue;
}
