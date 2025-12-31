package com.designer.marketplace.dto;

import java.time.LocalDateTime;
import java.util.Map;

import com.designer.marketplace.entity.JobApplication;

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
    private ApplicantInfo applicant;
    private String fullName;
    private String email;
    private String phone;
    private String resumeUrl;
    private String coverLetter;
    private String portfolioUrl;
    private String linkedinUrl;
    private Map<String, Object> answers;
    private String status;
    private String employerNotes;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;

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

        ApplicantInfo applicantInfo = null;
        if (application.getApplicant() != null) {
            applicantInfo = ApplicantInfo.builder()
                    .id(application.getApplicant().getId())
                    .username(application.getApplicant().getUsername())
                    .fullName(application.getApplicant().getFullName())
                    .profileImageUrl(application.getApplicant().getProfileImageUrl())
                    .location(application.getApplicant().getLocation())
                    .bio(application.getApplicant().getBio())
                    .build();
        }

        // Convert JsonNode to Map
        Map<String, Object> answersMap = null;
        if (application.getAnswers() != null) {
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            answersMap = mapper.convertValue(application.getAnswers(), 
                    new com.fasterxml.jackson.core.type.TypeReference<Map<String, Object>>() {});
        }

        return JobApplicationResponse.builder()
                .id(application.getId())
                .jobId(application.getJob() != null ? application.getJob().getId() : null)
                .jobTitle(application.getJob() != null ? application.getJob().getTitle() : null)
                .applicantId(application.getApplicant() != null ? application.getApplicant().getId() : null)
                .applicant(applicantInfo)
                .fullName(application.getFullName())
                .email(application.getEmail())
                .phone(application.getPhone())
                .resumeUrl(application.getResumeUrl())
                .coverLetter(application.getCoverLetter())
                .portfolioUrl(application.getPortfolioUrl())
                .linkedinUrl(application.getLinkedinUrl())
                .answers(answersMap)
                .status(application.getStatus() != null ? application.getStatus().name() : null)
                .employerNotes(application.getEmployerNotes())
                .appliedAt(application.getAppliedAt())
                .updatedAt(application.getUpdatedAt())
                .build();
    }
}
