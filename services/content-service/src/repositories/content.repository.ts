// Content Repository
import { query, transaction } from '../config/database';
import {
    Content,
    ContentFilter,
    ContentType,
    ContentWithRelations,
    CreateContentDTO,
    UpdateContentDTO
} from '../models/content.model';
import { Tag } from '../models/tag.model';
import { BaseRepository } from './base.repository';

export class ContentRepository extends BaseRepository<Content, CreateContentDTO, UpdateContentDTO> {
  protected tableName = 'content';
  protected columns = [
    'id',
    'title',
    'slug',
    'excerpt',
    'body',
    'content_type',
    'status',
    'featured_image',
    'author_id',
    'category_id',
    'view_count',
    'like_count',
    'comment_count',
    'is_featured',
    'is_trending',
    'meta_title',
    'meta_description',
    'meta_keywords',
    'reading_time',
    'published_at',
    'created_at',
    'updated_at',
  ];

  /**
   * Find content by slug
   */
  async findBySlug(slug: string): Promise<Content | null> {
    const result = await query<Content>(`SELECT * FROM ${this.tableName} WHERE slug = $1`, [slug]);
    return result.rows[0] || null;
  }

  /**
   * Find content with relations (author, category, tags)
   */
  async findByIdWithRelations(id: number): Promise<ContentWithRelations | null> {
    const result = await query<ContentWithRelations>(
      `SELECT c.*,
              json_build_object(
                'id', a.id, 'name', a.name, 'avatar_url', a.avatar_url, 'bio', a.bio
              ) as author,
              json_build_object(
                'id', cat.id, 'name', cat.name, 'slug', cat.slug
              ) as category
       FROM ${this.tableName} c
       LEFT JOIN authors a ON c.author_id = a.id
       LEFT JOIN categories cat ON c.category_id = cat.id
       WHERE c.id = $1`,
      [id]
    );

    if (!result.rows[0]) return null;

    const content = result.rows[0];
    content.tags = await this.getContentTags(id);

    return content;
  }

  /**
   * Find content by slug with relations
   */
  async findBySlugWithRelations(slug: string): Promise<ContentWithRelations | null> {
    const result = await query<ContentWithRelations>(
      `SELECT c.*,
              json_build_object(
                'id', a.id, 'name', a.name, 'avatar_url', a.avatar_url, 'bio', a.bio
              ) as author,
              json_build_object(
                'id', cat.id, 'name', cat.name, 'slug', cat.slug
              ) as category
       FROM ${this.tableName} c
       LEFT JOIN authors a ON c.author_id = a.id
       LEFT JOIN categories cat ON c.category_id = cat.id
       WHERE c.slug = $1`,
      [slug]
    );

    if (!result.rows[0]) return null;

    const content = result.rows[0];
    content.tags = await this.getContentTagsByContentId(content.id);

    return content;
  }

  /**
   * Get tags for a content item
   */
  async getContentTags(contentId: number): Promise<Tag[]> {
    const result = await query<Tag>(
      `SELECT t.* FROM tags t
       INNER JOIN content_tags ct ON t.id = ct.tag_id
       WHERE ct.content_id = $1`,
      [contentId]
    );
    return result.rows;
  }

  private async getContentTagsByContentId(contentId: number): Promise<Tag[]> {
    return this.getContentTags(contentId);
  }

