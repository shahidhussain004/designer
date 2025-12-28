/**
 * Tag routes
 */
import { authenticate, requireAdmin } from '@common/middleware';
import { createTagSchema, paginationSchema, updateTagSchema } from '@common/utils/validation';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { tagService } from './tag.service';

interface IdParams {
  id: string;
}

interface SlugParams {
  slug: string;
}

interface SearchQuery {
  q: string;
  limit?: number;
}

export async function tagRoutes(fastify: FastifyInstance): Promise<void> {
  // Get all tags with pagination
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const params = paginationSchema.parse(request.query);
    const result = await tagService.findAll(params);
    return reply.send({
      success: true,
      ...result,
    });
  });

  // Get popular tags
  fastify.get<{ Querystring: { limit?: number } }>(
    '/popular',
    async (request: FastifyRequest<{ Querystring: { limit?: number } }>, reply: FastifyReply) => {
      const limit = request.query.limit || 10;
      const tags = await tagService.findPopular(limit);
      return reply.send({
        success: true,
        data: tags,
      });
    }
  );

  // Search tags
  fastify.get<{ Querystring: SearchQuery }>(
    '/search',
    async (request: FastifyRequest<{ Querystring: SearchQuery }>, reply: FastifyReply) => {
      const { q, limit = 10 } = request.query;
      const tags = await tagService.search(q, limit);
      return reply.send({
        success: true,
        data: tags,
      });
    }
  );

  // Get tag by ID
  fastify.get<{ Params: IdParams }>(
    '/:id',
    async (request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) => {
      const tag = await tagService.findById(request.params.id);
      return reply.send({
        success: true,
        data: tag,
      });
    }
  );

  // Get tag by slug
  fastify.get<{ Params: SlugParams }>(
    '/slug/:slug',
    async (request: FastifyRequest<{ Params: SlugParams }>, reply: FastifyReply) => {
      const tag = await tagService.findBySlug(request.params.slug);
      return reply.send({
        success: true,
        data: tag,
      });
    }
  );

  // Create tag (admin only)
  fastify.post(
    '/',
    { preHandler: [authenticate, requireAdmin] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const input = createTagSchema.parse(request.body);
      const tag = await tagService.create(input);
      return reply.status(201).send({
        success: true,
        data: tag,
      });
    }
  );

  // Update tag (admin only)
  fastify.patch<{ Params: IdParams }>(
    '/:id',
    { preHandler: [authenticate, requireAdmin] },
    async (request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) => {
      const input = updateTagSchema.parse(request.body);
      const tag = await tagService.update(request.params.id, input);
      return reply.send({
        success: true,
        data: tag,
      });
    }
  );

  // Delete tag (admin only)
  fastify.delete<{ Params: IdParams }>(
    '/:id',
    { preHandler: [authenticate, requireAdmin] },
    async (request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) => {
      await tagService.delete(request.params.id);
      return reply.status(204).send();
    }
  );
}
