/**
 * Content Service API Client
 * API client for the content-service microservice
 */

import axios from 'axios';
import type {
  ApiResponse,
  Category,
  CategoryWithChildren,
  Comment,
  CommentWithReplies,
  ContentAnalytics,
  ContentFilters,
  ContentWithRelations,
  CreateCategoryInput,
  CreateCommentInput,
  CreateContentInput,
  CreateTagInput,
  LikeResponse,
  MediaAsset,
  OverallAnalytics,
  PaginationMeta,
  SearchParams,
  Tag,
  UpdateCategoryInput,
  UpdateCommentInput,
  UpdateContentInput,
  UpdateTagInput
} from './content-types';
import logger from './logger';

const CONTENT_API_URL = process.env.NEXT_PUBLIC_CONTENT_API_URL || 'http://localhost:8083/api/v1';

/**
 * Axios instance for Content Service
 */
export const contentClient = axios.create({
  baseURL: CONTENT_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor - add auth token
contentClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    logger.debug(`Content API: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - log errors
contentClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const errorMessage = error.response?.data?.error?.message || error.message;
    const enhancedError = new Error(errorMessage);
    enhancedError.name = `ContentAPIError[${error.response?.status || 'Unknown'}]`;
    
    logger.error('Content API Error', enhancedError, {
      url: error.config?.url || 'unknown',
      status: error.response?.status?.toString() || 'unknown',
    });
    return Promise.reject(error);
  }
);

// ============================================================================
// Categories API
// ============================================================================

export const categoriesApi = {
  /**
   * Get all categories
   */
  async getAll(activeOnly = true): Promise<Category[]> {
    const response = await contentClient.get<ApiResponse<Category[]>>('/categories', {
      params: { active: activeOnly },
    });
    return response.data.data;
  },

  /**
   * Get category tree (hierarchical)
   */
  async getTree(): Promise<CategoryWithChildren[]> {
    const response = await contentClient.get<ApiResponse<CategoryWithChildren[]>>('/categories/tree');
    return response.data.data;
  },

  /**
   * Get category by ID
   */
  async getById(id: string): Promise<Category> {
    const response = await contentClient.get<ApiResponse<Category>>(`/categories/${id}`);
    return response.data.data;
  },

  /**
   * Get category by slug
   */
  async getBySlug(slug: string): Promise<Category> {
    const response = await contentClient.get<ApiResponse<Category>>(`/categories/slug/${slug}`);
    return response.data.data;
  },

  /**
   * Create category (admin only)
   */
  async create(data: CreateCategoryInput): Promise<Category> {
    const response = await contentClient.post<ApiResponse<Category>>('/categories', data);
    return response.data.data;
  },

  /**
   * Update category (admin only)
   */
  async update(id: string, data: UpdateCategoryInput): Promise<Category> {
    const response = await contentClient.patch<ApiResponse<Category>>(`/categories/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete category (admin only)
   */
  async delete(id: string): Promise<void> {
    await contentClient.delete(`/categories/${id}`);
  },
};

// ============================================================================
// Tags API
// ============================================================================

export const tagsApi = {
  /**
   * Get all tags
   */
  async getAll(): Promise<Tag[]> {
    const response = await contentClient.get<ApiResponse<Tag[]>>('/tags');
    return response.data.data;
  },

  /**
   * Get popular tags
   */
  async getPopular(limit = 10): Promise<Tag[]> {
    const response = await contentClient.get<ApiResponse<Tag[]>>('/tags/popular', {
      params: { limit },
    });
    return response.data.data;
  },

  /**
   * Search tags
   */
  async search(query: string, limit = 20): Promise<Tag[]> {
    const response = await contentClient.get<ApiResponse<Tag[]>>('/tags/search', {
      params: { q: query, limit },
    });
    return response.data.data;
  },

  /**
   * Get tag by ID
   */
  async getById(id: string): Promise<Tag> {
    const response = await contentClient.get<ApiResponse<Tag>>(`/tags/${id}`);
    return response.data.data;
  },

  /**
   * Get tag by slug
   */
  async getBySlug(slug: string): Promise<Tag> {
    const response = await contentClient.get<ApiResponse<Tag>>(`/tags/slug/${slug}`);
    return response.data.data;
  },

  /**
   * Create tag (admin only)
   */
  async create(data: CreateTagInput): Promise<Tag> {
    const response = await contentClient.post<ApiResponse<Tag>>('/tags', data);
    return response.data.data;
  },

  /**
   * Update tag (admin only)
   */
  async update(id: string, data: UpdateTagInput): Promise<Tag> {
    const response = await contentClient.patch<ApiResponse<Tag>>(`/tags/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete tag (admin only)
   */
  async delete(id: string): Promise<void> {
    await contentClient.delete(`/tags/${id}`);
  },
};

// ============================================================================
// Content API
// ============================================================================

export const contentApi = {
  /**
   * Get paginated content list
   */
  async getAll(filters: ContentFilters = {}): Promise<{
    data: ContentWithRelations[];
    meta: PaginationMeta;
  }> {
    const response = await contentClient.get<ApiResponse<ContentWithRelations[]>>('/content', {
      params: filters,
    });
    return {
      data: response.data.data,
      meta: response.data.meta!,
    };
  },

  /**
   * Get featured content
   */
  async getFeatured(limit = 5): Promise<ContentWithRelations[]> {
    const response = await contentClient.get<ApiResponse<ContentWithRelations[]>>('/content/featured', {
      params: { limit },
    });
    return response.data.data;
  },

  /**
   * Get trending content
   */
  async getTrending(limit = 10): Promise<ContentWithRelations[]> {
    const response = await contentClient.get<ApiResponse<ContentWithRelations[]>>('/content/trending', {
      params: { limit },
    });
    return response.data.data;
  },

  /**
   * Get recent content by type
   */
  async getRecent(type: string, limit = 10): Promise<ContentWithRelations[]> {
    const response = await contentClient.get<ApiResponse<ContentWithRelations[]>>(`/content/recent/${type}`, {
      params: { limit },
    });
    return response.data.data;
  },

  /**
   * Get content by ID
   */
  async getById(id: string): Promise<ContentWithRelations> {
    const response = await contentClient.get<ApiResponse<ContentWithRelations>>(`/content/${id}`);
    return response.data.data;
  },

  /**
   * Get content by slug
   */
  async getBySlug(slug: string): Promise<ContentWithRelations> {
    const response = await contentClient.get<ApiResponse<ContentWithRelations>>(`/content/slug/${slug}`);
    return response.data.data;
  },

  /**
   * Create content
   */
  async create(data: CreateContentInput): Promise<ContentWithRelations> {
    const response = await contentClient.post<ApiResponse<ContentWithRelations>>('/content', data);
    return response.data.data;
  },

  /**
   * Update content
   */
  async update(id: string, data: UpdateContentInput): Promise<ContentWithRelations> {
    const response = await contentClient.patch<ApiResponse<ContentWithRelations>>(`/content/${id}`, data);
    return response.data.data;
  },

  /**
   * Publish content
   */
  async publish(id: string): Promise<ContentWithRelations> {
    const response = await contentClient.post<ApiResponse<ContentWithRelations>>(`/content/${id}/publish`);
    return response.data.data;
  },

  /**
   * Unpublish content
   */
  async unpublish(id: string): Promise<ContentWithRelations> {
    const response = await contentClient.post<ApiResponse<ContentWithRelations>>(`/content/${id}/unpublish`);
    return response.data.data;
  },

  /**
   * Delete content
   */
  async delete(id: string): Promise<void> {
    await contentClient.delete(`/content/${id}`);
  },

  /**
   * Get related content
   */
  async getRelated(id: string, limit = 5): Promise<ContentWithRelations[]> {
    const response = await contentClient.get<ApiResponse<ContentWithRelations[]>>(`/content/${id}/related`, {
      params: { limit },
    });
    return response.data.data;
  },

  /**
   * Get published content (public API)
   */
  async getPublished(options: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    filters?: {
      contentType?: string;
      categoryId?: string;
      tagIds?: string[];
      search?: string;
    };
  } = {}): Promise<{
    data: ContentWithRelations[];
    meta: PaginationMeta;
  }> {
    const params: Record<string, unknown> = {
      page: options.page || 1,
      limit: options.limit || 10,
      sortBy: options.sortBy || 'publishedAt',
      sortOrder: options.sortOrder || 'desc',
      status: 'PUBLISHED',
    };

    if (options.filters) {
      if (options.filters.contentType) {
        params.type = options.filters.contentType;
      }
      if (options.filters.categoryId) {
        params.categoryId = options.filters.categoryId;
      }
      if (options.filters.tagIds?.length) {
        params.tagIds = options.filters.tagIds.join(',');
      }
      if (options.filters.search) {
        params.search = options.filters.search;
      }
    }

    const response = await contentClient.get<ApiResponse<ContentWithRelations[]>>('/content', {
      params,
    });
    return {
      data: response.data.data,
      meta: response.data.meta!,
    };
  },

  /**
   * Track content view
   */
  async trackView(id: string): Promise<void> {
    await contentClient.post(`/content/${id}/view`);
  },

  /**
   * Like content
   */
  async like(id: string): Promise<LikeResponse> {
    const response = await contentClient.post<ApiResponse<LikeResponse>>(`/content/${id}/like`);
    return response.data.data;
  },

  /**
   * Unlike content
   */
  async unlike(id: string): Promise<LikeResponse> {
    const response = await contentClient.delete<ApiResponse<LikeResponse>>(`/content/${id}/like`);
    return response.data.data;
  },
};

// ============================================================================
// Comments API
// ============================================================================

export const commentsApi = {
  /**
   * Get comments for content
   */
  async getByContent(contentId: string): Promise<{
    data: CommentWithReplies[];
    meta?: PaginationMeta;
  }> {
    const response = await contentClient.get<ApiResponse<CommentWithReplies[]>>(`/comments/content/${contentId}`);
    return {
      data: response.data.data || [],
      meta: response.data.meta,
    };
  },

  /**
   * Create comment
   */
  async create(data: CreateCommentInput): Promise<Comment> {
    const response = await contentClient.post<ApiResponse<Comment>>('/comments', data);
    return response.data.data;
  },

  /**
   * Update comment
   */
  async update(id: string, data: UpdateCommentInput): Promise<Comment> {
    const response = await contentClient.patch<ApiResponse<Comment>>(`/comments/${id}`, data);
    return response.data.data;
  },

  /**
   * Delete comment
   */
  async delete(id: string): Promise<void> {
    await contentClient.delete(`/comments/${id}`);
  },

  /**
   * Get pending moderation (admin)
   */
  async getPending(): Promise<Comment[]> {
    const response = await contentClient.get<ApiResponse<Comment[]>>('/comments/moderation');
    return response.data.data;
  },

  /**
   * Approve comment (admin)
   */
  async approve(id: string): Promise<Comment> {
    const response = await contentClient.post<ApiResponse<Comment>>(`/comments/${id}/approve`);
    return response.data.data;
  },

  /**
   * Flag comment (admin)
   */
  async flag(id: string): Promise<Comment> {
    const response = await contentClient.post<ApiResponse<Comment>>(`/comments/${id}/flag`);
    return response.data.data;
  },
};

// ============================================================================
// Search API
// ============================================================================

export const searchApi = {
  /**
   * Search content
   */
  async search(params: SearchParams): Promise<{
    data: ContentWithRelations[];
    meta: PaginationMeta;
  }> {
    const response = await contentClient.get<ApiResponse<ContentWithRelations[]>>('/search', {
      params,
    });
    return {
      data: response.data.data,
      meta: response.data.meta!,
    };
  },

  /**
   * Get search suggestions
   */
  async suggest(query: string, limit = 5): Promise<string[]> {
    const response = await contentClient.get<ApiResponse<string[]>>('/search/suggest', {
      params: { query, limit },
    });
    return response.data.data;
  },

  /**
   * Get popular searches
   */
  async getPopular(limit = 10): Promise<Array<{ query: string; count: number }>> {
    const response = await contentClient.get<ApiResponse<Array<{ query: string; count: number }>>>('/search/popular', {
      params: { limit },
    });
    return response.data.data;
  },
};

// ============================================================================
// Analytics API
// ============================================================================

export const analyticsApi = {
  /**
   * Track content view
   */
  async trackView(contentId: string, referrer?: string): Promise<void> {
    await contentClient.post(`/analytics/view/${contentId}`, { referrer });
  },

  /**
   * Toggle like
   */
  async toggleLike(contentId: string): Promise<LikeResponse> {
    const response = await contentClient.post<ApiResponse<LikeResponse>>(`/analytics/like/${contentId}`);
    return response.data.data;
  },

  /**
   * Track share
   */
  async trackShare(contentId: string, platform: string): Promise<void> {
    await contentClient.post(`/analytics/share/${contentId}`, { platform });
  },

  /**
   * Get content analytics
   */
  async getContentAnalytics(contentId: string): Promise<ContentAnalytics> {
    const response = await contentClient.get<ApiResponse<ContentAnalytics>>(`/analytics/content/${contentId}`);
    return response.data.data;
  },

  /**
   * Get overall analytics (admin)
   */
  async getOverview(): Promise<OverallAnalytics> {
    const response = await contentClient.get<ApiResponse<OverallAnalytics>>('/analytics/overview');
    return response.data.data;
  },
};

// ============================================================================
// Media API
// ============================================================================

export const mediaApi = {
  /**
   * Upload image
   */
  async upload(file: File): Promise<MediaAsset> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await contentClient.post<ApiResponse<MediaAsset>>('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data;
  },

  /**
   * Get user's media assets
   */
  async getMyAssets(): Promise<MediaAsset[]> {
    const response = await contentClient.get<ApiResponse<MediaAsset[]>>('/media/my');
    return response.data.data;
  },

  /**
   * Get all media (admin)
   */
  async getAll(): Promise<MediaAsset[]> {
    const response = await contentClient.get<ApiResponse<MediaAsset[]>>('/media');
    return response.data.data;
  },

  /**
   * Delete media
   */
  async delete(id: string): Promise<void> {
    await contentClient.delete(`/media/${id}`);
  },
};

// ============================================================================
// Tutorials API
// ============================================================================

export interface Tutorial {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  color_theme: string;
  estimated_hours: number;
  is_published: boolean;
  sections_count: number;
  stats?: {
    total_topics?: number;
    total_read_time?: number;
    completion_rate?: number;
  } | null;
  display_order?: number;
  created_at?: string;
}

export interface TutorialSection {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  display_order: number;
  topics_count: number;
  topics: TutorialTopic[];
}

export interface TutorialTopic {
  id: string;
  slug: string;
  title: string;
  estimated_read_time: number;
  has_audio: boolean;
  has_video: boolean;
  display_order: number;
}

export interface TutorialWithSections extends Tutorial {
  meta_tags: Record<string, unknown> | null;
  sections: TutorialSection[];
}

export const tutorialsApi = {
  /**
   * Get all tutorials
   */
  async getAll(publishedOnly = true): Promise<Tutorial[]> {
    const response = await contentClient.get<ApiResponse<Tutorial[]>>('/tutorials', {
      params: { published: publishedOnly },
    });
    return response.data.data;
  },

  /**
   * Get tutorial by slug with sections
   */
  async getBySlug(slug: string): Promise<TutorialWithSections> {
    const response = await contentClient.get<ApiResponse<TutorialWithSections>>(`/tutorials/${slug}`);
    return response.data.data;
  },
};

// Export combined API
export const contentServiceApi = {
  categories: categoriesApi,
  tags: tagsApi,
  content: contentApi,
  comments: commentsApi,
  search: searchApi,
  analytics: analyticsApi,
  media: mediaApi,
  tutorials: tutorialsApi,
};

export default contentServiceApi;
