// Resource Controller
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { normalizeSortField } from '../common/utils/helpers';
import { CreateResourceDTO, UpdateResourceDTO } from '../models/resource.model';
import { resourceService } from '../services/resource.service';

interface IdParams {
  id: string;
}

interface SlugParams {
  slug: string;
}

interface QueryParams {
  page?: string;
  pageSize?: string;
  category?: string;
  resource_type?: string;
  search?: string;
  is_published?: string;
  is_featured?: string;
  is_premium?: string;
  sortBy?: string;
  sortOrder?: string;
}

export async function resourceController(fastify: FastifyInstance) {
  // Get all resources with filtering
  fastify.get(
    '/',
    async (request: FastifyRequest<{ Querystring: QueryParams }>, reply: FastifyReply) => {
      try {
        const {
          page = '1',
          pageSize = '10',
          category,
          resource_type,
          search,
          is_published,
          is_featured,
          is_premium,
          sortBy = 'created_at',
          sortOrder = 'desc',
        } = request.query;

        const filter: any = {};
        if (category) filter.category = category;
        if (resource_type) filter.resource_type = resource_type;
        if (search) filter.search = search;
        if (is_published !== undefined) filter.is_published = is_published === 'true';
        if (is_featured !== undefined) filter.is_featured = is_featured === 'true';
        if (is_premium !== undefined) filter.is_premium = is_premium === 'true';

        const result = await resourceService.getFiltered(
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

  // Get popular resources
  fastify.get('/popular', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { limit = '10' } = request.query as { limit?: string };
      const resources = await resourceService.getPopular(parseInt(limit));
      return reply.send({ success: true, data: resources });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get resource by ID
  fastify.get<{ Params: IdParams }>('/id/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const resource = await resourceService.getById(parseInt(id));

      if (!resource) {
        return reply.status(404).send({ success: false, error: 'Resource not found' });
      }

      return reply.send({ success: true, data: resource });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get resource by slug
  fastify.get<{ Params: SlugParams }>('/:slug', async (request, reply) => {
    try {
      const { slug } = request.params;
      const resource = await resourceService.getBySlugWithAuthor(slug);

      if (!resource) {
        return reply.status(404).send({ success: false, error: 'Resource not found' });
      }

      return reply.send({ success: true, data: resource });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Download resource (track download)
  fastify.post<{ Params: IdParams }>('/:id/download', async (request, reply) => {
    try {
      const { id } = request.params;
      const resource = await resourceService.getById(parseInt(id));

      if (!resource) {
        return reply.status(404).send({ success: false, error: 'Resource not found' });
      }

      await resourceService.recordDownload(resource.id);

      return reply.send({
        success: true,
        data: {
          download_url: resource.file_url,
          file_name: resource.title,
          file_type: resource.file_type,
        },
      });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Create resource
  fastify.post<{ Body: CreateResourceDTO }>('/', async (request, reply) => {
    try {
      const resource = await resourceService.create(request.body);
      return reply.status(201).send({ success: true, data: resource });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Update resource
  fastify.patch<{ Params: IdParams; Body: UpdateResourceDTO }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const resource = await resourceService.update(parseInt(id), request.body);

      if (!resource) {
        return reply.status(404).send({ success: false, error: 'Resource not found' });
      }

      return reply.send({ success: true, data: resource });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Delete resource
  fastify.delete<{ Params: IdParams }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const deleted = await resourceService.delete(parseInt(id));

      if (!deleted) {
        return reply.status(404).send({ success: false, error: 'Resource not found' });
      }

      return reply.send({ success: true, message: 'Resource deleted' });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });
}

export default resourceController;
