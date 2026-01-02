package com.designer.marketplace.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

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
 * Job entity - represents employment opportunities
 * Maps to 'jobs' table in PostgreSQL
 * This is for full-time/part-time/contract positions - NOT freelance projects
 */
@Entity
@Table(name = "jobs", indexes = {
        @Index(name = "idx_jobs_employer", columnList = "employer_id"),
        @Index(name = "idx_jobs_category", columnList = "category_id"),
        @Index(name = "idx_jobs_status", columnList = "status"),
        @Index(name = "idx_jobs_job_type", columnList = "job_type"),
        @Index(name = "idx_jobs_location", columnList = "location"),
        @Index(name = "idx_jobs_is_remote", columnList = "is_remote"),
        @Index(name = "idx_jobs_created", columnList = "created_at"),
        @Index(name = "idx_jobs_published", columnList = "published_at")
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
    @JoinColumn(name = "employer_id", nullable = false)
    private User employer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private JobCategory category;

    // Basic job information
    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String responsibilities;

    @Column(columnDefinition = "TEXT")
    private String requirements;

    // Job details
    @Enumerated(EnumType.STRING)
    @Column(name = "job_type", nullable = false, length = 50)
    private JobType jobType = JobType.FULL_TIME;

    @Enumerated(EnumType.STRING)
    @Column(name = "employment_type", length = 50)
    private EmploymentType employmentType = EmploymentType.PERMANENT;

    @Enumerated(EnumType.STRING)
    @Column(name = "experience_level", length = 50)
    private ExperienceLevel experienceLevel = ExperienceLevel.INTERMEDIATE;

    // Location
    @Column
    private String location;

    @Column
    private String city;

    @Column
    private String state;

    @Column
    private String country;

    @Column(name = "is_remote")
    private Boolean isRemote = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "remote_type", length = 50)
    private RemoteType remoteType;

    // Compensation
    @Column(name = "salary_min", precision = 12, scale = 2)
    private BigDecimal salaryMin;

    @Column(name = "salary_max", precision = 12, scale = 2)
    private BigDecimal salaryMax;

    @Column(name = "salary_currency", length = 3)
    private String salaryCurrency = "USD";

    @Enumerated(EnumType.STRING)
    @Column(name = "salary_period", length = 20)
    private SalaryPeriod salaryPeriod = SalaryPeriod.ANNUAL;

    @Column(name = "show_salary")
    private Boolean showSalary = true;

    // Benefits and perks
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "json")
    private List<String> benefits;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "json")
    private List<String> perks;

    // Skills and qualifications
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "required_skills", columnDefinition = "json")
    private List<String> requiredSkills;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "preferred_skills", columnDefinition = "json")
    private List<String> preferredSkills;

    @Enumerated(EnumType.STRING)
    @Column(name = "education_level", length = 50)
    private EducationLevel educationLevel;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "json")
    private List<String> certifications;

    // Application details
    @Column(name = "application_deadline")
    private LocalDateTime applicationDeadline;

    @Column(name = "application_email")
    private String applicationEmail;

    @Column(name = "application_url", columnDefinition = "TEXT")
    private String applicationUrl;

    @Column(name = "apply_instructions", columnDefinition = "TEXT")
    private String applyInstructions;

    // Company information
    @Column(name = "company_name")
    private String companyName;

    @Column(name = "company_description", columnDefinition = "TEXT")
    private String companyDescription;

    @Column(name = "company_logo_url", columnDefinition = "TEXT")
    private String companyLogoUrl;

    @Column(name = "company_website", columnDefinition = "TEXT")
    private String companyWebsite;

    @Enumerated(EnumType.STRING)
    @Column(name = "company_size", length = 50)
    private CompanySize companySize;

    @Column
    private String industry;

    // Employment details
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

    // Status and tracking
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private JobStatus status = JobStatus.ACTIVE;

    @Column(name = "views_count")
    private Integer viewsCount = 0;

    @Column(name = "applications_count")
    private Integer applicationsCount = 0;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Column(name = "is_urgent")
    private Boolean isUrgent = false;

    // Timestamps
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

    // Enums
    public enum JobType {
        FULL_TIME,
        PART_TIME,
        CONTRACT,
        TEMPORARY,
        INTERNSHIP
    }

    public enum EmploymentType {
        PERMANENT,
        CONTRACT,
        TEMPORARY
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

    public enum CompanySize {
        STARTUP,
        SMALL,
        MEDIUM,
        LARGE,
        ENTERPRISE
    }

    public enum TravelRequirement {
        NONE,
        OCCASIONAL,
        FREQUENT
    }

    public enum JobStatus {
        DRAFT,
        ACTIVE,
        PAUSED,
        CLOSED,
        FILLED
    }
}