  /**
   * Find content with filter and pagination
   */
  async findWithFilter(
    filter: ContentFilter,
    limit: number = 10,
    offset: number = 0,
    orderBy: string = 'created_at',
    orderDir: 'asc' | 'desc' = 'desc'
  ): Promise<ContentWithRelations[]> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filter.type) {
      conditions.push(`c.content_type = $${paramIndex++}`);
      params.push(filter.type);
    }

    if (filter.status) {
      conditions.push(`c.status = $${paramIndex++}`);
      params.push(filter.status);
    }

    if (filter.categoryId) {
      conditions.push(`c.category_id = $${paramIndex++}`);
      params.push(filter.categoryId);
    }

    if (filter.authorId) {
      conditions.push(`c.author_id = $${paramIndex++}`);
      params.push(filter.authorId);
    }

    if (filter.isFeatured !== undefined) {
      conditions.push(`c.is_featured = $${paramIndex++}`);
      params.push(filter.isFeatured);
    }

    if (filter.isTrending !== undefined) {
      conditions.push(`c.is_trending = $${paramIndex++}`);
      params.push(filter.isTrending);
    }

    if (filter.search) {
      conditions.push(`(
        c.title ILIKE $${paramIndex} OR 
        c.excerpt ILIKE $${paramIndex} OR 
        c.body ILIKE $${paramIndex}
      )`);
      params.push(`%${filter.search}%`);
      paramIndex++;
    }

    if (filter.tagIds && filter.tagIds.length > 0) {
      conditions.push(`c.id IN (
        SELECT content_id FROM content_tags WHERE tag_id = ANY($${paramIndex++})
      )`);
      params.push(filter.tagIds);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    params.push(limit, offset);

    const result = await query<ContentWithRelations>(
      `SELECT c.*,
              json_build_object(
                'id', a.id, 'name', a.name, 'avatar_url', a.avatar_url
              ) as author,
              json_build_object(
                'id', cat.id, 'name', cat.name, 'slug', cat.slug
              ) as category
       FROM ${this.tableName} c
       LEFT JOIN authors a ON c.author_id = a.id
       LEFT JOIN categories cat ON c.category_id = cat.id
       ${whereClause}
       ORDER BY c.${orderBy} ${orderDir}
       LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      params
    );

    return result.rows;
  }

  /**
   * Count content with filter
   */
  async countWithFilter(filter: ContentFilter): Promise<number> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filter.type) {
      conditions.push(`content_type = $${paramIndex++}`);
      params.push(filter.type);
    }

    if (filter.status) {
      conditions.push(`status = $${paramIndex++}`);
      params.push(filter.status);
    }

    if (filter.categoryId) {
      conditions.push(`category_id = $${paramIndex++}`);
      params.push(filter.categoryId);
    }

    if (filter.authorId) {
      conditions.push(`author_id = $${paramIndex++}`);
      params.push(filter.authorId);
    }

    if (filter.isFeatured !== undefined) {
      conditions.push(`is_featured = $${paramIndex++}`);
      params.push(filter.isFeatured);
    }

    if (filter.isTrending !== undefined) {
      conditions.push(`is_trending = $${paramIndex++}`);
      params.push(filter.isTrending);
    }

    if (filter.search) {
      conditions.push(
        `(title ILIKE $${paramIndex} OR excerpt ILIKE $${paramIndex} OR body ILIKE $${paramIndex})`
      );
      params.push(`%${filter.search}%`);
      paramIndex++;
    }

    if (filter.tagIds && filter.tagIds.length > 0) {
      conditions.push(
        `id IN (SELECT content_id FROM content_tags WHERE tag_id = ANY($${paramIndex++}))`
      );
      params.push(filter.tagIds);
    }

    const whereClause = conditions.length > 0 ? conditions.join(' AND ') : '1=1';
    return this.count(whereClause, params);
  }

  /**
   * Get featured content
   */
  async getFeatured(limit: number = 5): Promise<ContentWithRelations[]> {
    return this.findWithFilter({ isFeatured: true, status: 'published' }, limit, 0);
  }

  /**
   * Get trending content
   */
  async getTrending(limit: number = 5): Promise<ContentWithRelations[]> {
    return this.findWithFilter({ isTrending: true, status: 'published' }, limit, 0);
  }

  /**
   * Get recent content by type
   */
  async getRecentByType(type: ContentType, limit: number = 5): Promise<ContentWithRelations[]> {
    return this.findWithFilter({ type, status: 'published' }, limit, 0, 'published_at', 'desc');
  }

  /**
   * Get related content
   */
  async getRelated(contentId: number, limit: number = 5): Promise<Content[]> {
    const result = await query<Content>(
      `WITH content_info AS (
        SELECT category_id, content_type FROM ${this.tableName} WHERE id = $1
       )
       SELECT c.* FROM ${this.tableName} c, content_info ci
       WHERE c.id != $1 
         AND c.status = 'published'
         AND (c.category_id = ci.category_id OR c.content_type = ci.content_type)
       ORDER BY 
         CASE WHEN c.category_id = ci.category_id THEN 0 ELSE 1 END,
         c.published_at DESC
       LIMIT $2`,
      [contentId, limit]
    );
    return result.rows;
  }

  /**
   * Create content with tags
   */
  async create(data: CreateContentDTO): Promise<Content> {
    const { tag_ids, ...contentData } = data;
    const slug = contentData.slug || this.generateSlug(contentData.title);
    const reading_time = this.calculateReadingTime(contentData.body);

    return transaction(async (client) => {
      // Insert content
      const keys = Object.keys({ ...contentData, slug, reading_time }).filter(
        (k) => (contentData as any)[k] !== undefined || k === 'slug' || k === 'reading_time'
      );
      const values = keys.map((k) =>
        k === 'slug' ? slug : k === 'reading_time' ? reading_time : (contentData as any)[k]
      );
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');

      const contentResult = await client.query<Content>(
        `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`,
        values
      );
      const content = contentResult.rows[0];

      // Insert tags
      if (tag_ids && tag_ids.length > 0) {
        const tagValues = tag_ids.map((tagId, i) => `($1, $${i + 2})`).join(', ');
        await client.query(`INSERT INTO content_tags (content_id, tag_id) VALUES ${tagValues}`, [
          content.id,
          ...tag_ids,
        ]);
      }

      return content;
    });
  }

  /**
   * Update content with tags
   */
  async update(id: number, data: UpdateContentDTO): Promise<Content | null> {
    const { tag_ids, ...contentData } = data;

    return transaction(async (client) => {
      // Update content
      if (Object.keys(contentData).length > 0) {
        if (contentData.body) {
          (contentData as any).reading_time = this.calculateReadingTime(contentData.body);
        }

        const keys = Object.keys(contentData).filter((k) => (contentData as any)[k] !== undefined);
        const values = keys.map((k) => (contentData as any)[k]);
        const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
        values.push(id);

        await client.query(
          `UPDATE ${this.tableName} SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = $${values.length}`,
          values
        );
      }

      // Update tags if provided
      if (tag_ids !== undefined) {
        await client.query('DELETE FROM content_tags WHERE content_id = $1', [id]);

        if (tag_ids.length > 0) {
          const tagValues = tag_ids.map((tagId, i) => `($1, $${i + 2})`).join(', ');
          await client.query(`INSERT INTO content_tags (content_id, tag_id) VALUES ${tagValues}`, [
            id,
            ...tag_ids,
          ]);
        }
      }

      const result = await client.query<Content>(`SELECT * FROM ${this.tableName} WHERE id = $1`, [
        id,
      ]);
      return result.rows[0] || null;
    });
  }

  /**
   * Publish content
   */
  async publish(id: number): Promise<Content | null> {
    const result = await query<Content>(
      `UPDATE ${this.tableName} 
       SET status = 'published', published_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Unpublish content
   */
  async unpublish(id: number): Promise<Content | null> {
    const result = await query<Content>(
      `UPDATE ${this.tableName} 
       SET status = 'draft', updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Increment view count
   */
  async incrementViewCount(id: number): Promise<void> {
    await query(`UPDATE ${this.tableName} SET view_count = view_count + 1 WHERE id = $1`, [id]);
  }

  /**
   * Increment like count
   */
  async incrementLikeCount(id: number): Promise<void> {
    await query(`UPDATE ${this.tableName} SET like_count = like_count + 1 WHERE id = $1`, [id]);
  }

  /**
   * Decrement like count
   */
  async decrementLikeCount(id: number): Promise<void> {
    await query(
      `UPDATE ${this.tableName} SET like_count = GREATEST(0, like_count - 1) WHERE id = $1`,
      [id]
    );
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

  /**
   * Calculate reading time in minutes
   */
  private calculateReadingTime(body: string): number {
    const wordsPerMinute = 200;
    const wordCount = body.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }
}

export const contentRepository = new ContentRepository();
export default contentRepository;
