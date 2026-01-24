package com.designer.marketplace.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.designer.marketplace.dto.CreateJobApplicationRequest;
import com.designer.marketplace.dto.JobApplicationResponse;
import com.designer.marketplace.dto.UpdateJobApplicationStatusRequest;
import com.designer.marketplace.service.JobApplicationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Controller for job application endpoints
 */
@RestController
@RequestMapping("/job-applications")
@RequiredArgsConstructor
@Slf4j
public class JobApplicationController {

    private final JobApplicationService applicationService;

    /**
     * Get applications for a specific job (company only)
     * GET /api/company-jobs/{jobId}/applications
     */
    @GetMapping
    public ResponseEntity<Page<JobApplicationResponse>> getJobApplications(
            @RequestParam Long jobId,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info("Getting applications for job: {}, status: {}", jobId, status);
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        Page<JobApplicationResponse> applications = applicationService.getJobApplications(jobId, status, pageable);
        return ResponseEntity.ok(applications);
    }

    /**
     * Get current user's job applications
     * GET /api/job-applications/my-applications
     */
    @GetMapping("/my-applications")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<JobApplicationResponse>> getMyApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info("Getting current user's applications");
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        Page<JobApplicationResponse> applications = applicationService.getUserApplications(pageable);
        return ResponseEntity.ok(applications);
    }

    /**
     * Submit a job application
     * POST /api/job-applications
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<JobApplicationResponse> createApplication(@Valid @RequestBody CreateJobApplicationRequest request) {
        log.info("Creating new job application for job: {}", request.getJobId());
        JobApplicationResponse application = applicationService.createApplication(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(application);
    }

    /**
     * Get application by ID
     * GET /api/job-applications/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated() and (@jobApplicationService.isApplicationOwner(#id) or @jobApplicationService.isCompanyForApplication(#id))")
    public ResponseEntity<JobApplicationResponse> getApplicationById(@PathVariable Long id) {
        log.info("Getting job application by id: {}", id);
        JobApplicationResponse application = applicationService.getApplicationById(id);
        return ResponseEntity.ok(application);
    }

    /**
     * Update application status (company only)
     * PUT /api/job-applications/{id}/status
     */
    @PutMapping("/{id}/status")
    @PreAuthorize("isAuthenticated() and @jobApplicationService.isCompanyForApplication(#id)")
    public ResponseEntity<JobApplicationResponse> updateApplicationStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateJobApplicationStatusRequest request) {

        log.info("Updating application status: {}", id);
        JobApplicationResponse application = applicationService.updateApplicationStatus(id, request);
        return ResponseEntity.ok(application);
    }

    /**
     * Withdraw application (applicant only)
     * DELETE /api/job-applications/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated() and @jobApplicationService.isApplicationOwner(#id)")
    public ResponseEntity<Void> withdrawApplication(@PathVariable Long id) {
        log.info("Withdrawing application: {}", id);
        applicationService.withdrawApplication(id);
        return ResponseEntity.noContent().build();
    }
}
