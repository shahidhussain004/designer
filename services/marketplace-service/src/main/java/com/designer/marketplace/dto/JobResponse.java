package com.designer.marketplace.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.designer.marketplace.entity.Job;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Job responses
 * Maps from Job entity to API response
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobResponse {
    private Long id;
    
    // Category info
    private Long categoryId;
    private String categoryName;
    
    // Company info
    private Long companyId;
    private String companyName;
    
    // Basic information
    private String title;
    private String description;
    private String responsibilities;
    private String requirements;
    
    // Job details
    private String jobType;
    private String experienceLevel;
    
    // Location
    private String location;
    private String city;
    private String state;
    private String country;
    private Boolean isRemote;
    private String remoteType;
    
    // Compensation (in cents, need to convert to decimal for API)
    private Long salaryMinCents;
    private Long salaryMaxCents;
    private String salaryCurrency;
    private String salaryPeriod;
    private Boolean showSalary;
    
    // Benefits and perks (JsonNode from JSONB)
    private JsonNode benefits;
    private JsonNode perks;
    
    // Skills and qualifications (JsonNode from JSONB)
    private JsonNode requiredSkills;
    private JsonNode preferredSkills;
    private String educationLevel;
    private JsonNode certifications;
    
    // Application
    private LocalDateTime applicationDeadline;
    private String applicationEmail;
    private String applicationUrl;
    private String applyInstructions;
    
    // Details
    private LocalDate startDate;
    private Integer positionsAvailable;
    private String travelRequirement;
    private Boolean securityClearanceRequired;
    private Boolean visaSponsorship;
    
    // Status and tracking
    private String status;
    private Integer viewsCount;
    private Integer applicationsCount;
    private Boolean isFeatured;
    private Boolean isUrgent;
    
    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime publishedAt;
    private LocalDateTime closedAt;

    /**
     * Convert Job entity to DTO
     */
    public static JobResponse fromEntity(Job job) {
        if (job == null) {
            return null;
        }

        return JobResponse.builder()
                .id(job.getId())
                .companyId(job.getCompany() != null ? job.getCompany().getId() : null)
                .companyName(job.getCompany() != null ? job.getCompany().getFullName() : null)
                .categoryId(job.getCategory() != null ? job.getCategory().getId() : null)
                .categoryName(job.getCategory() != null ? job.getCategory().getName() : null)
                .title(job.getTitle())
                .description(job.getDescription())
                .responsibilities(job.getResponsibilities())
                .requirements(job.getRequirements())
                .jobType(job.getJobType() != null ? job.getJobType().name() : null)
                .experienceLevel(job.getExperienceLevel() != null ? job.getExperienceLevel().name() : null)
                .location(job.getLocation())
                .city(job.getCity())
                .state(job.getState())
                .country(job.getCountry())
                .isRemote(job.getIsRemote())
                .remoteType(job.getRemoteType() != null ? job.getRemoteType().name() : null)
                .salaryMinCents(job.getSalaryMinCents())
                .salaryMaxCents(job.getSalaryMaxCents())
                .salaryCurrency(job.getSalaryCurrency())
                .salaryPeriod(job.getSalaryPeriod() != null ? job.getSalaryPeriod().name() : null)
                .showSalary(job.getShowSalary())
                .benefits(job.getBenefits())
                .perks(job.getPerks())
                .requiredSkills(job.getRequiredSkills())
                .preferredSkills(job.getPreferredSkills())
                .educationLevel(job.getEducationLevel() != null ? job.getEducationLevel().name() : null)
                .certifications(job.getCertifications())
                .applicationDeadline(job.getApplicationDeadline())
                .applicationEmail(job.getApplicationEmail())
                .applicationUrl(job.getApplicationUrl())
                .applyInstructions(job.getApplyInstructions())
                .startDate(job.getStartDate())
                .positionsAvailable(job.getPositionsAvailable())
                .travelRequirement(job.getTravelRequirement() != null ? job.getTravelRequirement().name() : null)
                .securityClearanceRequired(job.getSecurityClearanceRequired())
                .visaSponsorship(job.getVisaSponsorship())
                .status(job.getStatus() != null ? job.getStatus().name() : null)
                .viewsCount(job.getViewsCount())
                .applicationsCount(job.getApplicationsCount())
                .isFeatured(job.getIsFeatured())
                .isUrgent(job.getIsUrgent())
                .createdAt(job.getCreatedAt())
                .updatedAt(job.getUpdatedAt())
                .publishedAt(job.getPublishedAt())
                .closedAt(job.getClosedAt())
                .build();
    }
}
