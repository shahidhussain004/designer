/**
 * Comment routes
 */
import { authenticate, requireAdmin } from '@common/middleware';
import {
  createCommentSchema,
  paginationSchema,
  updateCommentSchema,
} from '@common/utils/validation';
import { FastifyInstance } from 'fastify';
import { commentService } from './comment.service';

interface IdParams {
  id: string;
}

interface ContentIdParams {
  contentId: string;
}

export async function commentRoutes(fastify: FastifyInstance): Promise<void> {
  // Get comments for content
  fastify.get<{ Params: ContentIdParams }>('/content/:contentId', async (request, reply) => {
    const params = paginationSchema.parse(request.query);
    const result = await commentService.findByContent(request.params.contentId, params);
    return reply.send({
      success: true,
      ...result,
    });
  });

  // Get comment count for content
  fastify.get<{ Params: ContentIdParams }>('/content/:contentId/count', async (request, reply) => {
    const count = await commentService.getCount(request.params.contentId);
    return reply.send({
      success: true,
      data: { count },
    });
  });

  // Get pending comments (admin only)
  fastify.get('/pending', { preHandler: [authenticate, requireAdmin] }, async (request, reply) => {
    const params = paginationSchema.parse(request.query);
    const result = await commentService.findPendingApproval(params);
    return reply.send({
      success: true,
      ...result,
    });
  });

  // Get flagged comments (admin only)
  fastify.get('/flagged', { preHandler: [authenticate, requireAdmin] }, async (request, reply) => {
    const params = paginationSchema.parse(request.query);
    const result = await commentService.findFlagged(params);
    return reply.send({
      success: true,
      ...result,
    });
  });

  // Get comment by ID
  fastify.get<{ Params: IdParams }>('/:id', async (request, reply) => {
    const comment = await commentService.findById(request.params.id);
    return reply.send({
      success: true,
      data: comment,
    });
  });

  // Create comment
  fastify.post('/', { preHandler: [authenticate] }, async (request, reply) => {
    const input = createCommentSchema.parse(request.body);
    const comment = await commentService.create(input, request.userId!);
    return reply.status(201).send({
      success: true,
      data: comment,
    });
  });

  // Update comment
  fastify.patch<{ Params: IdParams }>(
    '/:id',
    { preHandler: [authenticate] },
    async (request, reply) => {
      const input = updateCommentSchema.parse(request.body);
      const isAdmin = request.user?.role === 'admin';
      const comment = await commentService.update(
        request.params.id,
        input,
        request.userId!,
        isAdmin
      );
      return reply.send({
        success: true,
        data: comment,
      });
    }
  );

  // Delete comment
  fastify.delete<{ Params: IdParams }>(
    '/:id',
    { preHandler: [authenticate] },
    async (request, reply) => {
      const isAdmin = request.user?.role === 'admin';
      await commentService.delete(request.params.id, request.userId!, isAdmin);
      return reply.status(204).send();
    }
  );

  // Approve comment (admin only)
  fastify.post<{ Params: IdParams }>(
    '/:id/approve',
    { preHandler: [authenticate, requireAdmin] },
    async (request, reply) => {
      const comment = await commentService.approve(request.params.id);
      return reply.send({
        success: true,
        data: comment,
      });
    }
  );

  // Flag comment
  fastify.post<{ Params: IdParams }>(
    '/:id/flag',
    { preHandler: [authenticate] },
    async (request, reply) => {
      const comment = await commentService.flag(request.params.id);
      return reply.send({
        success: true,
        data: comment,
      });
    }
  );

  // Unflag comment (admin only)
  fastify.post<{ Params: IdParams }>(
    '/:id/unflag',
    { preHandler: [authenticate, requireAdmin] },
    async (request, reply) => {
      const comment = await commentService.unflag(request.params.id);
      return reply.send({
        success: true,
        data: comment,
      });
    }
  );
}
