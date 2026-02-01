// Author model

import { BaseModel } from './base.model';

export interface Author extends BaseModel {
  user_id: number | null;
  name: string;
  email: string | null;
  bio: string | null;
  avatar_url: string | null;
  website: string | null;
  social_links: Record<string, string>;
}

export interface CreateAuthorDTO {
  user_id?: number;
  name: string;
  email?: string;
  bio?: string;
  avatar_url?: string;
  website?: string;
  social_links?: Record<string, string>;
}

export interface UpdateAuthorDTO {
  name?: string;
  email?: string;
  bio?: string;
  avatar_url?: string;
  website?: string;
  social_links?: Record<string, string>;
}
