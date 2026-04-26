package com.designer.marketplace.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.designer.marketplace.dto.CreateProposalRequest;
import com.designer.marketplace.dto.ProposalResponse;
import com.designer.marketplace.dto.UpdateProposalStatusRequest;
import com.designer.marketplace.entity.Freelancer;
import com.designer.marketplace.entity.Notification;
import com.designer.marketplace.entity.Project;
import com.designer.marketplace.entity.Proposal;
import com.designer.marketplace.entity.User;
import com.designer.marketplace.repository.FreelancerRepository;
import com.designer.marketplace.repository.ProjectRepository;
import com.designer.marketplace.repository.ProposalRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for proposal management operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProposalService {

    private final ProposalRepository proposalRepository;
    private final ProjectRepository projectRepository;
    private final UserService userService;
    private final NotificationService notificationService;
    private final FreelancerRepository freelancerRepository;

    /**
     * Task 3.12: Get user's proposals
     */
    public Page<ProposalResponse> getUserProposals(Pageable pageable) {
        User currentUser = userService.getCurrentUser();
        log.info("Getting proposals for user: {}", currentUser.getUsername());

        // Get freelancer profile to use proper freelancer ID
        Freelancer freelancer = freelancerRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found for user: " + currentUser.getUsername()));

        Page<Proposal> proposals = proposalRepository.findByFreelancerId(freelancer.getId(), pageable);
        return proposals.map(ProposalResponse::fromEntity);
    }

    /**
     * Task 3.13: Get proposals for a project
     */
    public Page<ProposalResponse> getProjectProposals(Long projectId, Pageable pageable) {
        log.info("Getting proposals for project: {}", projectId);

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        // Check if current user is the project owner
        User currentUser = userService.getCurrentUser();
        if (!project.getCompany().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only view proposals for your own projects");
        }

        Page<Proposal> proposals = proposalRepository.findByProjectId(projectId, pageable);
        return proposals.map(ProposalResponse::fromEntity);
    }

    /**
     * Task 3.14: Submit proposal (freelancers only)
     */
    @Transactional
    public ProposalResponse createProposal(CreateProposalRequest request) {
        User currentUser = userService.getCurrentUser();

        // Validate user is a freelancer
        if (currentUser.getRole() != User.UserRole.FREELANCER) {
            throw new RuntimeException("Only freelancers can submit proposals");
        }

        log.info("Creating proposal for project: {} by user: {}", request.getProjectId(), currentUser.getUsername());

        // Check if project exists
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + request.getProjectId()));

        // Validate project is open
        if (project.getStatus() != Project.ProjectStatus.OPEN) {
            throw new RuntimeException("Cannot submit proposal to a closed project");
        }

        // Get freelancer profile first
        Freelancer freelancer = freelancerRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("Freelancer profile not found for user: " + currentUser.getUsername()));

        log.info("Freelancer found: id={}, userId={}", freelancer.getId(), currentUser.getId());

        // Task 3.16: Business rule - one proposal per project+freelancer
        if (proposalRepository.existsByProjectIdAndFreelancerId(request.getProjectId(), freelancer.getId())) {
            throw new RuntimeException("You have already submitted a proposal for this project");
        }

        Proposal proposal = new Proposal();
        proposal.setProject(project);
        proposal.setFreelancer(freelancer);
        proposal.setCoverLetter(request.getCoverLetter());
        
        // Convert proposed rate (dollars) to cents for storage
        if (request.getProposedRate() != null && request.getProposedRate() > 0) {
            proposal.setSuggestedBudgetCents((long)(request.getProposedRate() * 100));
        }
        
        // Convert estimated duration (days) to hours for storage
        if (request.getEstimatedDuration() != null && request.getEstimatedDuration() > 0) {
            proposal.setEstimatedHours(java.math.BigDecimal.valueOf(request.getEstimatedDuration()));
        }
        
        proposal.setStatus(Proposal.ProposalStatus.SUBMITTED);

        log.info("Saving proposal: projectId={}, freelancerId={}", proposal.getProject().getId(), proposal.getFreelancer().getId());
        Proposal savedProposal = proposalRepository.save(proposal);
        log.info("Proposal saved with id: {}. Database trigger will handle proposal_count increment.", savedProposal.getId());

        // NOTE: Database trigger (trg_increment_project_proposal_count) automatically increments project.proposal_count
        // No manual increment needed - this is handled by: CREATE TRIGGER trg_increment_project_proposal_count
        // See V8__create_proposals_table.sql for trigger definition

        // Create notification for project owner - ensure company is not null
        try {
            if (project.getCompany() != null) {
                notificationService.createNotification(
                        project.getCompany(),
                        Notification.NotificationType.PROPOSAL_RECEIVED,
                        "New Proposal Received",
                        String.format("%s submitted a proposal for your project: %s",
                                currentUser.getFullName(), project.getTitle()),
                        "PROPOSAL",
                        savedProposal.getId());
                log.info("Notification created for project owner");
            } else {
                log.warn("Project company is null for projectId: {}", project.getId());
            }
        } catch (Exception e) {
            log.error("Failed to create notification for proposal: {}", savedProposal.getId(), e);
            // Don't re-throw - notification failure shouldn't block proposal creation
        }

        log.info("Proposal created successfully with id: {}", savedProposal.getId());

        return ProposalResponse.fromEntity(savedProposal);
    }

    /**
     * Task 3.15: Update proposal status (shortlist/hire, job owner only)
     */
    @Transactional
    public ProposalResponse updateProposalStatus(Long proposalId, UpdateProposalStatusRequest request) {
        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found with id: " + proposalId));

        User currentUser = userService.getCurrentUser();

        // Check if current user is the project owner
        if (!proposal.getProject().getCompany().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Only the project owner can update proposal status");
        }

        log.info("Updating proposal status: {} to: {}", proposalId, request.getStatus());

        // Update status
        Proposal.ProposalStatus newStatus = Proposal.ProposalStatus.valueOf(request.getStatus().toUpperCase());
        proposal.setStatus(newStatus);

        if (request.getCompanyMessage() != null) {
            proposal.setCompanyNotes(request.getCompanyMessage());
        }

        // If accepting a proposal, mark project as in progress
        if (newStatus == Proposal.ProposalStatus.ACCEPTED) {
            Project project = proposal.getProject();
            project.setStatus(Project.ProjectStatus.IN_PROGRESS);
            projectRepository.save(project);
            log.info("Project {} marked as IN_PROGRESS", project.getId());

            // Notify freelancer
            notificationService.createNotification(
                    proposal.getFreelancer(),
                    Notification.NotificationType.PROPOSAL_ACCEPTED,
                    "Proposal Accepted!",
                    String.format("Your proposal for '%s' has been accepted!", project.getTitle()),
                    "PROPOSAL",
                    proposalId);
        } else if (newStatus == Proposal.ProposalStatus.REJECTED) {
            // Notify freelancer
            notificationService.createNotification(
                    proposal.getFreelancer(),
                    Notification.NotificationType.PROPOSAL_REJECTED,
                    "Proposal Update",
                    String.format("Your proposal for '%s' status has been updated", proposal.getProject().getTitle()),
                    "PROPOSAL",
                    proposalId);
        }

        Proposal updatedProposal = proposalRepository.save(proposal);
        log.info("Proposal status updated: {}", updatedProposal.getId());

        return ProposalResponse.fromEntity(updatedProposal);
    }

    /**
     * Get proposal by ID
     */
    public ProposalResponse getProposalById(Long id) {
        Proposal proposal = proposalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proposal not found with id: " + id));
        return ProposalResponse.fromEntity(proposal);
    }

    /**
     * Check if user is owner of the proposal
     */
    @Transactional(readOnly = true)
    public boolean isProposalOwner(Long proposalId) {
        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found with id: " + proposalId));
        User currentUser = userService.getCurrentUser();
        return proposal.getFreelancer().getId().equals(currentUser.getId());
    }

    /**
     * Check if user is owner of the project associated with the proposal
     */
    @Transactional(readOnly = true)
    public boolean isProjectOwnerForProposal(Long proposalId) {
        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found with id: " + proposalId));
        User currentUser = userService.getCurrentUser();
        return proposal.getProject().getCompany().getId().equals(currentUser.getId());
    }

    /**
     * Accept a proposal (convenience method)
     */
    @Transactional
    public ProposalResponse acceptProposal(Long proposalId) {
        UpdateProposalStatusRequest request = new UpdateProposalStatusRequest();
        request.setStatus("ACCEPTED");
        return updateProposalStatus(proposalId, request);
    }

    /**
     * Reject a proposal (convenience method)
     */
    @Transactional
    public ProposalResponse rejectProposal(Long proposalId) {
        UpdateProposalStatusRequest request = new UpdateProposalStatusRequest();
        request.setStatus("REJECTED");
        return updateProposalStatus(proposalId, request);
    }
}
