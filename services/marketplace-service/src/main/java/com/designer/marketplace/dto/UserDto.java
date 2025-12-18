package com.designer.marketplace.dto;

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
    private String[] skills;
    private String portfolioUrl;
    private Boolean emailVerified;
    private Boolean isActive;
    private Double ratingAvg;
    private Integer ratingCount;
}
