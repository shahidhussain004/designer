/**
 * Analytics routes
 */
import { authenticate, optionalAuth, requireAdmin } from '@common/middleware';
import { FastifyInstance } from 'fastify';
import { analyticsService } from './analytics.service';

interface ContentIdParams {
  contentId: string;
}

interface LimitQuerystring {
  limit?: number;
}

interface DaysQuerystring {
  days?: number;
}

export async function analyticsRoutes(fastify: FastifyInstance): Promise<void> {
  // Track content view
  fastify.post<{ Params: ContentIdParams }>(
    '/view/:contentId',
    { preHandler: [optionalAuth] },
    async (request, reply) => {
      await analyticsService.trackView(
        request.params.contentId,
        request.userId,
        request.ip,
        request.headers['user-agent']
      );
      return reply.status(204).send();
    }
  );

  // Like/unlike content
  fastify.post<{ Params: ContentIdParams }>(
    '/like/:contentId',
    { preHandler: [authenticate] },
    async (request, reply) => {
      const liked = await analyticsService.trackLike(request.params.contentId, request.userId!);
      return reply.send({
        success: true,
        data: { liked },
      });
    }
  );

  // Check if user liked content
  fastify.get<{ Params: ContentIdParams }>(
    '/liked/:contentId',
    { preHandler: [authenticate] },
    async (request, reply) => {
      const liked = await analyticsService.hasLiked(request.params.contentId, request.userId!);
      return reply.send({
        success: true,
        data: { liked },
      });
    }
  );

  // Track share
  fastify.post<{ Params: ContentIdParams }>('/share/:contentId', async (request, reply) => {
    await analyticsService.trackShare(request.params.contentId);
    return reply.status(204).send();
  });

  // Get content analytics (author or admin only)
  fastify.get<{ Params: ContentIdParams; Querystring: DaysQuerystring }>(
    '/content/:contentId',
    { preHandler: [authenticate] },
    async (request, reply) => {
      const days = request.query.days || 30;
      const analytics = await analyticsService.getContentAnalytics(request.params.contentId, days);
      return reply.send({
        success: true,
        data: analytics,
      });
    }
  );

  // Get overall analytics (admin only)
  fastify.get('/overall', { preHandler: [authenticate, requireAdmin] }, async (_request, reply) => {
    const analytics = await analyticsService.getOverallAnalytics();
    return reply.send({
      success: true,
      data: analytics,
    });
  });

  // Get trending content
  fastify.get<{ Querystring: LimitQuerystring }>('/trending', async (request, reply) => {
    const limit = request.query.limit || 10;
    const trending = await analyticsService.getTrendingContent(limit);
    return reply.send({
      success: true,
      data: trending,
    });
  });
}
