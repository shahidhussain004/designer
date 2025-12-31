package com.designer.marketplace.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.designer.marketplace.dto.MilestoneDTOs.ApproveMilestoneRequest;
import com.designer.marketplace.dto.MilestoneDTOs.CreateMilestoneRequest;
import com.designer.marketplace.dto.MilestoneDTOs.MilestoneResponse;
import com.designer.marketplace.dto.MilestoneDTOs.MilestoneSummary;
import com.designer.marketplace.dto.MilestoneDTOs.RequestRevisionRequest;
import com.designer.marketplace.dto.MilestoneDTOs.SubmitMilestoneRequest;
import com.designer.marketplace.entity.Escrow;
import com.designer.marketplace.entity.Escrow.EscrowHoldStatus;
import com.designer.marketplace.entity.Escrow.ReleaseCondition;
import com.designer.marketplace.entity.Milestone;
import com.designer.marketplace.entity.Milestone.MilestoneStatus;
import com.designer.marketplace.entity.Payment;
import com.designer.marketplace.entity.Payment.EscrowStatus;
import com.designer.marketplace.entity.Payment.PaymentStatus;
import com.designer.marketplace.entity.Project;
import com.designer.marketplace.entity.Proposal;
import com.designer.marketplace.entity.TransactionLedger;
import com.designer.marketplace.entity.TransactionLedger.TransactionType;
import com.designer.marketplace.entity.User;
import com.designer.marketplace.repository.EscrowRepository;
import com.designer.marketplace.repository.MilestoneRepository;
import com.designer.marketplace.repository.PaymentRepository;
import com.designer.marketplace.repository.ProjectRepository;
import com.designer.marketplace.repository.ProposalRepository;
import com.designer.marketplace.repository.TransactionLedgerRepository;
import com.designer.marketplace.repository.UserRepository;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for managing milestone-based payments.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;
    private final ProjectRepository projectRepository;
    private final ProposalRepository proposalRepository;
    private final PaymentRepository paymentRepository;
    private final EscrowRepository escrowRepository;
    private final TransactionLedgerRepository transactionLedgerRepository;
    private final UserRepository userRepository;

    @Value("${payment.platform.fee.percent:10}")
    private int platformFeePercent;

    /**
     * Create milestones for a project.
     */
    @Transactional
    public List<MilestoneResponse> createMilestones(Long userId, List<CreateMilestoneRequest> requests) {
        if (requests.isEmpty()) {
            throw new IllegalArgumentException("At least one milestone is required");
        }

        Long projectId = requests.get(0).getProjectId();
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        // Verify user is the client
        if (!project.getClient().getId().equals(userId)) {
            throw new IllegalArgumentException("Only the project client can create milestones");
        }

        // Check if milestones already exist
        if (milestoneRepository.countByProjectId(projectId) > 0) {
            throw new IllegalStateException("Milestones already exist for this project");
        }

        List<Milestone> milestones = requests.stream().map(request -> {
            Proposal proposal = request.getProposalId() != null
                    ? proposalRepository.findById(request.getProposalId()).orElse(null)
                    : null;

            return Milestone.builder()
                    .project(project)
                    .proposal(proposal)
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .sequenceOrder(request.getSequenceOrder())
                    .amount(request.getAmount())
                    .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                    .dueDate(request.getDueDate())
                    .deliverables(request.getDeliverables())
                    .status(MilestoneStatus.PENDING)
                    .build();
        }).collect(Collectors.toList());

        List<Milestone> saved = milestoneRepository.saveAll(milestones);
        log.info("Created {} milestones for project {}", saved.size(), projectId);

        return saved.stream()
                .map(MilestoneResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Fund a milestone (create payment and hold in escrow).
     */
    @Transactional
    public MilestoneResponse fundMilestone(Long milestoneId, Long clientId) {
        log.info("Funding milestone {} by client {}", milestoneId, clientId);

        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new IllegalArgumentException("Milestone not found"));

        // Verify client owns the job
        if (!milestone.getJob().getClient().getId().equals(clientId)) {
            throw new IllegalArgumentException("Only the job client can fund milestones");
        }

        if (milestone.getStatus() != MilestoneStatus.PENDING) {
            throw new IllegalStateException("Milestone is not in PENDING status");
        }

        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Client not found"));

        User freelancer = milestone.getProposal() != null
                ? milestone.getProposal().getFreelancer()
                : null;

        if (freelancer == null) {
            throw new IllegalStateException("No freelancer assigned to this milestone");
        }

        try {
            // Calculate fees
            Long amount = milestone.getAmount();
            Long platformFee = (amount * platformFeePercent) / 100;
            Long freelancerAmount = amount - platformFee;

            // Create Stripe PaymentIntent
            Map<String, String> metadata = new HashMap<>();
            metadata.put("milestone_id", milestone.getId().toString());
            metadata.put("job_id", milestone.getJob().getId().toString());
            metadata.put("client_id", client.getId().toString());
            metadata.put("freelancer_id", freelancer.getId().toString());

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amount)
                    .setCurrency(milestone.getCurrency().toLowerCase())
                    .setDescription("Milestone: " + milestone.getTitle())
                    .putAllMetadata(metadata)
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build())
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            // Create payment record
            Payment payment = Payment.builder()
                    .paymentIntentId(paymentIntent.getId())
                    .client(client)
                    .freelancer(freelancer)
                    .job(milestone.getJob())
                    .proposal(milestone.getProposal())
                    .amount(amount)
                    .platformFee(platformFee)
                    .freelancerAmount(freelancerAmount)
                    .currency(milestone.getCurrency())
                    .status(PaymentStatus.SUCCEEDED) // For simplicity, assume immediate success
                    .escrowStatus(EscrowStatus.HELD)
                    .paidAt(LocalDateTime.now())
                    .build();

            payment = paymentRepository.save(payment);

            // Create escrow record
            Escrow escrow = Escrow.builder()
                    .payment(payment)
                    .job(milestone.getJob())
                    .amount(freelancerAmount)
                    .currency(milestone.getCurrency())
                    .status(EscrowHoldStatus.HELD)
                    .releaseCondition(ReleaseCondition.MILESTONE_COMPLETED)
                    .autoReleaseDate(milestone.getDueDate() != null
                            ? milestone.getDueDate().plusDays(7)
                            : LocalDateTime.now().plusDays(30))
                    .build();

            escrow = escrowRepository.save(escrow);

            // Update milestone
            milestone.setPayment(payment);
            milestone.setEscrow(escrow);
            milestone.setStatus(MilestoneStatus.FUNDED);
            milestoneRepository.save(milestone);

            // Create ledger entries
            createLedgerEntry(payment, escrow, client, TransactionType.ESCROW_HOLD,
                    freelancerAmount, "Milestone funded: " + milestone.getTitle());

            log.info("Milestone {} funded with payment {}", milestoneId, payment.getId());
            return MilestoneResponse.fromEntity(milestone);

        } catch (StripeException e) {
            log.error("Stripe error funding milestone: {}", e.getMessage());
            throw new RuntimeException("Failed to fund milestone: " + e.getMessage());
        }
    }

    /**
     * Start working on a milestone.
     */
    @Transactional
    public MilestoneResponse startMilestone(Long milestoneId, Long freelancerId) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new IllegalArgumentException("Milestone not found"));

        // Verify freelancer is assigned
        if (milestone.getProposal() == null ||
                !milestone.getProposal().getFreelancer().getId().equals(freelancerId)) {
            throw new IllegalArgumentException("You are not assigned to this milestone");
        }

        if (milestone.getStatus() != MilestoneStatus.FUNDED) {
            throw new IllegalStateException("Milestone must be funded before starting");
        }

        milestone.setStatus(MilestoneStatus.IN_PROGRESS);
        milestone.setStartedAt(LocalDateTime.now());
        milestoneRepository.save(milestone);

        log.info("Milestone {} started by freelancer {}", milestoneId, freelancerId);
        return MilestoneResponse.fromEntity(milestone);
    }

    /**
     * Submit milestone deliverables for review.
     */
    @Transactional
    public MilestoneResponse submitMilestone(Long milestoneId, Long freelancerId,
            SubmitMilestoneRequest request) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new IllegalArgumentException("Milestone not found"));

        if (milestone.getProposal() == null ||
                !milestone.getProposal().getFreelancer().getId().equals(freelancerId)) {
            throw new IllegalArgumentException("You are not assigned to this milestone");
        }

        if (milestone.getStatus() != MilestoneStatus.IN_PROGRESS &&
                milestone.getStatus() != MilestoneStatus.REVISION_REQUESTED) {
            throw new IllegalStateException("Milestone is not in a submittable state");
        }

        milestone.setDeliverables(request.getDeliverables());
        milestone.setStatus(MilestoneStatus.SUBMITTED);
        milestone.setSubmittedAt(LocalDateTime.now());
        milestoneRepository.save(milestone);

        log.info("Milestone {} submitted for review", milestoneId);
        return MilestoneResponse.fromEntity(milestone);
    }

    /**
     * Approve milestone and release escrow.
     */
    @Transactional
    public MilestoneResponse approveMilestone(Long milestoneId, Long clientId,
            ApproveMilestoneRequest request) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new IllegalArgumentException("Milestone not found"));

        if (!milestone.getJob().getClient().getId().equals(clientId)) {
            throw new IllegalArgumentException("Only the job client can approve milestones");
        }

        if (milestone.getStatus() != MilestoneStatus.SUBMITTED) {
            throw new IllegalStateException("Milestone is not submitted for approval");
        }

        // Release escrow
        Escrow escrow = milestone.getEscrow();
        if (escrow != null) {
            escrow.setStatus(EscrowHoldStatus.RELEASED);
            escrow.setReleasedAt(LocalDateTime.now());
            escrowRepository.save(escrow);

            Payment payment = milestone.getPayment();
            if (payment != null) {
                payment.setEscrowStatus(EscrowStatus.RELEASED);
                payment.setReleasedAt(LocalDateTime.now());
                paymentRepository.save(payment);

                // Create ledger entry
                createLedgerEntry(payment, escrow, milestone.getProposal().getFreelancer(),
                        TransactionType.ESCROW_RELEASE, payment.getFreelancerAmount(),
                        "Milestone approved: " + milestone.getTitle());
            }
        }

        milestone.setStatus(MilestoneStatus.APPROVED);
        milestone.setApprovedAt(LocalDateTime.now());
        milestoneRepository.save(milestone);

        log.info("Milestone {} approved by client {}", milestoneId, clientId);
        return MilestoneResponse.fromEntity(milestone);
    }

    /**
     * Request revision for a milestone.
     */
    @Transactional
    public MilestoneResponse requestRevision(Long milestoneId, Long clientId,
            RequestRevisionRequest request) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new IllegalArgumentException("Milestone not found"));

        if (!milestone.getJob().getClient().getId().equals(clientId)) {
            throw new IllegalArgumentException("Only the job client can request revisions");
        }

        if (milestone.getStatus() != MilestoneStatus.SUBMITTED) {
            throw new IllegalStateException("Milestone is not submitted for review");
        }

        milestone.setStatus(MilestoneStatus.REVISION_REQUESTED);
        milestone.setRevisionNotes(request.getRevisionNotes());
        milestoneRepository.save(milestone);

        log.info("Revision requested for milestone {}", milestoneId);
        return MilestoneResponse.fromEntity(milestone);
    }

    /**
     * Get milestones for a job.
     */
    @Transactional(readOnly = true)
    public List<MilestoneResponse> getMilestonesByJobId(Long jobId) {
        return milestoneRepository.findByJobIdOrderBySequenceOrderAsc(jobId)
                .stream()
                .map(MilestoneResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Get milestone summary for a job.
     */
    @Transactional(readOnly = true)
    public MilestoneSummary getMilestoneSummary(Long jobId) {
        List<Milestone> milestones = milestoneRepository.findByJobIdOrderBySequenceOrderAsc(jobId);

        int total = milestones.size();
        int completed = (int) milestones.stream()
                .filter(m -> m.getStatus() == MilestoneStatus.APPROVED)
                .count();
        int pending = (int) milestones.stream()
                .filter(m -> m.getStatus() == MilestoneStatus.PENDING)
                .count();
        int inProgress = (int) milestones.stream()
                .filter(m -> m.getStatus() == MilestoneStatus.IN_PROGRESS ||
                        m.getStatus() == MilestoneStatus.SUBMITTED ||
                        m.getStatus() == MilestoneStatus.REVISION_REQUESTED)
                .count();

        Long totalAmount = milestones.stream()
                .mapToLong(Milestone::getAmount)
                .sum();

        Long fundedAmount = milestones.stream()
                .filter(m -> m.getStatus() != MilestoneStatus.PENDING &&
                        m.getStatus() != MilestoneStatus.CANCELLED)
                .mapToLong(Milestone::getAmount)
                .sum();

        Long releasedAmount = milestones.stream()
                .filter(m -> m.getStatus() == MilestoneStatus.APPROVED)
                .mapToLong(Milestone::getAmount)
                .sum();

        double progressPercentage = total > 0 ? (completed * 100.0) / total : 0;

        return MilestoneSummary.builder()
                .jobId(jobId)
                .totalMilestones(total)
                .completedMilestones(completed)
                .pendingMilestones(pending)
                .inProgressMilestones(inProgress)
                .totalAmount(totalAmount)
                .fundedAmount(fundedAmount)
                .releasedAmount(releasedAmount)
                .progressPercentage(progressPercentage)
                .build();
    }

    /**
     * Get milestones for a client.
     */
    @Transactional(readOnly = true)
    public Page<MilestoneResponse> getMilestonesByClientId(Long clientId, Pageable pageable) {
        return milestoneRepository.findByClientId(clientId, pageable)
                .map(MilestoneResponse::fromEntity);
    }

    /**
     * Get milestones for a freelancer.
     */
    @Transactional(readOnly = true)
    public Page<MilestoneResponse> getMilestonesByFreelancerId(Long freelancerId, Pageable pageable) {
        return milestoneRepository.findByFreelancerId(freelancerId, pageable)
                .map(MilestoneResponse::fromEntity);
    }

    private void createLedgerEntry(Payment payment, Escrow escrow, User user,
            TransactionType type, Long amount, String description) {
        TransactionLedger entry = TransactionLedger.builder()
                .transactionType(type)
                .payment(payment)
                .escrow(escrow)
                .user(user)
                .amount(amount)
                .currency(payment.getCurrency())
                .description(description)
                .referenceId(payment.getPaymentIntentId())
                .build();

        transactionLedgerRepository.save(entry);
    }
}
