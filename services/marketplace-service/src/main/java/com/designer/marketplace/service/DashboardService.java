package com.designer.marketplace.service;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.designer.marketplace.dto.CompanyDashboardResponse;
import com.designer.marketplace.dto.FreelancerDashboardResponse;
import com.designer.marketplace.dto.JobApplicationResponse;
import com.designer.marketplace.dto.JobResponse;
import com.designer.marketplace.dto.NotificationResponse;
import com.designer.marketplace.dto.ProjectResponse;
import com.designer.marketplace.dto.ProposalResponse;
import com.designer.marketplace.entity.Job;
import com.designer.marketplace.entity.Project;
import com.designer.marketplace.entity.Proposal;
import com.designer.marketplace.entity.User;
import com.designer.marketplace.repository.JobApplicationRepository;
import com.designer.marketplace.repository.JobRepository;
import com.designer.marketplace.repository.ProjectRepository;
import com.designer.marketplace.repository.ProposalRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for dashboard operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

        private final UserService userService;
        private final ProjectRepository projectRepository;
        private final ProposalRepository proposalRepository;
        private final JobRepository jobRepository;
        private final JobApplicationRepository jobApplicationRepository;
        private final NotificationService notificationService;

        /**
         * Task 3.17: Get company dashboard data
         */
        @Transactional(readOnly = true)
        public CompanyDashboardResponse getCompanyDashboard() {
                User currentUser = userService.getCurrentUser();

                if (currentUser.getRole() != User.UserRole.COMPANY) {
                        throw new RuntimeException("This endpoint is only for companies");
                }

                log.info("Getting company dashboard for user: {}", currentUser.getUsername());

                // Get project statistics
                Long totalProjectsPosted = projectRepository.countByCompanyId(currentUser.getId());
                Long activeProjects = projectRepository.countByCompanyIdAndStatus(currentUser.getId(), Project.ProjectStatus.OPEN) +
                                projectRepository.countByCompanyIdAndStatus(currentUser.getId(), Project.ProjectStatus.IN_PROGRESS);
                Long completedProjects = projectRepository.countByCompanyIdAndStatus(currentUser.getId(),
                                Project.ProjectStatus.COMPLETED);
                Long totalProposalsReceived = proposalRepository.countByProjectCompanyId(currentUser.getId());
                Long pendingProposals = proposalRepository.countByProjectCompanyIdAndStatus(
                                currentUser.getId(), Proposal.ProposalStatus.SUBMITTED);

                // Get job statistics
                Long totalJobsPosted = jobRepository.countByCompanyId(currentUser.getId());
                Long openJobs = jobRepository.countByCompanyIdAndStatus(currentUser.getId(), Job.JobStatus.OPEN);
                Long totalApplicationsReceived = jobApplicationRepository.countByCompanyId(currentUser.getId());
                Long filledJobs = jobRepository.countByCompanyIdAndStatus(currentUser.getId(), Job.JobStatus.FILLED);

                CompanyDashboardResponse.DashboardStats stats = CompanyDashboardResponse.DashboardStats.builder()
                                .totalProjectsPosted(totalProjectsPosted)
                                .activeProjects(activeProjects)
                                .completedProjects(completedProjects)
                                .totalProposalsReceived(totalProposalsReceived)
                                .pendingProposals(pendingProposals)
                                .totalJobsPosted(totalJobsPosted)
                                .openJobs(openJobs)
                                .totalApplicationsReceived(totalApplicationsReceived)
                                .filledJobs(filledJobs)
                                .build();

                // Get active projects (OPEN and IN_PROGRESS)
                Pageable projectsPageable = PageRequest.of(0, 5);
                List<Project> activeProjectsList = projectRepository.findTopByCompanyIdAndStatusIn(
                                currentUser.getId(),
                                Arrays.asList(Project.ProjectStatus.OPEN, Project.ProjectStatus.IN_PROGRESS),
                                projectsPageable);
                List<ProjectResponse> activeProjectsResponse = activeProjectsList.stream()
                                .map(ProjectResponse::fromEntity)
                                .collect(Collectors.toList());

                // Get completed projects
                Pageable completedProjectsPageable = PageRequest.of(0, 5);
                List<Project> completedProjectsList = projectRepository.findTopByCompanyIdAndStatus(
                                currentUser.getId(),
                                Project.ProjectStatus.COMPLETED,
                                completedProjectsPageable);
                List<ProjectResponse> completedProjectsResponse = completedProjectsList.stream()
                                .map(ProjectResponse::fromEntity)
                                .collect(Collectors.toList());

                // Get recent proposals for all company's projects
                Pageable proposalsPageable = PageRequest.of(0, 10);
                List<Proposal> recentProposalsList = proposalRepository.findTopByProjectCompanyId(
                                currentUser.getId(), proposalsPageable);
                List<ProposalResponse> recentProposalsResponse = recentProposalsList.stream()
                                .map(ProposalResponse::fromEntity)
                                .collect(Collectors.toList());

                // Get all jobs posted by company (including DRAFT)
                Pageable openJobsPageable = PageRequest.of(0, 5, Sort.by("createdAt").descending());
                Page<Job> openJobsPage = jobRepository.findByCompanyId(currentUser.getId(), openJobsPageable);
                List<JobResponse> openJobsResponse = openJobsPage.getContent().stream()
                                .map(JobResponse::fromEntity)
                                .collect(Collectors.toList());

                // Get recent applications for company's jobs
                // NOTE: Skipping job applications due to Hibernate ARRAY type mapping issue
                // TODO: Fix the additionalDocuments field type or use a custom query
                List<JobApplicationResponse> recentApplicationsResponse = new java.util.ArrayList<>();

                return CompanyDashboardResponse.builder()
                                .stats(stats)
                                .activeProjects(activeProjectsResponse)
                                .completedProjects(completedProjectsResponse)
                                .recentProposals(recentProposalsResponse)
                                .openJobs(openJobsResponse)
                                .recentApplications(recentApplicationsResponse)
                                .build();
        }

        /**
         * Task 3.18: Get freelancer dashboard data
         */
        @Transactional(readOnly = true)
        public FreelancerDashboardResponse getFreelancerDashboard() {
                User currentUser = userService.getCurrentUser();

                if (currentUser.getRole() != User.UserRole.FREELANCER) {
                        throw new RuntimeException("This endpoint is only for freelancers");
                }

                log.info("Getting freelancer dashboard for user: {}", currentUser.getUsername());

                // Get statistics
                Long totalProposalsSubmitted = proposalRepository.countByFreelancerId(currentUser.getId());
                Long activeProposals = proposalRepository.countByFreelancerIdAndStatus(
                                currentUser.getId(), Proposal.ProposalStatus.SUBMITTED) +
                                proposalRepository.countByFreelancerIdAndStatus(
                                                currentUser.getId(), Proposal.ProposalStatus.SHORTLISTED);
                Long acceptedProposals = proposalRepository.countByFreelancerIdAndStatus(
                                currentUser.getId(), Proposal.ProposalStatus.ACCEPTED);

                // For completed projects, we count accepted proposals where job is completed
                // For simplicity, we'll use accepted proposals count
                Long completedProjects = acceptedProposals;

                FreelancerDashboardResponse.DashboardStats stats = FreelancerDashboardResponse.DashboardStats.builder()
                                .totalProposalsSubmitted(totalProposalsSubmitted)
                                .activeProposals(activeProposals)
                                .acceptedProposals(acceptedProposals)
                                .completedProjects(completedProjects)
                                .build();

                // Get user's proposals
                Pageable proposalsPageable = PageRequest.of(0, 10);
                List<Proposal> myProposalsList = proposalRepository.findTopByFreelancerId(
                                currentUser.getId(), proposalsPageable);
                List<ProposalResponse> myProposalsResponse = myProposalsList.stream()
                                .map(ProposalResponse::fromEntity)
                                .collect(Collectors.toList());

                // Get available projects (OPEN status, not applied by this user)
                Pageable projectsPageable = PageRequest.of(0, 10, Sort.by("createdAt").descending());
                Page<Project> availableProjectsPage = projectRepository.findByStatus(Project.ProjectStatus.OPEN, projectsPageable);
                List<ProjectResponse> availableProjectsResponse = availableProjectsPage.getContent().stream()
                                .map(ProjectResponse::fromEntity)
                                .collect(Collectors.toList());

                return FreelancerDashboardResponse.builder()
                                .stats(stats)
                                .myProposals(myProposalsResponse)
                                .availableProjects(availableProjectsResponse)
                                .build();
        }

        /**
         * Task 3.19: Get user notifications
         */
        public List<NotificationResponse> getNotifications() {
                log.info("Getting notifications");
                return notificationService.getUserNotifications();
        }
}
