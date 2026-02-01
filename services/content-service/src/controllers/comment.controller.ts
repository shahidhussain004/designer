// Comment Controller
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { CreateCommentDTO, UpdateCommentDTO } from '../models/comment.model';
import { commentService } from '../services/comment.service';

interface IdParams {
  id: string;
}

interface ContentIdParams {
  contentId: string;
}

export async function commentController(fastify: FastifyInstance) {
  // Get comments by content ID
  fastify.get<{ Params: ContentIdParams }>('/content/:contentId', async (request, reply) => {
    try {
      const { contentId } = request.params;
      const comments = await commentService.getByContentId(parseInt(contentId));
      return reply.send({ success: true, data: comments });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get all comments (admin)
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const {
        page = '1',
        pageSize = '50',
        contentId,
        isApproved,
        isSpam,
      } = request.query as {
        page?: string;
        pageSize?: string;
        contentId?: string;
        isApproved?: string;
        isSpam?: string;
      };

      const filter: any = {};
      if (contentId) filter.content_id = parseInt(contentId);
      if (isApproved !== undefined) filter.is_approved = isApproved === 'true';
      if (isSpam !== undefined) filter.is_spam = isSpam === 'true';

      const result = await commentService.getFiltered(filter, parseInt(page), parseInt(pageSize));
      return reply.send({ success: true, ...result });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get pending count
  fastify.get('/pending/count', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const count = await commentService.getPendingCount();
      return reply.send({ success: true, data: { count } });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get comment by ID
  fastify.get<{ Params: IdParams }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const comment = await commentService.getById(parseInt(id));

      if (!comment) {
        return reply.status(404).send({ success: false, error: 'Comment not found' });
      }

      return reply.send({ success: true, data: comment });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Create comment
  fastify.post<{ Body: CreateCommentDTO }>('/', async (request, reply) => {
    try {
      // Get IP and user agent from request
      const ip_address = request.ip;
      const user_agent = request.headers['user-agent'];

      const comment = await commentService.create({
        ...request.body,
        ip_address,
        user_agent,
      });
      return reply.status(201).send({ success: true, data: comment });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Update comment
  fastify.patch<{ Params: IdParams; Body: UpdateCommentDTO }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const comment = await commentService.update(parseInt(id), request.body);

      if (!comment) {
        return reply.status(404).send({ success: false, error: 'Comment not found' });
      }

      return reply.send({ success: true, data: comment });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Approve comment
  fastify.post<{ Params: IdParams }>('/:id/approve', async (request, reply) => {
    try {
      const { id } = request.params;
      const comment = await commentService.approve(parseInt(id));

      if (!comment) {
        return reply.status(404).send({ success: false, error: 'Comment not found' });
      }

      return reply.send({ success: true, data: comment });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Mark as spam
  fastify.post<{ Params: IdParams }>('/:id/spam', async (request, reply) => {
    try {
      const { id } = request.params;
      const comment = await commentService.markAsSpam(parseInt(id));

      if (!comment) {
        return reply.status(404).send({ success: false, error: 'Comment not found' });
      }

      return reply.send({ success: true, data: comment });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Like comment
  fastify.post<{ Params: IdParams }>('/:id/like', async (request, reply) => {
    try {
      const { id } = request.params;
      await commentService.like(parseInt(id));
      return reply.send({ success: true, message: 'Comment liked' });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Delete comment
  fastify.delete<{ Params: IdParams }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const deleted = await commentService.delete(parseInt(id));

      if (!deleted) {
        return reply.status(404).send({ success: false, error: 'Comment not found' });
      }

      return reply.send({ success: true, message: 'Comment deleted' });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });
}

export default commentController;
