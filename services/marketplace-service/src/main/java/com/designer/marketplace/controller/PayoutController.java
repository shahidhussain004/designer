package com.designer.marketplace.controller;

import com.designer.marketplace.dto.PayoutDTOs.*;
import com.designer.marketplace.service.PayoutService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payouts")
@RequiredArgsConstructor
@Tag(name = "Payouts", description = "Freelancer payout management")
@SecurityRequirement(name = "bearerAuth")
public class PayoutController {

    private final PayoutService payoutService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create a payout for a freelancer (Admin only)")
    public ResponseEntity<PayoutResponse> createPayout(@Valid @RequestBody CreatePayoutRequest request) {
        return ResponseEntity.ok(payoutService.createPayout(request));
    }

    @PostMapping("/{payoutId}/initiate")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Initiate payout processing (Admin only)")
    public ResponseEntity<PayoutResponse> initiatePayout(@PathVariable Long payoutId) {
        return ResponseEntity.ok(payoutService.initiatePayout(payoutId));
    }

    @PostMapping("/{payoutId}/complete")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Mark payout as completed (Admin only)")
    public ResponseEntity<PayoutResponse> completePayout(@PathVariable Long payoutId) {
        return ResponseEntity.ok(payoutService.completePayout(payoutId));
    }

    @PostMapping("/{payoutId}/fail")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Mark payout as failed (Admin only)")
    public ResponseEntity<PayoutResponse> failPayout(
            @PathVariable Long payoutId,
            @RequestParam String reason) {
        return ResponseEntity.ok(payoutService.failPayout(payoutId, reason));
    }

    @GetMapping("/{payoutId}")
    @Operation(summary = "Get payout by ID")
    public ResponseEntity<PayoutResponse> getPayout(@PathVariable Long payoutId) {
        return ResponseEntity.ok(payoutService.getPayout(payoutId));
    }

    @GetMapping("/my")
    @Operation(summary = "Get payouts for the current freelancer")
    public ResponseEntity<Page<PayoutResponse>> getMyPayouts(
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable) {
        Long freelancerId = getUserId(userDetails);
        return ResponseEntity.ok(payoutService.getPayoutsForFreelancer(freelancerId, pageable));
    }

    @GetMapping("/summary")
    @Operation(summary = "Get payout summary for the current freelancer")
    public ResponseEntity<PayoutSummary> getPayoutSummary(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long freelancerId = getUserId(userDetails);
        return ResponseEntity.ok(payoutService.getPayoutSummary(freelancerId));
    }

    @GetMapping("/available-balance")
    @Operation(summary = "Get available balance for payout")
    public ResponseEntity<Long> getAvailableBalance(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long freelancerId = getUserId(userDetails);
        return ResponseEntity.ok(payoutService.calculateAvailableBalance(freelancerId));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get all pending payouts (Admin only)")
    public ResponseEntity<List<PayoutResponse>> getPendingPayouts() {
        return ResponseEntity.ok(payoutService.getPendingPayouts());
    }

    @GetMapping("/freelancer/{freelancerId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get payouts for a specific freelancer (Admin only)")
    public ResponseEntity<Page<PayoutResponse>> getFreelancerPayouts(
            @PathVariable Long freelancerId,
            Pageable pageable) {
        return ResponseEntity.ok(payoutService.getPayoutsForFreelancer(freelancerId, pageable));
    }

    @GetMapping("/freelancer/{freelancerId}/summary")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get payout summary for a specific freelancer (Admin only)")
    public ResponseEntity<PayoutSummary> getFreelancerPayoutSummary(@PathVariable Long freelancerId) {
        return ResponseEntity.ok(payoutService.getPayoutSummary(freelancerId));
    }

    private Long getUserId(UserDetails userDetails) {
        return Long.parseLong(userDetails.getUsername());
    }
}
