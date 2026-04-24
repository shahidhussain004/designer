package com.designer.marketplace.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.designer.marketplace.dto.SavedJobResponse;
import com.designer.marketplace.service.SavedJobService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST API for saved/favorited jobs - AUTHENTICATED ENDPOINTS ONLY
 * 
 * SECURITY MODEL:
 * - All endpoints require JWT authentication
 * - Users can ONLY access their OWN saved jobs
 * - No cross-user data access (row-level security)
 * 
 * For public job browsing (no auth required), use GET /api/jobs instead
 * 
 * Base path: /api/saved-jobs
 */
@RestController
@RequestMapping("/saved-jobs")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('FREELANCER')")
@Tag(name = "Saved Jobs", description = "APIs for freelancer users to save/favorite jobs they're interested in. Requires FREELANCER role.")
public class SavedJobController {

    private final SavedJobService savedJobService;

    /**
     * Get all saved jobs for the current freelancer
     * GET /api/saved-jobs
     * Restricted to FREELANCER users only
     */
    @GetMapping
    @Operation(summary = "Get saved jobs", description = "Get all jobs saved by the current user")
    public ResponseEntity<List<SavedJobResponse>> getSavedJobs(Authentication authentication) {
        
        log.info("GET /api/saved-jobs - Get all saved jobs");
        
        com.designer.marketplace.security.UserPrincipal userPrincipal = (com.designer.marketplace.security.UserPrincipal) authentication.getPrincipal();
        Long userId = userPrincipal.getId();
        List<SavedJobResponse> savedJobs = savedJobService.getSavedJobs(userId);
        
        log.info("Returning {} saved jobs for user {}", savedJobs.size(), userId);
        return ResponseEntity.ok(savedJobs);
    }

    /**
     * Get count of saved jobs - MUST be before {jobId} path variable
     * GET /api/saved-jobs/count
     * Restricted to FREELANCER users only
     */
    @GetMapping("/count")
    @Operation(summary = "Get saved jobs count", description = "Get the total number of jobs saved by the current user")
    public ResponseEntity<Map<String, Long>> getSavedJobsCount(Authentication authentication) {
        
        log.info("GET /api/saved-jobs/count - Get saved jobs count");
        
        com.designer.marketplace.security.UserPrincipal userPrincipal = (com.designer.marketplace.security.UserPrincipal) authentication.getPrincipal();
        Long userId = userPrincipal.getId();
        long count = savedJobService.getSavedJobsCount(userId);
        
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        
        log.info("User {} has {} saved jobs", userId, count);
        return ResponseEntity.ok(response);
    }

    /**
     * Check if a specific job is saved
     * GET /api/saved-jobs/{jobId}/status
     */
    @GetMapping("/{jobId}/status")
    @Operation(summary = "Check if job is saved", description = "Check whether a specific job is saved by the current user")
    public ResponseEntity<Map<String, Boolean>> checkSavedStatus(
            @PathVariable Long jobId,
            Authentication authentication) {
        
        log.info("GET /api/saved-jobs/{}/status - Check saved status", jobId);
        
        com.designer.marketplace.security.UserPrincipal userPrincipal = (com.designer.marketplace.security.UserPrincipal) authentication.getPrincipal();
        Long userId = userPrincipal.getId();
        boolean isSaved = savedJobService.isSaved(userId, jobId);
        
        Map<String, Boolean> response = new HashMap<>();
        response.put("isSaved", isSaved);
        
        return ResponseEntity.ok(response);
    }

    /**
     * Save/favorite a job
     * POST /api/saved-jobs/{jobId}
     */
    @PostMapping("/{jobId}")
    @Operation(summary = "Save a job", description = "Add a job to the user's saved/favorites list")
    public ResponseEntity<SavedJobResponse> saveJob(
            @PathVariable Long jobId,
            Authentication authentication) {
        
        log.info("POST /api/saved-jobs/{} - Save job request", jobId);
        
        com.designer.marketplace.security.UserPrincipal userPrincipal = (com.designer.marketplace.security.UserPrincipal) authentication.getPrincipal();
        Long userId = userPrincipal.getId();
        SavedJobResponse response = savedJobService.saveJob(userId, jobId);
        
        log.info("Job {} saved successfully for user {}", jobId, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Unsave/unfavorite a job
     * DELETE /api/saved-jobs/{jobId}
     */
    @DeleteMapping("/{jobId}")
    @Operation(summary = "Unsave a job", description = "Remove a job from the user's saved/favorites list")
    public ResponseEntity<Map<String, String>> unsaveJob(
            @PathVariable Long jobId,
            Authentication authentication) {
        
        log.info("DELETE /api/saved-jobs/{} - Unsave job request", jobId);
        
        com.designer.marketplace.security.UserPrincipal userPrincipal = (com.designer.marketplace.security.UserPrincipal) authentication.getPrincipal();
        Long userId = userPrincipal.getId();
        savedJobService.unsaveJob(userId, jobId);
        
        Map<String, String> response = new HashMap<>();
        response.put("message", "Job unsaved successfully");
        
        log.info("Job {} unsaved successfully for user {}", jobId, userId);
        return ResponseEntity.ok(response);
    }
}
