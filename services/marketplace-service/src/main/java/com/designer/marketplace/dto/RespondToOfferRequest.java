package com.designer.marketplace.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for freelancer to respond to a job offer
 * Only ACCEPTED or REJECTED are allowed when responding to an OFFERED application
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RespondToOfferRequest {

    @NotBlank(message = "Response is required")
    @Pattern(regexp = "ACCEPTED|REJECTED", message = "Response must be either ACCEPTED or REJECTED")
    private String response; // ACCEPTED or REJECTED

    @Size(max = 1000, message = "Notes must not exceed 1000 characters")
    private String notes; // Optional notes from freelancer
}
