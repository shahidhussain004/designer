/**
 * Comment repository
 */
import { PaginationParams } from '@common/interfaces';
import { normalizePagination } from '@common/utils';
import { prisma } from '@infrastructure/database';
import { Prisma } from '@prisma/client';

export interface CommentAuthor {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface CommentWithAuthor {
  id: string;
  contentId: string;
  authorId: string;
  parentId: string | null;
  body: string;
  isApproved: boolean;
  isFlagged: boolean;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
  author: CommentAuthor;
  replies?: CommentWithAuthor[];
}

export class CommentRepository {
  private getInclude(includeReplies = false) {
    const include = {
      author: {
        select: { id: true, name: true, avatarUrl: true },
      },
      content: {
        select: { id: true, title: true },
      },
      _count: {
        select: { replies: true },
      },
      parent: {
        select: { id: true, body: true },
      },
      replies: includeReplies ? {
        where: { isApproved: true },
        include: {
          author: {
            select: { id: true, name: true, avatarUrl: true },
          },
        },
        orderBy: { createdAt: 'asc' as const },
      } : false,
    };

    return include;
  }

  async findByContent(
    contentId: string,
    params: PaginationParams = {},
    approvedOnly = true
  ): Promise<{ comments: CommentWithAuthor[]; total: number }> {
    const { page, limit, sortOrder } = normalizePagination(params);
    const skip = (page - 1) * limit;

    const where: Prisma.CommentWhereInput = {
      contentId,
      parentId: null, // Top-level comments only
      isApproved: approvedOnly ? true : undefined,
    };

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: this.getInclude(true),
        skip,
        take: limit,
        orderBy: { createdAt: sortOrder },
      }),
      prisma.comment.count({ where }),
    ]);

    return { comments: comments as unknown as CommentWithAuthor[], total };
  }

  async findById(id: string): Promise<CommentWithAuthor | null> {
    return prisma.comment.findUnique({
      where: { id },
      include: this.getInclude(true),
    }) as unknown as Promise<CommentWithAuthor | null>;
  }

  async findByAuthor(
    authorId: string,
    params: PaginationParams = {}
  ): Promise<{ comments: CommentWithAuthor[]; total: number }> {
    const { page, limit, sortOrder } = normalizePagination(params);
    const skip = (page - 1) * limit;

    const where: Prisma.CommentWhereInput = { authorId };

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: this.getInclude(),
        skip,
        take: limit,
        orderBy: { createdAt: sortOrder },
      }),
      prisma.comment.count({ where }),
    ]);

    return { comments: comments as unknown as CommentWithAuthor[], total };
  }

  async findPendingApproval(
    params: PaginationParams = {}
  ): Promise<{ comments: CommentWithAuthor[]; total: number }> {
    const { page, limit } = normalizePagination(params);
    const skip = (page - 1) * limit;

    const where: Prisma.CommentWhereInput = {
      isApproved: false,
      isFlagged: false,
    };

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: this.getInclude(),
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.comment.count({ where }),
    ]);

    return { comments: comments as unknown as CommentWithAuthor[], total };
  }

  async findFlagged(
    params: PaginationParams = {}
  ): Promise<{ comments: CommentWithAuthor[]; total: number }> {
    const { page, limit } = normalizePagination(params);
    const skip = (page - 1) * limit;

    const where: Prisma.CommentWhereInput = { isFlagged: true };

    const [comments, total] = await Promise.all([
      prisma.comment.findMany({
        where,
        include: this.getInclude(),
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.comment.count({ where }),
    ]);

    return { comments: comments as unknown as CommentWithAuthor[], total };
  }

  async create(data: Prisma.CommentCreateInput): Promise<CommentWithAuthor> {
    return prisma.comment.create({
      data,
      include: this.getInclude(),
    }) as unknown as Promise<CommentWithAuthor>;
  }

  async update(id: string, data: Prisma.CommentUpdateInput): Promise<CommentWithAuthor> {
    return prisma.comment.update({
      where: { id },
      data,
      include: this.getInclude(),
    }) as unknown as Promise<CommentWithAuthor>;
  }

  async delete(id: string): Promise<void> {
    // Delete all replies first
    await prisma.comment.deleteMany({
      where: { parentId: id },
    });
    
    await prisma.comment.delete({
      where: { id },
    });
  }

  async approve(id: string): Promise<CommentWithAuthor> {
    return this.update(id, { isApproved: true });
  }

  async flag(id: string): Promise<CommentWithAuthor> {
    return this.update(id, { isFlagged: true });
  }

  async unflag(id: string): Promise<CommentWithAuthor> {
    return this.update(id, { isFlagged: false });
  }

  async incrementLikeCount(id: string): Promise<void> {
    await prisma.comment.update({
      where: { id },
      data: { likeCount: { increment: 1 } },
    });
  }

  async getCount(contentId: string, approvedOnly = true): Promise<number> {
    return prisma.comment.count({
      where: {
        contentId,
        isApproved: approvedOnly ? true : undefined,
      },
    });
  }
}

export const commentRepository = new CommentRepository();
