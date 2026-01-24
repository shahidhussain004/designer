package com.designer.marketplace.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.designer.marketplace.entity.Milestone;
import com.designer.marketplace.entity.Milestone.MilestoneStatus;

@Repository
public interface MilestoneRepository extends JpaRepository<Milestone, Long> {

    @Query("SELECT m FROM Milestone m WHERE m.contract.project.id = :projectId ORDER BY m.sequenceOrder ASC")
    List<Milestone> findByProjectIdOrderBySequenceOrderAsc(@Param("projectId") Long projectId);

    @Query("SELECT m FROM Milestone m WHERE m.contract.id = :contractId ORDER BY m.sequenceOrder ASC")
    List<Milestone> findByContractIdOrderBySequenceOrderAsc(@Param("contractId") Long contractId);

    @Query("SELECT m FROM Milestone m WHERE m.contract.project.id = :projectId AND m.status = :status")
    List<Milestone> findByProjectIdAndStatus(@Param("projectId") Long projectId, @Param("status") MilestoneStatus status);

    @Query("SELECT m FROM Milestone m WHERE m.id = :id AND m.contract.project.id = :projectId")
    Optional<Milestone> findByIdAndProjectId(@Param("id") Long id, @Param("projectId") Long projectId);

    @Query("SELECT m FROM Milestone m WHERE m.contract.project.id = :projectId AND m.status IN :statuses ORDER BY m.sequenceOrder ASC")
    List<Milestone> findByProjectIdAndStatusIn(@Param("projectId") Long projectId,
            @Param("statuses") List<MilestoneStatus> statuses);

    @Query("SELECT COUNT(m) FROM Milestone m WHERE m.contract.project.id = :projectId")
    int countByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT COUNT(m) FROM Milestone m WHERE m.contract.project.id = :projectId AND m.status = :status")
    int countByProjectIdAndStatus(@Param("projectId") Long projectId, @Param("status") MilestoneStatus status);

    @Query("SELECT SUM(m.amountCents) FROM Milestone m WHERE m.contract.project.id = :projectId")
    Long sumAmountByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT SUM(m.amountCents) FROM Milestone m WHERE m.contract.project.id = :projectId AND m.status = :status")
    Long sumAmountByProjectIdAndStatus(@Param("projectId") Long projectId, @Param("status") MilestoneStatus status);

    @Query("SELECT m FROM Milestone m WHERE m.contract.project.company.id = :companyId ORDER BY m.createdAt DESC")
    Page<Milestone> findByCompanyId(@Param("companyId") Long companyId, Pageable pageable);

    @Query("SELECT m FROM Milestone m WHERE m.contract.freelancer.id = :freelancerId ORDER BY m.createdAt DESC")
    Page<Milestone> findByFreelancerId(@Param("freelancerId") Long freelancerId, Pageable pageable);

    @Query("SELECT m FROM Milestone m WHERE m.contract.project.company.id = :companyId ORDER BY m.createdAt DESC")
    Page<Milestone> findByContractCompanyIdOrderByCreatedAtDesc(@Param("companyId") Long companyId, Pageable pageable);

    @Query("SELECT m FROM Milestone m WHERE m.contract.freelancer.id = :freelancerId ORDER BY m.createdAt DESC")
    Page<Milestone> findByContractFreelancerIdOrderByCreatedAtDesc(@Param("freelancerId") Long freelancerId, Pageable pageable);

    @Query("SELECT m FROM Milestone m WHERE m.contract.id = :contractId ORDER BY m.sequenceOrder ASC")
    List<Milestone> findByContractIdOrderBySequenceOrder(@Param("contractId") Long contractId);

    @Query("SELECT COUNT(m) FROM Milestone m WHERE m.contract.id = :contractId")
    long countByContractId(@Param("contractId") Long contractId);

    @Query("SELECT m FROM Milestone m WHERE m.status = 'SUBMITTED' AND m.contract.project.company.id = :companyId ORDER BY m.submittedAt ASC")
    List<Milestone> findPendingApprovalByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT m FROM Milestone m WHERE m.dueDate < CURRENT_TIMESTAMP AND m.status IN ('PENDING', 'FUNDED', 'IN_PROGRESS')")
    List<Milestone> findOverdueMilestones();
}
