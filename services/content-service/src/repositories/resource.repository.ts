// Resource Repository
import { query } from '../config/database';
import {
    CreateResourceDTO,
    Resource,
    ResourceFilter,
    ResourceWithAuthor,
    UpdateResourceDTO,
} from '../models/resource.model';
import { BaseRepository } from './base.repository';

export class ResourceRepository extends BaseRepository<
  Resource,
  CreateResourceDTO,
  UpdateResourceDTO
> {
  protected tableName = 'resources';
  protected columns = [
    'id',
    'slug',
    'title',
    'description',
    'content',
    'resource_type',
    'category',
    'tags',
    'file_url',
    'file_size',
    'file_type',
    'thumbnail_url',
    'author_id',
    'is_published',
    'is_featured',
    'is_premium',
    'download_count',
    'view_count',
    'rating',
    'rating_count',
    'meta_title',
    'meta_description',
    'published_at',
    'created_at',
    'updated_at',
  ];

  /**
   * Find resource by slug
   */
  async findBySlug(slug: string): Promise<Resource | null> {
    const result = await query<Resource>(`SELECT * FROM ${this.tableName} WHERE slug = $1`, [slug]);
    return result.rows[0] || null;
  }

  /**
   * Find resource by slug with author
   */
  async findBySlugWithAuthor(slug: string): Promise<ResourceWithAuthor | null> {
    const result = await query<ResourceWithAuthor>(
      `SELECT r.*,
              json_build_object(
                'id', a.id, 'name', a.name, 'avatar_url', a.avatar_url, 'bio', a.bio
              ) as author
       FROM ${this.tableName} r
       LEFT JOIN authors a ON r.author_id = a.id
       WHERE r.slug = $1`,
      [slug]
    );
    return result.rows[0] || null;
  }

  /**
   * Find resources with filter
   */
  async findWithFilter(
    filter: ResourceFilter,
    limit: number = 10,
    offset: number = 0,
    orderBy: string = 'created_at',
    orderDir: 'asc' | 'desc' = 'desc'
  ): Promise<ResourceWithAuthor[]> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filter.category) {
      conditions.push(`r.category = $${paramIndex++}`);
      params.push(filter.category);
    }

    if (filter.resource_type) {
      conditions.push(`r.resource_type = $${paramIndex++}`);
      params.push(filter.resource_type);
    }

    if (filter.is_published !== undefined) {
      conditions.push(`r.is_published = $${paramIndex++}`);
      params.push(filter.is_published);
    }

    if (filter.is_featured !== undefined) {
      conditions.push(`r.is_featured = $${paramIndex++}`);
      params.push(filter.is_featured);
    }

    if (filter.is_premium !== undefined) {
      conditions.push(`r.is_premium = $${paramIndex++}`);
      params.push(filter.is_premium);
    }

    if (filter.search) {
      conditions.push(
        `(r.title ILIKE $${paramIndex} OR r.description ILIKE $${paramIndex} OR r.content ILIKE $${paramIndex})`
      );
      params.push(`%${filter.search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    params.push(limit, offset);

    const result = await query<ResourceWithAuthor>(
      `SELECT r.*,
              json_build_object(
                'id', a.id, 'name', a.name, 'avatar_url', a.avatar_url
              ) as author
       FROM ${this.tableName} r
       LEFT JOIN authors a ON r.author_id = a.id
       ${whereClause}
       ORDER BY r.${orderBy} ${orderDir}
       LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      params
    );

    return result.rows;
  }

  /**
   * Count resources with filter
   */
  async countWithFilter(filter: ResourceFilter): Promise<number> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filter.category) {
      conditions.push(`category = $${paramIndex++}`);
      params.push(filter.category);
    }

    if (filter.resource_type) {
      conditions.push(`resource_type = $${paramIndex++}`);
      params.push(filter.resource_type);
    }

    if (filter.is_published !== undefined) {
      conditions.push(`is_published = $${paramIndex++}`);
      params.push(filter.is_published);
    }

    if (filter.search) {
      conditions.push(`(title ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      params.push(`%${filter.search}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? conditions.join(' AND ') : '1=1';
    return this.count(whereClause, params);
  }

  /**
   * Create resource
   */
  async create(data: CreateResourceDTO): Promise<Resource> {
    const slug = data.slug || this.generateSlug(data.title);
    const insertData = {
      ...data,
      slug,
      tags: data.tags ? `{${data.tags.join(',')}}` : '{}',
    };
    const { sql, values } = this.buildInsertQuery(insertData);
    const result = await query<Resource>(sql, values);
    return result.rows[0];
  }

  /**
   * Update resource
   */
  async update(id: number, data: UpdateResourceDTO): Promise<Resource | null> {
    const updateData: any = { ...data };
    if (data.tags) {
      updateData.tags = `{${data.tags.join(',')}}`;
    }
    const { sql, values } = this.buildUpdateQuery(id, updateData);
    const result = await query<Resource>(sql, values);
    return result.rows[0] || null;
  }

  /**
   * Increment download count
   */
  async incrementDownloadCount(id: number): Promise<void> {
    await query(`UPDATE ${this.tableName} SET download_count = download_count + 1 WHERE id = $1`, [
      id,
    ]);
  }

  /**
   * Increment view count
   */
  async incrementViewCount(id: number): Promise<void> {
    await query(`UPDATE ${this.tableName} SET view_count = view_count + 1 WHERE id = $1`, [id]);
  }

  /**
   * Get popular resources
   */
  async getPopular(limit: number = 10): Promise<Resource[]> {
    const result = await query<Resource>(
      `SELECT * FROM ${this.tableName} 
       WHERE is_published = true 
       ORDER BY download_count DESC 
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }

  /**
   * Generate slug from title
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

export const resourceRepository = new ResourceRepository();
export default resourceRepository;
