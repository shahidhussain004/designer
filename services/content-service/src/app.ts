/**
 * Fastify application setup
 */
import { requestContext } from '@common/middleware';
import { logger } from '@config/logger.config';
import Fastify, { FastifyInstance } from 'fastify';
import {
    analyticsRoutes,
    categoryRoutes,
    commentRoutes,
    contentRoutes,
    mediaRoutes,
    searchRoutes,
    tagRoutes,
} from './modules';
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
    logger.info({
      method: request.method,
      url: request.url,
      requestId: request.id,
    }, 'Incoming request');
  });

  // Response logging
  app.addHook('onResponse', async (request, reply) => {
    logger.info({
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      responseTime: reply.elapsedTime,
      requestId: request.id,
    }, 'Request completed');
  });

  // Register API routes
  await app.register(
    async (api) => {
      await api.register(contentRoutes, { prefix: '/content' });
      await api.register(categoryRoutes, { prefix: '/categories' });
      await api.register(tagRoutes, { prefix: '/tags' });
      await api.register(commentRoutes, { prefix: '/comments' });
      await api.register(mediaRoutes, { prefix: '/media' });
      await api.register(searchRoutes, { prefix: '/search' });
      await api.register(analyticsRoutes, { prefix: '/analytics' });
    },
    { prefix: '/api/v1' }
  );

  return app;
}
