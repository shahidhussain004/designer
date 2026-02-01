// Tutorial models

import { Author } from './author.model';
import { BaseModel } from './base.model';
import { Category } from './category.model';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Tutorial extends BaseModel {
  slug: string;
  title: string;
  description: string | null;
  featured_image: string | null;
  difficulty_level: DifficultyLevel;
  estimated_time: number | null;
  author_id: number | null;
  category_id: number | null;
  is_published: boolean;
  is_featured: boolean;
  view_count: number;
  completion_count: number;
  rating: number;
  rating_count: number;
  prerequisites: string[];
  learning_outcomes: string[];
  published_at: Date | null;
}

export interface TutorialSection extends BaseModel {
  tutorial_id: number;
  slug: string;
  title: string;
  description: string | null;
  sort_order: number;
  estimated_time: number | null;
}

export interface TutorialTopic extends BaseModel {
  section_id: number;
  slug: string;
  title: string;
  content: string | null;
  code_examples: CodeExample[];
  sort_order: number;
  estimated_time: number | null;
  video_url: string | null;
}

export interface CodeExample {
  language: string;
  code: string;
  title?: string;
  description?: string;
}

export interface TutorialWithSections extends Tutorial {
  author?: Author | null;
  category?: Category | null;
  sections?: TutorialSectionWithTopics[];
}

export interface TutorialSectionWithTopics extends TutorialSection {
  topics?: TutorialTopic[];
}

export interface TutorialProgress {
  id: number;
  tutorial_id: number;
  user_id: number;
  topic_id: number | null;
  is_completed: boolean;
  progress_percentage: number;
  last_accessed_at: Date | null;
  completed_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface TutorialBookmark {
  id: number;
  tutorial_id: number;
  user_id: number;
  topic_id: number | null;
  notes: string | null;
  created_at: Date;
}

export interface CreateTutorialDTO {
  slug?: string;
  title: string;
  description?: string;
  featured_image?: string;
  difficulty_level?: DifficultyLevel;
  estimated_time?: number;
  author_id?: number;
  category_id?: number;
  is_published?: boolean;
  is_featured?: boolean;
  prerequisites?: string[];
  learning_outcomes?: string[];
}

export interface UpdateTutorialDTO {
  slug?: string;
  title?: string;
  description?: string;
  featured_image?: string;
  difficulty_level?: DifficultyLevel;
  estimated_time?: number;
  author_id?: number;
  category_id?: number;
  is_published?: boolean;
  is_featured?: boolean;
  prerequisites?: string[];
  learning_outcomes?: string[];
}

export interface CreateTutorialSectionDTO {
  tutorial_id: number;
  slug?: string;
  title: string;
  description?: string;
  sort_order?: number;
  estimated_time?: number;
}

export interface CreateTutorialTopicDTO {
  section_id: number;
  slug?: string;
  title: string;
  content?: string;
  code_examples?: CodeExample[];
  sort_order?: number;
  estimated_time?: number;
  video_url?: string;
}

export interface TutorialFilter {
  difficulty_level?: DifficultyLevel;
  category_id?: number;
  author_id?: number;
  is_published?: boolean;
  is_featured?: boolean;
  search?: string;
}
