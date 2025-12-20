package com.designer.marketplace.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Objects;

/**
 * User entity - represents both clients and freelancers
 * Maps to 'users' table in PostgreSQL
 */
@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_users_email", columnList = "email"),
        @Index(name = "idx_users_username", columnList = "username"),
        @Index(name = "idx_users_role", columnList = "role")
})
@EntityListeners(AuditingEntityListener.class)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "full_name", length = 100)
    private String fullName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private UserRole role = UserRole.FREELANCER;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "profile_image_url", length = 500)
    private String profileImageUrl;

    @Column(length = 100)
    private String location;

    @Column(length = 20)
    private String phone;

    @Column(name = "hourly_rate", columnDefinition = "NUMERIC(10,2)")
    private Double hourlyRate;

    @Column(columnDefinition = "TEXT[]")
    private String[] skills;

    @Column(name = "portfolio_url", length = 500)
    private String portfolioUrl;

    @Column(name = "stripe_customer_id", length = 100)
    private String stripeCustomerId;

    @Column(name = "stripe_account_id", length = 100)
    private String stripeAccountId;

    @Column(name = "email_verified", nullable = false)
    private Boolean emailVerified = false;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Column(name = "rating_avg", columnDefinition = "NUMERIC(3,2)")
    private Double ratingAvg = 0.0;

    @Column(name = "rating_count", nullable = false)
    private Integer ratingCount = 0;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum UserRole {
        CLIENT,
        FREELANCER,
        ADMIN
    }
    
    // Also expose as Role for backward compatibility
    public static final class Role {
        public static final UserRole CLIENT = UserRole.CLIENT;
        public static final UserRole FREELANCER = UserRole.FREELANCER;
        public static final UserRole ADMIN = UserRole.ADMIN;
    }

    // Default constructor
    public User() {
    }

    // All-args constructor
    public User(Long id, String email, String username, String passwordHash, String fullName,
                UserRole role, String bio, String profileImageUrl, String location, String phone,
                Double hourlyRate, String[] skills, String portfolioUrl, String stripeCustomerId,
                String stripeAccountId, Boolean emailVerified, Boolean isActive, Double ratingAvg,
                Integer ratingCount, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.email = email;
        this.username = username;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.role = role;
        this.bio = bio;
        this.profileImageUrl = profileImageUrl;
        this.location = location;
        this.phone = phone;
        this.hourlyRate = hourlyRate;
        this.skills = skills;
        this.portfolioUrl = portfolioUrl;
        this.stripeCustomerId = stripeCustomerId;
        this.stripeAccountId = stripeAccountId;
        this.emailVerified = emailVerified;
        this.isActive = isActive;
        this.ratingAvg = ratingAvg;
        this.ratingCount = ratingCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public String getUsername() { return username; }
    public String getPasswordHash() { return passwordHash; }
    public String getFullName() { return fullName; }
    public UserRole getRole() { return role; }
    public String getBio() { return bio; }
    public String getProfileImageUrl() { return profileImageUrl; }
    public String getLocation() { return location; }
    public String getPhone() { return phone; }
    public Double getHourlyRate() { return hourlyRate; }
    public String[] getSkills() { return skills; }
    public String getPortfolioUrl() { return portfolioUrl; }
    public String getStripeCustomerId() { return stripeCustomerId; }
    public String getStripeAccountId() { return stripeAccountId; }
    public Boolean getEmailVerified() { return emailVerified; }
    public Boolean getIsActive() { return isActive; }
    public Double getRatingAvg() { return ratingAvg; }
    public Integer getRatingCount() { return ratingCount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setEmail(String email) { this.email = email; }
    public void setUsername(String username) { this.username = username; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public void setRole(UserRole role) { this.role = role; }
    public void setBio(String bio) { this.bio = bio; }
    public void setProfileImageUrl(String profileImageUrl) { this.profileImageUrl = profileImageUrl; }
    public void setLocation(String location) { this.location = location; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setHourlyRate(Double hourlyRate) { this.hourlyRate = hourlyRate; }
    public void setSkills(String[] skills) { this.skills = skills; }
    public void setPortfolioUrl(String portfolioUrl) { this.portfolioUrl = portfolioUrl; }
    public void setStripeCustomerId(String stripeCustomerId) { this.stripeCustomerId = stripeCustomerId; }
    public void setStripeAccountId(String stripeAccountId) { this.stripeAccountId = stripeAccountId; }
    public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
    public void setRatingAvg(Double ratingAvg) { this.ratingAvg = ratingAvg; }
    public void setRatingCount(Integer ratingCount) { this.ratingCount = ratingCount; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id) && Objects.equals(email, user.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, email);
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", email='" + email + '\'' +
                ", username='" + username + '\'' +
                ", role=" + role +
                ", isActive=" + isActive +
                '}';
    }
}
