package com.designer.marketplace.repository;

import com.designer.marketplace.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for Job entity
 */
@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    Page<Job> findByStatus(Job.JobStatus status, Pageable pageable);

    Page<Job> findByClientId(Long clientId, Pageable pageable);

    Page<Job> findByCategory(String category, Pageable pageable);

    Page<Job> findByCategoryAndStatus(String category, Job.JobStatus status, Pageable pageable);

    Page<Job> findByExperienceLevel(Job.ExperienceLevel experienceLevel, Pageable pageable);

    @Query("SELECT j FROM Job j JOIN FETCH j.client WHERE j.status = :status AND " +
            "(:category IS NULL OR j.category = :category) AND " +
            "(:experienceLevel IS NULL OR j.experienceLevel = :experienceLevel) AND " +
            "(:minBudget IS NULL OR j.budget >= :minBudget) AND " +
            "(:maxBudget IS NULL OR j.budget <= :maxBudget)")
    Page<Job> findByFilters(@Param("status") Job.JobStatus status,
            @Param("category") String category,
            @Param("experienceLevel") Job.ExperienceLevel experienceLevel,
            @Param("minBudget") Double minBudget,
            @Param("maxBudget") Double maxBudget,
            Pageable pageable);

    // Dashboard queries
    @Query("SELECT COUNT(j) FROM Job j WHERE j.client.id = :clientId")
    Long countByClientId(@Param("clientId") Long clientId);

    @Query("SELECT COUNT(j) FROM Job j WHERE j.client.id = :clientId AND j.status = :status")
    Long countByClientIdAndStatus(@Param("clientId") Long clientId, @Param("status") Job.JobStatus status);

    @Query("SELECT j FROM Job j JOIN FETCH j.client WHERE j.status = 'OPEN' AND " +
            "(LOWER(j.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
            "LOWER(j.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Job> searchJobs(@Param("searchTerm") String searchTerm, Pageable pageable);

    @Query("SELECT j FROM Job j JOIN FETCH j.client WHERE j.client.id = :clientId AND j.status IN :statuses ORDER BY j.createdAt DESC")
    List<Job> findTopByClientIdAndStatusIn(@Param("clientId") Long clientId,
            @Param("statuses") List<Job.JobStatus> statuses,
            Pageable pageable);
}
