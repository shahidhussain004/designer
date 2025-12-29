/**
 * Content repository
 */
import { ContentFilters, ContentListParams } from '@common/interfaces';
import { normalizePagination } from '@common/utils';
import { prisma } from '@infrastructure/database';
import { Content, ContentStatus, ContentType, Prisma } from '@prisma/client';

export interface ContentWithRelations extends Content {
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  tags: Array<{
    tag: {
      id: string;
      name: string;
      slug: string;
      color: string;
    };
  }>;
}

export class ContentRepository {
  private buildWhereClause(filters?: ContentFilters): Prisma.ContentWhereInput {
    const where: Prisma.ContentWhereInput = {
      deletedAt: null,
    };

    if (filters) {
      if (filters.contentType) where.contentType = filters.contentType;
      if (filters.status) where.status = filters.status;
      if (filters.authorId) where.authorId = filters.authorId;
      if (filters.categoryId) where.categoryId = filters.categoryId;
      if (filters.isFeatured !== undefined) where.isFeatured = filters.isFeatured;
      if (filters.isTrending !== undefined) where.isTrending = filters.isTrending;

      if (filters.publishedAfter || filters.publishedBefore) {
        where.publishedAt = {};
        if (filters.publishedAfter) where.publishedAt.gte = filters.publishedAfter;
        if (filters.publishedBefore) where.publishedAt.lte = filters.publishedBefore;
      }

      if (filters.tagIds && filters.tagIds.length > 0) {
        where.tags = {
          some: {
            tagId: { in: filters.tagIds },
          },
        };
      }

      if (filters.search) {
        where.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { excerpt: { contains: filters.search, mode: 'insensitive' } },
          { body: { contains: filters.search, mode: 'insensitive' } },
        ];
      }
    }

