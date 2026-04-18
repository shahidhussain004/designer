package com.designer.marketplace.service;

/**
 * Service interface for sending emails
 */
public interface EmailService {

    /**
     * Send password reset email
     *
     * @param email recipient email address
     * @param fullName recipient full name
     * @param resetLink reset password link
     */
    void sendPasswordResetEmail(String email, String fullName, String resetLink);

    /**
     * Send notification email
     *
     * @param email recipient email address
     * @param subject email subject
     * @param message email body/message
     */
    void sendNotificationEmail(String email, String subject, String message);
}
