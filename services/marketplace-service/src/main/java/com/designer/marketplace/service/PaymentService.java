package com.designer.marketplace.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.designer.marketplace.dto.CreatePaymentRequest;
import com.designer.marketplace.dto.PaymentResponse;
import com.designer.marketplace.entity.Escrow;
import com.designer.marketplace.entity.Payment;
import com.designer.marketplace.entity.Payment.EscrowStatus;
import com.designer.marketplace.entity.Payment.PaymentStatus;
import com.designer.marketplace.entity.Project;
import com.designer.marketplace.entity.Proposal;
import com.designer.marketplace.entity.TransactionLedger;
import com.designer.marketplace.entity.TransactionLedger.TransactionType;
import com.designer.marketplace.entity.User;
import com.designer.marketplace.repository.EscrowRepository;
import com.designer.marketplace.repository.PaymentRepository;
import com.designer.marketplace.repository.ProjectRepository;
import com.designer.marketplace.repository.ProposalRepository;
import com.designer.marketplace.repository.TransactionLedgerRepository;
import com.designer.marketplace.repository.UserRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.RefundCreateParams;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for handling payment operations with Stripe integration.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final EscrowRepository escrowRepository;
    private final TransactionLedgerRepository transactionLedgerRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;
    private final ProposalRepository proposalRepository;

    @Value("${stripe.api.key:sk_test_placeholder}")
    private String stripeApiKey;

    @Value("${payment.platform.fee.percent:10}")
    private int platformFeePercent;

    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
        log.info("Stripe API initialized with platform fee: {}%", platformFeePercent);
    }

    /**
     * Create a payment intent for a job/proposal.
     */
    @Transactional
    public PaymentResponse createPaymentIntent(Long companyId, CreatePaymentRequest request) {
        log.info("Creating payment intent for company {} on project {}", companyId, request.getProjectId());

        // Validate company
        User company = userRepository.findById(companyId)
                .orElseThrow(() -> new IllegalArgumentException("Company not found"));

        // Validate project
        Project project = projectRepository.findById(request.getProjectId())
                .orElseThrow(() -> new IllegalArgumentException("Project not found"));

        // Validate proposal
        Proposal proposal = proposalRepository.findById(request.getProposalId())
                .orElseThrow(() -> new IllegalArgumentException("Proposal not found"));

        User freelancer = proposal.getFreelancer();

        // Calculate fees (amount in cents)
        Long amount = request.getAmount();
        Long platformFee = (amount * platformFeePercent) / 100;
        Long freelancerAmount = amount - platformFee;

        try {
            // Create Stripe PaymentIntent
            Map<String, String> metadata = new HashMap<>();
            metadata.put("project_id", project.getId().toString());
            metadata.put("proposal_id", proposal.getId().toString());
            metadata.put("company_id", company.getId().toString());
            metadata.put("freelancer_id", freelancer.getId().toString());

            PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                    .setAmount(amount)
                    .setCurrency(request.getCurrency().toLowerCase())
                    .setDescription("Payment for project: " + project.getTitle())
                    .putAllMetadata(metadata)
                    .setAutomaticPaymentMethods(
                            PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                    .setEnabled(true)
                                    .build()
                    )
                    .build();

            PaymentIntent paymentIntent = PaymentIntent.create(params);

            // Save payment record
            Payment payment = Payment.builder()
                    .paymentIntentId(paymentIntent.getId())
                    .company(company)
                    .freelancer(freelancer)
                    .project(project)
                    .proposal(proposal)
                    .amount(amount)
                    .platformFee(platformFee)
                    .freelancerAmount(freelancerAmount)
                    .currency(request.getCurrency())
                    .status(PaymentStatus.PENDING)
                    .escrowStatus(EscrowStatus.NOT_ESCROWED)
                    .build();

            payment = paymentRepository.save(payment);

            // Create ledger entry
            createLedgerEntry(payment, null, company, TransactionType.PAYMENT_RECEIVED, amount,
                    "Payment initiated for project: " + project.getTitle());

            PaymentResponse response = PaymentResponse.fromEntity(payment);
            // Stripe's PaymentIntent provides a client secret used by the frontend
            // keep the DTO field name `companySecret` for backward compatibility
            response.setCompanySecret(paymentIntent.getClientSecret());

            log.info("Payment intent created: {}", paymentIntent.getId());
            return response;

        } catch (StripeException e) {
            log.error("Stripe error creating payment intent: {}", e.getMessage());
            throw new RuntimeException("Failed to create payment: " + e.getMessage());
        }
    }

    /**
     * Handle Stripe webhook for payment confirmation.
     */
    @Transactional
    public void handlePaymentSucceeded(String paymentIntentId) {
        log.info("Processing payment succeeded: {}", paymentIntentId);

        Payment payment = paymentRepository.findByPaymentIntentId(paymentIntentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found: " + paymentIntentId));

        payment.setStatus(PaymentStatus.SUCCEEDED);
        payment.setPaidAt(LocalDateTime.now());

        // Move to escrow
        payment.setEscrowStatus(EscrowStatus.HELD);

        // Create escrow record
        Escrow escrow = Escrow.builder()
                .payment(payment)
                .project(payment.getProject())
                .amount(payment.getFreelancerAmount())
                .currency(payment.getCurrency())
                .status(Escrow.EscrowHoldStatus.HELD)
                .releaseCondition(Escrow.ReleaseCondition.PROJECT_COMPLETED)
                .autoReleaseDate(LocalDateTime.now().plusDays(14)) // Auto-release after 14 days
                .build();

        escrowRepository.save(escrow);
        paymentRepository.save(payment);

        // Create ledger entries
        createLedgerEntry(payment, escrow, payment.getCompany(), TransactionType.ESCROW_HOLD,
                payment.getFreelancerAmount(), "Funds held in escrow");

        createLedgerEntry(payment, null, null, TransactionType.PLATFORM_FEE,
                payment.getPlatformFee(), "Platform fee collected");

        log.info("Payment succeeded and moved to escrow: {}", paymentIntentId);
    }

    /**
     * Handle payment failure.
     */
    @Transactional
    public void handlePaymentFailed(String paymentIntentId, String failureCode, String failureMessage) {
        log.warn("Payment failed: {} - {} - {}", paymentIntentId, failureCode, failureMessage);

        Payment payment = paymentRepository.findByPaymentIntentId(paymentIntentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found: " + paymentIntentId));

        payment.setStatus(PaymentStatus.FAILED);
        payment.setFailureCode(failureCode);
        payment.setFailureMessage(failureMessage);

        paymentRepository.save(payment);
    }

    /**
     * Release escrow funds to freelancer after job completion.
     */
    @Transactional
    public PaymentResponse releaseEscrow(Long paymentId, Long releaserId) {
        log.info("Releasing escrow for payment: {}", paymentId);

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        // Verify the releaser is the company
        if (!payment.getCompany().getId().equals(releaserId)) {
            throw new IllegalArgumentException("Only the company can release escrow");
        }

        if (payment.getEscrowStatus() != EscrowStatus.HELD) {
            throw new IllegalStateException("Escrow is not in HELD status");
        }

        Escrow escrow = escrowRepository.findByPaymentId(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Escrow not found"));

        // Release escrow
        escrow.setStatus(Escrow.EscrowHoldStatus.RELEASED);
        escrow.setReleasedAt(LocalDateTime.now());
        escrowRepository.save(escrow);

        payment.setEscrowStatus(EscrowStatus.RELEASED);
        payment.setReleasedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // Create ledger entry
        createLedgerEntry(payment, escrow, payment.getFreelancer(), TransactionType.ESCROW_RELEASE,
                payment.getFreelancerAmount(), "Escrow released to freelancer");

        log.info("Escrow released for payment: {}", paymentId);
        return PaymentResponse.fromEntity(payment);
    }

    /**
     * Refund a payment.
     */
    @Transactional
    public PaymentResponse refundPayment(Long paymentId, Long requesterId) {
        log.info("Processing refund for payment: {}", paymentId);

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        if (payment.getStatus() != PaymentStatus.SUCCEEDED) {
            throw new IllegalStateException("Can only refund succeeded payments");
        }

        if (payment.getEscrowStatus() == EscrowStatus.RELEASED) {
            throw new IllegalStateException("Cannot refund after escrow is released");
        }

        try {
            // Create Stripe refund
            RefundCreateParams params = RefundCreateParams.builder()
                    .setPaymentIntent(payment.getPaymentIntentId())
                    .build();

            Refund refund = Refund.create(params);

            // Update payment status
            payment.setStatus(PaymentStatus.REFUNDED);
            payment.setEscrowStatus(EscrowStatus.REFUNDED);
            payment.setRefundedAt(LocalDateTime.now());
            paymentRepository.save(payment);

            // Update escrow if exists
            escrowRepository.findByPaymentId(paymentId).ifPresent(escrow -> {
                escrow.setStatus(Escrow.EscrowHoldStatus.REFUNDED);
                escrowRepository.save(escrow);
            });

            // Create ledger entry
            createLedgerEntry(payment, null, payment.getCompany(), TransactionType.REFUND,
                    payment.getAmount(), "Payment refunded");

            log.info("Payment refunded: {} - Stripe refund: {}", paymentId, refund.getId());
            return PaymentResponse.fromEntity(payment);

        } catch (StripeException e) {
            log.error("Stripe error processing refund: {}", e.getMessage());
            throw new RuntimeException("Failed to process refund: " + e.getMessage());
        }
    }

    /**
     * Get payment by ID.
     */
    @Transactional(readOnly = true)
    public PaymentResponse getPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));
        return PaymentResponse.fromEntity(payment);
    }

    /**
     * Get payments for a user (as company or freelancer).
     */
    @Transactional(readOnly = true)
    public Page<PaymentResponse> getPaymentsForUser(Long userId, Pageable pageable) {
        return paymentRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(PaymentResponse::fromEntity);
    }

    /**
     * Get payment statistics for admin dashboard.
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getPaymentStatistics() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("totalPending", paymentRepository.countByStatus(PaymentStatus.PENDING));
        stats.put("totalSucceeded", paymentRepository.countByStatus(PaymentStatus.SUCCEEDED));
        stats.put("totalFailed", paymentRepository.countByStatus(PaymentStatus.FAILED));
        stats.put("totalRefunded", paymentRepository.countByStatus(PaymentStatus.REFUNDED));
        stats.put("totalEscrowHeld", escrowRepository.sumHeldAmount());

        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime now = LocalDateTime.now();
        stats.put("monthlyPlatformFees", paymentRepository.sumPlatformFeeBetween(startOfMonth, now));

        return stats;
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
