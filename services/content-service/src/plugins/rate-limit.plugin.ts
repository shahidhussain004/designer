/**
 * Rate limiting plugin
 */
import { appConfig } from '@config/app.config';
import rateLimit from '@fastify/rate-limit';
import { redisService } from '@infrastructure/cache';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

async function rateLimitPlugin(fastify: FastifyInstance): Promise<void> {
  await fastify.register(rateLimit, {
    max: appConfig.rateLimit.max,
    timeWindow: appConfig.rateLimit.timeWindow,
    // Use Redis for distributed rate limiting if connected
    redis: redisService.isConnected ? redisService.client : undefined,
    keyGenerator: (request) => {
      // Use user ID if authenticated, otherwise use IP
      return request.userId || request.ip;
    },
    errorResponseBuilder: (_request, context) => {
      return {
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Too many requests. Please try again in ${Math.ceil(context.ttl / 1000)} seconds.`,
        },
      };
    },
  });
}

export default fp(rateLimitPlugin, {
  name: 'rateLimit',
});
