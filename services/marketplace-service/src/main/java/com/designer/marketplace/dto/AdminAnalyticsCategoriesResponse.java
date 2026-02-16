package com.designer.marketplace.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for category distribution analytics response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminAnalyticsCategoriesResponse {
    private List<String> labels;
    private List<Integer> data;
}
