package com.designer.marketplace.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for updating job application status
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateJobApplicationStatusRequest {

    @NotBlank(message = "Status is required")
    private String status; // PENDING, REVIEWING, SHORTLISTED, INTERVIEWING, ACCEPTED, REJECTED

    private String companyNotes;
}
