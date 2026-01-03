package com.designer.marketplace.service;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.designer.marketplace.dto.CreateJobApplicationRequest;
import com.designer.marketplace.dto.JobApplicationResponse;
import com.designer.marketplace.dto.UpdateJobApplicationStatusRequest;
import com.designer.marketplace.entity.Job;
import com.designer.marketplace.entity.JobApplication;
import com.designer.marketplace.entity.Notification;
import com.designer.marketplace.entity.User;
import com.designer.marketplace.repository.JobApplicationRepository;
import com.designer.marketplace.repository.JobRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for job application management operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class JobApplicationService {

    private final JobApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    /**
     * Get applications for a specific job (employer only)
     */
    @Transactional(readOnly = true)
    public Page<JobApplicationResponse> getJobApplications(Long jobId, String status, Pageable pageable) {
        log.info("Getting applications for job: {}, status: {}", jobId, status);

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + jobId));

        // Check if current user is the job employer
        User currentUser = userService.getCurrentUser();
        if (!job.getEmployer().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only view applications for your own jobs");
        }

        Page<JobApplication> applications;
        if (status != null && !status.isEmpty()) {
            JobApplication.ApplicationStatus appStatus = JobApplication.ApplicationStatus.valueOf(status.toUpperCase());
            applications = applicationRepository.findByJobIdAndStatus(jobId, appStatus, pageable);
        } else {
            applications = applicationRepository.findByJobId(jobId, pageable);
        }

        return applications.map(JobApplicationResponse::fromEntity);
    }

    /**
     * Get current user's job applications
     */
    @Transactional(readOnly = true)
    public Page<JobApplicationResponse> getUserApplications(Pageable pageable) {
        User currentUser = userService.getCurrentUser();
        log.info("Getting applications for user: {}", currentUser.getUsername());

        Page<JobApplication> applications = applicationRepository.findByApplicantId(currentUser.getId(), pageable);
        return applications.map(JobApplicationResponse::fromEntity);
    }

    /**
     * Submit a job application
     */
    @Transactional
    public JobApplicationResponse createApplication(CreateJobApplicationRequest request) {
        User currentUser = userService.getCurrentUser();
        log.info("Creating job application for job: {} by user: {}", request.getJobId(), currentUser.getUsername());

        // Check if job exists
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + request.getJobId()));

        // Validate job is open for applications
        if (job.getStatus() != Job.JobStatus.OPEN) {
            throw new RuntimeException("Cannot apply to a job that is not open for applications");
        }

        // Check if user already applied
        if (applicationRepository.existsByJobIdAndApplicantId(request.getJobId(), currentUser.getId())) {
            throw new RuntimeException("You have already applied to this job");
        }

        JobApplication application = new JobApplication();
        application.setJob(job);
        application.setApplicant(currentUser);
        application.setFullName(request.getFullName());
        application.setEmail(request.getEmail());
        application.setPhone(request.getPhone());
        application.setResumeUrl(request.getResumeUrl());
        application.setCoverLetter(request.getCoverLetter());
        application.setPortfolioUrl(request.getPortfolioUrl());
        application.setLinkedinUrl(request.getLinkedinUrl());
        
        // Convert Map to JsonNode
        if (request.getAnswers() != null) {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            application.setAnswers(mapper.valueToTree(request.getAnswers()));
        }
        
        application.setStatus(JobApplication.ApplicationStatus.PENDING);
        application.setAppliedAt(LocalDateTime.now());

        JobApplication savedApplication = applicationRepository.save(application);

        // Update job application count
        job.setApplicationsCount(job.getApplicationsCount() + 1);
        jobRepository.save(job);

        // Create notification for employer
        notificationService.createNotification(
                job.getEmployer(),
                Notification.NotificationType.JOB_APPLICATION_RECEIVED,
                "New Job Application",
                String.format("%s applied for your job: %s",
                        currentUser.getFullName(), job.getTitle()),
                "JOB_APPLICATION",
                savedApplication.getId());

        log.info("Job application created with id: {}", savedApplication.getId());

        return JobApplicationResponse.fromEntity(savedApplication);
    }

    /**
     * Get application by ID
     */
    @Transactional(readOnly = true)
    public JobApplicationResponse getApplicationById(Long id) {
        JobApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));

        // Check authorization
        User currentUser = userService.getCurrentUser();
        boolean isApplicant = application.getApplicant().getId().equals(currentUser.getId());
        boolean isEmployer = application.getJob().getEmployer().getId().equals(currentUser.getId());

        if (!isApplicant && !isEmployer) {
            throw new RuntimeException("You don't have permission to view this application");
        }

        return JobApplicationResponse.fromEntity(application);
    }

    /**
     * Update application status (employer only)
     */
    @Transactional
    public JobApplicationResponse updateApplicationStatus(Long id, UpdateJobApplicationStatusRequest request) {
        JobApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));

        User currentUser = userService.getCurrentUser();

        // Check if current user is the employer
        if (!application.getJob().getEmployer().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Only the employer can update application status");
        }

        log.info("Updating application status: {} to: {}", id, request.getStatus());

        // Update status
        JobApplication.ApplicationStatus newStatus = JobApplication.ApplicationStatus.valueOf(request.getStatus().toUpperCase());
        application.setStatus(newStatus);

        if (request.getEmployerNotes() != null) {
            application.setEmployerNotes(request.getEmployerNotes());
        }

        application.setUpdatedAt(LocalDateTime.now());

        // Send notification based on status
        String notificationTitle = "Application Status Updated";
        String notificationMessage = String.format("Your application for '%s' has been updated to: %s",
                application.getJob().getTitle(), newStatus.name());

        if (newStatus == JobApplication.ApplicationStatus.SHORTLISTED) {
            notificationTitle = "You've been shortlisted!";
            notificationMessage = String.format("Congratulations! You've been shortlisted for '%s'",
                    application.getJob().getTitle());
        } else if (newStatus == JobApplication.ApplicationStatus.INTERVIEWING) {
            notificationTitle = "Interview Scheduled";
            notificationMessage = String.format("Your interview for '%s' has been scheduled",
                    application.getJob().getTitle());
        } else if (newStatus == JobApplication.ApplicationStatus.ACCEPTED) {
            notificationTitle = "Job Offer!";
            notificationMessage = String.format("Congratulations! You've been offered the position for '%s'",
                    application.getJob().getTitle());
        } else if (newStatus == JobApplication.ApplicationStatus.REJECTED) {
            notificationTitle = "Application Update";
            notificationMessage = String.format("Thank you for applying to '%s'. We've decided to move forward with other candidates.",
                    application.getJob().getTitle());
        }

        notificationService.createNotification(
                application.getApplicant(),
                Notification.NotificationType.JOB_APPLICATION_STATUS_CHANGED,
                notificationTitle,
                notificationMessage,
                "JOB_APPLICATION",
                id);

        JobApplication updatedApplication = applicationRepository.save(application);
        log.info("Application status updated: {}", updatedApplication.getId());

        return JobApplicationResponse.fromEntity(updatedApplication);
    }

    /**
     * Withdraw application (applicant only)
     */
    @Transactional
    public void withdrawApplication(Long id) {
        JobApplication application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + id));

        User currentUser = userService.getCurrentUser();

        // Check if current user is the applicant
        if (!application.getApplicant().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only withdraw your own applications");
        }

        log.info("Withdrawing application: {}", id);

        // Update job application count
        Job job = application.getJob();
        if (job.getApplicationsCount() > 0) {
            job.setApplicationsCount(job.getApplicationsCount() - 1);
            jobRepository.save(job);
        }

        applicationRepository.delete(application);

        // Notify employer
        notificationService.createNotification(
                job.getEmployer(),
                Notification.NotificationType.JOB_APPLICATION_WITHDRAWN,
                "Application Withdrawn",
                String.format("%s withdrew their application for: %s",
                        currentUser.getFullName(), job.getTitle()),
                "JOB_APPLICATION",
                null);

        log.info("Application withdrawn: {}", id);
    }

    /**
     * Check if user is owner of the application
     */
    @Transactional(readOnly = true)
    public boolean isApplicationOwner(Long applicationId) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + applicationId));
        User currentUser = userService.getCurrentUser();
        return application.getApplicant().getId().equals(currentUser.getId());
    }

    /**
     * Check if user is employer for the application
     */
    @Transactional(readOnly = true)
    public boolean isEmployerForApplication(Long applicationId) {
        JobApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + applicationId));
        User currentUser = userService.getCurrentUser();
        return application.getJob().getEmployer().getId().equals(currentUser.getId());
    }
}

