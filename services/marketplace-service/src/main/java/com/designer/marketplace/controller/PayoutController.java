package com.designer.marketplace.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.designer.marketplace.dto.PayoutDTOs.CreatePayoutRequest;
import com.designer.marketplace.dto.PayoutDTOs.PayoutResponse;
import com.designer.marketplace.dto.PayoutDTOs.PayoutSummary;
import com.designer.marketplace.service.PayoutService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/payouts")
@RequiredArgsConstructor
@Tag(name = "Payouts", description = "Freelancer payout management")
@SecurityRequirement(name = "bearerAuth")
public class PayoutController {

    private final PayoutService payoutService;

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(summary = "Create a payout for a freelancer (Admin only)")
    public ResponseEntity<PayoutResponse> createPayout(@Valid @RequestBody CreatePayoutRequest request) {
        return ResponseEntity.ok(payoutService.createPayout(request));
    }

    @PostMapping("/{payoutId}/initiate")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(summary = "Initiate payout processing (Admin only)")
    public ResponseEntity<PayoutResponse> initiatePayout(@PathVariable Long payoutId) {
        return ResponseEntity.ok(payoutService.initiatePayout(payoutId));
    }

    @PostMapping("/{payoutId}/complete")
    @PreAuthorize("hasAuthority('ADMIN')")
    @Operation(summary = "Mark payout as completed (Admin only)")
    public ResponseEntity<PayoutResponse> completePayout(@PathVariable Long payoutId) {
        return ResponseEntity.ok(payoutService.completePayout(payoutId));
    }

    @PostMapping("/{payoutId}/fail")
    @PreAuthorize("hasAuthority('ADMIN')")
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

    @GetMapping("/users/{freelancerId}/payouts")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get payouts for a specific freelancer (Admin only)")
    public ResponseEntity<Page<PayoutResponse>> getFreelancerPayouts(
            @PathVariable Long freelancerId,
            Pageable pageable) {
        return ResponseEntity.ok(payoutService.getPayoutsForFreelancer(freelancerId, pageable));
    }

    @GetMapping("/users/{freelancerId}/payouts/summary")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Get payout summary for a specific freelancer (Admin only)")
    public ResponseEntity<PayoutSummary> getFreelancerPayoutSummary(@PathVariable Long freelancerId) {
        return ResponseEntity.ok(payoutService.getPayoutSummary(freelancerId));
    }

    private Long getUserId(UserDetails userDetails) {
        return Long.parseLong(userDetails.getUsername());
    }
}
