package com.designer.marketplace.lms.controller;

import com.designer.marketplace.lms.dto.*;
import com.designer.marketplace.lms.entity.*;
import com.designer.marketplace.lms.service.QuizService;
import com.designer.marketplace.security.UserPrincipal;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/lms/quizzes")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    // ==================== Instructor Endpoints ====================

    @PostMapping("/course/{courseId}")
    @PreAuthorize("hasAnyRole('FREELANCER', 'ADMIN')")
    public ResponseEntity<QuizResponse> createQuiz(
            @PathVariable String courseId,
            @RequestParam(required = false) String lessonId,
            @Valid @RequestBody CreateQuizRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        Quiz quiz = quizService.createQuiz(courseId, lessonId, request, principal.getId());
        return ResponseEntity.ok(QuizResponse.fromEntity(quiz, true));
    }

    @PostMapping("/{quizId}/questions")
    @PreAuthorize("hasAnyRole('FREELANCER', 'ADMIN')")
    public ResponseEntity<QuizResponse> addQuestion(
            @PathVariable String quizId,
            @Valid @RequestBody CreateQuizRequest.QuestionRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        Quiz quiz = quizService.addQuestion(quizId, request, principal.getId());
        return ResponseEntity.ok(QuizResponse.fromEntity(quiz, true));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<QuizResponse>> getCourseQuizzes(
            @PathVariable String courseId,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        List<Quiz> quizzes = quizService.getCourseQuizzes(courseId);
        // Hide answers for students
        boolean isInstructor = principal != null; // Simplified - should check if instructor of course
        List<QuizResponse> responses = quizzes.stream()
                .map(q -> QuizResponse.fromEntity(q, isInstructor))
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{quizId}")
    public ResponseEntity<QuizResponse> getQuiz(
            @PathVariable String quizId,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        Quiz quiz = quizService.getQuiz(quizId);
        // Hide answers for students taking quiz
        boolean showAnswers = false;  // Would check if instructor or already submitted
        return ResponseEntity.ok(QuizResponse.fromEntity(quiz, showAnswers));
    }

    @GetMapping("/{quizId}/analytics")
    @PreAuthorize("hasAnyRole('FREELANCER', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getQuizAnalytics(
            @PathVariable String quizId,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        Map<String, Object> analytics = quizService.getQuizAnalytics(quizId, principal.getId());
        return ResponseEntity.ok(analytics);
    }

    // ==================== Student Endpoints ====================

    @PostMapping("/{quizId}/start")
    @PreAuthorize("hasAnyRole('CLIENT', 'FREELANCER', 'ADMIN')")
    public ResponseEntity<QuizAttemptResponse> startQuiz(
            @PathVariable String quizId,
            @RequestParam String enrollmentId,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        QuizAttempt attempt = quizService.startQuizAttempt(quizId, principal.getId(), enrollmentId);
        Quiz quiz = quizService.getQuiz(quizId);
        return ResponseEntity.ok(QuizAttemptResponse.fromEntity(attempt, quiz.getTitle()));
    }

    @PostMapping("/attempts/{attemptId}/submit")
    @PreAuthorize("hasAnyRole('CLIENT', 'FREELANCER', 'ADMIN')")
    public ResponseEntity<QuizAttemptResponse> submitQuiz(
            @PathVariable String attemptId,
            @Valid @RequestBody SubmitQuizRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        QuizAttempt attempt = quizService.submitQuizAttempt(attemptId, request, principal.getId());
        Quiz quiz = quizService.getQuiz(attempt.getQuizId());
        return ResponseEntity.ok(QuizAttemptResponse.fromEntity(attempt, quiz.getTitle()));
    }

    @GetMapping("/{quizId}/attempts")
    @PreAuthorize("hasAnyRole('CLIENT', 'FREELANCER', 'ADMIN')")
    public ResponseEntity<List<QuizAttemptResponse>> getMyAttempts(
            @PathVariable String quizId,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        Quiz quiz = quizService.getQuiz(quizId);
        List<QuizAttempt> attempts = quizService.getUserQuizAttempts(principal.getId(), quizId);
        List<QuizAttemptResponse> responses = attempts.stream()
                .map(a -> QuizAttemptResponse.fromEntity(a, quiz.getTitle()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    // ==================== Certificate Endpoints ====================

    @GetMapping("/certificates")
    @PreAuthorize("hasAnyRole('CLIENT', 'FREELANCER', 'ADMIN')")
    public ResponseEntity<List<CertificateResponse>> getMyCertificates(
            @AuthenticationPrincipal UserPrincipal principal) {
        
        List<Certificate> certificates = quizService.getUserCertificates(principal.getId());
        List<CertificateResponse> responses = certificates.stream()
                .map(CertificateResponse::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/certificates/course/{courseId}")
    @PreAuthorize("hasAnyRole('CLIENT', 'FREELANCER', 'ADMIN')")
    public ResponseEntity<CertificateResponse> getCourseCertificate(
            @PathVariable String courseId,
            @AuthenticationPrincipal UserPrincipal principal) {
        
        return quizService.getUserCertificate(principal.getId(), courseId)
                .map(c -> ResponseEntity.ok(CertificateResponse.fromEntity(c)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/certificates/verify/{certificateNumber}")
    public ResponseEntity<CertificateResponse> verifyCertificate(
            @PathVariable String certificateNumber) {
        
        return quizService.verifyCertificate(certificateNumber)
                .map(c -> ResponseEntity.ok(CertificateResponse.fromEntity(c)))
                .orElse(ResponseEntity.notFound().build());
    }
}
