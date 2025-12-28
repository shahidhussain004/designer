/**
 * Error handler plugin
 */
import { BaseException } from '@common/exceptions';
import { logger } from '@config/logger.config';
import { FastifyError, FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { ZodError } from 'zod';

async function errorHandlerPlugin(fastify: FastifyInstance): Promise<void> {
  fastify.setErrorHandler((error: FastifyError | Error, request, reply) => {
    const requestId = request.headers['x-request-id'] || 'unknown';

    // Handle custom exceptions
    if (error instanceof BaseException) {
      logger.warn({
        requestId,
        error: error.message,
        code: error.code,
        path: request.url,
      }, 'Request error');

      return reply.status(error.statusCode).send(error.toJSON());
    }

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      const validationErrors: Record<string, string[]> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        if (!validationErrors[path]) {
          validationErrors[path] = [];
        }
        validationErrors[path].push(err.message);
      });

      logger.warn({
        requestId,
        errors: validationErrors,
        path: request.url,
      }, 'Validation error');

      return reply.status(422).send({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: validationErrors,
        },
      });
    }

    // Handle Fastify errors
    if ('statusCode' in error && error.statusCode) {
      logger.warn({
        requestId,
        error: error.message,
        statusCode: error.statusCode,
        path: request.url,
      }, 'Fastify error');

      return reply.status(error.statusCode).send({
        success: false,
        error: {
          code: error.code || 'REQUEST_ERROR',
          message: error.message,
        },
      });
    }

    // Handle unexpected errors
    logger.error({
      requestId,
      error: error.message,
      stack: error.stack,
      path: request.url,
    }, 'Unexpected error');

    return reply.status(500).send({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    });
  });

  // Handle 404
  fastify.setNotFoundHandler((request, reply) => {
    reply.status(404).send({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Route ${request.method} ${request.url} not found`,
      },
    });
  });
}

export default fp(errorHandlerPlugin, {
  name: 'errorHandler',
});
