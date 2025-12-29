/**
 * Category service
 */
import { BadRequestException, ConflictException, NotFoundException } from '@common/exceptions';
import { generateSlug } from '@common/utils';
import { CreateCategoryInput, UpdateCategoryInput } from '@common/utils/validation';
import { logger } from '@config/logger.config';
import { redisConfig } from '@config/redis.config';
import { redisService } from '@infrastructure/cache';
import { Category } from '@prisma/client';
import { categoryRepository } from './category.repository';

export interface CategoryTree extends Category {
  children: CategoryTree[];
}

export class CategoryService {
  private readonly cachePrefix = redisConfig.keyPatterns.category;
  private readonly cacheTtl = redisConfig.ttl.category;

  async findAll(includeInactive = false): Promise<Category[]> {
    const cacheKey = `${this.cachePrefix}all:${includeInactive}`;

    const cached = await redisService.get<Category[]>(cacheKey);
    if (cached) return cached;

    const categories = await categoryRepository.findAll(includeInactive);
    await redisService.set(cacheKey, categories, this.cacheTtl);

    return categories;
  }

  async findById(id: string): Promise<Category> {
    const cacheKey = redisService.buildCategoryKey(id);

    const cached = await redisService.get<Category>(cacheKey);
    if (cached) return cached;

    const category = await categoryRepository.findById(id);
    if (!category) {
      throw new NotFoundException('Category', id);
    }

    await redisService.set(cacheKey, category, this.cacheTtl);
    return category;
  }

  async findBySlug(slug: string): Promise<Category> {
    const cacheKey = `${this.cachePrefix}slug:${slug}`;

    const cached = await redisService.get<Category>(cacheKey);
    if (cached) return cached;

    const category = await categoryRepository.findBySlug(slug);
    if (!category) {
      throw new NotFoundException('Category');
    }

    await redisService.set(cacheKey, category, this.cacheTtl);
    return category;
  }

  async getTree(): Promise<CategoryTree[]> {
    const cacheKey = `${this.cachePrefix}tree`;

    const cached = await redisService.get<CategoryTree[]>(cacheKey);
    if (cached) return cached;

    const allCategories = await categoryRepository.findAll();
    const tree = this.buildTree(allCategories);

    await redisService.set(cacheKey, tree, this.cacheTtl);
    return tree;
  }

  private buildTree(categories: Category[], parentId: string | null = null): CategoryTree[] {
    return categories
      .filter((cat) => cat.parentId === parentId)
      .map((cat) => ({
        ...cat,
        children: this.buildTree(categories, cat.id),
      }))
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  async create(input: CreateCategoryInput): Promise<Category> {
    const slug = generateSlug(input.name);

    // Check name uniqueness
    if (!(await categoryRepository.isNameUnique(input.name))) {
      throw new ConflictException(`Category with name '${input.name}' already exists`);
    }

    // Check slug uniqueness
    if (!(await categoryRepository.isSlugUnique(slug))) {
      throw new ConflictException(`Category with slug '${slug}' already exists`);
    }

    // Validate parent exists
    if (input.parentId) {
      const parentExists = await categoryRepository.exists(input.parentId);
      if (!parentExists) {
        throw new BadRequestException('Parent category does not exist');
      }
    }

    const category = await categoryRepository.create({
      name: input.name,
      slug,
      description: input.description,
      parent: input.parentId ? { connect: { id: input.parentId } } : undefined,
      icon: input.icon,
      sortOrder: input.sortOrder ?? 0,
    });

    await this.invalidateCache();
    logger.info({ categoryId: category.id }, 'Category created');

    return category;
  }

  async update(id: string, input: UpdateCategoryInput): Promise<Category> {
    const existing = await categoryRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Category', id);
    }

    // Check name uniqueness if changing
    if (input.name && input.name !== existing.name) {
      if (!(await categoryRepository.isNameUnique(input.name, id))) {
        throw new ConflictException(`Category with name '${input.name}' already exists`);
      }
    }

    // Generate new slug if name changes
    const slug = input.name ? generateSlug(input.name) : undefined;

    if (slug && slug !== existing.slug) {
      if (!(await categoryRepository.isSlugUnique(slug, id))) {
        throw new ConflictException(`Category with slug '${slug}' already exists`);
      }
    }

    // Prevent circular parent reference
    if (input.parentId === id) {
      throw new BadRequestException('Category cannot be its own parent');
    }

    // Validate parent exists
    if (input.parentId) {
      const parentExists = await categoryRepository.exists(input.parentId);
      if (!parentExists) {
        throw new BadRequestException('Parent category does not exist');
      }
    }

    const category = await categoryRepository.update(id, {
      name: input.name,
      slug,
      description: input.description,
      parent: input.parentId
        ? { connect: { id: input.parentId } }
        : input.parentId === null
          ? { disconnect: true }
          : undefined,
      icon: input.icon,
      sortOrder: input.sortOrder,
    });

    await this.invalidateCache();
    logger.info({ categoryId: id }, 'Category updated');

    return category;
  }

  async delete(id: string): Promise<void> {
    const existing = await categoryRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Category', id);
    }

    // Check if category has content
    const contentCount = await categoryRepository.getContentCount(id);
    if (contentCount > 0) {
      throw new BadRequestException(
        `Cannot delete category with ${contentCount} associated content items`
      );
    }

    // Check if category has children
    const children = await categoryRepository.findByParentId(id);
    if (children.length > 0) {
      throw new BadRequestException('Cannot delete category with child categories');
    }

    await categoryRepository.delete(id);
    await this.invalidateCache();

    logger.info({ categoryId: id }, 'Category deleted');
  }

  private async invalidateCache(): Promise<void> {
    await redisService.deletePattern(`${this.cachePrefix}*`);
  }
}

export const categoryService = new CategoryService();
