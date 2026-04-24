package com.designer.marketplace.controller;

import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.designer.marketplace.dto.CreatePaymentRequest;
import com.designer.marketplace.dto.PaymentResponse;
import com.designer.marketplace.service.PaymentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * REST controller for payment operations.
 */
@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Payments", description = "Payment management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class PaymentController {

    private final PaymentService paymentService;
    private final com.designer.marketplace.repository.UserRepository userRepository;

    @PostMapping
    @Operation(summary = "Create payment intent", description = "Creates a Stripe payment intent for escrow")
    public ResponseEntity<?> createPayment(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreatePaymentRequest request) {
        log.info("Payment creation endpoint deferred - Stripe integration not yet implemented");
        return ResponseEntity.ok(Map.of("status", "deferred"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get payment by ID")
    public ResponseEntity<PaymentResponse> getPayment(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.getPayment(id));
    }

    @GetMapping
    @Operation(summary = "Get user's payments", description = "Returns paginated list of payments")
    public ResponseEntity<Page<PaymentResponse>> getMyPayments(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(
                paymentService.getPaymentsForUser(userId, PageRequest.of(page, size))
        );
    }

    @PostMapping("/contracts/{contractId}/escrow")
    @Operation(summary = "Create escrow for contract", description = "Creates escrow when contract becomes ACTIVE")
    public ResponseEntity<?> createEscrowForContract(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long contractId) {
        log.info("Creating escrow for contract: {}", contractId);
        try {
            var escrow = paymentService.createEscrowForContract(contractId);
            return ResponseEntity.ok(Map.of(
                "status", "created",
                "escrowId", escrow.getId(),
                "amount", escrow.getAmount(),
                "holdStatus", escrow.getStatus()
            ));
        } catch (Exception e) {
            log.error("Error creating escrow for contract: {}", contractId, e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/release")
    @Operation(summary = "Release escrow", description = "Company releases escrow funds to freelancer")
    public ResponseEntity<?> releaseEscrow(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        log.info("Releasing escrow: {}", id);
        try {
            var condition = com.designer.marketplace.entity.Escrow.ReleaseCondition.JOB_COMPLETED;
            var escrow = paymentService.releaseEscrow(id, condition);
            return ResponseEntity.ok(Map.of(
                "status", "released",
                "escrowId", escrow.getId(),
                "releasedAt", escrow.getReleasedAt(),
                "amount", escrow.getAmount()
            ));
        } catch (Exception e) {
            log.error("Error releasing escrow: {}", id, e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/refund")
    @Operation(summary = "Refund payment", description = "Request refund for a payment")
    public ResponseEntity<?> refundPayment(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestParam(defaultValue = "User requested refund") String reason) {
        log.info("Refunding escrow: {}, Reason: {}", id, reason);
        try {
            var escrow = paymentService.refundEscrow(id, reason);
            return ResponseEntity.ok(Map.of(
                "status", "refunded",
                "escrowId", escrow.getId(),
                "refundedAt", escrow.getReleasedAt(),
                "amount", escrow.getAmount()
            ));
        } catch (Exception e) {
            log.error("Error refunding escrow: {}", id, e);
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get payment statistics", description = "Admin endpoint for payment analytics")
    public ResponseEntity<?> getStatistics() {
        PaymentService.PaymentStatistics stats = paymentService.getPaymentStatistics();
        return ResponseEntity.ok(stats);
    }

    private Long getUserId(UserDetails userDetails) {
        // Cast to UserPrincipal to get ID directly instead of querying DB
        if (userDetails instanceof com.designer.marketplace.security.UserPrincipal) {
            return ((com.designer.marketplace.security.UserPrincipal) userDetails).getId();
        }
        // Fallback to username lookup
        return userRepository.findByUsernameIgnoreCase(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"))
                .getId();
    }
}
