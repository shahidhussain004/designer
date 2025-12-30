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
     * Find all contracts for a specific job
     */
    List<Contract> findByJobId(Long jobId);

    /**
     * Find all contracts where user is the client
     */
    List<Contract> findByClientId(Long clientId);

    /**
     * Find all contracts where user is the freelancer
     */
    List<Contract> findByFreelancerId(Long freelancerId);

    /**
     * Find all contracts by status
     */
    List<Contract> findByStatus(ContractStatus status);

    /**
     * Find all contracts for a user (either as client or freelancer)
     */
    @Query("SELECT c FROM Contract c WHERE c.client.id = :userId OR c.freelancer.id = :userId")
    List<Contract> findByUserId(@Param("userId") Long userId);

    /**
     * Find active contracts for a user (either as client or freelancer)
     */
    @Query("SELECT c FROM Contract c WHERE (c.client.id = :userId OR c.freelancer.id = :userId) AND c.status = :status")
    List<Contract> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") ContractStatus status);

    /**
     * Count active contracts for a user
     */
    @Query("SELECT COUNT(c) FROM Contract c WHERE (c.client.id = :userId OR c.freelancer.id = :userId) AND c.status = 'ACTIVE'")
    Long countActiveContractsByUserId(@Param("userId") Long userId);

    /**
     * Find contract by proposal ID
     */
    Contract findByProposalId(Long proposalId);
}
