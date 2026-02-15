package com.designer.marketplace.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.designer.marketplace.service.PaymentService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.net.Webhook;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Webhook controller for handling Stripe events.
 */
@RestController
@RequestMapping("/webhooks")
@RequiredArgsConstructor
@Slf4j
public class StripeWebhookController {

    private final PaymentService paymentService;

    @Value("${stripe.webhook.secret:whsec_placeholder}")
    private String webhookSecret;

    @PostMapping("/stripe")
    public ResponseEntity<String> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader) {
        
        log.info("Received Stripe webhook");

        Event event;
        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            log.error("Invalid Stripe signature: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid signature");
        } catch (Exception e) {
            log.error("Error parsing webhook: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error parsing webhook");
        }

        log.info("Processing Stripe event: {}", event.getType());

        try {
            switch (event.getType()) {
                case "payment_intent.succeeded":
                    handlePaymentIntentSucceeded(event);
                    break;
                case "payment_intent.payment_failed":
                    handlePaymentIntentFailed(event);
                    break;
                case "payment_intent.canceled":
                    handlePaymentIntentCanceled(event);
                    break;
                case "charge.refunded":
                    handleChargeRefunded(event);
                    break;
                default:
                    log.info("Unhandled event type: {}", event.getType());
            }
        } catch (Exception e) {
            log.error("Error processing webhook event: {}", e.getMessage());
            // Return 200 to prevent Stripe from retrying
            return ResponseEntity.ok("Error processed");
        }

        return ResponseEntity.ok("Webhook processed");
    }

    private void handlePaymentIntentSucceeded(Event event) {
        log.info("Payment succeeded webhook deferred - Stripe integration not yet implemented");
    }

    private void handlePaymentIntentFailed(Event event) {
        log.warn("Payment failed webhook deferred - Stripe integration not yet implemented");
    }

    private void handlePaymentIntentCanceled(Event event) {
        log.info("Payment canceled webhook deferred - Stripe integration not yet implemented");
    }

    private void handleChargeRefunded(Event event) {
        log.info("Charge refunded event received - deferred");
    }
}
