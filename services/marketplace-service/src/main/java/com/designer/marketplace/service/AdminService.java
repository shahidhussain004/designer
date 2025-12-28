package com.designer.marketplace.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.designer.marketplace.dto.AdminDashboardResponse;
import com.designer.marketplace.dto.AdminUpdateUserRequest;
import com.designer.marketplace.dto.AdminUserResponse;
import com.designer.marketplace.dto.JobResponse;
import com.designer.marketplace.entity.Job;
import com.designer.marketplace.entity.Proposal;
import com.designer.marketplace.entity.User;
import com.designer.marketplace.entity.User.UserRole;
import com.designer.marketplace.lms.repository.CertificateRepository;
import com.designer.marketplace.lms.repository.CourseRepository;
import com.designer.marketplace.lms.repository.EnrollmentRepository;
import com.designer.marketplace.repository.JobRepository;
import com.designer.marketplace.repository.PaymentRepository;
import com.designer.marketplace.repository.ProposalRepository;
import com.designer.marketplace.repository.UserRepository;

@Service
public class AdminService {

    private static final Logger log = LoggerFactory.getLogger(AdminService.class);

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ProposalRepository proposalRepository;
    private final PaymentRepository paymentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CertificateRepository certificateRepository;
    
    public AdminService(UserRepository userRepository, JobRepository jobRepository,
                        ProposalRepository proposalRepository, PaymentRepository paymentRepository,
                        CourseRepository courseRepository, EnrollmentRepository enrollmentRepository,
                        CertificateRepository certificateRepository) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.proposalRepository = proposalRepository;
        this.paymentRepository = paymentRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.certificateRepository = certificateRepository;
    }

    // ==================== Dashboard ====================

    public AdminDashboardResponse getDashboard() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
        LocalDateTime startOfWeek = now.minusWeeks(1);
        LocalDateTime startOfMonth = now.minusMonths(1);

        // User stats
        long totalUsers = userRepository.count();
        long totalClients = userRepository.countByRole(UserRole.CLIENT);
        long totalFreelancers = userRepository.countByRole(UserRole.FREELANCER);
        long newUsersToday = userRepository.countByCreatedAtAfter(startOfDay);
        long newUsersThisWeek = userRepository.countByCreatedAtAfter(startOfWeek);
        long newUsersThisMonth = userRepository.countByCreatedAtAfter(startOfMonth);

        // Job stats
        long totalJobs = jobRepository.count();
        long openJobs = jobRepository.countByStatus(Job.JobStatus.OPEN);
        long completedJobs = jobRepository.countByStatus(Job.JobStatus.COMPLETED);
        long activeJobs = jobRepository.countByStatus(Job.JobStatus.IN_PROGRESS);

        // Proposal stats
        long totalProposals = proposalRepository.count();
        long pendingProposals = proposalRepository.countByStatus(Proposal.ProposalStatus.SUBMITTED);
        long acceptedProposals = proposalRepository.countByStatus(Proposal.ProposalStatus.ACCEPTED);

        // Payment stats
        long totalPayments = paymentRepository.count();
        BigDecimal totalRevenue = paymentRepository.sumTotalAmount();
        BigDecimal revenueThisMonth = paymentRepository.sumTotalAmountAfter(startOfMonth);
        BigDecimal platformFees = paymentRepository.sumPlatformFees();

        // LMS stats
        long totalCourses = courseRepository.count();
        long publishedCourses = courseRepository.countByStatus(
                com.designer.marketplace.lms.entity.Course.CourseStatus.PUBLISHED);
        long totalEnrollments = enrollmentRepository.count();
        long certificatesIssued = certificateRepository.count();

        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalClients(totalClients)
                .totalFreelancers(totalFreelancers)
                .newUsersToday(newUsersToday)
                .newUsersThisWeek(newUsersThisWeek)
                .newUsersThisMonth(newUsersThisMonth)
                .totalJobs(totalJobs)
                .openJobs(openJobs)
                .completedJobs(completedJobs)
                .activeJobs(activeJobs)
                .totalProposals(totalProposals)
                .pendingProposals(pendingProposals)
                .acceptedProposals(acceptedProposals)
                .totalPayments(totalPayments)
                .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                .revenueThisMonth(revenueThisMonth != null ? revenueThisMonth : BigDecimal.ZERO)
                .platformFees(platformFees != null ? platformFees : BigDecimal.ZERO)
                .totalCourses(totalCourses)
                .publishedCourses(publishedCourses)
                .totalEnrollments(totalEnrollments)
                .certificatesIssued(certificatesIssued)
                .build();
    }

    // ==================== User Management ====================

    public Page<AdminUserResponse> getUsers(String search, UserRole role, Boolean enabled, Pageable pageable) {
        Page<User> users;
        
        if (search != null && !search.isEmpty()) {
            users = userRepository.searchUsers(search, pageable);
        } else if (role != null && enabled != null) {
            users = userRepository.findByRoleAndIsActive(role, enabled, pageable);
        } else if (role != null) {
            users = userRepository.findByRole(role, pageable);
        } else if (enabled != null) {
            users = userRepository.findByIsActive(enabled, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }
        
        return users.map(AdminUserResponse::fromEntity);
    }

    public AdminUserResponse getUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        AdminUserResponse response = AdminUserResponse.fromEntity(user);
        
        // Add counts - handle null values and type conversion
        Long jobCount = jobRepository.countByClientId(userId);
        response.setTotalJobs(jobCount != null ? jobCount.intValue() : 0);
        
        Long proposalCount = proposalRepository.countByFreelancerId(userId);
        response.setTotalProposals(proposalCount != null ? proposalCount.intValue() : 0);
        
        Long courseCount = courseRepository.countByInstructorId(userId);
        response.setTotalCourses(courseCount != null ? courseCount.intValue() : 0);
        
        long enrollmentCount = enrollmentRepository.countByUserId(userId);
        response.setTotalEnrollments((int) enrollmentCount);
        
        return response;
    }

    @Transactional
    public AdminUserResponse updateUser(Long userId, AdminUpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }
        if (request.getUsername() != null) {
            user.setUsername(request.getUsername());
        }
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        if (request.getEnabled() != null) {
            user.setIsActive(request.getEnabled());
        }
        if (request.getEmailVerified() != null) {
            user.setEmailVerified(request.getEmailVerified());
        }
        if (request.getProfileImage() != null) {
            user.setProfileImageUrl(request.getProfileImage());
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        User saved = userRepository.save(user);
        
        log.info("Admin updated user {}: {}", userId, user.getEmail());
        
        return AdminUserResponse.fromEntity(saved);
    }

    @Transactional
    public void disableUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setIsActive(false);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        
        log.info("Admin disabled user {}: {}", userId, user.getEmail());
    }

    @Transactional
    public void enableUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setIsActive(true);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
        
        log.info("Admin enabled user {}: {}", userId, user.getEmail());
    }

    // ==================== Content Moderation ====================

    @Transactional(readOnly = true)
    public Page<JobResponse> getPendingReviewJobs(Pageable pageable) {
        // Get jobs that might need review (flagged, reported, or newly posted)
        Page<Job> jobs = jobRepository.findByStatus(Job.JobStatus.OPEN, pageable);
        return jobs.map(JobResponse::fromEntity);
    }

    @Transactional
    public void approveJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        // Mark as approved (keeping as OPEN status means approved)
        job.setUpdatedAt(LocalDateTime.now());
        jobRepository.save(job);
        
        log.info("Admin approved job {}: {}", jobId, job.getTitle());
    }

    @Transactional
    public void removeJob(Long jobId, String reason) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        job.setStatus(Job.JobStatus.CANCELLED);
        job.setUpdatedAt(LocalDateTime.now());
        jobRepository.save(job);
        
        log.info("Admin removed job {} for reason: {}", jobId, reason);
    }

    // ==================== Platform Statistics ====================

    public Map<String, Object> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Database counts
        stats.put("users", userRepository.count());
        stats.put("jobs", jobRepository.count());
        stats.put("proposals", proposalRepository.count());
        stats.put("payments", paymentRepository.count());
        stats.put("courses", courseRepository.count());
        stats.put("enrollments", enrollmentRepository.count());
        stats.put("certificates", certificateRepository.count());
        
        // Revenue
        BigDecimal totalRevenue = paymentRepository.sumTotalAmount();
        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : BigDecimal.ZERO);
        
        // Platform health
        stats.put("timestamp", LocalDateTime.now());
        stats.put("status", "healthy");
        
        return stats;
    }

    public List<Map<String, Object>> getRecentActivity(int limit) {
        List<Map<String, Object>> activities = new ArrayList<>();
        Pageable pageRequest = PageRequest.of(0, limit);
        
        // Get recent users
        List<User> recentUsers = userRepository.findRecentUsers(pageRequest);
        for (User user : recentUsers) {
            Map<String, Object> activity = new HashMap<>();
            activity.put("type", "USER_REGISTERED");
            activity.put("timestamp", user.getCreatedAt());
            activity.put("description", user.getFullName() + " registered as " + user.getRole());
            activity.put("userId", user.getId());
            activities.add(activity);
        }
        
        // Get recent jobs
        List<Job> recentJobs = jobRepository.findRecentJobs(pageRequest);
        for (Job job : recentJobs) {
            Map<String, Object> activity = new HashMap<>();
            activity.put("type", "JOB_POSTED");
            activity.put("timestamp", job.getCreatedAt());
            activity.put("description", "New job posted: " + job.getTitle());
            activity.put("jobId", job.getId());
            activities.add(activity);
        }
        
        // Sort by timestamp descending
        activities.sort((a, b) -> {
            LocalDateTime t1 = (LocalDateTime) a.get("timestamp");
            LocalDateTime t2 = (LocalDateTime) b.get("timestamp");
            return t2.compareTo(t1);
        });
        
        return activities.stream().limit(limit).collect(Collectors.toList());
    }
}
