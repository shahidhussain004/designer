/**
 * Request context middleware
 */
import { FastifyReply, FastifyRequest } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { RequestContext } from '../interfaces';

declare module 'fastify' {
  interface FastifyRequest {
    reqContext: RequestContext;
  }
}

/**
 * Attach request context to each request
 */
export async function requestContext(request: FastifyRequest, _reply: FastifyReply): Promise<void> {
  const requestId = (request.headers['x-request-id'] as string) || uuidv4();

  request.reqContext = {
    requestId,
    userId: request.userId,
    userRole: request.user?.role,
    ip: request.ip,
    userAgent: request.headers['user-agent'],
  };

  // Attach request ID to response headers
  _reply.header('x-request-id', requestId);
}
