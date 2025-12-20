package com.designer.marketplace.lms.repository;

import com.designer.marketplace.lms.entity.Enrollment;
import com.designer.marketplace.lms.entity.Enrollment.EnrollmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * MongoDB repository for Enrollment documents.
 */
@Repository
public interface EnrollmentRepository extends MongoRepository<Enrollment, String> {

    /**
     * Find enrollment by user and course
     */
    Optional<Enrollment> findByUserIdAndCourseId(Long userId, String courseId);

    /**
     * Find all enrollments for a user
     */
    List<Enrollment> findByUserId(Long userId);

    Page<Enrollment> findByUserId(Long userId, Pageable pageable);

    /**
     * Find enrollments by user and status
     */
    List<Enrollment> findByUserIdAndStatus(Long userId, EnrollmentStatus status);

    Page<Enrollment> findByUserIdAndStatus(Long userId, EnrollmentStatus status, Pageable pageable);

    /**
     * Find all enrollments for a course
     */
    List<Enrollment> findByCourseId(String courseId);

    Page<Enrollment> findByCourseId(String courseId, Pageable pageable);

    /**
     * Check if user is enrolled in a course
     */
    boolean existsByUserIdAndCourseId(Long userId, String courseId);

    /**
     * Count enrollments by course
     */
    long countByCourseId(String courseId);

    /**
     * Count completed enrollments by course
     */
    long countByCourseIdAndStatus(String courseId, EnrollmentStatus status);

    /**
     * Count enrollments by user
     */
    long countByUserId(Long userId);

    /**
     * Find enrollments in progress (recently accessed) for a user
     */
    @Query("{ 'userId': ?0, 'status': 'ACTIVE', 'progressPercent': { $gt: 0, $lt: 100 } }")
    List<Enrollment> findInProgressByUserId(Long userId);

    /**
     * Find completed enrollments for a user
     */
    List<Enrollment> findByUserIdAndStatusOrderByCompletedAtDesc(Long userId, EnrollmentStatus status);

    /**
     * Find recently accessed courses for a user
     */
    Page<Enrollment> findByUserIdOrderByLastAccessedAtDesc(Long userId, Pageable pageable);

    /**
     * Find enrollments where certificate needs to be issued
     */
    @Query("{ 'status': 'COMPLETED', 'certificateId': null }")
    List<Enrollment> findCompletedWithoutCertificate();
}
