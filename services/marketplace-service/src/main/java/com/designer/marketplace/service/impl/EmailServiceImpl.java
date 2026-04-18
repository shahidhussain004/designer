package com.designer.marketplace.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.designer.marketplace.service.EmailService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Email service implementation using Spring Mail
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.from:noreply@designer-marketplace.com}")
    private String fromEmail;

    @Override
    public void sendPasswordResetEmail(String email, String fullName, String resetLink) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(email);
            message.setSubject("Password Reset Request");

            String body = String.format(
                    "Dear %s,\n\n" +
                    "You have requested to reset your password. Please click the link below to reset your password:\n\n" +
                    "%s\n\n" +
                    "This link will expire in 30 minutes.\n\n" +
                    "If you did not request this, please ignore this email.\n\n" +
                    "Best regards,\n" +
                    "Designer Marketplace Team",
                    fullName, resetLink);

            message.setText(body);
            mailSender.send(message);
            log.info("Password reset email sent to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send password reset email to: {}", email, e);
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    @Override
    public void sendNotificationEmail(String email, String subject, String message) {
        try {
            SimpleMailMessage mailMessage = new SimpleMailMessage();
            mailMessage.setFrom(fromEmail);
            mailMessage.setTo(email);
            mailMessage.setSubject(subject);
            mailMessage.setText(message);

            mailSender.send(mailMessage);
            log.info("Notification email sent to: {}", email);
        } catch (Exception e) {
            log.error("Failed to send notification email to: {}", email, e);
            throw new RuntimeException("Failed to send notification email", e);
        }
    }
}
