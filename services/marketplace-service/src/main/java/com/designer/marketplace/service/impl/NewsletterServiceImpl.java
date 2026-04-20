package com.designer.marketplace.service.impl;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.designer.marketplace.dto.NewsletterSubscribeRequest;
import com.designer.marketplace.dto.NewsletterSubscribeResponse;
import com.designer.marketplace.entity.NewsletterSubscriber;
import com.designer.marketplace.repository.NewsletterSubscriberRepository;
import com.designer.marketplace.service.EmailService;
import com.designer.marketplace.service.NewsletterService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class NewsletterServiceImpl implements NewsletterService {

    private final NewsletterSubscriberRepository repository;
    private final EmailService emailService;

    @Value("${app.base-url:http://localhost:3002}")
    private String appBaseUrl;

    @Value("${newsletter.admin-email:shahidhussain004@gmail.com}")
    private String adminEmail;

    @Override
    @Transactional
    public NewsletterSubscribeResponse subscribe(NewsletterSubscribeRequest request, String ipAddress) {
        String email = request.getEmail().toLowerCase().trim();

        Optional<NewsletterSubscriber> existing = repository.findByEmail(email);

        if (existing.isPresent()) {
            NewsletterSubscriber sub = existing.get();
            if (sub.getSubscribed()) {
                // Already active — return success silently (idempotent)
                log.info("Duplicate subscription attempt for: {}", email);
                return NewsletterSubscribeResponse.builder()
                        .success(true)
                        .message("You are already subscribed.")
                        .email(email)
                        .subscribedAt(sub.getSubscribedAt())
                        .build();
            }
            // Re-subscribe: reactivate the existing row, keep the same token
            sub.setSubscribed(true);
            sub.setUnsubscribedAt(null);
            sub.setSubscribedAt(LocalDateTime.now());
            repository.save(sub);
            log.info("Re-subscribed: {}", email);
            sendConfirmationEmails(email, sub.getUnsubscribeToken());
            return NewsletterSubscribeResponse.builder()
                    .success(true)
                    .message("Welcome back! You have been re-subscribed.")
                    .email(email)
                    .subscribedAt(sub.getSubscribedAt())
                    .build();
        }

        // New subscription
        String token = UUID.randomUUID().toString();
        NewsletterSubscriber subscriber = NewsletterSubscriber.builder()
                .email(email)
                .unsubscribeToken(token)
                .subscribed(true)
                .ipAddress(ipAddress)
                .source(request.getSource() != null ? request.getSource() : "footer")
                .build();

        repository.save(subscriber);
        log.info("New newsletter subscription: {}", email);

        sendConfirmationEmails(email, token);

        return NewsletterSubscribeResponse.builder()
                .success(true)
                .message("Thank you for subscribing! Check your email for confirmation.")
                .email(email)
                .subscribedAt(subscriber.getSubscribedAt())
                .build();
    }

    @Override
    @Transactional
    public boolean unsubscribeByToken(String token) {
        Optional<NewsletterSubscriber> opt = repository.findByUnsubscribeToken(token);
        if (opt.isEmpty()) {
            log.warn("Unsubscribe attempted with unknown token: {}", token);
            return false;
        }
        NewsletterSubscriber sub = opt.get();
        if (!sub.getSubscribed()) {
            // Already unsubscribed — treat as success
            return true;
        }
        sub.setSubscribed(false);
        sub.setUnsubscribedAt(LocalDateTime.now());
        repository.save(sub);
        log.info("Unsubscribed: {}", sub.getEmail());
        return true;
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private void sendConfirmationEmails(String subscriberEmail, String token) {
        String unsubscribeLink = appBaseUrl + "/unsubscribe?token=" + token;

        // 1. Confirmation email to the subscriber
        try {
            emailService.sendNotificationEmail(
                    subscriberEmail,
                    "You're subscribed to Designer Marketplace updates!",
                    "Thank you for subscribing to Designer Marketplace!\n\n" +
                    "You will receive the latest design jobs, tutorials, and platform news.\n\n" +
                    "If you ever want to unsubscribe, simply click the link below:\n" +
                    unsubscribeLink + "\n\n" +
                    "— The Designer Marketplace Team"
            );
        } catch (Exception e) {
            log.error("Failed to send confirmation email to subscriber: {}", subscriberEmail, e);
        }

        // 2. Admin notification email
        try {
            emailService.sendNotificationEmail(
                    adminEmail,
                    "New Newsletter Subscriber: " + subscriberEmail,
                    "A new subscriber has signed up for the Designer Marketplace newsletter.\n\n" +
                    "Email: " + subscriberEmail + "\n" +
                    "Time : " + LocalDateTime.now() + "\n\n" +
                    "Log in to the admin dashboard to manage subscribers."
            );
        } catch (Exception e) {
            log.error("Failed to send admin notification for subscriber: {}", subscriberEmail, e);
        }
    }
}
