package com.designer.marketplace.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.designer.marketplace.entity.Proposal;

/**
 * Repository for Proposal entity
 * Handles proposals for freelance projects
 */
@Repository
public interface ProposalRepository extends JpaRepository<Proposal, Long> {

    Page<Proposal> findByProjectId(Long projectId, Pageable pageable);

    Page<Proposal> findByFreelancerId(Long freelancerId, Pageable pageable);

    Optional<Proposal> findByProjectIdAndFreelancerId(Long projectId, Long freelancerId);

    boolean existsByProjectIdAndFreelancerId(Long projectId, Long freelancerId);

    // Dashboard queries
    @Query("SELECT COUNT(p) FROM Proposal p WHERE p.freelancer.id = :freelancerId")
    Long countByFreelancerId(@Param("freelancerId") Long freelancerId);

    @Query("SELECT COUNT(p) FROM Proposal p WHERE p.freelancer.id = :freelancerId AND p.status = :status")
    Long countByFreelancerIdAndStatus(@Param("freelancerId") Long freelancerId,
            @Param("status") Proposal.ProposalStatus status);

    @Query("SELECT COUNT(p) FROM Proposal p WHERE p.project.company.id = :companyId")
    Long countByProjectCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT COUNT(p) FROM Proposal p WHERE p.project.company.id = :companyId AND p.status = :status")
    Long countByProjectCompanyIdAndStatus(@Param("companyId") Long companyId,
            @Param("status") Proposal.ProposalStatus status);

    @Query("SELECT p FROM Proposal p WHERE p.project.company.id = :companyId ORDER BY p.createdAt DESC")
    List<Proposal> findTopByProjectCompanyId(@Param("companyId") Long companyId, Pageable pageable);
    @Query("SELECT p FROM Proposal p WHERE p.freelancer.id = :freelancerId ORDER BY p.createdAt DESC")
    List<Proposal> findTopByFreelancerId(@Param("freelancerId") Long freelancerId, Pageable pageable);
    
    // Admin queries
    long countByStatus(Proposal.ProposalStatus status);
}
