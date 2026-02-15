/**
 * Content Service Entry Point - Refactored to use raw PostgreSQL
 */

// Load environment variables before any other imports
import 'dotenv/config';

import { buildApp } from './app';
import { appConfig } from './config/app.config';
import { getDatabaseService } from './config/db.service';
import { logger } from './config/logger.config';
import { redisService } from './infrastructure/cache';
import { kafkaService } from './infrastructure/messaging';
import { storageService } from './infrastructure/storage';

async function bootstrap(): Promise<void> {
  const app = await buildApp();

  // Graceful shutdown handler
  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Received shutdown signal');

    try {
      await app.close();
      await getDatabaseService().disconnect();
      await redisService.disconnect();
      await kafkaService.disconnect();
      logger.info('Graceful shutdown completed');
      process.exit(0);
    } catch (error) {
      logger.error({ error }, 'Error during shutdown');
      process.exit(1);
    }
  };

  // Register shutdown handlers
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.fatal({ error }, 'Uncaught exception');
    process.exit(1);
  });

  process.on('unhandledRejection', (reason) => {
    logger.fatal({ reason }, 'Unhandled rejection');
    process.exit(1);
  });

  try {
    // Initialize infrastructure
    logger.info('Connecting to infrastructure services...');

    // Database (required) - This will also run migrations automatically
    logger.debug('Connecting to PostgreSQL database...');
    await getDatabaseService().connect();
    logger.debug('Database connected and migrations applied');

    // Storage (required)
    logger.debug('Initializing storage service...');
    await storageService.init();
    logger.debug('Storage service initialized');

    // Redis (optional - graceful degradation)
    logger.debug('Connecting to Redis...');
    await redisService.connect();
    logger.debug('Redis connected');

    // Kafka (optional - graceful degradation)
    logger.debug('Connecting to Kafka...');
    await kafkaService.connect();
    logger.debug('Kafka connected');

    // Start server
    await app.listen({
      port: appConfig.port,
      host: '0.0.0.0',
    });

    logger.info(
      {
        port: appConfig.port,
        env: appConfig.nodeEnv,
      },
      'Content Service started successfully'
    );

    logger.info(`API Docs available at http://localhost:${appConfig.port}/docs`);

    // Log migration status
    const migrationStatus = await getDatabaseService().getMigrationStatus();
    logger.info(
      {
        appliedMigrations: migrationStatus.applied.length,
        pendingMigrations: migrationStatus.pending.length,
      },
      'Database migration status'
    );
  } catch (error) {
    logger.fatal({ error }, 'Failed to start server');
    console.error('FATAL ERROR:', error);
    process.exit(1);
  }
}

bootstrap().catch((err) => {
  console.error('Bootstrap error:', err);
  process.exit(1);
});
