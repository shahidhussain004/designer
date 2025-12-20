package com.designer.marketplace.lms.dto;

import com.designer.marketplace.lms.entity.Certificate;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CertificateResponse {

    private String id;
    private String courseId;
    private String courseTitle;
    private String studentName;
    private String studentEmail;
    private String instructorName;
    private String courseDurationHours;
    private String certificateNumber;
    private String certificateUrl;
    private String verificationUrl;
    private LocalDateTime issuedAt;
    private LocalDateTime expiresAt;
    private Integer finalScore;
    private Integer quizzesPassed;
    private Integer totalQuizzes;
    private Integer lessonsCompleted;
    private Integer totalLessons;
    private Certificate.CertificateType type;
    private Certificate.CertificateStatus status;
    
    public static CertificateResponse fromEntity(Certificate cert) {
        return CertificateResponse.builder()
                .id(cert.getId())
                .courseId(cert.getCourseId())
                .courseTitle(cert.getCourseTitle())
                .studentName(cert.getStudentName())
                .studentEmail(cert.getStudentEmail())
                .instructorName(cert.getInstructorName())
                .courseDurationHours(cert.getCourseDurationHours())
                .certificateNumber(cert.getCertificateNumber())
                .certificateUrl(cert.getCertificateUrl())
                .verificationUrl(cert.getVerificationUrl())
                .issuedAt(cert.getIssuedAt())
                .expiresAt(cert.getExpiresAt())
                .finalScore(cert.getFinalScore())
                .quizzesPassed(cert.getQuizzesPassed())
                .totalQuizzes(cert.getTotalQuizzes())
                .lessonsCompleted(cert.getLessonsCompleted())
                .totalLessons(cert.getTotalLessons())
                .type(cert.getType())
                .status(cert.getStatus())
                .build();
    }
}
