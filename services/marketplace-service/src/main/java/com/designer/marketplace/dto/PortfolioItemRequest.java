package com.designer.marketplace.dto;

import java.time.LocalDate;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating or updating a PortfolioItem.
 * Accepts userId in the request body so callers don't need to pass it as a
 * query parameter. Also normalises the frontend's "completionDate" alias to
 * the canonical endDate field used by the entity / database.
 */
@Data
@NoArgsConstructor
public class PortfolioItemRequest {

    /** Owner's user account ID (from users table, NOT freelancers table). */
    private Long userId;

    private String title;
    private String description;

    // ── Media & Links ────────────────────────────────────────────────────────
    private String imageUrl;
    private String thumbnailUrl;
    private JsonNode images;   // [{"url":"…","caption":"…","order":1}]

    private String projectUrl;
    private String liveUrl;
    private String githubUrl;
    private String sourceUrl;

    // ── Classification ───────────────────────────────────────────────────────
    private String projectCategory;
    private List<String> technologies;
    private List<String> toolsUsed;
    private List<String> skillsDemonstrated;

    // ── Dates ────────────────────────────────────────────────────────────────
    private LocalDate startDate;

    /**
     * Accepts both "completionDate" (sent by the frontend form) and "endDate"
     * (canonical backend name) so both callers work without a mapping layer.
     */
    @JsonAlias("endDate")
    private LocalDate completionDate;

    // ── Display ──────────────────────────────────────────────────────────────
    private Integer displayOrder;
    private Integer highlightOrder;
    private Boolean isVisible;
}
