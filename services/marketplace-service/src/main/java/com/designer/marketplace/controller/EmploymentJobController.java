package com.designer.marketplace.controller;

import java.util.List;

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

import com.designer.marketplace.dto.EmploymentJobResponse;
import com.designer.marketplace.entity.EmploymentJob;
import com.designer.marketplace.entity.EmploymentJobCategory;
import com.designer.marketplace.security.UserPrincipal;
import com.designer.marketplace.service.EmploymentJobService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Controller for Employment Jobs (traditional employment opportunities)
 */
@RestController
@RequestMapping("/api/employment-jobs")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Employment Jobs", description = "APIs for traditional employment job postings")
public class EmploymentJobController {

    private final EmploymentJobService jobService;

    /**
     * Get all active jobs with optional filters
     */
    @GetMapping
    @Operation(summary = "Get all active jobs", description = "Retrieve paginated list of active job postings")
    public ResponseEntity<Page<EmploymentJobResponse>> getAllJobs(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) String experienceLevel,
            @RequestParam(required = false) Boolean isRemote,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "publishedAt,desc") String[] sort) {

        Sort.Direction direction = sort.length > 1 && sort[1].equalsIgnoreCase("asc") 
            ? Sort.Direction.ASC 
            : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort[0]));

        Page<EmploymentJobResponse> jobs = jobService.getAllJobs(
                categoryId, jobType, experienceLevel, isRemote, location, pageable);

        return ResponseEntity.ok(jobs);
    }

    /**
     * Get job by ID
     */
    @GetMapping("/{id}")
    @Operation(summary = "Get job by ID", description = "Retrieve a specific job posting by its ID")
    public ResponseEntity<EmploymentJobResponse> getJobById(@PathVariable Long id) {
        EmploymentJobResponse job = jobService.getJobById(id);
        return ResponseEntity.ok(job);
    }

    /**
     * Search jobs
     */
    @GetMapping("/search")
    @Operation(summary = "Search jobs", description = "Search jobs by title or description")
    public ResponseEntity<Page<EmploymentJobResponse>> searchJobs(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishedAt"));
        Page<EmploymentJobResponse> jobs = jobService.searchJobs(query, pageable);

        return ResponseEntity.ok(jobs);
    }

    /**
     * Get featured jobs
     */
    @GetMapping("/featured")
    @Operation(summary = "Get featured jobs", description = "Get list of featured job postings")
    public ResponseEntity<List<EmploymentJobResponse>> getFeaturedJobs(
            @RequestParam(defaultValue = "10") int limit) {

        List<EmploymentJobResponse> jobs = jobService.getFeaturedJobs(limit);
        return ResponseEntity.ok(jobs);
    }

    /**
     * Get all job categories
     */
    @GetMapping("/categories")
    @Operation(summary = "Get all job categories", description = "Retrieve list of all active job categories")
    public ResponseEntity<List<EmploymentJobCategory>> getAllCategories() {
        List<EmploymentJobCategory> categories = jobService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get category by slug
     */
    @GetMapping("/categories/{slug}")
    @Operation(summary = "Get category by slug", description = "Retrieve a specific job category by its slug")
    public ResponseEntity<EmploymentJobCategory> getCategoryBySlug(@PathVariable String slug) {
        EmploymentJobCategory category = jobService.getCategoryBySlug(slug);
        return ResponseEntity.ok(category);
    }

    /**
     * Get jobs by employer (requires authentication)
     */
    @GetMapping("/employer/{employerId}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CLIENT')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Get jobs by employer", description = "Get all jobs posted by a specific employer")
    public ResponseEntity<Page<EmploymentJobResponse>> getJobsByEmployer(
            @PathVariable Long employerId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        // Only allow employers to see their own jobs (or admins)
        if (!currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN")) &&
                !currentUser.getId().equals(employerId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<EmploymentJobResponse> jobs = jobService.getJobsByEmployer(employerId, pageable);

        return ResponseEntity.ok(jobs);
    }

    /**
     * Create a new job (requires authentication as employer/client)
     */
    @PostMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CLIENT')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Create a new job", description = "Post a new employment opportunity")
    public ResponseEntity<EmploymentJobResponse> createJob(
            @RequestBody EmploymentJob job,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        EmploymentJobResponse createdJob = jobService.createJob(currentUser.getId(), job);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdJob);
    }

    /**
     * Update a job
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CLIENT')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Update a job", description = "Update an existing job posting")
    public ResponseEntity<EmploymentJobResponse> updateJob(
            @PathVariable Long id,
            @RequestBody EmploymentJob job,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        // Add authorization check here (verify job belongs to user)

        EmploymentJobResponse updatedJob = jobService.updateJob(id, job);
        return ResponseEntity.ok(updatedJob);
    }

    /**
     * Publish a job
     */
    @PostMapping("/{id}/publish")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CLIENT')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Publish a job", description = "Change job status from draft to active")
    public ResponseEntity<EmploymentJobResponse> publishJob(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        EmploymentJobResponse publishedJob = jobService.publishJob(id);
        return ResponseEntity.ok(publishedJob);
    }

    /**
     * Close a job
     */
    @PostMapping("/{id}/close")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CLIENT')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Close a job", description = "Close a job posting (no longer accepting applications)")
    public ResponseEntity<EmploymentJobResponse> closeJob(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        EmploymentJobResponse closedJob = jobService.closeJob(id);
        return ResponseEntity.ok(closedJob);
    }

    /**
     * Delete a job
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ADMIN', 'CLIENT')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Delete a job", description = "Permanently delete a job posting")
    public ResponseEntity<Void> deleteJob(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        jobService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }
}
