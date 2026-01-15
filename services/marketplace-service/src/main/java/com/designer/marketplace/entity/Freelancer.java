package com.designer.marketplace.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

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
 * Freelancer entity - represents freelancer profile data
 * Maps to 'freelancers' table in PostgreSQL
 * Linked to User via user_id foreign key
 */
@Entity
@Table(name = "freelancers", indexes = {
        @Index(name = "idx_freelancers_user_id", columnList = "user_id"),
        @Index(name = "idx_freelancers_hourly_rate", columnList = "hourly_rate"),
        @Index(name = "idx_freelancers_created_at", columnList = "created_at DESC"),
        @Index(name = "idx_freelancers_completion_rate", columnList = "completion_rate DESC")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Freelancer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "hourly_rate", columnDefinition = "NUMERIC(10,2)")
    private Double hourlyRate;

    @Column(name = "experience_years")
    private Integer experienceYears;

    @Column(name = "headline", length = 255)
    private String headline;

    @Column(name = "portfolio_url", length = 500)
    private String portfolioUrl;

    @Column(name = "github_url", length = 500)
    private String githubUrl;

    @Column(name = "linkedin_url", length = 500)
    private String linkedinUrl;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "skills", columnDefinition = "json")
    private List<String> skills = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "certifications", columnDefinition = "json")
    private List<String> certifications = new ArrayList<>();

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "languages", columnDefinition = "json")
    private List<String> languages = new ArrayList<>();

    @Column(name = "rating_avg", columnDefinition = "NUMERIC(3,1)")
    private Double ratingAvg = 0.0;

    @Column(name = "rating_count")
    private Integer ratingCount = 0;

    @Column(name = "completion_rate", columnDefinition = "NUMERIC(5,2)")
    private Double completionRate = 0.0;

    @Column(name = "response_rate", columnDefinition = "NUMERIC(5,2)")
    private Double responseRate;

    @Column(name = "response_time_hours")
    private Integer responseTimeHours;

    @Column(name = "total_earnings", columnDefinition = "NUMERIC(15,2)")
    private Double totalEarnings = 0.0;

    @Column(name = "total_projects_completed")
    private Integer totalProjectsCompleted = 0;

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

