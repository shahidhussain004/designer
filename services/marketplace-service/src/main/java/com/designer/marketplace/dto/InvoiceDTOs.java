package com.designer.marketplace.dto;

import java.time.LocalDateTime;

import com.designer.marketplace.entity.Invoice;
import com.designer.marketplace.entity.Invoice.InvoiceStatus;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class InvoiceDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateInvoiceRequest {
        private Long paymentId;
        private Long companyId;
        private Long freelancerId;
        private Long subtotalCents;
        private Long platformFeeCents;
        private Long taxAmountCents;
        private Long totalCents;
        private String currency;
        private String notes;
        private LocalDateTime dueDate;
        private JsonNode lineItems;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateInvoiceRequest {
        private Long subtotalCents;
        private Long platformFeeCents;
        private Long taxAmountCents;
        private Long totalCents;
        private String notes;
        private LocalDateTime dueDate;
        private JsonNode lineItems;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InvoiceResponse {
        private Long id;
        private String invoiceNumber;
        private Long paymentId;
        private Long companyId;
        private String companyName;
        private Long freelancerId;
        private String freelancerName;
        private Long subtotalCents;
        private Long platformFeeCents;
        private Long taxAmountCents;
        private Long totalCents;
        private String currency;
        private InvoiceStatus status;
        private JsonNode lineItems;
        private String notes;
        private String pdfUrl;
        private LocalDateTime invoiceDate;
        private LocalDateTime dueDate;
        private LocalDateTime paidAt;
        private LocalDateTime createdAt;

        public static InvoiceResponse fromEntity(Invoice invoice) {
            return InvoiceResponse.builder()
                    .id(invoice.getId())
                    .invoiceNumber(invoice.getInvoiceNumber())
                    .paymentId(invoice.getPayment() != null ? invoice.getPayment().getId() : null)
                    .companyId(invoice.getCompany().getId())
                    .companyName(invoice.getCompany().getCompanyName())
                    .freelancerId(invoice.getFreelancer().getId())
                    .freelancerName(invoice.getFreelancer().getUser().getFullName())
                    .subtotalCents(invoice.getSubtotalCents())
                    .platformFeeCents(invoice.getPlatformFeeCents())
                    .taxAmountCents(invoice.getTaxAmountCents())
                    .totalCents(invoice.getTotalCents())
                    .currency(invoice.getCurrency())
                    .status(invoice.getStatus())
                    .lineItems(invoice.getLineItems())
                    .notes(invoice.getNotes())
                    .pdfUrl(invoice.getPdfUrl())
                    .invoiceDate(invoice.getInvoiceDate())
                    .dueDate(invoice.getDueDate())
                    .paidAt(invoice.getPaidAt())
                    .createdAt(invoice.getCreatedAt())
                    .build();
        }
    }
}
