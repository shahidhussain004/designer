// Comment Repository
import { query } from '../config/database';
import {
    Comment,
    CommentFilter,
    CommentWithReplies,
    CreateCommentDTO,
    UpdateCommentDTO,
} from '../models/comment.model';
import { BaseRepository } from './base.repository';

export class CommentRepository extends BaseRepository<Comment, CreateCommentDTO, UpdateCommentDTO> {
  protected tableName = 'comments';
  protected columns = [
    'id',
    'content_id',
    'parent_id',
    'user_id',
    'author_name',
    'author_email',
    'body',
    'is_approved',
    'is_spam',
    'likes',
    'ip_address',
    'user_agent',
    'created_at',
    'updated_at',
  ];

  /**
   * Find comments by content ID with nested replies
   */
  async findByContentId(
    contentId: number,
    approvedOnly: boolean = true
  ): Promise<CommentWithReplies[]> {
    const approvedClause = approvedOnly ? 'AND is_approved = true AND is_spam = false' : '';

    const result = await query<Comment>(
      `SELECT * FROM ${this.tableName} 
       WHERE content_id = $1 ${approvedClause}
       ORDER BY created_at ASC`,
      [contentId]
    );

    const comments = result.rows;
    const commentMap = new Map<number, CommentWithReplies>();
    const rootComments: CommentWithReplies[] = [];

    // First pass: create map of all comments
    comments.forEach((comment) => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // Second pass: build tree
    comments.forEach((comment) => {
      const c = commentMap.get(comment.id)!;
      if (comment.parent_id === null) {
        rootComments.push(c);
      } else {
        const parent = commentMap.get(comment.parent_id);
        if (parent) {
          parent.replies = parent.replies || [];
          parent.replies.push(c);
        }
      }
    });

    return rootComments;
  }

  /**
   * Find comments with filter
   */
  async findWithFilter(
    filter: CommentFilter,
    limit: number = 50,
    offset: number = 0
  ): Promise<Comment[]> {
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (filter.content_id) {
      conditions.push(`content_id = $${paramIndex++}`);
      params.push(filter.content_id);
    }

    if (filter.user_id) {
      conditions.push(`user_id = $${paramIndex++}`);
      params.push(filter.user_id);
    }

    if (filter.is_approved !== undefined) {
      conditions.push(`is_approved = $${paramIndex++}`);
      params.push(filter.is_approved);
    }

    if (filter.is_spam !== undefined) {
      conditions.push(`is_spam = $${paramIndex++}`);
      params.push(filter.is_spam);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    params.push(limit, offset);

    const result = await query<Comment>(
      `SELECT * FROM ${this.tableName} 
       ${whereClause} 
       ORDER BY created_at DESC 
       LIMIT $${paramIndex++} OFFSET $${paramIndex}`,
      params
    );
    return result.rows;
  }

  /**
   * Create a comment
   */
  async create(data: CreateCommentDTO): Promise<Comment> {
    const { sql, values } = this.buildInsertQuery(data);
    const result = await query<Comment>(sql, values);

    // Update comment count on content
    await query(`UPDATE content SET comment_count = comment_count + 1 WHERE id = $1`, [
      data.content_id,
    ]);

    return result.rows[0];
  }

  /**
   * Update comment
   */
  async update(id: number, data: UpdateCommentDTO): Promise<Comment | null> {
    const { sql, values } = this.buildUpdateQuery(id, data);
    const result = await query<Comment>(sql, values);
    return result.rows[0] || null;
  }

  /**
   * Approve comment
   */
  async approve(id: number): Promise<Comment | null> {
    const result = await query<Comment>(
      `UPDATE ${this.tableName} 
       SET is_approved = true, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Mark as spam
   */
  async markAsSpam(id: number): Promise<Comment | null> {
    const result = await query<Comment>(
      `UPDATE ${this.tableName} 
       SET is_spam = true, is_approved = false, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );
    return result.rows[0] || null;
  }

  /**
   * Like a comment
   */
  async like(id: number): Promise<void> {
    await query(`UPDATE ${this.tableName} SET likes = likes + 1 WHERE id = $1`, [id]);
  }

  /**
   * Delete comment and update count
   */
  async delete(id: number): Promise<boolean> {
    const comment = await this.findById(id);
    if (!comment) return false;

    const result = await query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);

    if ((result.rowCount || 0) > 0) {
      await query(
        `UPDATE content SET comment_count = GREATEST(0, comment_count - 1) WHERE id = $1`,
        [comment.content_id]
      );
      return true;
    }

    return false;
  }

  /**
   * Count pending comments
   */
  async countPending(): Promise<number> {
    const result = await query<{ count: string }>(
      `SELECT COUNT(*) FROM ${this.tableName} WHERE is_approved = false AND is_spam = false`
    );
    return parseInt(result.rows[0].count, 10);
  }
}

export const commentRepository = new CommentRepository();
export default commentRepository;
