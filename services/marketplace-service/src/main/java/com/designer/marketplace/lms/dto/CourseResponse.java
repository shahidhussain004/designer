package com.designer.marketplace.lms.dto;

import com.designer.marketplace.lms.entity.Course;
import com.designer.marketplace.lms.entity.Course.*;
import com.designer.marketplace.lms.entity.Lesson;
import com.designer.marketplace.lms.entity.Module;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Response DTO for Course.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseResponse {

    private String id;
    private String title;
    private String description;
    private String shortDescription;
    private Long instructorId;
    private String instructorName;
    private String thumbnailUrl;
    private String previewVideoUrl;
    private CourseCategory category;
    private CourseLevel level;
    private CourseStatus status;
    private BigDecimal price;
    private String currency;
    private List<String> tags;
    private List<String> objectives;
    private List<String> requirements;
    private List<ModuleResponse> modules;
    private Integer totalEnrollments;
    private Double averageRating;
    private Integer reviewCount;
    private Integer totalDurationMinutes;
    private Integer totalLessons;
    private Instant createdAt;
    private Instant updatedAt;
    private Instant publishedAt;
    private String slug;

    /**
     * Create from Course entity (full details)
     */
    public static CourseResponse fromEntity(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .shortDescription(course.getShortDescription())
                .instructorId(course.getInstructorId())
                .instructorName(course.getInstructorName())
                .thumbnailUrl(course.getThumbnailUrl())
                .previewVideoUrl(course.getPreviewVideoUrl())
                .category(course.getCategory())
                .level(course.getLevel())
                .status(course.getStatus())
                .price(course.getPrice())
                .currency(course.getCurrency())
                .tags(course.getTags())
                .objectives(course.getObjectives())
                .requirements(course.getRequirements())
                .modules(course.getModules() != null 
                        ? course.getModules().stream().map(ModuleResponse::fromEntity).collect(Collectors.toList())
                        : List.of())
                .totalEnrollments(course.getTotalEnrollments())
                .averageRating(course.getAverageRating())
                .reviewCount(course.getReviewCount())
                .totalDurationMinutes(course.getTotalDurationMinutes())
                .totalLessons(course.getTotalLessons())
                .createdAt(course.getCreatedAt())
                .updatedAt(course.getUpdatedAt())
                .publishedAt(course.getPublishedAt())
                .slug(course.getSlug())
                .build();
    }

    /**
     * Create summary response (for listings)
     */
    public static CourseResponse fromEntitySummary(Course course) {
        return CourseResponse.builder()
                .id(course.getId())
                .title(course.getTitle())
                .shortDescription(course.getShortDescription())
                .instructorId(course.getInstructorId())
                .instructorName(course.getInstructorName())
                .thumbnailUrl(course.getThumbnailUrl())
                .category(course.getCategory())
                .level(course.getLevel())
                .status(course.getStatus())
                .price(course.getPrice())
                .currency(course.getCurrency())
                .totalEnrollments(course.getTotalEnrollments())
                .averageRating(course.getAverageRating())
                .reviewCount(course.getReviewCount())
                .totalDurationMinutes(course.getTotalDurationMinutes())
                .totalLessons(course.getTotalLessons())
                .slug(course.getSlug())
                .build();
    }

    /**
     * Module response DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ModuleResponse {
        private String id;
        private String title;
        private String description;
        private Integer orderIndex;
        private List<LessonResponse> lessons;
        private Boolean isPreview;
        private Integer totalDurationMinutes;

        public static ModuleResponse fromEntity(Module module) {
            return ModuleResponse.builder()
                    .id(module.getId())
                    .title(module.getTitle())
                    .description(module.getDescription())
                    .orderIndex(module.getOrderIndex())
                    .lessons(module.getLessons() != null 
                            ? module.getLessons().stream().map(LessonResponse::fromEntity).collect(Collectors.toList())
                            : List.of())
                    .isPreview(module.getIsPreview())
                    .totalDurationMinutes(module.getTotalDurationMinutes())
                    .build();
        }
    }

    /**
     * Lesson response DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LessonResponse {
        private String id;
        private String title;
        private String description;
        private Lesson.LessonType type;
        private Integer orderIndex;
        private Integer durationMinutes;
        private String videoUrl;
        private String videoThumbnailUrl;
        private Boolean isPreview;
        private Boolean requiresCompletion;
        private List<ResourceResponse> resources;

        public static LessonResponse fromEntity(Lesson lesson) {
            return LessonResponse.builder()
                    .id(lesson.getId())
                    .title(lesson.getTitle())
                    .description(lesson.getDescription())
                    .type(lesson.getType())
                    .orderIndex(lesson.getOrderIndex())
                    .durationMinutes(lesson.getDurationMinutes())
                    .videoUrl(lesson.getVideoUrl())
                    .videoThumbnailUrl(lesson.getVideoThumbnailUrl())
                    .isPreview(lesson.getIsPreview())
                    .requiresCompletion(lesson.getRequiresCompletion())
                    .resources(lesson.getResources() != null 
                            ? lesson.getResources().stream().map(ResourceResponse::fromEntity).collect(Collectors.toList())
                            : List.of())
                    .build();
        }
    }

    /**
     * Resource response DTO
     */
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResourceResponse {
        private String id;
        private String title;
        private String url;
        private Lesson.Resource.ResourceType type;
        private Long fileSizeBytes;

        public static ResourceResponse fromEntity(Lesson.Resource resource) {
            return ResourceResponse.builder()
                    .id(resource.getId())
                    .title(resource.getTitle())
                    .url(resource.getUrl())
                    .type(resource.getType())
                    .fileSizeBytes(resource.getFileSizeBytes())
                    .build();
        }
    }
}
