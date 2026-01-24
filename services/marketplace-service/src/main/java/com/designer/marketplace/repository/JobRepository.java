package com.designer.marketplace.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.designer.marketplace.entity.Job;
import com.designer.marketplace.entity.Job.JobStatus;
import com.designer.marketplace.entity.Job.JobType;

/**
 * Repository for Job entity
 * Handles company job postings
 * Implements soft-delete pattern via @SQLRestriction (deleted_at IS NULL)
 */
@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {

    // Basic find methods
    Optional<Job> findById(Long id);

    Page<Job> findByCompanyId(Long companyId, Pageable pageable);

    Page<Job> findByCategoryId(Long categoryId, Pageable pageable);

    Page<Job> findByStatus(JobStatus status, Pageable pageable);

    Page<Job> findByJobType(JobType jobType, Pageable pageable);

    Page<Job> findByIsRemote(Boolean isRemote, Pageable pageable);

    List<Job> findByCompanyIdAndStatus(Long companyId, JobStatus status);

    // Complex queries with FETCH joins
    @Query("SELECT DISTINCT j FROM Job j " +
            "LEFT JOIN FETCH j.company c " +
            "LEFT JOIN FETCH j.category jc " +
            "WHERE j.status = com.designer.marketplace.entity.Job.JobStatus.OPEN " +
            "AND j.deletedAt IS NULL " +
            "ORDER BY j.publishedAt DESC")
    Page<Job> findOpenJobsWithCompanyAndCategory(Pageable pageable);

    // Multi-criteria search with filters - remove location filtering from query, handle in service
    @Query("SELECT DISTINCT j FROM Job j " +
            "LEFT JOIN FETCH j.company c " +
            "WHERE (:status IS NULL OR j.status = :status) " +
            "AND (:companyId IS NULL OR j.company.id = :companyId) " +
            "AND (:categoryId IS NULL OR j.category.id = :categoryId) " +
            "AND (:jobType IS NULL OR j.jobType = :jobType) " +
            "AND (:isRemote IS NULL OR j.isRemote = :isRemote) " +
            "AND j.deletedAt IS NULL " +
            "ORDER BY j.publishedAt DESC")
    Page<Job> findByStatusAndFilters(
            @Param("status") JobStatus status,
            @Param("companyId") Long companyId,
            @Param("categoryId") Long categoryId,
            @Param("jobType") JobType jobType,
            @Param("isRemote") Boolean isRemote,
            Pageable pageable);

    // Salary range queries (cents-based)
    @Query("SELECT j FROM Job j " +
            "WHERE j.status = com.designer.marketplace.entity.Job.JobStatus.OPEN " +
            "AND j.salaryMinCents <= :maxSalary " +
            "AND j.salaryMaxCents >= :minSalary " +
            "AND j.deletedAt IS NULL " +
            "ORDER BY j.publishedAt DESC")
    Page<Job> findByShowSalaryAndSalaryRange(
            @Param("minSalary") Long minSalary,
            @Param("maxSalary") Long maxSalary,
            Pageable pageable);

    // JSONB skill search (requires required_skills @> '{...}'::jsonb)
    @Query(value = "SELECT j.* FROM jobs j " +
            "WHERE j.status = 'OPEN' " +
            "AND j.required_skills @> :skills " +
            "AND j.deleted_at IS NULL " +
            "ORDER BY j.published_at DESC",
        nativeQuery = true)
    Page<Job> findByRequiredSkillsContains(
            @Param("skills") String skills,
            Pageable pageable);

    // JSONB skill overlap (ANY)
    @Query(value = "SELECT j.* FROM jobs j " +
            "WHERE j.status = 'OPEN' " +
            "AND j.required_skills && CAST(:skills AS TEXT[]) " +
            "AND j.deleted_at IS NULL " +
            "ORDER BY j.published_at DESC",
        nativeQuery = true)
    Page<Job> findByRequiredSkillsAny(
            @Param("skills") String[] skills,
            Pageable pageable);

    // Full-text search on title and description (nativeQuery with no Pageable sort to avoid case sensitivity issue)
    @Query(value = "SELECT j.* FROM jobs j " +
            "WHERE j.status = 'OPEN' " +
            "AND j.deleted_at IS NULL " +
            "AND (to_tsvector('english', j.title) @@ plainto_tsquery('english', :query) " +
            "OR to_tsvector('english', j.description) @@ plainto_tsquery('english', :query)) " +
            "ORDER BY j.published_at DESC " +
            "OFFSET :offset LIMIT :limit",
        nativeQuery = true)
    List<Job> searchJobs(@Param("query") String query, @Param("offset") int offset, @Param("limit") int limit);

    // Featured jobs
    @Query("SELECT j FROM Job j " +
            "LEFT JOIN FETCH j.company c " +
            "WHERE j.status = com.designer.marketplace.entity.Job.JobStatus.OPEN " +
            "AND j.isFeatured = true " +
            "AND j.deletedAt IS NULL " +
            "ORDER BY j.publishedAt DESC")
    Page<Job> findFeaturedJobs(Pageable pageable);

    // Urgent jobs
    @Query("SELECT j FROM Job j " +
            "LEFT JOIN FETCH j.company c " +
            "WHERE j.status = com.designer.marketplace.entity.Job.JobStatus.OPEN " +
            "AND j.isUrgent = true " +
            "AND j.deletedAt IS NULL " +
            "ORDER BY j.publishedAt DESC")
    Page<Job> findUrgentJobs(Pageable pageable);

    // Dashboard - count queries
    @Query("SELECT COUNT(j) FROM Job j WHERE j.company.id = :companyId AND j.deletedAt IS NULL")
    Long countByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT COUNT(j) FROM Job j WHERE j.company.id = :companyId AND j.status = :status AND j.deletedAt IS NULL")
    Long countByCompanyIdAndStatus(@Param("companyId") Long companyId, @Param("status") JobStatus status);

    @Query("SELECT COUNT(j) FROM Job j WHERE j.status = com.designer.marketplace.entity.Job.JobStatus.OPEN AND j.deletedAt IS NULL")
    Long countOpenJobs();

    @Query("SELECT COUNT(j) FROM Job j WHERE j.isFeatured = true AND j.deletedAt IS NULL")
    Long countFeaturedJobs();

    // Recently posted jobs
    @Query("SELECT j FROM Job j " +
            "LEFT JOIN FETCH j.company c " +
            "WHERE j.status = com.designer.marketplace.entity.Job.JobStatus.OPEN " +
            "AND j.deletedAt IS NULL " +
            "ORDER BY j.publishedAt DESC")
    Page<Job> findRecentlyPostedJobs(Pageable pageable);

    // Jobs by company (with company fetch)
    @Query("SELECT DISTINCT j FROM Job j " +
            "LEFT JOIN FETCH j.company c " +
            "WHERE j.company.id = :companyId AND j.deletedAt IS NULL")
    Page<Job> findByCompanyIdWithCompany(@Param("companyId") Long companyId, Pageable pageable);

    // Expiring soon (deadline approaching)
    @Query("SELECT j FROM Job j " +
            "WHERE j.applicationDeadline IS NOT NULL " +
            "AND j.applicationDeadline <= :deadline " +
            "AND j.status = com.designer.marketplace.entity.Job.JobStatus.OPEN " +
            "AND j.deletedAt IS NULL " +
            "ORDER BY j.applicationDeadline ASC")
    Page<Job> findExpiringSoonJobs(@Param("deadline") LocalDateTime deadline, Pageable pageable);

    // Projection interface for lightweight queries
    interface JobSummary {
        Long getId();
        String getTitle();
        String getLocation();
        Boolean getIsRemote();
        Long getSalaryMinCents();
        Long getSalaryMaxCents();
    }

    @Query("SELECT j.id as id, j.title as title, j.location as location, j.isRemote as isRemote, " +
            "j.salaryMinCents as salaryMinCents, j.salaryMaxCents as salaryMaxCents " +
            "FROM Job j WHERE j.status = com.designer.marketplace.entity.Job.JobStatus.OPEN AND j.deletedAt IS NULL " +
            "ORDER BY j.publishedAt DESC")
    Page<JobSummary> findJobSummaries(Pageable pageable);
}
