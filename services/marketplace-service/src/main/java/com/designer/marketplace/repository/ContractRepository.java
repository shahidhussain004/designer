package com.designer.marketplace.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.designer.marketplace.entity.Contract;
import com.designer.marketplace.entity.Contract.ContractStatus;

/**
 * Repository interface for Contract operations
 */
@Repository
public interface ContractRepository extends JpaRepository<Contract, Long> {

    /**
     * Find all contracts for a specific project
     */
    List<Contract> findByProjectId(Long projectId);

    /**
     * Find all contracts where user is the company (via project)
     */
    @Query("SELECT c FROM Contract c WHERE c.project.company.id = :companyId")
    List<Contract> findByCompanyId(@Param("companyId") Long companyId);

    /**
     * Find all contracts where user is the freelancer
     */
    List<Contract> findByFreelancerId(Long freelancerId);

    /**
     * Find all contracts by status
     */
    List<Contract> findByStatus(ContractStatus status);

    /**
     * Find all contracts for a user (either as company or freelancer)
     */
    @Query("SELECT c FROM Contract c WHERE c.project.company.id = :userId OR c.freelancer.id = :userId")
    List<Contract> findByUserId(@Param("userId") Long userId);

    /**
     * Find active contracts for a user (either as company or freelancer)
     */
    @Query("SELECT c FROM Contract c WHERE (c.project.company.id = :userId OR c.freelancer.id = :userId) AND c.status = :status")
    List<Contract> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") ContractStatus status);

    /**
     * Count active contracts for a user
     */
    @Query("SELECT COUNT(c) FROM Contract c WHERE (c.project.company.id = :userId OR c.freelancer.id = :userId) AND c.status = com.designer.marketplace.entity.Contract.ContractStatus.ACTIVE")
    Long countActiveContractsByUserId(@Param("userId") Long userId);
}
