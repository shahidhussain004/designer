// Comment Service
import { createPaginatedResult, PaginatedResult } from '../models/base.model';
import {
    Comment,
    CommentFilter,
    CommentWithReplies,
    CreateCommentDTO,
    UpdateCommentDTO,
} from '../models/comment.model';
import { commentRepository, CommentRepository } from '../repositories/comment.repository';

export class CommentService {
  constructor(private repository: CommentRepository = commentRepository) {}

  /**
   * Get comments by content ID
   */
  async getByContentId(
    contentId: number,
    approvedOnly: boolean = true
  ): Promise<CommentWithReplies[]> {
    return this.repository.findByContentId(contentId, approvedOnly);
  }

  /**
   * Get comments with filter
   */
  async getFiltered(
    filter: CommentFilter,
    page: number = 1,
    pageSize: number = 50
  ): Promise<PaginatedResult<Comment>> {
    const offset = (page - 1) * pageSize;
    const items = await this.repository.findWithFilter(filter, pageSize, offset);
    return createPaginatedResult(items, items.length, page, pageSize);
  }

  /**
   * Get comment by ID
   */
  async getById(id: number): Promise<Comment | null> {
    return this.repository.findById(id);
  }

  /**
   * Create comment
   */
  async create(data: CreateCommentDTO): Promise<Comment> {
    return this.repository.create(data);
  }

  /**
   * Update comment
   */
  async update(id: number, data: UpdateCommentDTO): Promise<Comment | null> {
    return this.repository.update(id, data);
  }

  /**
   * Delete comment
   */
  async delete(id: number): Promise<boolean> {
    return this.repository.delete(id);
  }

  /**
   * Approve comment
   */
  async approve(id: number): Promise<Comment | null> {
    return this.repository.approve(id);
  }

  /**
   * Mark as spam
   */
  async markAsSpam(id: number): Promise<Comment | null> {
    return this.repository.markAsSpam(id);
  }

  /**
   * Like comment
   */
  async like(id: number): Promise<void> {
    await this.repository.like(id);
  }

  /**
   * Get pending count
   */
  async getPendingCount(): Promise<number> {
    return this.repository.countPending();
  }
}

export const commentService = new CommentService();
export default commentService;
