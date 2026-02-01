// Category model

import { BaseModel } from './base.model';

export interface Category extends BaseModel {
  name: string;
  slug: string;
  description: string | null;
  parent_id: number | null;
  icon: string | null;
  color: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface CategoryWithChildren extends Category {
  children?: CategoryWithChildren[];
}

export interface CreateCategoryDTO {
  name: string;
  slug?: string;
  description?: string;
  parent_id?: number;
  icon?: string;
  color?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateCategoryDTO {
  name?: string;
  slug?: string;
  description?: string;
  parent_id?: number | null;
  icon?: string;
  color?: string;
  sort_order?: number;
  is_active?: boolean;
}

export interface CategoryFilter {
  parent_id?: number | null;
  is_active?: boolean;
}
