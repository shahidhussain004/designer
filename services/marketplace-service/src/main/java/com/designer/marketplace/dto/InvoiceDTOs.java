package com.designer.marketplace.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.designer.marketplace.entity.Invoice;
import com.designer.marketplace.entity.Invoice.InvoiceStatus;
import com.designer.marketplace.entity.Invoice.InvoiceType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class InvoiceDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InvoiceLineItem {
        private String description;
        private Long quantity;
        private Long unitPrice;
        private Long amount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BillingInfo {
        private String name;
        private String email;
        private String address;
        private String city;
        private String state;
        private String postalCode;
        private String country;
        private String taxId;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateInvoiceRequest {
        private Long paymentId;
        private Long milestoneId;
        private InvoiceType invoiceType;
        private List<InvoiceLineItem> lineItems;
        private String notes;
        private LocalDateTime dueDate;
        private BillingInfo clientBillingInfo;
        private BillingInfo freelancerBillingInfo;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateInvoiceRequest {
        private List<InvoiceLineItem> lineItems;
        private String notes;
        private LocalDateTime dueDate;
        private BillingInfo clientBillingInfo;
        private BillingInfo freelancerBillingInfo;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InvoiceResponse {
        private Long id;
        private String invoiceNumber;
        private Long paymentId;
        private Long milestoneId;
        private Long clientId;
        private String clientName;
        private String clientEmail;
        private Long freelancerId;
        private String freelancerName;
        private String freelancerEmail;
        private Long jobId;
        private String jobTitle;
        private InvoiceType invoiceType;
        private Long subtotal;
        private Long platformFee;
        private Long taxAmount;
        private Long total;
        private String currency;
        private InvoiceStatus status;
        private List<InvoiceLineItem> lineItems;
        private String notes;
        private String pdfUrl;
        private LocalDateTime invoiceDate;
        private LocalDateTime dueDate;
        private LocalDateTime paidAt;
        private LocalDateTime createdAt;
        private BillingInfo clientBillingInfo;
        private BillingInfo freelancerBillingInfo;

        public static InvoiceResponse fromEntity(Invoice invoice) {
            return InvoiceResponse.builder()
                    .id(invoice.getId())
                    .invoiceNumber(invoice.getInvoiceNumber())
                    .paymentId(invoice.getPayment().getId())
                    .milestoneId(invoice.getMilestone() != null ? invoice.getMilestone().getId() : null)
                    .clientId(invoice.getClient().getId())
                    .clientName(invoice.getClient().getFullName())
                    .clientEmail(invoice.getClient().getEmail())
                    .freelancerId(invoice.getFreelancer().getId())
                    .freelancerName(invoice.getFreelancer().getFullName())
                    .freelancerEmail(invoice.getFreelancer().getEmail())
                    .jobId(invoice.getProject().getId())
                    .jobTitle(invoice.getProject().getTitle())
                    .invoiceType(invoice.getInvoiceType())
                    .subtotal(invoice.getSubtotal())
                    .platformFee(invoice.getPlatformFee())
                    .taxAmount(invoice.getTaxAmount())
                    .total(invoice.getTotal())
                    .currency(invoice.getCurrency())
                    .status(invoice.getStatus())
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
