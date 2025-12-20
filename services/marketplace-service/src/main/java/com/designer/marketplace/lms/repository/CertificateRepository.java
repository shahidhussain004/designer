package com.designer.marketplace.lms.repository;

import com.designer.marketplace.lms.entity.Certificate;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CertificateRepository extends MongoRepository<Certificate, String> {
    
    List<Certificate> findByUserId(Long userId);
    
    List<Certificate> findByUserIdAndStatus(Long userId, Certificate.CertificateStatus status);
    
    Optional<Certificate> findByUserIdAndCourseId(Long userId, String courseId);
    
    Optional<Certificate> findByCertificateNumber(String certificateNumber);
    
    Optional<Certificate> findByEnrollmentId(String enrollmentId);
    
    List<Certificate> findByCourseId(String courseId);
    
    boolean existsByUserIdAndCourseId(Long userId, String courseId);
    
    long countByCourseId(String courseId);
}
