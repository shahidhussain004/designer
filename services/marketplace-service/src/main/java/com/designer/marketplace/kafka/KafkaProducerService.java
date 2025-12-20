package com.designer.marketplace.kafka;

import com.designer.marketplace.entity.Job;
import com.designer.marketplace.entity.Payment;
import com.designer.marketplace.entity.Proposal;
import com.designer.marketplace.entity.User;
import com.designer.marketplace.kafka.events.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.concurrent.CompletableFuture;

/**
 * Kafka producer service for publishing events to various topics.
 * This service handles all event publishing for the marketplace platform.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KafkaProducerService {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    /**
     * Publishes a job posted event
     */
    public void publishJobPosted(Job job, User client) {
        JobEventPayload payload = JobEventPayload.builder()
                .jobId(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .clientId(client.getId())
                .clientName(client.getFullName())
                .category(job.getCategory())
                .budget(job.getBudget())
                .budgetType(job.getBudgetType() != null ? job.getBudgetType().name() : null)
                .status(job.getStatus() != null ? job.getStatus().name() : null)
                .requiredSkills(job.getRequiredSkills() != null ? Arrays.asList(job.getRequiredSkills()) : null)
                .duration(job.getDuration())
                .experienceLevel(job.getExperienceLevel() != null ? job.getExperienceLevel().name() : null)
                .build();

        publishEvent(KafkaTopics.JOBS_POSTED, job.getId().toString(),
                KafkaEvent.of("JOB_POSTED", client.getId(), payload));

        log.info("Published job.posted event for job: {}", job.getId());
    }

    /**
     * Publishes a job updated event
     */
    public void publishJobUpdated(Job job, User client) {
        JobEventPayload payload = JobEventPayload.builder()
                .jobId(job.getId())
                .title(job.getTitle())
                .clientId(client.getId())
                .clientName(client.getFullName())
                .status(job.getStatus() != null ? job.getStatus().name() : null)
                .budget(job.getBudget())
                .build();

        publishEvent(KafkaTopics.JOBS_UPDATED, job.getId().toString(),
                KafkaEvent.of("JOB_UPDATED", client.getId(), payload));

        log.info("Published job.updated event for job: {}", job.getId());
    }

    /**
     * Publishes a job deleted event
     */
    public void publishJobDeleted(Long jobId, String jobTitle, User client) {
        JobEventPayload payload = JobEventPayload.builder()
                .jobId(jobId)
                .title(jobTitle)
                .clientId(client.getId())
                .clientName(client.getFullName())
                .build();

        publishEvent(KafkaTopics.JOBS_DELETED, jobId.toString(),
                KafkaEvent.of("JOB_DELETED", client.getId(), payload));

        log.info("Published job.deleted event for job: {}", jobId);
    }

    /**
     * Publishes a payment received event
     */
    public void publishPaymentReceived(Payment payment, Long fromUserId, Long toUserId) {
        PaymentEventPayload payload = PaymentEventPayload.builder()
                .paymentId(payment.getId().toString())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status(payment.getStatus() != null ? payment.getStatus().name() : null)
                .fromUserId(fromUserId)
                .toUserId(toUserId)
                .stripePaymentIntentId(payment.getPaymentIntentId())
                .build();

        publishEvent(KafkaTopics.PAYMENTS_RECEIVED, payment.getId().toString(),
                KafkaEvent.of("PAYMENT_RECEIVED", toUserId, payload));

        log.info("Published payment.received event for payment: {}", payment.getId());
    }

    /**
     * Publishes a payment disputed event
     */
    public void publishPaymentDisputed(Payment payment, Long fromUserId, Long toUserId, String reason) {
        PaymentEventPayload payload = PaymentEventPayload.builder()
                .paymentId(payment.getId().toString())
                .amount(payment.getAmount())
                .currency(payment.getCurrency())
                .status("DISPUTED")
                .fromUserId(fromUserId)
                .toUserId(toUserId)
                .failureReason(reason)
                .build();

        publishEvent(KafkaTopics.PAYMENTS_DISPUTED, payment.getId().toString(),
                KafkaEvent.of("PAYMENT_DISPUTED", fromUserId, payload));

        log.info("Published payment.disputed event for payment: {}", payment.getId());
    }

    /**
     * Publishes a proposal submitted event
     */
    public void publishProposalSubmitted(Proposal proposal, Job job, User freelancer, User client) {
        ProposalEventPayload payload = ProposalEventPayload.builder()
                .proposalId(proposal.getId())
                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .freelancerId(freelancer.getId())
                .freelancerName(freelancer.getFullName())
                .clientId(client.getId())
                .proposedRate(proposal.getProposedRate())
                .estimatedDuration(proposal.getEstimatedDuration())
                .status(proposal.getStatus() != null ? proposal.getStatus().name() : null)
                .coverLetterPreview(truncate(proposal.getCoverLetter(), 100))
                .build();

        publishEvent(KafkaTopics.PROPOSALS_SUBMITTED, proposal.getId().toString(),
                KafkaEvent.of("PROPOSAL_SUBMITTED", freelancer.getId(), payload));

        log.info("Published proposal.submitted event for proposal: {}", proposal.getId());
    }

    /**
     * Publishes a contract signed event
     */
    public void publishContractSigned(Long contractId, Job job, User client, User freelancer,
            java.math.BigDecimal amount) {
        ContractEventPayload payload = ContractEventPayload.builder()
                .contractId(contractId)
                .jobId(job.getId())
                .jobTitle(job.getTitle())
                .clientId(client.getId())
                .clientName(client.getFullName())
                .freelancerId(freelancer.getId())
                .freelancerName(freelancer.getFullName())
                .amount(amount)
                .status("SIGNED")
                .build();

        publishEvent(KafkaTopics.CONTRACTS_SIGNED, contractId.toString(),
                KafkaEvent.of("CONTRACT_SIGNED", freelancer.getId(), payload));

        log.info("Published contract.signed event for contract: {}", contractId);
    }

    /**
     * Publishes a user joined event
     */
    public void publishUserJoined(User user) {
        UserEventPayload payload = UserEventPayload.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole() != null ? user.getRole().name() : null)
                .profileImageUrl(user.getProfileImageUrl())
                .build();

        publishEvent(KafkaTopics.USERS_JOINED, user.getId().toString(),
                KafkaEvent.of("USER_JOINED", user.getId(), payload));

        log.info("Published user.joined event for user: {}", user.getId());
    }

    /**
     * Publishes a message sent event
     */
    public void publishMessageSent(String messageId, String threadId,
            User sender, User receiver, String bodyPreview, Long jobId) {
        MessageEventPayload payload = MessageEventPayload.builder()
                .messageId(messageId)
                .threadId(threadId)
                .senderId(sender.getId())
                .senderName(sender.getFullName())
                .receiverId(receiver.getId())
                .receiverName(receiver.getFullName())
                .bodyPreview(truncate(bodyPreview, 100))
                .jobId(jobId)
                .build();

        publishEvent(KafkaTopics.MESSAGES_SENT, messageId,
                KafkaEvent.of("MESSAGE_SENT", sender.getId(), payload));

        log.info("Published message.sent event for message: {}", messageId);
    }

    /**
     * Publishes a course completed event
     */
    public void publishCourseCompleted(String courseId, String courseTitle, User user) {
        CourseEventPayload payload = CourseEventPayload.builder()
                .courseId(courseId)
                .courseTitle(courseTitle)
                .userId(user.getId())
                .userName(user.getFullName())
                .completedAt(java.time.Instant.now())
                .progressPercent(100)
                .build();

        publishEvent(KafkaTopics.COURSES_COMPLETED, courseId,
                KafkaEvent.of("COURSE_COMPLETED", user.getId(), payload));

        log.info("Published course.completed event for course: {} by user: {}", courseId, user.getId());
    }

    /**
     * Publishes a certificate issued event
     */
    public void publishCertificateIssued(String certificateId, String courseId,
            String courseTitle, User user, String certificateUrl) {
        CertificateEventPayload payload = CertificateEventPayload.builder()
                .certificateId(certificateId)
                .courseId(courseId)
                .courseTitle(courseTitle)
                .userId(user.getId())
                .userName(user.getFullName())
                .issuedAt(java.time.Instant.now())
                .certificateUrl(certificateUrl)
                .build();

        publishEvent(KafkaTopics.CERTIFICATES_ISSUED, certificateId,
                KafkaEvent.of("CERTIFICATE_ISSUED", user.getId(), payload));

        log.info("Published certificate.issued event for certificate: {}", certificateId);
    }

    /**
     * Generic method to publish events to Kafka
     */
    private void publishEvent(String topic, String key, Object event) {
        CompletableFuture<SendResult<String, Object>> future = kafkaTemplate.send(topic, key, event);

        future.whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("Failed to send message to topic {}: {}", topic, ex.getMessage());
            } else {
                log.debug("Message sent to topic {} partition {} offset {}",
                        topic,
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
            }
        });
    }

    /**
     * Truncates a string to the specified length
     */
    private String truncate(String text, int maxLength) {
        if (text == null) {
            return null;
        }
        return text.length() > maxLength ? text.substring(0, maxLength) + "..." : text;
    }
}
