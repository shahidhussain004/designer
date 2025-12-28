/**
 * Analytics service
 */
import { NotFoundException } from '@common/exceptions';
import { logger } from '@config/logger.config';
import { prisma } from '@infrastructure/database';
import { kafkaService } from '@infrastructure/messaging';
import { contentRepository } from '../content/content.repository';

export interface ContentAnalytics {
  contentId: string;
  totalViews: number;
  uniqueViews: number;
  totalLikes: number;
  totalShares: number;
  totalComments: number;
  viewsByDay: Array<{ date: string; count: number }>;
}

export interface OverallAnalytics {
  totalContent: number;
  totalViews: number;
  totalLikes: number;
  totalShares: number;
  totalComments: number;
  topContent: Array<{
    id: string;
    title: string;
    views: number;
    likes: number;
  }>;
  contentByType: Record<string, number>;
  recentActivity: Array<{
    type: string;
    contentId: string;
    title: string;
    timestamp: Date;
  }>;
}

export class AnalyticsService {
  /**
   * Track a content view
   */
  async trackView(
    contentId: string,
    userId?: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    // Verify content exists
    const exists = await contentRepository.exists(contentId);
    if (!exists) {
      throw new NotFoundException('Content', contentId);
    }

    // Record the view
    await prisma.contentView.create({
      data: {
        contentId,
        userId,
        ipAddress,
        userAgent,
      },
    });

    // Increment view count on content
    await contentRepository.incrementViewCount(contentId);

    // Publish analytics event
    await kafkaService.publishContentViewed(contentId, {
      contentId,
      userId,
      timestamp: new Date(),
    });

    logger.debug({ contentId, userId }, 'View tracked');
  }

  /**
   * Track a content like
   */
  async trackLike(contentId: string, userId: string): Promise<boolean> {
    // Verify content exists
    const exists = await contentRepository.exists(contentId);
    if (!exists) {
      throw new NotFoundException('Content', contentId);
    }

    // Check if already liked
    const existingLike = await prisma.contentLike.findUnique({
      where: {
        contentId_userId: { contentId, userId },
      },
    });

    if (existingLike) {
      // Unlike
      await prisma.contentLike.delete({
        where: {
          contentId_userId: { contentId, userId },
        },
      });
      await contentRepository.decrementLikeCount(contentId);
      logger.debug({ contentId, userId }, 'Content unliked');
      return false;
    } else {
      // Like
      await prisma.contentLike.create({
        data: { contentId, userId },
      });
      await contentRepository.incrementLikeCount(contentId);
      
      // Publish event
      await kafkaService.publishContentLiked(contentId, {
        contentId,
        userId,
        timestamp: new Date(),
      });

      logger.debug({ contentId, userId }, 'Content liked');
      return true;
    }
  }

  /**
   * Check if user has liked content
   */
  async hasLiked(contentId: string, userId: string): Promise<boolean> {
    const like = await prisma.contentLike.findUnique({
      where: {
        contentId_userId: { contentId, userId },
      },
    });
    return !!like;
  }

  /**
   * Track a content share
   */
  async trackShare(contentId: string): Promise<void> {
    const exists = await contentRepository.exists(contentId);
    if (!exists) {
      throw new NotFoundException('Content', contentId);
    }

    await contentRepository.incrementShareCount(contentId);
    logger.debug({ contentId }, 'Share tracked');
  }

  /**
   * Get analytics for a specific content
   */
  async getContentAnalytics(
    contentId: string,
    days = 30
  ): Promise<ContentAnalytics> {
    const content = await contentRepository.findById(contentId);
    if (!content) {
      throw new NotFoundException('Content', contentId);
    }

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get views by day
    const viewsByDay = await prisma.$queryRaw<Array<{ date: string; count: bigint }>>`
      SELECT DATE(viewed_at) as date, COUNT(*) as count
      FROM content_views
      WHERE content_id = ${contentId}
        AND viewed_at >= ${startDate}
      GROUP BY DATE(viewed_at)
      ORDER BY date ASC
    `;

    // Get unique views
    const uniqueViews = await prisma.contentView.groupBy({
      by: ['userId'],
      where: {
        contentId,
        userId: { not: null },
      },
    });

    // Get comment count
    const commentCount = await prisma.comment.count({
      where: { contentId, isApproved: true },
    });

    return {
      contentId,
      totalViews: content.viewCount,
      uniqueViews: uniqueViews.length,
      totalLikes: content.likeCount,
      totalShares: content.shareCount,
      totalComments: commentCount,
      viewsByDay: viewsByDay.map((v) => ({
        date: v.date,
        count: Number(v.count),
      })),
    };
  }

  /**
   * Get overall analytics
   */
  async getOverallAnalytics(): Promise<OverallAnalytics> {
    const stats = await contentRepository.getStats();

    // Get total comments
    const totalComments = await prisma.comment.count({
      where: { isApproved: true },
    });

    // Get total shares
    const sharesResult = await prisma.content.aggregate({
      _sum: { shareCount: true },
    });

    // Get top content
    const topContent = await prisma.content.findMany({
      where: { deletedAt: null, status: 'published' },
      select: { id: true, title: true, viewCount: true, likeCount: true },
      orderBy: { viewCount: 'desc' },
      take: 10,
    });

    // Get recent activity (recent content)
    const recentContent = await prisma.content.findMany({
      where: { deletedAt: null },
      select: { id: true, title: true, createdAt: true, status: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    return {
      totalContent: stats.total,
      totalViews: stats.totalViews,
      totalLikes: stats.totalLikes,
      totalShares: sharesResult._sum.shareCount || 0,
      totalComments,
      topContent: topContent.map((c) => ({
        id: c.id,
        title: c.title,
        views: c.viewCount,
        likes: c.likeCount,
      })),
      contentByType: stats.byType,
      recentActivity: recentContent.map((c) => ({
        type: c.status === 'published' ? 'published' : 'created',
        contentId: c.id,
        title: c.title,
        timestamp: c.createdAt,
      })),
    };
  }

  /**
   * Get trending content (based on recent views)
   */
  async getTrendingContent(limit = 10): Promise<
    Array<{ id: string; title: string; recentViews: number }>
  > {
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);

    const trending = await prisma.$queryRaw<
      Array<{ content_id: string; view_count: bigint }>
    >`
      SELECT content_id, COUNT(*) as view_count
      FROM content_views
      WHERE viewed_at >= ${oneDayAgo}
      GROUP BY content_id
      ORDER BY view_count DESC
      LIMIT ${limit}
    `;

    const contentIds = trending.map((t) => t.content_id);
    const contents = await prisma.content.findMany({
      where: { id: { in: contentIds } },
      select: { id: true, title: true },
    });

    const contentMap = new Map(contents.map((c) => [c.id, c.title]));

    return trending.map((t) => ({
      id: t.content_id,
      title: contentMap.get(t.content_id) || '',
      recentViews: Number(t.view_count),
    }));
  }
}

export const analyticsService = new AnalyticsService();
