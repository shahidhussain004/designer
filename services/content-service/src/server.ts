/**
 * Content Service Entry Point
 */
import { buildApp } from './app';
import { appConfig } from './config/app.config';
import { logger } from './config/logger.config';
import { redisService } from './infrastructure/cache';
import { prismaService } from './infrastructure/database';
import { kafkaService } from './infrastructure/messaging';
import { storageService } from './infrastructure/storage';

async function bootstrap(): Promise<void> {
  const app = await buildApp();

  // Graceful shutdown handler
  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Received shutdown signal');

    try {
      await app.close();
      await prismaService.disconnect();
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

    // Database (required)
    await prismaService.connect();

    // Storage (required)
    await storageService.init();

    // Redis (optional - graceful degradation)
    await redisService.connect();

    // Kafka (optional - graceful degradation)
    await kafkaService.connect();

    // Start server
    await app.listen({
      port: appConfig.port,
      host: '0.0.0.0',
    });

    logger.info({
      port: appConfig.port,
      env: appConfig.nodeEnv,
    }, 'Content Service started successfully');

    logger.info(`API Docs available at http://localhost:${appConfig.port}/docs`);
  } catch (error) {
    logger.fatal({ error }, 'Failed to start server');
    process.exit(1);
  }
}

bootstrap();
