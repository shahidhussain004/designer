package com.designer.marketplace.lms.repository;

import com.designer.marketplace.lms.entity.Course;
import com.designer.marketplace.lms.entity.Course.CourseCategory;
import com.designer.marketplace.lms.entity.Course.CourseLevel;
import com.designer.marketplace.lms.entity.Course.CourseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * MongoDB repository for Course documents.
 */
@Repository
public interface CourseRepository extends MongoRepository<Course, String> {

    /**
     * Find courses by instructor ID
     */
    List<Course> findByInstructorId(Long instructorId);

    Page<Course> findByInstructorId(Long instructorId, Pageable pageable);

    /**
     * Find courses by status
     */
    Page<Course> findByStatus(CourseStatus status, Pageable pageable);

    /**
     * Find published courses by category
     */
    Page<Course> findByStatusAndCategory(CourseStatus status, CourseCategory category, Pageable pageable);

    /**
     * Find published courses by level
     */
    Page<Course> findByStatusAndLevel(CourseStatus status, CourseLevel level, Pageable pageable);

    /**
     * Find published courses by category and level
     */
    Page<Course> findByStatusAndCategoryAndLevel(
            CourseStatus status, 
            CourseCategory category, 
            CourseLevel level, 
            Pageable pageable
    );

    /**
     * Search courses by title (case insensitive)
     */
    @Query("{ 'status': ?0, 'title': { $regex: ?1, $options: 'i' } }")
    Page<Course> searchByTitle(CourseStatus status, String titlePattern, Pageable pageable);

    /**
     * Full text search on title and description
     */
    @Query("{ 'status': ?0, $or: [ { 'title': { $regex: ?1, $options: 'i' } }, { 'description': { $regex: ?1, $options: 'i' } } ] }")
    Page<Course> searchCourses(CourseStatus status, String searchTerm, Pageable pageable);

    /**
     * Find courses by tags
     */
    @Query("{ 'status': ?0, 'tags': { $in: ?1 } }")
    Page<Course> findByTags(CourseStatus status, List<String> tags, Pageable pageable);

    /**
     * Find by slug (for SEO-friendly URLs)
     */
    Optional<Course> findBySlug(String slug);

    /**
     * Find top-rated published courses
     */
    Page<Course> findByStatusOrderByAverageRatingDesc(CourseStatus status, Pageable pageable);

    /**
     * Find most popular (by enrollments) published courses
     */
    Page<Course> findByStatusOrderByTotalEnrollmentsDesc(CourseStatus status, Pageable pageable);

    /**
     * Find newest published courses
     */
    Page<Course> findByStatusOrderByPublishedAtDesc(CourseStatus status, Pageable pageable);

    /**
     * Count courses by instructor
     */
    long countByInstructorId(Long instructorId);

    /**
     * Count courses by status
     */
    long countByStatus(CourseStatus status);
}
