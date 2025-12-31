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

    logger.debug('Before prismaService.connect');
    // Database (required)
    await prismaService.connect();
    logger.debug('After prismaService.connect');

    logger.debug('Before storageService.init');
    // Storage (required)
    await storageService.init();
    logger.debug('After storageService.init');

    logger.debug('Before redisService.connect');
    // Redis (optional - graceful degradation)
    await redisService.connect();
    logger.debug('After redisService.connect');

    logger.debug('Before kafkaService.connect');
    // Kafka (optional - graceful degradation)
    await kafkaService.connect();
    logger.debug('After kafkaService.connect');

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
  } catch (error) {
    logger.fatal({ error }, 'Failed to start server');
    process.exit(1);
  }
}

bootstrap();
