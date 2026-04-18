package com.designer.marketplace.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.designer.marketplace.entity.PasswordResetToken;

/**
 * Repository for password reset tokens
 */
@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

    /**
     * Find a password reset token by its token string
     */
    Optional<PasswordResetToken> findByToken(String token);

    /**
     * Check if a token exists and is not used
     */
    boolean existsByTokenAndUsedFalse(String token);
}
