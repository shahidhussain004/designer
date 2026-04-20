package com.designer.marketplace.repository;

import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.designer.marketplace.entity.NewsletterSubscriber;

@Repository
public interface NewsletterSubscriberRepository extends JpaRepository<NewsletterSubscriber, Long> {

    Optional<NewsletterSubscriber> findByEmail(String email);

    Optional<NewsletterSubscriber> findByUnsubscribeToken(String token);

    boolean existsByEmail(String email);

    /** For admin: list only active subscribers. */
    Page<NewsletterSubscriber> findAllBySubscribedTrue(Pageable pageable);
}
