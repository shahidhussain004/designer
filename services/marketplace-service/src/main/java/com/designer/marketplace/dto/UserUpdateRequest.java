package com.designer.marketplace.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for updating user profile
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateRequest {

    @Email(message = "Invalid email format")
    private String email;

    @Size(max = 100, message = "Full name must not exceed 100 characters")
    private String fullName;

    @Size(max = 2000, message = "Bio must not exceed 2000 characters")
    private String bio;

    @Size(max = 500, message = "Profile image URL must not exceed 500 characters")
    private String profileImageUrl;

    @Size(max = 100, message = "Location must not exceed 100 characters")
    private String location;

    @Size(max = 20, message = "Phone must not exceed 20 characters")
    private String phone;

    private Double hourlyRate;

    private String[] skills;

    @Size(max = 500, message = "Portfolio URL must not exceed 500 characters")
    private String portfolioUrl;
}
