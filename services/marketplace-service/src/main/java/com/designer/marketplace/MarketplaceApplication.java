package com.designer.marketplace;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main application class for Designer Marketplace Service
 * 
 * Phase 1: Core Marketplace - Java Spring Boot Backend
 * Provides REST APIs for users, jobs, proposals, contracts, and payments
 * 
 * @author Designer Team
 * @version 1.0.0
 * @since December 2025
 */
@SpringBootApplication
@EnableJpaAuditing
public class MarketplaceApplication {

    public static void main(String[] args) {
        SpringApplication.run(MarketplaceApplication.class, args);
    }
}
