package com.designer.marketplace.lms.dto;

import java.math.BigDecimal;
import java.util.List;

import com.designer.marketplace.lms.entity.Course;
import com.designer.marketplace.lms.entity.Course.CourseCategory;
import com.designer.marketplace.lms.entity.Course.CourseLevel;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Request DTO for creating a new course.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateCourseRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 50, max = 5000, message = "Description must be between 50 and 5000 characters")
    private String description;

    @Size(max = 300, message = "Short description must be at most 300 characters")
    private String shortDescription;

    private String thumbnailUrl;

    private String previewVideoUrl;

    @NotNull(message = "Category is required")
    private CourseCategory category;

    @NotNull(message = "Level is required")
    private CourseLevel level;

    @Positive(message = "Price must be positive")
    private BigDecimal price;

    @Builder.Default
    private String currency = "USD";

    private List<String> tags;

    private List<String> objectives;

    private List<String> requirements;

    /**
     * Convert to Course entity
     */
    public Course toEntity(Long instructorId, String instructorName) {
        return Course.builder()
                .title(title)
                .description(description)
                .shortDescription(shortDescription)
                .instructorId(instructorId)
                .instructorName(instructorName)
                .thumbnailUrl(thumbnailUrl)
                .previewVideoUrl(previewVideoUrl)
                .category(category)
                .level(level)
                .price(price != null ? price : BigDecimal.ZERO)
                .currency(currency != null ? currency : "USD")
                .tags(tags != null ? tags : List.of())
                .objectives(objectives != null ? objectives : List.of())
                .requirements(requirements != null ? requirements : List.of())
                .status(Course.CourseStatus.DRAFT)
                .slug(generateSlug(title))
                .build();
    }

    private String generateSlug(String title) {
        return title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }
}
