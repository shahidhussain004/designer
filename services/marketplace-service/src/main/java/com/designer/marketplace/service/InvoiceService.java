package com.designer.marketplace.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.designer.marketplace.dto.InvoiceDTOs.InvoiceLineItem;
import com.designer.marketplace.dto.InvoiceDTOs.InvoiceResponse;
import com.designer.marketplace.entity.Invoice;
import com.designer.marketplace.entity.Invoice.InvoiceStatus;
import com.designer.marketplace.entity.Invoice.InvoiceType;
import com.designer.marketplace.entity.Milestone;
import com.designer.marketplace.entity.Payment;
import com.designer.marketplace.repository.InvoiceRepository;
import com.designer.marketplace.repository.MilestoneRepository;
import com.designer.marketplace.repository.PaymentRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for generating and managing invoices.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final MilestoneRepository milestoneRepository;
    private final ObjectMapper objectMapper;

    private static final DateTimeFormatter INVOICE_NUMBER_FORMAT = DateTimeFormatter.ofPattern("yyyyMM");

    /**
     * Generate an invoice for a payment.
     */
    @Transactional
    public InvoiceResponse generateInvoice(Long paymentId) {
        log.info("Generating invoice for payment {}", paymentId);

        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        // Check if invoice already exists
        if (invoiceRepository.findByPaymentId(paymentId).isPresent()) {
            throw new IllegalStateException("Invoice already exists for this payment");
        }

        String invoiceNumber = generateInvoiceNumber();

        // Create line items
        List<InvoiceLineItem> lineItems = createLineItems(payment);

        Invoice invoice = Invoice.builder()
                .invoiceNumber(invoiceNumber)
                .payment(payment)
                .client(payment.getClient())
                .freelancer(payment.getFreelancer())
                .project(payment.getProject())
                .invoiceType(InvoiceType.PAYMENT)
                .subtotal(payment.getFreelancerAmount())
                .platformFee(payment.getPlatformFee())
                .taxAmount(0L)
                .total(payment.getAmount())
                .currency(payment.getCurrency())
                .status(InvoiceStatus.PAID)
                .lineItems(lineItems)
                .invoiceDate(LocalDateTime.now())
                .dueDate(LocalDateTime.now())
                .paidAt(payment.getPaidAt())
                .build();

        invoice = invoiceRepository.save(invoice);
        log.info("Invoice {} generated for payment {}", invoiceNumber, paymentId);

        return InvoiceResponse.fromEntity(invoice);
    }

    /**
     * Generate an invoice for a milestone payment.
     */
    @Transactional
    public InvoiceResponse generateMilestoneInvoice(Long milestoneId) {
        log.info("Generating invoice for milestone {}", milestoneId);

        Milestone milestone = milestoneRepository.findById(milestoneId)
                .orElseThrow(() -> new IllegalArgumentException("Milestone not found"));

        if (milestone.getPayment() == null) {
            throw new IllegalStateException("Milestone has no associated payment");
        }

        // Check if invoice already exists
        if (invoiceRepository.findByMilestoneId(milestoneId).isPresent()) {
            throw new IllegalStateException("Invoice already exists for this milestone");
        }

        Payment payment = milestone.getPayment();
        String invoiceNumber = generateInvoiceNumber();

        // Create line items for milestone
        List<InvoiceLineItem> lineItems = createMilestoneLineItems(milestone, payment);

        Invoice invoice = Invoice.builder()
                .invoiceNumber(invoiceNumber)
                .payment(payment)
                .milestone(milestone)
                .client(payment.getClient())
                .freelancer(payment.getFreelancer())
                .project(payment.getProject())
                .invoiceType(InvoiceType.MILESTONE)
                .subtotal(payment.getFreelancerAmount())
                .platformFee(payment.getPlatformFee())
                .taxAmount(0L)
                .total(payment.getAmount())
                .currency(payment.getCurrency())
                .status(InvoiceStatus.PAID)
                .lineItems(lineItems)
                .notes("Milestone: " + milestone.getTitle())
                .invoiceDate(LocalDateTime.now())
                .dueDate(LocalDateTime.now())
                .paidAt(payment.getPaidAt())
                .build();

        invoice = invoiceRepository.save(invoice);
        log.info("Invoice {} generated for milestone {}", invoiceNumber, milestoneId);

        return InvoiceResponse.fromEntity(invoice);
    }

    /**
     * Get invoice by ID.
     */
    @Transactional(readOnly = true)
    public InvoiceResponse getInvoice(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        return InvoiceResponse.fromEntity(invoice);
    }

    /**
     * Get invoice by invoice number.
     */
    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceByNumber(String invoiceNumber) {
        Invoice invoice = invoiceRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));
        return InvoiceResponse.fromEntity(invoice);
    }

    /**
     * Get invoices for a client.
     */
    @Transactional(readOnly = true)
    public Page<InvoiceResponse> getInvoicesForClient(Long clientId, Pageable pageable) {
        return invoiceRepository.findByClientIdOrderByCreatedAtDesc(clientId, pageable)
                .map(InvoiceResponse::fromEntity);
    }

    /**
     * Get invoices for a freelancer.
     */
    @Transactional(readOnly = true)
    public Page<InvoiceResponse> getInvoicesForFreelancer(Long freelancerId, Pageable pageable) {
        return invoiceRepository.findByFreelancerIdOrderByCreatedAtDesc(freelancerId, pageable)
                .map(InvoiceResponse::fromEntity);
    }

    /**
     * Get invoices for a user (client or freelancer).
     */
    @Transactional(readOnly = true)
    public Page<InvoiceResponse> getInvoicesForUser(Long userId, Pageable pageable) {
        return invoiceRepository.findByUserId(userId, pageable)
                .map(InvoiceResponse::fromEntity);
    }

    /**
     * Get invoices for a project.
     */
    @Transactional(readOnly = true)
    public List<InvoiceResponse> getInvoicesForProject(Long projectId) {
        return invoiceRepository.findByProjectId(projectId).stream()
                .map(InvoiceResponse::fromEntity)
                .toList();
    }

    /**
     * Update invoice status.
     */
    @Transactional
    public InvoiceResponse updateInvoiceStatus(Long invoiceId, InvoiceStatus newStatus) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found"));

        invoice.setStatus(newStatus);
        if (newStatus == InvoiceStatus.PAID) {
            invoice.setPaidAt(LocalDateTime.now());
        }

        invoiceRepository.save(invoice);
        log.info("Invoice {} status updated to {}", invoice.getInvoiceNumber(), newStatus);

        return InvoiceResponse.fromEntity(invoice);
    }

    /**
     * Generate a unique invoice number.
     */
    private String generateInvoiceNumber() {
        String prefix = "INV-" + LocalDateTime.now().format(INVOICE_NUMBER_FORMAT) + "-";
        String maxNumber = invoiceRepository.findMaxInvoiceNumberWithPrefix(prefix);

        int nextNumber = 1;
        if (maxNumber != null) {
            String[] parts = maxNumber.split("-");
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
     * Create line items JSON for a payment.
     */
    private List<InvoiceLineItem> createLineItems(Payment payment) {
        InvoiceLineItem lineItem = InvoiceLineItem.builder()
                .description("Service: " + payment.getProject().getTitle())
                .quantity(1L)
                .unitPrice(payment.getFreelancerAmount())
                .amount(payment.getFreelancerAmount())
                .build();

        InvoiceLineItem feeItem = InvoiceLineItem.builder()
                .description("Platform Fee")
                .quantity(1L)
                .unitPrice(payment.getPlatformFee())
                .amount(payment.getPlatformFee())
                .build();

        return List.of(lineItem, feeItem);
    }

    /**
     * Create line items for a milestone payment.
     */
    private List<InvoiceLineItem> createMilestoneLineItems(Milestone milestone, Payment payment) {
        InvoiceLineItem lineItem = InvoiceLineItem.builder()
                .description("Milestone: " + milestone.getTitle())
                .quantity(1L)
                .unitPrice(payment.getFreelancerAmount())
                .amount(payment.getFreelancerAmount())
                .build();

        InvoiceLineItem feeItem = InvoiceLineItem.builder()
                .description("Platform Fee")
                .quantity(1L)
                .unitPrice(payment.getPlatformFee())
                .amount(payment.getPlatformFee())
                .build();

        return List.of(lineItem, feeItem);
    }

    /**
     * Parse line items from JSON.
     */
    public List<InvoiceLineItem> parseLineItems(String lineItemsJson) {
        if (lineItemsJson == null || lineItemsJson.isEmpty()) {
            return List.of();
        }

        try {
            return objectMapper.readValue(lineItemsJson, new TypeReference<List<InvoiceLineItem>>() {
            });
        } catch (JsonProcessingException e) {
            log.error("Error parsing line items", e);
            return List.of();
        }
    }
}
