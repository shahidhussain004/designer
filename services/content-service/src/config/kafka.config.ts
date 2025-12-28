// Kafka configuration
export const kafkaConfig = {
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
  clientId: process.env.KAFKA_CLIENT_ID || 'content-service',
  groupId: process.env.KAFKA_GROUP_ID || 'content-service-group',

  // Topics published by this service
  topics: {
    contentEvents: 'content-service.content.events',
    commentEvents: 'content-service.comment.events',
    analyticsEvents: 'content-service.analytics.events',
  },

  // Topics consumed by this service
  consumeTopics: {
    userEvents: 'marketplace-service.user.events',
  },

  // Event types
  eventTypes: {
    contentCreated: 'content.created',
    contentUpdated: 'content.updated',
    contentPublished: 'content.published',
    contentDeleted: 'content.deleted',
    commentCreated: 'content.comment.created',
    contentLiked: 'content.liked',
    contentViewed: 'content.viewed',
  },
};

// Event type union
export type KafkaEventType =
  | 'content.created'
  | 'content.updated'
  | 'content.published'
  | 'content.deleted'
  | 'content.comment.created'
  | 'content.liked'
  | 'content.viewed';

export type KafkaConfig = typeof kafkaConfig;
