// Content Controller
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { normalizeSortField } from '../common/utils/helpers';
import { ContentType, CreateContentDTO, UpdateContentDTO } from '../models/content.model';
import { commentService } from '../services/comment.service';
import { contentService } from '../services/content.service';

interface IdParams {
  id: string;
}

interface SlugParams {
  slug: string;
}

interface TypeParams {
  type: string;
}

interface QueryParams {
  page?: string;
  pageSize?: string;
  type?: ContentType;
  status?: string;
  categoryId?: string;
  authorId?: string;
  tagIds?: string;
  search?: string;
  isFeatured?: string;
  isTrending?: string;
  sortBy?: string;
  sortOrder?: string;
}

export async function contentController(fastify: FastifyInstance) {
  // Get all content with filtering
  fastify.get(
    '/',
    async (request: FastifyRequest<{ Querystring: QueryParams }>, reply: FastifyReply) => {
      try {
        const {
          page = '1',
          pageSize = '10',
          type,
          status,
          categoryId,
          authorId,
          tagIds,
          search,
          isFeatured,
          isTrending,
          sortBy = 'created_at',
          sortOrder = 'desc',
        } = request.query;

        const filter = {
          type: type as ContentType,
          status: status as any,
          categoryId: categoryId ? parseInt(categoryId) : undefined,
          authorId: authorId ? parseInt(authorId) : undefined,
          tagIds: tagIds ? tagIds.split(',').map(Number) : undefined,
          search,
          isFeatured: isFeatured === 'true' ? true : isFeatured === 'false' ? false : undefined,
          isTrending: isTrending === 'true' ? true : isTrending === 'false' ? false : undefined,
        };

        // Remove undefined values
        Object.keys(filter).forEach((key) => {
          if ((filter as any)[key] === undefined) {
            delete (filter as any)[key];
          }
        });

        const result = await contentService.getFiltered(
          filter,
          parseInt(page),
          parseInt(pageSize),
          normalizeSortField(sortBy),
          sortOrder as 'asc' | 'desc'
        );

        return reply.send({ success: true, ...result });
      } catch (error: any) {
        request.log.error(error);
        return reply.status(500).send({ success: false, error: error.message });
      }
    }
  );

  // Get featured content
  fastify.get('/featured', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { limit = '5' } = request.query as { limit?: string };
      const content = await contentService.getFeatured(parseInt(limit));
      return reply.send({ success: true, data: content });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get trending content
  fastify.get('/trending', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { limit = '5' } = request.query as { limit?: string };
      const content = await contentService.getTrending(parseInt(limit));
      return reply.send({ success: true, data: content });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get recent content by type
  fastify.get<{ Params: TypeParams }>('/recent/:type', async (request, reply) => {
    try {
      const { type } = request.params;
      const { limit = '5' } = request.query as { limit?: string };

      if (!['blog', 'article', 'news'].includes(type)) {
        return reply.status(400).send({ success: false, error: 'Invalid content type' });
      }

      const content = await contentService.getRecentByType(type as ContentType, parseInt(limit));
      return reply.send({ success: true, data: content });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get content by ID
  fastify.get<{ Params: IdParams }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const content = await contentService.getByIdWithRelations(parseInt(id));

      if (!content) {
        return reply.status(404).send({ success: false, error: 'Content not found' });
      }

      // Record view
      await contentService.recordView(content.id);

      return reply.send({ success: true, data: content });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get content by slug
  fastify.get<{ Params: SlugParams }>('/slug/:slug', async (request, reply) => {
    try {
      const { slug } = request.params;
      const content = await contentService.getBySlugWithRelations(slug);

      if (!content) {
        return reply.status(404).send({ success: false, error: 'Content not found' });
      }

      // Record view
      await contentService.recordView(content.id);

      return reply.send({ success: true, data: content });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get related content
  fastify.get<{ Params: IdParams }>('/:id/related', async (request, reply) => {
    try {
      const { id } = request.params;
      const { limit = '5' } = request.query as { limit?: string };
      const content = await contentService.getRelated(parseInt(id), parseInt(limit));
      return reply.send({ success: true, data: content });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get comments for content
  fastify.get<{ Params: IdParams }>('/:id/comments', async (request, reply) => {
    try {
      const { id } = request.params;
      const comments = await commentService.getByContentId(parseInt(id));
      return reply.send({ success: true, data: comments });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Record content view
  fastify.post<{ Params: IdParams }>('/:id/view', async (request, reply) => {
    try {
      const { id } = request.params;
      await contentService.recordView(parseInt(id));
      return reply.send({ success: true, message: 'View recorded' });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Create content
  fastify.post<{ Body: CreateContentDTO }>('/', async (request, reply) => {
    try {
      const content = await contentService.create(request.body);
      return reply.status(201).send({ success: true, data: content });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Update content
  fastify.patch<{ Params: IdParams; Body: UpdateContentDTO }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const content = await contentService.update(parseInt(id), request.body);

      if (!content) {
        return reply.status(404).send({ success: false, error: 'Content not found' });
      }

      return reply.send({ success: true, data: content });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Publish content
  fastify.post<{ Params: IdParams }>('/:id/publish', async (request, reply) => {
    try {
      const { id } = request.params;
      const content = await contentService.publish(parseInt(id));

      if (!content) {
        return reply.status(404).send({ success: false, error: 'Content not found' });
      }

      return reply.send({ success: true, data: content });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Unpublish content
  fastify.post<{ Params: IdParams }>('/:id/unpublish', async (request, reply) => {
    try {
      const { id } = request.params;
      const content = await contentService.unpublish(parseInt(id));

      if (!content) {
        return reply.status(404).send({ success: false, error: 'Content not found' });
      }

      return reply.send({ success: true, data: content });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Delete content
  fastify.delete<{ Params: IdParams }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const deleted = await contentService.delete(parseInt(id));

      if (!deleted) {
        return reply.status(404).send({ success: false, error: 'Content not found' });
      }

      return reply.send({ success: true, message: 'Content deleted' });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });
}

export default contentController;
