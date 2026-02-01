/**
 * Content-related interfaces
 */
import { ContentStatus, ContentType } from '@models/content.model';
import { BaseEntity, PaginationParams } from './base.interface';

export interface ContentBase extends BaseEntity {
  title: string;
  slug: string;
  excerpt?: string;
  body: string;
  contentType: ContentType;
  status: ContentStatus;
  authorId: string;
  categoryId?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords: string[];
  publishedAt?: Date;
  scheduledAt?: Date;
  viewCount: number;
  likeCount: number;
  shareCount: number;
  readingTimeMinutes?: number;
  isFeatured: boolean;
  isTrending: boolean;
  allowComments: boolean;
  customFields: Record<string, unknown>;
}

export interface ContentWithRelations extends ContentBase {
  author: AuthorSummary;
  category?: CategorySummary;
  tags: TagSummary[];
}

export interface AuthorSummary {
  id: string;
  name: string;
  avatarUrl?: string;
}

export interface CategorySummary {
  id: string;
  name: string;
  slug: string;
}

export interface TagSummary {
  id: string;
  name: string;
  slug: string;
  color: string;
}

export interface CreateContentDto {
  title: string;
  body: string;
  contentType: ContentType;
  excerpt?: string;
  categoryId?: string;
  tagIds?: string[];
  featuredImage?: string;
  featuredImageAlt?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  scheduledAt?: string;
  isFeatured?: boolean;
  allowComments?: boolean;
  customFields?: Record<string, unknown>;
}

export interface UpdateContentDto extends Partial<CreateContentDto> {
  status?: ContentStatus;
}

export interface ContentFilters {
  contentType?: ContentType;
  status?: ContentStatus;
  authorId?: string;
  categoryId?: string;
  tagIds?: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  publishedAfter?: Date;
  publishedBefore?: Date;
  search?: string;
}

export interface ContentListParams extends PaginationParams {
  filters?: ContentFilters;
}

export interface ContentStats {
  totalContent: number;
  publishedCount: number;
  draftCount: number;
  totalViews: number;
  totalLikes: number;
  byContentType: Record<ContentType, number>;
}
