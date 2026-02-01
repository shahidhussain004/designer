// Category Controller
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { CreateCategoryDTO, UpdateCategoryDTO } from '../models/category.model';
import { categoryService } from '../services/category.service';

interface IdParams {
  id: string;
}

interface SlugParams {
  slug: string;
}

export async function categoryController(fastify: FastifyInstance) {
  // Get all categories
  fastify.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { page = '1', pageSize = '100' } = request.query as {
        page?: string;
        pageSize?: string;
      };
      const result = await categoryService.getAll(parseInt(page), parseInt(pageSize));
      return reply.send({ success: true, ...result });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get category tree
  fastify.get('/tree', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const tree = await categoryService.getTree();
      return reply.send({ success: true, data: tree });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get category by ID
  fastify.get<{ Params: IdParams }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const category = await categoryService.getById(parseInt(id));

      if (!category) {
        return reply.status(404).send({ success: false, error: 'Category not found' });
      }

      return reply.send({ success: true, data: category });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get category by slug
  fastify.get<{ Params: SlugParams }>('/slug/:slug', async (request, reply) => {
    try {
      const { slug } = request.params;
      const category = await categoryService.getBySlug(slug);

      if (!category) {
        return reply.status(404).send({ success: false, error: 'Category not found' });
      }

      return reply.send({ success: true, data: category });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Create category
  fastify.post<{ Body: CreateCategoryDTO }>('/', async (request, reply) => {
    try {
      const category = await categoryService.create(request.body);
      return reply.status(201).send({ success: true, data: category });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Update category
  fastify.patch<{ Params: IdParams; Body: UpdateCategoryDTO }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const category = await categoryService.update(parseInt(id), request.body);

      if (!category) {
        return reply.status(404).send({ success: false, error: 'Category not found' });
      }

      return reply.send({ success: true, data: category });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Delete category
  fastify.delete<{ Params: IdParams }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const deleted = await categoryService.delete(parseInt(id));

      if (!deleted) {
        return reply.status(404).send({ success: false, error: 'Category not found' });
      }

      return reply.send({ success: true, message: 'Category deleted' });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });
}

export default categoryController;
