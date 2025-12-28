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

import com.designer.marketplace.dto.CreateJobRequest;
import com.designer.marketplace.dto.JobResponse;
import com.designer.marketplace.dto.UpdateJobRequest;
import com.designer.marketplace.service.JobService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Controller for job listing endpoints
 * 
 * Endpoints:
 * - GET /api/jobs - List jobs with filters
 * - GET /api/jobs/{id} - Get job details
 * - POST /api/jobs - Create new job
 * - PUT /api/jobs/{id} - Update job
 * - DELETE /api/jobs/{id} - Delete job
 * - GET /api/jobs/search - Search jobs
 */
@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@Slf4j
public class JobController {

    private final JobService jobService;

    /**
     * Task 3.6: List jobs with filters
     * GET
     * /api/jobs?categoryId=1&experienceLevelId=2&minBudget=100&maxBudget=1000&search=keyword&page=0&size=20
     */
    @GetMapping
    public ResponseEntity<Page<JobResponse>> getJobs(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long experienceLevelId,
            @RequestParam(required = false) Double minBudget,
            @RequestParam(required = false) Double maxBudget,
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {

        log.info("Getting jobs - categoryId: {}, experienceLevelId: {}, search: {}, page: {}, size: {}",
                categoryId, experienceLevelId, search, page, size);

        Sort sort = sortDirection.equalsIgnoreCase("ASC") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<JobResponse> jobs = jobService.getJobs(categoryId, experienceLevelId, minBudget, maxBudget, search, pageable);
        return ResponseEntity.ok(jobs);
    }

    /**
     * Task 3.7: Get job details with client info
     * GET /api/jobs/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<JobResponse> getJobById(@PathVariable Long id) {
        log.info("Getting job by id: {}", id);
        JobResponse job = jobService.getJobById(id);
        return ResponseEntity.ok(job);
    }

    /**
     * Task 3.8: Create new job (clients only)
     * POST /api/jobs
     */
    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<JobResponse> createJob(@Valid @RequestBody CreateJobRequest request) {
        log.info("Creating new job");
        JobResponse job = jobService.createJob(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(job);
    }

    /**
     * Task 3.9: Update job (owner only)
     * PUT /api/jobs/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated() and @jobService.isJobOwner(#id)")
    public ResponseEntity<JobResponse> updateJob(
            @PathVariable Long id,
            @Valid @RequestBody UpdateJobRequest request) {
        log.info("Updating job: {}", id);
        JobResponse job = jobService.updateJob(id, request);
        return ResponseEntity.ok(job);
    }

    /**
     * Task 3.10: Delete job (owner only)
     * DELETE /api/jobs/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated() and @jobService.isJobOwner(#id)")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        log.info("Deleting job: {}", id);
        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Task 3.11: Search jobs with full-text search
     * GET /api/jobs/search?q=java&page=0&size=20
     */
    @GetMapping("/search")
    public ResponseEntity<Page<JobResponse>> searchJobs(
            @RequestParam String q,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info("Searching jobs with term: {}", q);
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<JobResponse> jobs = jobService.searchJobs(q, pageable);
        return ResponseEntity.ok(jobs);
    }

    /**
     * Get current user's jobs (client)
     * GET /api/jobs/my-jobs
     */
    @GetMapping("/my-jobs")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Page<JobResponse>> getMyJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info("Getting current user's jobs");
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<JobResponse> jobs = jobService.getMyJobs(pageable);
        return ResponseEntity.ok(jobs);
    }
}
