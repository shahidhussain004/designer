/**
 * CORS plugin
 */
import { appConfig } from '@config/app.config';
import cors, { FastifyCorsOptions } from '@fastify/cors';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

async function corsPlugin(fastify: FastifyInstance): Promise<void> {
  const options: FastifyCorsOptions = {
    origin: appConfig.cors.origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    exposedHeaders: ['X-Request-ID'],
    maxAge: 86400, // 24 hours
  };

  await fastify.register(cors, options);
}

export default fp(corsPlugin, {
  name: 'cors',
});
