/**
 * Base interfaces for content-service
 */

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams extends PaginationParams {
  query?: string;
  filters?: Record<string, unknown>;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
  stack?: string;
}

export interface RequestContext {
  requestId: string;
  userId?: string;
  userRole?: string;
  ip?: string;
  userAgent?: string;
}

export interface CacheOptions {
  ttl?: number;
  key?: string;
  invalidateOn?: string[];
}

export interface EventPayload<T = unknown> {
  eventType: string;
  timestamp: Date;
  source: string;
  data: T;
  metadata?: Record<string, unknown>;
}
