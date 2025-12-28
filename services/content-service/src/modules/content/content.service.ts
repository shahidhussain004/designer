/**
 * Content service
 */
import {
    ForbiddenException,
    NotFoundException
} from '@common/exceptions';
import {
    ContentListParams,
    ContentStats,
    PaginatedResult
} from '@common/interfaces';
import {
    buildPaginationMeta,
    calculateReadingTime,
    generateExcerpt,
    generateSlug,
    generateUniqueSlug,
} from '@common/utils';
import {
    CreateContentInput,
    UpdateContentInput,
} from '@common/utils/validation';
import { logger } from '@config/logger.config';
import { redisConfig } from '@config/redis.config';
import { redisService } from '@infrastructure/cache';
import { kafkaService } from '@infrastructure/messaging';
import { ContentType } from '@prisma/client';
import { contentRepository, ContentWithRelations } from './content.repository';

export class ContentService {
  private readonly cachePrefix = redisConfig.keyPatterns.content;
  private readonly listCachePrefix = redisConfig.keyPatterns.contentList;
  private readonly cacheTtl = redisConfig.ttl.content;

  async findAll(
    params: ContentListParams = {}
  ): Promise<PaginatedResult<ContentWithRelations>> {
    const { content, total } = await contentRepository.findAll(params);
    const { page = 1, limit = 10 } = params;

    return {
      data: content,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findPublished(
    params: ContentListParams = {}
  ): Promise<PaginatedResult<ContentWithRelations>> {
    const { content, total } = await contentRepository.findPublished(params);
    const { page = 1, limit = 10 } = params;

    return {
      data: content,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findById(id: string): Promise<ContentWithRelations> {
    const cacheKey = redisService.buildContentKey(id);

    const cached = await redisService.get<ContentWithRelations>(cacheKey);
    if (cached) return cached;

    const content = await contentRepository.findById(id);
    if (!content) {
      throw new NotFoundException('Content', id);
    }

    await redisService.set(cacheKey, content, this.cacheTtl);
    return content;
  }

  async findBySlug(slug: string): Promise<ContentWithRelations> {
    const cacheKey = `${this.cachePrefix}slug:${slug}`;

    const cached = await redisService.get<ContentWithRelations>(cacheKey);
    if (cached) return cached;

    const content = await contentRepository.findBySlug(slug);
    if (!content) {
      throw new NotFoundException('Content');
    }

    await redisService.set(cacheKey, content, this.cacheTtl);
    return content;
  }

  async findByAuthor(
    authorId: string,
    params: ContentListParams = {}
  ): Promise<PaginatedResult<ContentWithRelations>> {
    const { content, total } = await contentRepository.findByAuthor(
      authorId,
      params
    );
    const { page = 1, limit = 10 } = params;

    return {
      data: content,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findFeatured(limit = 5): Promise<ContentWithRelations[]> {
    const cacheKey = `${this.listCachePrefix}featured:${limit}`;

    const cached = await redisService.get<ContentWithRelations[]>(cacheKey);
    if (cached) return cached;

    const content = await contentRepository.findFeatured(limit);
    await redisService.set(cacheKey, content, this.cacheTtl);

    return content;
  }

  async findTrending(limit = 10): Promise<ContentWithRelations[]> {
    const cacheKey = `${this.listCachePrefix}trending:${limit}`;

    const cached = await redisService.get<ContentWithRelations[]>(cacheKey);
    if (cached) return cached;

    const content = await contentRepository.findTrending(limit);
    await redisService.set(cacheKey, content, this.cacheTtl);

    return content;
  }

  async findRecent(
    contentType?: ContentType,
    limit = 10
  ): Promise<ContentWithRelations[]> {
    const cacheKey = `${this.listCachePrefix}recent:${contentType || 'all'}:${limit}`;

    const cached = await redisService.get<ContentWithRelations[]>(cacheKey);
    if (cached) return cached;

    const content = await contentRepository.findRecent(contentType, limit);
    await redisService.set(cacheKey, content, this.cacheTtl);

    return content;
  }

  async findRelated(
    contentId: string,
    limit = 5
  ): Promise<ContentWithRelations[]> {
    return contentRepository.findRelated(contentId, limit);
  }

  async create(
    input: CreateContentInput,
    authorId: string
  ): Promise<ContentWithRelations> {
    // Generate slug
    let slug = generateSlug(input.title);

    // Ensure slug is unique
    if (!(await contentRepository.isSlugUnique(slug))) {
      slug = generateUniqueSlug(input.title, Date.now().toString(36));
    }

    // Generate excerpt if not provided
    const excerpt = input.excerpt || generateExcerpt(input.body);

    // Calculate reading time
    const readingTimeMinutes = calculateReadingTime(input.body);

    const content = await contentRepository.create(
      {
        title: input.title,
        slug,
        body: input.body,
        excerpt,
        contentType: input.contentType,
        author: { connect: { id: authorId } },
        category: input.categoryId
          ? { connect: { id: input.categoryId } }
          : undefined,
        featuredImage: input.featuredImage,
        featuredImageAlt: input.featuredImageAlt,
        metaTitle: input.metaTitle || input.title,
        metaDescription: input.metaDescription || excerpt,
        metaKeywords: input.metaKeywords || [],
        scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
        isFeatured: input.isFeatured || false,
        allowComments: input.allowComments ?? true,
        customFields: input.customFields ? JSON.parse(JSON.stringify(input.customFields)) : undefined,
        readingTimeMinutes,
      },
      input.tagIds
    );

    await this.invalidateListCache();

    // Publish event
    await kafkaService.publishContentCreated(content.id, {
      id: content.id,
      title: content.title,
      authorId,
      contentType: content.contentType,
    });

    logger.info({ contentId: content.id, authorId }, 'Content created');

    return content;
  }

  async update(
    id: string,
    input: UpdateContentInput,
    userId: string,
    isAdmin = false
  ): Promise<ContentWithRelations> {
    const existing = await contentRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Content', id);
    }

    // Check ownership unless admin
    if (!isAdmin && existing.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own content');
    }

    // Handle slug change if title changed
    let slug: string | undefined;
    if (input.title && input.title !== existing.title) {
      slug = generateSlug(input.title);
      if (!(await contentRepository.isSlugUnique(slug, id))) {
        slug = generateUniqueSlug(input.title, Date.now().toString(36));
      }
    }

    // Recalculate reading time if body changed
    const readingTimeMinutes = input.body
      ? calculateReadingTime(input.body)
      : undefined;

    // Handle status change to published
    let publishedAt: Date | undefined;
    if (input.status === 'published' && existing.status !== 'published') {
      publishedAt = new Date();
    }

    const content = await contentRepository.update(
      id,
      {
        title: input.title,
        slug,
        body: input.body,
        excerpt: input.excerpt,
        status: input.status,
        category: input.categoryId
          ? { connect: { id: input.categoryId } }
          : undefined,
        featuredImage: input.featuredImage,
        featuredImageAlt: input.featuredImageAlt,
        metaTitle: input.metaTitle,
        metaDescription: input.metaDescription,
        metaKeywords: input.metaKeywords,
        scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
        isFeatured: input.isFeatured,
        allowComments: input.allowComments,
        customFields: input.customFields ? JSON.parse(JSON.stringify(input.customFields)) : undefined,
        readingTimeMinutes,
        publishedAt,
      },
      input.tagIds
    );

    await this.invalidateContentCache(id);
    await this.invalidateListCache();

    // Publish appropriate event
    if (input.status === 'published' && existing.status !== 'published') {
      await kafkaService.publishContentPublished(content.id, {
        id: content.id,
        title: content.title,
        authorId: content.authorId,
      });
    } else {
      await kafkaService.publishContentUpdated(content.id, {
        id: content.id,
        title: content.title,
        changes: Object.keys(input),
      });
    }

    logger.info({ contentId: id, userId }, 'Content updated');

    return content;
  }

  async publish(
    id: string,
    userId: string,
    isAdmin = false
  ): Promise<ContentWithRelations> {
    return this.update(id, { status: 'published' }, userId, isAdmin);
  }

  async unpublish(
    id: string,
    userId: string,
    isAdmin = false
  ): Promise<ContentWithRelations> {
    return this.update(id, { status: 'draft' }, userId, isAdmin);
  }

  async delete(id: string, userId: string, isAdmin = false): Promise<void> {
    const existing = await contentRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Content', id);
    }

    // Check ownership unless admin
    if (!isAdmin && existing.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own content');
    }

    await contentRepository.softDelete(id);
    await this.invalidateContentCache(id);
    await this.invalidateListCache();

    // Publish event
    await kafkaService.publishContentDeleted(id, {
      id,
      title: existing.title,
      authorId: existing.authorId,
    });

    logger.info({ contentId: id, userId }, 'Content deleted');
  }

  async getStats(): Promise<ContentStats> {
    const stats = await contentRepository.getStats();
    return {
      totalContent: stats.total,
      publishedCount: stats.published,
      draftCount: stats.draft,
      totalViews: stats.totalViews,
      totalLikes: stats.totalLikes,
      byContentType: stats.byType,
    };
  }

  private async invalidateContentCache(id: string): Promise<void> {
    await redisService.delete(redisService.buildContentKey(id));
    await redisService.deletePattern(`${this.cachePrefix}slug:*`);
  }

  private async invalidateListCache(): Promise<void> {
    await redisService.deletePattern(`${this.listCachePrefix}*`);
  }
}

export const contentService = new ContentService();
