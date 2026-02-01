// Resource model

import { Author } from './author.model';
import { BaseModel } from './base.model';

export interface Resource extends BaseModel {
  slug: string;
  title: string;
  description: string | null;
  content: string | null;
  resource_type: string;
  category: string | null;
  tags: string[];
  file_url: string | null;
  file_size: number | null;
  file_type: string | null;
  thumbnail_url: string | null;
  author_id: number | null;
  is_published: boolean;
  is_featured: boolean;
  is_premium: boolean;
  download_count: number;
  view_count: number;
  rating: number;
  rating_count: number;
  meta_title: string | null;
  meta_description: string | null;
  published_at: Date | null;
}

export interface ResourceWithAuthor extends Resource {
  author?: Author | null;
}

export interface CreateResourceDTO {
  slug?: string;
  title: string;
  description?: string;
  content?: string;
  resource_type?: string;
  category?: string;
  tags?: string[];
  file_url?: string;
  file_size?: number;
  file_type?: string;
  thumbnail_url?: string;
  author_id?: number;
  is_published?: boolean;
  is_featured?: boolean;
  is_premium?: boolean;
  meta_title?: string;
  meta_description?: string;
}

export interface UpdateResourceDTO {
  slug?: string;
  title?: string;
  description?: string;
  content?: string;
  resource_type?: string;
  category?: string;
  tags?: string[];
  file_url?: string;
  file_size?: number;
  file_type?: string;
  thumbnail_url?: string;
  author_id?: number;
  is_published?: boolean;
  is_featured?: boolean;
  is_premium?: boolean;
  meta_title?: string;
  meta_description?: string;
}

export interface ResourceFilter {
  category?: string;
  resource_type?: string;
  is_published?: boolean;
  is_featured?: boolean;
  is_premium?: boolean;
  search?: string;
}
