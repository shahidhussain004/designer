package com.designer.marketplace.kafka;

/**
 * Kafka topics used in the Designer Marketplace platform.
 * These topics are used for event-driven communication between services.
 */
public final class KafkaTopics {

    // Job-related events
    public static final String JOBS_POSTED = "jobs.posted";
    public static final String JOBS_UPDATED = "jobs.updated";
    public static final String JOBS_DELETED = "jobs.deleted";

    // Payment-related events
    public static final String PAYMENTS_RECEIVED = "payments.received";
    public static final String PAYMENTS_DISPUTED = "payments.disputed";

    // Messaging events
    public static final String MESSAGES_SENT = "messages.sent";

    // User events
    public static final String USERS_JOINED = "users.joined";

    // Proposal events
    public static final String PROPOSALS_SUBMITTED = "proposals.submitted";

    // Contract events
    public static final String CONTRACTS_SIGNED = "contracts.signed";

    // LMS events
    public static final String COURSES_COMPLETED = "courses.completed";
    public static final String CERTIFICATES_ISSUED = "certificates.issued";

    private KafkaTopics() {
        // Prevent instantiation
    }
}
