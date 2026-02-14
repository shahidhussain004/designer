// Search Controller
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { searchService } from '../services/search.service';

interface QueryParams {
  q?: string;
  query?: string;
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
        // Accept both 'q' and 'query' parameter names
        const searchQuery = request.query.q || request.query.query;
        const { types, page = '1', pageSize = '10' } = request.query;

        if (!searchQuery || searchQuery.trim().length < 2) {
          return reply
            .status(400)
            .send({ success: false, error: 'Search query must be at least 2 characters' });
        }

        const searchTypes = types
          ? (types.split(',').filter((t) => ['content', 'tutorial'].includes(t)) as (
              | 'content'
              | 'tutorial'
            )[])
          : undefined;

        const offset = (parseInt(page) - 1) * parseInt(pageSize);
        const result = await searchService.search(searchQuery, {
          types: searchTypes,
          limit: parseInt(pageSize),
          offset,
        });

        return reply.send({
          success: true,
          query: searchQuery,
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
        // Accept both 'q' and 'query' parameter names
        const searchQuery = request.query.q || request.query.query;
        const { page = '1', pageSize = '10' } = request.query;

        if (!searchQuery || searchQuery.trim().length === 0) {
          return reply.status(400).send({ success: false, error: 'Search query is required' });
        }

        const offset = (parseInt(page) - 1) * parseInt(pageSize);
        const result = await searchService.searchContent(searchQuery, parseInt(pageSize), offset);

        return reply.send({
          success: true,
          query: searchQuery,
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
  // resources endpoint removed

  // Get search suggestions
  fastify.get(
    '/suggest',
    async (request: FastifyRequest<{ Querystring: QueryParams }>, reply: FastifyReply) => {
      try {
        // Accept both 'q' and 'query' parameter names
        const searchQuery = request.query.q || request.query.query;

        if (!searchQuery || searchQuery.trim().length < 2) {
          return reply
            .status(400)
            .send({ success: false, error: 'Query must be at least 2 characters' });
        }

        // For now, return mock suggestions based on query
        const suggestions = [
          { id: '1', title: 'Getting Started with Node.js', type: 'content' },
          { id: '2', title: 'Node.js Best Practices', type: 'tutorial' },
          { id: '3', title: 'JavaScript Fundamentals', type: 'content' },
        ];

        return reply.send({
          success: true,
          query: searchQuery,
          suggestions,
        });
      } catch (error: any) {
        request.log.error(error);
        return reply.status(500).send({ success: false, error: error.message });
      }
    }
  );
}

export default searchController;
