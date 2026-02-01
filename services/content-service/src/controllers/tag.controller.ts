// Tag Controller
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { CreateTagDTO, UpdateTagDTO } from '../models/tag.model';
import { tagService } from '../services/tag.service';

interface IdParams {
  id: string;
}

interface SlugParams {
  slug: string;
}

export async function tagController(fastify: FastifyInstance) {
  // Get all tags
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const {
        page = '1',
        pageSize = '100',
        search,
      } = request.query as {
        page?: string;
        pageSize?: string;
        search?: string;
      };

      if (search) {
        const result = await tagService.getFiltered({ search }, parseInt(page), parseInt(pageSize));
        return reply.send({ success: true, ...result });
      }

      const result = await tagService.getAll(parseInt(page), parseInt(pageSize));
      return reply.send({ success: true, ...result });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get popular tags
  fastify.get('/popular', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { limit = '10' } = request.query as { limit?: string };
      const tags = await tagService.getPopular(parseInt(limit));
      return reply.send({ success: true, data: tags });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get tag by ID
  fastify.get<{ Params: IdParams }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const tag = await tagService.getById(parseInt(id));

      if (!tag) {
        return reply.status(404).send({ success: false, error: 'Tag not found' });
      }

      return reply.send({ success: true, data: tag });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get tag by slug
  fastify.get<{ Params: SlugParams }>('/slug/:slug', async (request, reply) => {
    try {
      const { slug } = request.params;
      const tag = await tagService.getBySlug(slug);

      if (!tag) {
        return reply.status(404).send({ success: false, error: 'Tag not found' });
      }

      return reply.send({ success: true, data: tag });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Create tag
  fastify.post<{ Body: CreateTagDTO }>('/', async (request, reply) => {
    try {
      const tag = await tagService.create(request.body);
      return reply.status(201).send({ success: true, data: tag });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Update tag
  fastify.patch<{ Params: IdParams; Body: UpdateTagDTO }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const tag = await tagService.update(parseInt(id), request.body);

      if (!tag) {
        return reply.status(404).send({ success: false, error: 'Tag not found' });
      }

      return reply.send({ success: true, data: tag });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Delete tag
  fastify.delete<{ Params: IdParams }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const deleted = await tagService.delete(parseInt(id));

      if (!deleted) {
        return reply.status(404).send({ success: false, error: 'Tag not found' });
      }

      return reply.send({ success: true, message: 'Tag deleted' });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });
}

export default tagController;
