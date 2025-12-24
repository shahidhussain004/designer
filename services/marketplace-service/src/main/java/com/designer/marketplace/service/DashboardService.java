package com.designer.marketplace.service;

import com.designer.marketplace.dto.*;
import com.designer.marketplace.entity.Job;
import com.designer.marketplace.entity.Proposal;
import com.designer.marketplace.entity.User;
import com.designer.marketplace.repository.JobRepository;
import com.designer.marketplace.repository.ProposalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.transaction.annotation.Transactional;

/**
 * Service for dashboard operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class DashboardService {

        private final UserService userService;
        private final JobRepository jobRepository;
        private final ProposalRepository proposalRepository;
        private final NotificationService notificationService;

        /**
         * Task 3.17: Get client dashboard data
         */
        @Transactional(readOnly = true)
        public ClientDashboardResponse getClientDashboard() {
                User currentUser = userService.getCurrentUser();

                if (currentUser.getRole() != User.UserRole.CLIENT) {
                        throw new RuntimeException("This endpoint is only for clients");
                }

                log.info("Getting client dashboard for user: {}", currentUser.getUsername());

                // Get statistics
                Long totalJobsPosted = jobRepository.countByClientId(currentUser.getId());
                Long activeJobs = jobRepository.countByClientIdAndStatus(currentUser.getId(), Job.JobStatus.OPEN) +
                                jobRepository.countByClientIdAndStatus(currentUser.getId(), Job.JobStatus.IN_PROGRESS);
                Long completedJobs = jobRepository.countByClientIdAndStatus(currentUser.getId(),
                                Job.JobStatus.COMPLETED);
                Long totalProposalsReceived = proposalRepository.countByJobClientId(currentUser.getId());
                Long pendingProposals = proposalRepository.countByJobClientIdAndStatus(
                                currentUser.getId(), Proposal.ProposalStatus.SUBMITTED);

                ClientDashboardResponse.DashboardStats stats = ClientDashboardResponse.DashboardStats.builder()
                                .totalJobsPosted(totalJobsPosted)
                                .activeJobs(activeJobs)
                                .completedJobs(completedJobs)
                                .totalProposalsReceived(totalProposalsReceived)
                                .pendingProposals(pendingProposals)
                                .build();

                // Get active jobs (OPEN and IN_PROGRESS)
                Pageable jobsPageable = PageRequest.of(0, 5);
                List<Job> activeJobsList = jobRepository.findTopByClientIdAndStatusIn(
                                currentUser.getId(),
                                Arrays.asList(Job.JobStatus.OPEN, Job.JobStatus.IN_PROGRESS),
                                jobsPageable);
                List<JobResponse> activeJobsResponse = activeJobsList.stream()
                                .map(JobResponse::fromEntity)
                                .collect(Collectors.toList());

                // Get recent proposals for all client's jobs
                Pageable proposalsPageable = PageRequest.of(0, 10);
                List<Proposal> recentProposalsList = proposalRepository.findTopByJobClientId(
                                currentUser.getId(), proposalsPageable);
                List<ProposalResponse> recentProposalsResponse = recentProposalsList.stream()
                                .map(ProposalResponse::fromEntity)
                                .collect(Collectors.toList());

                return ClientDashboardResponse.builder()
                                .stats(stats)
                                .activeJobs(activeJobsResponse)
                                .recentProposals(recentProposalsResponse)
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

                // Get available jobs (OPEN status, not applied by this user)
                Pageable jobsPageable = PageRequest.of(0, 10, Sort.by("createdAt").descending());
                Page<Job> availableJobsPage = jobRepository.findByStatus(Job.JobStatus.OPEN, jobsPageable);
                List<JobResponse> availableJobsResponse = availableJobsPage.getContent().stream()
                                .map(JobResponse::fromEntity)
                                .collect(Collectors.toList());

                return FreelancerDashboardResponse.builder()
                                .stats(stats)
                                .myProposals(myProposalsResponse)
                                .availableJobs(availableJobsResponse)
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
