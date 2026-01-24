/**
 * Resources Routes
 * Public and admin endpoints for resources feature
 */

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { resourcesService } from './resources.service';

export async function resourcesRoutes(app: FastifyInstance) {
  // =====================================================
  // PUBLIC ROUTES
  // =====================================================

  // Get all resources
  app.get(
    '/',
    {
      schema: {
        description: 'Get all resources',
        tags: ['resources'],
        querystring: {
          type: 'object',
          properties: {
            published: { type: 'string', enum: ['true', 'false'], default: 'true' },
            category: { type: 'string' },
            search: { type: 'string' },
            page: { type: 'string', default: '1' },
            pageSize: { type: 'string', default: '12' },
            sortBy: { type: 'string' },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{
        Querystring: {
          published?: string;
          category?: string;
          search?: string;
          page?: string;
          pageSize?: string;
          sortBy?: string;
        };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const published = request.query.published !== 'false';
        const page = parseInt(request.query.page || '1', 10);
        const pageSize = parseInt(request.query.pageSize || '12', 10);

        const result = await resourcesService.getAllResources(published, {
          category: request.query.category,
          search: request.query.search,
          page,
          pageSize,
          sortBy: request.query.sortBy,
        });

        return reply.send({
          success: true,
          ...result,
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to fetch resources',
        });
      }
    }
  );

  // Get resource by slug
  app.get(
    '/:slug',
    {
      schema: {
        description: 'Get resource by slug',
        tags: ['resources'],
        params: {
          type: 'object',
          properties: {
            slug: { type: 'string' },
          },
          required: ['slug'],
        },
      },
    },
    async (request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) => {
      try {
        const resource = await resourcesService.getResourceBySlug(request.params.slug);

        if (!resource) {
          return reply.status(404).send({
            success: false,
            error: 'Resource not found',
          });
        }

        return reply.send({
          success: true,
          data: resource,
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to fetch resource',
        });
      }
    }
  );

  // Get resource by ID
  app.get(
    '/id/:id',
    {
      schema: {
        description: 'Get resource by ID',
        tags: ['resources'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const resource = await resourcesService.getResourceById(request.params.id);

        if (!resource) {
          return reply.status(404).send({
            success: false,
            error: 'Resource not found',
          });
        }

        return reply.send({
          success: true,
          data: resource,
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to fetch resource',
        });
      }
    }
  );

  // Get resources by category
  app.get(
    '/category/:category',
    {
      schema: {
        description: 'Get resources by category',
        tags: ['resources'],
        params: {
          type: 'object',
          properties: {
            category: { type: 'string' },
          },
          required: ['category'],
        },
      },
    },
    async (request: FastifyRequest<{ Params: { category: string } }>, reply: FastifyReply) => {
      try {
        const resources = await resourcesService.getResourcesByCategory(request.params.category);

        return reply.send({
          success: true,
          data: resources,
          count: resources.length,
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to fetch resources',
        });
      }
    }
  );

  // =====================================================
  // ADMIN ROUTES (can be protected with auth middleware)
  // =====================================================

  // Create resource (admin)
  app.post(
    '/',
    {
      schema: {
        description: 'Create a new resource',
        tags: ['resources', 'admin'],
        body: {
          type: 'object',
          required: ['title', 'slug', 'content'],
          properties: {
            title: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            content: { type: 'string' },
            category: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            sourceUrl: { type: 'string' },
            authorName: { type: 'string' },
            authorUrl: { type: 'string' },
            resourceType: { type: 'string' },
            difficulty: { type: 'string' },
            estimatedReadTime: { type: 'number' },
            thumbnailUrl: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const resource = await resourcesService.createResource(request.body as any);

        return reply.status(201).send({
          success: true,
          data: resource,
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to create resource',
        });
      }
    }
  );

  // Update resource (admin)
  app.patch(
    '/:id',
    {
      schema: {
        description: 'Update a resource',
        tags: ['resources', 'admin'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
        body: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            content: { type: 'string' },
            category: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
            sourceUrl: { type: 'string' },
            authorName: { type: 'string' },
            authorUrl: { type: 'string' },
            resourceType: { type: 'string' },
            difficulty: { type: 'string' },
            estimatedReadTime: { type: 'number' },
            thumbnailUrl: { type: 'string' },
            isPublished: { type: 'boolean' },
            displayOrder: { type: 'number' },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const resource = await resourcesService.updateResource(
          request.params.id,
          request.body as any
        );

        return reply.send({
          success: true,
          data: resource,
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to update resource',
        });
      }
    }
  );

  // Delete resource (admin)
  app.delete(
    '/:id',
    {
      schema: {
        description: 'Delete a resource',
        tags: ['resources', 'admin'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        await resourcesService.deleteResource(request.params.id);

        return reply.send({
          success: true,
          message: 'Resource deleted successfully',
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to delete resource',
        });
      }
    }
  );
}
