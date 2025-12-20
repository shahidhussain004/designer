package com.designer.marketplace.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

/**
 * MongoDB configuration for LMS.
 * Enables auditing for automatic createdAt/updatedAt timestamps.
 */
@Configuration
@EnableMongoAuditing
@EnableMongoRepositories(basePackages = "com.designer.marketplace.lms.repository")
public class MongoConfig {
    // Spring Boot auto-configures MongoDB connection from application.yml
    // This class enables auditing and specifies the repository package
}
