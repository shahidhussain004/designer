/**
 * Tag repository
 */
import { PaginationParams } from '@common/interfaces';
import { normalizePagination } from '@common/utils';
import { prisma } from '@infrastructure/database';
import { Prisma, Tag } from '@prisma/client';

export class TagRepository {
  async findAll(params: PaginationParams = {}): Promise<{ tags: Tag[]; total: number }> {
    const { page, limit, sortBy, sortOrder } = normalizePagination(params);
    const skip = (page - 1) * limit;

    const [tags, total] = await Promise.all([
      prisma.tag.findMany({
        skip,
        take: limit,
        orderBy: { [sortBy === 'usageCount' ? 'usageCount' : 'name']: sortOrder },
      }),
      prisma.tag.count(),
    ]);

    return { tags, total };
  }

  async findById(id: string): Promise<Tag | null> {
    return prisma.tag.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<Tag | null> {
    return prisma.tag.findUnique({
      where: { slug },
    });
  }

  async findByIds(ids: string[]): Promise<Tag[]> {
    return prisma.tag.findMany({
      where: { id: { in: ids } },
    });
  }

  async findPopular(limit = 10): Promise<Tag[]> {
    return prisma.tag.findMany({
      orderBy: { usageCount: 'desc' },
      take: limit,
    });
  }

  async search(query: string, limit = 10): Promise<Tag[]> {
    return prisma.tag.findMany({
      where: {
        name: { contains: query, mode: 'insensitive' },
      },
      orderBy: { usageCount: 'desc' },
      take: limit,
    });
  }

  async create(data: Prisma.TagCreateInput): Promise<Tag> {
    return prisma.tag.create({
      data,
    });
  }

  async update(id: string, data: Prisma.TagUpdateInput): Promise<Tag> {
    return prisma.tag.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.tag.delete({
      where: { id },
    });
  }

  async incrementUsageCount(id: string): Promise<void> {
    await prisma.tag.update({
      where: { id },
      data: { usageCount: { increment: 1 } },
    });
  }

  async decrementUsageCount(id: string): Promise<void> {
    await prisma.tag.update({
      where: { id },
      data: { usageCount: { decrement: 1 } },
    });
  }

  async isNameUnique(name: string, excludeId?: string): Promise<boolean> {
    const count = await prisma.tag.count({
      where: {
        name,
        id: excludeId ? { not: excludeId } : undefined,
      },
    });
    return count === 0;
  }

  async isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
    const count = await prisma.tag.count({
      where: {
        slug,
        id: excludeId ? { not: excludeId } : undefined,
      },
    });
    return count === 0;
  }

  async getContentCount(tagId: string): Promise<number> {
    return prisma.contentTag.count({
      where: { tagId },
    });
  }
}

export const tagRepository = new TagRepository();
