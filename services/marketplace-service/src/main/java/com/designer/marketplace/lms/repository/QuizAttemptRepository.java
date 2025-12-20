package com.designer.marketplace.lms.repository;

import com.designer.marketplace.lms.entity.QuizAttempt;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizAttemptRepository extends MongoRepository<QuizAttempt, String> {
    
    List<QuizAttempt> findByUserIdAndQuizId(Long userId, String quizId);
    
    List<QuizAttempt> findByUserIdAndQuizIdOrderByAttemptNumberDesc(Long userId, String quizId);
    
    Optional<QuizAttempt> findTopByUserIdAndQuizIdOrderByAttemptNumberDesc(Long userId, String quizId);
    
    Optional<QuizAttempt> findByUserIdAndQuizIdAndStatus(Long userId, String quizId, QuizAttempt.AttemptStatus status);
    
    List<QuizAttempt> findByEnrollmentId(String enrollmentId);
    
    List<QuizAttempt> findByCourseIdAndUserIdAndStatusIn(String courseId, Long userId, List<QuizAttempt.AttemptStatus> statuses);
    
    int countByUserIdAndQuizId(Long userId, String quizId);
    
    // For instructor analytics
    List<QuizAttempt> findByQuizIdAndStatus(String quizId, QuizAttempt.AttemptStatus status);
    
    long countByQuizIdAndPassed(String quizId, Boolean passed);
}
