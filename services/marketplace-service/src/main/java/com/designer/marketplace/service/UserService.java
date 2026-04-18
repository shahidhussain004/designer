package com.designer.marketplace.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.designer.marketplace.dto.NotificationPreferenceRequest;
import com.designer.marketplace.dto.NotificationPreferenceResponse;
import com.designer.marketplace.dto.UserResponse;
import com.designer.marketplace.dto.UserUpdateRequest;
import com.designer.marketplace.entity.PasswordResetToken;
import com.designer.marketplace.entity.User;
import com.designer.marketplace.entity.UserNotificationPreference;
import com.designer.marketplace.exception.InvalidTokenException;
import com.designer.marketplace.exception.UnauthorizedException;
import com.designer.marketplace.repository.PasswordResetTokenRepository;
import com.designer.marketplace.repository.UserNotificationPreferenceRepository;
import com.designer.marketplace.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Service for user management operations
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final UserNotificationPreferenceRepository notificationPreferenceRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Value("${app.password-reset.token-expiry-minutes:30}")
    private Integer tokenExpiryMinutes;

    @Value("${app.frontend.reset-password-url:http://localhost:3000/reset-password}")
    private String resetPasswordUrl;

    /**
     * Get current authenticated user
     */
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new UnauthorizedException("User not authenticated");
        }

        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
    }

    /**
     * Get current user profile
     */
    public UserResponse getCurrentUserProfile() {
        User user = getCurrentUser();
        return UserResponse.fromEntity(user);
    }

    /**
     * Get user by ID
     */
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return UserResponse.fromEntity(user);
    }

    /**
     * Get all users with pagination (admin only)
     */
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        Page<User> users = userRepository.findAll(pageable);
        return users.map(UserResponse::fromEntity);
    }

    /**
     * Update user profile
     */
    @Transactional
    public UserResponse updateUser(Long id, UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Check if current user is updating their own profile or is admin
        User currentUser = getCurrentUser();
        if (!currentUser.getId().equals(id) && !isAdmin(currentUser)) {
            throw new RuntimeException("You can only update your own profile");
        }

        // Update fields if provided
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            // Check if email already exists
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new RuntimeException("Email already in use");
            }
            user.setEmail(request.getEmail());
        }

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName());
        }

        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }

        if (request.getProfileImageUrl() != null) {
            user.setProfileImageUrl(request.getProfileImageUrl());
        }

        if (request.getLocation() != null) {
            user.setLocation(request.getLocation());
        }

        if (request.getPhone() != null) {
            user.setPhone(request.getPhone());
        }

        User updatedUser = userRepository.save(user);
        log.info("User profile updated: {}", updatedUser.getUsername());

        return UserResponse.fromEntity(updatedUser);
    }

    /**
     * Check if user is owner of resource
     */
    public boolean isOwner(Long userId) {
        User currentUser = getCurrentUser();
        return currentUser.getId().equals(userId);
    }

    /**
     * Check if user is admin
     */
    public boolean isAdmin(User user) {
        return user.getRole() == User.UserRole.ADMIN;
    }

    /**
     * Check if current user is admin
     */
    public boolean isCurrentUserAdmin() {
        User currentUser = getCurrentUser();
        return isAdmin(currentUser);
    }

    public Page<UserResponse> findUsersByRole(User.UserRole role, Pageable pageable) {
        Page<User> users = userRepository.findByRole(role, pageable);
        return users.map(UserResponse::fromEntity);
    }

    /**
     * Get notification preferences for current user
     */
    public NotificationPreferenceResponse getNotificationPreferences() {
        User currentUser = getCurrentUser();
        UserNotificationPreference preference = notificationPreferenceRepository.findByUser(currentUser)
                .orElseGet(() -> {
                    // Create default preferences if not exists
                    UserNotificationPreference newPref = UserNotificationPreference.builder()
                            .user(currentUser)
                            .jobAlerts(true)
                            .proposalUpdates(true)
                            .messages(true)
                            .newsletter(false)
                            .build();
                    return notificationPreferenceRepository.save(newPref);
                });

        return NotificationPreferenceResponse.builder()
                .id(preference.getId())
                .jobAlerts(preference.getJobAlerts())
                .proposalUpdates(preference.getProposalUpdates())
                .messages(preference.getMessages())
                .newsletter(preference.getNewsletter())
                .build();
    }

    /**
     * Update notification preferences for current user
     */
    @Transactional
    public NotificationPreferenceResponse updateNotificationPreferences(NotificationPreferenceRequest request) {
        User currentUser = getCurrentUser();
        UserNotificationPreference preference = notificationPreferenceRepository.findByUser(currentUser)
                .orElseGet(() -> {
                    UserNotificationPreference newPref = UserNotificationPreference.builder()
                            .user(currentUser)
                            .build();
                    return newPref;
                });

        // Update fields if provided
        if (request.getJobAlerts() != null) {
            preference.setJobAlerts(request.getJobAlerts());
        }
        if (request.getProposalUpdates() != null) {
            preference.setProposalUpdates(request.getProposalUpdates());
        }
        if (request.getMessages() != null) {
            preference.setMessages(request.getMessages());
        }
        if (request.getNewsletter() != null) {
            preference.setNewsletter(request.getNewsletter());
        }

        UserNotificationPreference saved = notificationPreferenceRepository.save(preference);
        log.info("Notification preferences updated for user: {}", currentUser.getUsername());

        return NotificationPreferenceResponse.builder()
                .id(saved.getId())
                .jobAlerts(saved.getJobAlerts())
                .proposalUpdates(saved.getProposalUpdates())
                .messages(saved.getMessages())
                .newsletter(saved.getNewsletter())
                .build();
    }

    /**
     * Process forgot password request - generates a reset token and sends email
     */
    @Transactional
    public void processForgotPasswordRequest(String email) {
        User user = userRepository.findByEmail(email)
                .orElse(null);

        if (user == null) {
            // For security, don't reveal if email exists
            log.warn("Password reset requested for non-existent email: {}", email);
            return;
        }

        // Generate unique token
        String token = UUID.randomUUID().toString();
        LocalDateTime expiryTime = LocalDateTime.now().plusMinutes(tokenExpiryMinutes);

        // Create and save password reset token
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .user(user)
                .token(token)
                .expiryTime(expiryTime)
                .used(false)
                .build();

        passwordResetTokenRepository.save(resetToken);
        log.info("Password reset token created for user: {}", user.getUsername());

        // Send email with reset link
        String resetLink = resetPasswordUrl + "?token=" + token;
        emailService.sendPasswordResetEmail(user.getEmail(), user.getFullName(), resetLink);
    }

    /**
     * Reset password using token
     */
    @Transactional
    public void resetPassword(String token, String newPassword) {
        // Find the reset token
        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(token)
                .orElseThrow(() -> new InvalidTokenException("Invalid password reset token"));

        // Check if token is already used
        if (resetToken.isUsed()) {
            throw new InvalidTokenException("Password reset token has already been used");
        }

        // Check if token has expired
        if (LocalDateTime.now().isAfter(resetToken.getExpiryTime())) {
            throw new InvalidTokenException("Password reset token has expired");
        }

        // Update user password
        User user = resetToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Mark token as used
        resetToken.setUsed(true);
        passwordResetTokenRepository.save(resetToken);

        log.info("Password reset successfully for user: {}", user.getUsername());
    }

    /**
     * Change password for the current authenticated user.
     */
    @Transactional
    public void changePassword(String currentPassword, String newPassword) {
        User currentUser = getCurrentUser();

        if (!passwordEncoder.matches(currentPassword, currentUser.getPasswordHash())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        if (passwordEncoder.matches(newPassword, currentUser.getPasswordHash())) {
            throw new IllegalArgumentException("New password must be different from current password");
        }

        currentUser.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(currentUser);

        log.info("Password changed successfully for user: {}", currentUser.getUsername());
    }
}
