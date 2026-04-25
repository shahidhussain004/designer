package com.designer.marketplace.entity;

import java.time.LocalDateTime;
import java.util.List;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.Type;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.designer.marketplace.config.TextArrayType;
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
 * JobApplication entity - represents applications submitted for company jobs
 * Maps to 'job_applications' table in PostgreSQL
 * Implements soft-delete pattern via deleted_at column
 */
@Entity
@Table(name = "job_applications", indexes = {
        @Index(name = "idx_job_applications_job_id", columnList = "job_id"),
        @Index(name = "idx_job_applications_applicant_id", columnList = "applicant_id"),
        @Index(name = "idx_job_applications_status", columnList = "status"),
        @Index(name = "idx_job_applications_created_at", columnList = "created_at")
})
@SQLDelete(sql = "UPDATE job_applications SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?")
@SQLRestriction("deleted_at IS NULL")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job_id", nullable = false)
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id", nullable = false)
    private Freelancer applicant;

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Column(nullable = false, length = 255)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(name = "cover_letter", columnDefinition = "TEXT")
    private String coverLetter;

    @Column(name = "resume_url", columnDefinition = "TEXT")
    private String resumeUrl;

    @Column(name = "portfolio_url", columnDefinition = "TEXT")
    private String portfolioUrl;

    @Column(name = "linkedin_url", columnDefinition = "TEXT")
    private String linkedinUrl;

    @Type(value = TextArrayType.class)
    @Column(name = "additional_documents", columnDefinition = "text[]")
    private List<String> additionalDocuments;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "answers", columnDefinition = "jsonb")
    private JsonNode answers;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private ApplicationStatus status = ApplicationStatus.PENDING;

    @Column(name = "company_notes", columnDefinition = "TEXT")
    private String companyNotes;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    // Offer details (populated when status is OFFERED)
    @Column(name = "offered_salary_cents")
    private Long offeredSalaryCents; // Salary in cents

    @Column(name = "offered_salary_currency", length = 3)
    private String offeredSalaryCurrency; // USD, EUR, SEK, etc.

    @Column(name = "offered_salary_period", length = 20)
    private String offeredSalaryPeriod; // HOURLY, MONTHLY, YEARLY

    @Column(name = "offered_start_date")
    private LocalDateTime offeredStartDate; // Proposed start date

    @Column(name = "offer_expiration_date")
    private LocalDateTime offerExpirationDate; // When does the offer expire?

    @Column(name = "contract_type", length = 50)
    private String contractType; // FULL_TIME, PART_TIME, CONTRACT, FREELANCE

    @Column(name = "contract_duration_months")
    private Integer contractDurationMonths; // For fixed-term contracts

    @Column(name = "offer_benefits", columnDefinition = "TEXT")
    private String offerBenefits; // Health insurance, vacation days, etc.

    @Column(name = "offer_additional_terms", columnDefinition = "TEXT")
    private String offerAdditionalTerms; // Remote policy, equipment, probation, etc.

    @Column(name = "offer_document_url", columnDefinition = "TEXT")
    private String offerDocumentUrl; // Link to formal offer letter PDF

    @Column(name = "offer_made_at")
    private LocalDateTime offerMadeAt; // When was the offer made?

    @Column(name = "offer_responded_at")
    private LocalDateTime offerRespondedAt; // When did freelancer respond?

    @Column(name = "applied_at")
    private LocalDateTime appliedAt;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    public enum ApplicationStatus {
        PENDING,
        SUBMITTED,
        REVIEWING,
        SHORTLISTED,
        INTERVIEWING,
        OFFERED,
        ACCEPTED,
        REJECTED,
        WITHDRAWN
    }
}

