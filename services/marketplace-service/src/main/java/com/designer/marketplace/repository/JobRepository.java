package com.designer.marketplace.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.designer.marketplace.entity.Job;

/**
 * Repository for Job entity
 */
@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    Page<Job> findByStatus(Job.JobStatus status, Pageable pageable);

    Page<Job> findByClientId(Long clientId, Pageable pageable);

    // Updated to use JobCategory foreign key
    Page<Job> findByJobCategoryId(Long categoryId, Pageable pageable);

    Page<Job> findByJobCategoryIdAndStatus(Long categoryId, Job.JobStatus status, Pageable pageable);

    // Updated to use ExperienceLevel foreign key
    Page<Job> findByExperienceLevelEntityId(Long experienceLevelId, Pageable pageable);

    // Updated query to use foreign key relationships
    @Query("SELECT j FROM Job j WHERE j.status = :status AND " +
            "(:categoryId IS NULL OR j.jobCategory.id = :categoryId) AND " +
            "(:experienceLevelId IS NULL OR j.experienceLevelEntity.id = :experienceLevelId) AND " +
            "(:minBudget IS NULL OR j.budget >= :minBudget) AND " +
            "(:maxBudget IS NULL OR j.budget <= :maxBudget)")
    Page<Job> findByFilters(@Param("status") Job.JobStatus status,
            @Param("categoryId") Long categoryId,
            @Param("experienceLevelId") Long experienceLevelId,
            @Param("minBudget") Double minBudget,
            @Param("maxBudget") Double maxBudget,
            Pageable pageable);

    // Dashboard queries
    @Query("SELECT COUNT(j) FROM Job j WHERE j.client.id = :clientId")
    Long countByClientId(@Param("clientId") Long clientId);

    @Query("SELECT COUNT(j) FROM Job j WHERE j.client.id = :clientId AND j.status = :status")
    Long countByClientIdAndStatus(@Param("clientId") Long clientId, @Param("status") Job.JobStatus status);

    @Query("SELECT j FROM Job j WHERE j.status = 'OPEN' AND " +
            "(LOWER(j.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(j.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Job> searchJobs(@Param("searchTerm") String searchTerm, Pageable pageable);

    @Query("SELECT j FROM Job j WHERE j.client.id = :clientId AND j.status IN :statuses ORDER BY j.createdAt DESC")
    List<Job> findTopByClientIdAndStatusIn(@Param("clientId") Long clientId,
            @Param("statuses") List<Job.JobStatus> statuses,
            Pageable pageable);
    
    // Admin queries
    long countByStatus(Job.JobStatus status);
    
    @Query(value = "SELECT j FROM Job j ORDER BY j.createdAt DESC")
    List<Job> findRecentJobs(Pageable pageable);
}
