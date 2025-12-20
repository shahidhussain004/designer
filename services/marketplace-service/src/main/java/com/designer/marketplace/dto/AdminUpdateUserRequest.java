package com.designer.marketplace.dto;

import com.designer.marketplace.entity.User;

public class AdminUpdateUserRequest {

    private String fullName;
    private String username;
    private User.UserRole role;
    private Boolean enabled;
    private Boolean emailVerified;
    private String profileImage;
    
    public AdminUpdateUserRequest() {}
    
    public AdminUpdateUserRequest(String fullName, String username, User.UserRole role, 
                                  Boolean enabled, Boolean emailVerified, String profileImage) {
        this.fullName = fullName;
        this.username = username;
        this.role = role;
        this.enabled = enabled;
        this.emailVerified = emailVerified;
        this.profileImage = profileImage;
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public User.UserRole getRole() { return role; }
    public void setRole(User.UserRole role) { this.role = role; }
    public Boolean getEnabled() { return enabled; }
    public void setEnabled(Boolean enabled) { this.enabled = enabled; }
    public Boolean getEmailVerified() { return emailVerified; }
    public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }
    public String getProfileImage() { return profileImage; }
    public void setProfileImage(String profileImage) { this.profileImage = profileImage; }
}
