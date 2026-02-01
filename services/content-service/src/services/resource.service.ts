// Resource Service
import { createPaginatedResult, PaginatedResult } from '../models/base.model';
import {
    CreateResourceDTO,
    Resource,
    ResourceFilter,
    ResourceWithAuthor,
    UpdateResourceDTO,
} from '../models/resource.model';
import { resourceRepository, ResourceRepository } from '../repositories/resource.repository';

export class ResourceService {
  constructor(private repository: ResourceRepository = resourceRepository) {}

  /**
   * Get all resources with pagination
   */
  async getAll(
    page: number = 1,
    pageSize: number = 10,
    orderBy: string = 'created_at',
    orderDir: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedResult<ResourceWithAuthor>> {
    const offset = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.repository.findWithFilter({}, pageSize, offset, orderBy, orderDir),
      this.repository.count(),
    ]);
    return createPaginatedResult(items, total, page, pageSize);
  }

  /**
   * Get resources with filter
   */
  async getFiltered(
    filter: ResourceFilter,
    page: number = 1,
    pageSize: number = 10,
    orderBy: string = 'created_at',
    orderDir: 'asc' | 'desc' = 'desc'
  ): Promise<PaginatedResult<ResourceWithAuthor>> {
    const offset = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.repository.findWithFilter(filter, pageSize, offset, orderBy, orderDir),
      this.repository.countWithFilter(filter),
    ]);
    return createPaginatedResult(items, total, page, pageSize);
  }

  /**
   * Get resource by ID
   */
  async getById(id: number): Promise<Resource | null> {
    return this.repository.findById(id);
  }

  /**
   * Get resource by slug
   */
  async getBySlug(slug: string): Promise<Resource | null> {
    return this.repository.findBySlug(slug);
  }

  /**
   * Get resource by slug with author
   */
  async getBySlugWithAuthor(slug: string): Promise<ResourceWithAuthor | null> {
    const resource = await this.repository.findBySlugWithAuthor(slug);
    if (resource) {
      await this.repository.incrementViewCount(resource.id);
    }
    return resource;
  }

  /**
   * Get popular resources
   */
  async getPopular(limit: number = 10): Promise<Resource[]> {
    return this.repository.getPopular(limit);
  }

  /**
   * Create resource
   */
  async create(data: CreateResourceDTO): Promise<Resource> {
    return this.repository.create(data);
  }

  /**
   * Update resource
   */
  async update(id: number, data: UpdateResourceDTO): Promise<Resource | null> {
    return this.repository.update(id, data);
  }

  /**
   * Delete resource
   */
  async delete(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }

  /**
   * Record download
   */
  async recordDownload(id: number): Promise<void> {
    await this.repository.incrementDownloadCount(id);
  }
}

export const resourceService = new ResourceService();
export default resourceService;
