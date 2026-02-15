/**
 * Fastify application setup - Refactored to use raw PostgreSQL
 */
import { requestContext } from '@common/middleware';
import { logger } from '@config/logger.config';
import Fastify, { FastifyInstance } from 'fastify';

// Import new controllers
import {
  analyticsController,
  categoryController,
  commentController,
  contentController,
  mediaController,
  searchController,
  tagController,
  tutorialController,
} from './controllers';

// Keep existing plugins
import {
  corsPlugin,
  errorHandlerPlugin,
  healthPlugin,
  multipartPlugin,
  rateLimitPlugin,
  swaggerPlugin,
} from './plugins';

export async function buildApp(): Promise<FastifyInstance> {
  const app = Fastify({
    logger: false, // We use our own pino logger
    requestIdHeader: 'x-request-id',
    trustProxy: true,
  });

  // Register plugins
  await app.register(errorHandlerPlugin);
  await app.register(corsPlugin);
  await app.register(rateLimitPlugin);
  await app.register(multipartPlugin);
  await app.register(swaggerPlugin);
  await app.register(healthPlugin);

  // Add request context hook
  app.addHook('onRequest', requestContext);

  // Request logging
  app.addHook('onRequest', async (request) => {
    logger.info(
      {
        method: request.method,
        url: request.url,
        requestId: request.id,
      },
      'Incoming request'
    );
  });

  // Response logging
  app.addHook('onResponse', async (request, reply) => {
    logger.info(
      {
        method: request.method,
        url: request.url,
        statusCode: reply.statusCode,
        responseTime: reply.elapsedTime,
        requestId: request.id,
      },
      'Request completed'
    );
  });

  // Register API routes - Using new controllers
  await app.register(
    async (api) => {
      // Content management
      await api.register(contentController, { prefix: '/content' });
      await api.register(categoryController, { prefix: '/categories' });
      await api.register(tagController, { prefix: '/tags' });
      await api.register(commentController, { prefix: '/comments' });

      // Media management
      await api.register(mediaController, { prefix: '/media' });

      // Search
      await api.register(searchController, { prefix: '/search' });

      // Analytics
      await api.register(analyticsController, { prefix: '/analytics' });

      // Tutorials
      await api.register(tutorialController, { prefix: '/tutorials' });

      // Resources handler removed
    },
    { prefix: '/api/v1' }
  );

  return app;
}
