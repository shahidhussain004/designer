/**
 * Courses Routes
 * Public and admin endpoints for courses feature
 */

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { coursesService } from './courses.service';

export async function coursesRoutes(app: FastifyInstance) {
  // =====================================================
  // PUBLIC ROUTES
  // =====================================================

  // Get all courses
  app.get(
    '/',
    {
      schema: {
        description: 'Get all courses',
        tags: ['courses'],
        querystring: {
          type: 'object',
          properties: {
            published: { type: 'string', enum: ['true', 'false'], default: 'true' },
            category: { type: 'string' },
            level: { type: 'string', enum: ['Beginner', 'Intermediate', 'Advanced'] },
            search: { type: 'string' },
            page: { type: 'string', default: '1' },
            pageSize: { type: 'string', default: '12' },
            sortBy: { type: 'string' },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{
        Querystring: {
          published?: string;
          category?: string;
          level?: string;
          search?: string;
          page?: string;
          pageSize?: string;
          sortBy?: string;
        };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const published = request.query.published !== 'false';
        const page = parseInt(request.query.page || '1', 10);
        const pageSize = parseInt(request.query.pageSize || '12', 10);

        const result = await coursesService.getAllCourses(published, {
          category: request.query.category,
          level: request.query.level,
          search: request.query.search,
          page,
          pageSize,
          sortBy: request.query.sortBy,
        });

        return reply.send({
          success: true,
          ...result,
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to fetch courses',
        });
      }
    }
  );

  // Get course by slug
  app.get(
    '/:slug',
    {
      schema: {
        description: 'Get course by slug',
        tags: ['courses'],
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
        const course = await coursesService.getCourseBySlug(request.params.slug);

        if (!course) {
          return reply.status(404).send({
            success: false,
            error: 'Course not found',
          });
        }

        return reply.send({
          success: true,
          data: course,
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to fetch course',
        });
      }
    }
  );

  // Get course by ID
  app.get(
    '/id/:id',
    {
      schema: {
        description: 'Get course by ID',
        tags: ['courses'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const course = await coursesService.getCourseById(request.params.id);

        if (!course) {
          return reply.status(404).send({
            success: false,
            error: 'Course not found',
          });
        }

        return reply.send({
          success: true,
          data: course,
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to fetch course',
        });
      }
    }
  );

  // Get course lessons
  app.get(
    '/:courseId/lessons',
    {
      schema: {
        description: 'Get lessons for a course',
        tags: ['courses'],
        params: {
          type: 'object',
          properties: {
            courseId: { type: 'string' },
          },
          required: ['courseId'],
        },
      },
    },
    async (request: FastifyRequest<{ Params: { courseId: string } }>, reply: FastifyReply) => {
      try {
        const lessons = await coursesService.getCourseLessons(request.params.courseId);

        return reply.send({
          success: true,
          data: lessons,
          count: lessons.length,
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to fetch lessons',
        });
      }
    }
  );

  // Get lesson by ID
  app.get(
    '/:courseId/lessons/:lessonId',
    {
      schema: {
        description: 'Get lesson by ID',
        tags: ['courses'],
        params: {
          type: 'object',
          properties: {
            courseId: { type: 'string' },
            lessonId: { type: 'string' },
          },
          required: ['courseId', 'lessonId'],
        },
      },
    },
    async (
      request: FastifyRequest<{ Params: { courseId: string; lessonId: string } }>,
      reply: FastifyReply
    ) => {
      try {
        const lesson = await coursesService.getLessonById(
          request.params.courseId,
          request.params.lessonId
        );

        if (!lesson) {
          return reply.status(404).send({
            success: false,
            error: 'Lesson not found',
          });
        }

        return reply.send({
          success: true,
          data: lesson,
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to fetch lesson',
        });
      }
    }
  );

  // =====================================================
  // ADMIN ROUTES (can be protected with auth middleware)
  // =====================================================

  // Create course (admin)
  app.post(
    '/',
    {
      schema: {
        description: 'Create a new course',
        tags: ['courses', 'admin'],
        body: {
          type: 'object',
          required: ['title', 'slug', 'instructorId', 'instructorName'],
          properties: {
            title: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            shortDescription: { type: 'string' },
            instructorId: { type: 'string' },
            instructorName: { type: 'string' },
            price: { type: 'number' },
            currency: { type: 'string' },
            thumbnailUrl: { type: 'string' },
            category: { type: 'string' },
            level: { type: 'string' },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const course = await coursesService.createCourse(request.body as any);

        return reply.status(201).send({
          success: true,
          data: course,
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to create course',
        });
      }
    }
  );

  // Update course (admin)
  app.patch(
    '/:id',
    {
      schema: {
        description: 'Update a course',
        tags: ['courses', 'admin'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
        body: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            description: { type: 'string' },
            shortDescription: { type: 'string' },
            price: { type: 'number' },
            currency: { type: 'string' },
            thumbnailUrl: { type: 'string' },
            category: { type: 'string' },
            level: { type: 'string' },
            totalDurationMinutes: { type: 'number' },
            totalLessons: { type: 'number' },
            isPublished: { type: 'boolean' },
            displayOrder: { type: 'number' },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        const course = await coursesService.updateCourse(request.params.id, request.body as any);

        return reply.send({
          success: true,
          data: course,
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to update course',
        });
      }
    }
  );

  // Delete course (admin)
  app.delete(
    '/:id',
    {
      schema: {
        description: 'Delete a course',
        tags: ['courses', 'admin'],
        params: {
          type: 'object',
          properties: {
            id: { type: 'string' },
          },
          required: ['id'],
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      try {
        await coursesService.deleteCourse(request.params.id);

        return reply.send({
          success: true,
          message: 'Course deleted successfully',
        });
      } catch (error) {
        app.log.error(error);
        return reply.status(500).send({
          success: false,
          error: 'Failed to delete course',
        });
      }
    }
  );
}
