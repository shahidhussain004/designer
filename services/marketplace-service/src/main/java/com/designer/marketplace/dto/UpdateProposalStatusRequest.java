package com.designer.marketplace.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for updating proposal status
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProposalStatusRequest {

    @NotBlank(message = "Status is required")
    private String status; // SHORTLISTED, ACCEPTED, REJECTED

    private String companyMessage;
}
