package com.designer.marketplace.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO combining Company table data with basic User profile fields
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CompanyProfileResponse {

    private Long id; // company id

    // Company table fields
    private String companyName;
    private String companyType;
    private String industry;
    private String websiteUrl;
    private String companySize;
    private String registrationNumber;
    private String taxId;
    private String phone;
    private String headquartersLocation;
    private String description;
    private String logoUrl;
    private String contactEmail;
    private Integer totalJobsPosted;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Lightweight user fields (owner)
    private Long userId;
    private String username;
    private String fullName;
    private String email;
    private String profileImageUrl;
    private String location;
    private String bio;
}

