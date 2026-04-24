package com.designer.marketplace.entity;

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

import java.io.Serializable;

/**
 * UserRole entity - Many-to-many user roles (RBAC)
 * Supports users having multiple roles (e.g., both FREELANCER and COMPANY)
 * Maps to 'user_roles' table
 */
@Entity
@Table(name = "user_roles", indexes = {
        @Index(name = "idx_user_roles_role", columnList = "role"),
        @Index(name = "idx_user_roles_granted_at", columnList = "granted_at")
})
@IdClass(UserRole.UserRoleId.class)
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRole {

    @Id
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Id
    @Column(name = "role", nullable = false, length = 50)
    private String role;

    @CreatedDate
    @Column(name = "granted_at", nullable = false, updatable = false)
    private LocalDateTime grantedAt;

    @Column(name = "granted_by_user_id")
    private Long grantedByUserId;

    // JPA requires relationships, not just IDs
    @ManyToOne
    @JoinColumn(name = "user_id", insertable = false, updatable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "granted_by_user_id", insertable = false, updatable = false)
    private User grantedByUser;

    // Composite key class
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserRoleId implements Serializable {
        private Long userId;
        private String role;
    }

    // Convenience constructors
    public UserRole(Long userId, String role) {
        this.userId = userId;
        this.role = role;
        this.grantedAt = LocalDateTime.now();
    }

    public UserRole(Long userId, String role, Long grantedByUserId) {
        this.userId = userId;
        this.role = role;
        this.grantedByUserId = grantedByUserId;
        this.grantedAt = LocalDateTime.now();
    }

    // Role constants for type safety
    public static final String ROLE_FREELANCER = "FREELANCER";
    public static final String ROLE_COMPANY = "COMPANY";
    public static final String ROLE_ADMIN = "ADMIN";
    public static final String ROLE_INSTRUCTOR = "INSTRUCTOR";
}
