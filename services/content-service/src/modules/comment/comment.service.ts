/**
 * Comment service
 */
import { BadRequestException, ForbiddenException, NotFoundException } from '@common/exceptions';
import { PaginatedResult, PaginationParams } from '@common/interfaces';
import { buildPaginationMeta } from '@common/utils';
import { CreateCommentInput, UpdateCommentInput } from '@common/utils/validation';
import { logger } from '@config/logger.config';
import { kafkaService } from '@infrastructure/messaging';
import { contentRepository } from '../content/content.repository';
import { commentRepository, CommentWithAuthor } from './comment.repository';

export class CommentService {
  async findByContent(
    contentId: string,
    params: PaginationParams = {}
  ): Promise<PaginatedResult<CommentWithAuthor>> {
    // Verify content exists
    const contentExists = await contentRepository.exists(contentId);
    if (!contentExists) {
      throw new NotFoundException('Content', contentId);
    }

    const { comments, total } = await commentRepository.findByContent(contentId, params);
    const { page = 1, limit = 10 } = params;

    return {
      data: comments,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findById(id: string): Promise<CommentWithAuthor> {
    const comment = await commentRepository.findById(id);
    if (!comment) {
      throw new NotFoundException('Comment', id);
    }
    return comment;
  }

  async findByAuthor(
    authorId: string,
    params: PaginationParams = {}
  ): Promise<PaginatedResult<CommentWithAuthor>> {
    const { comments, total } = await commentRepository.findByAuthor(authorId, params);
    const { page = 1, limit = 10 } = params;

    return {
      data: comments,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findPendingApproval(
    params: PaginationParams = {}
  ): Promise<PaginatedResult<CommentWithAuthor>> {
    const { comments, total } = await commentRepository.findPendingApproval(params);
    const { page = 1, limit = 10 } = params;

    return {
      data: comments,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findFlagged(params: PaginationParams = {}): Promise<PaginatedResult<CommentWithAuthor>> {
    const { comments, total } = await commentRepository.findFlagged(params);
    const { page = 1, limit = 10 } = params;

    return {
      data: comments,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async create(input: CreateCommentInput, authorId: string): Promise<CommentWithAuthor> {
    // Verify content exists and allows comments
    const content = await contentRepository.findById(input.contentId);
    if (!content) {
      throw new NotFoundException('Content', input.contentId);
    }
    if (!content.allowComments) {
      throw new BadRequestException('Comments are disabled for this content');
    }

    // Verify parent comment exists if replying
    if (input.parentId) {
      const parent = await commentRepository.findById(input.parentId);
      if (!parent) {
        throw new NotFoundException('Parent comment', input.parentId);
      }
      if (parent.contentId !== input.contentId) {
        throw new BadRequestException('Parent comment belongs to different content');
      }
    }

    const comment = await commentRepository.create({
      content: { connect: { id: input.contentId } },
      author: { connect: { id: authorId } },
      parent: input.parentId ? { connect: { id: input.parentId } } : undefined,
      body: input.body,
      isApproved: false, // Require moderation by default
    });

    // Publish event
    await kafkaService.publishCommentCreated(input.contentId, {
      commentId: comment.id,
      contentId: input.contentId,
      authorId,
      isReply: !!input.parentId,
    });

    logger.info({ commentId: comment.id, contentId: input.contentId }, 'Comment created');

    return comment;
  }

  async update(
    id: string,
    input: UpdateCommentInput,
    userId: string,
    isAdmin = false
  ): Promise<CommentWithAuthor> {
    const existing = await commentRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Comment', id);
    }

    // Check ownership unless admin
    if (!isAdmin && existing.authorId !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    const comment = await commentRepository.update(id, {
      body: input.body,
      isApproved: false, // Re-require moderation after edit
    });

    logger.info({ commentId: id, userId }, 'Comment updated');

    return comment;
  }

  async delete(id: string, userId: string, isAdmin = false): Promise<void> {
    const existing = await commentRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Comment', id);
    }

    // Check ownership unless admin
    if (!isAdmin && existing.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await commentRepository.delete(id);
    logger.info({ commentId: id, userId }, 'Comment deleted');
  }

  async approve(id: string): Promise<CommentWithAuthor> {
    const existing = await commentRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Comment', id);
    }

    const comment = await commentRepository.approve(id);
    logger.info({ commentId: id }, 'Comment approved');

    return comment;
  }

  async flag(id: string, reason?: string): Promise<CommentWithAuthor> {
    const existing = await commentRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Comment', id);
    }

    const comment = await commentRepository.flag(id);
    logger.info({ commentId: id, reason }, 'Comment flagged');

    return comment;
  }

  async unflag(id: string): Promise<CommentWithAuthor> {
    const existing = await commentRepository.findById(id);
    if (!existing) {
      throw new NotFoundException('Comment', id);
    }

    const comment = await commentRepository.unflag(id);
    logger.info({ commentId: id }, 'Comment unflagged');

    return comment;
  }

  async getCount(contentId: string): Promise<number> {
    return commentRepository.getCount(contentId);
  }
}

export const commentService = new CommentService();
