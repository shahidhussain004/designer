package com.designer.marketplace.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
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
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Project entity - represents freelance/gig project postings by clients
 * Maps to 'projects' table in PostgreSQL (formerly 'jobs')
 * This is for short-term, project-based work - NOT traditional employment
 */
@Entity
@Table(name = "projects", indexes = {
        @Index(name = "idx_projects_client", columnList = "client_id"),
        @Index(name = "idx_projects_status", columnList = "status"),
        @Index(name = "idx_projects_category_fk", columnList = "category_id"),
        @Index(name = "idx_projects_created", columnList = "created_at")
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
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    // Foreign key relationship to ProjectCategory
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private ProjectCategory projectCategory;

    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "required_skills", columnDefinition = "TEXT[]")
    private String[] requiredSkills;

    @Column(name = "budget", columnDefinition = "NUMERIC(10,2)")
    private Double budget;

    @Enumerated(EnumType.STRING)
    @Column(name = "budget_type", length = 20)
    private BudgetType budgetType = BudgetType.FIXED;

    @Column
    private Integer duration;

    // New foreign key relationship to ExperienceLevel
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "experience_level_id")
    private ExperienceLevel experienceLevelEntity;

    // Old experience_level enum column - kept for backward compatibility
    @Enumerated(EnumType.STRING)
    @Column(name = "experience_level", length = 20)
    private ExperienceLevelEnum experienceLevel = ExperienceLevelEnum.INTERMEDIATE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProjectStatus status = ProjectStatus.OPEN;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Column(name = "view_count")
    private Integer viewCount = 0;

    @Column(name = "proposal_count")
    private Integer proposalCount = 0;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "closed_at")
    private LocalDateTime closedAt;

    public enum BudgetType {
        FIXED,
        HOURLY
    }

    // Keep old enum for backward compatibility
    public enum ExperienceLevelEnum {
        ENTRY,
        INTERMEDIATE,
        EXPERT
    }

    public enum ProjectStatus {
        DRAFT,
        OPEN,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED,
        CLOSED
    }
}
