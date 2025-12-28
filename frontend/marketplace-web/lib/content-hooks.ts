/**
 * Content Service React Hooks
 * Custom hooks for interacting with the content service
 */

import { useCallback, useEffect, useState } from 'react';
import {
    analyticsApi,
    categoriesApi,
    commentsApi,
    contentApi,
    searchApi,
    tagsApi,
} from './content-api';
import type {
    Category,
    CategoryWithChildren,
    CommentWithReplies,
    ContentFilters,
    ContentWithRelations,
    PaginationMeta,
    SearchParams,
    Tag,
} from './content-types';

// ============================================================================
// Content Hooks
// ============================================================================

/**
 * Hook for fetching paginated content list
 */
export function useContentList(filters: ContentFilters = {}) {
  const [content, setContent] = useState<ContentWithRelations[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const result = await contentApi.getAll(filters);
      setContent(result.data);
      setMeta(result.meta);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch content'));
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return { content, meta, loading, error, refetch: fetchContent };
}

/**
 * Hook for fetching single content by slug
 */
export function useContent(slug: string) {
  const [content, setContent] = useState<ContentWithRelations | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchContent = async () => {
      try {
        setLoading(true);
        const result = await contentApi.getBySlug(slug);
        setContent(result);
        setError(null);
        // Track view
        analyticsApi.trackView(result.id).catch(() => {});
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Content not found'));
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [slug]);

  return { content, loading, error };
}

/**
 * Hook for fetching featured content
 */
export function useFeaturedContent(limit = 5) {
  const [content, setContent] = useState<ContentWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const result = await contentApi.getFeatured(limit);
        setContent(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch featured content'));
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [limit]);

  return { content, loading, error };
}

/**
 * Hook for fetching trending content
 */
export function useTrendingContent(limit = 10) {
  const [content, setContent] = useState<ContentWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const result = await contentApi.getTrending(limit);
        setContent(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch trending content'));
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [limit]);

  return { content, loading, error };
}

/**
 * Hook for content like functionality
 */
export function useContentLike(contentId: string, initialLiked = false) {
  const [liked, setLiked] = useState(initialLiked);
  const [loading, setLoading] = useState(false);

  const toggleLike = useCallback(async () => {
    try {
      setLoading(true);
      const result = await analyticsApi.toggleLike(contentId);
      setLiked(result.liked);
    } catch (err) {
      console.error('Failed to toggle like:', err);
    } finally {
      setLoading(false);
    }
  }, [contentId]);

  return { liked, loading, toggleLike };
}

// ============================================================================
// Category Hooks
// ============================================================================

/**
 * Hook for fetching all categories
 */
export function useCategories(activeOnly = true) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const result = await categoriesApi.getAll(activeOnly);
        setCategories(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [activeOnly]);

  return { categories, loading, error };
}

/**
 * Hook for fetching category tree
 */
export function useCategoryTree() {
  const [tree, setTree] = useState<CategoryWithChildren[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        setLoading(true);
        const result = await categoriesApi.getTree();
        setTree(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch category tree'));
      } finally {
        setLoading(false);
      }
    };

    fetchTree();
  }, []);

  return { tree, loading, error };
}

// ============================================================================
// Tag Hooks
// ============================================================================

/**
 * Hook for fetching all tags
 */
export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const result = await tagsApi.getAll();
        setTags(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch tags'));
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  return { tags, loading, error };
}

/**
 * Hook for fetching popular tags
 */
export function usePopularTags(limit = 10) {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const result = await tagsApi.getPopular(limit);
        setTags(result);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch popular tags'));
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, [limit]);

  return { tags, loading, error };
}

// ============================================================================
// Comment Hooks
// ============================================================================

/**
 * Hook for fetching comments for content
 */
export function useComments(contentId: string) {
  const [comments, setComments] = useState<CommentWithReplies[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchComments = useCallback(async () => {
    if (!contentId) return;
    
    try {
      setLoading(true);
      const result = await commentsApi.getByContent(contentId);
      setComments(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch comments'));
    } finally {
      setLoading(false);
    }
  }, [contentId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = useCallback(async (body: string, parentId?: string) => {
    try {
      await commentsApi.create({
        contentId,
        body,
        parentId,
      });
      await fetchComments();
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to add comment');
    }
  }, [contentId, fetchComments]);

  return { comments, loading, error, addComment, refetch: fetchComments };
}

// ============================================================================
// Search Hooks
// ============================================================================

/**
 * Hook for content search
 */
export function useSearch(params: SearchParams) {
  const [results, setResults] = useState<ContentWithRelations[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!params.query || params.query.length < 2) {
      setResults([]);
      setMeta(null);
      return;
    }

    const searchContent = async () => {
      try {
        setLoading(true);
        const result = await searchApi.search(params);
        setResults(result.data);
        setMeta(result.meta);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Search failed'));
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchContent, 300);
    return () => clearTimeout(debounceTimer);
  }, [JSON.stringify(params)]);

  return { results, meta, loading, error };
}

/**
 * Hook for search suggestions
 */
export function useSearchSuggestions(query: string) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        setLoading(true);
        const result = await searchApi.suggest(query);
        setSuggestions(result);
      } catch {
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 150);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  return { suggestions, loading };
}

// ============================================================================
// Infinite Scroll Hook
// ============================================================================

/**
 * Hook for infinite scrolling content
 */
export function useInfiniteContent(filters: Omit<ContentFilters, 'page'>) {
  const [content, setContent] = useState<ContentWithRelations[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContent = useCallback(async (pageNum: number, reset = false) => {
    try {
      setLoading(true);
      const result = await contentApi.getAll({ ...filters, page: pageNum });
      
      if (reset) {
        setContent(result.data);
      } else {
        setContent(prev => [...prev, ...result.data]);
      }
      
      setHasMore(result.meta.hasNextPage);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch content'));
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    setPage(1);
    fetchContent(1, true);
  }, [fetchContent]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchContent(nextPage);
    }
  }, [loading, hasMore, page, fetchContent]);

  return { content, loading, error, hasMore, loadMore };
}
