package com.designer.marketplace.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.databind.JsonNode;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Freelancer entity - Role-specific data for FREELANCER users
 * Maps to 'freelancers' table in PostgreSQL
 * Uses JSONB for skills, certifications, and languages
 */
@Entity
@Table(name = "freelancers", indexes = {
        @Index(name = "idx_freelancers_user_id", columnList = "user_id"),
        @Index(name = "idx_freelancers_hourly_rate", columnList = "hourly_rate_cents"),
        @Index(name = "idx_freelancers_completion_rate", columnList = "completion_rate, total_projects_completed"),
        @Index(name = "idx_freelancers_experience", columnList = "experience_years"),
        @Index(name = "idx_freelancers_created_at", columnList = "created_at")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Freelancer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    // Professional Info
    @Column(name = "hourly_rate_cents")
    private Long hourlyRateCents;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(length = 255)
    private String headline;

    @Column(name = "portfolio_url", length = 500)
    private String portfolioUrl;

    @Column(name = "github_url", length = 500)
    private String githubUrl;

    @Column(name = "linkedin_url", length = 500)
    private String linkedinUrl;

    // Skills & Certifications (JSONB)
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private JsonNode skills;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private JsonNode certifications;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private JsonNode languages;

    // Performance Metrics
    @Column(name = "completion_rate", precision = 5, scale = 2)
    private BigDecimal completionRate = BigDecimal.ZERO;

    @Column(name = "response_rate", precision = 5, scale = 2)
    private BigDecimal responseRate;

    @Column(name = "response_time_hours")
    private Integer responseTimeHours;

    @Column(name = "total_earnings_cents")
    private Long totalEarningsCents = 0L;

    @Column(name = "total_projects_completed")
    private Integer totalProjectsCompleted = 0;

    // Timestamps
    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Convenience methods to access user properties
    public String getUsername() {
        return user != null ? user.getUsername() : null;
    }

    public String getFullName() {
        return user != null ? user.getFullName() : null;
    }

    public String getEmail() {
        return user != null ? user.getEmail() : null;
    }

    public String getProfileImageUrl() {
        return user != null ? user.getProfileImageUrl() : null;
    }

    public String getLocation() {
        return user != null ? user.getLocation() : null;
    }

    public String getBio() {
        return user != null ? user.getBio() : null;
    }
}

