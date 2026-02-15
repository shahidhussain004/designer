package com.designer.marketplace.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.designer.marketplace.dto.PaymentResponse;
import com.designer.marketplace.entity.Contract;
import com.designer.marketplace.entity.Escrow;
import com.designer.marketplace.entity.Escrow.EscrowHoldStatus;
import com.designer.marketplace.entity.Escrow.ReleaseCondition;
import com.designer.marketplace.entity.Payment;
import com.designer.marketplace.entity.Payment.PaymentStatus;
import com.designer.marketplace.repository.ContractRepository;
import com.designer.marketplace.repository.EscrowRepository;
import com.designer.marketplace.repository.PaymentRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for handling payment and escrow operations.
 * Implements full escrow/payment processing for contracts.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final EscrowRepository escrowRepository;
    private final ContractRepository contractRepository;

    /**
     * Create or get payment for a contract
     */
    @Transactional
    public PaymentResponse createOrGetPayment(Long contractId) {
        log.info("Creating or getting payment for contract: {}", contractId);
        
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("Contract not found"));
        
        // Check if payment already exists for this contract
        List<Payment> existingPayments = paymentRepository.findAll().stream()
                .filter(p -> p.getId() != null && contract.getId() != null 
                    && p.getId().equals(contract.getId()))
                .toList();
        
        if (!existingPayments.isEmpty()) {
            return PaymentResponse.fromEntity(existingPayments.get(0));
        }
        
        // Create new payment
        Payment payment = Payment.builder()
                .company(contract.getProject().getCompany())
                .freelancer(contract.getFreelancer())
                .amountCents(contract.getAmountCents())
                .currency("USD")
                .description("Payment for contract: " + contract.getTitle())
                .paymentMethod("ESCROW")
                .status(PaymentStatus.PENDING)
                .build();
        
        payment = paymentRepository.save(payment);
        log.info("Payment created: {}", payment.getId());
        
        return PaymentResponse.fromEntity(payment);
    }

    /**
     * Create escrow for a contract when it becomes ACTIVE
     */
    @Transactional
    public Escrow createEscrowForContract(Long contractId) {
        log.info("Creating escrow for contract: {}", contractId);
        
        Contract contract = contractRepository.findById(contractId)
                .orElseThrow(() -> new IllegalArgumentException("Contract not found"));
        
        if (contract.getStatus() != Contract.ContractStatus.ACTIVE) {
            throw new IllegalStateException("Contract must be ACTIVE to create escrow");
        }
        
        // Create payment first if doesn't exist
        List<Payment> payments = paymentRepository.findAll().stream()
                .filter(p -> contract.getProject() != null && p.getCompany() != null
                    && contract.getProject().getCompany().getId().equals(p.getCompany().getId()))
                .toList();
        
        Payment payment;
        if (payments.isEmpty()) {
            payment = Payment.builder()
                    .company(contract.getProject().getCompany())
                    .freelancer(contract.getFreelancer())
                    .amountCents(contract.getAmountCents())
                    .currency("USD")
                    .description("Payment for contract: " + contract.getTitle())
                    .paymentMethod("ESCROW")
                    .status(PaymentStatus.COMPLETED)  // Mark as completed when creating escrow
                    .processedAt(LocalDateTime.now())
                    .build();
            payment = paymentRepository.save(payment);
        } else {
            payment = payments.get(0);
            // Update payment status to completed
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setProcessedAt(LocalDateTime.now());
            payment = paymentRepository.save(payment);
        }
        
        // Create escrow
        Escrow escrow = Escrow.builder()
                .payment(payment)
                .project(contract.getProject())
                .amount(contract.getAmountCents())
                .currency("USD")
                .status(EscrowHoldStatus.HELD)
                .releaseCondition(ReleaseCondition.JOB_COMPLETED)
                .autoReleaseDate(LocalDateTime.now().plusDays(30))  // Auto-release after 30 days
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        escrow = escrowRepository.save(escrow);
        log.info("Escrow created: {}, Amount: {} cents, Status: HELD", escrow.getId(), escrow.getAmount());
        
        return escrow;
    }

    /**
     * Release escrow when project is completed
     */
    @Transactional
    public Escrow releaseEscrow(Long escrowId, ReleaseCondition condition) {
        log.info("Releasing escrow: {}", escrowId);
        
        Escrow escrow = escrowRepository.findById(escrowId)
                .orElseThrow(() -> new IllegalArgumentException("Escrow not found"));
        
        if (escrow.getStatus() != EscrowHoldStatus.HELD) {
            throw new IllegalStateException("Escrow is not in HELD status, current status: " + escrow.getStatus());
        }
        
        // Release escrow
        escrow.setStatus(EscrowHoldStatus.RELEASED);
        escrow.setReleaseCondition(condition);
        escrow.setReleasedAt(LocalDateTime.now());
        escrow.setUpdatedAt(LocalDateTime.now());
        
        escrow = escrowRepository.save(escrow);
        log.info("Escrow released: {}, Released at: {}", escrow.getId(), escrow.getReleasedAt());
        
        // Update payment status
        if (escrow.getPayment() != null) {
            Payment payment = escrow.getPayment();
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setProcessedAt(LocalDateTime.now());
            paymentRepository.save(payment);
        }
        
        return escrow;
    }

    /**
     * Refund escrow (for disputes or cancellations)
     */
    @Transactional
    public Escrow refundEscrow(Long escrowId, String reason) {
        log.info("Refunding escrow: {}, Reason: {}", escrowId, reason);
        
        Escrow escrow = escrowRepository.findById(escrowId)
                .orElseThrow(() -> new IllegalArgumentException("Escrow not found"));
        
        if (escrow.getStatus() == EscrowHoldStatus.RELEASED) {
            throw new IllegalStateException("Cannot refund released escrow");
        }
        
        // Refund escrow
        escrow.setStatus(EscrowHoldStatus.REFUNDED);
        escrow.setReleasedAt(LocalDateTime.now());
        escrow.setUpdatedAt(LocalDateTime.now());
        
        escrow = escrowRepository.save(escrow);
        log.info("Escrow refunded: {}", escrow.getId());
        
        // Update payment status
        if (escrow.getPayment() != null) {
            Payment payment = escrow.getPayment();
            payment.setStatus(PaymentStatus.FAILED);
            paymentRepository.save(payment);
        }
        
        return escrow;
    }

    /**
     * Get all payments with pagination.
     */
    @Transactional(readOnly = true)
    public Page<PaymentResponse> getAllPayments(Pageable pageable) {
        log.info("Fetching all payments, page: {}, size: {}", pageable.getPageNumber(),
                pageable.getPageSize());
        return paymentRepository.findAll(pageable).map(PaymentResponse::fromEntity);
    }

    /**
     * Get payments by company.
     */
    @Transactional(readOnly = true)
    public Page<PaymentResponse> getPaymentsByCompany(Long companyId, Pageable pageable) {
        log.info("Fetching payments for company: {}", companyId);
        return paymentRepository.findByCompanyIdOrderByCreatedAtDesc(companyId, pageable)
                .map(PaymentResponse::fromEntity);
    }

    /**
     * Get payments by freelancer.
     */
    @Transactional(readOnly = true)
    public Page<PaymentResponse> getPaymentsByFreelancer(Long freelancerId, Pageable pageable) {
        log.info("Fetching payments for freelancer: {}", freelancerId);
        return paymentRepository.findByFreelancerIdOrderByCreatedAtDesc(freelancerId, pageable)
                .map(PaymentResponse::fromEntity);
    }

    /**
     * Get single payment by ID (alias).
     */
    @Transactional(readOnly = true)
    public PaymentResponse getPayment(Long paymentId) {
        return getPaymentById(paymentId);
    }

    /**
     * Get single payment by ID.
     */
    @Transactional(readOnly = true)
    public PaymentResponse getPaymentById(Long paymentId) {
        log.info("Fetching payment: {}", paymentId);
        return paymentRepository.findById(paymentId).map(PaymentResponse::fromEntity).orElse(null);
    }

    /**
     * Get payments for a specific user (as company or freelancer).
     */
    @Transactional(readOnly = true)
    public Page<PaymentResponse> getPaymentsForUser(Long userId, Pageable pageable) {
        log.info("Fetching payments for user: {}", userId);
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(PaymentResponse::fromEntity);
    }

    /**
     * Get payment statistics.
     */
    @Transactional(readOnly = true)
    public PaymentStatistics getPaymentStatistics() {
        log.info("Calculating payment statistics");

        long totalPayments = paymentRepository.count();
        Long completedAmount = paymentRepository.sumAmountByStatus(PaymentStatus.COMPLETED);
        Long pendingAmount = paymentRepository.sumAmountByStatus(PaymentStatus.PENDING);
        Long failedAmount = paymentRepository.sumAmountByStatus(PaymentStatus.FAILED);
        
        // Get escrow statistics
        long totalEscrowed = escrowRepository.count();
        long releasedEscrows = escrowRepository.findAll().stream()
                .filter(e -> e.getStatus() == EscrowHoldStatus.RELEASED)
                .count();

        return PaymentStatistics.builder()
                .totalPayments(totalPayments)
                .completedAmount(completedAmount != null ? completedAmount : 0L)
                .pendingAmount(pendingAmount != null ? pendingAmount : 0L)
                .failedAmount(failedAmount != null ? failedAmount : 0L)
                .totalEscrowed(totalEscrowed)
                .releasedEscrows(releasedEscrows)
                .build();
    }

    /**
     * Statistics DTO
     */
    @lombok.Data
    @lombok.Builder
    public static class PaymentStatistics {
        private long totalPayments;
        private Long completedAmount;
        private Long pendingAmount;
        private Long failedAmount;
        private long totalEscrowed;
        private long releasedEscrows;
    }
}
