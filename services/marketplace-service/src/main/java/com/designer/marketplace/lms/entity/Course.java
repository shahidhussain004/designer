package com.designer.marketplace.lms.entity;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Course entity for Learning Management System.
 * Stored in MongoDB for flexible schema and nested content.
 */
@Document(collection = "courses")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode
@ToString
public class Course {

    @Id
    private String id;

    @Indexed
    private String title;

    private String description;

    private String shortDescription;

    @Indexed
    private Long instructorId;  // References PostgreSQL user

    private String instructorName;

    private String thumbnailUrl;

    private String previewVideoUrl;

    @Indexed
    private CourseCategory category;

    @Indexed
    private CourseLevel level;

    @Indexed
    private CourseStatus status;

    private BigDecimal price;

    private String currency;

    @Builder.Default
    private List<String> tags = new ArrayList<>();

    @Builder.Default
    private List<String> objectives = new ArrayList<>();

    @Builder.Default
    private List<String> requirements = new ArrayList<>();

    @Builder.Default
    private List<Module> modules = new ArrayList<>();

    // Statistics
    @Builder.Default
    private Integer totalEnrollments = 0;

    @Builder.Default
    private Double averageRating = 0.0;

    @Builder.Default
    private Integer reviewCount = 0;

    @Builder.Default
    private Integer totalDurationMinutes = 0;

    @Builder.Default
    private Integer totalLessons = 0;

    @CreatedDate
    private Instant createdAt;

    @LastModifiedDate
    private Instant updatedAt;

    private Instant publishedAt;

    // SEO
    private String slug;

    private String metaDescription;

    /**
     * Course status enum
     */
    public enum CourseStatus {
        DRAFT,
        PENDING_REVIEW,
        PUBLISHED,
        ARCHIVED
    }

    /**
     * Course level enum
     */
    public enum CourseLevel {
        BEGINNER,
        INTERMEDIATE,
        ADVANCED,
        ALL_LEVELS
    }

    /**
     * Course category enum
     */
    public enum CourseCategory {
        UI_DESIGN,
        UX_DESIGN,
        GRAPHIC_DESIGN,
        WEB_DEVELOPMENT,
        MOBILE_DEVELOPMENT,
        BRANDING,
        ILLUSTRATION,
        MOTION_GRAPHICS,
        PHOTOGRAPHY,
        VIDEO_EDITING,
        MARKETING,
        BUSINESS,
        OTHER
    }

    /**
     * Calculate and update total duration and lesson count from modules
     */
    public void recalculateStats() {
        int totalMins = 0;
        int lessonsCount = 0;
        
        if (modules != null) {
            for (Module module : modules) {
                if (module.getLessons() != null) {
                    lessonsCount += module.getLessons().size();
                    for (Lesson lesson : module.getLessons()) {
                        if (lesson.getDurationMinutes() != null) {
                            totalMins += lesson.getDurationMinutes();
                        }
                    }
                }
            }
        }
        
        this.totalDurationMinutes = totalMins;
        this.totalLessons = lessonsCount;
    }
}
