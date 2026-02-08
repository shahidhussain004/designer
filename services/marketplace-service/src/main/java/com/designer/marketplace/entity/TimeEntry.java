package com.designer.marketplace.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

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
 * TimeEntry entity - Represents tracked work hours for hourly contracts
 * Maps to 'time_entries' table in PostgreSQL
 */
@Entity
@Table(name = "time_entries", indexes = {
        @Index(name = "idx_time_entries_contract_id", columnList = "contract_id"),
        @Index(name = "idx_time_entries_freelancer_id", columnList = "freelancer_id"),
        @Index(name = "idx_time_entries_status", columnList = "status"),
        @Index(name = "idx_time_entries_date", columnList = "date")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contract_id", nullable = false)
    private Contract contract;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_id", nullable = false)
    private Freelancer freelancer;

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "hours_logged", precision = 5, scale = 2, nullable = false)
    private BigDecimal hoursLogged;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "task_description", columnDefinition = "TEXT")
    private String taskDescription;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "work_diary", columnDefinition = "jsonb", nullable = false)
    private JsonNode workDiary;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "screenshot_urls", columnDefinition = "jsonb", nullable = false)
    private JsonNode screenshotUrls;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "file_attachments", columnDefinition = "jsonb", nullable = false)
    private JsonNode fileAttachments;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50, nullable = false)
    private TimeEntryStatus status;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public enum TimeEntryStatus {
        DRAFT,
        SUBMITTED,
        APPROVED,
        REJECTED
    }
}
