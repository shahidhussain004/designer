package com.designer.marketplace.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.designer.marketplace.entity.CompanyUser;

/**
 * Repository for CompanyUser entity (Company team members)
 * Supports querying company memberships and permissions
 */
@Repository
public interface CompanyUserRepository extends JpaRepository<CompanyUser, CompanyUser.CompanyUserId> {

    /**
     * Find company membership for a specific user
     */
    @Query("SELECT cu FROM CompanyUser cu WHERE cu.companyId = :companyId AND cu.userId = :userId")
    Optional<CompanyUser> findByCompanyIdAndUserId(@Param("companyId") Long companyId, @Param("userId") Long userId);

    /**
     * Get all members of a company
     */
    @Query("SELECT cu FROM CompanyUser cu WHERE cu.companyId = :companyId ORDER BY cu.joinedAt")
    List<CompanyUser> findByCompanyId(@Param("companyId") Long companyId);

    /**
     * Get all companies a user belongs to
     */
    @Query("SELECT cu FROM CompanyUser cu WHERE cu.userId = :userId")
    List<CompanyUser> findByUserId(@Param("userId") Long userId);

    /**
     * Get all owners of a company
     */
    @Query("SELECT cu FROM CompanyUser cu WHERE cu.companyId = :companyId AND cu.role = 'OWNER'")
    List<CompanyUser> findOwnersByCompanyId(@Param("companyId") Long companyId);

    /**
     * Check if user has permission to manage jobs in company
     */
    @Query("SELECT COUNT(cu) > 0 FROM CompanyUser cu WHERE cu.companyId = :companyId AND cu.userId = :userId " +
           "AND cu.role IN ('OWNER', 'ADMIN', 'HIRING_MANAGER')")
    boolean canManageJobs(@Param("companyId") Long companyId, @Param("userId") Long userId);

    /**
     * Check if user is owner of company
     */
    @Query("SELECT COUNT(cu) > 0 FROM CompanyUser cu WHERE cu.companyId = :companyId AND cu.userId = :userId AND cu.role = 'OWNER'")
    boolean isOwner(@Param("companyId") Long companyId, @Param("userId") Long userId);

    /**
     * Count members in a company
     */
    long countByCompanyId(Long companyId);

    /**
     * Delete all memberships when company is deleted (cascade handled by FK)
     */
    void deleteByCompanyId(Long companyId);
}
