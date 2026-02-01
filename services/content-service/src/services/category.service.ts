// Category Service
import { createPaginatedResult, PaginatedResult } from '../models/base.model';
import {
    Category,
    CategoryFilter,
    CategoryWithChildren,
    CreateCategoryDTO,
    UpdateCategoryDTO,
} from '../models/category.model';
import { categoryRepository, CategoryRepository } from '../repositories/category.repository';

export class CategoryService {
  constructor(private repository: CategoryRepository = categoryRepository) {}

  /**
   * Get all categories with pagination
   */
  async getAll(page: number = 1, pageSize: number = 100): Promise<PaginatedResult<Category>> {
    const offset = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.repository.findWithFilter({}, pageSize, offset),
      this.repository.count(),
    ]);
    return createPaginatedResult(items, total, page, pageSize);
  }

  /**
   * Get categories with filter
   */
  async getFiltered(
    filter: CategoryFilter,
    page: number = 1,
    pageSize: number = 100
  ): Promise<PaginatedResult<Category>> {
    const offset = (page - 1) * pageSize;
    const items = await this.repository.findWithFilter(filter, pageSize, offset);
    // For filtered results, just return items without counting all
    return createPaginatedResult(items, items.length, page, pageSize);
  }

  /**
   * Get category tree
   */
  async getTree(): Promise<CategoryWithChildren[]> {
    return this.repository.getTree();
  }

  /**
   * Get category by ID
   */
  async getById(id: number): Promise<Category | null> {
    return this.repository.findById(id);
  }

  /**
   * Get category by slug
   */
  async getBySlug(slug: string): Promise<Category | null> {
    return this.repository.findBySlug(slug);
  }

  /**
   * Get children of a category
   */
  async getChildren(parentId: number): Promise<Category[]> {
    return this.repository.getChildren(parentId);
  }

  /**
   * Create category
   */
  async create(data: CreateCategoryDTO): Promise<Category> {
    // Generate slug if not provided
    if (!data.slug) {
      data.slug = this.generateSlug(data.name);
    }

    // Check if slug exists
    if (await this.repository.slugExists(data.slug)) {
      data.slug = `${data.slug}-${Date.now()}`;
    }

    return this.repository.create(data);
  }

  /**
   * Update category
   */
  async update(id: number, data: UpdateCategoryDTO): Promise<Category | null> {
    // Check if slug exists (excluding current category)
    if (data.slug && (await this.repository.slugExists(data.slug, id))) {
      throw new Error('Slug already exists');
    }

    return this.repository.update(id, data);
  }

  /**
   * Delete category
   */
  async delete(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }

  /**
   * Generate slug from name
   */
  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

export const categoryService = new CategoryService();
export default categoryService;
