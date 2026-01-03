package com.designer.marketplace.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.designer.marketplace.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for User responses
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {

    private Long id;
    private String email;
    private String username;
    private String fullName;
    private String role;
    private String bio;
    private String profileImageUrl;
    private String location;
    private String phone;
    private Double hourlyRate;
    private List<String> skills;
    private String portfolioUrl;
    private Boolean emailVerified;
    private Boolean isActive;
    private Double ratingAvg;
    private Integer ratingCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Convert User entity to UserResponse DTO
     */
    public static UserResponse fromEntity(User user) {
        if (user == null) {
            return null;
        }

        return UserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .bio(user.getBio())
                .profileImageUrl(user.getProfileImageUrl())
                .location(user.getLocation())
                .phone(user.getPhone())
                .hourlyRate(user.getHourlyRate())
                .skills(user.getSkills())
                .portfolioUrl(user.getPortfolioUrl())
                .emailVerified(user.getEmailVerified())
                .isActive(user.getIsActive())
                .ratingAvg(user.getRatingAvg())
                .ratingCount(user.getRatingCount())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
