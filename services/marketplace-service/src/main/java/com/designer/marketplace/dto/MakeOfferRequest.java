package com.designer.marketplace.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for company to make a formal job offer to a candidate
 * This includes all offer details: salary, start date, benefits, terms
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MakeOfferRequest {

    // Salary Details
    @NotNull(message = "Offered salary is required")
    @Min(value = 0, message = "Salary must be positive")
    private Long offeredSalaryCents; // Amount in cents (e.g., $50,000 = 5,000,000 cents)

    @NotNull(message = "Currency is required")
    @Pattern(regexp = "USD|EUR|SEK|GBP|NOK|DKK", message = "Invalid currency code")
    private String offeredSalaryCurrency; // USD, EUR, SEK, etc.

    @NotNull(message = "Salary period is required")
    @Pattern(regexp = "HOURLY|MONTHLY|YEARLY", message = "Salary period must be HOURLY, MONTHLY, or YEARLY")
    private String offeredSalaryPeriod; // HOURLY, MONTHLY, YEARLY

    // Start Date
    @NotNull(message = "Proposed start date is required")
    private LocalDateTime offeredStartDate;

    // Offer Expiration
    @NotNull(message = "Offer expiration date is required")
    private LocalDateTime offerExpirationDate;

    // Contract Details
    @NotNull(message = "Contract type is required")
    @Pattern(regexp = "FULL_TIME|PART_TIME|CONTRACT|FREELANCE", message = "Invalid contract type")
    private String contractType; // FULL_TIME, PART_TIME, CONTRACT, FREELANCE

    private Integer contractDurationMonths; // Required if contractType is CONTRACT

    // Benefits & Terms
    @Size(max = 2000, message = "Benefits description must not exceed 2000 characters")
    private String offerBenefits; // e.g., "Health insurance, 25 vacation days, dental, gym membership"

    @Size(max = 3000, message = "Additional terms must not exceed 3000 characters")
    private String offerAdditionalTerms; // e.g., "Remote work allowed, laptop provided, 3-month probation"

    @Size(max = 500, message = "Document URL must not exceed 500 characters")
    private String offerDocumentUrl; // Optional link to formal offer letter PDF

    @Size(max = 2000, message = "Company notes must not exceed 2000 characters")
    private String companyNotes; // Internal notes for the company
}
