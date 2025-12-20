package com.designer.marketplace.lms.repository;

import com.designer.marketplace.lms.entity.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizRepository extends MongoRepository<Quiz, String> {
    
    List<Quiz> findByCourseId(String courseId);
    
    List<Quiz> findByCourseIdAndIsActiveTrue(String courseId);
    
    Optional<Quiz> findByLessonId(String lessonId);
    
    Optional<Quiz> findByLessonIdAndIsActiveTrue(String lessonId);
    
    int countByCourseId(String courseId);
    
    void deleteByCourseId(String courseId);
}
