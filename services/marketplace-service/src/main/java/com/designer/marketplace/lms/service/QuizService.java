package com.designer.marketplace.lms.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.designer.marketplace.entity.User;
import com.designer.marketplace.lms.dto.CreateQuizRequest;
import com.designer.marketplace.lms.dto.SubmitQuizRequest;
import com.designer.marketplace.lms.entity.Certificate;
import com.designer.marketplace.lms.entity.Course;
import com.designer.marketplace.lms.entity.Enrollment;
import com.designer.marketplace.lms.entity.Quiz;
import com.designer.marketplace.lms.entity.QuizAttempt;
import com.designer.marketplace.lms.repository.CertificateRepository;
import com.designer.marketplace.lms.repository.CourseRepository;
import com.designer.marketplace.lms.repository.EnrollmentRepository;
import com.designer.marketplace.lms.repository.QuizAttemptRepository;
import com.designer.marketplace.lms.repository.QuizRepository;
import com.designer.marketplace.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final CertificateRepository certificateRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    // ==================== Quiz Management (Instructor) ====================

    public Quiz createQuiz(String courseId, String lessonId, CreateQuizRequest request, Long instructorId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        if (!course.getInstructorId().equals(instructorId)) {
            throw new IllegalStateException("Only the course instructor can create quizzes");
        }
        
        Quiz quiz = Quiz.builder()
                .courseId(courseId)
                .lessonId(lessonId)
                .title(request.getTitle())
                .description(request.getDescription())
                .passingScore(request.getPassingScore())
                .timeLimit(request.getTimeLimit())
                .maxAttempts(request.getMaxAttempts())
                .shuffleQuestions(request.getShuffleQuestions() != null ? request.getShuffleQuestions() : false)
                .shuffleOptions(request.getShuffleOptions() != null ? request.getShuffleOptions() : false)
                .showCorrectAnswers(request.getShowCorrectAnswers() != null ? request.getShowCorrectAnswers() : true)
                .isActive(true)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        
        // Add questions if provided
        if (request.getQuestions() != null) {
            int orderIndex = 0;
            for (CreateQuizRequest.QuestionRequest qr : request.getQuestions()) {
                Quiz.Question question = Quiz.Question.builder()
                        .id(UUID.randomUUID().toString())
                        .type(qr.getType())
                        .questionText(qr.getQuestionText())
                        .explanation(qr.getExplanation())
                        .points(qr.getPoints() != null ? qr.getPoints() : 1)
                        .orderIndex(orderIndex++)
                        .correctAnswers(qr.getCorrectAnswers() != null ? qr.getCorrectAnswers() : new ArrayList<>())
                        .correctTextAnswer(qr.getCorrectTextAnswer())
                        .build();
                
                // Add options if provided
                if (qr.getOptions() != null) {
                    int optionIndex = 0;
                    List<String> correctAnswerIds = new ArrayList<>();
                    for (CreateQuizRequest.OptionRequest or : qr.getOptions()) {
                        String optionId = UUID.randomUUID().toString();
                        Quiz.Option option = Quiz.Option.builder()
                                .id(optionId)
                                .text(or.getText())
                                .isCorrect(or.getIsCorrect() != null ? or.getIsCorrect() : false)
                                .orderIndex(optionIndex++)
                                .build();
                        question.getOptions().add(option);
                        
                        if (Boolean.TRUE.equals(or.getIsCorrect())) {
                            correctAnswerIds.add(optionId);
                        }
                    }
                    // Auto-set correct answers from options
                    if (question.getCorrectAnswers().isEmpty() && !correctAnswerIds.isEmpty()) {
                        question.setCorrectAnswers(correctAnswerIds);
                    }
                }
                
                quiz.addQuestion(question);
            }
        }
        
        log.info("Creating quiz: {} for course: {} with {} questions", 
                request.getTitle(), courseId, quiz.getQuestions().size());
        
        return quizRepository.save(quiz);
    }

    public Quiz addQuestion(String quizId, CreateQuizRequest.QuestionRequest request, Long instructorId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        
        Course course = courseRepository.findById(quiz.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        if (!course.getInstructorId().equals(instructorId)) {
            throw new IllegalStateException("Only the course instructor can modify quizzes");
        }
        
        int nextOrder = quiz.getQuestions().stream()
                .mapToInt(q -> q.getOrderIndex() != null ? q.getOrderIndex() : 0)
                .max()
                .orElse(-1) + 1;
        
        Quiz.Question question = Quiz.Question.builder()
                .id(UUID.randomUUID().toString())
                .type(request.getType())
                .questionText(request.getQuestionText())
                .explanation(request.getExplanation())
                .points(request.getPoints() != null ? request.getPoints() : 1)
                .orderIndex(nextOrder)
                .correctAnswers(request.getCorrectAnswers() != null ? request.getCorrectAnswers() : new ArrayList<>())
                .correctTextAnswer(request.getCorrectTextAnswer())
                .options(new ArrayList<>())
                .build();
        
        // Add options
        if (request.getOptions() != null) {
            int optionIndex = 0;
            List<String> correctAnswerIds = new ArrayList<>();
            for (CreateQuizRequest.OptionRequest or : request.getOptions()) {
                String optionId = UUID.randomUUID().toString();
                Quiz.Option option = Quiz.Option.builder()
                        .id(optionId)
                        .text(or.getText())
                        .isCorrect(or.getIsCorrect() != null ? or.getIsCorrect() : false)
                        .orderIndex(optionIndex++)
                        .build();
                question.getOptions().add(option);
                
                if (Boolean.TRUE.equals(or.getIsCorrect())) {
                    correctAnswerIds.add(optionId);
                }
            }
            if (question.getCorrectAnswers().isEmpty() && !correctAnswerIds.isEmpty()) {
                question.setCorrectAnswers(correctAnswerIds);
            }
        }
        
        quiz.getQuestions().add(question);
        quiz.setUpdatedAt(LocalDateTime.now());
        
        return quizRepository.save(quiz);
    }

    public Quiz getQuiz(String quizId) {
        return quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
    }

    public List<Quiz> getCourseQuizzes(String courseId) {
        return quizRepository.findByCourseIdAndIsActiveTrue(courseId);
    }

    public Optional<Quiz> getLessonQuiz(String lessonId) {
        return quizRepository.findByLessonIdAndIsActiveTrue(lessonId);
    }

    // ==================== Quiz Attempts (Student) ====================

    public QuizAttempt startQuizAttempt(String quizId, Long userId, String enrollmentId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        
        // Check if enrolled
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        
        if (!enrollment.getUserId().equals(userId) || !enrollment.getCourseId().equals(quiz.getCourseId())) {
            throw new IllegalStateException("Invalid enrollment for this quiz");
        }
        
        // Check max attempts
        int currentAttempts = quizAttemptRepository.countByUserIdAndQuizId(userId, quizId);
        if (quiz.getMaxAttempts() != null && currentAttempts >= quiz.getMaxAttempts()) {
            throw new IllegalStateException("Maximum attempts reached for this quiz");
        }
        
        // Check for existing in-progress attempt
        Optional<QuizAttempt> inProgress = quizAttemptRepository
                .findByUserIdAndQuizIdAndStatus(userId, quizId, QuizAttempt.AttemptStatus.IN_PROGRESS);
        if (inProgress.isPresent()) {
            return inProgress.get();  // Return existing attempt
        }
        
        QuizAttempt attempt = QuizAttempt.builder()
                .userId(userId)
                .quizId(quizId)
                .courseId(quiz.getCourseId())
                .enrollmentId(enrollmentId)
                .attemptNumber(currentAttempts + 1)
                .status(QuizAttempt.AttemptStatus.IN_PROGRESS)
                .startedAt(LocalDateTime.now())
                .build();
        
        log.info("User {} started quiz attempt {} for quiz {}", userId, attempt.getAttemptNumber(), quizId);
        
        return quizAttemptRepository.save(attempt);
    }

    public QuizAttempt submitQuizAttempt(String attemptId, SubmitQuizRequest request, Long userId) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Quiz attempt not found"));
        
        if (!attempt.getUserId().equals(userId)) {
            throw new IllegalStateException("You can only submit your own quiz attempt");
        }
        
        if (attempt.getStatus() != QuizAttempt.AttemptStatus.IN_PROGRESS) {
            throw new IllegalStateException("This quiz attempt has already been submitted");
        }
        
        Quiz quiz = quizRepository.findById(attempt.getQuizId())
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        
        // Check time limit
        if (quiz.getTimeLimit() != null) {
            long minutesElapsed = ChronoUnit.MINUTES.between(attempt.getStartedAt(), LocalDateTime.now());
            if (minutesElapsed > quiz.getTimeLimit()) {
                attempt.setStatus(QuizAttempt.AttemptStatus.TIMED_OUT);
                attempt.setSubmittedAt(LocalDateTime.now());
                quizAttemptRepository.save(attempt);
                throw new IllegalStateException("Quiz time limit exceeded");
            }
        }
        
        // Record answers
        LocalDateTime now = LocalDateTime.now();
        for (SubmitQuizRequest.AnswerSubmission as : request.getAnswers()) {
            QuizAttempt.Answer answer = QuizAttempt.Answer.builder()
                    .questionId(as.getQuestionId())
                    .selectedOptions(as.getSelectedOptions() != null ? as.getSelectedOptions() : new ArrayList<>())
                    .textAnswer(as.getTextAnswer())
                    .answeredAt(now)
                    .build();
            attempt.addAnswer(answer);
        }
        
        // Calculate score
        attempt.calculateScore(quiz);
        attempt.setStatus(QuizAttempt.AttemptStatus.SUBMITTED);
        attempt.setSubmittedAt(now);
        attempt.setTimeSpentSeconds((int) ChronoUnit.SECONDS.between(attempt.getStartedAt(), now));
        
        QuizAttempt saved = quizAttemptRepository.save(attempt);
        
        log.info("User {} submitted quiz {}: score={}/{} ({}%), passed={}", 
                userId, quiz.getId(), saved.getScore(), saved.getMaxScore(), 
                String.format("%.1f", saved.getPercentage()), saved.getPassed());
        
        // Update enrollment progress
        updateEnrollmentQuizProgress(attempt.getEnrollmentId(), quiz.getCourseId(), userId);
        
        // Check if eligible for certificate
        checkAndIssueCertificate(attempt.getEnrollmentId(), userId);
        
        return saved;
    }

    public List<QuizAttempt> getUserQuizAttempts(Long userId, String quizId) {
        return quizAttemptRepository.findByUserIdAndQuizIdOrderByAttemptNumberDesc(userId, quizId);
    }

    // ==================== Certificate Management ====================

    public Optional<Certificate> getUserCertificate(Long userId, String courseId) {
        return certificateRepository.findByUserIdAndCourseId(userId, courseId);
    }

    public List<Certificate> getUserCertificates(Long userId) {
        return certificateRepository.findByUserIdAndStatus(userId, Certificate.CertificateStatus.ACTIVE);
    }

    public Optional<Certificate> verifyCertificate(String certificateNumber) {
        return certificateRepository.findByCertificateNumber(certificateNumber);
    }

    private void updateEnrollmentQuizProgress(String enrollmentId, String courseId, Long userId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        
        // Count passed quizzes
        List<Quiz> quizzes = quizRepository.findByCourseIdAndIsActiveTrue(courseId);
        int passedQuizzes = 0;
        for (Quiz quiz : quizzes) {
            Optional<QuizAttempt> bestAttempt = quizAttemptRepository
                    .findByUserIdAndQuizIdOrderByAttemptNumberDesc(userId, quiz.getId())
                    .stream()
                    .filter(a -> Boolean.TRUE.equals(a.getPassed()))
                    .findFirst();
            if (bestAttempt.isPresent()) {
                passedQuizzes++;
            }
        }
        
        enrollment.setQuizzesPassed(passedQuizzes);
        enrollment.setTotalQuizzes(quizzes.size());
        enrollment.setUpdatedAt(Instant.now());
        enrollmentRepository.save(enrollment);
    }

    private void checkAndIssueCertificate(String enrollmentId, Long userId) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));
        
        // Check if already has certificate
        if (certificateRepository.existsByUserIdAndCourseId(userId, enrollment.getCourseId())) {
            return;
        }
        
        // Check completion criteria (using Double comparison)
        if (enrollment.getProgressPercent() == null || enrollment.getProgressPercent() < 100.0) {
            return;
        }
        
        // All quizzes must be passed
        List<Quiz> quizzes = quizRepository.findByCourseIdAndIsActiveTrue(enrollment.getCourseId());
        if (!quizzes.isEmpty()) {
            for (Quiz quiz : quizzes) {
                boolean passed = quizAttemptRepository
                        .findByUserIdAndQuizIdOrderByAttemptNumberDesc(userId, quiz.getId())
                        .stream()
                        .anyMatch(a -> Boolean.TRUE.equals(a.getPassed()));
                if (!passed) {
                    return;  // Not all quizzes passed
                }
            }
        }
        
        // Issue certificate
        issueCertificate(enrollment, userId);
    }

    public Certificate issueCertificate(Enrollment enrollment, Long userId) {
        Course course = courseRepository.findById(enrollment.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        User student = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        User instructor = userRepository.findById(course.getInstructorId())
                .orElseThrow(() -> new RuntimeException("Instructor not found"));
        
        String certNumber = Certificate.generateCertificateNumber();
        
        // Convert Double progressPercent to Integer for finalScore
        Integer finalScore = enrollment.getProgressPercent() != null 
                ? enrollment.getProgressPercent().intValue() 
                : 0;
        
        Certificate certificate = Certificate.builder()
                .userId(userId)
                .courseId(course.getId())
                .enrollmentId(enrollment.getId())
                .studentName(student.getFullName())
                .studentEmail(student.getEmail())
                .courseTitle(course.getTitle())
                .instructorName(instructor.getFullName())
                .courseDurationHours(formatDuration(course.getTotalDurationMinutes()))
                .certificateNumber(certNumber)
                .certificateUrl("/api/lms/certificates/" + certNumber + "/download")
                .verificationUrl("/api/lms/certificates/verify/" + certNumber)
                .issuedAt(LocalDateTime.now())
                .finalScore(finalScore)
                .quizzesPassed(enrollment.getQuizzesPassed())
                .totalQuizzes(enrollment.getTotalQuizzes())
                .lessonsCompleted(enrollment.getCompletedLessons())
                .totalLessons(enrollment.getTotalLessons())
                .type(Certificate.CertificateType.COMPLETION)
                .status(Certificate.CertificateStatus.ACTIVE)
                .build();
        
        Certificate saved = certificateRepository.save(certificate);
        
        log.info("Certificate issued: {} for user {} completing course {}", 
                certNumber, userId, course.getTitle());
        
        return saved;
    }

    private String formatDuration(Integer totalMinutes) {
        if (totalMinutes == null || totalMinutes == 0) {
            return "N/A";
        }
        int hours = totalMinutes / 60;
        int minutes = totalMinutes % 60;
        if (hours == 0) {
            return minutes + " minutes";
        }
        return hours + " hour" + (hours > 1 ? "s" : "") + 
               (minutes > 0 ? " " + minutes + " minutes" : "");
    }

    // ==================== Analytics ====================

    public Map<String, Object> getQuizAnalytics(String quizId, Long instructorId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        
        Course course = courseRepository.findById(quiz.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        if (!course.getInstructorId().equals(instructorId)) {
            throw new IllegalStateException("Only the course instructor can view analytics");
        }
        
        List<QuizAttempt> attempts = quizAttemptRepository.findByQuizIdAndStatus(
                quizId, QuizAttempt.AttemptStatus.SUBMITTED);
        
        long totalAttempts = attempts.size();
        long passedAttempts = attempts.stream().filter(a -> Boolean.TRUE.equals(a.getPassed())).count();
        double averageScore = attempts.stream()
                .mapToDouble(a -> a.getPercentage() != null ? a.getPercentage() : 0)
                .average()
                .orElse(0);
        double averageTime = attempts.stream()
                .mapToInt(a -> a.getTimeSpentSeconds() != null ? a.getTimeSpentSeconds() : 0)
                .average()
                .orElse(0);
        
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("quizId", quizId);
        analytics.put("quizTitle", quiz.getTitle());
        analytics.put("totalAttempts", totalAttempts);
        analytics.put("passedAttempts", passedAttempts);
        analytics.put("failedAttempts", totalAttempts - passedAttempts);
        analytics.put("passRate", totalAttempts > 0 ? (double) passedAttempts / totalAttempts * 100 : 0);
        analytics.put("averageScore", averageScore);
        analytics.put("averageTimeSeconds", averageTime);
        
        return analytics;
    }
}
