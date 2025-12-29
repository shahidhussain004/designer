/**
 * Content routes
 */
import { authenticate, optionalAuth, requireAdmin } from '@common/middleware';
import {
  contentListSchema,
  contentTypeSchema,
  createContentSchema,
  updateContentSchema,
} from '@common/utils/validation';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { contentService } from './content.service';

interface IdParams {
  id: string;
}

interface SlugParams {
  slug: string;
}

interface ContentTypeParams {
  type: string;
}

export async function contentRoutes(fastify: FastifyInstance): Promise<void> {
  // Get all published content (public)
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const parsed = contentListSchema.parse(request.query);

    // Transform date strings to Date objects
    const params = {
      ...parsed,
      filters: parsed.filters
        ? {
            ...parsed.filters,
            publishedAfter: parsed.filters.publishedAfter
              ? new Date(parsed.filters.publishedAfter)
              : undefined,
            publishedBefore: parsed.filters.publishedBefore
              ? new Date(parsed.filters.publishedBefore)
              : undefined,
          }
        : undefined,
    };

    const result = await contentService.findPublished(params);
    return reply.send({
      success: true,
      ...result,
    });
  });

  // Get featured content
  fastify.get<{ Querystring: { limit?: number } }>(
    '/featured',
    async (request: FastifyRequest<{ Querystring: { limit?: number } }>, reply: FastifyReply) => {
      const limit = request.query.limit || 5;
      const content = await contentService.findFeatured(limit);
      return reply.send({
        success: true,
        data: content,
      });
    }
  );

  // Get trending content
  fastify.get<{ Querystring: { limit?: number } }>(
    '/trending',
    async (request: FastifyRequest<{ Querystring: { limit?: number } }>, reply: FastifyReply) => {
      const limit = request.query.limit || 10;
      const content = await contentService.findTrending(limit);
      return reply.send({
        success: true,
        data: content,
      });
    }
  );

  // Get recent content by type
  fastify.get<{ Params: ContentTypeParams; Querystring: { limit?: number } }>(
    '/recent/:type',
    async (
      request: FastifyRequest<{ Params: ContentTypeParams; Querystring: { limit?: number } }>,
      reply: FastifyReply
    ) => {
      const contentType = contentTypeSchema.parse(request.params.type);
      const limit = request.query.limit || 10;
      const content = await contentService.findRecent(contentType, limit);
      return reply.send({
        success: true,
        data: content,
      });
    }
  );

  // Get content statistics (admin only)
  fastify.get(
    '/stats',
    { preHandler: [authenticate, requireAdmin] },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const stats = await contentService.getStats();
      return reply.send({
        success: true,
        data: stats,
      });
    }
  );

  // Get content by ID
  fastify.get<{ Params: IdParams }>(
    '/:id',
    { preHandler: [optionalAuth] },
    async (request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) => {
      const content = await contentService.findById(request.params.id);
      return reply.send({
        success: true,
        data: content,
      });
    }
  );

  // Get content by slug
  fastify.get<{ Params: SlugParams }>(
    '/slug/:slug',
    { preHandler: [optionalAuth] },
    async (request: FastifyRequest<{ Params: SlugParams }>, reply: FastifyReply) => {
      const content = await contentService.findBySlug(request.params.slug);
      return reply.send({
        success: true,
        data: content,
      });
    }
  );

  // Get related content
  fastify.get<{ Params: IdParams; Querystring: { limit?: number } }>(
    '/:id/related',
    async (
      request: FastifyRequest<{ Params: IdParams; Querystring: { limit?: number } }>,
      reply: FastifyReply
    ) => {
      const limit = request.query.limit || 5;
      const content = await contentService.findRelated(request.params.id, limit);
      return reply.send({
        success: true,
        data: content,
      });
    }
  );

  // Create content (authenticated users)
  fastify.post(
    '/',
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const input = createContentSchema.parse(request.body);
      const content = await contentService.create(input, request.userId!);
      return reply.status(201).send({
        success: true,
        data: content,
      });
    }
  );

  // Update content
  fastify.patch<{ Params: IdParams }>(
    '/:id',
    { preHandler: [authenticate] },
    async (request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) => {
      const input = updateContentSchema.parse(request.body);
      const isAdmin = request.user?.role === 'admin';
      const content = await contentService.update(
        request.params.id,
        input,
        request.userId!,
        isAdmin
      );
      return reply.send({
        success: true,
        data: content,
      });
    }
  );

  // Publish content
  fastify.post<{ Params: IdParams }>(
    '/:id/publish',
    { preHandler: [authenticate] },
    async (request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) => {
      const isAdmin = request.user?.role === 'admin';
      const content = await contentService.publish(request.params.id, request.userId!, isAdmin);
      return reply.send({
        success: true,
        data: content,
      });
    }
  );

  // Unpublish content
  fastify.post<{ Params: IdParams }>(
    '/:id/unpublish',
    { preHandler: [authenticate] },
    async (request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) => {
      const isAdmin = request.user?.role === 'admin';
      const content = await contentService.unpublish(request.params.id, request.userId!, isAdmin);
      return reply.send({
        success: true,
        data: content,
      });
    }
  );

  // Delete content
  fastify.delete<{ Params: IdParams }>(
    '/:id',
    { preHandler: [authenticate] },
    async (request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) => {
      const isAdmin = request.user?.role === 'admin';
      await contentService.delete(request.params.id, request.userId!, isAdmin);
      return reply.status(204).send();
    }
  );
}
