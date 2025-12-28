/**
 * Health check plugin
 */
import { redisService } from '@infrastructure/cache';
import { prismaService } from '@infrastructure/database';
import { kafkaService } from '@infrastructure/messaging';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    database: boolean;
    redis: boolean;
    kafka: boolean;
  };
  uptime: number;
  timestamp: string;
}

async function healthPlugin(fastify: FastifyInstance): Promise<void> {
  const startTime = Date.now();

  // Basic liveness probe
  fastify.get('/health', async (_request, reply) => {
    return reply.send({ status: 'ok' });
  });

  // Detailed readiness probe
  fastify.get('/health/ready', async (_request, reply) => {
    const [dbHealth, redisHealth, kafkaHealth] = await Promise.all([
      prismaService.healthCheck(),
      redisService.healthCheck(),
      kafkaService.healthCheck(),
    ]);

    const allHealthy = dbHealth && redisHealth && kafkaHealth;
    const anyHealthy = dbHealth; // Database is required

    const health: HealthStatus = {
      status: allHealthy ? 'healthy' : anyHealthy ? 'degraded' : 'unhealthy',
      checks: {
        database: dbHealth,
        redis: redisHealth,
        kafka: kafkaHealth,
      },
      uptime: Math.floor((Date.now() - startTime) / 1000),
      timestamp: new Date().toISOString(),
    };

    const statusCode = health.status === 'unhealthy' ? 503 : 200;
    return reply.status(statusCode).send(health);
  });

  // Metrics endpoint (basic)
  fastify.get('/metrics', async (_request, reply) => {
    const uptime = Math.floor((Date.now() - startTime) / 1000);
    const memoryUsage = process.memoryUsage();

    return reply.send({
      uptime_seconds: uptime,
      memory: {
        heap_used_mb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        heap_total_mb: Math.round(memoryUsage.heapTotal / 1024 / 1024),
        rss_mb: Math.round(memoryUsage.rss / 1024 / 1024),
      },
    });
  });
}

export default fp(healthPlugin, {
  name: 'health',
});