    return where;
  }

  private getInclude() {
    return {
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
    };
  }

  async findAll(
    params: ContentListParams = {}
  ): Promise<{ content: ContentWithRelations[]; total: number }> {
    const { page, limit, sortBy, sortOrder } = normalizePagination(params);
    const skip = (page - 1) * limit;
    const where = this.buildWhereClause(params.filters);

    const [content, total] = await Promise.all([
      prisma.content.findMany({
        where,
        include: this.getInclude(),
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.content.count({ where }),
    ]);

    return { content: content as ContentWithRelations[], total };
  }

  async findPublished(
    params: ContentListParams = {}
  ): Promise<{ content: ContentWithRelations[]; total: number }> {
    const filters: ContentFilters = {
      ...params.filters,
      status: 'published' as ContentStatus,
    };
    return this.findAll({ ...params, filters });
  }

  async findById(id: string): Promise<ContentWithRelations | null> {
    return prisma.content.findFirst({
      where: { id, deletedAt: null },
      include: this.getInclude(),
    }) as Promise<ContentWithRelations | null>;
  }

  async findBySlug(slug: string): Promise<ContentWithRelations | null> {
    return prisma.content.findFirst({
      where: { slug, deletedAt: null },
      include: this.getInclude(),
    }) as Promise<ContentWithRelations | null>;
  }

  async findByAuthor(
    authorId: string,
    params: ContentListParams = {}
  ): Promise<{ content: ContentWithRelations[]; total: number }> {
    const filters: ContentFilters = {
      ...params.filters,
      authorId,
    };
    return this.findAll({ ...params, filters });
  }

  async findFeatured(limit = 5): Promise<ContentWithRelations[]> {
    return prisma.content.findMany({
      where: {
        deletedAt: null,
        status: 'published',
        isFeatured: true,
      },
      include: this.getInclude(),
      orderBy: { publishedAt: 'desc' },
      take: limit,
    }) as Promise<ContentWithRelations[]>;
  }

  async findTrending(limit = 10): Promise<ContentWithRelations[]> {
    return prisma.content.findMany({
      where: {
        deletedAt: null,
        status: 'published',
        isTrending: true,
      },
      include: this.getInclude(),
      orderBy: { viewCount: 'desc' },
      take: limit,
    }) as Promise<ContentWithRelations[]>;
  }

  async findRecent(contentType?: ContentType, limit = 10): Promise<ContentWithRelations[]> {
    return prisma.content.findMany({
      where: {
        deletedAt: null,
        status: 'published',
        contentType: contentType || undefined,
      },
      include: this.getInclude(),
      orderBy: { publishedAt: 'desc' },
      take: limit,
    }) as Promise<ContentWithRelations[]>;
  }

  async findRelated(contentId: string, limit = 5): Promise<ContentWithRelations[]> {
    const content = await prisma.content.findUnique({
      where: { id: contentId },
      include: { tags: true },
    });

    if (!content) return [];

    const tagIds = content.tags.map((t) => t.tagId);

    return prisma.content.findMany({
      where: {
        id: { not: contentId },
        deletedAt: null,
        status: 'published',
        OR: [{ categoryId: content.categoryId }, { tags: { some: { tagId: { in: tagIds } } } }],
      },
      include: this.getInclude(),
      orderBy: { publishedAt: 'desc' },
      take: limit,
    }) as Promise<ContentWithRelations[]>;
  }

  async create(data: Prisma.ContentCreateInput, tagIds?: string[]): Promise<ContentWithRelations> {
    return prisma.$transaction(async (tx) => {
      const content = await tx.content.create({
        data,
        include: this.getInclude(),
      });

      if (tagIds && tagIds.length > 0) {
        await tx.contentTag.createMany({
          data: tagIds.map((tagId) => ({
            contentId: content.id,
            tagId,
          })),
        });

        // Increment tag usage counts
        await tx.tag.updateMany({
          where: { id: { in: tagIds } },
          data: { usageCount: { increment: 1 } },
        });
      }

      return (await tx.content.findUnique({
        where: { id: content.id },
        include: this.getInclude(),
      })) as ContentWithRelations;
    });
  }

  async update(
    id: string,
    data: Prisma.ContentUpdateInput,
    tagIds?: string[]
  ): Promise<ContentWithRelations> {
    return prisma.$transaction(async (tx) => {
      await tx.content.update({
        where: { id },
        data,
      });

      if (tagIds !== undefined) {
        // Get current tags
        const currentTags = await tx.contentTag.findMany({
          where: { contentId: id },
        });
        const currentTagIds = currentTags.map((t) => t.tagId);

        // Decrement old tags
        if (currentTagIds.length > 0) {
          await tx.tag.updateMany({
            where: { id: { in: currentTagIds } },
            data: { usageCount: { decrement: 1 } },
          });
        }

        // Remove old associations
        await tx.contentTag.deleteMany({
          where: { contentId: id },
        });

        // Add new associations
        if (tagIds.length > 0) {
          await tx.contentTag.createMany({
            data: tagIds.map((tagId) => ({
              contentId: id,
              tagId,
            })),
          });

          // Increment new tags
          await tx.tag.updateMany({
            where: { id: { in: tagIds } },
            data: { usageCount: { increment: 1 } },
          });
        }
      }

      return (await tx.content.findUnique({
        where: { id },
        include: this.getInclude(),
      })) as ContentWithRelations;
    });
  }

  async softDelete(id: string): Promise<void> {
    await prisma.content.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  async hardDelete(id: string): Promise<void> {
    await prisma.$transaction(async (tx) => {
      // Get tags to decrement
      const tags = await tx.contentTag.findMany({
        where: { contentId: id },
      });

      if (tags.length > 0) {
        await tx.tag.updateMany({
          where: { id: { in: tags.map((t) => t.tagId) } },
          data: { usageCount: { decrement: 1 } },
        });
      }

      await tx.content.delete({
        where: { id },
      });
    });
  }

  async incrementViewCount(id: string): Promise<void> {
    await prisma.content.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }

  async incrementLikeCount(id: string): Promise<void> {
    await prisma.content.update({
      where: { id },
      data: { likeCount: { increment: 1 } },
    });
  }

  async decrementLikeCount(id: string): Promise<void> {
    await prisma.content.update({
      where: { id },
      data: { likeCount: { decrement: 1 } },
    });
  }

  async incrementShareCount(id: string): Promise<void> {
    await prisma.content.update({
      where: { id },
      data: { shareCount: { increment: 1 } },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await prisma.content.count({
      where: { id, deletedAt: null },
    });
    return count > 0;
  }

  async isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
    const count = await prisma.content.count({
      where: {
        slug,
        id: excludeId ? { not: excludeId } : undefined,
      },
    });
    return count === 0;
  }

  async getStats(): Promise<{
    total: number;
    published: number;
    draft: number;
    byType: Record<ContentType, number>;
    totalViews: number;
    totalLikes: number;
  }> {
    const [total, published, draft, byType, views, likes] = await Promise.all([
      prisma.content.count({ where: { deletedAt: null } }),
      prisma.content.count({ where: { deletedAt: null, status: 'published' } }),
      prisma.content.count({ where: { deletedAt: null, status: 'draft' } }),
      prisma.content.groupBy({
        by: ['contentType'],
        where: { deletedAt: null },
        _count: true,
      }),
      prisma.content.aggregate({
        where: { deletedAt: null },
        _sum: { viewCount: true },
      }),
      prisma.content.aggregate({
        where: { deletedAt: null },
        _sum: { likeCount: true },
      }),
    ]);

    const typeMap: Record<ContentType, number> = {
      blog: 0,
      article: 0,
      news: 0,
    };

    byType.forEach((item) => {
      typeMap[item.contentType] = item._count;
    });

    return {
      total,
      published,
      draft,
      byType: typeMap,
      totalViews: views._sum.viewCount || 0,
      totalLikes: likes._sum.likeCount || 0,
    };
  }
}

export const contentRepository = new ContentRepository();
