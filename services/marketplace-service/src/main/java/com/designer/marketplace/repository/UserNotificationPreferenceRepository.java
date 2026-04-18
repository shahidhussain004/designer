package com.designer.marketplace.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.designer.marketplace.entity.User;
import com.designer.marketplace.entity.UserNotificationPreference;

/**
 * Repository for user notification preferences
 * Manages email notification settings for users
 */
@Repository
public interface UserNotificationPreferenceRepository extends JpaRepository<UserNotificationPreference, Long> {

    /**
     * Find notification preferences by user
     */
    Optional<UserNotificationPreference> findByUser(User user);

    /**
     * Find notification preferences by user ID
     */
    Optional<UserNotificationPreference> findByUserId(Long userId);

    /**
     * Check if notification preferences exist for user
     */
    boolean existsByUser(User user);
}
