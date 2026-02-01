/**
 * Utility functions for content-service
 */
import slugify from 'slugify';
import { PaginationMeta, PaginationParams } from '../interfaces';

/**
 * Convert camelCase to snake_case
 * Used for converting frontend sort field names to database column names
 */
export function camelToSnakeCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

/**
 * Map of allowed sort fields (camelCase -> snake_case)
 */
export const SORT_FIELD_MAP: Record<string, string> = {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  publishedAt: 'published_at',
  viewCount: 'view_count',
  likeCount: 'like_count',
  commentCount: 'comment_count',
  readingTime: 'reading_time',
  title: 'title',
  slug: 'slug',
  id: 'id',
};

/**
 * Normalize sort field to snake_case database column
 */
export function normalizeSortField(
  field: string,
  allowedFields: string[] = Object.keys(SORT_FIELD_MAP)
): string {
  // If already snake_case, return as-is
  if (field.includes('_')) return field;

  // Check if it's a known field mapping
  if (SORT_FIELD_MAP[field]) return SORT_FIELD_MAP[field];

  // Fallback: convert camelCase to snake_case
  return camelToSnakeCase(field);
}

/**
 * Generate a URL-friendly slug from text
 */
export function generateSlug(text: string): string {
  return slugify(text, {
    lower: true,
    strict: true,
    trim: true,
  });
}

/**
 * Calculate reading time based on word count
 * Average reading speed: 200 words per minute
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Build pagination metadata
 */
export function buildPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}

/**
 * Normalize pagination params with defaults
 */
export function normalizePagination(params: PaginationParams): Required<PaginationParams> {
  return {
    page: Math.max(1, params.page || 1),
    limit: Math.min(100, Math.max(1, params.limit || 10)),
    sortBy: normalizeSortField(params.sortBy || 'created_at'),
    sortOrder: params.sortOrder || 'desc',
  };
}

/**
 * Strip HTML tags from text
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

/**
 * Generate excerpt from body if not provided
 */
export function generateExcerpt(body: string, maxLength = 160): string {
  const plainText = stripHtml(body);
  return truncateText(plainText, maxLength);
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Remove undefined values from object
 */
export function removeUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined)) as Partial<T>;
}

/**
 * Check if string is valid UUID
 */
export function isValidUuid(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

/**
 * Sleep for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Generate unique slug by appending random suffix if needed
 */
export function generateUniqueSlug(text: string, suffix?: string): string {
  const baseSlug = generateSlug(text);
  if (suffix) {
    return `${baseSlug}-${suffix}`;
  }
  return baseSlug;
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
