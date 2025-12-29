/**
 * Zod validation schemas for content-service
 */
import { z } from 'zod';

// Common schemas
export const uuidSchema = z.string().uuid();

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Content schemas
export const contentTypeSchema = z.enum(['blog', 'article', 'news']);
export const contentStatusSchema = z.enum(['draft', 'review', 'published', 'archived']);

export const createContentSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().min(1),
  contentType: contentTypeSchema,
  excerpt: z.string().max(500).optional(),
  categoryId: uuidSchema.optional(),
  tagIds: z.array(uuidSchema).optional(),
  featuredImage: z.string().url().optional(),
  featuredImageAlt: z.string().max(200).optional(),
  metaTitle: z.string().max(60).optional(),
  metaDescription: z.string().max(160).optional(),
  metaKeywords: z.array(z.string()).optional(),
  scheduledAt: z.string().datetime().optional(),
  isFeatured: z.boolean().optional(),
  allowComments: z.boolean().optional(),
  customFields: z.record(z.unknown()).optional(),
});

export const updateContentSchema = createContentSchema.partial().extend({
  status: contentStatusSchema.optional(),
});

export const contentFiltersSchema = z.object({
  contentType: contentTypeSchema.optional(),
  status: contentStatusSchema.optional(),
  authorId: uuidSchema.optional(),
  categoryId: uuidSchema.optional(),
  tagIds: z.array(uuidSchema).optional(),
  isFeatured: z.coerce.boolean().optional(),
  isTrending: z.coerce.boolean().optional(),
  publishedAfter: z.string().datetime().optional(),
  publishedBefore: z.string().datetime().optional(),
  search: z.string().optional(),
});

export const contentListSchema = paginationSchema.merge(
  z.object({
    filters: contentFiltersSchema.optional(),
  })
);

// Category schemas
export const createCategorySchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  parentId: uuidSchema.optional(),
  icon: z.string().optional(),
  sortOrder: z.number().int().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

// Tag schemas
export const createTagSchema = z.object({
  name: z.string().min(1).max(50),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
});

export const updateTagSchema = createTagSchema.partial();

// Comment schemas
export const createCommentSchema = z.object({
  contentId: uuidSchema,
  body: z.string().min(1).max(2000),
  parentId: uuidSchema.optional(),
});

export const updateCommentSchema = z.object({
  body: z.string().min(1).max(2000),
});

// Media schemas
export const uploadMediaSchema = z.object({
  altText: z.string().max(200).optional(),
});

// Search schemas
export const searchContentSchema = z.object({
  query: z.string().min(1).max(200),
  contentTypes: z.array(contentTypeSchema).optional(),
  categoryIds: z.array(uuidSchema).optional(),
  tagIds: z.array(uuidSchema).optional(),
  ...paginationSchema.shape,
});

// Analytics schemas
export const trackViewSchema = z.object({
  contentId: uuidSchema,
});

export const dateRangeSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
});

// Type exports
export type CreateContentInput = z.infer<typeof createContentSchema>;
export type UpdateContentInput = z.infer<typeof updateContentSchema>;
export type ContentFiltersInput = z.infer<typeof contentFiltersSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type SearchContentInput = z.infer<typeof searchContentSchema>;
