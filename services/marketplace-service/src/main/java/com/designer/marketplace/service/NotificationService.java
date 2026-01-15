package com.designer.marketplace.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.designer.marketplace.dto.NotificationResponse;
import com.designer.marketplace.entity.Company;
import com.designer.marketplace.entity.Freelancer;
import com.designer.marketplace.entity.Notification;
import com.designer.marketplace.entity.User;
import com.designer.marketplace.repository.NotificationRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for notification operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserService userService;

    /**
     * Get user notifications
     */
    public List<NotificationResponse> getUserNotifications() {
        User currentUser = userService.getCurrentUser();
        log.info("Getting notifications for user: {}", currentUser.getUsername());

        List<Notification> notifications = notificationRepository
                .findTop10ByUserIdOrderByCreatedAtDesc(currentUser.getId());

        return notifications.stream()
                .map(NotificationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * Create notification for user
     */
    @Transactional
    public void createNotification(User user, Notification.NotificationType type,
            String title, String message,
            String relatedEntityType, Long relatedEntityId) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setType(type);
        notification.setTitle(title);
        notification.setMessage(message);
        notification.setRelatedEntityType(relatedEntityType);
        notification.setRelatedEntityId(relatedEntityId);
        notification.setIsRead(false);

        notificationRepository.save(notification);
        log.info("Created notification for user {}: {}", user.getUsername(), title);
    }

    /**
     * Create notification for company
     */
    @Transactional
    public void createNotification(Company company, Notification.NotificationType type,
            String title, String message,
            String relatedEntityType, Long relatedEntityId) {
        if (company != null && company.getUser() != null) {
            createNotification(company.getUser(), type, title, message, relatedEntityType, relatedEntityId);
        }
    }

    /**
     * Create notification for freelancer
     */
    @Transactional
    public void createNotification(Freelancer freelancer, Notification.NotificationType type,
            String title, String message,
            String relatedEntityType, Long relatedEntityId) {
        if (freelancer != null && freelancer.getUser() != null) {
            createNotification(freelancer.getUser(), type, title, message, relatedEntityType, relatedEntityId);
        }
    }

    /**
     * Mark notification as read
     */
    @Transactional
    public void markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        User currentUser = userService.getCurrentUser();
        if (!notification.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Cannot mark another user's notification as read");
        }

        notification.setIsRead(true);
        notification.setReadAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    /**
     * Get unread notification count
     */
    public Long getUnreadCount() {
        User currentUser = userService.getCurrentUser();
        return notificationRepository.countUnreadByUserId(currentUser.getId());
    }
}
