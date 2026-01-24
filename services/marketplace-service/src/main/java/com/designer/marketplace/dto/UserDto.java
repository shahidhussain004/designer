package com.designer.marketplace.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * User DTO for API responses
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Long id;
    private String email;
    private String username;
    private String fullName;
    private String role;
    private String bio;
    private String profileImageUrl;
    private String location;
    private Double hourlyRate;
    private List<String> skills;
    private String portfolioUrl;
    private Boolean emailVerified;
    private Boolean isActive;
    private BigDecimal ratingAvg;
    private Integer ratingCount;
    private Boolean identityVerified;
    private LocalDateTime identityVerifiedAt;
    private String verificationStatus;
    private LocalDateTime deletedAt;
}
