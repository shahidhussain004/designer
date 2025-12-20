package com.designer.marketplace.lms.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "certificates")
@CompoundIndex(name = "user_course_idx", def = "{'userId': 1, 'courseId': 1}", unique = true)
public class Certificate {

    @Id
    private String id;
    
    @Indexed
    private Long userId;
    
    @Indexed
    private String courseId;
    
    @Indexed
    private String enrollmentId;
    
    // Student information
    private String studentName;
    private String studentEmail;
    
    // Course information
    private String courseTitle;
    private String instructorName;
    private String courseDurationHours;
    
    // Certificate details
    @Indexed(unique = true)
    private String certificateNumber;  // Unique verification code
    
    private String certificateUrl;     // Download URL
    private String verificationUrl;    // Public verification page
    
    private LocalDateTime issuedAt;
    private LocalDateTime expiresAt;   // Optional expiration
    
    // Achievement details
    private Integer finalScore;        // Overall course score
    private Integer quizzesPassed;
    private Integer totalQuizzes;
    private Integer lessonsCompleted;
    private Integer totalLessons;
    
    @Builder.Default
    private CertificateType type = CertificateType.COMPLETION;
    
    @Builder.Default
    private CertificateStatus status = CertificateStatus.ACTIVE;
    
    public enum CertificateType {
        COMPLETION,      // Basic course completion
        ACHIEVEMENT,     // With distinction/honors
        PROFESSIONAL     // Professional certification
    }
    
    public enum CertificateStatus {
        ACTIVE,
        REVOKED,
        EXPIRED
    }
    
    public static String generateCertificateNumber() {
        return "CERT-" + System.currentTimeMillis() + "-" + 
               String.format("%04d", (int)(Math.random() * 10000));
    }
}
