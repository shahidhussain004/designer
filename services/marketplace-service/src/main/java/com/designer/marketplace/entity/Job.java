package com.designer.marketplace.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * Job entity - represents project postings by clients
 * Maps to 'jobs' table in PostgreSQL
 */
@Entity
@Table(name = "jobs", indexes = {
        @Index(name = "idx_jobs_client", columnList = "client_id"),
        @Index(name = "idx_jobs_status", columnList = "status"),
        @Index(name = "idx_jobs_category", columnList = "category"),
        @Index(name = "idx_jobs_created", columnList = "created_at")
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
    @JoinColumn(name = "client_id", nullable = false)
    private User client;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(length = 50)
    private String category;

    @Column(name = "required_skills", columnDefinition = "TEXT[]")
    private String[] requiredSkills;

    @Column(name = "budget", columnDefinition = "NUMERIC(10,2)")
    private Double budget;

    @Enumerated(EnumType.STRING)
    @Column(name = "budget_type", length = 20)
    private BudgetType budgetType = BudgetType.FIXED;

    @Column
    private Integer duration;

    @Enumerated(EnumType.STRING)
    @Column(name = "experience_level", length = 20)
    private ExperienceLevel experienceLevel = ExperienceLevel.INTERMEDIATE;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private JobStatus status = JobStatus.OPEN;

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

    public enum ExperienceLevel {
        ENTRY,
        INTERMEDIATE,
        EXPERT
    }

    public enum JobStatus {
        DRAFT,
        OPEN,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED,
        CLOSED
    }
}
