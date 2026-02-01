// Tag Service
import { createPaginatedResult, PaginatedResult } from '../models/base.model';
import { CreateTagDTO, Tag, TagFilter, UpdateTagDTO } from '../models/tag.model';
import { tagRepository, TagRepository } from '../repositories/tag.repository';

export class TagService {
  constructor(private repository: TagRepository = tagRepository) {}

  /**
   * Get all tags with pagination
   */
  async getAll(page: number = 1, pageSize: number = 100): Promise<PaginatedResult<Tag>> {
    const offset = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.repository.findWithFilter({}, pageSize, offset),
      this.repository.count(),
    ]);
    return createPaginatedResult(items, total, page, pageSize);
  }

  /**
   * Get tags with filter
   */
  async getFiltered(
    filter: TagFilter,
    page: number = 1,
    pageSize: number = 100
  ): Promise<PaginatedResult<Tag>> {
    const offset = (page - 1) * pageSize;
    const items = await this.repository.findWithFilter(filter, pageSize, offset);
    return createPaginatedResult(items, items.length, page, pageSize);
  }

  /**
   * Get tag by ID
   */
  async getById(id: number): Promise<Tag | null> {
    return this.repository.findById(id);
  }

  /**
   * Get tag by slug
   */
  async getBySlug(slug: string): Promise<Tag | null> {
    return this.repository.findBySlug(slug);
  }

  /**
   * Get tags by IDs
   */
  async getByIds(ids: number[]): Promise<Tag[]> {
    return this.repository.findByIds(ids);
  }

  /**
   * Get popular tags
   */
  async getPopular(limit: number = 10): Promise<Tag[]> {
    return this.repository.getPopular(limit);
  }

  /**
   * Create tag
   */
  async create(data: CreateTagDTO): Promise<Tag> {
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
   * Update tag
   */
  async update(id: number, data: UpdateTagDTO): Promise<Tag | null> {
    // Check if slug exists (excluding current tag)
    if (data.slug && (await this.repository.slugExists(data.slug, id))) {
      throw new Error('Slug already exists');
    }

    return this.repository.update(id, data);
  }

  /**
   * Delete tag
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

export const tagService = new TagService();
export default tagService;
