package com.designer.marketplace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for updating job application status
 * Status values: PENDING, SUBMITTED, REVIEWING, SHORTLISTED, INTERVIEWING, OFFERED, ACCEPTED, REJECTED, WITHDRAWN
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateJobApplicationStatusRequest {

    @NotBlank(message = "Status is required")
    private String status; // PENDING, SUBMITTED, REVIEWING, SHORTLISTED, INTERVIEWING, OFFERED, ACCEPTED, REJECTED, WITHDRAWN

    @Size(max = 2000, message = "Company notes must not exceed 2000 characters")
    private String companyNotes;

    @Size(max = 2000, message = "Rejection reason must not exceed 2000 characters")
    private String rejectionReason;
}
