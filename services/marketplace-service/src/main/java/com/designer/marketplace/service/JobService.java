package com.designer.marketplace.service;

import com.designer.marketplace.dto.CreateJobRequest;
import com.designer.marketplace.dto.JobResponse;
import com.designer.marketplace.dto.UpdateJobRequest;
import com.designer.marketplace.entity.Job;
import com.designer.marketplace.entity.User;
import com.designer.marketplace.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for job management operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class JobService {

    private final JobRepository jobRepository;
    private final UserService userService;

    /**
     * Task 3.6: Get all jobs with filters
     */
    @Transactional(readOnly = true)
    public Page<JobResponse> getJobs(String category, String experienceLevel,
            Double minBudget, Double maxBudget, Pageable pageable) {
        log.info("Getting jobs with filters - category: {}, experienceLevel: {}, minBudget: {}, maxBudget: {}",
                category, experienceLevel, minBudget, maxBudget);

        Job.JobStatus status = Job.JobStatus.OPEN;
        Job.ExperienceLevel expLevel = experienceLevel != null
                ? Job.ExperienceLevel.valueOf(experienceLevel.toUpperCase())
                : null;

        Page<Job> jobs = jobRepository.findByFilters(status, category, expLevel, minBudget, maxBudget, pageable);
        return jobs.map(JobResponse::fromEntity);
    }

    /**
     * Task 3.7: Get job by ID with client info
     */
    @Transactional
    public JobResponse getJobById(Long id) {
        log.info("Getting job by id: {}", id);
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));

        // Increment view count
        job.setViewCount(job.getViewCount() + 1);
        jobRepository.save(job);

        return JobResponse.fromEntity(job);
    }

    /**
     * Task 3.8: Create new job (clients only)
     */
    @Transactional
    public JobResponse createJob(CreateJobRequest request) {
        User currentUser = userService.getCurrentUser();

        // Validate user is a client
        if (currentUser.getRole() != User.UserRole.CLIENT) {
            throw new RuntimeException("Only clients can create jobs");
        }

        log.info("Creating new job by user: {}", currentUser.getUsername());

        Job job = new Job();
        job.setClient(currentUser);
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setCategory(request.getCategory());
        job.setRequiredSkills(request.getRequiredSkills());
        job.setBudget(request.getBudget());

        if (request.getBudgetType() != null) {
            job.setBudgetType(Job.BudgetType.valueOf(request.getBudgetType().toUpperCase()));
        }

        job.setDuration(request.getDuration());

        if (request.getExperienceLevel() != null) {
            job.setExperienceLevel(Job.ExperienceLevel.valueOf(request.getExperienceLevel().toUpperCase()));
        }

        if (request.getStatus() != null) {
            job.setStatus(Job.JobStatus.valueOf(request.getStatus().toUpperCase()));
        } else {
            job.setStatus(Job.JobStatus.OPEN);
        }

        job.setIsFeatured(false);
        job.setViewCount(0);
        job.setProposalCount(0);

        Job savedJob = jobRepository.save(job);
        log.info("Job created with id: {}", savedJob.getId());

        return JobResponse.fromEntity(savedJob);
    }

    /**
     * Task 3.9: Update job (owner only)
     */
    @Transactional
    public JobResponse updateJob(Long id, UpdateJobRequest request) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));

        User currentUser = userService.getCurrentUser();
        if (!job.getClient().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only update your own jobs");
        }

        log.info("Updating job: {}", id);

        // Update fields if provided
        if (request.getTitle() != null) {
            job.setTitle(request.getTitle());
        }

        if (request.getDescription() != null) {
            job.setDescription(request.getDescription());
        }

        if (request.getCategory() != null) {
            job.setCategory(request.getCategory());
        }

        if (request.getRequiredSkills() != null) {
            job.setRequiredSkills(request.getRequiredSkills());
        }

        if (request.getBudget() != null) {
            job.setBudget(request.getBudget());
        }

        if (request.getBudgetType() != null) {
            job.setBudgetType(Job.BudgetType.valueOf(request.getBudgetType().toUpperCase()));
        }

        if (request.getDuration() != null) {
            job.setDuration(request.getDuration());
        }

        if (request.getExperienceLevel() != null) {
            job.setExperienceLevel(Job.ExperienceLevel.valueOf(request.getExperienceLevel().toUpperCase()));
        }

        if (request.getStatus() != null) {
            job.setStatus(Job.JobStatus.valueOf(request.getStatus().toUpperCase()));
        }

        Job updatedJob = jobRepository.save(job);
        log.info("Job updated: {}", updatedJob.getId());

        return JobResponse.fromEntity(updatedJob);
    }

    /**
     * Task 3.10: Delete job (owner only)
     */
    @Transactional
    public void deleteJob(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + id));

        User currentUser = userService.getCurrentUser();
        if (!job.getClient().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only delete your own jobs");
        }

        log.info("Deleting job: {}", id);
        jobRepository.delete(job);
        log.info("Job deleted: {}", id);
    }

    /**
     * Task 3.11: Search jobs with full-text search
     */
    @Transactional(readOnly = true)
    public Page<JobResponse> searchJobs(String searchTerm, Pageable pageable) {
        log.info("Searching jobs with term: {}", searchTerm);
        Page<Job> jobs = jobRepository.searchJobs(searchTerm, pageable);
        return jobs.map(JobResponse::fromEntity);
    }

    /**
     * Check if user is owner of the job
     */
    public boolean isJobOwner(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + jobId));
        User currentUser = userService.getCurrentUser();
        return job.getClient().getId().equals(currentUser.getId());
    }
}
