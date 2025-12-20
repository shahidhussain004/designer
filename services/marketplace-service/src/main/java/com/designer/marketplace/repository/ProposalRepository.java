package com.designer.marketplace.repository;

import com.designer.marketplace.entity.Proposal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Proposal entity
 */
@Repository
public interface ProposalRepository extends JpaRepository<Proposal, Long> {

    Page<Proposal> findByJobId(Long jobId, Pageable pageable);

    Page<Proposal> findByFreelancerId(Long freelancerId, Pageable pageable);

    Optional<Proposal> findByJobIdAndFreelancerId(Long jobId, Long freelancerId);

    boolean existsByJobIdAndFreelancerId(Long jobId, Long freelancerId);

    // Dashboard queries
    @Query("SELECT COUNT(p) FROM Proposal p WHERE p.freelancer.id = :freelancerId")
    Long countByFreelancerId(@Param("freelancerId") Long freelancerId);

    @Query("SELECT COUNT(p) FROM Proposal p WHERE p.freelancer.id = :freelancerId AND p.status = :status")
    Long countByFreelancerIdAndStatus(@Param("freelancerId") Long freelancerId,
            @Param("status") Proposal.ProposalStatus status);

    @Query("SELECT COUNT(p) FROM Proposal p WHERE p.job.client.id = :clientId")
    Long countByJobClientId(@Param("clientId") Long clientId);

    @Query("SELECT COUNT(p) FROM Proposal p WHERE p.job.client.id = :clientId AND p.status = :status")
    Long countByJobClientIdAndStatus(@Param("clientId") Long clientId,
            @Param("status") Proposal.ProposalStatus status);

    @Query("SELECT p FROM Proposal p WHERE p.job.client.id = :clientId ORDER BY p.createdAt DESC")
    List<Proposal> findTopByJobClientId(@Param("clientId") Long clientId, Pageable pageable);

    @Query("SELECT p FROM Proposal p WHERE p.freelancer.id = :freelancerId ORDER BY p.createdAt DESC")
    List<Proposal> findTopByFreelancerId(@Param("freelancerId") Long freelancerId, Pageable pageable);
    
    // Admin queries
    long countByStatus(Proposal.ProposalStatus status);
}
