package com.designer.marketplace.entity;

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
 * Project entity - Represents freelance/gig project postings by companies
 * Maps to 'projects' table in PostgreSQL
 * This is for short-term, project-based work — NOT traditional company jobs
 */
@Entity
@Table(name = "projects", indexes = {
        @Index(name = "idx_projects_company_id", columnList = "company_id"),
        @Index(name = "idx_projects_status", columnList = "status"),
        @Index(name = "idx_projects_category_id", columnList = "category_id"),
        @Index(name = "idx_projects_created_at", columnList = "created_at")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false)
    private Company company;

    @Column(nullable = false, length = 255)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "scope_of_work", columnDefinition = "TEXT")
    private String scopeOfWork;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private ProjectCategory projectCategory;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "required_skills", columnDefinition = "jsonb")
    private JsonNode requiredSkills;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "preferred_skills", columnDefinition = "jsonb")
    private JsonNode preferredSkills;

    @Column(name = "budget_min_cents")
    private Long budgetMinCents;

    @Column(name = "budget_max_cents")
    private Long budgetMaxCents;

    @Enumerated(EnumType.STRING)
    @Column(name = "budget_type", length = 50)
    private BudgetType budgetType;

    @Column(name = "currency", length = 3)
    private String currency = "USD";

    @Column(name = "timeline", length = 100)
    private String timeline;

    @Column(name = "estimated_duration_days")
    private Integer estimatedDurationDays;

    @Column(name = "experience_level", length = 50)
    private String experienceLevel;

    @Column(name = "project_type", length = 50)
    private String projectType = "SINGLE_PROJECT";

    @Column(name = "priority_level", length = 50)
    private String priorityLevel = "MEDIUM";

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private ProjectStatus status;

    @Column(name = "visibility", length = 50)
    private String visibility = "PUBLIC";

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Column(name = "is_urgent")
    private Boolean isUrgent = false;

    @Column(name = "views_count")
    private Integer viewsCount = 0;

    @Column(name = "proposal_count")
    private Integer proposalCount = 0;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "screening_questions", columnDefinition = "jsonb")
    private JsonNode screeningQuestions;

    @Column(name = "apply_instructions", columnDefinition = "TEXT")
    private String applyInstructions;

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

    public enum BudgetType {
        FIXED,
        HOURLY,
        FIXED_PRICE,
        NOT_SURE
    }

    public enum ProjectStatus {
        DRAFT,
        OPEN,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED,
        CLOSED,
        ARCHIVED
    }
}
