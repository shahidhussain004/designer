package com.designer.marketplace.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.designer.marketplace.entity.JobApplication;

/**
 * Repository for JobApplication entity
 * Handles applications for company jobs
 */
@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

    Page<JobApplication> findByJobId(Long jobId, Pageable pageable);

    Page<JobApplication> findByApplicantId(Long applicantId, Pageable pageable);

    Page<JobApplication> findByStatus(JobApplication.ApplicationStatus status, Pageable pageable);

    Page<JobApplication> findByJobIdAndStatus(Long jobId, JobApplication.ApplicationStatus status, Pageable pageable);

    List<JobApplication> findByJobIdOrderByCreatedAtDesc(Long jobId);

    List<JobApplication> findByApplicantIdOrderByCreatedAtDesc(Long applicantId);

    boolean existsByJobIdAndApplicantId(Long jobId, Long applicantId);

    // Count queries
    @Query("SELECT COUNT(a) FROM JobApplication a WHERE a.job.id = :jobId")
    Long countByJobId(@Param("jobId") Long jobId);

    @Query("SELECT COUNT(a) FROM JobApplication a WHERE a.applicant.id = :applicantId")
    Long countByApplicantId(@Param("applicantId") Long applicantId);

    @Query("SELECT COUNT(a) FROM JobApplication a WHERE a.job.company.id = :companyId")
    Long countByCompanyId(@Param("companyId") Long companyId);

    @Query("SELECT COUNT(a) FROM JobApplication a WHERE a.job.company.id = :companyId AND a.status = :status")
    Long countByCompanyIdAndStatus(@Param("companyId") Long companyId, @Param("status") JobApplication.ApplicationStatus status);
    @Query("SELECT a FROM JobApplication a WHERE a.job.company.id = :companyId ORDER BY a.createdAt DESC")
    Page<JobApplication> findByJobCompanyId(@Param("companyId") Long companyId, Pageable pageable);
}
