/**
 * Category routes
 */
import { authenticate, requireAdmin } from '@common/middleware';
import { createCategorySchema, updateCategorySchema } from '@common/utils/validation';
import { FastifyInstance } from 'fastify';
import { categoryService } from './category.service';

interface IdParams {
  id: string;
}

interface SlugParams {
  slug: string;
}

export async function categoryRoutes(fastify: FastifyInstance): Promise<void> {
  // Get all categories
  fastify.get('/', async (_request, reply) => {
    const categories = await categoryService.findAll();
    return reply.send({
      success: true,
      data: categories,
    });
  });

  // Get category tree
  fastify.get('/tree', async (_request, reply) => {
    const tree = await categoryService.getTree();
    return reply.send({
      success: true,
      data: tree,
    });
  });

  // Get category by ID
  fastify.get<{ Params: IdParams }>('/:id', async (request, reply) => {
    const category = await categoryService.findById(request.params.id);
    return reply.send({
      success: true,
      data: category,
    });
  });

  // Get category by slug
  fastify.get<{ Params: SlugParams }>('/slug/:slug', async (request, reply) => {
    const category = await categoryService.findBySlug(request.params.slug);
    return reply.send({
      success: true,
      data: category,
    });
  });

  // Create category (admin only)
  fastify.post('/', { preHandler: [authenticate, requireAdmin] }, async (request, reply) => {
    const input = createCategorySchema.parse(request.body);
    const category = await categoryService.create(input);
    return reply.status(201).send({
      success: true,
      data: category,
    });
  });

  // Update category (admin only)
  fastify.patch<{ Params: IdParams }>(
    '/:id',
    { preHandler: [authenticate, requireAdmin] },
    async (request, reply) => {
      const input = updateCategorySchema.parse(request.body);
      const category = await categoryService.update(request.params.id, input);
      return reply.send({
        success: true,
        data: category,
      });
    }
  );

  // Delete category (admin only)
  fastify.delete<{ Params: IdParams }>(
    '/:id',
    { preHandler: [authenticate, requireAdmin] },
    async (request, reply) => {
      await categoryService.delete(request.params.id);
      return reply.status(204).send();
    }
  );
}
