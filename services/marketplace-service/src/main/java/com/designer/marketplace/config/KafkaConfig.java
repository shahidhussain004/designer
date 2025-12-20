package com.designer.marketplace.config;

import org.apache.kafka.clients.admin.AdminClientConfig;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaAdmin;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;

import java.util.HashMap;
import java.util.Map;

import static com.designer.marketplace.kafka.KafkaTopics.*;

/**
 * Kafka configuration for the marketplace service.
 * Configures producer, topics, and admin client.
 */
@Configuration
public class KafkaConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Bean
    public KafkaAdmin kafkaAdmin() {
        Map<String, Object> configs = new HashMap<>();
        configs.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        return new KafkaAdmin(configs);
    }

    @Bean
    public ProducerFactory<String, Object> producerFactory() {
        Map<String, Object> configProps = new HashMap<>();
        configProps.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        configProps.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        configProps.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        configProps.put(ProducerConfig.ACKS_CONFIG, "all");
        configProps.put(ProducerConfig.RETRIES_CONFIG, 3);
        configProps.put(ProducerConfig.RETRY_BACKOFF_MS_CONFIG, 1000);
        configProps.put(ProducerConfig.ENABLE_IDEMPOTENCE_CONFIG, true);
        configProps.put(JsonSerializer.ADD_TYPE_INFO_HEADERS, false);
        return new DefaultKafkaProducerFactory<>(configProps);
    }

    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }

    // Topic definitions
    @Bean
    public NewTopic jobsPostedTopic() {
        return TopicBuilder.name(JOBS_POSTED)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic jobsUpdatedTopic() {
        return TopicBuilder.name(JOBS_UPDATED)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic jobsDeletedTopic() {
        return TopicBuilder.name(JOBS_DELETED)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic paymentsReceivedTopic() {
        return TopicBuilder.name(PAYMENTS_RECEIVED)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic paymentsDisputedTopic() {
        return TopicBuilder.name(PAYMENTS_DISPUTED)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic messagesSentTopic() {
        return TopicBuilder.name(MESSAGES_SENT)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic usersJoinedTopic() {
        return TopicBuilder.name(USERS_JOINED)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic proposalsSubmittedTopic() {
        return TopicBuilder.name(PROPOSALS_SUBMITTED)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic contractsSignedTopic() {
        return TopicBuilder.name(CONTRACTS_SIGNED)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic coursesCompletedTopic() {
        return TopicBuilder.name(COURSES_COMPLETED)
                .partitions(3)
                .replicas(1)
                .build();
    }

    @Bean
    public NewTopic certificatesIssuedTopic() {
        return TopicBuilder.name(CERTIFICATES_ISSUED)
                .partitions(3)
                .replicas(1)
                .build();
    }
}
