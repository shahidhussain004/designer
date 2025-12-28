/**
 * Search routes
 */
import { searchContentSchema } from '@common/utils/validation';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { searchService } from './search.service';

interface SuggestQuery {
  q: string;
  limit?: number;
}

export async function searchRoutes(fastify: FastifyInstance): Promise<void> {
  // Search content
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const params = searchContentSchema.parse(request.query);
    const result = await searchService.search(params);
    return reply.send({
      success: true,
      ...result,
    });
  });

  // Get search suggestions (autocomplete)
  fastify.get<{ Querystring: SuggestQuery }>(
    '/suggest',
    async (request: FastifyRequest<{ Querystring: SuggestQuery }>, reply: FastifyReply) => {
      const { q, limit = 5 } = request.query;
      const suggestions = await searchService.getSuggestions(q, limit);
      return reply.send({
        success: true,
        data: suggestions,
      });
    }
  );

  // Get popular searches
  fastify.get<{ Querystring: { limit?: number } }>(
    '/popular',
    async (request: FastifyRequest<{ Querystring: { limit?: number } }>, reply: FastifyReply) => {
      const limit = request.query.limit || 10;
      const popular = await searchService.getPopularSearches(limit);
      return reply.send({
        success: true,
        data: popular,
      });
    }
  );
}
