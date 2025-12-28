/**
 * JWT Authentication middleware
 */
import { appConfig } from '@config/index';
import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { ForbiddenException, UnauthorizedException } from '../exceptions';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

declare module 'fastify' {
  interface FastifyRequest {
    user?: JwtPayload;
    userId?: string;
  }
}

/**
 * Verify JWT token and attach user to request
 */
export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid authorization header');
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    const decoded = jwt.verify(token, appConfig.jwt.secret) as JwtPayload;
    
    request.user = decoded;
    request.userId = decoded.sub;
  } catch (error) {
    if (error instanceof UnauthorizedException) {
      throw error;
    }
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedException('Token has expired');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedException('Invalid token');
    }
    throw new UnauthorizedException('Authentication failed');
  }
}

/**
 * Optional authentication - doesn't throw if no token
 */
export async function optionalAuth(
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> {
  try {
    const authHeader = request.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return;
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return;
    }

    const decoded = jwt.verify(token, appConfig.jwt.secret) as JwtPayload;
    
    request.user = decoded;
    request.userId = decoded.sub;
  } catch {
    // Silently ignore auth errors for optional auth
  }
}

/**
 * Require specific roles
 */
export function requireRoles(...roles: string[]) {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      throw new UnauthorizedException('Authentication required');
    }

    if (!roles.includes(request.user.role)) {
      throw new ForbiddenException('Insufficient permissions');
    }
  };
}

/**
 * Admin-only access
 */
export const requireAdmin = requireRoles('admin');

/**
 * Author or admin access
 */
export const requireAuthorOrAdmin = requireRoles('admin', 'author');
