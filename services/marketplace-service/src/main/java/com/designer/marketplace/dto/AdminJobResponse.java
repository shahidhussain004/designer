package com.designer.marketplace.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for admin job response
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminJobResponse {
    private Long id;
    private String title;
    private String description;
    private String status;
    private Long employerId;
    private String employerName;
    private Long categoryId;
    private String categoryName;
    private Double budgetMin;
    private Double budgetMax;
    private String duration;
    private Integer applicationsCount;
    private Integer proposalCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
