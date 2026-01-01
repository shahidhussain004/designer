/**
 * Search routes
 */
import { searchContentSchema } from '@common/utils/validation';
import { FastifyInstance } from 'fastify';
import { searchService } from './search.service';

interface SuggestQuery {
  q: string;
  limit?: number;
}

interface LimitQuerystring {
  limit?: number;
}

export async function searchRoutes(fastify: FastifyInstance): Promise<void> {
  // Search content
  fastify.get('/', async (request, reply) => {
    const params = searchContentSchema.parse(request.query);
    const result = await searchService.search(params);
    return reply.send({
      success: true,
      ...result,
    });
  });

  // Get search suggestions (autocomplete)
  fastify.get<{ Querystring: SuggestQuery }>('/suggest', async (request, reply) => {
    const { q, limit = 5 } = request.query;
    const suggestions = await searchService.getSuggestions(q, limit);
    return reply.send({
      success: true,
      data: suggestions,
    });
  });

  // Get popular searches
  fastify.get<{ Querystring: LimitQuerystring }>('/popular', async (request, reply) => {
    const limit = request.query.limit || 10;
    const popular = await searchService.getPopularSearches(limit);
    return reply.send({
      success: true,
      data: popular,
    });
  });
}
