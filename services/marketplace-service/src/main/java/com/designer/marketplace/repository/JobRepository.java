package com.designer.marketplace.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.designer.marketplace.entity.Job;

/**
 * Repository for Job entity
 * Handles employment job postings
 */
@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    Page<Job> findByStatus(Job.JobStatus status, Pageable pageable);

    Page<Job> findByEmployerId(Long employerId, Pageable pageable);

    Page<Job> findByCategoryId(Long categoryId, Pageable pageable);

    Page<Job> findByCategoryIdAndStatus(Long categoryId, Job.JobStatus status, Pageable pageable);

    Page<Job> findByJobType(Job.JobType jobType, Pageable pageable);

    Page<Job> findByIsRemote(Boolean isRemote, Pageable pageable);

    @Query(value = "SELECT j.* FROM jobs j WHERE " +
            "(:status IS NULL OR j.status = :status) AND " +
            "(:categoryId IS NULL OR j.category_id = :categoryId) AND " +
            "(:jobType IS NULL OR j.job_type = :jobType) AND " +
            "(:experienceLevel IS NULL OR j.experience_level = :experienceLevel) AND " +
            "(:isRemote IS NULL OR j.is_remote = :isRemote) AND " +
            "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
            "ORDER BY j.published_at DESC",
        countQuery = "SELECT COUNT(*) FROM jobs j WHERE " +
            "(:status IS NULL OR j.status = :status) AND " +
            "(:categoryId IS NULL OR j.category_id = :categoryId) AND " +
            "(:jobType IS NULL OR j.job_type = :jobType) AND " +
            "(:experienceLevel IS NULL OR j.experience_level = :experienceLevel) AND " +
            "(:isRemote IS NULL OR j.is_remote = :isRemote) AND " +
            "(:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%')))",
        nativeQuery = true)
    Page<Job> findByFilters(
            @Param("status") String status,
            @Param("categoryId") Long categoryId,
            @Param("jobType") String jobType,
            @Param("experienceLevel") String experienceLevel,
            @Param("isRemote") Boolean isRemote,
            @Param("location") String location,
            Pageable pageable);

    // Search query
    @Query("SELECT j FROM Job j WHERE " +
            "j.status = 'ACTIVE' AND " +
            "(LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(j.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Job> searchJobs(@Param("query") String query, Pageable pageable);

    // Dashboard queries
    @Query("SELECT COUNT(j) FROM Job j WHERE j.employer.id = :employerId")
    Long countByEmployerId(@Param("employerId") Long employerId);

    @Query("SELECT COUNT(j) FROM Job j WHERE j.employer.id = :employerId AND j.status = :status")
    Long countByEmployerIdAndStatus(@Param("employerId") Long employerId, @Param("status") Job.JobStatus status);

    @Query("SELECT COUNT(j) FROM Job j WHERE j.status = 'ACTIVE'")
    Long countActiveJobs();

    // Featured jobs
    @Query("SELECT j FROM Job j WHERE j.status = 'ACTIVE' AND j.isFeatured = true ORDER BY j.publishedAt DESC")
    Page<Job> findFeaturedJobs(Pageable pageable);
}
