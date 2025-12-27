package com.designer.marketplace.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.designer.marketplace.entity.Milestone;
import com.designer.marketplace.entity.Milestone.MilestoneStatus;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class MilestoneDTOs {

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateMilestoneRequest {
        @NotNull(message = "Job ID is required")
        private Long jobId;

        private Long proposalId;

        @NotBlank(message = "Title is required")
        private String title;

        private String description;

        @NotNull(message = "Sequence order is required")
        @Positive(message = "Sequence order must be positive")
        private Integer sequenceOrder;

        @NotNull(message = "Amount is required")
        @Positive(message = "Amount must be positive")
        private Long amount;

        @Builder.Default
        private String currency = "USD";

        private LocalDateTime dueDate;

        private String deliverables;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateMilestoneRequest {
        private String title;
        private String description;
        private Long amount;
        private LocalDateTime dueDate;
        private String deliverables;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SubmitMilestoneRequest {
        @NotBlank(message = "Deliverables description is required")
        private String deliverables;

        private String notes;

        private List<String> attachmentUrls;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApproveMilestoneRequest {
        private String feedback;
        private Integer rating;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RequestRevisionRequest {
        @NotBlank(message = "Revision notes are required")
        private String revisionNotes;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MilestoneResponse {
        private Long id;
        private Long jobId;
        private String jobTitle;
        private Long proposalId;
        private String title;
        private String description;
        private Integer sequenceOrder;
        private Long amount;
        private String currency;
        private LocalDateTime dueDate;
        private MilestoneStatus status;
        private String deliverables;
        private String revisionNotes;
        private Long paymentId;
        private Long escrowId;
        private LocalDateTime createdAt;
        private LocalDateTime startedAt;
        private LocalDateTime submittedAt;
        private LocalDateTime approvedAt;

        public static MilestoneResponse fromEntity(Milestone milestone) {
            return MilestoneResponse.builder()
                    .id(milestone.getId())
                    .jobId(milestone.getJob().getId())
                    .jobTitle(milestone.getJob().getTitle())
                    .proposalId(milestone.getProposal() != null ? milestone.getProposal().getId() : null)
                    .title(milestone.getTitle())
                    .description(milestone.getDescription())
                    .sequenceOrder(milestone.getSequenceOrder())
                    .amount(milestone.getAmount())
                    .currency(milestone.getCurrency())
                    .dueDate(milestone.getDueDate())
                    .status(milestone.getStatus())
                    .deliverables(milestone.getDeliverables())
                    .revisionNotes(milestone.getRevisionNotes())
                    .paymentId(milestone.getPayment() != null ? milestone.getPayment().getId() : null)
                    .escrowId(milestone.getEscrow() != null ? milestone.getEscrow().getId() : null)
                    .createdAt(milestone.getCreatedAt())
                    .startedAt(milestone.getStartedAt())
                    .submittedAt(milestone.getSubmittedAt())
                    .approvedAt(milestone.getApprovedAt())
                    .build();
        }
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MilestoneSummary {
        private Long jobId;
        private int totalMilestones;
        private int completedMilestones;
        private int pendingMilestones;
        private int inProgressMilestones;
        private Long totalAmount;
        private Long fundedAmount;
        private Long releasedAmount;
        private double progressPercentage;
    }
}
