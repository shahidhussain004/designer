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
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Payments", description = "Payment management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class PaymentController {

    private final PaymentService paymentService;
    private final com.designer.marketplace.repository.UserRepository userRepository;

    @PostMapping
    @Operation(summary = "Create payment intent", description = "Creates a Stripe payment intent for escrow")
    public ResponseEntity<PaymentResponse> createPayment(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreatePaymentRequest request) {
        
        Long userId = getUserId(userDetails);
        log.info("Creating payment for user: {}", userId);
        
        PaymentResponse response = paymentService.createPaymentIntent(userId, request);
        return ResponseEntity.ok(response);
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

    @PostMapping("/{id}/release")
    @Operation(summary = "Release escrow", description = "Company releases escrow funds to freelancer")
    public ResponseEntity<PaymentResponse> releaseEscrow(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        
        Long userId = getUserId(userDetails);
        log.info("User {} releasing escrow for payment: {}", userId, id);
        
        return ResponseEntity.ok(paymentService.releaseEscrow(id, userId));
    }

    @PostMapping("/{id}/refund")
    @Operation(summary = "Refund payment", description = "Request refund for a payment")
    public ResponseEntity<PaymentResponse> refundPayment(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        
        Long userId = getUserId(userDetails);
        log.info("User {} requesting refund for payment: {}", userId, id);
        
        return ResponseEntity.ok(paymentService.refundPayment(id, userId));
    }

    @GetMapping("/statistics")
    @Operation(summary = "Get payment statistics", description = "Admin endpoint for payment analytics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        return ResponseEntity.ok(paymentService.getPaymentStatistics());
    }

    private Long getUserId(UserDetails userDetails) {
        // Cast to UserPrincipal to get ID directly instead of querying DB
        if (userDetails instanceof com.designer.marketplace.security.UserPrincipal) {
            return ((com.designer.marketplace.security.UserPrincipal) userDetails).getId();
        }
        // Fallback to username lookup
        return userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("User not found"))
                .getId();
    }
}
