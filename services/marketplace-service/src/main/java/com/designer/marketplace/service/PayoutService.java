package com.designer.marketplace.service;

import com.designer.marketplace.dto.PayoutDTOs.*;
import com.designer.marketplace.entity.*;
import com.designer.marketplace.entity.Payment.EscrowStatus;
import com.designer.marketplace.entity.Payout.PayoutMethod;
import com.designer.marketplace.entity.Payout.PayoutStatus;
import com.designer.marketplace.entity.TransactionLedger.TransactionType;
import com.designer.marketplace.repository.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.exception.StripeException;
import com.stripe.model.Transfer;
import com.stripe.param.TransferCreateParams;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

/**
 * Service for managing freelancer payouts.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PayoutService {

    private final PayoutRepository payoutRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final TransactionLedgerRepository transactionLedgerRepository;
    private final ObjectMapper objectMapper;

    @Value("${stripe.connect.enabled:false}")
    private boolean stripeConnectEnabled;

    private static final DateTimeFormatter PAYOUT_REF_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd");

    /**
     * Create a payout for a freelancer.
     */
    @Transactional
    public PayoutResponse createPayout(CreatePayoutRequest request) {
        log.info("Creating payout for freelancer {}", request.getFreelancerId());

        User freelancer = userRepository.findById(request.getFreelancerId())
                .orElseThrow(() -> new IllegalArgumentException("Freelancer not found"));

        // Validate payout amount
        Long availableBalance = calculateAvailableBalance(request.getFreelancerId());
        if (request.getAmount() > availableBalance) {
            throw new IllegalArgumentException("Payout amount exceeds available balance. " +
                    "Available: " + availableBalance + ", Requested: " + request.getAmount());
        }

        String payoutReference = generatePayoutReference();

        // Serialize included payment IDs
        String includedPaymentsJson = null;
        if (request.getPaymentIds() != null && !request.getPaymentIds().isEmpty()) {
            try {
                includedPaymentsJson = objectMapper.writeValueAsString(request.getPaymentIds());
            } catch (JsonProcessingException e) {
                log.error("Error serializing payment IDs", e);
            }
        }

        Payout payout = Payout.builder()
                .payoutReference(payoutReference)
                .freelancer(freelancer)
                .amount(request.getAmount())
                .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                .status(PayoutStatus.PENDING)
                .payoutMethod(request.getPayoutMethod() != null
                        ? request.getPayoutMethod()
                        : PayoutMethod.BANK_TRANSFER)
                .periodStart(request.getPeriodStart())
                .periodEnd(request.getPeriodEnd())
                .includedPayments(includedPaymentsJson)
                .paymentCount(request.getPaymentIds() != null ? request.getPaymentIds().size() : 0)
                .build();

        payout = payoutRepository.save(payout);
        log.info("Payout {} created for freelancer {}", payoutReference, request.getFreelancerId());

        return PayoutResponse.fromEntity(payout);
    }

    /**
     * Initiate payout processing.
     */
    @Transactional
    public PayoutResponse initiatePayout(Long payoutId) {
        log.info("Initiating payout {}", payoutId);

        Payout payout = payoutRepository.findById(payoutId)
                .orElseThrow(() -> new IllegalArgumentException("Payout not found"));

        if (payout.getStatus() != PayoutStatus.PENDING) {
            throw new IllegalStateException("Payout is not in PENDING status");
        }

        payout.setStatus(PayoutStatus.PROCESSING);
        payout.setInitiatedAt(LocalDateTime.now());

        if (stripeConnectEnabled) {
            try {
                // Create Stripe transfer (requires Stripe Connect setup)
                TransferCreateParams params = TransferCreateParams.builder()
                        .setAmount(payout.getAmount())
                        .setCurrency(payout.getCurrency().toLowerCase())
                        .setDestination(getStripeConnectAccountId(payout.getFreelancer()))
                        .setDescription("Payout: " + payout.getPayoutReference())
                        .build();

                Transfer transfer = Transfer.create(params);
                payout.setStripeTransferId(transfer.getId());
                payout.setStatus(PayoutStatus.IN_TRANSIT);

                log.info("Stripe transfer {} created for payout {}",
                        transfer.getId(), payout.getPayoutReference());

            } catch (StripeException e) {
                log.error("Stripe error initiating payout: {}", e.getMessage());
                payout.setStatus(PayoutStatus.FAILED);
                payout.setFailureReason(e.getMessage());
            }
        } else {
            // Simulate payout for non-Stripe environments
            payout.setStatus(PayoutStatus.IN_TRANSIT);
            log.info("Simulated payout initiation (Stripe Connect not enabled)");
        }

        payoutRepository.save(payout);

        // Create ledger entry
        createLedgerEntry(payout, TransactionType.PAYOUT,
                "Payout initiated: " + payout.getPayoutReference());

        return PayoutResponse.fromEntity(payout);
    }

    /**
     * Mark payout as completed.
     */
    @Transactional
    public PayoutResponse completePayout(Long payoutId) {
        Payout payout = payoutRepository.findById(payoutId)
                .orElseThrow(() -> new IllegalArgumentException("Payout not found"));

        if (payout.getStatus() != PayoutStatus.PROCESSING &&
                payout.getStatus() != PayoutStatus.IN_TRANSIT) {
            throw new IllegalStateException("Payout is not in a completable state");
        }

        payout.setStatus(PayoutStatus.PAID);
        payout.setCompletedAt(LocalDateTime.now());
        payoutRepository.save(payout);

        log.info("Payout {} completed", payout.getPayoutReference());
        return PayoutResponse.fromEntity(payout);
    }

    /**
     * Mark payout as failed.
     */
    @Transactional
    public PayoutResponse failPayout(Long payoutId, String reason) {
        Payout payout = payoutRepository.findById(payoutId)
                .orElseThrow(() -> new IllegalArgumentException("Payout not found"));

        payout.setStatus(PayoutStatus.FAILED);
        payout.setFailureReason(reason);
        payoutRepository.save(payout);

        log.warn("Payout {} failed: {}", payout.getPayoutReference(), reason);
        return PayoutResponse.fromEntity(payout);
    }

    /**
     * Get payout by ID.
     */
    @Transactional(readOnly = true)
    public PayoutResponse getPayout(Long payoutId) {
        Payout payout = payoutRepository.findById(payoutId)
                .orElseThrow(() -> new IllegalArgumentException("Payout not found"));
        return PayoutResponse.fromEntity(payout);
    }

    /**
     * Get payouts for a freelancer.
     */
    @Transactional(readOnly = true)
    public Page<PayoutResponse> getPayoutsForFreelancer(Long freelancerId, Pageable pageable) {
        return payoutRepository.findByFreelancerIdOrderByCreatedAtDesc(freelancerId, pageable)
                .map(PayoutResponse::fromEntity);
    }

    /**
     * Get payout summary for a freelancer.
     */
    @Transactional(readOnly = true)
    public PayoutSummary getPayoutSummary(Long freelancerId) {
        // Calculate total earnings from released payments
        Long totalEarnings = paymentRepository.sumFreelancerAmountByFreelancerIdAndEscrowStatus(
                freelancerId, EscrowStatus.RELEASED);
        if (totalEarnings == null)
            totalEarnings = 0L;

        // Calculate total paid out
        Long totalPaidOut = payoutRepository.sumPaidAmountByFreelancerId(freelancerId);
        if (totalPaidOut == null)
            totalPaidOut = 0L;

        // Calculate pending payouts
        List<Payout> pendingPayouts = payoutRepository.findByFreelancerIdAndStatus(
                freelancerId, PayoutStatus.PENDING);
        Long pendingPayout = pendingPayouts.stream()
                .mapToLong(Payout::getAmount)
                .sum();

        // Calculate available for payout
        Long availableForPayout = totalEarnings - totalPaidOut - pendingPayout;
        if (availableForPayout < 0)
            availableForPayout = 0L;

        // Count payouts
        Page<Payout> allPayouts = payoutRepository.findByFreelancerIdOrderByCreatedAtDesc(
                freelancerId, Pageable.unpaged());
        int totalPayouts = (int) allPayouts.getTotalElements();
        int successfulPayouts = (int) allPayouts.stream()
                .filter(p -> p.getStatus() == PayoutStatus.PAID)
                .count();

        // Last payout date
        Page<Payout> paidPayouts = payoutRepository.findPaidPayoutsByFreelancerId(
                freelancerId, Pageable.ofSize(1));
        LocalDateTime lastPayoutDate = paidPayouts.hasContent()
                ? paidPayouts.getContent().get(0).getCompletedAt()
                : null;

        return PayoutSummary.builder()
                .freelancerId(freelancerId)
                .totalEarnings(totalEarnings)
                .totalPaidOut(totalPaidOut)
                .pendingPayout(pendingPayout)
                .availableForPayout(availableForPayout)
                .totalPayouts(totalPayouts)
                .successfulPayouts(successfulPayouts)
                .lastPayoutDate(lastPayoutDate)
                .build();
    }

    /**
     * Calculate available balance for payout.
     */
    @Transactional(readOnly = true)
    public Long calculateAvailableBalance(Long freelancerId) {
        // Sum of released escrow amounts
        Long releasedAmount = paymentRepository.sumFreelancerAmountByFreelancerIdAndEscrowStatus(
                freelancerId, EscrowStatus.RELEASED);
        if (releasedAmount == null)
            releasedAmount = 0L;

        // Sum of already paid out
        Long paidOutAmount = payoutRepository.sumPaidAmountByFreelancerId(freelancerId);
        if (paidOutAmount == null)
            paidOutAmount = 0L;

        // Sum of pending payouts
        List<Payout> pendingPayouts = payoutRepository.findByFreelancerIdAndStatus(
                freelancerId, PayoutStatus.PENDING);
        Long pendingAmount = pendingPayouts.stream()
                .mapToLong(Payout::getAmount)
                .sum();

        return releasedAmount - paidOutAmount - pendingAmount;
    }

    /**
     * Get pending payouts for processing.
     */
    @Transactional(readOnly = true)
    public List<PayoutResponse> getPendingPayouts() {
        return payoutRepository.findByStatus(PayoutStatus.PENDING).stream()
                .map(PayoutResponse::fromEntity)
                .toList();
    }

    /**
     * Generate a unique payout reference.
     */
    private String generatePayoutReference() {
        String prefix = "PO-" + LocalDateTime.now().format(PAYOUT_REF_FORMAT) + "-";
        String maxRef = payoutRepository.findMaxPayoutReferenceWithPrefix(prefix);

        int nextNumber = 1;
        if (maxRef != null) {
            String[] parts = maxRef.split("-");
            if (parts.length == 3) {
                try {
                    nextNumber = Integer.parseInt(parts[2]) + 1;
                } catch (NumberFormatException e) {
                    // Use default
                }
            }
        }

        return prefix + String.format("%04d", nextNumber);
    }

    /**
     * Get Stripe Connect account ID for a freelancer.
     */
    private String getStripeConnectAccountId(User freelancer) {
        // In a real implementation, this would be stored in the User entity
        // or a separate StripeAccount entity
        return "acct_placeholder_" + freelancer.getId();
    }

    private void createLedgerEntry(Payout payout, TransactionType type, String description) {
        TransactionLedger entry = TransactionLedger.builder()
                .transactionType(type)
                .user(payout.getFreelancer())
                .amount(payout.getAmount())
                .currency(payout.getCurrency())
                .description(description)
                .referenceId(payout.getPayoutReference())
                .build();

        transactionLedgerRepository.save(entry);
    }
}
