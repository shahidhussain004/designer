'use client';

import { contentClient } from '@/lib/content-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Re-export types from content-types
import type {
  CreateCommentInput,
  Tag
} from '@/lib/content-types';

// ============================================================================
// Query Hooks - Categories
// ============================================================================

/**
 * Fetch all categories
 */
export function useCategories(activeOnly = true) {
  return useQuery({
    queryKey: ['categories', { activeOnly }],
    queryFn: async ({ signal }) => {
      const { data } = await contentClient.get('/categories', {
        params: { active: activeOnly },
        signal,
      });
      // Normalize unknown response shape without using `any`
      const body = data as unknown as Record<string, unknown>;
      if (Array.isArray(body.items)) return body.items as unknown[];
      if (Array.isArray(body.data)) return body.data as unknown[];
      return (data as unknown) as unknown[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

/**
 * Fetch category tree
 */
export function useCategoryTree() {
  return useQuery({
    queryKey: ['categories', 'tree'],
    queryFn: async ({ signal }) => {
      const { data } = await contentClient.get('/categories/tree', { signal });
      const body = data as unknown as Record<string, unknown>;
      if (Array.isArray(body.items)) return body.items as unknown[];
      if (Array.isArray(body.data)) return body.data as unknown[];
      return (data as unknown) as unknown[];
    },
    staleTime: 10 * 60 * 1000,
  });
}

// ============================================================================
// Query Hooks - Tags
// ============================================================================

/**
 * Fetch all tags
 */
export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: async ({ signal }) => {
      const { data } = await contentClient.get<{ data: Tag[] }>('/tags', { signal });
      const body = data as unknown as Record<string, unknown>;
      if (Array.isArray(body.items)) return body.items as unknown[];
      if (Array.isArray(body.data)) return body.data as unknown[];
      return [] as unknown[];
    },
    staleTime: 10 * 60 * 1000,
  });
}

/**
 * Fetch popular tags
 */
export function usePopularTags(limit = 20) {
  return useQuery({
    queryKey: ['tags', 'popular', limit],
    queryFn: async ({ signal }) => {
      const { data } = await contentClient.get(`/tags/popular/${limit}`, { signal });
      const body = data as unknown as Record<string, unknown>;
      if (Array.isArray(body.items)) return body.items as unknown[];
      if (Array.isArray(body.data)) return body.data as unknown[];
      return (data as unknown) as unknown[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

// ============================================================================
// Query Hooks - Tutorials
// ============================================================================

/**
 * Fetch all tutorials
 */
export function useTutorials(activeOnly = true) {
  return useQuery({
    queryKey: ['tutorials', { activeOnly }],
    queryFn: async ({ signal }) => {
      const { data } = await contentClient.get('/tutorials', {
        params: { active: activeOnly },
        signal,
      });
      const body = data as unknown as Record<string, unknown>;
      if (Array.isArray(body.items)) return body.items as unknown[];
      if (Array.isArray(body.data)) return body.data as unknown[];
      return (data as unknown) as unknown[];
    },
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch single tutorial by slug
 */
export function useTutorial(slug: string | null) {
  return useQuery({
    queryKey: ['tutorial', slug],
    queryFn: async ({ signal }) => {
      if (!slug) throw new Error('Tutorial slug is required');
      const { data } = await contentClient.get(`/tutorials/${slug}`, { signal });
      const body = data as unknown as Record<string, unknown>;
      return (body.data ?? data) as unknown;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Fetch tutorial by ID
 */
export function useTutorialById(id: string | number | null) {
  return useQuery({
    queryKey: ['tutorial', 'id', id],
    queryFn: async ({ signal }) => {
      if (!id) throw new Error('Tutorial ID is required');
      const { data } = await contentClient.get(`/tutorials/id/${id}`, { signal });
      const body = data as unknown as Record<string, unknown>;
      return (body.data ?? data) as unknown;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
}


// ============================================================================
// Query Hooks - Content (Generic)
// ============================================================================

/**
 * Fetch all content with filters
 */
export function useContent(filters?: { 
  type?: string; 
  categoryId?: string;
  tagIds?: string[];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: string;
  search?: string;
}) {
  return useQuery({
    queryKey: ['content', filters],
    queryFn: async ({ signal }) => {
      // Convert tagIds array to comma-separated string for API
      const params = filters ? { ...filters } : {} as Record<string, unknown>;
      if (Array.isArray(filters?.tagIds) && filters!.tagIds!.length > 0) {
        params.tagIds = (filters!.tagIds as string[]).join(',');
      }
      
      const { data } = await contentClient.get('/content', {
        params,
        signal,
      });
      // Return the full response structure with items/data and meta (use unknown-safe access)
      const body = data as unknown as Record<string, unknown>;
      const items = Array.isArray(body.items)
        ? (body.items as unknown[])
        : Array.isArray(body.data)
        ? (body.data as unknown[])
        : [];
      const respMeta = (body.meta as Record<string, unknown>) ?? {};
      const totalFromBody = (body.total as number) ?? (respMeta.total as number) ?? 0;
      const pageFromBody = (respMeta.page as number) ?? (body.page as number) ?? (params.page as number) ?? 1;
      const limitFromBody = (respMeta.limit as number) ?? (params.limit as number) ?? 10;
      const totalPagesFromBody = (respMeta.totalPages as number) ?? (limitFromBody ? Math.ceil(totalFromBody / limitFromBody) : 0);
      const hasNext = (respMeta.hasNextPage as boolean) ?? (pageFromBody < totalPagesFromBody);
      const hasPrev = (respMeta.hasPrevPage as boolean) ?? (pageFromBody > 1);

      return {
        data: items,
        meta: {
          total: totalFromBody,
          page: pageFromBody,
          limit: limitFromBody,
          totalPages: totalPagesFromBody,
          hasNextPage: hasNext,
          hasPrevPage: hasPrev,
        },
      };
    },
    staleTime: 5 * 60 * 1000,
  });
}



/**
 * Fetch single content by slug
 * Note: Despite the function name, this fetches content (articles/blogs) shown on /resources page
 */
export function useContentSlug(slug: string | null) {
  return useQuery({
    queryKey: ['contentSlug', slug],
    queryFn: async ({ signal }) => {
      if (!slug) throw new Error('Content slug is required');
      // Use content slug endpoint since resources page shows content items
      const { data } = await contentClient.get(`/content/slug/${slug}`, {
        signal,
      });
      const body = data as unknown as Record<string, unknown>;
      return (body.data ?? data) as unknown;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
}


/**
 * Search content
 */
export function useSearchContent(query: string, filters?: { type?: string; category?: string }) {
  return useQuery({
    queryKey: ['content', 'search', query, filters],
    queryFn: async ({ signal }) => {
      if (!query) return [];
      const { data } = await contentClient.get('/content/search', {
        params: { q: query, ...filters },
        signal,
      });
      const body = data as unknown as Record<string, unknown>;
      if (Array.isArray(body.items)) return body.items as unknown[];
      if (Array.isArray(body.data)) return body.data as unknown[];
      return (data as unknown) as unknown[];
    },
    enabled: query.length > 0,
    staleTime: 30 * 1000, // 30 seconds for search
  });
}

// ============================================================================
// Query Hooks - Comments
// ============================================================================

/**
 * Fetch comments for content
 */
export function useComments(contentId: string | number | null) {
  return useQuery({
    queryKey: ['comments', contentId],
    queryFn: async ({ signal }) => {
      if (!contentId) throw new Error('Content ID is required');
      const { data } = await contentClient.get(`/content/${contentId}/comments`, { signal });
      // Handle both new format (items) and old format (data)
      return (data as any).items || (data as any).data || data;
    },
    enabled: !!contentId,
    staleTime: 2 * 60 * 1000,
  });
}

// ============================================================================
// Mutation Hooks
// ============================================================================

/**
 * Like/Unlike content
 */
export function useLikeContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (contentId: number) => {
      const { data } = await contentClient.post(`/content/${contentId}/like`);
      return data;
    },
    onSuccess: (_, contentId) => {
      // Invalidate content queries
      queryClient.invalidateQueries({ queryKey: ['content'] });
      queryClient.invalidateQueries({ queryKey: ['tutorial'] });
      queryClient.invalidateQueries({ queryKey: ['resource'] });
    },
  });
}

/**
 * Create a comment
 */
export function useCreateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contentId, input }: { contentId: number; input: CreateCommentInput }) => {
      const { data } = await contentClient.post(`/content/${contentId}/comments`, input);
      return data;
    },
    onSuccess: (_, { contentId }) => {
      // Invalidate comments for this content
      queryClient.invalidateQueries({ queryKey: ['comments', contentId] });
    },
  });
}

/**
 * Update a comment
 */
export function useUpdateComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      commentId, 
      input 
    }: { 
      commentId: number; 
      input: { content: string } 
    }) => {
      const { data } = await contentClient.patch(`/comments/${commentId}`, input);
      return data;
    },
    onSuccess: () => {
      // Invalidate all comments
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

/**
 * Delete a comment
 */
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: number) => {
      await contentClient.delete(`/comments/${commentId}`);
      return commentId;
    },
    onSuccess: () => {
      // Invalidate all comments
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
}

/**
 * Increment view count
 */
export function useIncrementViews() {
  return useMutation({
    mutationFn: async (contentId: number) => {
      const { data } = await contentClient.post(`/content/${contentId}/view`);
      return data;
    },
  });
}
