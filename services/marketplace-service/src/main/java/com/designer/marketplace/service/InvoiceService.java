package com.designer.marketplace.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.designer.marketplace.dto.InvoiceDTOs.InvoiceResponse;
import com.designer.marketplace.entity.Invoice;
import com.designer.marketplace.entity.Invoice.InvoiceStatus;
import com.designer.marketplace.entity.Payment;
import com.designer.marketplace.repository.InvoiceRepository;
import com.designer.marketplace.repository.PaymentRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for generating and managing invoices.
 * Handles invoice generation, retrieval, and status management.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final ObjectMapper objectMapper;

    private static final DateTimeFormatter INVOICE_NUMBER_FORMAT = DateTimeFormatter.ofPattern("yyyyMM");

    @Transactional
    public InvoiceResponse generateInvoice(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found: " + paymentId));
        
        String invoiceNumber = generateInvoiceNumber();
        
        Invoice invoice = Invoice.builder()
                .invoiceNumber(invoiceNumber)
                .payment(payment)
                .company(payment.getCompany())
                .freelancer(payment.getFreelancer())
                .subtotalCents(payment.getAmountCents())
                .platformFeeCents(0L)
                .taxAmountCents(0L)
                .totalCents(payment.getAmountCents())
                .currency(payment.getCurrency() != null ? payment.getCurrency() : "USD")
                .status(InvoiceStatus.DRAFT)
                .invoiceDate(LocalDateTime.now())
                .dueDate(LocalDateTime.now().plusDays(30))
                .build();
        
        Invoice saved = invoiceRepository.save(invoice);
        log.info("Invoice generated: {} for payment: {}", invoiceNumber, paymentId);
        return InvoiceResponse.fromEntity(saved);
    }

    @Transactional
    public InvoiceResponse generateMilestoneInvoice(Long milestoneId) {
        // Simplified milestone invoice generation
        String invoiceNumber = generateInvoiceNumber();
        
        Invoice invoice = Invoice.builder()
                .invoiceNumber(invoiceNumber)
                .status(InvoiceStatus.DRAFT)
                .invoiceDate(LocalDateTime.now())
                .dueDate(LocalDateTime.now().plusDays(30))
                .build();
        
        Invoice saved = invoiceRepository.save(invoice);
        log.info("Milestone invoice generated: {}", invoiceNumber);
        return InvoiceResponse.fromEntity(saved);
    }

    @Transactional(readOnly = true)
    public InvoiceResponse getInvoice(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found: " + invoiceId));
        return InvoiceResponse.fromEntity(invoice);
    }

    @Transactional(readOnly = true)
    public InvoiceResponse getInvoiceByNumber(String invoiceNumber) {
        Invoice invoice = invoiceRepository.findByInvoiceNumber(invoiceNumber)
                .orElseThrow(() -> new RuntimeException("Invoice not found: " + invoiceNumber));
        return InvoiceResponse.fromEntity(invoice);
    }

    @Transactional(readOnly = true)
    public Page<InvoiceResponse> getInvoicesForCompany(Long companyId, Pageable pageable) {
        return invoiceRepository.findByCompanyIdOrderByCreatedAtDesc(companyId, pageable)
                .map(InvoiceResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<InvoiceResponse> getInvoicesForFreelancer(Long freelancerId, Pageable pageable) {
        return invoiceRepository.findByFreelancerIdOrderByCreatedAtDesc(freelancerId, pageable)
                .map(InvoiceResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public Page<InvoiceResponse> getInvoicesForUser(Long userId, Pageable pageable) {
        return invoiceRepository.findByUserId(userId, pageable)
                .map(InvoiceResponse::fromEntity);
    }

    @Transactional(readOnly = true)
    public List<InvoiceResponse> getInvoicesForProject(Long projectId) {
        // Retrieve invoices related to project - implementation depends on project relationship
        return invoiceRepository.findAll().stream()
                .map(InvoiceResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public InvoiceResponse updateInvoiceStatus(Long invoiceId, InvoiceStatus newStatus) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new RuntimeException("Invoice not found: " + invoiceId));
        
        invoice.setStatus(newStatus);
        if (newStatus == InvoiceStatus.PAID) {
            invoice.setPaidAt(LocalDateTime.now());
        }
        
        Invoice updated = invoiceRepository.save(invoice);
        log.info("Invoice {} status updated to: {}", invoiceId, newStatus);
        return InvoiceResponse.fromEntity(updated);
    }

    private String generateInvoiceNumber() {
        String prefix = LocalDateTime.now().format(INVOICE_NUMBER_FORMAT);
        String maxNumber = invoiceRepository.findMaxInvoiceNumberWithPrefix(prefix);
        
        int nextNumber = 1;
        if (maxNumber != null && maxNumber.length() > 6) {
            try {
                int currentNumber = Integer.parseInt(maxNumber.substring(6));
                nextNumber = currentNumber + 1;
            } catch (NumberFormatException e) {
                log.warn("Could not parse invoice number: {}", maxNumber);
            }
        }
        
        return String.format("%s%06d", prefix, nextNumber);
    }

    public List<String> parseLineItems(String lineItemsJson) {
        try {
            var jsonNode = objectMapper.readTree(lineItemsJson);
            return List.of(lineItemsJson);
        } catch (Exception e) {
            log.error("Error parsing line items: {}", lineItemsJson, e);
            return List.of();
        }
    }
}

