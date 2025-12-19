package com.designer.marketplace.service;

import com.designer.marketplace.dto.CreateProposalRequest;
import com.designer.marketplace.dto.ProposalResponse;
import com.designer.marketplace.dto.UpdateProposalStatusRequest;
import com.designer.marketplace.entity.Job;
import com.designer.marketplace.entity.Notification;
import com.designer.marketplace.entity.Proposal;
import com.designer.marketplace.entity.User;
import com.designer.marketplace.repository.JobRepository;
import com.designer.marketplace.repository.ProposalRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for proposal management operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ProposalService {

    private final ProposalRepository proposalRepository;
    private final JobRepository jobRepository;
    private final UserService userService;
    private final NotificationService notificationService;

    /**
     * Task 3.12: Get user's proposals
     */
    public Page<ProposalResponse> getUserProposals(Pageable pageable) {
        User currentUser = userService.getCurrentUser();
        log.info("Getting proposals for user: {}", currentUser.getUsername());

        Page<Proposal> proposals = proposalRepository.findByFreelancerId(currentUser.getId(), pageable);
        return proposals.map(ProposalResponse::fromEntity);
    }

    /**
     * Task 3.13: Get proposals for a job
     */
    public Page<ProposalResponse> getJobProposals(Long jobId, Pageable pageable) {
        log.info("Getting proposals for job: {}", jobId);

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + jobId));

        // Check if current user is the job owner
        User currentUser = userService.getCurrentUser();
        if (!job.getClient().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only view proposals for your own jobs");
        }

        Page<Proposal> proposals = proposalRepository.findByJobId(jobId, pageable);
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

        log.info("Creating proposal for job: {} by user: {}", request.getJobId(), currentUser.getUsername());

        // Check if job exists
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found with id: " + request.getJobId()));

        // Validate job is open
        if (job.getStatus() != Job.JobStatus.OPEN) {
            throw new RuntimeException("Cannot submit proposal to a closed job");
        }

        // Task 3.16: Business rule - one proposal per job+freelancer
        if (proposalRepository.existsByJobIdAndFreelancerId(request.getJobId(), currentUser.getId())) {
            throw new RuntimeException("You have already submitted a proposal for this job");
        }

        Proposal proposal = new Proposal();
        proposal.setJob(job);
        proposal.setFreelancer(currentUser);
        proposal.setCoverLetter(request.getCoverLetter());
        proposal.setProposedRate(request.getProposedRate());
        proposal.setEstimatedDuration(request.getEstimatedDuration());
        proposal.setStatus(Proposal.ProposalStatus.SUBMITTED);

        Proposal savedProposal = proposalRepository.save(proposal);

        // Update job proposal count
        job.setProposalCount(job.getProposalCount() + 1);
        jobRepository.save(job);

        // Create notification for job owner
        notificationService.createNotification(
                job.getClient(),
                Notification.NotificationType.PROPOSAL_RECEIVED,
                "New Proposal Received",
                String.format("%s submitted a proposal for your job: %s",
                        currentUser.getFullName(), job.getTitle()),
                "PROPOSAL",
                savedProposal.getId());

        log.info("Proposal created with id: {}", savedProposal.getId());

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

        // Check if current user is the job owner
        if (!proposal.getJob().getClient().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Only the job owner can update proposal status");
        }

        log.info("Updating proposal status: {} to: {}", proposalId, request.getStatus());

        // Update status
        Proposal.ProposalStatus newStatus = Proposal.ProposalStatus.valueOf(request.getStatus().toUpperCase());
        proposal.setStatus(newStatus);

        if (request.getClientMessage() != null) {
            proposal.setClientMessage(request.getClientMessage());
        }

        // If accepting a proposal, mark job as in progress
        if (newStatus == Proposal.ProposalStatus.ACCEPTED) {
            Job job = proposal.getJob();
            job.setStatus(Job.JobStatus.IN_PROGRESS);
            jobRepository.save(job);
            log.info("Job {} marked as IN_PROGRESS", job.getId());

            // Notify freelancer
            notificationService.createNotification(
                    proposal.getFreelancer(),
                    Notification.NotificationType.PROPOSAL_ACCEPTED,
                    "Proposal Accepted!",
                    String.format("Your proposal for '%s' has been accepted!", job.getTitle()),
                    "PROPOSAL",
                    proposalId);
        } else if (newStatus == Proposal.ProposalStatus.REJECTED) {
            // Notify freelancer
            notificationService.createNotification(
                    proposal.getFreelancer(),
                    Notification.NotificationType.PROPOSAL_REJECTED,
                    "Proposal Update",
                    String.format("Your proposal for '%s' status has been updated", proposal.getJob().getTitle()),
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
    public boolean isProposalOwner(Long proposalId) {
        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found with id: " + proposalId));
        User currentUser = userService.getCurrentUser();
        return proposal.getFreelancer().getId().equals(currentUser.getId());
    }

    /**
     * Check if user is owner of the job associated with the proposal
     */
    public boolean isJobOwnerForProposal(Long proposalId) {
        Proposal proposal = proposalRepository.findById(proposalId)
                .orElseThrow(() -> new RuntimeException("Proposal not found with id: " + proposalId));
        User currentUser = userService.getCurrentUser();
        return proposal.getJob().getClient().getId().equals(currentUser.getId());
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
