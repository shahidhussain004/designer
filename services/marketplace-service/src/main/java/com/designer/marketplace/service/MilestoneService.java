package com.designer.marketplace.service;

import java.time.LocalDateTime;
import java.util.List;
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
import com.designer.marketplace.entity.Company;
import com.designer.marketplace.entity.Contract;
import com.designer.marketplace.entity.Escrow;
import com.designer.marketplace.entity.Escrow.EscrowHoldStatus;
import com.designer.marketplace.entity.Freelancer;
import com.designer.marketplace.entity.Milestone;
import com.designer.marketplace.entity.Milestone.MilestoneStatus;
import com.designer.marketplace.entity.Payment;
import com.designer.marketplace.entity.Project;
import com.designer.marketplace.entity.TransactionLedger.TransactionType;
import com.designer.marketplace.entity.User;
import com.designer.marketplace.repository.CompanyRepository;
import com.designer.marketplace.repository.ContractRepository;
import com.designer.marketplace.repository.EscrowRepository;
import com.designer.marketplace.repository.FreelancerRepository;
import com.designer.marketplace.repository.MilestoneRepository;
import com.designer.marketplace.repository.PaymentRepository;
import com.designer.marketplace.repository.ProjectRepository;
import com.designer.marketplace.repository.TransactionLedgerRepository;
import com.designer.marketplace.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for managing milestone-based payments.
 * Handles creation, funding, submission, and approval of milestones within contracts.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class MilestoneService {

    private final MilestoneRepository milestoneRepository;
    private final ContractRepository contractRepository;
    private final PaymentRepository paymentRepository;
    private final EscrowRepository escrowRepository;
    private final TransactionLedgerRepository transactionLedgerRepository;
    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final FreelancerRepository freelancerRepository;
    private final ProjectRepository projectRepository;

    @Value("${payment.platform.fee.percent:10}")
    private int platformFeePercent;

    /**
     * Create milestones for a contract.
     */
    @Transactional
    public List<MilestoneResponse> createMilestones(Long userId, List<CreateMilestoneRequest> requests) {
        if (requests.isEmpty()) {
            throw new IllegalArgumentException("At least one milestone is required");
        }

        Long projectId = requests.get(0).getProjectId();
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));
        
        List<Contract> contracts = contractRepository.findByProjectId(projectId);
        Contract contract = contracts.stream().findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Contract not found for project"));

        // Verify user is the company
        Company company = companyRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found for user"));
        
        if (!contract.getProject().getCompany().getId().equals(company.getId())) {
            throw new IllegalArgumentException("Only the contract company can create milestones");
        }

        // Check if milestones already exist
        if (milestoneRepository.countByContractId(contract.getId()) > 0) {
            throw new IllegalStateException("Milestones already exist for this contract");
        }

        List<Milestone> milestones = requests.stream().map(request -> {
            return Milestone.builder()
                    .contract(contract)
                    .title(request.getTitle())
                    .description(request.getDescription())
                    .sequenceOrder(request.getSequenceOrder())
                    .amountCents(request.getAmount())
                    .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                    .dueDate(request.getDueDate())
                    .deliverables(request.getDeliverables())
                    .status(MilestoneStatus.PENDING)
                    .build();
        }).collect(Collectors.toList());

        List<Milestone> saved = milestoneRepository.saveAll(milestones);
        log.info("Created {} milestones for contract {}", saved.size(), contract.getId());

        return saved.stream()
                .map(MilestoneResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Fund a milestone (create payment and hold in escrow).
     */
    @Transactional
    public MilestoneResponse fundMilestone(Long milestoneId, Long companyId) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));
        
        if (!milestone.getContract().getProject().getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Only the contract company can fund milestones");
        }

        // Create payment and escrow
        Payment payment = Payment.builder()
                .company(milestone.getContract().getProject().getCompany())
                .freelancer(milestone.getContract().getFreelancer())
                .amountCents(milestone.getAmountCents())
                .currency(milestone.getCurrency())
                .status(Payment.PaymentStatus.PENDING)
                .build();

        Payment savedPayment = paymentRepository.save(payment);
        
        Escrow escrow = Escrow.builder()
                .payment(savedPayment)
                .project(milestone.getContract().getProject())
                .amount(milestone.getAmountCents())
                .status(EscrowHoldStatus.HELD)
                .build();

        escrowRepository.save(escrow);
        
        milestone.setPayment(savedPayment);
        milestone.setStatus(MilestoneStatus.FUNDED);
        
        Milestone updated = milestoneRepository.save(milestone);
        log.info("Milestone {} funded with payment {}", milestoneId, savedPayment.getId());
        
        return MilestoneResponse.fromEntity(updated);
    }

    @Transactional
    public MilestoneResponse startMilestone(Long milestoneId, Long freelancerId) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));
        
        if (!milestone.getContract().getFreelancer().getId().equals(freelancerId)) {
            throw new IllegalArgumentException("Only the contract freelancer can start milestones");
        }

        milestone.setStatus(MilestoneStatus.IN_PROGRESS);
        milestone.setStartedAt(LocalDateTime.now());
        
        Milestone updated = milestoneRepository.save(milestone);
        log.info("Milestone {} started", milestoneId);
        
        return MilestoneResponse.fromEntity(updated);
    }

    @Transactional
    public MilestoneResponse submitMilestone(Long milestoneId, Long freelancerId,
            SubmitMilestoneRequest request) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));
        
        if (!milestone.getContract().getFreelancer().getId().equals(freelancerId)) {
            throw new IllegalArgumentException("Only the contract freelancer can submit milestones");
        }

        milestone.setStatus(MilestoneStatus.SUBMITTED);
        milestone.setSubmittedAt(LocalDateTime.now());
        milestone.setDeliverables(request.getDeliverables());
        
        Milestone updated = milestoneRepository.save(milestone);
        log.info("Milestone {} submitted", milestoneId);
        
        return MilestoneResponse.fromEntity(updated);
    }

    @Transactional
    public MilestoneResponse approveMilestone(Long milestoneId, Long companyId,
            ApproveMilestoneRequest request) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));
        
        if (!milestone.getContract().getProject().getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Only the contract company can approve milestones");
        }

        milestone.setStatus(MilestoneStatus.APPROVED);
        milestone.setApprovedAt(LocalDateTime.now());
        
        Milestone updated = milestoneRepository.save(milestone);
        log.info("Milestone {} approved", milestoneId);
        
        return MilestoneResponse.fromEntity(updated);
    }

    @Transactional
    public MilestoneResponse requestRevision(Long milestoneId, Long companyId,
            RequestRevisionRequest request) {
        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new RuntimeException("Milestone not found"));
        
        if (!milestone.getContract().getProject().getCompany().getId().equals(companyId)) {
            throw new IllegalArgumentException("Only the contract company can request revisions");
        }

        milestone.setStatus(MilestoneStatus.REVISION_REQUESTED);
        milestone.setRevisionNotes(request.getRevisionNotes());
        
        Milestone updated = milestoneRepository.save(milestone);
        log.info("Revision requested for milestone {}", milestoneId);
        
        return MilestoneResponse.fromEntity(updated);
    }

    @Transactional(readOnly = true)
    public List<MilestoneResponse> getMilestonesByContractId(Long contractId) {
        return milestoneRepository.findByContractIdOrderBySequenceOrder(contractId).stream()
                .map(MilestoneResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MilestoneSummary getMilestoneSummary(Long contractId) {
        List<Milestone> milestones = milestoneRepository.findByContractIdOrderBySequenceOrder(contractId);
        
        long totalAmount = milestones.stream().mapToLong(Milestone::getAmountCents).sum();
        long completedAmount = milestones.stream()
                .filter(m -> m.getStatus() == MilestoneStatus.APPROVED)
                .mapToLong(Milestone::getAmountCents)
                .sum();
        
        long fundedAmount = milestones.stream()
                .filter(m -> m.getStatus() == MilestoneStatus.FUNDED)
                .mapToLong(Milestone::getAmountCents)
                .sum();
        
        int completed = (int) milestones.stream().filter(m -> m.getStatus() == MilestoneStatus.APPROVED).count();
        int inProgress = (int) milestones.stream().filter(m -> m.getStatus() == MilestoneStatus.IN_PROGRESS).count();
        int pending = (int) milestones.stream().filter(m -> m.getStatus() == MilestoneStatus.PENDING).count();
        
        double progressPercentage = totalAmount > 0 ? (double) (completedAmount * 100) / totalAmount : 0.0;
        
        return MilestoneSummary.builder()
                .projectId(contractId)
                .totalMilestones(milestones.size())
                .completedMilestones(completed)
                .pendingMilestones(pending)
                .inProgressMilestones(inProgress)
                .totalAmount(totalAmount)
                .fundedAmount(fundedAmount)
                .releasedAmount(completedAmount)
                .progressPercentage(progressPercentage)
                .build();
    }

    @Transactional(readOnly = true)
    public Page<MilestoneResponse> getMilestonesByCompanyId(Long companyId, Pageable pageable) {
        return milestoneRepository.findByContractCompanyIdOrderByCreatedAtDesc(companyId, pageable)
                .map(MilestoneResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<MilestoneResponse> getMilestonesByFreelancerId(Long freelancerId, Pageable pageable) {
        return milestoneRepository.findByContractFreelancerIdOrderByCreatedAtDesc(freelancerId, pageable)
                .map(MilestoneResponse::fromEntity);
    }

    /**
     * Get milestones for a job (project). Convenience method for backward compatibility.
     * Maps jobId to projectId and retrieves associated contract.
     */
    @Transactional(readOnly = true)
    public List<MilestoneResponse> getMilestonesByJobId(Long jobId) {
        List<Contract> contracts = contractRepository.findByProjectId(jobId);
        if (contracts.isEmpty()) {
            return List.of();
        }
        Contract contract = contracts.get(0);
        return getMilestonesByContractId(contract.getId());
    }

    /**
     * Get milestone summary for a job (project). Convenience method for backward compatibility.
     */
    @Transactional(readOnly = true)
    public MilestoneSummary getMilestoneSummaryByJobId(Long jobId) {
        List<Contract> contracts = contractRepository.findByProjectId(jobId);
        if (contracts.isEmpty()) {
            throw new IllegalArgumentException("No contract found for project " + jobId);
        }
        Contract contract = contracts.get(0);
        return getMilestoneSummary(contract.getId());
    }

    private void createLedgerEntry(Payment payment, Escrow escrow, User user,
            TransactionType type, Long amount, String description) {
        log.info("Transaction logged for user {} - {}: {} {}", user.getId(), type, amount, description);
    }

    private void createLedgerEntry(Payment payment, Escrow escrow, Company company,
            TransactionType type, Long amount, String description) {
        log.info("Transaction logged for company {} - {}: {} {}", company.getId(), type, amount, description);
    }

    private void createLedgerEntry(Payment payment, Escrow escrow, Freelancer freelancer,
            TransactionType type, Long amount, String description) {
        log.info("Transaction logged for freelancer {} - {}: {} {}", freelancer.getId(), type, amount, description);
    }
}
