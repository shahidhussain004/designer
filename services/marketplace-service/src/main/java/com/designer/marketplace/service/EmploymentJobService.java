package com.designer.marketplace.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.designer.marketplace.dto.EmploymentJobResponse;
import com.designer.marketplace.entity.EmploymentJob;
import com.designer.marketplace.entity.EmploymentJobCategory;
import com.designer.marketplace.entity.User;
import com.designer.marketplace.repository.EmploymentJobCategoryRepository;
import com.designer.marketplace.repository.EmploymentJobRepository;
import com.designer.marketplace.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for Employment Jobs (traditional employment opportunities)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmploymentJobService {

    private final EmploymentJobRepository jobRepository;
    private final EmploymentJobCategoryRepository categoryRepository;
    private final UserRepository userRepository;

    /**
     * Get all active jobs with filters
     */
    @Transactional(readOnly = true)
    public Page<EmploymentJobResponse> getAllJobs(
            Long categoryId,
            String jobType,
            String experienceLevel,
            Boolean isRemote,
            String location,
            Pageable pageable) {

        EmploymentJob.JobType jobTypeEnum = jobType != null ? EmploymentJob.JobType.valueOf(jobType) : null;
        EmploymentJob.ExperienceLevel expLevelEnum = experienceLevel != null
                ? EmploymentJob.ExperienceLevel.valueOf(experienceLevel)
                : null;

        Page<EmploymentJob> jobs = jobRepository.findByFilters(
                EmploymentJob.JobStatus.ACTIVE,
                categoryId,
                jobTypeEnum,
                expLevelEnum,
                isRemote,
                location,
                pageable);

        return jobs.map(EmploymentJobResponse::fromEntity);
    }

    /**
     * Get job by ID and increment view count
     */
    @Transactional
    public EmploymentJobResponse getJobById(Long id) {
        EmploymentJob job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        // Increment view count
        job.setViewsCount(job.getViewsCount() + 1);
        jobRepository.save(job);

        return EmploymentJobResponse.fromEntity(job);
    }

    /**
     * Search jobs
     */
    @Transactional(readOnly = true)
    public Page<EmploymentJobResponse> searchJobs(String query, Pageable pageable) {
        Page<EmploymentJob> jobs = jobRepository.searchJobs(query, pageable);
        return jobs.map(EmploymentJobResponse::fromEntity);
    }

    /**
     * Get featured jobs
     */
    @Transactional(readOnly = true)
    public List<EmploymentJobResponse> getFeaturedJobs(int limit) {
        Pageable pageable = Pageable.ofSize(limit);
        Page<EmploymentJob> jobs = jobRepository.findFeaturedJobs(pageable);
        return jobs.getContent().stream()
                .map(EmploymentJobResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get all job categories
     */
    @Transactional(readOnly = true)
    public List<EmploymentJobCategory> getAllCategories() {
        return categoryRepository.findAllActiveCategories();
    }

    /**
     * Get category by slug
     */
    @Transactional(readOnly = true)
    public EmploymentJobCategory getCategoryBySlug(String slug) {
        return categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + slug));
    }

    /**
     * Get jobs by employer
     */
    @Transactional(readOnly = true)
    public Page<EmploymentJobResponse> getJobsByEmployer(Long employerId, Pageable pageable) {
        Page<EmploymentJob> jobs = jobRepository.findByEmployerId(employerId, pageable);
        return jobs.map(EmploymentJobResponse::fromEntity);
    }

    /**
     * Create a new job (for employers)
     */
    @Transactional
    public EmploymentJobResponse createJob(Long employerId, EmploymentJob job) {
        User employer = userRepository.findById(employerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + employerId));

        job.setEmployer(employer);
        job.setStatus(EmploymentJob.JobStatus.DRAFT);
        job.setViewsCount(0);
        job.setApplicationsCount(0);

        EmploymentJob savedJob = jobRepository.save(job);
        log.info("Created new employment job with id: {}", savedJob.getId());

        return EmploymentJobResponse.fromEntity(savedJob);
    }

    /**
     * Update a job
     */
    @Transactional
    public EmploymentJobResponse updateJob(Long jobId, EmploymentJob updatedJob) {
        EmploymentJob existingJob = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        // Update fields (only non-null values)
        if (updatedJob.getTitle() != null) {
            existingJob.setTitle(updatedJob.getTitle());
        }
        if (updatedJob.getDescription() != null) {
            existingJob.setDescription(updatedJob.getDescription());
        }
        if (updatedJob.getResponsibilities() != null) {
            existingJob.setResponsibilities(updatedJob.getResponsibilities());
        }
        if (updatedJob.getRequirements() != null) {
            existingJob.setRequirements(updatedJob.getRequirements());
        }
        // ... add more fields as needed

        EmploymentJob saved = jobRepository.save(existingJob);
        log.info("Updated employment job with id: {}", saved.getId());

        return EmploymentJobResponse.fromEntity(saved);
    }

    /**
     * Publish a job
     */
    @Transactional
    public EmploymentJobResponse publishJob(Long jobId) {
        EmploymentJob job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        job.setStatus(EmploymentJob.JobStatus.ACTIVE);
        job.setPublishedAt(LocalDateTime.now());

        EmploymentJob saved = jobRepository.save(job);
        log.info("Published employment job with id: {}", saved.getId());

        return EmploymentJobResponse.fromEntity(saved);
    }

    /**
     * Close a job
     */
    @Transactional
    public EmploymentJobResponse closeJob(Long jobId) {
        EmploymentJob job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        job.setStatus(EmploymentJob.JobStatus.CLOSED);
        job.setClosedAt(LocalDateTime.now());

        EmploymentJob saved = jobRepository.save(job);
        log.info("Closed employment job with id: {}", saved.getId());

        return EmploymentJobResponse.fromEntity(saved);
    }

    /**
     * Delete a job
     */
    @Transactional
    public void deleteJob(Long jobId) {
        EmploymentJob job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        jobRepository.delete(job);
        log.info("Deleted employment job with id: {}", jobId);
    }
}
