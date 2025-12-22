package com.designer.marketplace.controller;

import com.designer.marketplace.dto.InvoiceDTOs.*;
import com.designer.marketplace.entity.Invoice.InvoiceStatus;
import com.designer.marketplace.service.InvoiceService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
@Tag(name = "Invoices", description = "Invoice generation and management")
@SecurityRequirement(name = "bearerAuth")
public class InvoiceController {

    private final InvoiceService invoiceService;

    @PostMapping("/generate/payment/{paymentId}")
    @Operation(summary = "Generate invoice for a payment")
    public ResponseEntity<InvoiceResponse> generateInvoice(@PathVariable Long paymentId) {
        return ResponseEntity.ok(invoiceService.generateInvoice(paymentId));
    }

    @PostMapping("/generate/milestone/{milestoneId}")
    @Operation(summary = "Generate invoice for a milestone payment")
    public ResponseEntity<InvoiceResponse> generateMilestoneInvoice(@PathVariable Long milestoneId) {
        return ResponseEntity.ok(invoiceService.generateMilestoneInvoice(milestoneId));
    }

    @GetMapping("/{invoiceId}")
    @Operation(summary = "Get invoice by ID")
    public ResponseEntity<InvoiceResponse> getInvoice(@PathVariable Long invoiceId) {
        return ResponseEntity.ok(invoiceService.getInvoice(invoiceId));
    }

    @GetMapping("/number/{invoiceNumber}")
    @Operation(summary = "Get invoice by invoice number")
    public ResponseEntity<InvoiceResponse> getInvoiceByNumber(@PathVariable String invoiceNumber) {
        return ResponseEntity.ok(invoiceService.getInvoiceByNumber(invoiceNumber));
    }

    @GetMapping("/my")
    @Operation(summary = "Get invoices for the current user")
    public ResponseEntity<Page<InvoiceResponse>> getMyInvoices(
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable) {
        Long userId = getUserId(userDetails);
        return ResponseEntity.ok(invoiceService.getInvoicesForUser(userId, pageable));
    }

    @GetMapping("/client")
    @Operation(summary = "Get invoices for the current client")
    public ResponseEntity<Page<InvoiceResponse>> getClientInvoices(
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable) {
        Long clientId = getUserId(userDetails);
        return ResponseEntity.ok(invoiceService.getInvoicesForClient(clientId, pageable));
    }

    @GetMapping("/freelancer")
    @Operation(summary = "Get invoices for the current freelancer")
    public ResponseEntity<Page<InvoiceResponse>> getFreelancerInvoices(
            @AuthenticationPrincipal UserDetails userDetails,
            Pageable pageable) {
        Long freelancerId = getUserId(userDetails);
        return ResponseEntity.ok(invoiceService.getInvoicesForFreelancer(freelancerId, pageable));
    }

    @GetMapping("/job/{jobId}")
    @Operation(summary = "Get invoices for a job")
    public ResponseEntity<List<InvoiceResponse>> getJobInvoices(@PathVariable Long jobId) {
        return ResponseEntity.ok(invoiceService.getInvoicesForJob(jobId));
    }

    @PatchMapping("/{invoiceId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update invoice status (Admin only)")
    public ResponseEntity<InvoiceResponse> updateInvoiceStatus(
            @PathVariable Long invoiceId,
            @RequestParam InvoiceStatus status) {
        return ResponseEntity.ok(invoiceService.updateInvoiceStatus(invoiceId, status));
    }

    private Long getUserId(UserDetails userDetails) {
        return Long.parseLong(userDetails.getUsername());
    }
}
