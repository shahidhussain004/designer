// Tutorial Controller
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { CreateTutorialDTO, DifficultyLevel, UpdateTutorialDTO } from '../models/tutorial.model';
import { tutorialService } from '../services/tutorial.service';

interface IdParams {
  id: string;
}

interface SlugParams {
  slug: string;
}

interface TutorialSectionParams {
  tutorialSlug: string;
  sectionSlug: string;
}

interface TutorialTopicParams {
  tutorialSlug: string;
  sectionSlug: string;
  topicSlug: string;
}

interface QueryParams {
  page?: string;
  pageSize?: string;
  difficulty_level?: DifficultyLevel;
  category_id?: string;
  search?: string;
  is_published?: string;
  is_featured?: string;
}

export async function tutorialController(fastify: FastifyInstance) {
  // Get all tutorials with filtering
  fastify.get(
    '/',
    async (request: FastifyRequest<{ Querystring: QueryParams }>, reply: FastifyReply) => {
      try {
        const {
          page = '1',
          pageSize = '10',
          difficulty_level,
          category_id,
          search,
          is_published,
          is_featured,
        } = request.query;

        const filter: any = {};
        if (difficulty_level) filter.difficulty_level = difficulty_level;
        if (category_id) filter.category_id = parseInt(category_id);
        if (search) filter.search = search;
        if (is_published !== undefined) filter.is_published = is_published === 'true';
        if (is_featured !== undefined) filter.is_featured = is_featured === 'true';

        const result = await tutorialService.getFiltered(
          filter,
          parseInt(page),
          parseInt(pageSize)
        );

        return reply.send({ success: true, ...result });
      } catch (error: any) {
        request.log.error(error);
        return reply.status(500).send({ success: false, error: error.message });
      }
    }
  );

  // Get tutorial by slug (with sections and topics)
  fastify.get<{ Params: SlugParams }>('/:slug', async (request, reply) => {
    try {
      const { slug } = request.params;
      const tutorial = await tutorialService.getBySlugWithSections(slug);

      if (!tutorial) {
        return reply.status(404).send({ success: false, error: 'Tutorial not found' });
      }

      return reply.send({ success: true, data: tutorial });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get section by slug
  fastify.get<{ Params: TutorialSectionParams }>(
    '/:tutorialSlug/sections/:sectionSlug',
    async (request, reply) => {
      try {
        const { tutorialSlug, sectionSlug } = request.params;
        const section = await tutorialService.getSectionBySlug(tutorialSlug, sectionSlug);

        if (!section) {
          return reply.status(404).send({ success: false, error: 'Section not found' });
        }

        return reply.send({ success: true, data: section });
      } catch (error: any) {
        request.log.error(error);
        return reply.status(500).send({ success: false, error: error.message });
      }
    }
  );

  // Get topic by slug
  fastify.get<{ Params: TutorialTopicParams }>(
    '/:tutorialSlug/:sectionSlug/:topicSlug',
    async (request, reply) => {
      try {
        const { tutorialSlug, sectionSlug, topicSlug } = request.params;
        const topic = await tutorialService.getTopicBySlug(tutorialSlug, sectionSlug, topicSlug);

        if (!topic) {
          return reply.status(404).send({ success: false, error: 'Topic not found' });
        }

        return reply.send({ success: true, data: topic });
      } catch (error: any) {
        request.log.error(error);
        return reply.status(500).send({ success: false, error: error.message });
      }
    }
  );

  // Create tutorial
  fastify.post<{ Body: CreateTutorialDTO }>('/', async (request, reply) => {
    try {
      const tutorial = await tutorialService.create(request.body);
      return reply.status(201).send({ success: true, data: tutorial });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Update tutorial
  fastify.patch<{ Params: IdParams; Body: UpdateTutorialDTO }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const tutorial = await tutorialService.update(parseInt(id), request.body);

      if (!tutorial) {
        return reply.status(404).send({ success: false, error: 'Tutorial not found' });
      }

      return reply.send({ success: true, data: tutorial });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Delete tutorial
  fastify.delete<{ Params: IdParams }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const deleted = await tutorialService.delete(parseInt(id));

      if (!deleted) {
        return reply.status(404).send({ success: false, error: 'Tutorial not found' });
      }

      return reply.send({ success: true, message: 'Tutorial deleted' });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });
}

export default tutorialController;
