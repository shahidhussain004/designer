/**
 * Category repository
 */
import { prisma } from '@infrastructure/database';
import { Category, Prisma } from '@prisma/client';

export class CategoryRepository {
  async findAll(includeInactive = false): Promise<Category[]> {
    return prisma.category.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return prisma.category.findUnique({
      where: { slug },
    });
  }

  async findByParentId(parentId: string | null): Promise<Category[]> {
    return prisma.category.findMany({
      where: { parentId, isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  async findWithChildren(id: string): Promise<Category & { children: Category[] } | null> {
    return prisma.category.findUnique({
      where: { id },
      include: {
        children: {
          where: { isActive: true },
          orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
        },
      },
    });
  }

  async create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return prisma.category.create({
      data,
    });
  }

  async update(id: string, data: Prisma.CategoryUpdateInput): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({
      where: { id },
    });
  }

  async softDelete(id: string): Promise<Category> {
    return prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async exists(id: string): Promise<boolean> {
    const count = await prisma.category.count({
      where: { id },
    });
    return count > 0;
  }

  async isNameUnique(name: string, excludeId?: string): Promise<boolean> {
    const count = await prisma.category.count({
      where: {
        name,
        id: excludeId ? { not: excludeId } : undefined,
      },
    });
    return count === 0;
  }

  async isSlugUnique(slug: string, excludeId?: string): Promise<boolean> {
    const count = await prisma.category.count({
      where: {
        slug,
        id: excludeId ? { not: excludeId } : undefined,
      },
    });
    return count === 0;
  }

  async getContentCount(categoryId: string): Promise<number> {
    return prisma.content.count({
      where: { categoryId },
    });
  }
}

export const categoryRepository = new CategoryRepository();
