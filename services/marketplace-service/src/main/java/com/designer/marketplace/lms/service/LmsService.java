package com.designer.marketplace.lms.service;

import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.designer.marketplace.entity.User;
import com.designer.marketplace.lms.dto.CourseResponse;
import com.designer.marketplace.lms.dto.CreateCourseRequest;
import com.designer.marketplace.lms.dto.EnrollmentResponse;
import com.designer.marketplace.lms.entity.Course;
import com.designer.marketplace.lms.entity.Course.CourseCategory;
import com.designer.marketplace.lms.entity.Course.CourseLevel;
import com.designer.marketplace.lms.entity.Course.CourseStatus;
import com.designer.marketplace.lms.entity.Enrollment;
import com.designer.marketplace.lms.entity.Enrollment.EnrollmentStatus;
import com.designer.marketplace.lms.entity.Enrollment.LessonProgress;
import com.designer.marketplace.lms.entity.Lesson;
import com.designer.marketplace.lms.entity.Module;
import com.designer.marketplace.lms.repository.CourseRepository;
import com.designer.marketplace.lms.repository.EnrollmentRepository;
import com.designer.marketplace.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for Learning Management System operations.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class LmsService {

    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    // ================== Course Operations ==================

    /**
     * Create a new course
     */
    public CourseResponse createCourse(Long instructorId, CreateCourseRequest request) {
        User instructor = userRepository.findById(instructorId)
                .orElseThrow(() -> new RuntimeException("Instructor not found"));

        log.info("Creating course '{}' by instructor {}", request.getTitle(), instructorId);

        Course course = request.toEntity(instructorId, instructor.getFullName());
        course = courseRepository.save(course);

        log.info("Course created with ID: {}", course.getId());
        return CourseResponse.fromEntity(course);
    }

    /**
     * Update a course
     */
    public CourseResponse updateCourse(String courseId, Long instructorId, CreateCourseRequest request) {
        Course course = getCourseByIdAndInstructor(courseId, instructorId);

        log.info("Updating course {}", courseId);

        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setShortDescription(request.getShortDescription());
        course.setThumbnailUrl(request.getThumbnailUrl());
        course.setPreviewVideoUrl(request.getPreviewVideoUrl());
        course.setCategory(request.getCategory());
        course.setLevel(request.getLevel());
        course.setPrice(request.getPrice());
        course.setCurrency(request.getCurrency() != null ? request.getCurrency() : "USD");
        course.setTags(request.getTags() != null ? request.getTags() : List.of());
        course.setObjectives(request.getObjectives() != null ? request.getObjectives() : List.of());
        course.setRequirements(request.getRequirements() != null ? request.getRequirements() : List.of());

        course = courseRepository.save(course);
        return CourseResponse.fromEntity(course);
    }

    /**
     * Get course by ID
     */
    public CourseResponse getCourse(String courseId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found: " + courseId));
        return CourseResponse.fromEntity(course);
    }

    /**
     * Get course by slug
     */
    public CourseResponse getCourseBySlug(String slug) {
        Course course = courseRepository.findBySlug(slug)
                .orElseThrow(() -> new RuntimeException("Course not found: " + slug));
        return CourseResponse.fromEntity(course);
    }

    /**
     * Get courses by instructor
     */
    public Page<CourseResponse> getCoursesByInstructor(Long instructorId, Pageable pageable) {
        return courseRepository.findByInstructorId(instructorId, pageable)
                .map(CourseResponse::fromEntitySummary);
    }

    /**
     * Search published courses
     */
    public Page<CourseResponse> searchCourses(
            String searchTerm,
            CourseCategory category,
            CourseLevel level,
            Pageable pageable) {

        if (searchTerm != null && !searchTerm.isBlank()) {
            return courseRepository.searchCourses(CourseStatus.PUBLISHED, searchTerm.trim(), pageable)
                    .map(CourseResponse::fromEntitySummary);
        }

        if (category != null && level != null) {
            return courseRepository.findByStatusAndCategoryAndLevel(CourseStatus.PUBLISHED, category, level, pageable)
                    .map(CourseResponse::fromEntitySummary);
        }

        if (category != null) {
            return courseRepository.findByStatusAndCategory(CourseStatus.PUBLISHED, category, pageable)
                    .map(CourseResponse::fromEntitySummary);
        }

        if (level != null) {
            return courseRepository.findByStatusAndLevel(CourseStatus.PUBLISHED, level, pageable)
                    .map(CourseResponse::fromEntitySummary);
        }

        return courseRepository.findByStatus(CourseStatus.PUBLISHED, pageable)
                .map(CourseResponse::fromEntitySummary);
    }

    /**
     * Get popular courses
     */
    public Page<CourseResponse> getPopularCourses(Pageable pageable) {
        return courseRepository.findByStatusOrderByTotalEnrollmentsDesc(CourseStatus.PUBLISHED, pageable)
                .map(CourseResponse::fromEntitySummary);
    }

    /**
     * Get top-rated courses
     */
    public Page<CourseResponse> getTopRatedCourses(Pageable pageable) {
        return courseRepository.findByStatusOrderByAverageRatingDesc(CourseStatus.PUBLISHED, pageable)
                .map(CourseResponse::fromEntitySummary);
    }

    /**
     * Get newest courses
     */
    public Page<CourseResponse> getNewestCourses(Pageable pageable) {
        return courseRepository.findByStatusOrderByPublishedAtDesc(CourseStatus.PUBLISHED, pageable)
                .map(CourseResponse::fromEntitySummary);
    }

    /**
     * Publish a course
     */
    public CourseResponse publishCourse(String courseId, Long instructorId) {
        Course course = getCourseByIdAndInstructor(courseId, instructorId);

        // Validate course has content
        if (course.getModules() == null || course.getModules().isEmpty()) {
            throw new RuntimeException("Course must have at least one module to publish");
        }

        course.setStatus(CourseStatus.PUBLISHED);
        course.setPublishedAt(Instant.now());
        course.recalculateStats();

        course = courseRepository.save(course);
        log.info("Course {} published", courseId);

        return CourseResponse.fromEntity(course);
    }

    /**
     * Archive a course
     */
    public CourseResponse archiveCourse(String courseId, Long instructorId) {
        Course course = getCourseByIdAndInstructor(courseId, instructorId);
        course.setStatus(CourseStatus.ARCHIVED);
        course = courseRepository.save(course);
        log.info("Course {} archived", courseId);
        return CourseResponse.fromEntity(course);
    }

    /**
     * Delete a course (only drafts)
     */
    public void deleteCourse(String courseId, Long instructorId) {
        Course course = getCourseByIdAndInstructor(courseId, instructorId);

        if (course.getStatus() != CourseStatus.DRAFT) {
            throw new RuntimeException("Only draft courses can be deleted");
        }

        courseRepository.delete(course);
        log.info("Course {} deleted", courseId);
    }

    // ================== Module & Lesson Operations ==================

    /**
     * Add a module to a course
     */
    public CourseResponse addModule(String courseId, Long instructorId, Module module) {
        Course course = getCourseByIdAndInstructor(courseId, instructorId);

        module.setId(UUID.randomUUID().toString());
        module.setOrderIndex(course.getModules().size());

        course.getModules().add(module);
        course.recalculateStats();
        course = courseRepository.save(course);

        log.info("Module '{}' added to course {}", module.getTitle(), courseId);
        return CourseResponse.fromEntity(course);
    }

    /**
     * Add a lesson to a module
     */
    public CourseResponse addLesson(String courseId, String moduleId, Long instructorId, Lesson lesson) {
        Course course = getCourseByIdAndInstructor(courseId, instructorId);

        Module module = course.getModules().stream()
                .filter(m -> m.getId().equals(moduleId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Module not found: " + moduleId));

        lesson.setId(UUID.randomUUID().toString());
        lesson.setOrderIndex(module.getLessons().size());

        module.getLessons().add(lesson);
        course.recalculateStats();
        course = courseRepository.save(course);

        log.info("Lesson '{}' added to module {} in course {}", lesson.getTitle(), moduleId, courseId);
        return CourseResponse.fromEntity(course);
    }

    // ================== Enrollment Operations ==================

    /**
     * Enroll a user in a course
     */
    public EnrollmentResponse enrollUser(Long userId, String courseId) {
        // Check if already enrolled
        if (enrollmentRepository.existsByUserIdAndCourseId(userId, courseId)) {
            throw new RuntimeException("User is already enrolled in this course");
        }

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found: " + courseId));

        if (course.getStatus() != CourseStatus.PUBLISHED) {
            throw new RuntimeException("Cannot enroll in unpublished course");
        }

        log.info("Enrolling user {} in course {}", userId, courseId);

        Enrollment enrollment = Enrollment.builder()
                .userId(userId)
                .courseId(courseId)
                .courseName(course.getTitle())
                .status(EnrollmentStatus.ACTIVE)
                .totalLessons(course.getTotalLessons())
                .build();

        enrollment = enrollmentRepository.save(enrollment);

        // Update course enrollment count
        course.setTotalEnrollments(course.getTotalEnrollments() + 1);
        courseRepository.save(course);

        log.info("User {} enrolled in course {} with enrollment ID {}", userId, courseId, enrollment.getId());
        return EnrollmentResponse.fromEntity(enrollment);
    }

    /**
     * Get user's enrollments
     */
    public Page<EnrollmentResponse> getUserEnrollments(Long userId, Pageable pageable) {
        return enrollmentRepository.findByUserId(userId, pageable)
                .map(EnrollmentResponse::fromEntitySummary);
    }

    /**
     * Get enrollment details
     */
    public EnrollmentResponse getEnrollment(String enrollmentId, Long userId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        if (!enrollment.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to enrollment");
        }

        return EnrollmentResponse.fromEntity(enrollment);
    }

    /**
     * Get enrollment by user and course
     */
    public EnrollmentResponse getEnrollmentByCourse(Long userId, String courseId) {
        Enrollment enrollment = enrollmentRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseThrow(() -> new RuntimeException("Not enrolled in this course"));

        return EnrollmentResponse.fromEntity(enrollment);
    }

    /**
     * Update lesson progress
     */
    @Transactional
    public EnrollmentResponse updateLessonProgress(
            String enrollmentId,
            Long userId,
            String lessonId,
            String moduleId,
            boolean completed,
            Integer progressPercent,
            Integer positionSeconds) {

        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        if (!enrollment.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to enrollment");
        }

        // Find existing lesson progress
        LessonProgress progress = enrollment.getLessonProgress().stream()
                .filter(lp -> lp.getLessonId().equals(lessonId))
                .findFirst()
                .orElse(null);

        // Create new progress if not found
        if (progress == null) {
            progress = LessonProgress.builder()
                    .lessonId(lessonId)
                    .moduleId(moduleId)
                    .startedAt(Instant.now())
                    .build();
            enrollment.getLessonProgress().add(progress);
        }

        // Update progress
        progress.setLastAccessedAt(Instant.now());
        if (progressPercent != null) {
            progress.setProgressPercent(progressPercent);
        }
        if (positionSeconds != null) {
            progress.setLastPositionSeconds(positionSeconds);
        }
        if (completed && !Boolean.TRUE.equals(progress.getCompleted())) {
            progress.setCompleted(true);
            progress.setCompletedAt(Instant.now());
        }

        // Update enrollment
        enrollment.setLastAccessedAt(Instant.now());
        enrollment.recalculateProgress();

        Enrollment savedEnrollment = enrollmentRepository.save(enrollment);

        log.info("Updated progress for lesson {} in enrollment {}: completed={}, progress={}%",
                lessonId, enrollmentId, completed, progressPercent);

        return EnrollmentResponse.fromEntity(savedEnrollment);
    }

    /**
     * Check if user is enrolled in a course
     */
    public boolean isEnrolled(Long userId, String courseId) {
        return enrollmentRepository.existsByUserIdAndCourseId(userId, courseId);
    }

    /**
     * Get course statistics for instructor
     */
    public Map<String, Object> getInstructorStats(Long instructorId) {
        List<Course> courses = courseRepository.findByInstructorId(instructorId);

        int totalCourses = courses.size();
        int publishedCourses = (int) courses.stream()
                .filter(c -> c.getStatus() == CourseStatus.PUBLISHED)
                .count();
        int totalEnrollments = courses.stream()
                .mapToInt(c -> c.getTotalEnrollments() != null ? c.getTotalEnrollments() : 0)
                .sum();
        double avgRating = courses.stream()
                .filter(c -> c.getAverageRating() != null && c.getAverageRating() > 0)
                .mapToDouble(Course::getAverageRating)
                .average()
                .orElse(0.0);

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalCourses", totalCourses);
        stats.put("publishedCourses", publishedCourses);
        stats.put("draftCourses", totalCourses - publishedCourses);
        stats.put("totalEnrollments", totalEnrollments);
        stats.put("averageRating", Math.round(avgRating * 10.0) / 10.0);

        return stats;
    }

    // ================== Helper Methods ==================

    private Course getCourseByIdAndInstructor(String courseId, Long instructorId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found: " + courseId));

        if (!course.getInstructorId().equals(instructorId)) {
            throw new RuntimeException("Not authorized to modify this course");
        }

        return course;
    }
}
