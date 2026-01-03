package com.designer.marketplace.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.designer.marketplace.dto.JobResponse;
import com.designer.marketplace.entity.Job;
import com.designer.marketplace.entity.JobCategory;
import com.designer.marketplace.entity.User;
import com.designer.marketplace.repository.JobCategoryRepository;
import com.designer.marketplace.repository.JobRepository;
import com.designer.marketplace.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for Jobs (employment opportunities)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class JobService {

    private final JobRepository jobRepository;
    private final JobCategoryRepository categoryRepository;
    private final UserRepository userRepository;

    /**
     * Get all open jobs with filters
     */
    @Transactional(readOnly = true)
    public Page<JobResponse> getAllJobs(
            Long categoryId,
            String jobType,
            String experienceLevel,
            Boolean isRemote,
            String location,
            Pageable pageable) {

        String jobTypeStr = jobType != null ? jobType : null;
        String expLevelStr = experienceLevel != null ? experienceLevel : null;

        PageRequest safePageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.unsorted());

        Page<Job> jobs = jobRepository.findByFilters(
            "OPEN",
            categoryId,
            jobTypeStr,
            expLevelStr,
            isRemote,
            location,
            safePageable);

        return jobs.map(JobResponse::fromEntity);
    }

    /**
     * Get job by ID and increment view count
     */
    @Transactional
    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        // Increment view count
        job.setViewsCount(job.getViewsCount() + 1);
        jobRepository.save(job);

        return JobResponse.fromEntity(job);
    }

    /**
     * Search jobs
     */
    @Transactional(readOnly = true)
    public Page<JobResponse> searchJobs(String query, Pageable pageable) {
        Page<Job> jobs = jobRepository.searchJobs(query, pageable);
        return jobs.map(JobResponse::fromEntity);
    }

    /**
     * Get featured jobs
     */
    @Transactional(readOnly = true)
    public List<JobResponse> getFeaturedJobs(int limit) {
        Pageable pageable = Pageable.ofSize(limit);
        Page<Job> jobs = jobRepository.findFeaturedJobs(pageable);
        return jobs.getContent().stream()
                .map(JobResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get all job categories
     */
    @Transactional(readOnly = true)
    public List<JobCategory> getAllCategories() {
        return categoryRepository.findAllActiveCategories();
    }

    /**
     * Get category by slug
     */
    @Transactional(readOnly = true)
    public JobCategory getCategoryBySlug(String slug) {
        return categoryRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with slug: " + slug));
    }

    /**
     * Get jobs by employer
     */
    @Transactional(readOnly = true)
    public Page<JobResponse> getJobsByEmployer(Long employerId, Pageable pageable) {
        Page<Job> jobs = jobRepository.findByEmployerId(employerId, pageable);
        return jobs.map(JobResponse::fromEntity);
    }

    /**
     * Create a new job (for employers)
     */
    @Transactional
    public JobResponse createJob(Long employerId, Job job) {
        User employer = userRepository.findById(employerId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + employerId));

        job.setEmployer(employer);
        job.setStatus(Job.JobStatus.DRAFT);
        job.setViewsCount(0);
        job.setApplicationsCount(0);

        Job savedJob = jobRepository.save(job);
        log.info("Created new job with id: {}", savedJob.getId());

        return JobResponse.fromEntity(savedJob);
    }

    /**
     * Update a job
     */
    @Transactional
    public JobResponse updateJob(Long jobId, Job updatedJob) {
        Job existingJob = jobRepository.findById(jobId)
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

        Job saved = jobRepository.save(existingJob);
        log.info("Updated job with id: {}", saved.getId());

        return JobResponse.fromEntity(saved);
    }

    /**
     * Publish a job
     */
    @Transactional
    public JobResponse publishJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        job.setStatus(Job.JobStatus.OPEN);
        job.setPublishedAt(LocalDateTime.now());

        Job saved = jobRepository.save(job);
        log.info("Published job with id: {}", saved.getId());

        return JobResponse.fromEntity(saved);
    }

    /**
     * Close a job
     */
    @Transactional
    public JobResponse closeJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        job.setStatus(Job.JobStatus.CLOSED);
        job.setClosedAt(LocalDateTime.now());

        Job saved = jobRepository.save(job);
        log.info("Closed job with id: {}", saved.getId());

        return JobResponse.fromEntity(saved);
    }

    /**
     * Delete a job
     */
    @Transactional
    public void deleteJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        jobRepository.delete(job);
        log.info("Deleted job with id: {}", jobId);
    }
}
