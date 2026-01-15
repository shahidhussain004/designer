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
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Contract entity - Represents a formal agreement between company and freelancer
 */
@Entity
@Table(name = "contracts", indexes = {
    @Index(name = "idx_contract_project_id", columnList = "project_id"),
    @Index(name = "idx_contract_company_id", columnList = "company_id"),
    @Index(name = "idx_contract_freelancer_id", columnList = "freelancer_id"),
    @Index(name = "idx_contract_status", columnList = "status")
})
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contract {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false, foreignKey = @ForeignKey(name = "fk_contract_project"))
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", nullable = false, foreignKey = @ForeignKey(name = "fk_contract_company"))
    private Company company;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "freelancer_id", nullable = false, foreignKey = @ForeignKey(name = "fk_contract_freelancer"))
    private Freelancer freelancer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proposal_id", foreignKey = @ForeignKey(name = "fk_contract_proposal"))
    private Proposal proposal;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "contract_type", nullable = false, length = 20)
    @Builder.Default
    private ContractType contractType = ContractType.FIXED_PRICE;

    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_schedule", length = 20)
    private PaymentSchedule paymentSchedule;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private ContractStatus status = ContractStatus.PENDING;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    public enum ContractType {
        FIXED_PRICE, HOURLY, MILESTONE_BASED
    }

    public enum PaymentSchedule {
        UPFRONT, ON_COMPLETION, MILESTONE_BASED, WEEKLY, MONTHLY
    }

    public enum ContractStatus {
        PENDING, ACTIVE, COMPLETED, CANCELLED, DISPUTED
    }
}
