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

import com.designer.marketplace.entity.JobApplication;
import com.designer.marketplace.entity.JobApplication.ApplicationStatus;

/**
 * Repository for JobApplication entity
 * Handles applications for company jobs
 * Implements soft-delete pattern via @SQLRestriction (deleted_at IS NULL)
 */
@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long>, JpaSpecificationExecutor<JobApplication> {

    Optional<JobApplication> findById(Long id);

    Page<JobApplication> findByJobId(Long jobId, Pageable pageable);

    Page<JobApplication> findByApplicantId(Long applicantId, Pageable pageable);

    Page<JobApplication> findByStatus(ApplicationStatus status, Pageable pageable);

    Page<JobApplication> findByJobIdAndStatus(Long jobId, ApplicationStatus status, Pageable pageable);

    List<JobApplication> findByJobIdOrderByCreatedAtDesc(Long jobId);

    List<JobApplication> findByApplicantIdOrderByCreatedAtDesc(Long applicantId);

    boolean existsByJobIdAndApplicantId(Long jobId, Long applicantId);

    // FETCH join queries to prevent N+1
    @Query("SELECT DISTINCT a FROM JobApplication a " +
            "LEFT JOIN FETCH a.job j " +
            "LEFT JOIN FETCH a.applicant f " +
            "WHERE a.job.id = :jobId AND a.deletedAt IS NULL")
    Page<JobApplication> findByJobIdWithDetails(@Param("jobId") Long jobId, Pageable pageable);

    @Query("SELECT DISTINCT a FROM JobApplication a " +
            "LEFT JOIN FETCH a.job j " +
            "LEFT JOIN FETCH j.company c " +
            "WHERE a.applicant.id = :applicantId AND a.deletedAt IS NULL")
    Page<JobApplication> findByApplicantIdWithDetails(@Param("applicantId") Long applicantId, Pageable pageable);

    // Multi-status filter
    @Query("SELECT DISTINCT a FROM JobApplication a " +
            "LEFT JOIN FETCH a.job j " +
            "WHERE a.job.id = :jobId " +
            "AND (:status IS NULL OR a.status = :status) " +
            "AND a.deletedAt IS NULL")
    Page<JobApplication> findByJobIdAndStatusWithFilters(
            @Param("jobId") Long jobId,
            @Param("status") ApplicationStatus status,
            Pageable pageable);

    // Company dashboard queries
    @Query("SELECT DISTINCT a FROM JobApplication a " +
            "LEFT JOIN FETCH a.job j " +
            "LEFT JOIN FETCH a.applicant f " +
            "WHERE a.job.company.id = :companyId AND a.deletedAt IS NULL")
    Page<JobApplication> findByJobCompanyIdWithDetails(@Param("companyId") Long companyId, Pageable pageable);

    @Query("SELECT DISTINCT a FROM JobApplication a " +
            "LEFT JOIN FETCH a.job j " +
            "LEFT JOIN FETCH a.applicant f " +
            "WHERE a.job.company.id = :companyId " +
            "AND a.status = :status " +
            "AND a.deletedAt IS NULL")
    Page<JobApplication> findByJobCompanyIdAndStatus(
            @Param("companyId") Long companyId,
            @Param("status") ApplicationStatus status,
            Pageable pageable);

    // Count queries
    @Query("SELECT COUNT(a) FROM JobApplication a WHERE a.job.id = :jobId AND a.deletedAt IS NULL")
    Long countByJobId(@Param("jobId") Long jobId);

    @Query("SELECT COUNT(a) FROM JobApplication a WHERE a.applicant.id = :applicantId AND a.deletedAt IS NULL")
    Long countByApplicantId(@Param("applicantId") Long applicantId);

    @Query("SELECT COUNT(a) FROM JobApplication a WHERE a.job.company.id = :companyId AND a.deletedAt IS NULL")
    Long countByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT COUNT(a) FROM JobApplication a WHERE a.job.company.id = :companyId AND a.status = :status AND a.deletedAt IS NULL")
    Long countByCompanyIdAndStatus(@Param("companyId") Long companyId, @Param("status") ApplicationStatus status);

    // Status counts for dashboard
    @Query("SELECT COUNT(a) FROM JobApplication a WHERE a.job.id = :jobId AND a.status = :status AND a.deletedAt IS NULL")
    Long countByJobIdAndStatus(@Param("jobId") Long jobId, @Param("status") ApplicationStatus status);

    // Recent applications
    @Query("SELECT DISTINCT a FROM JobApplication a " +
            "LEFT JOIN FETCH a.job j " +
            "LEFT JOIN FETCH a.applicant f " +
            "WHERE a.job.id = :jobId " +
            "AND a.deletedAt IS NULL " +
            "ORDER BY a.createdAt DESC")
    List<JobApplication> findRecentApplicationsForJob(@Param("jobId") Long jobId);

    @Query("SELECT DISTINCT a FROM JobApplication a " +
            "LEFT JOIN FETCH a.job j " +
            "WHERE a.applicant.id = :applicantId " +
            "AND a.deletedAt IS NULL " +
            "ORDER BY a.createdAt DESC")
    List<JobApplication> findRecentApplicationsByFreelancer(@Param("applicantId") Long applicantId);

    // Pending review (shortlisted, interviewing, offered)
    @Query("SELECT DISTINCT a FROM JobApplication a " +
            "LEFT JOIN FETCH a.job j " +
            "LEFT JOIN FETCH a.applicant f " +
            "WHERE a.job.company.id = :companyId " +
            "AND a.status IN (com.designer.marketplace.entity.JobApplication.ApplicationStatus.SHORTLISTED, " +
            "com.designer.marketplace.entity.JobApplication.ApplicationStatus.INTERVIEWING, " +
            "com.designer.marketplace.entity.JobApplication.ApplicationStatus.OFFERED) " +
            "AND a.deletedAt IS NULL " +
            "ORDER BY a.createdAt DESC")
    Page<JobApplication> findPendingApplicationsByCompany(@Param("companyId") Long companyId, Pageable pageable);

    // Reviewed applications (outcome decided)
    @Query("SELECT DISTINCT a FROM JobApplication a " +
            "LEFT JOIN FETCH a.job j " +
            "LEFT JOIN FETCH a.applicant f " +
            "WHERE a.job.id = :jobId " +
            "AND a.status IN (com.designer.marketplace.entity.JobApplication.ApplicationStatus.ACCEPTED, " +
            "com.designer.marketplace.entity.JobApplication.ApplicationStatus.REJECTED) " +
            "AND a.deletedAt IS NULL " +
            "ORDER BY a.reviewedAt DESC")
    Page<JobApplication> findReviewedApplications(@Param("jobId") Long jobId, Pageable pageable);

    // Projection interface for lightweight queries
    interface ApplicationSummary {
        Long getId();
        Long getJobId();
        Long getApplicantId();
        ApplicationStatus getStatus();
        LocalDateTime getCreatedAt();
    }

    @Query("SELECT a.id as id, a.job.id as jobId, a.applicant.id as applicantId, a.status as status, a.createdAt as createdAt " +
            "FROM JobApplication a WHERE a.job.company.id = :companyId AND a.deletedAt IS NULL")
    Page<ApplicationSummary> findApplicationSummariesByCompany(@Param("companyId") Long companyId, Pageable pageable);
}
