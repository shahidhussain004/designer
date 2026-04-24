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
    /** The user account ID of the owner (for frontend cache invalidation). */
    private Long userId;
    private String title;
    private String description;
    // Media & Links
    private String imageUrl;
    private String thumbnailUrl;
    private JsonNode images;
    private String projectUrl;
    private String liveUrl;
    private String githubUrl;
    private String sourceUrl;
    // Classification
    private String projectCategory;
    private JsonNode technologies;
    private JsonNode toolsUsed;
    private JsonNode skillsDemonstrated;
    // Dates
    private LocalDate startDate;
    private LocalDate endDate;
    // Display
    private Integer displayOrder;
    private Integer highlightOrder;
    private Boolean isVisible;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
