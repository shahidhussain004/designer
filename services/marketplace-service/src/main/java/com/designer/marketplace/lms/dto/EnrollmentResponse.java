package com.designer.marketplace.lms.dto;

import com.designer.marketplace.lms.entity.Enrollment;
import com.designer.marketplace.lms.entity.Enrollment.EnrollmentStatus;
import lombok.*;

import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Response DTO for Enrollment.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EnrollmentResponse {

    private String id;
    private Long userId;
    private String courseId;
    private String courseName;
    private EnrollmentStatus status;
    private Double progressPercent;
    private Integer completedLessons;
    private Integer totalLessons;
    private Integer totalTimeSpentMinutes;
    private Instant lastAccessedAt;
    private Instant completedAt;
    private String certificateId;
    private Instant certificateIssuedAt;
    private Instant enrolledAt;
    private List<LessonProgressResponse> lessonProgress;

    /**
     * Create from Enrollment entity (full details)
     */
    public static EnrollmentResponse fromEntity(Enrollment enrollment) {
        return EnrollmentResponse.builder()
                .id(enrollment.getId())
                .userId(enrollment.getUserId())
                .courseId(enrollment.getCourseId())
                .courseName(enrollment.getCourseName())
                .status(enrollment.getStatus())
                .progressPercent(enrollment.getProgressPercent())
                .completedLessons(enrollment.getCompletedLessons())
                .totalLessons(enrollment.getTotalLessons())
                .totalTimeSpentMinutes(enrollment.getTotalTimeSpentMinutes())
                .lastAccessedAt(enrollment.getLastAccessedAt())
                .completedAt(enrollment.getCompletedAt())
                .certificateId(enrollment.getCertificateId())
                .certificateIssuedAt(enrollment.getCertificateIssuedAt())
                .enrolledAt(enrollment.getEnrolledAt())
                .lessonProgress(enrollment.getLessonProgress() != null 
                        ? enrollment.getLessonProgress().stream()
                                .map(LessonProgressResponse::fromEntity)
                                .collect(Collectors.toList())
                        : List.of())
                .build();
    }

    /**
     * Create summary response (for listings)
     */
    public static EnrollmentResponse fromEntitySummary(Enrollment enrollment) {
        return EnrollmentResponse.builder()
                .id(enrollment.getId())
                .userId(enrollment.getUserId())
                .courseId(enrollment.getCourseId())
                .courseName(enrollment.getCourseName())
                .status(enrollment.getStatus())
                .progressPercent(enrollment.getProgressPercent())
                .completedLessons(enrollment.getCompletedLessons())
                .totalLessons(enrollment.getTotalLessons())
                .lastAccessedAt(enrollment.getLastAccessedAt())
                .enrolledAt(enrollment.getEnrolledAt())
                .build();
    }

    /**
     * Lesson progress response DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LessonProgressResponse {
        private String lessonId;
        private String moduleId;
        private Boolean completed;
        private Integer progressPercent;
        private Integer lastPositionSeconds;
        private Integer timeSpentMinutes;
        private Instant startedAt;
        private Instant completedAt;
        private Instant lastAccessedAt;
        private Integer quizScore;
        private Integer quizAttempts;
        private Boolean quizPassed;

        public static LessonProgressResponse fromEntity(Enrollment.LessonProgress progress) {
            return LessonProgressResponse.builder()
                    .lessonId(progress.getLessonId())
                    .moduleId(progress.getModuleId())
                    .completed(progress.getCompleted())
                    .progressPercent(progress.getProgressPercent())
                    .lastPositionSeconds(progress.getLastPositionSeconds())
                    .timeSpentMinutes(progress.getTimeSpentMinutes())
                    .startedAt(progress.getStartedAt())
                    .completedAt(progress.getCompletedAt())
                    .lastAccessedAt(progress.getLastAccessedAt())
                    .quizScore(progress.getQuizScore())
                    .quizAttempts(progress.getQuizAttempts())
                    .quizPassed(progress.getQuizPassed())
                    .build();
        }
    }
}
