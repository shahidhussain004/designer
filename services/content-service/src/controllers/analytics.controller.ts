// Analytics Controller
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { analyticsService } from '../services/analytics.service';

interface IdParams {
  id: string;
}

interface ContentIdParams {
  contentId: string;
}

interface TrackViewBody {
  content_id: number;
  user_id?: number;
  session_id?: string;
  referrer?: string;
}

interface TrackLikeBody {
  content_id: number;
  user_id: number;
}

export async function analyticsController(fastify: FastifyInstance) {
  // Track content view
  fastify.post<{ Body: TrackViewBody }>('/view', async (request, reply) => {
    try {
      const ip_address = request.ip;
      const user_agent = request.headers['user-agent'];

      await analyticsService.trackContentView({
        ...request.body,
        ip_address,
        user_agent,
      });

      return reply.send({ success: true, message: 'View tracked' });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Like content
  fastify.post<{ Body: TrackLikeBody }>('/like', async (request, reply) => {
    try {
      const { content_id, user_id } = request.body;
      const liked = await analyticsService.trackContentLike(content_id, user_id);

      return reply.send({
        success: true,
        data: { liked, message: liked ? 'Content liked' : 'Already liked' },
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Unlike content
  fastify.delete<{ Body: TrackLikeBody }>('/like', async (request, reply) => {
    try {
      const { content_id, user_id } = request.body;
      const unliked = await analyticsService.removeContentLike(content_id, user_id);

      return reply.send({
        success: true,
        data: { unliked, message: unliked ? 'Like removed' : 'Was not liked' },
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Check if user liked content
  fastify.get<{ Params: ContentIdParams }>('/liked/:contentId', async (request, reply) => {
    try {
      const { contentId } = request.params;
      const { userId } = request.query as { userId?: string };

      if (!userId) {
        return reply.status(400).send({ success: false, error: 'userId is required' });
      }

      const liked = await analyticsService.hasUserLiked(parseInt(contentId), parseInt(userId));
      return reply.send({ success: true, data: { liked } });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get content stats
  fastify.get<{ Params: ContentIdParams }>('/content/:contentId', async (request, reply) => {
    try {
      const { contentId } = request.params;
      const stats = await analyticsService.getContentStats(parseInt(contentId));
      return reply.send({ success: true, data: stats });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get overall stats
  fastify.get('/stats', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const stats = await analyticsService.getOverallStats();
      return reply.send({ success: true, data: stats });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get popular content
  fastify.get('/popular', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { period = 'week', limit = '10' } = request.query as {
        period?: 'day' | 'week' | 'month' | 'all';
        limit?: string;
      };

      const popular = await analyticsService.getPopularContent(period, parseInt(limit));
      return reply.send({ success: true, data: popular });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });
}

export default analyticsController;
