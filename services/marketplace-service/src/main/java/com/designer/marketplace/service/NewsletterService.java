package com.designer.marketplace.service;

import com.designer.marketplace.dto.NewsletterSubscribeRequest;
import com.designer.marketplace.dto.NewsletterSubscribeResponse;

public interface NewsletterService {

    /**
     * Subscribe an email address to the newsletter.
     * If the email was previously unsubscribed it is re-activated.
     * Duplicate active subscriptions are silently accepted (idempotent).
     */
    NewsletterSubscribeResponse subscribe(NewsletterSubscribeRequest request, String ipAddress);

    /**
     * Unsubscribe by the tokenised link included in every newsletter email.
     * No login required.
     *
     * @param token the UUID stored in the newsletter_subscribers row
     * @return true when found and deactivated, false when token unknown
     */
    boolean unsubscribeByToken(String token);
}
