// Content model

import { Author } from './author.model';
import { BaseModel } from './base.model';
import { Category } from './category.model';
import { Tag } from './tag.model';

export type ContentType = 'blog' | 'article' | 'news';
export type ContentStatus = 'draft' | 'review' | 'published' | 'archived';

export interface Content extends BaseModel {
  title: string;
  slug: string;
  excerpt: string | null;
  body: string;
  content_type: ContentType;
  status: ContentStatus;
  featured_image: string | null;
  author_id: number | null;
  category_id: number | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  is_featured: boolean;
  is_trending: boolean;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  reading_time: number;
  published_at: Date | null;
}

export interface ContentWithRelations extends Content {
  author?: Author | null;
  category?: Category | null;
  tags?: Tag[];
}

export interface CreateContentDTO {
  title: string;
  slug?: string;
  excerpt?: string;
  body: string;
  content_type?: ContentType;
  status?: ContentStatus;
  featured_image?: string;
  author_id?: number;
  category_id?: number;
  tag_ids?: number[];
  is_featured?: boolean;
  is_trending?: boolean;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export interface UpdateContentDTO {
  title?: string;
  slug?: string;
  excerpt?: string;
  body?: string;
  content_type?: ContentType;
  status?: ContentStatus;
  featured_image?: string;
  author_id?: number;
  category_id?: number;
  tag_ids?: number[];
  is_featured?: boolean;
  is_trending?: boolean;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
}

export interface ContentFilter {
  type?: ContentType;
  status?: ContentStatus;
  categoryId?: number;
  authorId?: number;
  tagIds?: number[];
  search?: string;
  isFeatured?: boolean;
  isTrending?: boolean;
}

export interface ContentView {
  id: number;
  content_id: number;
  user_id: number | null;
  ip_address: string | null;
  user_agent: string | null;
  referrer: string | null;
  session_id: string | null;
  created_at: Date;
}

export interface ContentLike {
  id: number;
  content_id: number;
  user_id: number;
  created_at: Date;
}
