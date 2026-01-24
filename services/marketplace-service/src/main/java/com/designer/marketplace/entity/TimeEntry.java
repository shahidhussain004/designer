package com.designer.marketplace.entity;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

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
 * TimeEntry entity - Represents tracked work hours for hourly contracts
 * Maps to 'time_entries' table in PostgreSQL
 */
@Entity
@Table(name = "time_entries", indexes = {
        @Index(name = "idx_time_entries_contract_id", columnList = "contract_id"),
        @Index(name = "idx_time_entries_freelancer_id", columnList = "freelancer_id"),
        @Index(name = "idx_time_entries_status", columnList = "status"),
        @Index(name = "idx_time_entries_work_date", columnList = "work_date")
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

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "hours_worked", precision = 5, scale = 2)
    private BigDecimal hoursWorked;

    @Column(name = "rate_per_hour_cents")
    private Long ratePerHourCents;

    @Column(name = "work_date")
    private LocalDate workDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 50)
    private TimeEntryStatus status;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum TimeEntryStatus {
        PENDING,
        APPROVED,
        REJECTED,
        PAID
    }

    /**
     * Calculate total amount in cents
     */
    public Long getTotalAmountCents() {
        if (hoursWorked != null && ratePerHourCents != null) {
            return hoursWorked.multiply(new BigDecimal(ratePerHourCents)).longValue();
        }
        return 0L;
    }
}
