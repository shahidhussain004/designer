package com.designer.marketplace.dto;

import com.designer.marketplace.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUserResponse {

    private Long id;
    private String email;
    private String fullName;
    private String username;
    private User.UserRole role;
    private boolean active;
    private boolean emailVerified;
    private String profileImage;
    private LocalDateTime createdAt;
    private Integer totalJobs;
    private Integer totalProposals;
    private Integer totalCourses;
    private Integer totalEnrollments;
    
    public static AdminUserResponse fromEntity(User user) {
        return AdminUserResponse.builder()
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .username(user.getUsername())
                .role(user.getRole())
                .active(Boolean.TRUE.equals(user.getIsActive()))
                .emailVerified(Boolean.TRUE.equals(user.getEmailVerified()))
                .profileImage(user.getProfileImageUrl())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
