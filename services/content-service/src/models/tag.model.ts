// Tag model

import { BaseModel } from './base.model';

export interface Tag extends BaseModel {
  name: string;
  slug: string;
  description: string | null;
  usage_count: number;
}

export interface CreateTagDTO {
  name: string;
  slug?: string;
  description?: string;
}

export interface UpdateTagDTO {
  name?: string;
  slug?: string;
  description?: string;
}

export interface TagFilter {
  search?: string;
  minUsageCount?: number;
}
