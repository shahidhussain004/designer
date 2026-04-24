package com.designer.marketplace.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO for saved jobs - includes full job details
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SavedJobResponse {
    private Long savedJobId;
    private LocalDateTime savedAt;
    private JobResponse job; // Full job details
}
