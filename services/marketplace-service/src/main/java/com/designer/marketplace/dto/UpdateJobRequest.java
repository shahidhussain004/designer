package com.designer.marketplace.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.databind.JsonNode;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for updating an existing job posting
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateJobRequest {

    private Long categoryId;

    @Size(min = 3, max = 255, message = "Title must be between 3 and 255 characters")
    private String title;

    @Size(min = 10, max = 10000, message = "Description must be between 10 and 10000 characters")
    private String description;

    private String responsibilities;

    private String requirements;

    private String jobType; // FULL_TIME, PART_TIME, CONTRACT, TEMPORARY, INTERNSHIP

    private String experienceLevel; // ENTRY, INTERMEDIATE, SENIOR, LEAD, EXECUTIVE

    private String location;

    private String city;

    private String state;

    private String country;

    private Boolean isRemote;

    private String remoteType; // FULLY_REMOTE, HYBRID, ON_SITE

    private Long salaryMinCents;

    private Long salaryMaxCents;

    private String salaryCurrency;

    private String salaryPeriod; // HOURLY, DAILY, WEEKLY, MONTHLY, ANNUAL

    private Boolean showSalary;

    private JsonNode benefits;

    private JsonNode perks;

    private JsonNode requiredSkills;

    private JsonNode preferredSkills;

    private String educationLevel; // HIGH_SCHOOL, ASSOCIATE, BACHELOR, MASTER, PHD

    private JsonNode certifications;

    private LocalDateTime applicationDeadline;

    private String applicationEmail;

    private String applicationUrl;

    private String applyInstructions;

    private LocalDate startDate;

    private Integer positionsAvailable;

    private String travelRequirement; // NONE, OCCASIONAL, FREQUENT

    private Boolean securityClearanceRequired;

    private Boolean visaSponsorship;

    private String status; // DRAFT, OPEN, PAUSED, CLOSED, FILLED

    private Boolean isFeatured;

    private Boolean isUrgent;

    private LocalDateTime publishedAt;

    private LocalDateTime closedAt;
}
