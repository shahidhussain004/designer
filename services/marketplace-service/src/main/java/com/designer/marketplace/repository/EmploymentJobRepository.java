package com.designer.marketplace.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.designer.marketplace.entity.EmploymentJob;

/**
 * Repository for EmploymentJob entity
 * Handles traditional employment job postings
 */
@Repository
public interface EmploymentJobRepository extends JpaRepository<EmploymentJob, Long> {

    Page<EmploymentJob> findByStatus(EmploymentJob.JobStatus status, Pageable pageable);

    Page<EmploymentJob> findByEmployerId(Long employerId, Pageable pageable);

    Page<EmploymentJob> findByCategoryId(Long categoryId, Pageable pageable);

    Page<EmploymentJob> findByCategoryIdAndStatus(Long categoryId, EmploymentJob.JobStatus status, Pageable pageable);

    Page<EmploymentJob> findByJobType(EmploymentJob.JobType jobType, Pageable pageable);

    Page<EmploymentJob> findByIsRemote(Boolean isRemote, Pageable pageable);

    @Query("SELECT j FROM EmploymentJob j WHERE " +
            "(:status IS NULL OR j.status = :status) AND " +
            "(:categoryId IS NULL OR j.category.id = :categoryId) AND " +
            "(:jobType IS NULL OR j.jobType = :jobType) AND " +
            "(:experienceLevel IS NULL OR j.experienceLevel = :experienceLevel) AND " +
            "(:isRemote IS NULL OR j.isRemote = :isRemote) AND " +
            "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')))")
    Page<EmploymentJob> findByFilters(
            @Param("status") EmploymentJob.JobStatus status,
            @Param("categoryId") Long categoryId,
            @Param("jobType") EmploymentJob.JobType jobType,
            @Param("experienceLevel") EmploymentJob.ExperienceLevel experienceLevel,
            @Param("isRemote") Boolean isRemote,
            @Param("location") String location,
            Pageable pageable);

    // Search query
    @Query("SELECT j FROM EmploymentJob j WHERE " +
            "j.status = 'ACTIVE' AND " +
            "(LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(j.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<EmploymentJob> searchJobs(@Param("query") String query, Pageable pageable);

    // Dashboard queries
    @Query("SELECT COUNT(j) FROM EmploymentJob j WHERE j.employer.id = :employerId")
    Long countByEmployerId(@Param("employerId") Long employerId);

    @Query("SELECT COUNT(j) FROM EmploymentJob j WHERE j.employer.id = :employerId AND j.status = :status")
    Long countByEmployerIdAndStatus(@Param("employerId") Long employerId, @Param("status") EmploymentJob.JobStatus status);

    @Query("SELECT COUNT(j) FROM EmploymentJob j WHERE j.status = 'ACTIVE'")
    Long countActiveJobs();

    // Featured jobs
    @Query("SELECT j FROM EmploymentJob j WHERE j.status = 'ACTIVE' AND j.isFeatured = true ORDER BY j.publishedAt DESC")
    Page<EmploymentJob> findFeaturedJobs(Pageable pageable);
}
