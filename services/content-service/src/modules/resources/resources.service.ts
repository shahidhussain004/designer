/**
 * Resources Service
 * Business logic for resources feature
 */

import { prismaService } from '@infrastructure/database';

class ResourcesService {
  // =====================================================
  // PUBLIC METHODS
  // =====================================================

  async getAllResources(
    publishedOnly: boolean = true,
    filters?: {
      category?: string;
      search?: string;
      page?: number;
      pageSize?: number;
      sortBy?: string;
    }
  ) {
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 12;
    const skip = (page - 1) * pageSize;

    const whereClause: any = publishedOnly ? { isPublished: true } : {};

    if (filters?.category) {
      whereClause.category = filters.category;
    }

    if (filters?.search) {
      whereClause.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { content: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    const [resources, totalCount] = await Promise.all([
      prismaService.client.resource.findMany({
        where: whereClause,
        skip,
        take: pageSize,
        orderBy:
          filters?.sortBy === 'recent'
            ? { createdAt: 'desc' }
            : { displayOrder: 'asc', createdAt: 'desc' },
      }),
      prismaService.client.resource.count({ where: whereClause }),
    ]);

    return {
      items: resources.map(this.formatResource),
      totalCount,
      page,
      pageSize,
    };
  }

  async getResourceBySlug(slug: string) {
    const resource = await prismaService.client.resource.findUnique({
      where: { slug },
    });

    if (!resource || !resource.isPublished) {
      return null;
    }

    // Increment view count
    await prismaService.client.resource.update({
      where: { slug },
      data: { viewsCount: { increment: 1 } },
    });

    return {
      ...this.formatResource(resource),
      content: resource.content,
    };
  }

  async getResourceById(id: string) {
    const resource = await prismaService.client.resource.findUnique({
      where: { id },
    });

    if (!resource || !resource.isPublished) {
      return null;
    }

    // Increment view count
    await prismaService.client.resource.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    });

    return {
      ...this.formatResource(resource),
      content: resource.content,
    };
  }

  async createResource(data: {
    title: string;
    slug: string;
    description?: string;
    content: string;
    category?: string;
    tags?: string[];
    sourceUrl?: string;
    authorName?: string;
    authorUrl?: string;
    resourceType?: string;
    difficulty?: string;
    estimatedReadTime?: number;
    thumbnailUrl?: string;
  }) {
    const resource = await prismaService.client.resource.create({
      data: {
        title: data.title,
        slug: data.slug,
        description: data.description,
        content: data.content,
        category: data.category,
        tags: data.tags || [],
        sourceUrl: data.sourceUrl,
        authorName: data.authorName,
        authorUrl: data.authorUrl,
        resourceType: data.resourceType,
        difficulty: data.difficulty || 'Intermediate',
        estimatedReadTime: data.estimatedReadTime,
        thumbnailUrl: data.thumbnailUrl,
      },
    });

    return this.formatResource(resource);
  }

  async updateResource(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      content: string;
      category: string;
      tags: string[];
      sourceUrl: string;
      authorName: string;
      authorUrl: string;
      resourceType: string;
      difficulty: string;
      estimatedReadTime: number;
      thumbnailUrl: string;
      isPublished: boolean;
      displayOrder: number;
    }>
  ) {
    const resource = await prismaService.client.resource.update({
      where: { id },
      data,
    });

    return this.formatResource(resource);
  }

  async deleteResource(id: string) {
    await prismaService.client.resource.delete({
      where: { id },
    });
  }

  async getResourcesByCategory(category: string, publishedOnly: boolean = true) {
    const resources = await prismaService.client.resource.findMany({
      where: {
        category,
        ...(publishedOnly && { isPublished: true }),
      },
      orderBy: { displayOrder: 'asc' },
    });

    return resources.map(this.formatResource);
  }

  // =====================================================
  // PRIVATE METHODS
  // =====================================================

  private formatResource(resource: any) {
    return {
      id: resource.id,
      slug: resource.slug,
      title: resource.title,
      description: resource.description,
      category: resource.category,
      tags: resource.tags || [],
      sourceUrl: resource.sourceUrl,
      authorName: resource.authorName,
      authorUrl: resource.authorUrl,
      resourceType: resource.resourceType,
      difficulty: resource.difficulty,
      estimatedReadTime: resource.estimatedReadTime,
      viewsCount: resource.viewsCount,
      isPublished: resource.isPublished,
      thumbnailUrl: resource.thumbnailUrl,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
    };
  }
}

export const resourcesService = new ResourcesService();
