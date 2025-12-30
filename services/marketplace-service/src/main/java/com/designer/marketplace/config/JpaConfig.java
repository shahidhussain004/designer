package com.designer.marketplace.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

/**
 * JPA configuration for marketplace repositories.
 * Specifies the repository packages for PostgreSQL-backed entities.
 */
@Configuration
@EnableJpaRepositories(
    basePackages = "com.designer.marketplace.repository"
    // Exclude LMS repositories - they use MongoDB (configured in MongoConfig)
)
public class JpaConfig {
    // Spring Boot auto-configures the DataSource and EntityManagerFactory
    // This class specifies JPA repository packages (excluding MongoDB repos)
}
