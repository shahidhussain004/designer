// Content Service
import { createPaginatedResult, PaginatedResult } from '../models/base.model';
import {
    Content,
    ContentFilter,
    ContentType,
    ContentWithRelations,
    CreateContentDTO,
    UpdateContentDTO,
} from '../models/content.model';
import { contentRepository, ContentRepository } from '../repositories/content.repository';

export class ContentService {
  constructor(private repository: ContentRepository = contentRepository) {}

  /**
   * Get all content with pagination
   */
  async getAll(
    page: number = 1,
    pageSize: number = 10,
    orderBy: string = 'created_at',
    orderDir: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedResult<ContentWithRelations>> {
    const offset = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.repository.findWithFilter({}, pageSize, offset, orderBy, orderDir),
      this.repository.count(),
    ]);
    return createPaginatedResult(items, total, page, pageSize);
  }

  /**
   * Get content with filter
   */
  async getFiltered(
    filter: ContentFilter,
    page: number = 1,
    pageSize: number = 10,
    orderBy: string = 'created_at',
    orderDir: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedResult<ContentWithRelations>> {
    const offset = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.repository.findWithFilter(filter, pageSize, offset, orderBy, orderDir),
      this.repository.countWithFilter(filter),
    ]);
    return createPaginatedResult(items, total, page, pageSize);
  }

  /**
   * Get content by ID
   */
  async getById(id: number): Promise<Content | null> {
    return this.repository.findById(id);
  }

  /**
   * Get content by ID with relations
   */
  async getByIdWithRelations(id: number): Promise<ContentWithRelations | null> {
    return this.repository.findByIdWithRelations(id);
  }

  /**
   * Get content by slug
   */
  async getBySlug(slug: string): Promise<Content | null> {
    return this.repository.findBySlug(slug);
  }

  /**
   * Get content by slug with relations
   */
  async getBySlugWithRelations(slug: string): Promise<ContentWithRelations | null> {
    return this.repository.findBySlugWithRelations(slug);
  }

  /**
   * Get featured content
   */
  async getFeatured(limit: number = 5): Promise<ContentWithRelations[]> {
    return this.repository.getFeatured(limit);
  }

  /**
   * Get trending content
   */
  async getTrending(limit: number = 5): Promise<ContentWithRelations[]> {
    return this.repository.getTrending(limit);
  }

  /**
   * Get recent content by type
   */
  async getRecentByType(type: ContentType, limit: number = 5): Promise<ContentWithRelations[]> {
    return this.repository.getRecentByType(type, limit);
  }

  /**
   * Get related content
   */
  async getRelated(contentId: number, limit: number = 5): Promise<Content[]> {
    return this.repository.getRelated(contentId, limit);
  }

  /**
   * Create content
   */
  async create(data: CreateContentDTO): Promise<Content> {
    return this.repository.create(data);
  }

  /**
   * Update content
   */
  async update(id: number, data: UpdateContentDTO): Promise<Content | null> {
    return this.repository.update(id, data);
  }

  /**
   * Delete content
   */
  async delete(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }

  /**
   * Publish content
   */
  async publish(id: number): Promise<Content | null> {
    return this.repository.publish(id);
  }

  /**
   * Unpublish content
   */
  async unpublish(id: number): Promise<Content | null> {
    return this.repository.unpublish(id);
  }

  /**
   * Record view
   */
  async recordView(id: number): Promise<void> {
    await this.repository.incrementViewCount(id);
  }

  /**
   * Like content
   */
  async like(id: number): Promise<void> {
    await this.repository.incrementLikeCount(id);
  }

  /**
   * Unlike content
   */
  async unlike(id: number): Promise<void> {
    await this.repository.decrementLikeCount(id);
  }
}

export const contentService = new ContentService();
export default contentService;
