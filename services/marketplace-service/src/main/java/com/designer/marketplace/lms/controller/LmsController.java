package com.designer.marketplace.lms.controller;

import com.designer.marketplace.lms.dto.CourseResponse;
import com.designer.marketplace.lms.dto.CreateCourseRequest;
import com.designer.marketplace.lms.dto.EnrollmentResponse;
import com.designer.marketplace.lms.entity.Course.CourseCategory;
import com.designer.marketplace.lms.entity.Course.CourseLevel;
import com.designer.marketplace.lms.entity.Lesson;
import com.designer.marketplace.lms.entity.Module;
import com.designer.marketplace.lms.service.LmsService;
import com.designer.marketplace.security.UserPrincipal;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * REST controller for Learning Management System operations.
 */
@RestController
@RequestMapping("/api/lms")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "LMS", description = "Learning Management System endpoints")
public class LmsController {

    private final LmsService lmsService;

    // ================== Public Course Endpoints ==================

    @GetMapping("/courses")
    @Operation(summary = "Browse published courses", description = "Search and filter published courses")
    public ResponseEntity<Page<CourseResponse>> browseCourses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) CourseCategory category,
            @RequestParam(required = false) CourseLevel level,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = sortDir.equalsIgnoreCase("asc") 
                ? Sort.by(sortBy).ascending() 
                : Sort.by(sortBy).descending();

        return ResponseEntity.ok(
                lmsService.searchCourses(search, category, level, PageRequest.of(page, size, sort))
        );
    }

    @GetMapping("/courses/popular")
    @Operation(summary = "Get popular courses", description = "Get courses sorted by enrollment count")
    public ResponseEntity<Page<CourseResponse>> getPopularCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(lmsService.getPopularCourses(PageRequest.of(page, size)));
    }

    @GetMapping("/courses/top-rated")
    @Operation(summary = "Get top-rated courses", description = "Get courses sorted by average rating")
    public ResponseEntity<Page<CourseResponse>> getTopRatedCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(lmsService.getTopRatedCourses(PageRequest.of(page, size)));
    }

    @GetMapping("/courses/newest")
    @Operation(summary = "Get newest courses", description = "Get recently published courses")
    public ResponseEntity<Page<CourseResponse>> getNewestCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(lmsService.getNewestCourses(PageRequest.of(page, size)));
    }

    @GetMapping("/courses/{courseId}")
    @Operation(summary = "Get course details", description = "Get full course details including modules and lessons")
    public ResponseEntity<CourseResponse> getCourse(@PathVariable String courseId) {
        return ResponseEntity.ok(lmsService.getCourse(courseId));
    }

    @GetMapping("/courses/slug/{slug}")
    @Operation(summary = "Get course by slug", description = "Get course by SEO-friendly URL slug")
    public ResponseEntity<CourseResponse> getCourseBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(lmsService.getCourseBySlug(slug));
    }

    // ================== Instructor Course Management ==================

    @PostMapping("/instructor/courses")
    @Operation(summary = "Create a course", description = "Create a new course as instructor")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<CourseResponse> createCourse(
            @AuthenticationPrincipal UserPrincipal user,
            @Valid @RequestBody CreateCourseRequest request) {

        log.info("Instructor {} creating new course: {}", user.getId(), request.getTitle());
        return ResponseEntity.ok(lmsService.createCourse(user.getId(), request));
    }

    @PutMapping("/instructor/courses/{courseId}")
    @Operation(summary = "Update a course", description = "Update course details")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<CourseResponse> updateCourse(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String courseId,
            @Valid @RequestBody CreateCourseRequest request) {

        return ResponseEntity.ok(lmsService.updateCourse(courseId, user.getId(), request));
    }

    @GetMapping("/instructor/courses")
    @Operation(summary = "Get instructor's courses", description = "Get all courses created by the instructor")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Page<CourseResponse>> getInstructorCourses(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(
                lmsService.getCoursesByInstructor(user.getId(), PageRequest.of(page, size))
        );
    }

    @PostMapping("/instructor/courses/{courseId}/publish")
    @Operation(summary = "Publish a course", description = "Make a course publicly available")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<CourseResponse> publishCourse(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String courseId) {

        return ResponseEntity.ok(lmsService.publishCourse(courseId, user.getId()));
    }

    @PostMapping("/instructor/courses/{courseId}/archive")
    @Operation(summary = "Archive a course", description = "Archive a course (hide from listings)")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<CourseResponse> archiveCourse(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String courseId) {

        return ResponseEntity.ok(lmsService.archiveCourse(courseId, user.getId()));
    }

    @DeleteMapping("/instructor/courses/{courseId}")
    @Operation(summary = "Delete a draft course", description = "Delete a course (draft only)")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> deleteCourse(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String courseId) {

        lmsService.deleteCourse(courseId, user.getId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/instructor/courses/{courseId}/modules")
    @Operation(summary = "Add a module", description = "Add a new module to a course")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<CourseResponse> addModule(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String courseId,
            @RequestBody Module module) {

        return ResponseEntity.ok(lmsService.addModule(courseId, user.getId(), module));
    }

    @PostMapping("/instructor/courses/{courseId}/modules/{moduleId}/lessons")
    @Operation(summary = "Add a lesson", description = "Add a new lesson to a module")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<CourseResponse> addLesson(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String courseId,
            @PathVariable String moduleId,
            @RequestBody Lesson lesson) {

        return ResponseEntity.ok(lmsService.addLesson(courseId, moduleId, user.getId(), lesson));
    }

    @GetMapping("/instructor/stats")
    @Operation(summary = "Get instructor statistics", description = "Get course and enrollment statistics for instructor")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Map<String, Object>> getInstructorStats(
            @AuthenticationPrincipal UserPrincipal user) {

        return ResponseEntity.ok(lmsService.getInstructorStats(user.getId()));
    }

    // ================== Student Enrollment Endpoints ==================

    @PostMapping("/courses/{courseId}/enroll")
    @Operation(summary = "Enroll in a course", description = "Enroll the current user in a course")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<EnrollmentResponse> enrollInCourse(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String courseId) {

        return ResponseEntity.ok(lmsService.enrollUser(user.getId(), courseId));
    }

    @GetMapping("/my-learning")
    @Operation(summary = "Get my enrollments", description = "Get all courses the current user is enrolled in")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Page<EnrollmentResponse>> getMyEnrollments(
            @AuthenticationPrincipal UserPrincipal user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        return ResponseEntity.ok(
                lmsService.getUserEnrollments(user.getId(), PageRequest.of(page, size))
        );
    }

    @GetMapping("/enrollments/{enrollmentId}")
    @Operation(summary = "Get enrollment details", description = "Get detailed enrollment with progress")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<EnrollmentResponse> getEnrollment(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String enrollmentId) {

        return ResponseEntity.ok(lmsService.getEnrollment(enrollmentId, user.getId()));
    }

    @GetMapping("/courses/{courseId}/enrollment")
    @Operation(summary = "Get my enrollment for a course", description = "Check enrollment status for a specific course")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<EnrollmentResponse> getEnrollmentByCourse(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String courseId) {

        return ResponseEntity.ok(lmsService.getEnrollmentByCourse(user.getId(), courseId));
    }

    @PutMapping("/enrollments/{enrollmentId}/progress")
    @Operation(summary = "Update lesson progress", description = "Update progress for a lesson in an enrollment")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<EnrollmentResponse> updateProgress(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String enrollmentId,
            @RequestParam String lessonId,
            @RequestParam String moduleId,
            @RequestParam(defaultValue = "false") boolean completed,
            @RequestParam(required = false) Integer progressPercent,
            @RequestParam(required = false) Integer positionSeconds) {

        return ResponseEntity.ok(
                lmsService.updateLessonProgress(
                        enrollmentId, user.getId(), lessonId, moduleId,
                        completed, progressPercent, positionSeconds
                )
        );
    }

    @GetMapping("/courses/{courseId}/is-enrolled")
    @Operation(summary = "Check if enrolled", description = "Check if current user is enrolled in a course")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Map<String, Boolean>> isEnrolled(
            @AuthenticationPrincipal UserPrincipal user,
            @PathVariable String courseId) {

        boolean enrolled = lmsService.isEnrolled(user.getId(), courseId);
        return ResponseEntity.ok(Map.of("enrolled", enrolled));
    }
}
