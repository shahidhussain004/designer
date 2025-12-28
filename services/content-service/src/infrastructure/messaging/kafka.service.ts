/**
 * Kafka messaging service
 */
import { EventPayload } from '@common/interfaces';
import { kafkaConfig, KafkaEventType } from '@config/kafka.config';
import { logger } from '@config/logger.config';
import { Admin, Consumer, Kafka, logLevel, Partitioners, Producer } from 'kafkajs';

class KafkaService {
  private static instance: KafkaService;
  private kafka: Kafka;
  private producer: Producer | null = null;
  private consumers: Map<string, Consumer> = new Map();
  private admin: Admin;
  private isProducerConnected: boolean = false;

  private constructor() {
    this.kafka = new Kafka({
      clientId: kafkaConfig.clientId,
      brokers: kafkaConfig.brokers,
      logLevel: logLevel.ERROR,
      retry: {
        initialRetryTime: 100,
        retries: 8,
      },
    });

    this.admin = this.kafka.admin();
  }

  public static getInstance(): KafkaService {
    if (!KafkaService.instance) {
      KafkaService.instance = new KafkaService();
    }
    return KafkaService.instance;
  }

  public async connect(): Promise<void> {
    try {
      // Connect admin
      await this.admin.connect();
      
      // Create topics if they don't exist
      await this.ensureTopicsExist();
      
      // Connect producer
      this.producer = this.kafka.producer({
        createPartitioner: Partitioners.DefaultPartitioner,
      });
      await this.producer.connect();
      this.isProducerConnected = true;
      
      logger.info('Kafka connected successfully');
    } catch (error) {
      logger.error({ error }, 'Failed to connect to Kafka');
      // Don't throw - Kafka is optional for the service to run
    }
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.producer) {
        await this.producer.disconnect();
        this.isProducerConnected = false;
      }
      
      for (const [groupId, consumer] of this.consumers) {
        await consumer.disconnect();
        logger.info({ groupId }, 'Consumer disconnected');
      }
      this.consumers.clear();
      
      await this.admin.disconnect();
      
      logger.info('Kafka disconnected');
    } catch (error) {
      logger.error({ error }, 'Error disconnecting from Kafka');
    }
  }

  private async ensureTopicsExist(): Promise<void> {
    try {
      const existingTopics = await this.admin.listTopics();
      const allTopics = Object.values(kafkaConfig.topics);
      const missingTopics = allTopics.filter((topic) => !existingTopics.includes(topic));

      if (missingTopics.length > 0) {
        await this.admin.createTopics({
          topics: missingTopics.map((topic) => ({
            topic,
            numPartitions: 3,
            replicationFactor: 1,
          })),
        });
        logger.info({ topics: missingTopics }, 'Created Kafka topics');
      }
    } catch (error) {
      logger.warn({ error }, 'Failed to ensure topics exist');
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      if (!this.isProducerConnected) return false;
      const topics = await this.admin.listTopics();
      return topics.length >= 0;
    } catch {
      return false;
    }
  }

  // Producer methods
  public async publish<T>(
    topic: string,
    eventType: KafkaEventType,
    data: T,
    key?: string
  ): Promise<void> {
    if (!this.producer || !this.isProducerConnected) {
      logger.warn({ topic, eventType }, 'Kafka producer not connected, skipping publish');
      return;
    }

    const event: EventPayload<T> = {
      eventType,
      timestamp: new Date(),
      source: 'content-service',
      data,
    };

    try {
      await this.producer.send({
        topic,
        messages: [
          {
            key: key || undefined,
            value: JSON.stringify(event),
            headers: {
              'event-type': eventType,
              'timestamp': new Date().toISOString(),
            },
          },
        ],
      });
      
      logger.debug({ topic, eventType }, 'Event published');
    } catch (error) {
      logger.error({ error, topic, eventType }, 'Failed to publish event');
      throw error;
    }
  }

  // Convenience methods for common events
  async publishContentCreated(contentId: string, data: unknown): Promise<void> {
    await this.publish(
      kafkaConfig.topics.contentEvents,
      'content.created',
      data,
      contentId
    );
  }

  async publishContentUpdated(contentId: string, data: unknown): Promise<void> {
    await this.publish(
      kafkaConfig.topics.contentEvents,
      'content.updated',
      data,
      contentId
    );
  }

  async publishContentPublished(contentId: string, data: unknown): Promise<void> {
    await this.publish(
      kafkaConfig.topics.contentEvents,
      'content.published',
      data,
      contentId
    );
  }

  async publishContentDeleted(contentId: string, data: unknown): Promise<void> {
    await this.publish(
      kafkaConfig.topics.contentEvents,
      'content.deleted',
      data,
      contentId
    );
  }

  async publishCommentCreated(contentId: string, data: unknown): Promise<void> {
    await this.publish(
      kafkaConfig.topics.commentEvents,
      'content.comment.created',
      data,
      contentId
    );
  }

  async publishContentViewed(contentId: string, data: unknown): Promise<void> {
    await this.publish(
      kafkaConfig.topics.analyticsEvents,
      'content.viewed',
      data,
      contentId
    );
  }

  async publishContentLiked(contentId: string, data: unknown): Promise<void> {
    await this.publish(
      kafkaConfig.topics.analyticsEvents,
      'content.liked',
      data,
      contentId
    );
  }

  // Consumer methods
  public async subscribe(
    groupId: string,
    topic: string,
    handler: (message: EventPayload) => Promise<void>
  ): Promise<void> {
    const consumer = this.kafka.consumer({ groupId });
    
    try {
      await consumer.connect();
      await consumer.subscribe({ topic, fromBeginning: false });
      
      await consumer.run({
        eachMessage: async ({ message }) => {
          if (!message.value) return;
          
          try {
            const event = JSON.parse(message.value.toString()) as EventPayload;
            await handler(event);
          } catch (error) {
            logger.error({ error, topic }, 'Error processing message');
          }
        },
      });
      
      this.consumers.set(groupId, consumer);
      logger.info({ groupId, topic }, 'Consumer subscribed');
    } catch (error) {
      logger.error({ error, groupId, topic }, 'Failed to subscribe');
      throw error;
    }
  }
}

export const kafkaService = KafkaService.getInstance();
