package com.designer.marketplace.dto;

import java.time.LocalDateTime;

import com.designer.marketplace.entity.JobApplication;
import com.fasterxml.jackson.databind.JsonNode;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for Job Application responses
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobApplicationResponse {

    private Long id;
    private Long jobId;
    private String jobTitle;
    private Long applicantId;
    private String applicantName;
    private String fullName;
    private String email;
    private String phone;
    private String coverLetter;
    private String resumeUrl;
    private String portfolioUrl;
    private String linkedinUrl;
    private String[] additionalDocuments;
    private JsonNode answers;
    private String status;
    private String companyNotes;
    private String rejectionReason;
    private LocalDateTime appliedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime reviewedAt;

    /**
     * Nested DTO for applicant information
     */
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ApplicantInfo {
        private Long id;
        private String username;
        private String fullName;
        private String profileImageUrl;
        private String location;
        private String bio;
    }

    /**
     * Convert JobApplication entity to JobApplicationResponse DTO
     */
    public static JobApplicationResponse fromEntity(JobApplication application) {
        if (application == null) {
            return null;
        }

        String applicantName = null;
        if (application.getApplicant() != null) {
            applicantName = application.getApplicant().getFullName();
        }

        return JobApplicationResponse.builder()
                .id(application.getId())
                .jobId(application.getJob() != null ? application.getJob().getId() : null)
                .jobTitle(application.getJob() != null ? application.getJob().getTitle() : null)
                .applicantId(application.getApplicant() != null ? application.getApplicant().getId() : null)
                .applicantName(applicantName)
                .fullName(application.getFullName())
                .email(application.getEmail())
                .phone(application.getPhone())
                .coverLetter(application.getCoverLetter())
                .resumeUrl(application.getResumeUrl())
                .portfolioUrl(application.getPortfolioUrl())
                .linkedinUrl(application.getLinkedinUrl())
                .additionalDocuments(application.getAdditionalDocuments())
                .answers(application.getAnswers())
                .status(application.getStatus() != null ? application.getStatus().name() : null)
                .companyNotes(application.getCompanyNotes())
                .rejectionReason(application.getRejectionReason())
                .appliedAt(application.getAppliedAt())
                .createdAt(application.getCreatedAt())
                .updatedAt(application.getUpdatedAt())
                .reviewedAt(application.getReviewedAt())
                .build();
    }
}
