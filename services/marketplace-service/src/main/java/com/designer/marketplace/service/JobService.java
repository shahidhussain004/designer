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
import com.designer.marketplace.dto.UpdateJobRequest;
import com.designer.marketplace.entity.Company;
import com.designer.marketplace.entity.Job;
import com.designer.marketplace.entity.JobCategory;
import com.designer.marketplace.entity.User;
import com.designer.marketplace.repository.CompanyRepository;
import com.designer.marketplace.repository.JobCategoryRepository;
import com.designer.marketplace.repository.JobRepository;
import com.designer.marketplace.repository.UserRepository;

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
    private final UserRepository userRepository;

    /**
     * Enrich JobResponse with ownership information
     * Sets the isOwner flag based on whether the given userId owns the job
     * 
     * @param jobResponse The job response to enrich
     * @param userId The current user's ID (null if not authenticated)
     * @return The enriched job response
     */
    public JobResponse enrichWithOwnership(JobResponse jobResponse, Long userId) {
        if (jobResponse == null) {
            return null;
        }

        // If no user is logged in, they don't own anything
        if (userId == null) {
            jobResponse.setIsOwner(false);
            return jobResponse;
        }

        // Check if this user's company owns this job
        try {
            Company company = companyRepository.findByUserId(userId).orElse(null);
            if (company != null && jobResponse.getCompanyId() != null) {
                jobResponse.setIsOwner(company.getId().equals(jobResponse.getCompanyId()));
            } else {
                jobResponse.setIsOwner(false);
            }
        } catch (Exception e) {
            log.warn("Error checking ownership for user {} on job {}: {}", 
                    userId, jobResponse.getId(), e.getMessage());
            jobResponse.setIsOwner(false);
        }

        return jobResponse;
    }

    /**
     * Enrich a page of JobResponses with ownership information
     */
    public Page<JobResponse> enrichPageWithOwnership(Page<JobResponse> jobs, Long userId) {
        if (userId == null) {
            // If no user, just set all to false
            jobs.forEach(job -> job.setIsOwner(false));
            return jobs;
        }
        
        jobs.forEach(job -> enrichWithOwnership(job, userId));
        return jobs;
    }

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
        Job job = jobRepository.findByIdWithCompanyAndCategory(jobId)
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
        Job job = jobRepository.findByIdWithCompanyAndCategory(jobId)
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
        Job job = jobRepository.findByIdWithCompanyAndCategory(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        jobRepository.delete(job);
        log.info("Deleted job with id: {}", jobId);
    }

    /**
     * Get current user's company jobs (all statuses including DRAFT)
     */
    @Transactional(readOnly = true)
    public Page<JobResponse> getMyJobs(Long userId, Pageable pageable) {
        // Get the company for this user
        Company company = companyRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Company profile not found for user: " + userId));

        // Get all jobs for this company using the query that FETCH JOINs company to avoid LazyInitializationException
        // Use a safe pageable without sorting to avoid JPQL issues
        PageRequest safePageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Job> jobs = jobRepository.findByCompanyIdWithCompany(company.getId(), safePageable);

        log.info("Retrieved {} jobs for company {} (user: {})",
                jobs.getTotalElements(), company.getId(), userId);

        return jobs.map(job -> {
            JobResponse response = JobResponse.fromEntity(job);
            response.setIsOwner(true); // All jobs here are owned by this company
            return response;
        });
    }

    /**
     * Update job as owner (with ownership verification)
     * OPTIMIZED: Uses denormalized company_id for O(1) permission check (no JOINs)
     */
    @Transactional
    public JobResponse updateJobAsOwner(Long userId, Long jobId, UpdateJobRequest request) {
        log.info("updateJobAsOwner called - userId: {}, jobId: {}", userId, jobId);
        
        // ✅ FAST: Get user with denormalized company_id (single query, no JOIN)
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.error("User not found: {}", userId);
                    return new ResourceNotFoundException("User not found with id: " + userId);
                });

        // ✅ INSTANT CHECK: Denormalized company_id is directly on user
        if (user.getCompanyId() == null) {
            log.error("User {} has no company profile - cannot update jobs", userId);
            throw new SecurityException("No company profile associated with your account. Please create a company profile first.");
        }

        Long companyId = user.getCompanyId();
        log.info("Found user {} with company_id: {}", userId, companyId);

        // Get the job WITH company relationship EAGERLY LOADED (avoid LazyInitializationException)
        Job job = jobRepository.findByIdWithCompanyAndCategory(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        log.info("Found job: {} (id: {}), company_id: {}", job.getTitle(), job.getId(), job.getCompany().getId());

        // ✅ DIRECT COMPARISON: No database query needed!
        if (!job.getCompany().getId().equals(companyId)) {
            log.error("Permission denied: User {} (company {}) tried to update job {} (company {})", 
                    userId, companyId, jobId, job.getCompany().getId());
            throw new SecurityException("You do not have permission to update this job");
        }
        
        log.info("Permission check passed - user {} can update job {}", userId, jobId);

        // Update fields (only non-null values)
        if (request.getCategoryId() != null) {
            JobCategory category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
            job.setCategory(category);
        }

        if (request.getTitle() != null) {
            job.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            job.setDescription(request.getDescription());
        }
        if (request.getResponsibilities() != null) {
            job.setResponsibilities(request.getResponsibilities());
        }
        if (request.getRequirements() != null) {
            job.setRequirements(request.getRequirements());
        }
        if (request.getJobType() != null) {
            try {
                job.setJobType(Job.JobType.valueOf(request.getJobType()));
            } catch (Exception e) {
                log.warn("Invalid job type: {}", request.getJobType());
            }
        }
        if (request.getExperienceLevel() != null) {
            try {
                job.setExperienceLevel(Job.ExperienceLevel.valueOf(request.getExperienceLevel()));
            } catch (Exception e) {
                log.warn("Invalid experience level: {}", request.getExperienceLevel());
            }
        }
        if (request.getLocation() != null) {
            job.setLocation(request.getLocation());
        }
        if (request.getCity() != null) {
            job.setCity(request.getCity());
        }
        if (request.getState() != null) {
            job.setState(request.getState());
        }
        if (request.getCountry() != null) {
            job.setCountry(request.getCountry());
        }
        if (request.getIsRemote() != null) {
            job.setIsRemote(request.getIsRemote());
        }
        if (request.getRemoteType() != null) {
            try {
                job.setRemoteType(Job.RemoteType.valueOf(request.getRemoteType()));
            } catch (Exception e) {
                log.warn("Invalid remote type: {}", request.getRemoteType());
            }
        }
        if (request.getSalaryMinCents() != null) {
            job.setSalaryMinCents(request.getSalaryMinCents());
        }
        if (request.getSalaryMaxCents() != null) {
            job.setSalaryMaxCents(request.getSalaryMaxCents());
        }
        if (request.getSalaryCurrency() != null) {
            job.setSalaryCurrency(request.getSalaryCurrency());
        }
        if (request.getSalaryPeriod() != null) {
            try {
                job.setSalaryPeriod(Job.SalaryPeriod.valueOf(request.getSalaryPeriod()));
            } catch (Exception e) {
                log.warn("Invalid salary period: {}", request.getSalaryPeriod());
            }
        }
        if (request.getShowSalary() != null) {
            job.setShowSalary(request.getShowSalary());
        }
        if (request.getBenefits() != null) {
            job.setBenefits(request.getBenefits());
        }
        if (request.getPerks() != null) {
            job.setPerks(request.getPerks());
        }
        if (request.getRequiredSkills() != null) {
            job.setRequiredSkills(request.getRequiredSkills());
        }
        if (request.getPreferredSkills() != null) {
            job.setPreferredSkills(request.getPreferredSkills());
        }
        if (request.getEducationLevel() != null) {
            try {
                job.setEducationLevel(Job.EducationLevel.valueOf(request.getEducationLevel()));
            } catch (Exception e) {
                log.warn("Invalid education level: {}", request.getEducationLevel());
            }
        }
        if (request.getCertifications() != null) {
            job.setCertifications(request.getCertifications());
        }
        if (request.getApplicationDeadline() != null) {
            job.setApplicationDeadline(request.getApplicationDeadline());
        }
        if (request.getApplicationUrl() != null) {
            job.setApplicationUrl(request.getApplicationUrl());
        }
        if (request.getApplyInstructions() != null) {
            job.setApplyInstructions(request.getApplyInstructions());
        }
        if (request.getStartDate() != null) {
            job.setStartDate(request.getStartDate());
        }
        if (request.getPositionsAvailable() != null) {
            job.setPositionsAvailable(request.getPositionsAvailable());
        }
        if (request.getTravelRequirement() != null) {
            try {
                job.setTravelRequirement(Job.TravelRequirement.valueOf(request.getTravelRequirement()));
            } catch (Exception e) {
                log.warn("Invalid travel requirement: {}", request.getTravelRequirement());
            }
        }
        if (request.getSecurityClearanceRequired() != null) {
            job.setSecurityClearanceRequired(request.getSecurityClearanceRequired());
        }
        if (request.getVisaSponsorship() != null) {
            job.setVisaSponsorship(request.getVisaSponsorship());
        }
        if (request.getStatus() != null) {
            try {
                Job.JobStatus newStatus = Job.JobStatus.valueOf(request.getStatus());
                job.setStatus(newStatus);
                // If changing to OPEN, set publishedAt
                if (newStatus == Job.JobStatus.OPEN && job.getPublishedAt() == null) {
                    job.setPublishedAt(LocalDateTime.now());
                }
            } catch (Exception e) {
                log.warn("Invalid status: {}", request.getStatus());
            }
        }

        try {
            log.info("Before save - requiredSkills: {}, benefits: {}, perks: {}", 
                    job.getRequiredSkills(), job.getBenefits(), job.getPerks());
            Job saved = jobRepository.save(job);
            log.info("Updated job {} by user {} (company {})", jobId, userId, user.getCompanyId());
            return JobResponse.fromEntity(saved);
        } catch (Exception e) {
            log.error("Error saving job during update", e);
            throw e;
        }
    }

    /**
     * Publish job as owner (with ownership verification)
     * OPTIMIZED: Uses denormalized company_id for O(1) permission check
     */
    @Transactional
    public JobResponse publishJobAsOwner(Long userId, Long jobId) {
        // ✅ FAST: Get user with denormalized company_id
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (user.getCompanyId() == null) {
            throw new SecurityException("No company profile associated with your account");
        }

        // Get the job WITH company relationship EAGERLY LOADED
        Job job = jobRepository.findByIdWithCompanyAndCategory(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        // ✅ DIRECT COMPARISON: No database query needed!
        if (!job.getCompany().getId().equals(user.getCompanyId())) {
            throw new SecurityException("You do not have permission to publish this job");
        }

        job.setStatus(Job.JobStatus.OPEN);
        job.setPublishedAt(LocalDateTime.now());

        Job saved = jobRepository.save(job);
        log.info("Published job {} by user {} (company {})", jobId, userId, user.getCompanyId());

        return JobResponse.fromEntity(saved);
    }

    /**
     * Close job as owner (with ownership verification)
     * OPTIMIZED: Uses denormalized company_id for O(1) permission check
     */
    @Transactional
    public JobResponse closeJobAsOwner(Long userId, Long jobId) {
        // ✅ FAST: Get user with denormalized company_id
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (user.getCompanyId() == null) {
            throw new SecurityException("No company profile associated with your account");
        }

        // Get the job WITH company relationship EAGERLY LOADED
        Job job = jobRepository.findByIdWithCompanyAndCategory(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        // ✅ DIRECT COMPARISON: No database query needed!
        if (!job.getCompany().getId().equals(user.getCompanyId())) {
            throw new SecurityException("You do not have permission to close this job");
        }

        job.setStatus(Job.JobStatus.CLOSED);
        job.setClosedAt(LocalDateTime.now());

        Job saved = jobRepository.save(job);
        log.info("Closed job {} by user {} (company {})", jobId, userId, user.getCompanyId());

        return JobResponse.fromEntity(saved);
    }

    /**
     * Mark job as filled (with ownership verification)
     * OPTIMIZED: Uses denormalized company_id for O(1) permission check
     * 
     * @param userId The ID of the user marking the job as filled
     * @param jobId The ID of the job to mark as filled
     * @param applicationId Optional - The application ID that resulted in the hire
     */
    @Transactional
    public JobResponse markJobAsFilledAsOwner(Long userId, Long jobId, Long applicationId) {
        // ✅ FAST: Get user with denormalized company_id
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (user.getCompanyId() == null) {
            throw new SecurityException("No company profile associated with your account");
        }

        // Get the job WITH company relationship EAGERLY LOADED
        Job job = jobRepository.findByIdWithCompanyAndCategory(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        // ✅ DIRECT COMPARISON: No database query needed!
        if (!job.getCompany().getId().equals(user.getCompanyId())) {
            throw new SecurityException("You do not have permission to mark this job as filled");
        }

        job.setStatus(Job.JobStatus.FILLED);
        job.setFilledAt(LocalDateTime.now());
        
        // Optionally track which application resulted in the hire
        if (applicationId != null) {
            job.setFilledByApplicationId(applicationId);
        }

        Job saved = jobRepository.save(job);
        log.info("Marked job {} as FILLED by user {} (company {}), application: {}", 
                jobId, userId, user.getCompanyId(), applicationId);

        return JobResponse.fromEntity(saved);
    }

    /**
     * Delete job as owner (with ownership verification)
     * OPTIMIZED: Uses denormalized company_id for O(1) permission check
     */
    @Transactional
    public void deleteJobAsOwner(Long userId, Long jobId) {
        // ✅ FAST: Get user with denormalized company_id
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (user.getCompanyId() == null) {
            throw new SecurityException("No company profile associated with your account");
        }

        // Get the job WITH company relationship EAGERLY LOADED
        Job job = jobRepository.findByIdWithCompanyAndCategory(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        // ✅ DIRECT COMPARISON: No database query needed!
        if (!job.getCompany().getId().equals(user.getCompanyId())) {
            throw new SecurityException("You do not have permission to delete this job");
        }

        jobRepository.delete(job);
        log.info("Deleted job {} by user {} (company {})", jobId, userId, user.getCompanyId());
    }
}

