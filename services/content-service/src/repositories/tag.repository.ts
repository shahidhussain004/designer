// Tag Repository
import { query } from '../config/database';
import { CreateTagDTO, Tag, TagFilter, UpdateTagDTO } from '../models/tag.model';
import { BaseRepository } from './base.repository';

export class TagRepository extends BaseRepository<Tag, CreateTagDTO, UpdateTagDTO> {
  protected tableName = 'tags';
  protected columns = [
    'id',
    'name',
    'slug',
    'description',
    'usage_count',
    'created_at',
    'updated_at',
  ];

  /**
   * Find tag by slug
   */
  async findBySlug(slug: string): Promise<Tag | null> {
    const result = await query<Tag>(`SELECT * FROM ${this.tableName} WHERE slug = $1`, [slug]);
    return result.rows[0] || null;
  }

  /**
   * Find tags with filter
   */
  async findWithFilter(filter: TagFilter, limit: number = 100, offset: number = 0): Promise<Tag[]> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filter.search) {
      conditions.push(`(name ILIKE $${paramIndex} OR description ILIKE $${paramIndex})`);
      params.push(`%${filter.search}%`);
      paramIndex++;
    }

    if (filter.minUsageCount !== undefined) {
      conditions.push(`usage_count >= $${paramIndex++}`);
      params.push(filter.minUsageCount);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    params.push(limit, offset);

    const result = await query<Tag>(
      `SELECT * FROM ${this.tableName} 
       ${whereClause} 
       ORDER BY usage_count DESC, name ASC 
       LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      params
    );
    return result.rows;
  }

  /**
   * Find tags by IDs
   */
  async findByIds(ids: number[]): Promise<Tag[]> {
    if (ids.length === 0) return [];

    const result = await query<Tag>(`SELECT * FROM ${this.tableName} WHERE id = ANY($1)`, [ids]);
    return result.rows;
  }

  /**
   * Create a new tag
   */
  async create(data: CreateTagDTO): Promise<Tag> {
    const slug = data.slug || this.generateSlug(data.name);
    const { sql, values } = this.buildInsertQuery({ ...data, slug });
    const result = await query<Tag>(sql, values);
    return result.rows[0];
  }

  /**
   * Update tag
   */
  async update(id: number, data: UpdateTagDTO): Promise<Tag | null> {
    const { sql, values } = this.buildUpdateQuery(id, data);
    const result = await query<Tag>(sql, values);
    return result.rows[0] || null;
  }

  /**
   * Increment usage count
   */
  async incrementUsageCount(id: number): Promise<void> {
    await query(`UPDATE ${this.tableName} SET usage_count = usage_count + 1 WHERE id = $1`, [id]);
  }

  /**
   * Decrement usage count
   */
  async decrementUsageCount(id: number): Promise<void> {
    await query(
      `UPDATE ${this.tableName} SET usage_count = GREATEST(0, usage_count - 1) WHERE id = $1`,
      [id]
    );
  }

  /**
   * Get popular tags
   */
  async getPopular(limit: number = 10): Promise<Tag[]> {
    const result = await query<Tag>(
      `SELECT * FROM ${this.tableName} 
       ORDER BY usage_count DESC 
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }

  /**
   * Check if slug exists (excluding a specific id)
   */
  async slugExists(slug: string, excludeId?: number): Promise<boolean> {
    const params = excludeId ? [slug, excludeId] : [slug];
    const excludeClause = excludeId ? ' AND id != $2' : '';

    const result = await query<{ exists: boolean }>(
      `SELECT EXISTS(SELECT 1 FROM ${this.tableName} WHERE slug = $1${excludeClause})`,
      params
    );
    return result.rows[0].exists;
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

export const tagRepository = new TagRepository();
export default tagRepository;
