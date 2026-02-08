package com.designer.marketplace.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.databind.JsonNode;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for creating a new job posting
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateJobRequest {

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 255, message = "Title must be between 3 and 255 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 10000, message = "Description must be between 10 and 10000 characters")
    private String description;

    private String responsibilities;

    private String requirements;

    @NotBlank(message = "Job type is required")
    private String jobType; // FULL_TIME, PART_TIME, CONTRACT, TEMPORARY, INTERNSHIP

    private String experienceLevel; // ENTRY, INTERMEDIATE, SENIOR, LEAD, EXECUTIVE

    private String location;

    private String city;

    private String state;

    private String country;

    private Boolean isRemote = false;

    private String remoteType; // FULLY_REMOTE, HYBRID, ON_SITE

    // Salary in cents (salaryMinCents, salaryMaxCents)
    private Long salaryMinCents;

    private Long salaryMaxCents;

    private String salaryCurrency = "USD";

    private String salaryPeriod; // HOURLY, DAILY, WEEKLY, MONTHLY, ANNUAL

    private Boolean showSalary = true;

    // JSONB fields
    private JsonNode benefits;

    private JsonNode perks;

    private JsonNode requiredSkills;

    private JsonNode preferredSkills;

    private String educationLevel; // HIGH_SCHOOL, ASSOCIATE, BACHELOR, MASTER, PHD

    private JsonNode certifications;

    private LocalDateTime applicationDeadline;

    private String applicationUrl;

    private String applyInstructions;

    private LocalDate startDate;

    private Integer positionsAvailable = 1;

    private String travelRequirement; // NONE, OCCASIONAL, FREQUENT

    private Boolean securityClearanceRequired = false;

    private Boolean visaSponsorship = false;

    private String status = "DRAFT"; // DRAFT, OPEN

    private Boolean isFeatured = false;

    private Boolean isUrgent = false;
}
