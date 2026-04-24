package com.designer.marketplace.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.Id;
import jakarta.persistence.IdClass;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * CompanyUser entity - Company team members (many-to-many)
 * Supports multiple users per company with different roles
 * Maps to 'company_users' table
 */
@Entity
@Table(name = "company_users", indexes = {
        @Index(name = "idx_company_users_user_id", columnList = "user_id"),
        @Index(name = "idx_company_users_role", columnList = "company_id, role")
})
@IdClass(CompanyUser.CompanyUserId.class)
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CompanyUser {

    @Id
    @Column(name = "company_id", nullable = false)
    private Long companyId;

    @Id
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "role", nullable = false, length = 50)
    private String role = CompanyRole.MEMBER.name();

    @CreatedDate
    @Column(name = "joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt;

    @Column(name = "invited_by_user_id")
    private Long invitedByUserId;

    // JPA relationships
    @ManyToOne
    @JoinColumn(name = "company_id", insertable = false, updatable = false)
    private Company company;

    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "invited_by_user_id", insertable = false, updatable = false)
    private User invitedByUser;

    // Composite key class
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CompanyUserId implements Serializable {
        private Long companyId;
        private Long userId;
    }

    // Company role enum
    public enum CompanyRole {
        OWNER,           // Full control, can delete company
        ADMIN,           // Can manage jobs, view applications, invite members
        HIRING_MANAGER,  // Can manage jobs and applications
        MEMBER           // Read-only access to company data
    }

    // Convenience constructors
    public CompanyUser(Long companyId, Long userId, String role) {
        this.companyId = companyId;
        this.userId = userId;
        this.role = role;
        this.joinedAt = LocalDateTime.now();
    }

    public CompanyUser(Long companyId, Long userId, CompanyRole role) {
        this(companyId, userId, role.name());
    }

    // Permission check helpers
    public boolean canManageJobs() {
        return role.equals(CompanyRole.OWNER.name()) ||
               role.equals(CompanyRole.ADMIN.name()) ||
               role.equals(CompanyRole.HIRING_MANAGER.name());
    }

    public boolean canInviteMembers() {
        return role.equals(CompanyRole.OWNER.name()) ||
               role.equals(CompanyRole.ADMIN.name());
    }

    public boolean isOwner() {
        return role.equals(CompanyRole.OWNER.name());
    }
}
