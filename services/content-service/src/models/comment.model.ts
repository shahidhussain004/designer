// Comment model

import { BaseModel } from './base.model';

export interface Comment extends BaseModel {
  content_id: number;
  parent_id: number | null;
  user_id: number | null;
  author_name: string | null;
  author_email: string | null;
  body: string;
  is_approved: boolean;
  is_spam: boolean;
  likes: number;
  ip_address: string | null;
  user_agent: string | null;
}

export interface CommentWithReplies extends Comment {
  replies?: Comment[];
}

export interface CreateCommentDTO {
  content_id: number;
  parent_id?: number;
  user_id?: number;
  author_name?: string;
  author_email?: string;
  body: string;
  ip_address?: string;
  user_agent?: string;
}

export interface UpdateCommentDTO {
  body?: string;
  is_approved?: boolean;
  is_spam?: boolean;
}

export interface CommentFilter {
  content_id?: number;
  user_id?: number;
  is_approved?: boolean;
  is_spam?: boolean;
}
