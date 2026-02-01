// Media Service
import { createPaginatedResult, PaginatedResult } from '../models/base.model';
import {
    CreateMediaAssetDTO,
    MediaAsset,
    MediaAssetFilter,
    UpdateMediaAssetDTO,
} from '../models/media.model';
import { mediaRepository, MediaRepository } from '../repositories/media.repository';

export class MediaService {
  constructor(private repository: MediaRepository = mediaRepository) {}

  /**
   * Get all media with pagination
   */
  async getAll(page: number = 1, pageSize: number = 50): Promise<PaginatedResult<MediaAsset>> {
    const offset = (page - 1) * pageSize;
    const [items, total] = await Promise.all([
      this.repository.findWithFilter({}, pageSize, offset),
      this.repository.count(),
    ]);
    return createPaginatedResult(items, total, page, pageSize);
  }

  /**
   * Get media with filter
   */
  async getFiltered(
    filter: MediaAssetFilter,
    page: number = 1,
    pageSize: number = 50
  ): Promise<PaginatedResult<MediaAsset>> {
    const offset = (page - 1) * pageSize;
    const items = await this.repository.findWithFilter(filter, pageSize, offset);
    return createPaginatedResult(items, items.length, page, pageSize);
  }

  /**
   * Get media by ID
   */
  async getById(id: number): Promise<MediaAsset | null> {
    return this.repository.findById(id);
  }

  /**
   * Get media by filename
   */
  async getByFilename(filename: string): Promise<MediaAsset | null> {
    return this.repository.findByFilename(filename);
  }

  /**
   * Create media
   */
  async create(data: CreateMediaAssetDTO): Promise<MediaAsset> {
    return this.repository.create(data);
  }

  /**
   * Update media
   */
  async update(id: number, data: UpdateMediaAssetDTO): Promise<MediaAsset | null> {
    return this.repository.update(id, data);
  }

  /**
   * Delete media
   */
  async delete(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }

  /**
   * Get folders
   */
  async getFolders(): Promise<string[]> {
    return this.repository.getFolders();
  }

  /**
   * Get storage stats
   */
  async getStorageStats(): Promise<{ totalFiles: number; totalSize: number }> {
    return this.repository.getStorageStats();
  }
}

export const mediaService = new MediaService();
export default mediaService;
