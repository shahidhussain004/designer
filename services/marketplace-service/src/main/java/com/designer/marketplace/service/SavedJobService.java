package com.designer.marketplace.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.designer.marketplace.dto.JobResponse;
import com.designer.marketplace.dto.SavedJobResponse;
import com.designer.marketplace.entity.Job;
import com.designer.marketplace.entity.SavedJob;
import com.designer.marketplace.entity.User;
import com.designer.marketplace.repository.JobRepository;
import com.designer.marketplace.repository.SavedJobRepository;
import com.designer.marketplace.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for managing saved/favorited jobs
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final JobService jobService;

    /**
     * Save/favorite a job for a user
     * @param userId The user who is saving the job
     * @param jobId The job to save
     * @return The created saved job response
     */
    @Transactional
    public SavedJobResponse saveJob(Long userId, Long jobId) {
        log.info("User {} saving job {}", userId, jobId);

        // Check if already saved
        if (savedJobRepository.existsByUserIdAndJobId(userId, jobId)) {
            log.info("Job {} already saved by user {}", jobId, userId);
            // Return existing saved job
            SavedJob existing = savedJobRepository.findByUserIdAndJobId(userId, jobId)
                    .orElseThrow(() -> new RuntimeException("Saved job not found"));
            return toResponse(existing);
        }

        // Verify user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Verify job exists (eager load company and category to avoid lazy loading issues)
        Job job = jobRepository.findByIdWithCompanyAndCategory(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + jobId));

        // Create saved job
        SavedJob savedJob = new SavedJob();
        savedJob.setUser(user);
        savedJob.setJob(job);

        SavedJob saved = savedJobRepository.save(savedJob);
        log.info("Successfully saved job {} for user {}", jobId, userId);

        return toResponse(saved);
    }

    /**
     * Remove a saved/favorited job
     * @param userId The user who is unsaving the job
     * @param jobId The job to unsave
     */
    @Transactional
    public void unsaveJob(Long userId, Long jobId) {
        log.info("User {} unsaving job {}", userId, jobId);
        
        savedJobRepository.deleteByUserIdAndJobId(userId, jobId);
        
        log.info("Successfully unsaved job {} for user {}", jobId, userId);
    }

    /**
     * Get all saved jobs for a user
     * SECURITY: Only returns saved jobs for the requesting user
     * @param userId The user ID (must be authenticated user's own ID)
     * @return List of saved jobs with full job details
     */
    @Transactional(readOnly = true)
    public List<SavedJobResponse> getSavedJobs(Long userId) {
        log.info("Fetching saved jobs for user {}", userId);
        
        // Verify user exists
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        List<SavedJob> savedJobs = savedJobRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        log.info("Found {} saved jobs for user {}", savedJobs.size(), userId);
        
        return savedJobs.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Check if a user has saved a specific job
     * @param userId The user ID
     * @param jobId The job ID
     * @return true if saved, false otherwise
     */
    @Transactional(readOnly = true)
    public boolean isSaved(Long userId, Long jobId) {
        return savedJobRepository.existsByUserIdAndJobId(userId, jobId);
    }

    /**
     * Get count of saved jobs for a user
     * @param userId The user ID
     * @return Number of saved jobs
     */
    @Transactional(readOnly = true)
    public long getSavedJobsCount(Long userId) {
        log.debug("getSavedJobsCount called for userId: {}", userId);
        try {
            long count = savedJobRepository.countByUserId(userId);
            log.debug("getSavedJobsCount returned {} for userId: {}", count, userId);
            return count;
        } catch (Exception e) {
            log.error("Error in getSavedJobsCount for userId: {}", userId, e);
            throw new RuntimeException("Failed to get saved jobs count", e);
        }
    }

    /**
     * Convert SavedJob entity to response DTO
     */
    private SavedJobResponse toResponse(SavedJob savedJob) {
        JobResponse jobResponse = JobResponse.fromEntity(savedJob.getJob());
        
        SavedJobResponse response = new SavedJobResponse();
        response.setSavedJobId(savedJob.getId());
        response.setSavedAt(savedJob.getCreatedAt());
        response.setJob(jobResponse);
        
        return response;
    }
}
