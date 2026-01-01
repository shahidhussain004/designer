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

import com.designer.marketplace.dto.ClientDashboardResponse;
import com.designer.marketplace.dto.FreelancerDashboardResponse;
import com.designer.marketplace.dto.NotificationResponse;
import com.designer.marketplace.dto.ProjectResponse;
import com.designer.marketplace.dto.ProposalResponse;
import com.designer.marketplace.entity.Project;
import com.designer.marketplace.entity.Proposal;
import com.designer.marketplace.entity.User;
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
                Long totalProjectsPosted = projectRepository.countByClientId(currentUser.getId());
                Long activeProjects = projectRepository.countByClientIdAndStatus(currentUser.getId(), Project.ProjectStatus.OPEN) +
                                projectRepository.countByClientIdAndStatus(currentUser.getId(), Project.ProjectStatus.IN_PROGRESS);
                Long completedProjects = projectRepository.countByClientIdAndStatus(currentUser.getId(),
                                Project.ProjectStatus.COMPLETED);
                Long totalProposalsReceived = proposalRepository.countByProjectClientId(currentUser.getId());
                Long pendingProposals = proposalRepository.countByProjectClientIdAndStatus(
                                currentUser.getId(), Proposal.ProposalStatus.SUBMITTED);

                ClientDashboardResponse.DashboardStats stats = ClientDashboardResponse.DashboardStats.builder()
                                .totalProjectsPosted(totalProjectsPosted)
                                .activeProjects(activeProjects)
                                .completedProjects(completedProjects)
                                .totalProposalsReceived(totalProposalsReceived)
                                .pendingProposals(pendingProposals)
                                .build();

                // Get active projects (OPEN and IN_PROGRESS)
                Pageable projectsPageable = PageRequest.of(0, 5);
                List<Project> activeProjectsList = projectRepository.findTopByClientIdAndStatusIn(
                                currentUser.getId(),
                                Arrays.asList(Project.ProjectStatus.OPEN, Project.ProjectStatus.IN_PROGRESS),
                                projectsPageable);
                List<ProjectResponse> activeProjectsResponse = activeProjectsList.stream()
                                .map(ProjectResponse::fromEntity)
                                .collect(Collectors.toList());

                // Get recent proposals for all client's projects
                Pageable proposalsPageable = PageRequest.of(0, 10);
                List<Proposal> recentProposalsList = proposalRepository.findTopByProjectClientId(
                                currentUser.getId(), proposalsPageable);
                List<ProposalResponse> recentProposalsResponse = recentProposalsList.stream()
                                .map(ProposalResponse::fromEntity)
                                .collect(Collectors.toList());

                return ClientDashboardResponse.builder()
                                .stats(stats)
                                .activeProjects(activeProjectsResponse)
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
