/**
 * Content Service API Types
 * Types for the content-service microservice
 */

// Enums
export type ContentType = 'BLOG' | 'ARTICLE' | 'NEWS';
export type ContentStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';

// Base interfaces
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Category
export interface Category extends BaseEntity {
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  parentId: string | null;
  isActive: boolean;
  sortOrder: number;
}

export interface CategoryWithChildren extends Category {
  children: CategoryWithChildren[];
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
  icon?: string;
  parentId?: string;
  sortOrder?: number;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  isActive?: boolean;
}

// Tag
export interface Tag extends BaseEntity {
  name: string;
  slug: string;
  description: string | null;
  _count?: {
    contents: number;
  };
}

export interface CreateTagInput {
  name: string;
  description?: string;
}

export type UpdateTagInput = Partial<CreateTagInput>;

// Author
export interface Author extends BaseEntity {
  userId: string;
  bio: string | null;
  avatarUrl: string | null;
  socialLinks: Record<string, string>;
  isVerified: boolean;
}

// Content
export interface Content extends BaseEntity {
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  type: ContentType;
  status: ContentStatus;
  authorId: string;
  categoryId: string | null;
  featuredImageUrl: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  isFeatured: boolean;
  readingTime: number;
  readingTimeMinutes?: number;
  viewCount: number;
  likeCount: number;
  shareCount?: number;
  commentCount: number;
  publishedAt: string | null;
}

export interface ContentWithRelations extends Content {
  author: Author;
  category: Category | null;
  tags: Tag[];
}

export interface CreateContentInput {
  title: string;
  body: string;
  type: ContentType;
  excerpt?: string;
  categoryId?: string;
  tagIds?: string[];
  featuredImageUrl?: string;
  metaTitle?: string;
  metaDescription?: string;
}

export interface UpdateContentInput extends Partial<CreateContentInput> {
  isFeatured?: boolean;
}

export interface ContentFilters {
  page?: number;
  limit?: number;
  type?: ContentType;
  categoryId?: string;
  tagIds?: string[];
  status?: ContentStatus;
  authorId?: string;
  sortBy?: 'createdAt' | 'publishedAt' | 'viewCount' | 'likeCount';
  sortOrder?: 'asc' | 'desc';
}

// Comment
export interface Comment extends BaseEntity {
  contentId: string;
  userId: string;
  authorId?: string; // Deprecated: use userId instead
  author?: Pick<Author, 'userId' | 'bio' | 'avatarUrl'>; // Optional populated author
  parentId: string | null;
  body: string;
  isApproved: boolean;
  isFlagged: boolean;
  isEdited?: boolean;
  likeCount?: number;
}

export interface CommentWithReplies extends Comment {
  replies: CommentWithReplies[];
}

export interface CreateCommentInput {
  contentId: string;
  body: string;
  parentId?: string;
}

export interface UpdateCommentInput {
  body: string;
}

// Search
export interface SearchParams {
  query: string;
  type?: ContentType;
  categoryId?: string;
  tags?: string[];
  page?: number;
  limit?: number;
}

export interface SearchSuggestion {
  text: string;
  type: 'title' | 'tag' | 'category';
}

// Analytics
export interface ContentAnalytics {
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  viewsOverTime: Array<{
    date: string;
    count: number;
  }>;
}

export interface OverallAnalytics {
  totalContent: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  contentByType: Record<ContentType, number>;
  topContent: ContentWithRelations[];
}

// Media
export interface MediaAsset extends BaseEntity {
  authorId: string;
  filename: string;
  originalFilename: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
}

// API Response types
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

// Like response
export interface LikeResponse {
  liked: boolean;
}
