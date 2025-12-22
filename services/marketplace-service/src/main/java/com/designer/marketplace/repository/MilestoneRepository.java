package com.designer.marketplace.repository;

import com.designer.marketplace.entity.Milestone;
import com.designer.marketplace.entity.Milestone.MilestoneStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, Long> {

    List<Milestone> findByJobIdOrderBySequenceOrderAsc(Long jobId);

    List<Milestone> findByProposalIdOrderBySequenceOrderAsc(Long proposalId);

    List<Milestone> findByJobIdAndStatus(Long jobId, MilestoneStatus status);

    Optional<Milestone> findByIdAndJobId(Long id, Long jobId);

    @Query("SELECT m FROM Milestone m WHERE m.job.id = :jobId AND m.status IN :statuses ORDER BY m.sequenceOrder ASC")
    List<Milestone> findByJobIdAndStatusIn(@Param("jobId") Long jobId,
            @Param("statuses") List<MilestoneStatus> statuses);

    @Query("SELECT COUNT(m) FROM Milestone m WHERE m.job.id = :jobId")
    int countByJobId(@Param("jobId") Long jobId);

    @Query("SELECT COUNT(m) FROM Milestone m WHERE m.job.id = :jobId AND m.status = :status")
    int countByJobIdAndStatus(@Param("jobId") Long jobId, @Param("status") MilestoneStatus status);

    @Query("SELECT SUM(m.amount) FROM Milestone m WHERE m.job.id = :jobId")
    Long sumAmountByJobId(@Param("jobId") Long jobId);

    @Query("SELECT SUM(m.amount) FROM Milestone m WHERE m.job.id = :jobId AND m.status = :status")
    Long sumAmountByJobIdAndStatus(@Param("jobId") Long jobId, @Param("status") MilestoneStatus status);

    @Query("SELECT m FROM Milestone m WHERE m.job.client.id = :clientId ORDER BY m.createdAt DESC")
    Page<Milestone> findByClientId(@Param("clientId") Long clientId, Pageable pageable);

    @Query("SELECT m FROM Milestone m WHERE m.proposal.freelancer.id = :freelancerId ORDER BY m.createdAt DESC")
    Page<Milestone> findByFreelancerId(@Param("freelancerId") Long freelancerId, Pageable pageable);

    @Query("SELECT m FROM Milestone m WHERE m.status = 'SUBMITTED' AND m.job.client.id = :clientId ORDER BY m.submittedAt ASC")
    List<Milestone> findPendingApprovalByClientId(@Param("clientId") Long clientId);

    @Query("SELECT m FROM Milestone m WHERE m.dueDate < CURRENT_TIMESTAMP AND m.status IN ('PENDING', 'FUNDED', 'IN_PROGRESS')")
    List<Milestone> findOverdueMilestones();
}
