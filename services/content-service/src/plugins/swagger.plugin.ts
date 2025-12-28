/**
 * Swagger/OpenAPI documentation plugin
 */
import { appConfig } from '@config/app.config';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

async function swaggerPlugin(fastify: FastifyInstance): Promise<void> {
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: 'Content Service API',
        description: 'API documentation for the Content Service',
        version: '1.0.0',
      },
      servers: [
        {
          url: `http://localhost:${appConfig.port}`,
          description: 'Development server',
        },
      ],
      tags: [
        { name: 'Content', description: 'Content management endpoints' },
        { name: 'Categories', description: 'Category management endpoints' },
        { name: 'Tags', description: 'Tag management endpoints' },
        { name: 'Comments', description: 'Comment management endpoints' },
        { name: 'Media', description: 'Media asset endpoints' },
        { name: 'Search', description: 'Search endpoints' },
        { name: 'Analytics', description: 'Analytics endpoints' },
        { name: 'Health', description: 'Health check endpoints' },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  await fastify.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
    staticCSP: true,
  });
}

export default fp(swaggerPlugin, {
  name: 'swagger',
});
