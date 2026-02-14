// Analytics Service - Track views, engagement, and usage
import { query } from '../config/database';

export interface AnalyticsEvent {
  content_id?: number;
  tutorial_id?: number;
  user_id?: number;
  ip_address?: string;
  user_agent?: string;
  referrer?: string;
  session_id?: string;
}

export interface ContentStats {
  total_views: number;
  total_likes: number;
  total_comments: number;
  views_today: number;
  views_this_week: number;
  views_this_month: number;
}

export interface OverallStats {
  total_content: number;
  total_tutorials: number;
  total_views: number;
  total_comments: number;
  published_content: number;
  draft_content: number;
}

export class AnalyticsService {
  /**
   * Track content view
   */
  async trackContentView(event: AnalyticsEvent): Promise<void> {
    if (!event.content_id) return;

    await query(
      `INSERT INTO content_views (content_id, user_id, ip_address, user_agent, referrer, session_id)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        event.content_id,
        event.user_id || null,
        event.ip_address || null,
        event.user_agent || null,
        event.referrer || null,
        event.session_id || null,
      ]
    );

    // Update view count on content
    await query(`UPDATE content SET view_count = view_count + 1 WHERE id = $1`, [event.content_id]);
  }

  /**
   * Track content like
   */
  async trackContentLike(contentId: number, userId: number): Promise<boolean> {
    try {
      await query(`INSERT INTO content_likes (content_id, user_id) VALUES ($1, $2)`, [
        contentId,
        userId,
      ]);

      await query(`UPDATE content SET like_count = like_count + 1 WHERE id = $1`, [contentId]);

      return true;
    } catch (error: any) {
      // Unique constraint violation - already liked
      if (error.code === '23505') {
        return false;
      }
      throw error;
    }
  }

  /**
   * Remove content like
   */
  async removeContentLike(contentId: number, userId: number): Promise<boolean> {
    const result = await query(`DELETE FROM content_likes WHERE content_id = $1 AND user_id = $2`, [
      contentId,
      userId,
    ]);

    if ((result.rowCount || 0) > 0) {
      await query(`UPDATE content SET like_count = GREATEST(0, like_count - 1) WHERE id = $1`, [
        contentId,
      ]);
      return true;
    }

    return false;
  }

  /**
   * Check if user liked content
   */
  async hasUserLiked(contentId: number, userId: number): Promise<boolean> {
    const result = await query<{ exists: boolean }>(
      `SELECT EXISTS(SELECT 1 FROM content_likes WHERE content_id = $1 AND user_id = $2)`,
      [contentId, userId]
    );
    return result.rows[0].exists;
  }

  /**
   * Get content stats
   */
  async getContentStats(contentId: number): Promise<ContentStats> {
    const result = await query<ContentStats>(
      `SELECT 
         c.view_count as total_views,
         c.like_count as total_likes,
         c.comment_count as total_comments,
         (SELECT COUNT(*) FROM content_views WHERE content_id = $1 AND created_at >= CURRENT_DATE) as views_today,
         (SELECT COUNT(*) FROM content_views WHERE content_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '7 days') as views_this_week,
         (SELECT COUNT(*) FROM content_views WHERE content_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '30 days') as views_this_month
       FROM content c
       WHERE c.id = $1`,
      [contentId]
    );

    return (
      result.rows[0] || {
        total_views: 0,
        total_likes: 0,
        total_comments: 0,
        views_today: 0,
        views_this_week: 0,
        views_this_month: 0,
      }
    );
  }

  /**
   * Get overall stats
   */
  async getOverallStats(): Promise<OverallStats> {
    const result = await query<OverallStats>(
      `SELECT 
         (SELECT COUNT(*) FROM content) as total_content,
         (SELECT COUNT(*) FROM tutorials) as total_tutorials,
         (SELECT COALESCE(SUM(view_count), 0) FROM content) as total_views,
         (SELECT COUNT(*) FROM comments) as total_comments,
         (SELECT COUNT(*) FROM content WHERE status = 'published') as published_content,
         (SELECT COUNT(*) FROM content WHERE status = 'draft') as draft_content`
    );

    return result.rows[0];
  }

  /**
   * Get popular content
   */
  async getPopularContent(
    period: 'day' | 'week' | 'month' | 'all' = 'week',
    limit: number = 10
  ): Promise<{ content_id: number; views: number }[]> {
    let dateFilter = '';
    switch (period) {
      case 'day':
        dateFilter = 'AND cv.created_at >= CURRENT_DATE';
        break;
      case 'week':
        dateFilter = "AND cv.created_at >= CURRENT_DATE - INTERVAL '7 days'";
        break;
      case 'month':
        dateFilter = "AND cv.created_at >= CURRENT_DATE - INTERVAL '30 days'";
        break;
    }

    const result = await query<{ content_id: number; views: string }>(
      `SELECT cv.content_id, COUNT(*) as views
       FROM content_views cv
       INNER JOIN content c ON cv.content_id = c.id
       WHERE c.status = 'published' ${dateFilter}
       GROUP BY cv.content_id
       ORDER BY views DESC
       LIMIT $1`,
      [limit]
    );

    return result.rows.map((row) => ({
      content_id: row.content_id,
      views: parseInt(row.views, 10),
    }));
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
