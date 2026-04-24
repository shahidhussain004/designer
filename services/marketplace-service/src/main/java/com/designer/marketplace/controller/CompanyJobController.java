package com.designer.marketplace.controller;

import jakarta.validation.Valid;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.designer.marketplace.dto.CreateJobRequest;
import com.designer.marketplace.dto.JobResponse;
import com.designer.marketplace.dto.UpdateJobRequest;
import com.designer.marketplace.security.UserPrincipal;
import com.designer.marketplace.service.JobService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Controller for Company Job Management
 * 
 * Handles all company-specific job operations including creating, updating, 
 * publishing, closing, and deleting jobs. All endpoints require COMPANY role.
 * 
 * Base path: /companies/me/jobs
 */
@RestController
@RequestMapping("/companies/me/jobs")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasAuthority('COMPANY')")
@SecurityRequirement(name = "bearerAuth")
@Tag(name = "Company Jobs", description = "Company job management APIs - CRUD operations for company's own jobs")
public class CompanyJobController {

    private final JobService jobService;

    /**
     * Get all jobs posted by the authenticated company
     * Returns jobs in all statuses (DRAFT, OPEN, CLOSED, FILLED)
     * 
     * GET /companies/me/jobs
     */
    @GetMapping
    @Operation(
        summary = "Get my company's jobs",
        description = "Retrieve all jobs posted by the authenticated company, including drafts and published jobs"
    )
    public ResponseEntity<Page<JobResponse>> getMyJobs(
            @AuthenticationPrincipal UserPrincipal currentUser,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt,desc") String[] sort) {

        log.info("Company {} fetching their jobs (page: {}, size: {})", 
                currentUser.getUsername(), page, size);

        Sort.Direction direction = sort.length > 1 && sort[1].equalsIgnoreCase("asc") 
            ? Sort.Direction.ASC 
            : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort[0]));

        Page<JobResponse> jobs = jobService.getMyJobs(currentUser.getId(), pageable);
        
        log.info("Retrieved {} jobs for company user {}", jobs.getTotalElements(), currentUser.getId());
        return ResponseEntity.ok(jobs);
    }

    /**
     * Create a new job posting
     * Job starts in DRAFT status by default unless explicitly set to OPEN
     * 
     * POST /companies/me/jobs
     */
    @PostMapping
    @Operation(
        summary = "Create a new job",
        description = "Create a new job posting for the company. Starts in DRAFT status unless explicitly published."
    )
    public ResponseEntity<JobResponse> createJob(
            @RequestBody @Valid CreateJobRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        log.info("Company user {} creating new job: {}", currentUser.getId(), request.getTitle());

        JobResponse createdJob = jobService.createJob(currentUser.getId(), request);
        
        log.info("Job created successfully with id: {} for company user: {}", 
                createdJob.getId(), currentUser.getId());
        
        return ResponseEntity.status(HttpStatus.CREATED).body(createdJob);
    }

    /**
     * Update an existing job posting
     * Only the job owner can update their jobs
     * 
     * PUT /companies/me/jobs/{id}
     */
    @PutMapping("/{id:\\d+}")
    @Operation(
        summary = "Update a job",
        description = "Update an existing job posting. Only the job owner can perform this operation."
    )
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Long id,
            @RequestBody @Valid UpdateJobRequest request,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        log.info("Company user {} updating job: {}", currentUser.getId(), id);

        // Verify ownership and update
        JobResponse updatedJob = jobService.updateJobAsOwner(currentUser.getId(), id, request);
        
        log.info("Job {} updated successfully by user {}", id, currentUser.getId());
        return ResponseEntity.ok(updatedJob);
    }

    /**
     * Publish a draft job
     * Changes status from DRAFT to OPEN, making it visible to job seekers
     * 
     * POST /companies/me/jobs/{id}/publish
     */
    @PostMapping("/{id:\\d+}/publish")
    @Operation(
        summary = "Publish a job",
        description = "Publish a draft job, changing status to OPEN and making it visible to job seekers"
    )
    public ResponseEntity<JobResponse> publishJob(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        log.info("Company user {} publishing job: {}", currentUser.getId(), id);

        JobResponse publishedJob = jobService.publishJobAsOwner(currentUser.getId(), id);
        
        log.info("Job {} published successfully", id);
        return ResponseEntity.ok(publishedJob);
    }

    /**
     * Close an open job
     * Changes status from OPEN to CLOSED, stopping new applications
     * 
     * POST /companies/me/jobs/{id}/close
     */
    @PostMapping("/{id:\\d+}/close")
    @Operation(
        summary = "Close a job",
        description = "Close an open job posting. No new applications will be accepted after closing."
    )
    public ResponseEntity<JobResponse> closeJob(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        log.info("Company user {} closing job: {}", currentUser.getId(), id);

        JobResponse closedJob = jobService.closeJobAsOwner(currentUser.getId(), id);
        
        log.info("Job {} closed successfully", id);
        return ResponseEntity.ok(closedJob);
    }

    /**
     * Delete a job posting
     * Permanently removes the job from the system
     * 
     * DELETE /companies/me/jobs/{id}
     */
    @DeleteMapping("/{id:\\d+}")
    @Operation(
        summary = "Delete a job",
        description = "Permanently delete a job posting. This action cannot be undone."
    )
    public ResponseEntity<Void> deleteJob(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        log.info("Company user {} deleting job: {}", currentUser.getId(), id);

        jobService.deleteJobAsOwner(currentUser.getId(), id);
        
        log.info("Job {} deleted successfully", id);
        return ResponseEntity.noContent().build();
    }
}
