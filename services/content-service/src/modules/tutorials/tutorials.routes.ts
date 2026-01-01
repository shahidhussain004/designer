/**
 * Tutorials Routes
 * Public and admin endpoints for tutorials feature
 */

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { tutorialsService } from './tutorials.service';

export async function tutorialsRoutes(app: FastifyInstance) {
  // =====================================================
  // PUBLIC ROUTES
  // =====================================================

  // Get all tutorials
  app.get(
    '/tutorials',
    {
      schema: {
        description: 'Get all tutorials',
        tags: ['tutorials'],
        querystring: {
          type: 'object',
          properties: {
            published: { type: 'string', enum: ['true', 'false'], default: 'true' },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Querystring: { published?: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const published = request.query.published !== 'false';
        const tutorials = await tutorialsService.getAllTutorials(published);

        return reply.send({
          success: true,
          data: tutorials,
          count: tutorials.length,
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to fetch tutorials',
        });
      }
    }
  );

  // Get tutorial by slug with sections
  app.get(
    '/tutorials/:slug',
    {
      schema: {
        description: 'Get tutorial by slug',
        tags: ['tutorials'],
        params: {
          type: 'object',
          properties: {
            slug: { type: 'string' },
          },
          required: ['slug'],
        },
      },
    },
    async (request: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) => {
      try {
        const tutorial = await tutorialsService.getTutorialBySlug(request.params.slug);

        if (!tutorial) {
          return reply.status(404).send({
            success: false,
            error: 'Tutorial not found',
          });
        }

        return reply.send({
          success: true,
          data: tutorial,
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to fetch tutorial',
        });
      }
    }
  );

  // Get section with topics
  app.get(
    '/tutorials/:tutorialSlug/sections/:sectionSlug',
    {
      schema: {
        description: 'Get section with topics',
        tags: ['tutorials'],
        params: {
          type: 'object',
          properties: {
            tutorialSlug: { type: 'string' },
            sectionSlug: { type: 'string' },
          },
          required: ['tutorialSlug', 'sectionSlug'],
        },
      },
    },
    async (
      request: FastifyRequest<{ Params: { tutorialSlug: string; sectionSlug: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const section = await tutorialsService.getSectionWithTopics(
          request.params.tutorialSlug,
          request.params.sectionSlug
        );

        if (!section) {
          return reply.status(404).send({
            success: false,
            error: 'Section not found',
          });
        }

        return reply.send({
          success: true,
          data: section,
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to fetch section',
        });
      }
    }
  );

  // Get topic content
  app.get(
    '/tutorials/:tutorialSlug/:sectionSlug/:topicSlug',
    {
      schema: {
        description: 'Get topic content',
        tags: ['tutorials'],
        params: {
          type: 'object',
          properties: {
            tutorialSlug: { type: 'string' },
            sectionSlug: { type: 'string' },
            topicSlug: { type: 'string' },
          },
          required: ['tutorialSlug', 'sectionSlug', 'topicSlug'],
        },
        querystring: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{
        Params: { tutorialSlug: string; sectionSlug: string; topicSlug: string };
        Querystring: { userId?: string };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const topic = await tutorialsService.getTopicContent(
          request.params.tutorialSlug,
          request.params.sectionSlug,
          request.params.topicSlug,
          request.query.userId
        );

        if (!topic) {
          return reply.status(404).send({
            success: false,
            error: 'Topic not found',
          });
        }

        return reply.send({
          success: true,
          data: topic,
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to fetch topic',
        });
      }
    }
  );

  // =====================================================
  // ADMIN ROUTES
  // =====================================================

  // Create tutorial
  app.post(
    '/admin/tutorials',
    {
      schema: {
        description: 'Create new tutorial',
        tags: ['tutorials-admin'],
        body: {
          type: 'object',
          required: ['slug', 'title'],
          properties: {
            slug: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            icon: { type: 'string' },
            difficultyLevel: { type: 'string', enum: ['beginner', 'intermediate', 'advanced'] },
            colorTheme: { type: 'string' },
            estimatedHours: { type: 'number' },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{
        Body: {
          slug: string;
          title: string;
          description?: string;
          icon?: string;
          difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
          colorTheme?: string;
          estimatedHours?: number;
        };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const tutorial = await tutorialsService.createTutorial(request.body);

        return reply.status(201).send({
          success: true,
          data: tutorial,
        });
      } catch (error: any) {
        app.log.error(error);
        return reply.status(500).send({
          success: false,
          error:
            error.code === 'P2002' ? 'Tutorial slug already exists' : 'Failed to create tutorial',
        });
      }
    }
  );

  // Create section
  app.post(
    '/admin/tutorials/:tutorialId/sections',
    {
      schema: {
        description: 'Create new section',
        tags: ['tutorials-admin'],
        params: {
          type: 'object',
          required: ['tutorialId'],
          properties: {
            tutorialId: { type: 'string' },
          },
        },
        body: {
          type: 'object',
          required: ['slug', 'title'],
          properties: {
            slug: { type: 'string' },
            title: { type: 'string' },
            description: { type: 'string' },
            icon: { type: 'string' },
            displayOrder: { type: 'number' },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{
        Params: { tutorialId: string };
        Body: {
          slug: string;
          title: string;
          description?: string;
          icon?: string;
          displayOrder?: number;
        };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const section = await tutorialsService.createSection(
          parseInt(request.params.tutorialId),
          request.body
        );

        return reply.status(201).send({
          success: true,
          data: section,
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to create section',
        });
      }
    }
  );

  // Create topic
  app.post(
    '/admin/sections/:sectionId/topics',
    {
      schema: {
        description: 'Create new topic',
        tags: ['tutorials-admin'],
        params: {
          type: 'object',
          required: ['sectionId'],
          properties: {
            sectionId: { type: 'string' },
          },
        },
        body: {
          type: 'object',
          required: ['slug', 'title', 'content'],
          properties: {
            slug: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string' },
            codeExamples: { type: 'array' },
            estimatedReadTime: { type: 'number' },
            displayOrder: { type: 'number' },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{
        Params: { sectionId: string };
        Body: {
          slug: string;
          title: string;
          content: string;
          codeExamples?: any[];
          estimatedReadTime?: number;
          displayOrder?: number;
        };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const topic = await tutorialsService.createTopic(
          parseInt(request.params.sectionId),
          request.body
        );

        return reply.status(201).send({
          success: true,
          data: topic,
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to create topic',
        });
      }
    }
  );

  // Update topic
  app.put(
    '/admin/topics/:topicId',
    {
      schema: {
        description: 'Update topic',
        tags: ['tutorials-admin'],
        params: {
          type: 'object',
          required: ['topicId'],
          properties: {
            topicId: { type: 'string' },
          },
        },
        body: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content: { type: 'string' },
            codeExamples: { type: 'array' },
            estimatedReadTime: { type: 'number' },
            isPublished: { type: 'boolean' },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{
        Params: { topicId: string };
        Body: {
          title?: string;
          content?: string;
          codeExamples?: any[];
          estimatedReadTime?: number;
          isPublished?: boolean;
        };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const topic = await tutorialsService.updateTopic(
          parseInt(request.params.topicId),
          request.body
        );

        return reply.send({
          success: true,
          data: topic,
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to update topic',
        });
      }
    }
  );

  // AI content generation (placeholder - will need Anthropic API key)
  app.post(
    '/admin/ai-assist/generate-content',
    {
      schema: {
        description: 'Generate tutorial content using AI',
        tags: ['tutorials-admin'],
        body: {
          type: 'object',
          required: ['topic', 'section', 'tutorial'],
          properties: {
            topic: { type: 'string' },
            section: { type: 'string' },
            tutorial: { type: 'string' },
            contentType: { type: 'string', default: 'tutorial' },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{
        Body: {
          topic: string;
          section: string;
          tutorial: string;
          contentType?: string;
        };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const content = await tutorialsService.generateAIContent(request.body);

        return reply.send({
          success: true,
          data: content,
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to generate content',
        });
      }
    }
  );
}
