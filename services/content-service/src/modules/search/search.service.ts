/**
 * Search service for content
 */
import { PaginatedResult, PaginationParams } from '@common/interfaces';
import { buildPaginationMeta, normalizePagination } from '@common/utils';
import { redisConfig } from '@config/redis.config';
import { redisService } from '@infrastructure/cache';
import { prisma } from '@infrastructure/database';
import { ContentStatus, ContentType } from '@prisma/client';
import { ContentWithRelations } from '../content/content.repository';

export interface SearchFilters {
  contentTypes?: ContentType[];
  categoryIds?: string[];
  tagIds?: string[];
  authorId?: string;
  fromDate?: Date;
  toDate?: Date;
}

export interface SearchParams extends PaginationParams {
  query: string;
  filters?: SearchFilters;
}

export class SearchService {
  private readonly cachePrefix = redisConfig.keyPatterns.search;
  private readonly cacheTtl = 300; // 5 minutes for search results

  async search(params: SearchParams): Promise<PaginatedResult<ContentWithRelations>> {
    const { query, filters } = params;
    const { page, limit, sortBy, sortOrder } = normalizePagination(params);
    const skip = (page - 1) * limit;

    // Build cache key
    const cacheKey = this.buildCacheKey(params);
    const cached = await redisService.get<{
      data: ContentWithRelations[];
      total: number;
    }>(cacheKey);

    if (cached) {
      return {
        data: cached.data,
        meta: buildPaginationMeta(cached.total, page, limit),
      };
    }

    // Build where clause
    const where: any = {
      deletedAt: null,
      status: 'published' as ContentStatus,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } },
        { body: { contains: query, mode: 'insensitive' } },
        {
          tags: {
            some: {
              tag: {
                name: { contains: query, mode: 'insensitive' },
              },
            },
          },
        },
      ],
    };

    // Apply filters
    if (filters) {
      if (filters.contentTypes && filters.contentTypes.length > 0) {
        where.contentType = { in: filters.contentTypes };
      }
      if (filters.categoryIds && filters.categoryIds.length > 0) {
        where.categoryId = { in: filters.categoryIds };
      }
      if (filters.tagIds && filters.tagIds.length > 0) {
        where.tags = {
          ...where.tags,
          some: {
            ...where.tags?.some,
            tagId: { in: filters.tagIds },
          },
        };
      }
      if (filters.authorId) {
        where.authorId = filters.authorId;
      }
      if (filters.fromDate) {
        where.publishedAt = { ...where.publishedAt, gte: filters.fromDate };
      }
      if (filters.toDate) {
        where.publishedAt = { ...where.publishedAt, lte: filters.toDate };
      }
    }

    const [results, total] = await Promise.all([
      prisma.content.findMany({
        where,
        include: {
          author: {
            select: { id: true, name: true, avatarUrl: true },
          },
          category: {
            select: { id: true, name: true, slug: true },
          },
          tags: {
            include: {
              tag: {
                select: { id: true, name: true, slug: true, color: true },
              },
            },
          },
        },
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.content.count({ where }),
    ]);

    // Cache results
    await redisService.set(cacheKey, { data: results, total }, this.cacheTtl);

    return {
      data: results as ContentWithRelations[],
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async getSuggestions(query: string, limit = 5): Promise<string[]> {
    // Get recent searches matching the query
    const results = await prisma.content.findMany({
      where: {
        deletedAt: null,
        status: 'published',
        title: { contains: query, mode: 'insensitive' },
      },
      select: { title: true },
      take: limit,
      orderBy: { viewCount: 'desc' },
    });

    return results.map((r) => r.title);
  }

  async getPopularSearches(limit = 10): Promise<string[]> {
    // This would typically use a search analytics table
    // For now, return popular content titles
    const results = await prisma.content.findMany({
      where: {
        deletedAt: null,
        status: 'published',
      },
      select: { title: true },
      take: limit,
      orderBy: { viewCount: 'desc' },
    });

    return results.map((r) => r.title);
  }

  private buildCacheKey(params: SearchParams): string {
    const key = JSON.stringify({
      q: params.query,
      f: params.filters,
      p: params.page,
      l: params.limit,
      s: params.sortBy,
      o: params.sortOrder,
    });
    return `${this.cachePrefix}${Buffer.from(key).toString('base64')}`;
  }
}

export const searchService = new SearchService();
