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

interface LimitQuerystring {
  limit?: number;
}

// Helper to normalize query params into filters
function normalizeContentQuery(rawQuery: Record<string, unknown>) {
  const normalized = { ...rawQuery };
  const filters: Record<string, unknown> = (rawQuery.filters as Record<string, unknown>) || {};

  // Move top-level filter params into filters object
  if (rawQuery.type) {
    filters.contentType = String(rawQuery.type).toLowerCase();
    delete normalized.type;
  }

  if (rawQuery.status) {
    filters.status = String(rawQuery.status).toLowerCase();
    delete normalized.status;
  }

  if (rawQuery.tagIds) {
    const tagVal = rawQuery.tagIds;
    filters.tagIds = Array.isArray(tagVal)
      ? tagVal
      : typeof tagVal === 'string'
        ? tagVal.split(',')
        : [tagVal];
    delete normalized.tagIds;
  }

  if (Object.keys(filters).length > 0) {
    normalized.filters = filters;
  }

  return normalized;
}

// Helper to transform date strings to Date objects
function transformDates(params: any) {
  if (!params.filters) return params;

  return {
    ...params,
    filters: {
      ...params.filters,
      publishedAfter: params.filters.publishedAfter
        ? new Date(params.filters.publishedAfter)
        : undefined,
      publishedBefore: params.filters.publishedBefore
        ? new Date(params.filters.publishedBefore)
        : undefined,
    },
  };
}

export async function contentRoutes(fastify: FastifyInstance): Promise<void> {
  // Get all published content (public)
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const normalizedQuery = normalizeContentQuery(request.query as Record<string, unknown>);
    const parsed = contentListSchema.parse(normalizedQuery);
    const params = transformDates(parsed);

    const result = await contentService.findPublished(params);
    return reply.send({
      success: true,
      ...result,
    });
  });

  // Get featured content
  fastify.get<{ Querystring: LimitQuerystring }>('/featured', async (request, reply) => {
    const limit = request.query.limit || 5;
    const content = await contentService.findFeatured(limit);
    return reply.send({
      success: true,
      data: content,
    });
  });

  // Get trending content
  fastify.get<{ Querystring: LimitQuerystring }>('/trending', async (request, reply) => {
    const limit = request.query.limit || 10;
    const content = await contentService.findTrending(limit);
    return reply.send({
      success: true,
      data: content,
    });
  });

  // Get recent content by type
  fastify.get<{ Params: ContentTypeParams; Querystring: LimitQuerystring }>(
    '/recent/:type',
    async (request, reply) => {
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
  fastify.get('/stats', { preHandler: [authenticate, requireAdmin] }, async (_request, reply) => {
    const stats = await contentService.getStats();
    return reply.send({
      success: true,
      data: stats,
    });
  });

  // Get content by ID
  fastify.get<{ Params: IdParams }>(
    '/:id',
    { preHandler: [optionalAuth] },
    async (request, reply) => {
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
    async (request, reply) => {
      const content = await contentService.findBySlug(request.params.slug);
      return reply.send({
        success: true,
        data: content,
      });
    }
  );

  // Get related content
  fastify.get<{ Params: IdParams; Querystring: LimitQuerystring }>(
    '/:id/related',
    async (request, reply) => {
      const limit = request.query.limit || 5;
      const content = await contentService.findRelated(request.params.id, limit);
      return reply.send({
        success: true,
        data: content,
      });
    }
  );

  // Create content (authenticated users)
  fastify.post('/', { preHandler: [authenticate] }, async (request, reply) => {
    const input = createContentSchema.parse(request.body);
    const content = await contentService.create(input, request.userId!);
    return reply.status(201).send({
      success: true,
      data: content,
    });
  });

  // Update content
  fastify.patch<{ Params: IdParams }>(
    '/:id',
    { preHandler: [authenticate] },
    async (request, reply) => {
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
    async (request, reply) => {
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
    async (request, reply) => {
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
    async (request, reply) => {
      const isAdmin = request.user?.role === 'admin';
      await contentService.delete(request.params.id, request.userId!, isAdmin);
      return reply.status(204).send();
    }
  );
}
