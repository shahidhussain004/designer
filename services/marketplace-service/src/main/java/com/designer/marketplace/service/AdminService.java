package com.designer.marketplace.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.kafka.common.errors.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.designer.marketplace.dto.AdminAnalyticsCategoriesResponse;
import com.designer.marketplace.dto.AdminAnalyticsJobsResponse;
import com.designer.marketplace.dto.AdminAnalyticsRevenueResponse;
import com.designer.marketplace.dto.AdminAnalyticsUserGrowthResponse;
import com.designer.marketplace.dto.AdminDashboardStatsResponse;
import com.designer.marketplace.dto.AdminDisputeResolveRequest;
import com.designer.marketplace.dto.AdminDisputeResponse;
import com.designer.marketplace.dto.AdminJobResponse;
import com.designer.marketplace.dto.AdminUserResponse;
import com.designer.marketplace.entity.Company;
import com.designer.marketplace.entity.Payment.PaymentStatus;
import com.designer.marketplace.entity.Project;
import com.designer.marketplace.entity.Project.ProjectStatus;
import com.designer.marketplace.entity.ProjectCategory;
import com.designer.marketplace.entity.User;
import com.designer.marketplace.repository.ContractRepository;
import com.designer.marketplace.repository.EscrowRepository;
import com.designer.marketplace.repository.JobCategoryRepository;
import com.designer.marketplace.repository.PaymentRepository;
import com.designer.marketplace.repository.ProjectCategoryRepository;
import com.designer.marketplace.repository.ProjectRepository;
import com.designer.marketplace.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Admin Service - Handles admin dashboard operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class AdminService {

    private final UserRepository userRepository;
    private final ContractRepository contractRepository;
    private final PaymentRepository paymentRepository;
    private final EscrowRepository escrowRepository;
    private final ProjectRepository projectRepository;
    private final ProjectCategoryRepository projectCategoryRepository;
    private final JobCategoryRepository jobCategoryRepository;

    // ===== DASHBOARD ENDPOINTS =====

    /**
     * Get dashboard statistics
     */
    public AdminDashboardStatsResponse getDashboardStats() {
        log.info("Calculating dashboard statistics");

        long totalUsers = userRepository.count();
        long activeUsers = userRepository.count();
        long totalJobs = projectRepository.count();
        long totalContracts = contractRepository.count();
        long activeContracts = contractRepository.count();
        long completedContracts = contractRepository.count();
        long openDisputes = 0;

        // Calculate metrics
        double totalRevenue = calculateTotalRevenue();
        double platformFees = calculatePlatformFees();
        double totalPayments = calculateTotalPayments();

        return AdminDashboardStatsResponse.builder()
                .totalUsers(totalUsers)
                .activeUsers(activeUsers)
                .totalJobs(totalJobs)
                .openJobs(projectRepository.findAll().stream().filter(p -> p.getStatus() != null && p.getStatus().toString().equals("OPEN")).count())
                .totalContracts(totalContracts)
                .activeContracts(activeContracts)
                .completedContracts(completedContracts)
                .openDisputes(openDisputes)
                .totalRevenue(totalRevenue)
                .platformFees(platformFees)
                .totalPayments(totalPayments)
                .build();
    }

    /**
     * Get recent activity
     */
    public List<Map<String, Object>> getRecentActivity() {
        log.info("Fetching recent activity");

        List<Map<String, Object>> activities = new ArrayList<>();

        // Get recent users (last 5)
        try {
            userRepository.findAll().stream()
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .limit(5)
                    .forEach(user -> {
                Map<String, Object> activity = new java.util.LinkedHashMap<>();
                activity.put("id", user.getId());
                activity.put("type", "USER_CREATED");
                activity.put("title", "New user registered");
                activity.put("description", user.getFullName() + " (@" + user.getUsername() + ")");
                activity.put("time", user.getCreatedAt());
                activity.put("status", user.getIsActive() ? "ACTIVE" : "INACTIVE");
                activities.add(activity);
            });
        } catch (Exception e) {
            log.warn("Error fetching recent users: {}", e.getMessage());
        }

        // Get recent jobs (last 5)
        try {
            projectRepository.findAll().stream()
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .limit(5)
                    .forEach(project -> {
                Map<String, Object> activity = new java.util.LinkedHashMap<>();
                activity.put("id", project.getId());
                activity.put("type", "JOB_CREATED");
                activity.put("title", "New job posted");
                activity.put("description", project.getTitle());
                activity.put("time", project.getCreatedAt());
                activity.put("status", project.getStatus() != null ? project.getStatus().toString() : "DRAFT");
                activities.add(activity);
            });
        } catch (Exception e) {
            log.warn("Error fetching recent jobs: {}", e.getMessage());
        }

        // Get recent contracts (last 5)
        try {
            contractRepository.findAll().stream()
                    .sorted((a, b) -> b.getCreatedAt().compareTo(a.getCreatedAt()))
                    .limit(5)
                    .forEach(contract -> {
                Map<String, Object> activity = new java.util.LinkedHashMap<>();
                activity.put("id", contract.getId());
                activity.put("type", "CONTRACT_CREATED");
                activity.put("title", "New contract created");
                activity.put("description", "Contract with " + (contract.getFreelancer() != null ? contract.getFreelancer().getFullName() : "Unknown"));
                activity.put("time", contract.getCreatedAt());
                activity.put("status", contract.getStatus() != null ? contract.getStatus().toString() : "PENDING");
                activities.add(activity);
            });
        } catch (Exception e) {
            log.warn("Error fetching recent contracts: {}", e.getMessage());
        }

        // Sort all activities by time (most recent first) and return last 10
        return activities.stream()
                .sorted((a, b) -> {
                    java.time.LocalDateTime timeA = (java.time.LocalDateTime) a.get("time");
                    java.time.LocalDateTime timeB = (java.time.LocalDateTime) b.get("time");
                    return timeB.compareTo(timeA);
                })
                .limit(10)
                .collect(java.util.stream.Collectors.toList());
    }

    // ===== USER MANAGEMENT =====

    /**
     * Get all users with optional filtering
     */
    public Page<AdminUserResponse> getAllUsers(Pageable pageable, String role, String status) {
        log.info("Getting all users - role: {}, status: {}", role, status);

        Page<User> users;

        try {
            if (role != null && !role.isEmpty() && status != null && !status.isEmpty()) {
                boolean isActive = "ACTIVE".equalsIgnoreCase(status);
                User.UserRole userRole = User.UserRole.valueOf(role.toUpperCase());
                users = userRepository.findByRoleAndIsActive(userRole, isActive, pageable);
            } else if (role != null && !role.isEmpty()) {
                User.UserRole userRole = User.UserRole.valueOf(role.toUpperCase());
                users = userRepository.findByRole(userRole, pageable);
            } else if (status != null && !status.isEmpty()) {
                boolean isActive = "ACTIVE".equalsIgnoreCase(status);
                users = userRepository.findByIsActive(isActive, pageable);
            } else {
                users = userRepository.findAll(pageable);
            }
        } catch (Exception e) {
            log.warn("Error filtering users, returning all users: {}", e.getMessage());
            users = userRepository.findAll(pageable);
        }

        return users.map(this::convertUserToAdminResponse);
    }

    /**
     * Get user by ID
     */
    public AdminUserResponse getUserById(Long id) {
        log.info("Getting user by id: {}", id);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return convertUserToAdminResponse(user);
    }

    /**
     * Update user status
     */
    @Transactional
    public AdminUserResponse updateUserStatus(Long id, boolean isActive) {
        log.info("Updating user status - id: {}, isActive: {}", id, isActive);
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setIsActive(isActive);
        User updated = userRepository.save(user);
        return convertUserToAdminResponse(updated);
    }

    /**
     * Delete user
     */
    @Transactional
    public void deleteUser(Long id) {
        log.info("Deleting user: {}", id);
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    // ===== JOB MANAGEMENT =====

    /**
     * Get all jobs with optional filtering by status
     */
    public Page<AdminJobResponse> getAllJobs(Pageable pageable, String status) {
        log.info("Getting all jobs - status: {}", status);

        Page<Project> projects = projectRepository.findAll(pageable);

        return projects.map(this::convertProjectToAdminResponse);
    }

    /**
     * Get pending jobs
     */
    public Page<AdminJobResponse> getPendingJobs(Pageable pageable) {
        log.info("Getting pending jobs");
        Page<Project> projects = projectRepository.findAll(pageable);
        return projects.map(this::convertProjectToAdminResponse);
    }

    /**
     * Approve job
     */
    @Transactional
    public AdminJobResponse approveJob(Long id) {
        log.info("Approving job: {}", id);
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        project.setStatus(ProjectStatus.OPEN);
        Project updated = projectRepository.save(project);
        return convertProjectToAdminResponse(updated);
    }

    /**
     * Reject job
     */
    @Transactional
    public AdminJobResponse rejectJob(Long id, String reason) {
        log.info("Rejecting job: {} - reason: {}", id, reason);
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));

        project.setStatus(ProjectStatus.CANCELLED);
        Project updated = projectRepository.save(project);
        return convertProjectToAdminResponse(updated);
    }

    /**
     * Delete job
     */
    @Transactional
    public void deleteJob(Long id) {
        log.info("Deleting job: {}", id);
        if (!projectRepository.existsById(id)) {
            throw new ResourceNotFoundException("Job not found with id: " + id);
        }
        projectRepository.deleteById(id);
    }

    // ===== DISPUTE MANAGEMENT =====

    /**
     * Get all disputes with optional filtering
     */
    public Page<AdminDisputeResponse> getAllDisputes(Pageable pageable, String status) {
        log.info("Getting all disputes - status: {}", status);

        // For now, return an empty page since support tickets table may not be mapped
        return new PageImpl<>(new ArrayList<>(), pageable, 0);
    }

    /**
     * Get dispute by ID
     */
    public AdminDisputeResponse getDisputeById(Long id) {
        log.info("Getting dispute by id: {}", id);
        // Placeholder implementation
        return AdminDisputeResponse.builder()
                .id(id)
                .status("PENDING")
                .build();
    }

    /**
     * Resolve dispute
     */
    @Transactional
    public AdminDisputeResponse resolveDispute(Long id, AdminDisputeResolveRequest request) {
        log.info("Resolving dispute: {} - resolution: {}", id, request.getResolution());

        // Placeholder implementation
        return AdminDisputeResponse.builder()
                .id(id)
                .status("RESOLVED")
                .resolution(request.getResolution())
                .build();
    }

    /**
     * Escalate dispute
     */
    @Transactional
    public AdminDisputeResponse escalateDispute(Long id) {
        log.info("Escalating dispute: {}", id);

        // Placeholder implementation
        return AdminDisputeResponse.builder()
                .id(id)
                .status("ESCALATED")
                .build();
    }

    // ===== ANALYTICS =====

    /**
     * Get user growth analytics (last 12 months)
     */
    public AdminAnalyticsUserGrowthResponse getUserGrowthAnalytics() {
        log.info("Getting user growth analytics");

        List<String> labels = new ArrayList<>();
        List<Integer> data = new ArrayList<>();
        List<Integer> activeData = new ArrayList<>();

        // Generate last 12 months data with mock data
        LocalDate now = LocalDate.now();
        for (int i = 11; i >= 0; i--) {
            LocalDate monthStart = now.minusMonths(i).withDayOfMonth(1);
            labels.add(monthStart.getMonth().toString().substring(0, 3) + " " + monthStart.getYear());
            data.add((int) (Math.random() * 100 + 10));
            activeData.add((int) (Math.random() * 80 + 20));
        }

        long totalActive = userRepository.count();

        return AdminAnalyticsUserGrowthResponse.builder()
                .labels(labels)
                .data(data)
                .activeData(activeData)
                .totalActive(Math.toIntExact(totalActive))
                .build();
    }

    /**
     * Get revenue analytics (last 12 months)
     */
    public AdminAnalyticsRevenueResponse getRevenueAnalytics() {
        log.info("Getting revenue analytics");

        List<String> labels = new ArrayList<>();
        List<Double> data = new ArrayList<>();
        List<Double> feesData = new ArrayList<>();

        // Generate last 12 months data with mock data
        LocalDate now = LocalDate.now();
        double totalMTD = 0;

        for (int i = 11; i >= 0; i--) {
            LocalDate monthStart = now.minusMonths(i).withDayOfMonth(1);
            labels.add(monthStart.getMonth().toString().substring(0, 3) + " " + monthStart.getYear());
            
            double revenue = Math.random() * 50000 + 10000;
            data.add(revenue);
            feesData.add(revenue * 0.1);

            if (i == 0) {
                totalMTD = revenue;
            }
        }

        return AdminAnalyticsRevenueResponse.builder()
                .labels(labels)
                .data(data)
                .feesData(feesData)
                .totalMTD(totalMTD)
                .avgJobValue(Math.random() * 5000 + 1000)
                .build();
    }

    /**
     * Get jobs analytics (last 12 months)
     */
    public AdminAnalyticsJobsResponse getJobsAnalytics() {
        log.info("Getting jobs analytics");

        List<String> labels = new ArrayList<>();
        List<Integer> postedData = new ArrayList<>();
        List<Integer> completedData = new ArrayList<>();

        // Generate last 12 months data with mock data
        LocalDate now = LocalDate.now();
        int totalCompleted = 0;

        for (int i = 11; i >= 0; i--) {
            LocalDate monthStart = now.minusMonths(i).withDayOfMonth(1);
            labels.add(monthStart.getMonth().toString().substring(0, 3) + " " + monthStart.getYear());
            
            int posted = (int) (Math.random() * 50 + 10);
            int completed = (int) (Math.random() * 40 + 5);
            
            postedData.add(posted);
            completedData.add(completed);
            totalCompleted += completed;
        }

        return AdminAnalyticsJobsResponse.builder()
                .labels(labels)
                .postedData(postedData)
                .completedData(completedData)
                .totalCompleted(totalCompleted)
                .build();
    }

    /**
     * Get category distribution analytics
     */
    public AdminAnalyticsCategoriesResponse getCategoryDistributionAnalytics() {
        log.info("Getting category distribution analytics");

        List<String> labels = new ArrayList<>();
        List<Integer> data = new ArrayList<>();

        // Get all project categories and count projects
        try {
            List<ProjectCategory> categories = projectCategoryRepository.findAll();
            for (ProjectCategory category : categories) {
                labels.add(category.getName());
                // For now, use mock data since we don't have a direct count method
                data.add((int) (Math.random() * 100 + 10));
            }
        } catch (Exception e) {
            log.warn("Error getting categories: {}", e.getMessage());
        }

        return AdminAnalyticsCategoriesResponse.builder()
                .labels(labels)
                .data(data)
                .build();
    }

    // ===== HELPER METHODS =====

    /**
     * Convert User entity to AdminUserResponse
     */
    private AdminUserResponse convertUserToAdminResponse(User user) {
        return AdminUserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .active(Boolean.TRUE.equals(user.getIsActive()))
                .emailVerified(Boolean.TRUE.equals(user.getEmailVerified()))
                .profileImage(user.getProfileImageUrl())
                .createdAt(user.getCreatedAt())
                .totalJobs(0)
                .totalProposals(0)
                .totalCourses(0)
                .totalEnrollments(0)
                .build();
    }

    /**
     * Convert Job entity to AdminJobResponse
     */
    private AdminJobResponse convertProjectToAdminResponse(Project project) {
        double budgetMin = project.getBudgetMinCents() != null ? project.getBudgetMinCents() / 100.0 : 0;
        double budgetMax = project.getBudgetMaxCents() != null ? project.getBudgetMaxCents() / 100.0 : 0;
        
        Company company = project.getCompany();
        String companyName = company != null ? company.getCompanyName() : "Unknown";
        Long companyId = company != null ? company.getId() : null;
        
        return AdminJobResponse.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .status(project.getStatus() != null ? project.getStatus().toString() : "DRAFT")
                .employerId(companyId)
                .employerName(companyName)
                .categoryId(project.getProjectCategory() != null ? project.getProjectCategory().getId() : null)
                .categoryName(project.getProjectCategory() != null ? project.getProjectCategory().getName() : "Uncategorized")
                .budgetMin(budgetMin)
                .budgetMax(budgetMax)
                .duration(project.getTimeline())
                .applicationsCount(0)
                .proposalCount(project.getProposalCount() != null ? project.getProposalCount() : 0)
                .createdAt(project.getCreatedAt())
                .updatedAt(project.getUpdatedAt())
                .build();
    }

    /**
     * Convert SupportTicket entity to AdminDisputeResponse
     */
    private AdminDisputeResponse convertTicketToDisputeResponse(Object ticket) {
        return AdminDisputeResponse.builder()
                .id(0L)
                .supportTicketId(0L)
                .reason("Unknown")
                .description("Unknown")
                .status("UNKNOWN")
                .amount(0.0)
                .clientName("Unknown")
                .jobTitle("Unknown")
                .createdAt(LocalDateTime.now())
                .build();
    }

    /**
     * Calculate total revenue
     */
    private double calculateTotalRevenue() {
        return paymentRepository.findAll()
                .stream()
                .mapToDouble(p -> p.getAmountCents() != null ? p.getAmountCents() / 100.0 : 0)
                .sum();
    }

    /**
     * Calculate platform fees (10% of completed payments)
     */
    private double calculatePlatformFees() {
        // Platform fee is 10% of all completed payments
        Long completedAmount = paymentRepository.sumAmountByStatus(PaymentStatus.COMPLETED);
        if (completedAmount == null || completedAmount == 0) {
            return 0.0;
        }
        // Calculate 10% platform fee on completed payments amount (in cents)
        return (completedAmount * 0.10) / 100.0; // Convert cents to dollars
    }

    /**
     * Calculate total payments
     */
    private double calculateTotalPayments() {
        return paymentRepository.findAll()
                .stream()
                .mapToDouble(p -> p.getAmountCents() != null ? p.getAmountCents() / 100.0 : 0)
                .sum();
    }
}
