package com.designer.marketplace.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.databind.JsonNode;

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
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Job entity - Traditional company job opportunities (full-time, part-time, contract)
 * Maps to 'jobs' table in PostgreSQL
 * This is for company employment positions - NOT freelance projects
 */
@Entity
@Table(name = "jobs", indexes = {
        @Index(name = "idx_jobs_company_id", columnList = "company_id"),
        @Index(name = "idx_jobs_category_id", columnList = "category_id"),
        @Index(name = "idx_jobs_status", columnList = "status"),
        @Index(name = "idx_jobs_job_type", columnList = "job_type"),
        @Index(name = "idx_jobs_is_remote", columnList = "is_remote"),
        @Index(name = "idx_jobs_created_at", columnList = "created_at")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private JobCategory category;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String responsibilities;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    @Enumerated(EnumType.STRING)
    @Column(name = "job_type", nullable = false, length = 50)
    private JobType jobType;

    @Enumerated(EnumType.STRING)
    @Column(name = "experience_level", length = 50)
    private ExperienceLevel experienceLevel;

    @Column(length = 255)
    private String location;

    @Column(length = 100)
    private String city;

    @Column(length = 100)
    private String state;

    @Column(length = 100)
    private String country;

    @Column(name = "is_remote")
    private Boolean isRemote = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "remote_type", length = 50)
    private RemoteType remoteType;

    @Column(name = "salary_min_cents")
    private Long salaryMinCents;

    @Column(name = "salary_max_cents")
    private Long salaryMaxCents;

    @Column(name = "salary_currency", length = 3)
    private String salaryCurrency = "USD";

    @Enumerated(EnumType.STRING)
    @Column(name = "salary_period", length = 20)
    private SalaryPeriod salaryPeriod;

    @Column(name = "show_salary")
    private Boolean showSalary = true;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "benefits", columnDefinition = "jsonb")
    private JsonNode benefits;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "perks", columnDefinition = "jsonb")
    private JsonNode perks;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "required_skills", columnDefinition = "jsonb")
    private JsonNode requiredSkills;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "preferred_skills", columnDefinition = "jsonb")
    private JsonNode preferredSkills;

    @Enumerated(EnumType.STRING)
    @Column(name = "education_level", length = 50)
    private EducationLevel educationLevel;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "certifications", columnDefinition = "jsonb")
    private JsonNode certifications;

    @Column(name = "application_deadline")
    private LocalDateTime applicationDeadline;

    @Column(name = "application_email", length = 255)
    private String applicationEmail;

    @Column(name = "application_url", columnDefinition = "TEXT")
    private String applicationUrl;

    @Column(name = "apply_instructions", columnDefinition = "TEXT")
    private String applyInstructions;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "positions_available")
    private Integer positionsAvailable = 1;

    @Enumerated(EnumType.STRING)
    @Column(name = "travel_requirement", length = 50)
    private TravelRequirement travelRequirement;

    @Column(name = "security_clearance_required")
    private Boolean securityClearanceRequired = false;

    @Column(name = "visa_sponsorship")
    private Boolean visaSponsorship = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private JobStatus status;

    @Column(name = "views_count")
    private Integer viewsCount = 0;

    @Column(name = "applications_count")
    private Integer applicationsCount = 0;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Column(name = "is_urgent")
    private Boolean isUrgent = false;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public enum JobType {
        FULL_TIME,
        PART_TIME,
        CONTRACT,
        TEMPORARY,
        INTERNSHIP
    }

    public enum ExperienceLevel {
        ENTRY,
        INTERMEDIATE,
        SENIOR,
        LEAD,
        EXECUTIVE
    }

    public enum RemoteType {
        FULLY_REMOTE,
        HYBRID,
        ON_SITE
    }

    public enum SalaryPeriod {
        HOURLY,
        DAILY,
        WEEKLY,
        MONTHLY,
        ANNUAL
    }

    public enum EducationLevel {
        HIGH_SCHOOL,
        ASSOCIATE,
        BACHELOR,
        MASTER,
        PHD
    }

    public enum TravelRequirement {
        NONE,
        OCCASIONAL,
        FREQUENT
    }

    public enum JobStatus {
        DRAFT,
        OPEN,
        PAUSED,
        CLOSED,
        FILLED
    }
}
