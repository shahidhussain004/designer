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

import com.designer.marketplace.dto.CreateJobRequest;
import com.designer.marketplace.dto.JobResponse;
import com.designer.marketplace.entity.Company;
import com.designer.marketplace.entity.Job;
import com.designer.marketplace.entity.JobCategory;
import com.designer.marketplace.repository.CompanyRepository;
import com.designer.marketplace.repository.JobCategoryRepository;
import com.designer.marketplace.repository.JobRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for Jobs (company opportunities)
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class JobService {

    private final JobRepository jobRepository;
    private final JobCategoryRepository categoryRepository;
    private final CompanyRepository companyRepository;

    /**
     * Get all open jobs with filters
     */
    @Transactional(readOnly = true)
    public Page<JobResponse> getAllJobs(
            Long companyId,
            Long categoryId,
            String jobType,
            String experienceLevel,
            Boolean isRemote,
            String location,
            Pageable pageable) {

        // Only filter by OPEN status if not filtering by specific company
        // This allows company owners to see their DRAFT jobs
        Job.JobStatus status = (companyId == null) ? Job.JobStatus.OPEN : null;
        Job.JobType jobTypeEnum = jobType != null ? Job.JobType.valueOf(jobType) : null;
        Job.ExperienceLevel expLevelEnum = experienceLevel != null ? Job.ExperienceLevel.valueOf(experienceLevel) : null;

        PageRequest safePageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.unsorted());

        Page<Job> jobs = jobRepository.findByStatusAndFilters(
            status,
            companyId,
            categoryId,
            jobTypeEnum,
            isRemote,
            safePageable);

        return jobs.map(JobResponse::fromEntity);
    }

    /**
     * Get job by ID and increment view count
     */
    @Transactional
    public JobResponse getJobById(Long id) {
        Job job = jobRepository.findByIdWithCompanyAndCategory(id)
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
        int offset = (int) pageable.getOffset();
        int limit = pageable.getPageSize();
        List<Job> jobs = jobRepository.searchJobs(query, offset, limit);
        long total = jobs.size() >= limit ? offset + limit + 1 : offset + jobs.size();
        Page<Job> jobPage = new org.springframework.data.domain.PageImpl<>(jobs, pageable, total);
        return jobPage.map(JobResponse::fromEntity);
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
     * Get jobs by company
     */
    @Transactional(readOnly = true)
    public Page<JobResponse> getJobsByCompany(Long companyId, Pageable pageable) {
        Page<Job> jobs = jobRepository.findByCompanyId(companyId, pageable);
        return jobs.map(JobResponse::fromEntity);
    }

    /**
     * Create a new job (for companies)
     */
    @Transactional
    public JobResponse createJob(Long userId, CreateJobRequest request) {        
        Company company = companyRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found for user: " + userId));

        // Get category if provided
        JobCategory category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
        }

        // Convert DTO to entity
        Job job = new Job();
        job.setCompany(company);
        job.setCategory(category);
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setResponsibilities(request.getResponsibilities());
        job.setRequirements(request.getRequirements());
        
        // Enums
        try {
            job.setJobType(Job.JobType.valueOf(request.getJobType()));
        } catch (Exception e) {
            job.setJobType(Job.JobType.FULL_TIME);
        }
        
        if (request.getExperienceLevel() != null) {
            try {
                job.setExperienceLevel(Job.ExperienceLevel.valueOf(request.getExperienceLevel()));
            } catch (Exception e) {
                // Ignore invalid values
            }
        }
        
        // Location
        job.setLocation(request.getLocation());
        job.setCity(request.getCity());
        job.setState(request.getState());
        job.setCountry(request.getCountry());
        job.setIsRemote(request.getIsRemote() != null ? request.getIsRemote() : false);
        
        if (request.getRemoteType() != null) {
            try {
                job.setRemoteType(Job.RemoteType.valueOf(request.getRemoteType()));
            } catch (Exception e) {
                // Ignore invalid values
            }
        }
        
        // Salary
        job.setSalaryMinCents(request.getSalaryMinCents());
        job.setSalaryMaxCents(request.getSalaryMaxCents());
        job.setSalaryCurrency(request.getSalaryCurrency());
        
        if (request.getSalaryPeriod() != null) {
            try {
                job.setSalaryPeriod(Job.SalaryPeriod.valueOf(request.getSalaryPeriod()));
            } catch (Exception e) {
                // Ignore invalid values
            }
        }
        
        job.setShowSalary(request.getShowSalary() != null ? request.getShowSalary() : true);
        
        // JSONB fields
        job.setBenefits(request.getBenefits());
        job.setPerks(request.getPerks());
        job.setRequiredSkills(request.getRequiredSkills());
        job.setPreferredSkills(request.getPreferredSkills());
        
        if (request.getEducationLevel() != null) {
            try {
                job.setEducationLevel(Job.EducationLevel.valueOf(request.getEducationLevel()));
            } catch (Exception e) {
                // Ignore invalid values
            }
        }
        
        job.setCertifications(request.getCertifications());
        
        // Application details
        job.setApplicationDeadline(request.getApplicationDeadline());
        job.setApplicationEmail(request.getApplicationEmail());
        job.setApplicationUrl(request.getApplicationUrl());
        job.setApplyInstructions(request.getApplyInstructions());
        job.setStartDate(request.getStartDate());
        job.setPositionsAvailable(request.getPositionsAvailable() != null ? request.getPositionsAvailable() : 1);
        
        if (request.getTravelRequirement() != null) {
            try {
                job.setTravelRequirement(Job.TravelRequirement.valueOf(request.getTravelRequirement()));
            } catch (Exception e) {
                // Ignore invalid values
            }
        }
        
        job.setSecurityClearanceRequired(request.getSecurityClearanceRequired() != null ? request.getSecurityClearanceRequired() : false);
        job.setVisaSponsorship(request.getVisaSponsorship() != null ? request.getVisaSponsorship() : false);
        
        // Status
        try {
            job.setStatus(Job.JobStatus.valueOf(request.getStatus() != null ? request.getStatus() : "DRAFT"));
        } catch (Exception e) {
            job.setStatus(Job.JobStatus.DRAFT);
        }
        
        // Set published date if status is OPEN
        if (job.getStatus() == Job.JobStatus.OPEN) {
            job.setPublishedAt(java.time.LocalDateTime.now());
        }
        
        job.setIsFeatured(request.getIsFeatured() != null ? request.getIsFeatured() : false);
        job.setIsUrgent(request.getIsUrgent() != null ? request.getIsUrgent() : false);
        job.setViewsCount(0);
        job.setApplicationsCount(0);

        Job savedJob = jobRepository.save(job);
        log.info("Created new job with id: {} for company: {}", savedJob.getId(), company.getCompanyName());

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
