package com.designer.marketplace.lms.entity;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Enrollment tracks a user's enrollment in a course.
 * Stored in MongoDB for fast progress tracking.
 */
@Document(collection = "enrollments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode
@ToString
@CompoundIndexes({
    @CompoundIndex(name = "user_course_idx", def = "{'userId': 1, 'courseId': 1}", unique = true),
    @CompoundIndex(name = "course_status_idx", def = "{'courseId': 1, 'status': 1}")
})
public class Enrollment {

    @Id
    private String id;

    @Indexed
    private Long userId;  // References PostgreSQL user

    @Indexed
    private String courseId;

    private String courseName;

    private EnrollmentStatus status;

    @Builder.Default
    private Double progressPercent = 0.0;

    @Builder.Default
    private List<LessonProgress> lessonProgress = new ArrayList<>();

    @Builder.Default
    private Integer completedLessons = 0;

    private Integer totalLessons;

    // Time tracking
    @Builder.Default
    private Integer totalTimeSpentMinutes = 0;

    private Instant lastAccessedAt;

    private Instant completedAt;

    // Quiz tracking
    @Builder.Default
    private Integer quizzesPassed = 0;
    
    @Builder.Default
    private Integer totalQuizzes = 0;

    // Certificate
    private String certificateId;

    private Instant certificateIssuedAt;

    @CreatedDate
    private Instant enrolledAt;

    @LastModifiedDate
    private Instant updatedAt;

    /**
     * Enrollment status enum
     */
    public enum EnrollmentStatus {
        ACTIVE,
        COMPLETED,
        EXPIRED,
        REFUNDED,
        SUSPENDED
    }

    /**
     * Lesson progress tracking
     */
    public static class LessonProgress {
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

        public LessonProgress() {}

        public LessonProgress(String lessonId, String moduleId, Boolean completed, Integer progressPercent,
                             Integer lastPositionSeconds, Integer timeSpentMinutes, Instant startedAt,
                             Instant completedAt, Instant lastAccessedAt, Integer quizScore,
                             Integer quizAttempts, Boolean quizPassed) {
            this.lessonId = lessonId;
            this.moduleId = moduleId;
            this.completed = completed;
            this.progressPercent = progressPercent;
            this.lastPositionSeconds = lastPositionSeconds;
            this.timeSpentMinutes = timeSpentMinutes;
            this.startedAt = startedAt;
            this.completedAt = completedAt;
            this.lastAccessedAt = lastAccessedAt;
            this.quizScore = quizScore;
            this.quizAttempts = quizAttempts;
            this.quizPassed = quizPassed;
        }

        // Getters
        public String getLessonId() { return lessonId; }
        public String getModuleId() { return moduleId; }
        public Boolean getCompleted() { return completed; }
        public Integer getProgressPercent() { return progressPercent; }
        public Integer getLastPositionSeconds() { return lastPositionSeconds; }
        public Integer getTimeSpentMinutes() { return timeSpentMinutes; }
        public Instant getStartedAt() { return startedAt; }
        public Instant getCompletedAt() { return completedAt; }
        public Instant getLastAccessedAt() { return lastAccessedAt; }
        public Integer getQuizScore() { return quizScore; }
        public Integer getQuizAttempts() { return quizAttempts; }
        public Boolean getQuizPassed() { return quizPassed; }

        // Setters
        public void setLessonId(String lessonId) { this.lessonId = lessonId; }
        public void setModuleId(String moduleId) { this.moduleId = moduleId; }
        public void setCompleted(Boolean completed) { this.completed = completed; }
        public void setProgressPercent(Integer progressPercent) { this.progressPercent = progressPercent; }
        public void setLastPositionSeconds(Integer lastPositionSeconds) { this.lastPositionSeconds = lastPositionSeconds; }
        public void setTimeSpentMinutes(Integer timeSpentMinutes) { this.timeSpentMinutes = timeSpentMinutes; }
        public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }
        public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
        public void setLastAccessedAt(Instant lastAccessedAt) { this.lastAccessedAt = lastAccessedAt; }
        public void setQuizScore(Integer quizScore) { this.quizScore = quizScore; }
        public void setQuizAttempts(Integer quizAttempts) { this.quizAttempts = quizAttempts; }
        public void setQuizPassed(Boolean quizPassed) { this.quizPassed = quizPassed; }

        public static LessonProgressBuilder builder() { return new LessonProgressBuilder(); }

        public static class LessonProgressBuilder {
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

            public LessonProgressBuilder lessonId(String lessonId) { this.lessonId = lessonId; return this; }
            public LessonProgressBuilder moduleId(String moduleId) { this.moduleId = moduleId; return this; }
            public LessonProgressBuilder completed(Boolean completed) { this.completed = completed; return this; }
            public LessonProgressBuilder progressPercent(Integer progressPercent) { this.progressPercent = progressPercent; return this; }
            public LessonProgressBuilder lastPositionSeconds(Integer lastPositionSeconds) { this.lastPositionSeconds = lastPositionSeconds; return this; }
            public LessonProgressBuilder timeSpentMinutes(Integer timeSpentMinutes) { this.timeSpentMinutes = timeSpentMinutes; return this; }
            public LessonProgressBuilder startedAt(Instant startedAt) { this.startedAt = startedAt; return this; }
            public LessonProgressBuilder completedAt(Instant completedAt) { this.completedAt = completedAt; return this; }
            public LessonProgressBuilder lastAccessedAt(Instant lastAccessedAt) { this.lastAccessedAt = lastAccessedAt; return this; }
            public LessonProgressBuilder quizScore(Integer quizScore) { this.quizScore = quizScore; return this; }
            public LessonProgressBuilder quizAttempts(Integer quizAttempts) { this.quizAttempts = quizAttempts; return this; }
            public LessonProgressBuilder quizPassed(Boolean quizPassed) { this.quizPassed = quizPassed; return this; }
            public LessonProgress build() {
                return new LessonProgress(lessonId, moduleId, completed, progressPercent, lastPositionSeconds,
                        timeSpentMinutes, startedAt, completedAt, lastAccessedAt, quizScore, quizAttempts, quizPassed);
            }
        }
    }

    /**
     * Recalculate progress based on lesson completion
     */
    public void recalculateProgress() {
        if (totalLessons == null || totalLessons == 0) {
            this.progressPercent = 0.0;
            return;
        }
        
        long completed = lessonProgress.stream()
                .filter(lp -> Boolean.TRUE.equals(lp.getCompleted()))
                .count();
        
        this.completedLessons = (int) completed;
        this.progressPercent = (completed * 100.0) / totalLessons;
        
        if (this.progressPercent >= 100.0) {
            this.status = EnrollmentStatus.COMPLETED;
            if (this.completedAt == null) {
                this.completedAt = Instant.now();
            }
        }
    }
}
