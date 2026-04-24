package com.designer.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.designer.marketplace.entity.UserRole;

/**
 * Repository for UserRole entity (RBAC)
 * Supports querying user roles for permission checks
 */
@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, UserRole.UserRoleId> {

    /**
     * Get all roles for a specific user
     */
    @Query("SELECT ur.role FROM UserRole ur WHERE ur.userId = :userId")
    List<String> findRolesByUserId(@Param("userId") Long userId);

    /**
     * Check if user has a specific role
     */
    @Query("SELECT COUNT(ur) > 0 FROM UserRole ur WHERE ur.userId = :userId AND ur.role = :role")
    boolean hasRole(@Param("userId") Long userId, @Param("role") String role);

    /**
     * Get all users with a specific role
     */
    @Query("SELECT ur.userId FROM UserRole ur WHERE ur.role = :role")
    List<Long> findUserIdsByRole(@Param("role") String role);

    /**
     * Delete all roles for a user (used when deleting user)
     */
    void deleteByUserId(Long userId);

    /**
     * Count users with a specific role
     */
    long countByRole(String role);
}
