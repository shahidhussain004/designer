package com.designer.marketplace.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.designer.marketplace.dto.MessageResponse;
import com.designer.marketplace.dto.NewsletterSubscribeRequest;
import com.designer.marketplace.dto.NewsletterSubscribeResponse;
import com.designer.marketplace.service.NewsletterService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Newsletter subscription endpoints (public — no auth required).
 *
 * POST /api/newsletter/subscribe   — subscribe an email
 * GET  /api/newsletter/unsubscribe — unsubscribe via token link
 */
@RestController
@RequestMapping("/newsletter")
@RequiredArgsConstructor
@Slf4j
public class NewsletterController {

    private final NewsletterService newsletterService;

    /**
     * Subscribe an email address to the newsletter.
     * Idempotent: re-submitting an already-active email returns 200.
     */
    @PostMapping("/subscribe")
    public ResponseEntity<NewsletterSubscribeResponse> subscribe(
            @Valid @RequestBody NewsletterSubscribeRequest request,
            HttpServletRequest httpRequest) {

        String ip = resolveClientIp(httpRequest);
        NewsletterSubscribeResponse response = newsletterService.subscribe(request, ip);
        return ResponseEntity.ok(response);
    }

    /**
     * One-click unsubscribe endpoint — linked from every newsletter email.
     * Accepts GET so users can click directly from a mail client.
     */
    @GetMapping("/unsubscribe")
    public ResponseEntity<MessageResponse> unsubscribe(@RequestParam String token) {
        boolean ok = newsletterService.unsubscribeByToken(token);
        if (ok) {
            return ResponseEntity.ok(new MessageResponse("You have been successfully unsubscribed."));
        }
        return ResponseEntity.badRequest()
                .body(new MessageResponse("Invalid or expired unsubscribe link."));
    }

    // -------------------------------------------------------------------------

    private String resolveClientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
