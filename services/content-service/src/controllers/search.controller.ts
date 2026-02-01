// Search Controller
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { searchService } from '../services/search.service';

interface QueryParams {
  q: string;
  types?: string;
  page?: string;
  pageSize?: string;
}

export async function searchController(fastify: FastifyInstance) {
  // Search across all content
  fastify.get(
    '/',
    async (request: FastifyRequest<{ Querystring: QueryParams }>, reply: FastifyReply) => {
      try {
        const { q, types, page = '1', pageSize = '10' } = request.query;

        if (!q || q.trim().length === 0) {
          return reply.status(400).send({ success: false, error: 'Search query is required' });
        }

        const searchTypes = types
          ? (types.split(',').filter((t) => ['content', 'tutorial', 'resource'].includes(t)) as (
              | 'content'
              | 'tutorial'
              | 'resource'
            )[])
          : undefined;

        const offset = (parseInt(page) - 1) * parseInt(pageSize);
        const result = await searchService.search(q, {
          types: searchTypes,
          limit: parseInt(pageSize),
          offset,
        });

        return reply.send({
          success: true,
          query: q,
          ...result,
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          totalPages: Math.ceil(result.total / parseInt(pageSize)),
        });
      } catch (error: any) {
        request.log.error(error);
        return reply.status(500).send({ success: false, error: error.message });
      }
    }
  );

  // Search content only
  fastify.get(
    '/content',
    async (request: FastifyRequest<{ Querystring: QueryParams }>, reply: FastifyReply) => {
      try {
        const { q, page = '1', pageSize = '10' } = request.query;

        if (!q || q.trim().length === 0) {
          return reply.status(400).send({ success: false, error: 'Search query is required' });
        }

        const offset = (parseInt(page) - 1) * parseInt(pageSize);
        const result = await searchService.searchContent(q, parseInt(pageSize), offset);

        return reply.send({
          success: true,
          query: q,
          ...result,
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          totalPages: Math.ceil(result.total / parseInt(pageSize)),
        });
      } catch (error: any) {
        request.log.error(error);
        return reply.status(500).send({ success: false, error: error.message });
      }
    }
  );

  // Search tutorials only
  fastify.get(
    '/tutorials',
    async (request: FastifyRequest<{ Querystring: QueryParams }>, reply: FastifyReply) => {
      try {
        const { q, page = '1', pageSize = '10' } = request.query;

        if (!q || q.trim().length === 0) {
          return reply.status(400).send({ success: false, error: 'Search query is required' });
        }

        const offset = (parseInt(page) - 1) * parseInt(pageSize);
        const result = await searchService.searchTutorials(q, parseInt(pageSize), offset);

        return reply.send({
          success: true,
          query: q,
          ...result,
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          totalPages: Math.ceil(result.total / parseInt(pageSize)),
        });
      } catch (error: any) {
        request.log.error(error);
        return reply.status(500).send({ success: false, error: error.message });
      }
    }
  );

  // Search resources only
  fastify.get(
    '/resources',
    async (request: FastifyRequest<{ Querystring: QueryParams }>, reply: FastifyReply) => {
      try {
        const { q, page = '1', pageSize = '10' } = request.query;

        if (!q || q.trim().length === 0) {
          return reply.status(400).send({ success: false, error: 'Search query is required' });
        }

        const offset = (parseInt(page) - 1) * parseInt(pageSize);
        const result = await searchService.searchResources(q, parseInt(pageSize), offset);

        return reply.send({
          success: true,
          query: q,
          ...result,
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          totalPages: Math.ceil(result.total / parseInt(pageSize)),
        });
      } catch (error: any) {
        request.log.error(error);
        return reply.status(500).send({ success: false, error: error.message });
      }
    }
  );
}

export default searchController;
