package com.designer.marketplace.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.designer.marketplace.dto.JobResponse;
import com.designer.marketplace.entity.JobCategory;
import com.designer.marketplace.security.UserPrincipal;
import com.designer.marketplace.service.JobService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Public Job Browsing Controller
 * 
 * Provides public, read-only access to job listings.
 * No authentication required for these endpoints.
 * 
 * For company job management (create, update, delete), see CompanyJobController.
 * 
 * Base path: /jobs
 */
@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Jobs - Public", description = "Public job browsing and search APIs")
public class JobController {

    private final JobService jobService;

    /**
     * Browse all open jobs with optional filters
     * Returns only jobs in OPEN status (publicly visible)
     * 
     * GET /jobs?companyId=1&categoryId=2&jobType=FULL_TIME&page=0&size=20
     */
    @GetMapping
    @Operation(
        summary = "Browse all open jobs",
        description = "Retrieve paginated list of open job postings with optional filters. Only returns OPEN status jobs."
    )
    public ResponseEntity<Page<JobResponse>> getAllJobs(
            @RequestParam(required = false) Long companyId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) String experienceLevel,
            @RequestParam(required = false) Boolean isRemote,
            @RequestParam(required = false) String location,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "publishedAt,desc") String[] sort) {

        log.debug("Fetching jobs with filters - companyId: {}, categoryId: {}, jobType: {}", 
                companyId, categoryId, jobType);

        Sort.Direction direction = sort.length > 1 && sort[1].equalsIgnoreCase("asc") 
            ? Sort.Direction.ASC 
            : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sort[0]));

        Page<JobResponse> jobs = jobService.getAllJobs(
                companyId, categoryId, jobType, experienceLevel, isRemote, location, pageable);

        return ResponseEntity.ok(jobs);
    }

    /**
     * Search jobs by keyword
     * Searches in job title, description, and requirements
     * 
     * GET /jobs/search?query=developer&page=0&size=20
     */
    @GetMapping("/search")
    @Operation(
        summary = "Search jobs",
        description = "Search for jobs by keyword in title, description, and requirements"
    )
    public ResponseEntity<Page<JobResponse>> searchJobs(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.debug("Searching jobs with query: {}", query);

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "publishedAt"));
        Page<JobResponse> jobs = jobService.searchJobs(query, pageable);

        return ResponseEntity.ok(jobs);
    }

    /**
     * Get featured jobs
     * Returns jobs marked as featured, typically for homepage display
     * 
     * GET /jobs/featured?limit=10
     */
    @GetMapping("/featured")
    @Operation(
        summary = "Get featured jobs",
        description = "Get list of featured job postings, typically used for homepage or spotlight sections"
    )
    public ResponseEntity<List<JobResponse>> getFeaturedJobs(
            @RequestParam(defaultValue = "10") int limit) {

        log.debug("Fetching {} featured jobs", limit);

        List<JobResponse> jobs = jobService.getFeaturedJobs(limit);
        return ResponseEntity.ok(jobs);
    }

    /**
     * Get all job categories
     * Returns list of active job categories for filtering
     * 
     * GET /jobs/categories
     */
    @GetMapping("/categories")
    @Operation(
        summary = "Get all job categories",
        description = "Retrieve list of all active job categories"
    )
    public ResponseEntity<List<JobCategory>> getAllCategories() {
        log.debug("Fetching all job categories");

        List<JobCategory> categories = jobService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    /**
     * Get category by slug
     * Retrieve detailed information about a specific category
     * 
     * GET /jobs/categories/software-development
     */
    @GetMapping("/categories/{slug}")
    @Operation(
        summary = "Get category by slug",
        description = "Retrieve a specific job category by its URL-friendly slug"
    )
    public ResponseEntity<JobCategory> getCategoryBySlug(@PathVariable String slug) {
        log.debug("Fetching category with slug: {}", slug);

        JobCategory category = jobService.getCategoryBySlug(slug);
        return ResponseEntity.ok(category);
    }

    /**
     * Get single job by ID
     * Returns detailed job information and increments view counter
     * Optionally enriches with ownership info if user is authenticated
     * 
     * GET /jobs/123
     */
    @GetMapping("/{id:\\d+}")
    @Operation(
        summary = "Get job by ID",
        description = "Retrieve detailed information about a specific job posting. Increments view count."
    )
    public ResponseEntity<JobResponse> getJobById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal currentUser) {
        
        log.debug("Fetching job with id: {}", id);

        JobResponse job = jobService.getJobById(id);
        
        // Enrich with ownership info if user is authenticated
        if (currentUser != null) {
            job = jobService.enrichWithOwnership(job, currentUser.getId());
        } else {
            job.setIsOwner(false);
        }
        
        return ResponseEntity.ok(job);
    }

    /**
     * Helper method to get current user ID from security context (if authenticated)
     */
    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getPrincipal() instanceof UserPrincipal) {
            return ((UserPrincipal) auth.getPrincipal()).getId();
        }
        return null;
    }
}
