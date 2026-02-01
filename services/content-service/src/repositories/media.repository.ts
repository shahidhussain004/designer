// Media Repository
import { query } from '../config/database';
import {
    CreateMediaAssetDTO,
    MediaAsset,
    MediaAssetFilter,
    UpdateMediaAssetDTO,
} from '../models/media.model';
import { BaseRepository } from './base.repository';

export class MediaRepository extends BaseRepository<
  MediaAsset,
  CreateMediaAssetDTO,
  UpdateMediaAssetDTO
> {
  protected tableName = 'media_assets';
  protected columns = [
    'id',
    'filename',
    'original_filename',
    'file_path',
    'url',
    'mime_type',
    'file_size',
    'width',
    'height',
    'duration',
    'alt_text',
    'caption',
    'folder',
    'uploaded_by',
    'is_public',
    'metadata',
    'created_at',
    'updated_at',
  ];

  /**
   * Find media by filename
   */
  async findByFilename(filename: string): Promise<MediaAsset | null> {
    const result = await query<MediaAsset>(`SELECT * FROM ${this.tableName} WHERE filename = $1`, [
      filename,
    ]);
    return result.rows[0] || null;
  }

  /**
   * Find media with filter
   */
  async findWithFilter(
    filter: MediaAssetFilter,
    limit: number = 50,
    offset: number = 0
  ): Promise<MediaAsset[]> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filter.folder) {
      conditions.push(`folder = $${paramIndex++}`);
      params.push(filter.folder);
    }

    if (filter.mime_type) {
      conditions.push(`mime_type LIKE $${paramIndex++}`);
      params.push(`${filter.mime_type}%`);
    }

    if (filter.uploaded_by) {
      conditions.push(`uploaded_by = $${paramIndex++}`);
      params.push(filter.uploaded_by);
    }

    if (filter.is_public !== undefined) {
      conditions.push(`is_public = $${paramIndex++}`);
      params.push(filter.is_public);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    params.push(limit, offset);

    const result = await query<MediaAsset>(
      `SELECT * FROM ${this.tableName} 
       ${whereClause} 
       ORDER BY created_at DESC 
       LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      params
    );
    return result.rows;
  }

  /**
   * Create media asset
   */
  async create(data: CreateMediaAssetDTO): Promise<MediaAsset> {
    const insertData = {
      ...data,
      metadata: JSON.stringify(data.metadata || {}),
    };
    const { sql, values } = this.buildInsertQuery(insertData);
    const result = await query<MediaAsset>(sql, values);
    return result.rows[0];
  }

  /**
   * Update media asset
   */
  async update(id: number, data: UpdateMediaAssetDTO): Promise<MediaAsset | null> {
    const updateData: any = { ...data };
    if (data.metadata) {
      updateData.metadata = JSON.stringify(data.metadata);
    }
    const { sql, values } = this.buildUpdateQuery(id, updateData);
    const result = await query<MediaAsset>(sql, values);
    return result.rows[0] || null;
  }

  /**
   * Get folders
   */
  async getFolders(): Promise<string[]> {
    const result = await query<{ folder: string }>(
      `SELECT DISTINCT folder FROM ${this.tableName} ORDER BY folder`
    );
    return result.rows.map((r) => r.folder);
  }

  /**
   * Get storage stats
   */
  async getStorageStats(): Promise<{ totalFiles: number; totalSize: number }> {
    const result = await query<{ total_files: string; total_size: string }>(
      `SELECT COUNT(*) as total_files, COALESCE(SUM(file_size), 0) as total_size FROM ${this.tableName}`
    );
    return {
      totalFiles: parseInt(result.rows[0].total_files, 10),
      totalSize: parseInt(result.rows[0].total_size, 10),
    };
  }
}

export const mediaRepository = new MediaRepository();
export default mediaRepository;
