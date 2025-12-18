package com.designer.marketplace.repository;

import com.designer.marketplace.entity.Proposal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

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
}
