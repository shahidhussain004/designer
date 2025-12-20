package com.designer.marketplace.config;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Rate limiting configuration using Bucket4j
 * Provides token bucket rate limiters for API protection
 */
@Configuration
public class RateLimitConfig {

    /**
     * Rate limiter for authentication endpoints (stricter limits)
     * 5 requests per minute per IP
     */
    public Bucket createAuthBucket() {
        Bandwidth limit = Bandwidth.classic(5, Refill.greedy(5, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    /**
     * Rate limiter for general API endpoints
     * 100 requests per minute per IP
     */
    public Bucket createGeneralBucket() {
        Bandwidth limit = Bandwidth.classic(100, Refill.greedy(100, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    /**
     * Rate limiter for admin endpoints
     * 50 requests per minute per admin user
     */
    public Bucket createAdminBucket() {
        Bandwidth limit = Bandwidth.classic(50, Refill.greedy(50, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    /**
     * Rate limiter for webhook endpoints (Stripe)
     * 1000 requests per minute (Stripe may send bursts)
     */
    public Bucket createWebhookBucket() {
        Bandwidth limit = Bandwidth.classic(1000, Refill.greedy(1000, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    /**
     * Service to manage rate limit buckets by IP/key
     */
    @Component
    public static class RateLimiterService {
        
        private final Map<String, Bucket> authBuckets = new ConcurrentHashMap<>();
        private final Map<String, Bucket> generalBuckets = new ConcurrentHashMap<>();
        private final RateLimitConfig config;

        public RateLimiterService(RateLimitConfig config) {
            this.config = config;
        }

        /**
         * Get or create auth bucket for given key (IP address)
         */
        public Bucket getAuthBucket(String key) {
            return authBuckets.computeIfAbsent(key, k -> config.createAuthBucket());
        }

        /**
         * Get or create general bucket for given key (IP address)
         */
        public Bucket getGeneralBucket(String key) {
            return generalBuckets.computeIfAbsent(key, k -> config.createGeneralBucket());
        }

        /**
         * Check if request is allowed and consume a token
         * @return true if allowed, false if rate limited
         */
        public boolean tryConsumeAuth(String clientIp) {
            return getAuthBucket(clientIp).tryConsume(1);
        }

        /**
         * Check if request is allowed for general API
         */
        public boolean tryConsumeGeneral(String clientIp) {
            return getGeneralBucket(clientIp).tryConsume(1);
        }
    }
}
