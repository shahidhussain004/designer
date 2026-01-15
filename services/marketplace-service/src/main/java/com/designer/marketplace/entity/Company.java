package com.designer.marketplace.entity;

import java.time.LocalDateTime;

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
 * Company entity - represents company profile data
 * Maps to 'companies' table in PostgreSQL
 * Linked to User via user_id foreign key
 */
@Entity
@Table(name = "companies", indexes = {
        @Index(name = "idx_companies_user_id", columnList = "user_id"),
        @Index(name = "idx_companies_company_name", columnList = "company_name"),
        @Index(name = "idx_companies_created_at", columnList = "created_at DESC"),
        @Index(name = "idx_companies_industry", columnList = "industry")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Company {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name = "company_name", nullable = false, length = 255)
    private String companyName;

    @Column(name = "company_type", length = 100)
    private String companyType;

    @Column(name = "industry", length = 100)
    private String industry;

    @Column(name = "website_url", length = 500)
    private String websiteUrl;

    @Column(name = "company_size", length = 50)
    private String companySize;

    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "headquarters_location", length = 255)
    private String headquartersLocation;

    @Column(name = "registration_number", length = 100)
    private String registrationNumber;

    @Column(name = "tax_id", length = 100)
    private String taxId;

    @Column(name = "rating_avg", columnDefinition = "NUMERIC(3,1)")
    private Double ratingAvg = 0.0;

    @Column(name = "rating_count")
    private Integer ratingCount = 0;

    @Column(name = "total_projects_posted")
    private Integer totalProjectsPosted = 0;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum CompanySize {
        STARTUP,
        SMALL,
        MEDIUM,
        LARGE,
        ENTERPRISE
    }

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

