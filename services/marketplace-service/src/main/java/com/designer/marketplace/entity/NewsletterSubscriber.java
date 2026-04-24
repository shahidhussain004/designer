package com.designer.marketplace.entity;

import java.time.LocalDateTime;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * NewsletterSubscriber entity
 *
 * Standalone table — not tied to a user account.
 * Guests and registered users can both subscribe.
 *
 * Each row carries a unique {@code unsubscribeToken} (UUID) so that
 * the owner of the email can unsubscribe via a tokenised link
 * without ever needing to log in.
 */
@Entity
@Table(name = "newsletter_subscribers")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NewsletterSubscriber {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    /** UUID generated at subscription time — used as the unsubscribe token in emails. */
    @Column(name = "unsubscribe_token", nullable = false, unique = true, length = 36)
    private String unsubscribeToken;

    @Column(nullable = false)
    @Builder.Default
    private Boolean subscribed = true;

    @CreatedDate
    @Column(name = "subscribed_at", nullable = false, updatable = false)
    private LocalDateTime subscribedAt;

    @Column(name = "unsubscribed_at")
    private LocalDateTime unsubscribedAt;

    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    /** Tracks where this subscription came from (e.g. "footer", "popup"). */
    @Column(length = 50)
    @Builder.Default
    private String source = "footer";
}
