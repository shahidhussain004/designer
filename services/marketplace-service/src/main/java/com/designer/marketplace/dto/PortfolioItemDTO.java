package com.designer.marketplace.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.databind.JsonNode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for PortfolioItem - used to avoid lazy loading issues
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioItemDTO {
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private String projectUrl;
    private JsonNode technologies;
    private JsonNode images;
    private JsonNode toolsUsed;
    private JsonNode skillsDemonstrated;
    private LocalDate startDate;
    private LocalDate endDate;
    private Integer displayOrder;
    private Boolean isVisible;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
