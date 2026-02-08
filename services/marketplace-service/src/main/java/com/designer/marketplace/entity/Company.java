package com.designer.marketplace.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
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
 * Company entity - Role-specific data for COMPANY users
 * Maps to 'companies' table in PostgreSQL
 */
@Entity
@Table(name = "companies", indexes = {
        @Index(name = "idx_companies_user_id", columnList = "user_id"),
        @Index(name = "idx_companies_industry", columnList = "industry"),
        @Index(name = "idx_companies_size", columnList = "company_size"),
        @Index(name = "idx_companies_created_at", columnList = "created_at")
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

    // Company Details
    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "company_type", length = 100)
    private String companyType;

    @Column(length = 100)
    private String industry;

    @Column(name = "website_url", length = 500)
    private String websiteUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "company_size", length = 50)
    private CompanySize companySize;

    @Column(name = "registration_number", length = 100)
    private String registrationNumber;

    @Column(name = "tax_id", length = 100)
    private String taxId;

    // Company Contact
    @Column(name = "phone", length = 20)
    private String phone;

    @Column(name = "headquarters_location", length = 255)
    private String headquartersLocation;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "contact_email", length = 255)
    private String contactEmail;

    @Column(name = "total_jobs_posted")
    private Integer totalJobsPosted = 0;
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

