package com.designer.marketplace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating a new proposal
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateProposalRequest {

    @NotNull(message = "Project ID is required")
    private Long projectId;

    @NotBlank(message = "Cover letter is required")
    @Size(max = 5000, message = "Cover letter must not exceed 5000 characters")
    private String coverLetter;

    @NotNull(message = "Proposed rate is required")
    @Positive(message = "Proposed rate must be positive")
    private Double proposedRate;

    private Integer estimatedDuration;
}
